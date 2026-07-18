// Mint a valid App Check token for Node scripts (App Check is ENFORCED on
// Auth). Primary path: exchange the registered debug token (value lives in
// gitignored .appcheck-debug-token next to the repo root, or the
// APPCHECK_DEBUG_TOKEN env var). Fallback: Admin SDK createToken via
// service-account.json (started failing 2026-07-18 with "App attestation
// failed" — kept as fallback in case the debug token is ever revoked).
// Registered in App Check as debug token "claude-code-desktop-scripts".

import https from 'node:https';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const APP_ID = '1:395134187819:web:45bbe2c5710025d85f6d6e';
const KEY = 'AIzaSyDD48IX4lTVr_6NjcnD-Aj_GY6ewqAdU_k';
const REFERER = 'https://edgeabled.web.app/';

function post(url, body) {
  return new Promise((resolve, reject) => {
    const r = https.request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Referer: REFERER },
    }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    r.on('error', reject);
    r.write(JSON.stringify(body));
    r.end();
  });
}

export async function mintAppCheckToken() {
  let debugToken = process.env.APPCHECK_DEBUG_TOKEN;
  if (!debugToken) {
    try {
      debugToken = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', '.appcheck-debug-token'), 'utf8').trim();
    } catch { /* fall through */ }
  }
  if (debugToken) {
    const { status, body } = await post(
      `https://firebaseappcheck.googleapis.com/v1/projects/edgeabled/apps/${APP_ID}:exchangeDebugToken?key=${KEY}`,
      { debugToken }
    );
    if (status === 200) return JSON.parse(body).token;
    console.error(`debug-token exchange failed (${status}), trying Admin SDK mint…`);
  }
  const { initializeApp, cert } = require('firebase-admin/app');
  const { getAppCheck } = require('firebase-admin/app-check');
  const app = initializeApp({ credential: cert(require('../service-account.json')) }, `appcheck-${Date.now()}`);
  const { token } = await getAppCheck(app).createToken(APP_ID);
  return token;
}
