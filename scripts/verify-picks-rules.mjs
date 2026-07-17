// Live integrity-rule verification for the public `picks` collection.
// Runs DENIAL tests against production Firestore with client credentials —
// every write here is expected to FAIL with PERMISSION_DENIED, so a passing
// run writes nothing and leaves no trace on the public record.
//
// Pure REST (no firebase SDK): the web API key is HTTP-referrer restricted and
// fetch() strips the Referer header (forbidden per spec), so we use https
// requests with an explicit Referer — same approach as the CLAUDE.md runbook.
//
// Usage: node scripts/verify-picks-rules.mjs <admin-password> <nonadmin-password> [pickIdForEditTests]
//   admin account:    edgeable.administration@gmail.com (the pinned owner UID)
//   nonadmin account: test@gmail.com (Tester2)
//   pickIdForEditTests: optional id of a REAL posted pick; edit/delete attempts
//     against it are expected to be denied and leave it untouched.

import https from 'node:https';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const [adminPw, userPw, pickId] = process.argv.slice(2);
if (!adminPw || !userPw) {
  console.error('Usage: node scripts/verify-picks-rules.mjs <admin-password> <nonadmin-password> [pickId]');
  process.exit(2);
}

const KEY = 'AIzaSyDD48IX4lTVr_6NjcnD-Aj_GY6ewqAdU_k';
const REFERER = 'https://edgeabled.web.app/';
const DB = 'projects/edgeabled/databases/(default)';
const FS = `https://firestore.googleapis.com/v1/${DB}/documents`;

// App Check is ENFORCED on Auth (and healthy — the real app validates), so a
// bare REST sign-in gets 401. Mint a legitimate App Check token via the Admin
// SDK (needs service-account.json) and attach it to Auth calls.
let appCheckToken = '';
async function mintAppCheckToken() {
  const { initializeApp, cert } = require('firebase-admin/app');
  const { getAppCheck } = require('firebase-admin/app-check');
  const app = initializeApp({ credential: cert(require('../service-account.json')) });
  const { token } = await getAppCheck(app).createToken('1:395134187819:web:45bbe2c5710025d85f6d6e');
  appCheckToken = token;
}

