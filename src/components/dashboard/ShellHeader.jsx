import { useEffect, useRef, useState } from 'react';
import { ChevronDown, KeyRound, LogOut, Menu } from 'lucide-react';
import Wordmark from '../Wordmark.jsx';

const TABS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'record', label: 'Record' },
  { id: 'guide', label: 'Guide' },
];

/**
 * Dusk Ledger app-shell header: wordmark left, centered pill tab group,
 * account chip right with a dropdown (name + email, change password, sign out).
 * Below 900px the tabs collapse into a hamburger that opens a left slide-in
 * drawer (backdrop + Escape to close) with the tabs and an account row.
 */
export default function ShellHeader({
  tab, onTab, displayName, email, onSignOut, onChangePassword,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef(null);

  const initial = (displayName || email || '?').trim().charAt(0).toUpperCase();

  // Close the account menu on outside click.
  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, [menuOpen]);

  // Escape closes menu + drawer.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') { setMenuOpen(false); setDrawerOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const pickTab = (id) => { onTab(id); setDrawerOpen(false); };

  return (
    <>
      {/* Mobile drawer + backdrop */}
      <div className={`backdrop${drawerOpen ? ' on' : ''}`} onClick={() => setDrawerOpen(false)} aria-hidden="true" />
      <aside className={`drawer${drawerOpen ? ' open' : ''}`} aria-label="Menu" aria-hidden={!drawerOpen}>
        <span className="wordmark" aria-hidden="true"><Wordmark size="sm" /></span>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="d-tab"
            aria-current={tab === t.id ? 'page' : undefined}
            onClick={() => pickTab(t.id)}
            tabIndex={drawerOpen ? 0 : -1}
          >
            {t.label}
          </button>
        ))}
        <div className="d-account">
          <span className="avatar" aria-hidden="true">{initial}</span>
          <span>{displayName}</span>
          <button
            type="button"
            className="d-signout"
            aria-label="Sign out"
            onClick={onSignOut}
            tabIndex={drawerOpen ? 0 : -1}
          >
            <LogOut aria-hidden="true" />
          </button>
        </div>
      </aside>

      <header className="shell">
        <button
          className="menu-btn"
          type="button"
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu aria-hidden="true" />
        </button>
        <span className="wordmark" aria-label="Edgeable dashboard"><Wordmark size="md" /></span>
        <nav className="tabs" aria-label="Main">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-current={tab === t.id ? 'page' : undefined}
              onClick={() => onTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="shell-right">
          <div className="account-wrap" ref={menuRef}>
            <button
              className="account"
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label="Account menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="avatar" aria-hidden="true">{initial}</span>
              <span className="name">{displayName}</span>
              <ChevronDown className="acct-chev" width={14} height={14} strokeWidth={2.5} aria-hidden="true" />
            </button>
            {menuOpen && (
              <div className="account-menu" role="menu">
                <div className="am-head">
                  <span className="avatar" aria-hidden="true">{initial}</span>
                  <span className="am-who">
                    <span className="am-name">{displayName}</span>
                    <span className="am-mail">{email}</span>
                  </span>
                </div>
                <button
                  className="am-item"
                  role="menuitem"
                  type="button"
                  onClick={() => { setMenuOpen(false); onChangePassword(); }}
                >
                  <KeyRound aria-hidden="true" />
                  Change password
                </button>
                <button className="am-item" role="menuitem" type="button" onClick={onSignOut}>
                  <LogOut aria-hidden="true" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
