import { ShieldAlert } from 'lucide-react';
import LegalLayout, { LegalSection, LegalBullets } from '../components/LegalLayout.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';
import { LEGAL } from '../utils/legal.js';

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service and Disclaimers">
      {/* Top summary callout */}
      <Card className="border-warning/30 bg-warning/5">
        <CardContent className="flex gap-3 p-4 text-sm leading-relaxed text-foreground/85">
          <ShieldAlert className="h-5 w-5 shrink-0 text-warning" />
          <p>
            {LEGAL.businessName} sells opinions, analysis, and access to its own
            informational content. Edgeable is not a sportsbook, bookmaker, broker, or financial
            advisor. It does not accept, place, broker, pool, or settle any wager, and it does not
            manage anyone's betting, brokerage, or financial accounts. Nothing here is a guarantee of
            any result. You can lose money acting on this information, and you do so entirely at your
            own risk.
          </p>
        </CardContent>
      </Card>

      <LegalSection id="acceptance" title="1. Acceptance of these Terms">
        <p>
          These Terms of Service and Disclaimers (the "Terms") are a binding agreement between you and{' '}
          {LEGAL.businessName} (also "we" or "us"), the operator of the Edgeable website and app (the
          "Service"). By creating an
          account, subscribing, or otherwise accessing or using the Service, you confirm that you have
          read, understood, and agree to be bound by these Terms and by our Privacy Policy. If you do
          not agree, do not create an account and do not use the Service.
        </p>
      </LegalSection>

      <LegalSection id="what-edgeable-is" title="2. What Edgeable is, and what it is not">
        <p>
          The Service provides subjective opinions, commentary, statistical analysis, and educational
          and entertainment content about sports, events, and prediction markets. This content is
          intellectual property created by Edgeable and offered to subscribers for their personal,
          informational use.
        </p>
        <p className="font-medium text-foreground">Edgeable expressly is not, and does not operate as, any of the following:</p>
        <LegalBullets items={[
          'A sportsbook, casino, bookmaker, betting exchange, or gambling operator of any kind.',
          'A broker, dealer, exchange, or operator of any prediction market, securities market, or financial market.',
          'A money transmitter, payment processor, escrow service, or custodian of funds.',
          'An investment adviser, financial planner, fiduciary, or provider of professional advice.',
        ]} />
        <p>
          Edgeable never accepts, places, matches, brokers, pools, holds, or settles any bet, wager,
          stake, or trade on your behalf or anyone else's. All payments to Edgeable are solely for
          access to its informational content, as described in the Subscriptions section below.
        </p>
      </LegalSection>

      <LegalSection id="no-advice" title="3. No financial, investment, or professional advice">
        <p>
          All content on the Service is provided for general informational, educational, and
          entertainment purposes only. It does not constitute, and must not be relied on as, financial,
          investment, betting, legal, tax, or other professional advice, and it is not a recommendation,
          solicitation, or offer to place any wager or enter any transaction.
        </p>
        <p>
          Edgeable does not know your personal financial situation, risk tolerance, or objectives.
          Opinions reflect the personal views of their author at a point in time, may be wrong, and may
          change without notice. You are solely responsible for evaluating the information and for any
          decision you make. No advisory, fiduciary, or agency relationship is created between you and
          Edgeable by your use of the Service.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="4. Eligibility, age, and your representations">
        <p>
          The Service is available only to individuals who can form a legally binding contract and who
          meet the age requirements below. By using the Service you represent and warrant, each time you
          access it, that all of the following are true:
        </p>
        <LegalBullets items={[
          'You are at least 21 years old, or the legal gambling age where you are located if that age is higher.',
          'Gambling and your use of this information are legal in your jurisdiction, and your use of the Service does not violate any law, rule, or third-party terms (including the terms of any sportsbook or prediction market) that apply to you.',
          'All information you provide to Edgeable, including your age and identity, is true, accurate, and current.',
        ]} />
        <p className="font-medium text-foreground">
          You, and not Edgeable, are solely responsible for the truthfulness of these representations.
        </p>
        <p>
          Edgeable does not independently verify the age, identity, location, or eligibility of any
          user and has no practical ability to do so. To the fullest extent permitted by law, Edgeable
          has no liability arising from any false, inaccurate, or misleading statement you make,
          including any misstatement of your age, and Edgeable is not responsible for any underage,
          unlawful, or prohibited use of the Service or of the information it provides. If you do not
          meet every requirement above, you must not use the Service. Edgeable may suspend or terminate
          any account it believes does not meet these requirements, without notice.
        </p>
      </LegalSection>

      <LegalSection id="no-management" title="5. No wagering and no account management by Edgeable">
        <p>
          You alone decide whether to act on any information, where to do so, and how much to stake.
          Edgeable does not, and will not:
        </p>
        <LegalBullets items={[
          'Accept money from you to place a bet, or hold or pool funds for wagering.',
          'Place, broker, or settle any wager or trade for you or take any private wager.',
          'Access, log into, fund, manage, or control your sportsbook, prediction-market, brokerage, bank, or any other account.',
          'Act as your agent or representative with any third party.',
        ]} />
        <p>
          Any account you hold with a sportsbook, prediction market, bank, or other third party is
          governed solely by your agreement with that provider, and your relationship and dealings with
          those providers are strictly between you and them.
        </p>
      </LegalSection>

      <LegalSection id="risk" title="6. Assumption of risk and no guarantee of results">
        <p>
          Betting, trading, and speculation involve a substantial risk of loss, and you can lose some or
          all of any amount you stake. Edgeable makes no representation, warranty, or guarantee about any
          outcome, win rate, profit, return, or performance. Past or hypothetical results, including any
          record or performance figures shown on the Service, are not a promise or indicator of future
          results and may not reflect what any individual user experiences.
        </p>
        <p>
          You acknowledge that results are volatile, that losing streaks are a normal feature of the
          activity, and that you assume full and sole responsibility for every decision you make and
          every loss you incur. You agree to stake only what you can afford to lose.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="7. Disclaimer of warranties and limitation of liability">
        <p>
          The Service and all content are provided "as is" and "as available," without warranties of any
          kind, whether express or implied, including any implied warranties of merchantability, fitness
          for a particular purpose, accuracy, and non-infringement. Edgeable does not warrant that the
          Service will be uninterrupted, error-free, secure, or that any content is accurate or complete.
        </p>
        <p>
          To the fullest extent permitted by law, Edgeable, together with its owner, operators,
          employees, and contributors, will not be liable for any indirect, incidental, special,
          consequential, exemplary, or punitive damages, or for any loss of money, profits, betting or
          trading losses, data, or goodwill, arising out of or relating to your use of, or inability to
          use, the Service or any information it provides, whether based in contract, tort, strict
          liability, or any other theory, and even if Edgeable has been advised of the possibility of
          such damages.
        </p>
        <p>
          To the fullest extent permitted by law, the total aggregate liability of Edgeable for all
          claims relating to the Service will not exceed the total amount you paid to Edgeable for access
          during the three months immediately before the event giving rise to the claim. Some
          jurisdictions do not allow certain limitations, so some of these limits may not apply to you;
          in that case the limitations apply to the greatest extent the law allows.
        </p>
      </LegalSection>

      <LegalSection id="indemnity" title="8. Indemnification">
        <p>
          You agree to indemnify, defend, and hold harmless Edgeable and its
          owner, operators, employees, and contributors from and against any claims, demands, losses,
          liabilities, damages, costs, and expenses (including reasonable legal fees) arising out of or
          relating to your use of the Service, your wagers or transactions, your violation of these
          Terms, your violation of any law or third-party right, or any misrepresentation you make,
          including any misstatement of your age or eligibility.
        </p>
      </LegalSection>

      <LegalSection id="ip" title="9. Intellectual property and acceptable use">
        <p>
          All content provided through the Service, including picks, analysis, write-ups, text, images,
          and the Edgeable name and branding, is the intellectual property of {LEGAL.businessName} or its
          licensors and is protected by applicable law. Subject to these Terms, you are granted a
          limited, personal, non-exclusive, non-transferable, revocable license to access and use the
          content for your own personal use during your active subscription.
        </p>
        <p>You agree not to:</p>
        <LegalBullets items={[
          'Copy, redistribute, resell, sublicense, broadcast, post, or share the content with non-subscribers, including in group chats, forums, or other paid or free communities.',
          'Use the content to operate a competing service, tipster service, or pick-selling operation.',
          'Share, sell, or transfer your account or login credentials.',
          'Scrape, harvest, reverse engineer, or attempt to gain unauthorized access to the Service or its data.',
        ]} />
        <p>
          Edgeable may suspend or terminate access for any violation of this section, in addition to any
          other remedy available to it.
        </p>
      </LegalSection>

      <LegalSection id="subscriptions" title="10. Subscriptions, payments, and refunds">
        <p>
          A subscription buys access to Edgeable's informational content for a period of time. It is not
          a wager, an investment, a deposit, or a purchase of any financial product, and it does not
          entitle you to any winnings. Payments are arranged directly between you and Edgeable using the
          payment methods shown in the app, and your account remains inactive until a payment is
          confirmed by an administrator.
        </p>
        <p>
          Except where required by law, all payments are final and non-refundable. In particular, losing
          wagers, a change in your circumstances, or dissatisfaction with results are not grounds for a
          refund. Edgeable may change its prices or plans on a going-forward basis.
        </p>
      </LegalSection>

      <LegalSection id="termination" title="11. Suspension and termination">
        <p>
          You may stop using the Service at any time and may request deletion of your account as
          described in the Privacy Policy. Edgeable may suspend, restrict, or terminate your access at
          any time, with or without notice, if it believes you have violated these Terms, provided false
          information, or used the Service unlawfully, or for any other reason at its discretion.
          Sections that by their nature should survive termination, including the disclaimers, limitation
          of liability, indemnification, and intellectual property terms, will survive.
        </p>
      </LegalSection>

      <LegalSection id="responsible" title="12. Responsible gambling">
        <p>
          Please gamble responsibly. Only stake money you can afford to lose, set limits, and never chase
          losses. If gambling stops being fun or starts causing harm to you or those around you, please
          step away. Confidential help is available 24/7 in the United States at 1-800-GAMBLER, and many
          sportsbooks offer self-exclusion and deposit-limit tools.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="13. Changes to these Terms">
        <p>
          Edgeable may update these Terms from time to time. When it does, it will revise the "Last
          updated" date and version shown above. Material changes may also be communicated in the app or
          by requiring you to accept the updated Terms. Your continued use of the Service after an update
          takes effect means you accept the revised Terms.
        </p>
      </LegalSection>

      <LegalSection id="law" title="14. Governing law and disputes">
        <p>
          These Terms are governed by the laws of the State of {LEGAL.state}, without regard to its
          conflict-of-laws rules. You agree that any dispute arising out of or relating to the Service or
          these Terms will be brought exclusively in the state or federal courts located in {LEGAL.state},
          and you consent to the personal jurisdiction of those courts, except where applicable law
          provides otherwise.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="15. Contact">
        <p>
          Questions about these Terms can be sent to{' '}
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-primary hover:underline">
            {LEGAL.contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
