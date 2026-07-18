// Post or grade daily-card picks through the RULES-ENFORCED client path.
// This is the same integrity contract as the admin page: server postedAt,
// paired pick+stub in one atomic commit, one-way grading, no deletes.
// It signs in as the admin over REST (never the Admin SDK), so every write
// is validated by the deployed Firestore security rules.
//
// Intended caller: a Claude Code session on this machine (incl. Remote
// Control from the Claude mobile app). HUMAN REVIEW IS MANDATORY — the
// session must show Sean the parsed rows and get an explicit "post it"
// before running this. Never auto-post.
//
// Usage:
//   node scripts/post-card.mjs post <card.json> [--dry-run]
//   node scripts/post-card.mjs grade <pickId> <win|loss|push|void>
//   node scripts/post-card.mjs pending          (list ungraded picks)
//
// card.json: [{ "sport": "NBA", "description": "Knicks -3.5", "odds": -110,
//               "stakeUnits": 1, "gameStartTime": "2026-07-18T19:10:00-04:00",
//               "access": "subscribers" | "public" }, ...]
//
// Auth: password from EDGEABLE_ADMIN_PASSWORD env var, else --pw <password>.
// App Check + referrer workarounds are the same as verify-picks-rules.mjs.

import https from 'node:https';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const KEY = 'AIzaSyDD48IX4lTVr_6NjcnD-Aj_GY6ewqAdU_k';
const REFERER = 'https://edgeabled.web.app/';
const DB = 'projects/edgeabled/databases/(default)';
const COMMIT = `https://firestore.googleapis.com/v1/${DB}/documents:commit?key=${KEY}`;
const ADMIN_EMAIL = 'edgeable.administration@gmail.com';
const FINAL_STATUSES = ['win', 'loss', 'push', 'void'];

const argv = process.argv.slice(2);
const dryRun = argv.includes('--dry-run');
const pwFlag = argv.indexOf('--pw');
const password = pwFlag !== -1 ? argv[pwFlag + 1] : process.env.EDGEABLE_ADMIN_PASSWORD;
const args = argv.filter((a, i) => a !== '--dry-run' && a !== '--pw' && i !== pwFlag + 1);
const [command, ...rest] = args;

if (!command || !['post', 'grade', 'pending'].includes(command)) {
  console.error('Usage: post <card.json> [--dry-run] | grade <pickId> <status> | pending');
  process.exit(2);
}
if (!password) {
  console.error('Admin password required: set EDGEABLE_ADMIN_PASSWORD or pass --pw <password>.');
  process.exit(2);
}

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

