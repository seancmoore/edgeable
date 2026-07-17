// Cloud Functions for Edgeable.
//
// applyProfileChange: admin-only callable that applies a subscriber identity
// change (email or Telegram username) that the client SDK can't do on its own,
// because it requires Admin-SDK privileges (changing the Firebase Auth account
// email) and keeping the login-lookup docs in sync.

const { onCall, HttpsError } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();
const auth = getAuth();
const db = getFirestore();

const SYNTHETIC_DOMAIN = 'edgeable.local';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[a-z0-9_]{5,32}$/;

async function assertAdmin(uid) {
  if (!uid) throw new HttpsError('unauthenticated', 'You must be signed in.');
  const snap = await db.doc(`users/${uid}`).get();
  if (!snap.exists || snap.data().role !== 'admin') {
    throw new HttpsError('permission-denied', 'Admin access required.');
  }
}

exports.applyProfileChange = onCall({ enforceAppCheck: true, maxInstances: 5 }, async (request) => {
  await assertAdmin(request.auth && request.auth.uid);

  const { uid, field, value } = request.data || {};
  if (!uid || !field) throw new HttpsError('invalid-argument', 'Missing uid or field.');
  // Firebase UIDs are short alphanumerics — reject anything else to keep it out of doc paths.
  if (typeof uid !== 'string' || !/^[A-Za-z0-9]{1,128}$/.test(uid)) {
    throw new HttpsError('invalid-argument', 'Invalid user id.');
  }

  const userRef = db.doc(`users/${uid}`);
  const userSnap = await userRef.get();
  if (!userSnap.exists) throw new HttpsError('not-found', 'Subscriber not found.');
  const user = userSnap.data();

  if (field === 'email') {
    const email = String(value || '').trim().toLowerCase();
    if (!EMAIL_RE.test(email)) throw new HttpsError('invalid-argument', 'Invalid email address.');
    try {
      await auth.updateUser(uid, { email, emailVerified: false });
    } catch (e) {
      if (e.code === 'auth/email-already-exists') {
        throw new HttpsError('already-exists', 'That email is already in use by another account.');
      }
      throw e;
    }
    await userRef.set({ email, authEmail: email }, { merge: true });
    if (user.telegramUsername) {
      await db.doc(`usernames/${user.telegramUsername}`).set({ uid, authEmail: email }, { merge: true });
    }
    if (user.phone) {
      await db.doc(`phones/${user.phone}`).set({ uid, authEmail: email }, { merge: true });
    }
    return { ok: true, field, value: email };
  }

  if (field === 'telegramUsername') {
    const uname = String(value || '').replace(/^@+/, '').toLowerCase();
    if (!USERNAME_RE.test(uname)) {
      throw new HttpsError('invalid-argument', 'Username must be 5-32 chars: letters, digits, or underscore.');
    }
    const newRef = db.doc(`usernames/${uname}`);
    const newSnap = await newRef.get();
    if (newSnap.exists && newSnap.data().uid !== uid) {
      throw new HttpsError('already-exists', 'That Telegram username is already taken.');
    }

    // Source of truth for the current login email is the Auth account itself.
    const authUser = await auth.getUser(uid);
    let authEmail = authUser.email || '';
    // Legacy accounts use a synthetic email derived from the username — regenerate it.
    if (/@edgeable\.local$/i.test(authEmail)) {
      authEmail = `tg_${uname}@${SYNTHETIC_DOMAIN}`;
      await auth.updateUser(uid, { email: authEmail });
    }

    const oldUname = user.telegramUsername || '';
    await newRef.set({ uid, authEmail }, { merge: true });
    if (oldUname && oldUname !== uname) {
      await db.doc(`usernames/${oldUname}`).delete().catch(() => {});
    }
    const updates = { telegramUsername: uname };
    if (authEmail) updates.authEmail = authEmail;
    await userRef.set(updates, { merge: true });
    if (user.phone && authEmail) {
      await db.doc(`phones/${user.phone}`).set({ uid, authEmail }, { merge: true });
    }
    return { ok: true, field, value: uname };
  }

  throw new HttpsError('invalid-argument', `Unsupported field: ${field}`);
});

