import { useEffect, useRef, useState } from 'react';
import { createProfileChangeRequest } from '../../utils/profileRequests.js';
import { normalizeTelegramUsername, isValidTelegramUsername } from '../../utils/auth.js';
import AcctModal from './AcctModal.jsx';

/**
 * "Request a change" modal for the admin-approved identity fields
 * (displayName = the Edgeable username, telegramUsername). Creates a
 * profileChangeRequests doc that the admin reviews; nothing changes until
 * approval, because these fields are how payments get matched to accounts.
 */
const FIELD_META = {
  displayName: {
    title: 'Request a username change',
    label: 'New Edgeable username',
    prefix: '',
    placeholder: 'Your new username',
  },
  telegramUsername: {
    title: 'Request a Telegram change',
    label: 'New Telegram username',
    prefix: '@',
    placeholder: 'your_telegram',
  },
};

export default function RequestChangeModal({
  field, currentValue, uid, displayName, onClose, onCreated,
}) {
  const meta = FIELD_META[field];
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const submit = async () => {
    setError('');

    let proposed = value.trim();
    if (field === 'telegramUsername') {
      proposed = normalizeTelegramUsername(proposed);
      if (!isValidTelegramUsername(proposed)) {
        setError('Telegram username must be 5-32 characters, letters, digits, or underscores.');
        return;
      }
    } else {
      if (!proposed) { setError('Enter the new username you want.'); return; }
      if (proposed.length > 80) { setError('That username is too long (80 characters max).'); return; }
    }
    if (proposed === (currentValue || '')) {
      setError('That matches what is already on your account.');
      return;
    }

    setBusy(true);
    try {
      await createProfileChangeRequest({
        subscriberUid: uid,
        subscriberDisplayName: displayName,
        field,
        currentValue: currentValue || '',
        proposedValue: proposed,
        reason: note.trim() || 'Requested from the account page',
      });
      setDone(true);
      onCreated?.();
    } catch (err) {
      setError(err?.message || 'Could not send the request. Try again.');
      setBusy(false);
    }
  };

  return (
    <AcctModal
      titleId="dlacct-req-title"
      title={meta.title}
      sub={done ? null : 'This change needs admin approval so payments always match the right account. It usually clears the same day.'}
      onClose={onClose}
    >
      {done ? (
        <>
          <div className="m-success" role="status">
            Request sent. You&apos;ll see it as pending here until it&apos;s reviewed;
            nothing changes on your account before approval.
          </div>
          <div className="btn-row">
            <button className="cta-btn" type="button" onClick={onClose}>Done</button>
          </div>
        </>
      ) : (
        <>
          <div className="current-box">
            <span className="k">Current</span>
            <span className="v">
              {field === 'telegramUsername' && currentValue ? `@${currentValue}` : (currentValue || 'Not set')}
            </span>
          </div>

          <label className="field-label" htmlFor="dlacct-req-value">{meta.label}</label>
          <div className="field-wrap">
            {meta.prefix && <span className="field-prefix mono" aria-hidden="true">{meta.prefix}</span>}
            <input
              ref={inputRef}
              className="field"
              id="dlacct-req-value"
              type="text"
              autoComplete="off"
              placeholder={meta.placeholder}
              maxLength={field === 'telegramUsername' ? 33 : 80}
              value={value}
              onChange={(e) => { setValue(e.target.value); setError(''); }}
            />
          </div>

          <label className="field-label" htmlFor="dlacct-req-note">Note for the owner (optional)</label>
          <div className="field-wrap">
            <textarea
              className="field field-area"
              id="dlacct-req-note"
              placeholder="Anything that helps match this to you"
              maxLength={200}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {error && <p className="m-error">{error}</p>}

          <div className="btn-row">
            <button className="cta-btn" type="button" onClick={submit} disabled={busy}>
              {busy ? 'Sending…' : 'Send request'}
            </button>
            <button className="cta-btn cta-outline" type="button" onClick={onClose} disabled={busy}>
              Cancel
            </button>
          </div>
        </>
      )}
    </AcctModal>
  );
}
