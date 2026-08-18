// Creates a transactionRequests doc for the /upgrade flow.
//
// Mirrors src/utils/transactionRequests.js createTransactionRequest exactly
// (same storage path, same base fields, same status) so the existing admin
// approval flow (PendingRequests + ApproveTransactionRequestModal) keeps
// working unchanged. The upgrade flow ADDS fields (months, monthlyRate,
// discountPercent, totalDue, source) rather than renaming anything; the
// Firestore rules for transactionRequests have no hasOnly, so extras pass.
import { collection, doc, addDoc, Timestamp } from 'firebase/firestore';
import {
  ref as storageRef, uploadBytes, getDownloadURL, deleteObject,
} from 'firebase/storage';
import { db, storage } from '../../firebase.js';

function fileExtension(file) {
  const parts = (file.name || '').split('.');
  if (parts.length < 2) return 'jpg';
  return parts.pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
}

export default async function submitUpgradeRequest({
  subscriberUid, subscriberDisplayName, subscriberTelegramUsername, subscriberPhone,
  months, monthlyRate, discountPercent, total, paymentMethod, imageFile,
}) {
  if (!imageFile) throw new Error('Please attach your payment screenshot.');
  if (!Number(months) || Number(months) < 1) throw new Error('Please choose how many months.');
  if (!['cashapp', 'zelle'].includes(paymentMethod)) {
    throw new Error('Please select a payment method.');
  }

  // Pre-allocate an ID for the proof path (same pattern as the legacy modal).
  const reqId = doc(collection(db, 'transactionRequests')).id;
  const path = `transaction-proofs/requests/${reqId}.${fileExtension(imageFile)}`;
  const ref = storageRef(storage, path);
  await uploadBytes(ref, imageFile);
  const url = await getDownloadURL(ref);

  try {
    await addDoc(collection(db, 'transactionRequests'), {
      // ── existing schema (unchanged, admin flow depends on these) ──
      subscriberUid,
      subscriberDisplayName: subscriberDisplayName || '',
      subscriberTelegramUsername: subscriberTelegramUsername || '',
      subscriberPhone: subscriberPhone || '',
      length: { years: 0, months: Number(months), weeks: 0, days: 0 },
      declaredPrice: Number(total),
      paymentMethod,
      paymentReference: '',
      notes: `Upgrade flow: ${months} month${months === 1 ? '' : 's'} at $${monthlyRate}/mo`
        + (discountPercent ? ` (${discountPercent}% off)` : ''),
      proofImageUrl: url,
      proofImagePath: path,
      status: 'pending',
      createdAt: Timestamp.fromDate(new Date()),
      // ── new fields (additive, upgrade-flow only) ──
      months: Number(months),
      monthlyRate: Number(monthlyRate),
      discountPercent: Number(discountPercent) || 0,
      totalDue: Number(total),
      source: 'upgrade',
    });
  } catch (err) {
    // Don't strand the uploaded proof if the doc write fails.
    try { await deleteObject(ref); } catch { /* best effort */ }
    throw err;
  }
}
