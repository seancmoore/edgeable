import { useEffect, useRef, useState } from 'react';
import { updateMyUnitSize } from '../../utils/users.js';

function fmtDollars(n) {
  return `$${n % 1 ? n.toFixed(2) : n.toString()}`;
}

/**
 * Set-unit-size modal: enter bankroll, unit = 1/500th (0.2%), live preview.
 * Desktop: centered card. Mobile (<900px): bottom sheet (CSS handles the swap).
 * Saves unitSize straight onto the user's profile (Firestore rules allow the
 * subscriber to self-update only unitSize).
 */
export default function UnitSizeModal({ uid, currentUnitSize, onClose }) {
  const [bankroll, setBankroll] = useState(
    currentUnitSize > 0 ? String(Math.round(currentUnitSize * 500)) : ''
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const bankrollNum = parseFloat(bankroll) || 0;
  const unit = bankrollNum > 0 ? Math.round((bankrollNum / 500) * 100) / 100 : 0;

  const save = async () => {
    setError('');
    if (!(unit > 0)) { setError('Enter your bankroll to size your unit.'); return; }
    setSaving(true);
    try {
      await updateMyUnitSize(uid, unit);
      onClose();
    } catch (err) {
      setError(err?.message || 'Could not save. Try again.');
      setSaving(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="dl-unit-title">
        <h2 id="dl-unit-title">Set your unit size</h2>
        <p className="modal-sub">
          Enter your bankroll: the amount you've set aside for this, that you can afford to
          lose. Your unit is 1/500th of it.
        </p>
        <label className="field-label" htmlFor="dl-bankroll-input">Your bankroll</label>
        <div className="field-wrap">
          <span className="field-prefix mono" aria-hidden="true">$</span>
          <input
            ref={inputRef}
            className="field"
            id="dl-bankroll-input"
            type="number"
            inputMode="numeric"
            min="0"
            step="100"
            placeholder="12,500"
            value={bankroll}
            onChange={(e) => { setBankroll(e.target.value); setError(''); }}
          />
        </div>
        <div className="unit-preview">
          <span>1 unit =</span>
          <span className="mono up-val">{fmtDollars(unit)}</span>
          <span className="up-note">(1/500th · 0.2%)</span>
        </div>
        {error && <p className="m-error">{error}</p>}
        <div className="btn-row">
          <button className="cta-btn" type="button" onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save unit size'}
          </button>
          <button className="cta-btn cta-outline" type="button" onClick={onClose} disabled={saving}>
            Cancel
          </button>
        </div>
        <p className="m-note" style={{ textAlign: 'center' }}>
          You can change this anytime. It only affects how dollars are shown to you, never the record.
        </p>
      </div>
    </>
  );
}