function req(method, url, body, token) {
  return new Promise((resolve, reject) => {
    const headers = { 'Content-Type': 'application/json', Referer: REFERER };
    if (appCheckToken) headers['X-Firebase-AppCheck'] = appCheckToken;
    if (token) headers.Authorization = `Bearer ${token}`;
    const r = https.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

async function signIn(email, password) {
  const { status, body } = await req(
    'POST',
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`,
    { email, password, returnSecureToken: true }
  );
  if (status !== 200) throw new Error(`Sign-in failed for ${email}: ${status} ${body.slice(0, 200)}`);
  return JSON.parse(body).idToken;
}

// Firestore REST value encoding
const S = (v) => ({ stringValue: v });
const I = (v) => ({ integerValue: String(v) });
const D = (v) => ({ doubleValue: v });
const T = (d) => ({ timestampValue: d.toISOString() });
const NUL = { nullValue: null };

const future = () => new Date(Date.now() + 6 * 3600 * 1000);
const past = () => new Date(Date.now() - 6 * 3600 * 1000);
const randId = () => Array.from({ length: 20 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');

// Base pick fields WITHOUT postedAt (added per-test: concrete vs serverTimestamp)
const baseFields = () => ({
  sport: S('TEST'),
  description: S('Integrity probe — should never exist'),
  odds: I(-110),
  stakeUnits: D(1),
  gameStartTime: T(future()),
  status: S('pending'),
  gradedAt: NUL,
});

// Create via commit so postedAt can be a true server transform (REQUEST_TIME).
function commitCreate(fields, extraTransforms, token) {
  return req('POST', `https://firestore.googleapis.com/v1/${DB}/documents:commit?key=${KEY}`, {
    writes: [{
      update: { name: `${DB}/documents/picks/${randId()}`, fields },
      updateTransforms: [{ fieldPath: 'postedAt', setToServerValue: 'REQUEST_TIME' }, ...(extraTransforms || [])],
      currentDocument: { exists: false },
    }],
  }, token);
}

function patch(id, fields, token) {
  const mask = Object.keys(fields).map((f) => `updateMask.fieldPaths=${f}`).join('&');
  return req('PATCH', `${FS}/picks/${id}?${mask}&key=${KEY}`, { fields }, token);
}

let pass = 0, fail = 0;
async function expectDenied(name, p) {
  const { status, body } = await p;
  if (status === 403 || status === 400 || status === 401) {
    pass++; console.log(`  ✓ pass  ${name} — denied (${status})`);
  } else {
    fail++; console.log(`  ✗ FAIL  ${name} — got ${status} (expected denial): ${body.slice(0, 200)}`);
  }
}
async function expectAllowed(name, p) {
  const { status, body } = await p;
  if (status === 200) { pass++; console.log(`  ✓ pass  ${name} — allowed`); }
  else { fail++; console.log(`  ✗ FAIL  ${name} — got ${status}: ${body.slice(0, 200)}`); }
}

await mintAppCheckToken();
const probeId = pickId || 'nonexistent-probe';

console.log('\n[signed out]');
await expectAllowed('public read of picks', req('GET', `${FS}/picks?pageSize=1&key=${KEY}`));
await expectDenied('create pick', req('POST', `${FS}/picks?key=${KEY}`, { fields: { ...baseFields(), postedAt: T(new Date()) } }));
await expectDenied('delete pick', req('DELETE', `${FS}/picks/${probeId}?key=${KEY}`));

console.log('\n[non-admin: test@gmail.com]');
const userToken = await signIn('test@gmail.com', userPw);
await expectDenied('create pick', req('POST', `${FS}/picks?key=${KEY}`, { fields: { ...baseFields(), postedAt: T(new Date()) } }, userToken));
await expectDenied('create pick (server postedAt)', commitCreate(baseFields(), null, userToken));
await expectDenied('grade pick', patch(probeId, { status: S('win'), gradedAt: T(new Date()) }, userToken));
await expectDenied('delete pick', req('DELETE', `${FS}/picks/${probeId}?key=${KEY}`, null, userToken));

console.log('\n[admin: edgeable.administration@gmail.com]');
const adminToken = await signIn('edgeable.administration@gmail.com', adminPw);
await expectDenied('create with client-supplied postedAt', req('POST', `${FS}/picks?key=${KEY}`, { fields: { ...baseFields(), postedAt: T(new Date()) } }, adminToken));
await expectDenied('create with backdated gameStartTime', commitCreate({ ...baseFields(), gameStartTime: T(past()) }, null, adminToken));
await expectDenied('create pre-graded (status win)', commitCreate({ ...baseFields(), status: S('win'), gradedAt: T(new Date()) }, null, adminToken));
await expectDenied('create with extra field', commitCreate({ ...baseFields(), secretNote: S('x') }, null, adminToken));
await expectDenied('delete pick (even as admin)', req('DELETE', `${FS}/picks/${probeId}?key=${KEY}`, null, adminToken));
if (pickId) {
  await expectDenied('edit description of posted pick', patch(pickId, { description: S('tampered') }, adminToken));
  await expectDenied('edit odds of posted pick', patch(pickId, { odds: I(500) }, adminToken));
  await expectDenied('backdate postedAt of posted pick', patch(pickId, { postedAt: T(past()) }, adminToken));
  await expectDenied('grade with client-supplied gradedAt', patch(pickId, { status: S('win'), gradedAt: T(past()) }, adminToken));
} else {
  console.log('  … no pickId supplied — edit-after-post tests deferred until a real pick exists.');
}

console.log(`\n${pass} passed, ${fail} failed${pickId ? '' : ' (edit-after-post tests deferred)'}`);
process.exit(fail === 0 ? 0 : 1);
