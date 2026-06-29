import LegalLayout, { LegalSection, LegalBullets } from '../components/LegalLayout.jsx';
import { LEGAL } from '../utils/legal.js';

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy">
      <LegalSection id="intro" title="1. Introduction">
        <p>
          This Privacy Policy explains how {LEGAL.businessName} (also "we" or "us"), which operates the
          Edgeable website and app (the "Service"), collects, uses, shares, and protects your personal
          information. It applies to the
          Edgeable website and app. By using the Service you agree to the practices described here. If
          you do not agree, please do not use the Service.
        </p>
      </LegalSection>

      <LegalSection id="collect" title="2. Information we collect">
        <p className="font-medium text-foreground">Information you provide</p>
        <LegalBullets items={[
          'Account details you enter at signup: display name, email address, Telegram username, and phone number.',
          'Your password, which is handled by our authentication provider and stored only in hashed form. Edgeable cannot see your password.',
          'Subscription and payment records, including the plan and dates, and the payment method and reference you submit when requesting a subscription or renewal.',
          'Proof-of-payment images you upload (for example a screenshot of a Cash App or Zelle transfer).',
          'Requests and messages you send through the app, such as profile-change requests and notes.',
          'Preferences such as your unit-size setting.',
        ]} />
        <p className="font-medium text-foreground">Information collected automatically</p>
        <LegalBullets items={[
          'Account activity and audit events, such as logins and changes to your account, used for security and support.',
          'Standard technical data that our hosting and security providers process to deliver and protect the Service, such as IP address, device and browser information, and signals from bot- and abuse-protection tools.',
          'Local storage on your device for things like your theme preference and your signed-in session.',
        ]} />
        <p>
          Edgeable does not collect or store your full payment-card or bank-account numbers. Payments are
          made directly through third-party peer-to-peer payment apps, and Edgeable only records the
          method, a reference you provide, and any proof image you choose to upload.
        </p>
      </LegalSection>

      <LegalSection id="use" title="3. How we use your information">
        <LegalBullets items={[
          'To create and operate your account and authenticate you when you sign in by email, Telegram username, or phone.',
          'To match you to your subscription and show your status and performance.',
          'To process and confirm subscription payments and renewals.',
          'To respond to your requests and provide support.',
          'To send account-related messages, such as email verification and password-reset emails.',
          'To secure the Service, prevent fraud and abuse, and enforce our Terms.',
          'To comply with legal obligations.',
        ]} />
      </LegalSection>

      <LegalSection id="share" title="4. How we share your information">
        <p>
          Edgeable does not sell your personal information and does not share it for third-party
          advertising. We share information only in these limited ways:
        </p>
        <LegalBullets items={[
          'Service providers: Edgeable is built on Google Firebase (Authentication, Cloud Firestore, Cloud Storage, and Hosting) and uses Google reCAPTCHA Enterprise and Firebase App Check for abuse protection. These providers process your data on our behalf so the Service can function. Their use of data is governed by Google’s privacy terms.',
          'Legal and safety: we may disclose information if required by law, subpoena, or government request, or where we believe it is necessary to protect the rights, safety, or property of Edgeable, our users, or others.',
          'Business transfer: if the Service is involved in a merger, acquisition, or sale of assets, information may be transferred as part of that transaction.',
        ]} />
      </LegalSection>

      <LegalSection id="retention" title="5. Data retention">
        <p>
          We keep your account information for as long as your account exists and as needed to provide
          the Service. When an account is deleted, the account profile and login lookups are removed, but
          transaction and payment records are retained as business and financial records, as permitted or
          required by law. We may also retain limited information as needed to comply with legal
          obligations, resolve disputes, and enforce our agreements.
        </p>
      </LegalSection>

      <LegalSection id="security" title="6. Security">
        <p>
          We use industry-standard measures provided by our infrastructure, including encrypted
          connections, managed authentication, server-side access rules, and abuse protection, to help
          safeguard your information. No method of transmission or storage is completely secure, so we
          cannot guarantee absolute security. You are responsible for keeping your password confidential
          and for any activity under your account.
        </p>
      </LegalSection>

      <LegalSection id="rights" title="7. Your choices and rights">
        <LegalBullets items={[
          'Access and update: you can view and update much of your profile in the app, and submit a request for changes that require review, such as your email or Telegram username.',
          'Password: you can reset your password by email at any time and change it from within the app.',
          'Deletion: you can request deletion of your account by contacting us. Note that financial records associated with past transactions may be retained as described above.',
          'Communications: account and security messages, such as email verification and password resets, are necessary to use the Service.',
        ]} />
        <p>
          Depending on where you live, you may have additional rights over your personal information,
          such as the right to access, correct, delete, or restrict its use. To exercise any right,
          contact us using the details below. We may need to verify your identity before acting on a
          request.
        </p>
      </LegalSection>

      <LegalSection id="cookies" title="8. Cookies and local storage">
        <p>
          The Service uses your browser's local storage and similar technologies to keep you signed in
          and to remember preferences such as your light or dark theme. Our security providers may also
          set cookies or similar identifiers to detect and prevent abuse. These technologies are used to
          operate the Service, not for third-party advertising.
        </p>
      </LegalSection>

      <LegalSection id="children" title="9. Children's privacy">
        <p>
          The Service is intended only for adults of legal gambling age and is not directed to anyone
          under 21. We do not knowingly collect personal information from anyone under 21. If you believe a
          minor has provided us with personal information, please contact us and we will take appropriate
          steps to delete it.
        </p>
      </LegalSection>

      <LegalSection id="international" title="10. International users">
        <p>
          The Service is operated using infrastructure provided by Google and may be hosted on servers
          located in the United States or other countries. If you access the Service from outside the
          country where our infrastructure is located, you understand that your information may be
          transferred to, stored, and processed in those locations, which may have different data
          protection laws than your own.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="11. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the "Last
          updated" date and version shown above. Your continued use of the Service after an update takes
          effect means you accept the revised policy.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="12. Contact">
        <p>
          Questions or requests about this Privacy Policy or your information can be sent to{' '}
          <a href={`mailto:${LEGAL.contactEmail}`} className="text-primary hover:underline">
            {LEGAL.contactEmail}
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
