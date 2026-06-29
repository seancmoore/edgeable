import {
  collection, doc, getDoc, getDocs, query, where, orderBy, limit,
  writeBatch, runTransaction, updateDoc, increment, Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase.js';
import { applyLength } from './dateMath.js';
import { toDate } from './subscription.js';

// Unambiguous alphabet (no 0/O/1/I/L) so codes are easy to read and type aloud.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const BONUS_LENGTH = { years: 0, months: 0, weeks: 2 };

// Cryptographically-random referral code (browser crypto, not Math.random).
export function generateReferralCode(len = 6) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  let out = '';
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length];
  return out;
}

export function normalizeReferralCode(input) {
  return String(input || '').trim().toUpperCase();
}

// Shareable signup link for a code.
export function referralLink(code) {
  return `https://edgeabled.web.app/signup?ref=${encodeURIComponent(code)}`;
}

// Credit a subscriber +2 weeks as a real ($0, no-proof) transaction so the
// subscription chain stays consistent under replaySubscriberChain. Mirrors the
// extend math in createTransaction. Deliberately does NOT trigger referral
// logic itself (no cascade). Admin session required (transactions are isAdmin-write).
// Newest transaction timestamp (ms) for a subscriber, or 0 if none.
async function latestTxnTimeMs(subscriberUid) {
  const q = query(
    collection(db, 'transactions'),
    where('subscriberUid', '==', subscriberUid),
    orderBy('createdAt', 'desc'),
    limit(1),
  );
  const snap = await getDocs(q);
  if (snap.empty) return 0;
  const ts = snap.docs[0].data().createdAt;
  return ts?.toDate ? ts.toDate().getTime() : 0;
}

async function writeBonusTransaction(subscriberUid, admin) {
  const userRef = doc(db, 'users', subscriberUid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;
  const userData = userSnap.data();

  const today = new Date();
  const currentEnd = toDate(userData.subscriptionEnd);
  const extendFrom = (currentEnd && currentEnd > today) ? currentEnd : today;
  const newEnd = applyLength(extendFrom, BONUS_LENGTH);

  // Stamp the bonus strictly AFTER the subscriber's latest transaction so
  // replaySubscriberChain (which orders by createdAt) always sequences it last
  // and the recomputed end date is deterministic — even if the triggering
  // transaction was created in the same millisecond.
  const createdAtMs = Math.max(Date.now(), (await latestTxnTimeMs(subscriberUid)) + 1);
  const createdAt = new Date(createdAtMs);

  const txnRef = doc(collection(db, 'transactions'));
  const batch = writeBatch(db);
  batch.set(txnRef, {
    subscriberUid,
    subscriberDisplayName: userData.displayName || '',
    subscriberEmail: userData.email || '',
    price: 0,
    length: BONUS_LENGTH,
    type: 'referral_bonus',
    notes: 'Referral bonus (+2 weeks)',
    proofImageUrl: '',
    proofImagePath: '',
    extendedFrom: Timestamp.fromDate(extendFrom),
    extendedTo: Timestamp.fromDate(newEnd),
    createdAt: Timestamp.fromDate(createdAt),
    createdBy: admin?.uid || 'system',
    createdByEmail: admin?.email || '',
  });
  const userUpdates = { subscriptionEnd: Timestamp.fromDate(newEnd), status: 'active' };
  if (!userData.subscriptionStart) userUpdates.subscriptionStart = Timestamp.fromDate(today);
  batch.update(userRef, userUpdates);
  await batch.commit();
}

// Apply the referral bonuses for a just-approved subscriber, exactly once.
// Called (wrapped in try/catch) right after a normal transaction is created for
// them. The `referralBonusApplied` flag is set via a compare-and-set transaction
// so it can never double-award. A missing/deleted referrer is skipped.
export async function maybeApplyReferralBonus(referredUid, admin) {
  let referrerUid = '';

  // Claim the bonus atomically: only the writer that flips the flag from
  // false->true proceeds.
  const claimed = await runTransaction(db, async (txn) => {
    const ref = doc(db, 'users', referredUid);
    const snap = await txn.get(ref);
    if (!snap.exists()) return false;
    const d = snap.data();
    if (!d.referredByUid || d.referralBonusApplied) return false;
    referrerUid = d.referredByUid;
    txn.update(ref, { referralBonusApplied: true });
    return true;
  });
  if (!claimed) return;

  // Referred user's reward.
  await writeBonusTransaction(referredUid, admin);

  // Referrer's reward (granted regardless of their current state) + count.
  if (referrerUid && referrerUid !== referredUid) {
    const referrerRef = doc(db, 'users', referrerUid);
    const referrerSnap = await getDoc(referrerRef);
    if (referrerSnap.exists()) {
      await writeBonusTransaction(referrerUid, admin);
      await updateDoc(referrerRef, { referralCount: increment(1) });
    }
  }
}
