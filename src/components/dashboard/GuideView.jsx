import { AlertTriangle, ShieldAlert } from 'lucide-react';

/**
 * Guide tab: the full official "How to Tail My Plays" content, rendered
 * in-page per mocks/dashboard.html (mirrors src/pages/Guide.jsx, which stays
 * live unchanged at /guide). Sections lazy-render on mobile via
 * content-visibility (see dashboard.css).
 */
export default function GuideView() {
  return (
    <>
      <div className="guide-head">
        <h1>How to Tail My Plays</h1>
        <p className="sub">Understanding my card, units, and bankroll strategy.</p>
      </div>

      <div className="guide-wrap">
        <div className="warn-card" role="note">
          <ShieldAlert aria-hidden="true" />
          <p>
            You must be 21+ (or legal age where you live). This is for entertainment and
            education, not financial advice, and no result is ever guaranteed. Only risk what
            you can afford to lose. If gambling stops being fun, step away; help is available
            24/7 at <strong>1-800-GAMBLER</strong>.
          </p>
        </div>

        <div className="soft-card guide-body">
          <p className="g-intro">
            This guide explains exactly how to read my daily card, what each part means, and how
            to responsibly tail my plays over the long term.
          </p>

          <section className="g-section">
            <h2>1. How to Read the Card</h2>
            <figure className="g-fig">
              <img
                src="/guide-card.jpg"
                loading="lazy"
                decoding="async"
                alt="Example daily card: each row shows the play, odds, game and time, and units risked."
              />
            </figure>
            <p>Using the card above as a reference, each row is one individual wager. From left to right:</p>
            <p className="g-sub">Left side — the play itself</p>
            <ul>
              <li>A spread (e.g. +3, -2)</li>
              <li>A total (Over / Under)</li>
              <li>A first-half line (1H)</li>
              <li>A game and start time</li>
            </ul>
            <p>
              Examples: <span className="g-mono">OSU -2 · Under 5.5 · ATL +3 · Under 109.5 (1H)</span>.
              This is the actual market selection you should be placing.
            </p>
            <p className="g-sub">Middle — the odds</p>
            <p>Next to the play are the odds I personally locked in (e.g. -110, -105, -101). Keep in mind:</p>
            <ul>
              <li>Odds vary by sportsbook</li>
              <li>Lines can move quickly</li>
              <li>You won't always match my exact odds</li>
            </ul>
            <p>
              That's why I strongly recommend having access to as many sportsbooks as possible.
              The more books you have, the closer you'll get to my number (or even beat it), the
              more long-term edge you preserve, and the less value you bleed over time. You don't
              need to match my exact odds, but getting close matters — I send cards in advance
              for a reason.
            </p>
            <p className="g-sub">Right side — units ("x.xu")</p>
            <p>
              The number on the far right (e.g. 4.5u, 5.25u) is how many units I'm wagering on
              that play. A unit is a fixed, small fraction of your bankroll — realistically
              1/500th of it (0.2%) — not a set dollar amount for everyone. You convert it to a
              dollar figure once, then never change it.
            </p>
            <ul>
              <li>If 1 unit = $10, then 5u = $50</li>
              <li>If 1 unit = $100, then 5u = $500</li>
            </ul>
            <p>
              You decide what a unit is before you start, and it should never change based on
              emotion or confidence.
            </p>
          </section>

          <section className="g-section">
            <h2>2. Why Units Matter More Than Dollars</h2>
            <p>On the official card, I avoid flat staking and any "feel for the amount" approach. Units let me:</p>
            <ul>
              <li>Scale positions properly</li>
              <li>Control risk</li>
              <li>Stay consistent through swings</li>
              <li>Avoid emotional decisions (this is the most important)</li>
            </ul>
            <p>
              Some plays carry more edge than others — that's why unit size varies. I use a rough
              model to decide how much to risk on each play. There will be times I put more on a
              play than the math strictly justifies, based on personal feel — and I'll usually
              tell the channel when I've juiced the risk. If I don't say anything, a good rule of
              thumb: anything over 6 units has some personal opinion baked in.
            </p>
          </section>

          <section className="g-section">
            <h2>3. Volatility: What You MUST Be Prepared For</h2>
            <div className="g-box box-danger">
              <p className="head"><AlertTriangle aria-hidden="true" />The most important section.</p>
              <p>If you tail my plays, you will experience:</p>
              <ul>
                <li>Days where I go 0-10</li>
                <li>Weeks where I lose 100+ units</li>
                <li>Even full months that net -200 units</li>
              </ul>
              <p style={{ marginTop: 8 }}>
                This is not a mistake, a collapse, or a sign the strategy "stopped working." This
                is variance. If you're checking your balance after every play, tilting after one
                bad day, chasing losses, or scaling units emotionally — this approach is not for
                you.
              </p>
            </div>
          </section>

          <section className="g-section">
            <h2>4. Recommended Starting Bankroll</h2>
            <p>
              <strong>Minimum: 500 units</strong> — that's where the 1/500th rule comes from. It
              lets you survive drawdowns, stick to the system, and avoid emotional
              decision-making.
            </p>
            <p>
              <strong>What I personally run: 1,000 units.</strong> At that size I rarely have
              more than 0.5% of my bankroll on a single wager — so I don't feel the need to watch
              the games, and I don't tilt when a play loses. The whole goal is to stay out of any
              position where I'd get emotional.
            </p>
          </section>

          <section className="g-section">
            <h2>5. The Chase System (Baseball)</h2>
            <p>
              Baseball is different from other sports because teams play in{' '}
              <strong>series</strong>. In the NBA the Knicks might play a new opponent almost
              every night. In MLB, when the Yankees play the Orioles they'll usually face them
              2-4 games in a row. That back-to-back structure is what makes{' '}
              <strong>"chasing"</strong> a play possible: we get multiple cracks at the same
              edge, against the same matchup, on consecutive days.
            </p>
            <p className="g-sub">How a chase works</p>
            <p>
              Some of my plays are <strong>chase plays</strong>. Instead of a one-and-done entry,
              we ride the play through the games of the series until it hits — or until the
              series runs out. Every chase is built to win <strong>5 units net</strong>. If it
              wins in game 1, we're done. If it loses, we size the next entry to recover what we
              lost <em>and</em> still net our 5 units, then run it back in the next game of that
              series. Chases run on a <strong>three-game series</strong>, so it's at most three
              entries — if it still hasn't hit after game 3, the chase is over and we take the
              loss.
            </p>
            <p className="g-sub">Example — "Under 8.5" chase</p>
            <ol>
              <li>Game 1: risk 5u to win 5u on the Under 8.5. If it cashes → <strong>+5u</strong>, chase over.</li>
              <li>Game 2 (only if game 1 lost): risk 10u to win 10u — recovers the 5u lost and still nets 5u.</li>
              <li>Game 3 (only if still losing): risk 20u to win 20u — recovers the 15u lost plus our 5u target.</li>
            </ol>
            <p>
              If it never hits by the end of game 3, we take the loss — a chase never carries
              into a different series. One note on the number itself: a chase is named for a
              number, like Under 8.5, but you always take the line actually posted for that game.
              A higher total on an Under only works in your favor, and that's the line that
              counts as the system play.
            </p>
            <p className="g-sub">The ML / +1.5 System</p>
            <p>
              One specific chase keys off a <strong>team name</strong> instead of a fixed play
              type. When the play just reads a team — say <span className="g-mono">Yankees</span>{' '}
              for their series vs. the Orioles — the play each game depends on whether the
              Yankees are favored:
            </p>
            <ul>
              <li>Favored that game → play their moneyline (ML).</li>
              <li>Underdog that game → play their +1.5 run-line spread.</li>
            </ul>
            <p>
              It's still one continuous chase to net 5 units; only the play type flips
              game-to-game with their role.
            </p>
            <div className="g-box box-warn">
              <p className="head"><AlertTriangle aria-hidden="true" />This is a system — not emotional chasing.</p>
              <p>
                A chase here is a <strong>pre-defined, bounded plan</strong>: the number of games
                is capped by the series, the entries are set in advance, and the whole sequence
                targets a fixed 5 units. Because the stake grows each game, a full chase can risk
                a real chunk of bankroll — e.g. <span className="g-mono">5 + 10 + 20 = 35u</span>{' '}
                across a 3-game series to net 5u. That's exactly why the unit and bankroll
                guidance above matters: size your unit so a full failed chase is something you
                can absorb without flinching.
              </p>
            </div>
          </section>

          <section className="g-section">
            <h2>6. Long-Term Mindset</h2>
            <p>
              At the end of the day: it's your money, your bankroll, your responsibility. You're
              always free to reach out with questions. I genuinely want your experience to go
              well, and I'm happy to give advice. But I can't manage your account and I can't
              monitor your actions. The discipline is on you.
            </p>
          </section>

          <section className="g-section">
            <h2>7. Final Notes</h2>
            <p>If you choose to tail:</p>
            <ul>
              <li>Respect the units</li>
              <li>Respect your bankroll</li>
              <li>Respect the variance</li>
              <li>Trust the long-term edge</li>
            </ul>
            <p>
              I hope you profit from this. And even if you don't, I hope you walk away
              understanding what profitable, disciplined gambling actually looks like.
            </p>
          </section>
        </div>

        <p className="guide-note">
          Responsible gambling: only risk what you can afford to lose, and only if you're 21+
          (or legal age in your area). This service is for entertainment and education, not
          financial advice, and no outcome is guaranteed. If gambling stops being fun or starts
          causing harm, please step away — help is available 24/7 at 1-800-GAMBLER.
        </p>
      </div>
    </>
  );
}
