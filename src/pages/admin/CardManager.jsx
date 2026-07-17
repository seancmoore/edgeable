import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, Copy, Check, ExternalLink } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase.js';
import {
  createPick, gradePick, getAllPicks, isPostedToday,
  formatOdds, formatStake, formatPostedAt, cardAsText, FINAL_STATUSES,
} from '../../utils/picks.js';
import AppShell, { PageHeader } from '../../components/AppShell.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Input } from '../../components/ui/input.jsx';
import { cn } from '../../lib/utils.js';

const EMPTY_FORM = { sport: '', description: '', odds: '', stakeUnits: '1', gameStartTime: '', access: 'subscribers' };

// datetime-local wants "YYYY-MM-DDTHH:MM" in local time.
function toLocalInputValue(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function GradeButtons({ pick, onGraded }) {
  const [busy, setBusy] = useState('');
  const grade = async (status) => {
    if (!window.confirm(`Grade "${pick.description}" as ${status.toUpperCase()}? Grading is permanent.`)) return;
    setBusy(status);
    try {
      await gradePick(pick.id, status);
      onGraded();
    } catch (e) {
      alert(`Failed: ${e.message}`);
    } finally {
      setBusy('');
    }
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {FINAL_STATUSES.map((s) => (
        <Button
          key={s}
          size="sm"
          variant={s === 'win' ? 'default' : 'outline'}
          disabled={!!busy}
          onClick={() => grade(s)}
        >
          {busy === s ? '…' : s}
        </Button>
      ))}
    </div>
  );
}

function PickFields({ value, onChange }) {
  const set = (k, v) => onChange({ ...value, [k]: v });
  const access = value.access || 'subscribers';
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
      <Input placeholder="League (NBA)" value={value.sport} onChange={(e) => set('sport', e.target.value)} />
      <Input className="col-span-2 sm:col-span-2" placeholder="Pick (Yankees ML)" value={value.description} onChange={(e) => set('description', e.target.value)} />
      <Input placeholder="Odds (-110)" inputMode="numeric" value={value.odds} onChange={(e) => set('odds', e.target.value)} />
      <Input placeholder="Units" inputMode="decimal" value={value.stakeUnits} onChange={(e) => set('stakeUnits', e.target.value)} />
      <div className="col-span-2 sm:col-span-3">
        <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Game start</label>
        <Input type="datetime-local" value={value.gameStartTime} onChange={(e) => set('gameStartTime', e.target.value)} />
      </div>
      <div className="col-span-2 sm:col-span-2">
        <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Who sees it (permanent)</label>
        <div className="mt-0.5 grid grid-cols-2 overflow-hidden rounded-md border border-border">
          {['subscribers', 'public'].map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => set('access', a)}
              className={cn(
                'px-2 py-2 text-xs font-medium capitalize transition-colors',
                access === a ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-secondary'
              )}
            >
              {a === 'public' ? 'Free pick' : 'Subscribers'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CardManager() {
  const [picks, setPicks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // screenshot import state
  const [parsing, setParsing] = useState(false);
  const [reviewRows, setReviewRows] = useState(null); // null = no import in progress
  const [warnings, setWarnings] = useState([]);
  const [posting, setPosting] = useState(false);
  const fileInput = useRef(null);

  // manual entry state
  const [manual, setManual] = useState(EMPTY_FORM);
  const [manualBusy, setManualBusy] = useState(false);

  const [copied, setCopied] = useState(false);

  const reload = async () => {
    setLoading(true);
    setError('');
    try {
      setPicks(await getAllPicks(500));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { reload(); }, []);

  const today = picks.filter(isPostedToday);
  const pending = picks.filter((p) => p.status === 'pending');

  // ── screenshot import ──────────────────────────────────────
  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setParsing(true);
    setError('');
    setWarnings([]);
    try {
      const dataUrl = await new Promise((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(r.result);
        r.onerror = () => rej(new Error('Could not read the image file.'));
        r.readAsDataURL(file);
      });
      const [meta, base64] = String(dataUrl).split(',');
      const mediaType = meta.match(/data:([^;]+);/)?.[1] || file.type;
      const call = httpsCallable(functions, 'parsePicksImage', { timeout: 120000 });
      const { data } = await call({ imageBase64: base64, mediaType, nowContext: new Date().toString() });
      setWarnings(data.warnings || []);
      setReviewRows((data.picks || []).map((p) => ({
        sport: p.sport || '',
        description: p.description || '',
        odds: p.odds != null ? String(p.odds) : '',
        stakeUnits: p.stakeUnits != null ? String(p.stakeUnits) : '1',
        gameStartTime: toLocalInputValue(p.gameStartTime),
        access: 'subscribers',
      })));
      if ((data.picks || []).length === 0) setError('No picks found in that screenshot.');
    } catch (e) {
      setError(`Screenshot parsing failed: ${e.message}`);
    } finally {
      setParsing(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  };

  // The free-pick designation is immutable by design (rules), so warn before
  // posting a second public pick on the same day.
  const warnDuplicateFreePick = (newRows) => {
    const existing = today.filter((p) => p.access === 'public').length;
    const incoming = newRows.filter((r) => r.access === 'public').length;
    if (existing + incoming > 1) {
      return window.confirm(
        `This would make ${existing + incoming} free picks today (designation is permanent). Post anyway?`
      );
    }
    return true;
  };

  const confirmImport = async () => {
    if (!warnDuplicateFreePick(reviewRows)) return;
    setPosting(true);
    setError('');
    try {
      // Same write path as manual entry — createPick — so the serverTimestamp
      // and immutability rules apply identically.
      for (const row of reviewRows) {
        await createPick(row);
      }
      setReviewRows(null);
      setWarnings([]);
      await reload();
    } catch (e) {
      setError(`Posting stopped: ${e.message} — picks before this one were posted; fix the rest and confirm again.`);
      await reload();
    } finally {
      setPosting(false);
    }
  };

  // ── manual entry ───────────────────────────────────────────
  const submitManual = async (e) => {
    e.preventDefault();
    if (!warnDuplicateFreePick([manual])) return;
    setManualBusy(true);
    setError('');
    try {
      await createPick(manual);
      setManual(EMPTY_FORM);
      await reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setManualBusy(false);
    }
  };

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(cardAsText(today));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Copy failed — select and copy manually:\n\n' + cardAsText(today));
    }
  };

  return (
    <AppShell container="medium">
      <Link to="/admin" className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to dashboard
      </Link>
      <PageHeader
        title="Daily Card"
        description="Public verifiable pick record — picks are permanent once posted."
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <a href="/card" target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /> Public page</a>
            </Button>
            <Button size="sm" onClick={copyCard} disabled={today.length === 0}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : "Copy today's card"}
            </Button>
          </>
        }
      />

      {error && (
        <div className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
      )}

      {/* Screenshot import */}
      <Card className="mb-5">
        <CardContent className="p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Import from screenshot</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Drop your Action Network screenshot. Parsed picks land in a review table — nothing posts until you confirm.
          </p>

          {reviewRows === null ? (
            <div
              className={cn(
                'mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border py-10 text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground',
                parsing && 'pointer-events-none opacity-60'
              )}
              onClick={() => fileInput.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
            >
              <Upload className="h-6 w-6" />
              <span className="text-sm">{parsing ? 'Parsing screenshot…' : 'Drop a screenshot or click to choose'}</span>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </div>
          ) : (
            <div className="mt-4">
              <div className="mb-2 text-sm font-medium">Review parsed picks — every field is editable. Check the odds against your slip.</div>
              {warnings.length > 0 && (
                <ul className="mb-3 list-disc space-y-1 rounded-md border border-amber-500/30 bg-amber-500/10 p-3 pl-7 text-sm text-amber-600 dark:text-amber-400">
                  {warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              )}
              <div className="flex flex-col gap-4">
                {reviewRows.map((row, i) => (
                  <div key={i} className="rounded-lg border border-border p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pick {i + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => setReviewRows(reviewRows.filter((_, j) => j !== i))}>
                        Remove
                      </Button>
                    </div>
                    <PickFields value={row} onChange={(v) => setReviewRows(reviewRows.map((r, j) => (j === i ? v : r)))} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={confirmImport} disabled={posting || reviewRows.length === 0}>
                  {posting ? 'Posting…' : `Confirm & post ${reviewRows.length} pick${reviewRows.length === 1 ? '' : 's'}`}
                </Button>
                <Button variant="outline" onClick={() => { setReviewRows(null); setWarnings([]); }} disabled={posting}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual entry */}
      <Card className="mb-5">
        <CardContent className="p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Manual entry</h2>
          <form onSubmit={submitManual} className="mt-3">
            <PickFields value={manual} onChange={setManual} />
            <Button type="submit" className="mt-3" disabled={manualBusy}>
              {manualBusy ? 'Posting…' : 'Post pick'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Grading */}
      <Card className="mb-5">
        <CardContent className="p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Pending picks</h2>
          {loading && <p className="mt-2 text-muted-foreground">Loading…</p>}
          {!loading && pending.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground">Nothing pending — all picks graded.</p>
          )}
          <ul className="mt-3 flex list-none flex-col gap-2 p-0">
            {pending.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium">
                    {p.sport} · {p.description} @ {formatOdds(p.odds)} · {formatStake(p.stakeUnits)}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    posted {formatPostedAt(p.postedAt, { withDate: true })} ET
                  </div>
                </div>
                <GradeButtons pick={p} onGraded={reload} />
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Today */}
      <Card>
        <CardContent className="p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Today's card ({today.length})</h2>
          <ul className="mt-3 flex list-none flex-col gap-2 p-0">
            {today.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border p-3 text-sm">
                <span>
                  {p.sport} · {p.description} @ {formatOdds(p.odds)} · {formatStake(p.stakeUnits)}
                  {p.access === 'public' && <span className="ml-1.5 text-xs font-medium text-primary">FREE PICK</span>}
                </span>
                <span className="text-xs uppercase text-muted-foreground">{p.status}</span>
              </li>
            ))}
            {today.length === 0 && !loading && (
              <li className="text-sm text-muted-foreground">No picks posted today yet.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </AppShell>
  );
}
