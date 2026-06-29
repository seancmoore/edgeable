// Backfill referral codes for existing users.
//
// Every user needs a unique `referralCode` (and a matching referralCodes/{CODE}
// lookup doc). New signups generate one automatically; this script assigns one
// to any pre-existing user that doesn't have one yet. Idempotent — safe to
// re-run; users that already have a code are skipped.
//
// USAGE:
//   node scripts/backfill-referral-codes.js          (dry run — reports only)
//   node scripts/backfill-referral-codes.js --apply  (writes the codes)
//
// SETUP: needs service-account.json in the project root.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const SERVICE_ACCOUNT_PATH = resolve(process.cwd(), 'service-account.json');
if (!existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error(`Missing service-account.json at ${SERVICE_ACCOUNT_PATH}`);
  process.exit(1);
}
initializeApp({ credential: cert(JSON.parse(readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'))) });

const db = getFirestore();
const APPLY = process.argv.includes('--apply');

// Same unambiguous alphabet as the client (src/utils/referrals.js).
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function generateCode(len = 6) {
  let out = '';
  for (let i = 0; i < len; i++) out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  return out;
}

// Generate a code not already taken in referralCodes (within this run + db).
async function uniqueCode(taken) {
  for (let i = 0; i < 10; i++) {
    const code = generateCode();
    if (taken.has(code)) continue;
    const snap = await db.collection('referralCodes').doc(code).get();
    if (!snap.exists) { taken.add(code); return code; }
  }
  throw new Error('Could not find a free referral code after 10 tries.');
}

async function main() {
  const usersSnap = await db.collection('users').get();
  const taken = new Set();
  let assigned = 0;
  let skipped = 0;

  for (const docSnap of usersSnap.docs) {
    const data = docSnap.data();
    if (data.referralCode) { taken.add(data.referralCode); skipped++; continue; }

    const code = await uniqueCode(taken);
    const label = data.telegramUsername ? `@${data.telegramUsername}` : (data.email || docSnap.id);
    if (APPLY) {
      const batch = db.batch();
      batch.set(db.collection('referralCodes').doc(code), { uid: docSnap.id });
      batch.set(docSnap.ref, { referralCode: code, referralCount: data.referralCount || 0 }, { merge: true });
      await batch.commit();
    }
    console.log(`${APPLY ? '✓ assigned' : 'would assign'} ${code} → ${label}`);
    assigned++;
  }

  console.log(`\n${APPLY ? 'Done' : 'Dry run'}: ${assigned} to assign, ${skipped} already had a code.`);
  if (!APPLY && assigned > 0) console.log('Re-run with --apply to write them.');
}

main().catch((e) => {
  console.error('\nFAILED:', e);
  process.exit(1);
});