// Admin-only: fully delete a subscriber account. Removes the Auth user, the
// users doc, the username/phone login lookups, and their pending requests +
// account events. Transactions are intentionally KEPT as financial records.
exports.deleteSubscriber = onCall({ enforceAppCheck: true, maxInstances: 5 }, async (request) => {
  await assertAdmin(request.auth && request.auth.uid);

  const { uid } = request.data || {};
  if (typeof uid !== 'string' || !/^[A-Za-z0-9]{1,128}$/.test(uid)) {
    throw new HttpsError('invalid-argument', 'Invalid user id.');
  }
  if (request.auth.uid === uid) {
    throw new HttpsError('failed-precondition', "You can't delete your own account.");
  }

  const userRef = db.doc(`users/${uid}`);
  const userSnap = await userRef.get();
  const user = userSnap.exists ? userSnap.data() : null;
  if (user && user.role === 'admin') {
    throw new HttpsError('failed-precondition', 'Admin accounts cannot be deleted here.');
  }

  // Remove login lookups
  if (user && user.telegramUsername) {
    await db.doc(`usernames/${user.telegramUsername}`).delete().catch(() => {});
  }
  if (user && user.phone) {
    await db.doc(`phones/${user.phone}`).delete().catch(() => {});
  }

  // Cascade-delete the subscriber's requests and audit events (in batches).
  for (const coll of ['transactionRequests', 'profileChangeRequests', 'accountEvents']) {
    const snap = await db.collection(coll).where('subscriberUid', '==', uid).get();
    for (let i = 0; i < snap.docs.length; i += 400) {
      const batch = db.batch();
      snap.docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
  }

  await userRef.delete().catch(() => {});

  // Finally remove the Auth account.
  await getAuth().deleteUser(uid).catch((e) => {
    if (e.code !== 'auth/user-not-found') throw e;
  });

  return { ok: true };
});

// ── parsePicksImage ─────────────────────────────────────────────────────────
// Admin-only: parse an Action Network betslip/picks screenshot into structured
// pick candidates using Claude vision. The client NEVER writes what this
// returns directly — it feeds a review screen, and only admin-confirmed rows
// are written to Firestore (through the same path as manual entry).
//
// Secret setup (one-time):
//   firebase functions:secrets:set ANTHROPIC_API_KEY
// NOTE: enforceAppCheck is intentionally OFF — App Check is unenforced
// project-wide since the 2026-06-30 outage (invalid reCAPTCHA key).
const anthropicApiKey = defineSecret('ANTHROPIC_API_KEY');

const PARSE_MODEL = 'claude-sonnet-4-6';
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
const MAX_IMAGE_BASE64_CHARS = 7_000_000; // ~5 MB binary

exports.parsePicksImage = onCall(
  { maxInstances: 3, timeoutSeconds: 120, memory: '512MiB', secrets: [anthropicApiKey] },
  async (request) => {
    await assertAdmin(request.auth && request.auth.uid);

    const { imageBase64, mediaType, nowContext } = request.data || {};
    if (typeof imageBase64 !== 'string' || imageBase64.length === 0) {
      throw new HttpsError('invalid-argument', 'Missing image data.');
    }
    if (imageBase64.length > MAX_IMAGE_BASE64_CHARS) {
      throw new HttpsError('invalid-argument', 'Image too large (max ~5 MB). Crop or compress the screenshot.');
    }
    if (!ALLOWED_IMAGE_TYPES.includes(mediaType)) {
      throw new HttpsError('invalid-argument', 'Unsupported image type.');
    }

    const prompt = [
      'This is a screenshot of sports betting picks (typically an Action Network betslip).',
      'Extract every distinct pick and return ONLY a JSON array, no prose, no markdown fences.',
      'Each element: {"sport": string (league code like "NBA","MLB","NFL","NHL","WNBA","UFC","SOCCER"),',
      ' "description": string (team/side/total plus the line, e.g. "Yankees ML" or "Lakers -3.5" or "Under 8.5 — Mets/Braves"),',
      ' "odds": integer (American odds, e.g. -110 or 145; if a pick shows no odds use -110),',
      ' "stakeUnits": number (units risked; if the slip shows dollars or nothing, use 1),',
      ' "gameStartTime": string (ISO 8601 with timezone offset, e.g. "2026-07-16T19:10:00-04:00")}.',
      `Current date/time for resolving relative times like "7:10 PM": ${nowContext || new Date().toISOString()}.`,
      'Assume US Eastern Time for game times unless the image says otherwise.',
      'If a field is unreadable, set it to null rather than guessing.',
      'If the image contains no picks, return [].',
    ].join('\n');

    let resp;
    try {
      resp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': anthropicApiKey.value(),
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: PARSE_MODEL,
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: [
              { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
              { type: 'text', text: prompt },
            ],
          }],
        }),
      });
    } catch (e) {
      throw new HttpsError('unavailable', `Could not reach the parsing service: ${e.message}`);
    }
    if (!resp.ok) {
      const body = await resp.text().catch(() => '');
      console.error('Anthropic API error', resp.status, body.slice(0, 500));
      throw new HttpsError('internal', `Parsing service returned ${resp.status}.`);
    }

    const data = await resp.json();
    let text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('\n').trim();
    // Defensive: strip markdown fences and any prose around the array.
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
    const start = text.indexOf('[');
    const end = text.lastIndexOf(']');
    if (start === -1 || end === -1 || end < start) {
      throw new HttpsError('internal', 'Parser did not return a pick list. Try a clearer screenshot.');
    }

    let raw;
    try {
      raw = JSON.parse(text.slice(start, end + 1));
    } catch (e) {
      throw new HttpsError('internal', 'Could not parse the extracted picks. Try a clearer screenshot.');
    }
    if (!Array.isArray(raw)) raw = [];

    // Validate each candidate; pass through partial rows (nulls) so the review
    // screen can show them for manual completion instead of dropping them.
    const picks = [];
    const warnings = [];
    raw.slice(0, 30).forEach((p, i) => {
      if (!p || typeof p !== 'object') { warnings.push(`Entry ${i + 1} was not an object; skipped.`); return; }
      const odds = Number.isFinite(Number(p.odds)) ? Math.trunc(Number(p.odds)) : null;
      const stake = Number.isFinite(Number(p.stakeUnits)) ? Number(p.stakeUnits) : null;
      const startTime = typeof p.gameStartTime === 'string' && !isNaN(Date.parse(p.gameStartTime))
        ? new Date(p.gameStartTime).toISOString() : null;
      const pick = {
        sport: typeof p.sport === 'string' ? p.sport.trim().toUpperCase().slice(0, 20) : null,
        description: typeof p.description === 'string' ? p.description.trim().slice(0, 200) : null,
        odds, stakeUnits: stake, gameStartTime: startTime,
      };
      if (odds !== null && odds > -100 && odds < 100) {
        warnings.push(`Entry ${i + 1}: odds ${odds} are not valid American odds — review carefully.`);
      }
      if (Object.values(pick).some((v) => v === null)) {
        warnings.push(`Entry ${i + 1} ("${pick.description || 'unknown'}") has unreadable fields — fill them in before posting.`);
      }
      picks.push(pick);
    });

    return { picks, warnings, model: PARSE_MODEL };
  }
);
