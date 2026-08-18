import { useEffect } from 'react';

/**
 * Shared Dusk Ledger modal chrome for the Account page.
 * Desktop: centered card. Mobile (<900px): bottom sheet (account.css handles
 * the swap). Backdrop click + Escape close it.
 */
export default function AcctModal({ titleId, title, sub, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true" />
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId}>{title}</h2>
        {sub && <p className="modal-sub">{sub}</p>}
        {children}
      </div>
    </>
  );
}
