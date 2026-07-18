// Live integrity + access-tier verification for the pick record
// (`picks` + `picksPublic`). Runs against production Firestore with client
// credentials. Every write is expected to FAIL, so a passing run writes
// nothing and leaves no trace on the public record. The only allowed
// operations are reads that prove each tier sees exactly what it should.
//
// Pure REST (no firebase SDK): the web API key is HTTP-referrer restricted and
// fetch() strips the Referer header (forbidden per spec), so we use https
// requests with an explicit Referer. App Check is enforced on Auth, so a
// legitimate App Check token is minted via the Admin SDK (service-account.json).
//
// Usage: node scripts/verify-picks-rules.mjs <admin-pw> <inactive-user-pw> <active-sub-pw> [pickIdForEditTests]
//   admin:        edgeable.administration@gmail.com (the pinned owner UID)
//   inactive:     test@gmail.com (Tester2, status inactive)
//   active sub:   tg_tester@edgeable.local (tester, status active, end 2028)
//   pickIdForEditTests: optional id of a REAL posted pick; edit/grade/delete
//     attempts against it (and its stub) are expected to be denied.

import https from 'node:https';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const [adminPw, inactivePw, activePw, pickId] = process.argv.slice(2);
if (!adminPw || !inactivePw || !activePw) {
  console.error('Usage: node scripts/verify-picks-rules.mjs <admin-pw> <inactive-user-pw> <active-sub-pw> [pickId]');
  process.exit(2);
}

const KEY = 'AIzaSyDD48IX4lTVr_6NjcnD-Aj_GY6ewqAdU_k';
const REFERER = 'https://edgeabled.web.app/';
const DB = 'projects/edgeabled/databases/(default)';
const FS = `https://firestore.googleapis.com/v1/${DB}/documents`;
const COMMIT = `https://firestore.googleapis.com/v1/${DB}/documents:commit?key=${KEY}`;

import { mintAppCheckToken } from './_appcheck.mjs';
let appCheckToken = '';

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

// Stub = timestamps + result ONLY (no sport/odds/stake in public data).
// postedAt omitted — added per-test as transform or concrete value.
const stubFields = () => ({
  gameStartTime: T(future()),
  status: S('pending'),
  gradedAt: NUL,
});
const pickFields = () => ({
  ...stubFields(),
  sport: S('TEST'),
  description: S('Integrity probe — should never exist'),
  odds: I(-110),
  stakeUnits: D(1),
  access: S('subscribers'),
});

// A single create write; server postedAt via transform unless a concrete
// postedAt is already present in fields.
function createWrite(path, fields) {
  const w = { update: { name: `${DB}/documents/${path}`, fields }, currentDocument: { exists: false } };
  if (!fields.postedAt) w.updateTransforms = [{ fieldPath: 'postedAt', setToServerValue: 'REQUEST_TIME' }];
  return w;
}
// Paired pick+stub batch (the legitimate shape, mutated per-test)
function pairedWrites(id, pickMut = {}, stubMut = {}) {
  return [
    createWrite(`picks/${id}`, { ...pickFields(), ...pickMut }),
    createWrite(`picksPublic/${id}`, { ...stubFields(), ...stubMut }),
  ];
}
const commit = (writes, token) => req('POST', COMMIT, { writes }, token);