async function signIn() {
  const { status, body } = await req(
    'POST',
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${KEY}`,
    { email: ADMIN_EMAIL, password, returnSecureToken: true }
  );
  if (status !== 200) throw new Error(`Admin sign-in failed: ${status} ${body.slice(0, 200)}`);
  return JSON.parse(body).idToken;
}

const S = (v) => ({ stringValue: v });
const I = (v) => ({ integerValue: String(v) });
const D = (v) => ({ doubleValue: v });
const T = (d) => ({ timestampValue: d.toISOString() });
const NUL = { nullValue: null };
const randId = () => Array.from({ length: 20 }, () => 'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]).join('');

function validateRow(p, i) {
  const o = Math.trunc(Number(p.odds));
  const u = Number(p.stakeUnits);
  const start = new Date(p.gameStartTime);
  const access = p.access || 'subscribers';
  const err = (m) => { throw new Error(`Pick ${i + 1}: ${m}`); };
  if (!p.sport || String(p.sport).trim().length < 2) err('sport/league required');
  if (!p.description || String(p.description).trim().length < 3) err('description required');
  if (isNaN(o) || (o > -100 && o < 100)) err(`odds ${p.odds} are not valid American odds`);
  if (isNaN(u) || u <= 0 || u > 100) err(`stake ${p.stakeUnits} must be 0-100 units`);
  if (isNaN(start.getTime())) err(`bad gameStartTime "${p.gameStartTime}"`);
  if (start.getTime() <= Date.now()) err(`gameStartTime ${start.toISOString()} is in the past — rules will reject it`);
  if (!['subscribers', 'public'].includes(access)) err(`access must be subscribers|public`);
  return {
    sport: String(p.sport).trim().toUpperCase().slice(0, 20),
    description: String(p.description).trim().slice(0, 200),
    odds: o, stakeUnits: u, start, access,
  };
}

// One atomic commit per pick: full pick + public stub, postedAt = REQUEST_TIME on both.
function pairedCreate(id, v) {
  const stub = { gameStartTime: T(v.start), status: S('pending'), gradedAt: NUL };
  const serverPostedAt = [{ fieldPath: 'postedAt', setToServerValue: 'REQUEST_TIME' }];
  return {
    writes: [
      {
        update: {
          name: `${DB}/documents/picks/${id}`,
          fields: {
            ...stub,
            sport: S(v.sport), description: S(v.description),
            odds: I(v.odds), stakeUnits: D(v.stakeUnits), access: S(v.access),
          },
        },
        updateTransforms: serverPostedAt,
        currentDocument: { exists: false },
      },
      {
        update: { name: `${DB}/documents/picksPublic/${id}`, fields: stub },
        updateTransforms: serverPostedAt,
        currentDocument: { exists: false },
      },
    ],
  };
}

function gradeCommit(id, status) {
  const w = (path) => ({
    update: { name: `${DB}/documents/${path}/${id}`, fields: { status: S(status) } },
    updateMask: { fieldPaths: ['status'] },
    updateTransforms: [{ fieldPath: 'gradedAt', setToServerValue: 'REQUEST_TIME' }],
    currentDocument: { exists: true },
  });
  return { writes: [w('picks'), w('picksPublic')] };
}

appCheckToken = await mintAppCheckToken();

if (command === 'post') {
  const file = rest[0];
  if (!file) { console.error('post requires a card.json file'); process.exit(2); }
  const raw = JSON.parse(readFileSync(file, 'utf8').replace(/^﻿/, ''));
  if (!Array.isArray(raw) || raw.length === 0) { console.error('card.json must be a non-empty array'); process.exit(2); }
  const rows = raw.map(validateRow);

  console.log(`Validated ${rows.length} pick(s):`);
  rows.forEach((v, i) => console.log(`  ${i + 1}. ${v.sport} | ${v.description} @ ${v.odds > 0 ? '+' : ''}${v.odds} | ${v.stakeUnits}U | starts ${v.start.toLocaleString('en-US', { timeZone: 'America/New_York' })} ET | ${v.access}`));
  if (dryRun) { console.log('\n--dry-run: nothing posted.'); process.exit(0); }

  const token = await signIn();
  let posted = 0;
  for (const [i, v] of rows.entries()) {
    const id = randId();
    const { status, body } = await req('POST', COMMIT, pairedCreate(id, v), token);
    if (status === 200) { posted++; console.log(`  ✓ posted ${v.description} → picks/${id}`); }
    else { console.error(`  ✗ pick ${i + 1} REJECTED (${status}): ${body.slice(0, 300)}`); }
  }
  console.log(`\n${posted}/${rows.length} posted. Card page: https://edgeabled.web.app/card`);
  process.exit(posted === rows.length ? 0 : 1);
}

if (command === 'grade') {
  const [pickId, status] = rest;
  if (!pickId || !FINAL_STATUSES.includes(status)) { console.error('grade <pickId> <win|loss|push|void>'); process.exit(2); }
  const token = await signIn();
  const { status: st, body } = await req('POST', COMMIT, gradeCommit(pickId, status), token);
  if (st === 200) { console.log(`✓ graded ${pickId} as ${status.toUpperCase()} (pick + public stub, atomically)`); process.exit(0); }
  console.error(`✗ grade REJECTED (${st}): ${body.slice(0, 300)}`);
  process.exit(1);
}

if (command === 'pending') {
  const token = await signIn();
  const { status, body } = await req('POST', `https://firestore.googleapis.com/v1/${DB}/documents:runQuery?key=${KEY}`, {
    structuredQuery: {
      from: [{ collectionId: 'picks' }],
      where: { fieldFilter: { field: { fieldPath: 'status' }, op: 'EQUAL', value: { stringValue: 'pending' } } },
    },
  }, token);
  if (status !== 200) { console.error(`query failed (${status}): ${body.slice(0, 300)}`); process.exit(1); }
  const docs = JSON.parse(body).filter((r) => r.document);
  if (docs.length === 0) { console.log('No pending picks.'); process.exit(0); }
  for (const r of docs) {
    const f = r.document.fields;
    console.log(`${r.document.name.split('/').pop()} | ${f.sport?.stringValue} | ${f.description?.stringValue} @ ${f.odds?.integerValue} | ${f.stakeUnits?.doubleValue ?? f.stakeUnits?.integerValue}U`);
  }
  process.exit(0);
}