function patch(collectionId, id, fields, token) {
  const mask = Object.keys(fields).map((f) => `updateMask.fieldPaths=${f}`).join('&');
  return req('PATCH', `${FS}/${collectionId}/${id}?${mask}&key=${KEY}`, { fields }, token);
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

appCheckToken = await mintAppCheckToken();
const probeId = pickId || 'nonexistent-probe';

console.log('\n[signed out]');
await expectAllowed('read public stubs (the record)', req('GET', `${FS}/picksPublic?pageSize=5&key=${KEY}`));
await expectDenied('list full picks (details are gated)', req('GET', `${FS}/picks?pageSize=5&key=${KEY}`));
await expectDenied('create paired pick+stub', commit(pairedWrites(randId())));
await expectDenied('delete pick', req('DELETE', `${FS}/picks/${probeId}?key=${KEY}`));

console.log('\n[inactive user: test@gmail.com]');
const inactiveToken = await signIn('test@gmail.com', inactivePw);
await expectDenied('list full picks (not an active sub)', req('GET', `${FS}/picks?pageSize=5&key=${KEY}`, null, inactiveToken));
await expectDenied('create paired pick+stub', commit(pairedWrites(randId()), inactiveToken));
await expectDenied('grade pick', patch('picks', probeId, { status: S('win'), gradedAt: T(new Date()) }, inactiveToken));
await expectDenied('delete pick', req('DELETE', `${FS}/picks/${probeId}?key=${KEY}`, null, inactiveToken));

console.log('\n[active subscriber: tester]');
const activeToken = await signIn('tg_tester@edgeable.local', activePw);
await expectAllowed('list full picks (subscriber gate opens)', req('GET', `${FS}/picks?pageSize=5&key=${KEY}`, null, activeToken));
await expectDenied('create paired pick+stub (read-only tier)', commit(pairedWrites(randId()), activeToken));
await expectDenied('delete pick', req('DELETE', `${FS}/picks/${probeId}?key=${KEY}`, null, activeToken));

console.log('\n[admin: edgeable.administration@gmail.com]');
const adminToken = await signIn('edgeable.administration@gmail.com', adminPw);
await expectAllowed('list full picks (owner)', req('GET', `${FS}/picks?pageSize=5&key=${KEY}`, null, adminToken));
await expectDenied('create pick WITHOUT its public stub', commit([createWrite(`picks/${randId()}`, pickFields())], adminToken));
await expectDenied('create stub WITHOUT its pick', commit([createWrite(`picksPublic/${randId()}`, stubFields())], adminToken));
await expectDenied('paired create, stub gameStartTime mismatch', commit(pairedWrites(randId(), {}, { gameStartTime: T(new Date(Date.now() + 12 * 3600 * 1000)) }), adminToken));
await expectDenied('paired create, odds leaked onto public stub', commit(pairedWrites(randId(), {}, { odds: I(-110) }), adminToken));
await expectDenied('paired create, stake leaked onto public stub', commit(pairedWrites(randId(), {}, { stakeUnits: D(1) }), adminToken));
await expectDenied('paired create, sport leaked onto public stub', commit(pairedWrites(randId(), {}, { sport: S('NBA') }), adminToken));
await expectDenied('paired create, client-supplied postedAt', commit(pairedWrites(randId(), { postedAt: T(new Date()) }, { postedAt: T(new Date()) }), adminToken));
await expectDenied('paired create, backdated gameStartTime', commit(pairedWrites(randId(), { gameStartTime: T(past()) }, { gameStartTime: T(past()) }), adminToken));
await expectDenied('paired create, pre-graded (status win)', commit(pairedWrites(randId(), { status: S('win'), gradedAt: T(new Date()) }, { status: S('win'), gradedAt: T(new Date()) }), adminToken));
await expectDenied('paired create, extra field on pick', commit(pairedWrites(randId(), { secretNote: S('x') }), adminToken));
await expectDenied('paired create, invalid access value', commit(pairedWrites(randId(), { access: S('vip') }), adminToken));
await expectDenied('paired create, description on public stub', commit(pairedWrites(randId(), {}, { description: S('leak') }), adminToken));
await expectDenied('delete pick (even as admin)', req('DELETE', `${FS}/picks/${probeId}?key=${KEY}`, null, adminToken));
await expectDenied('delete stub (even as admin)', req('DELETE', `${FS}/picksPublic/${probeId}?key=${KEY}`, null, adminToken));
if (pickId) {
  await expectDenied('edit description of posted pick', patch('picks', pickId, { description: S('tampered') }, adminToken));
  await expectDenied('edit odds of posted stub', patch('picksPublic', pickId, { odds: I(500) }, adminToken));
  await expectDenied('backdate postedAt of posted pick', patch('picks', pickId, { postedAt: T(past()) }, adminToken));
  await expectDenied('grade pick without grading its stub', patch('picks', pickId, { status: S('win'), gradedAt: T(new Date()) }, adminToken));
} else {
  console.log('  … no pickId supplied — edit-after-post tests deferred until a real pick exists.');
}

console.log(`\n${pass} passed, ${fail} failed${pickId ? '' : ' (edit-after-post tests deferred)'}`);
process.exit(fail === 0 ? 0 : 1);
