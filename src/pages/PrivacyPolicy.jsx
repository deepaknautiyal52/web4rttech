import React from 'react';
import HeroIllustration from '../components/HeroIllustration';
import SEO from '../components/SEO';
import './LegalPage.css';

const PrivacyPolicy = () => {
  return (
    <main>
      <SEO
        title="Privacy Policy"
        description="How Web4rtTech collects, uses, and protects the information you share through our contact form."
        path="/privacy"
      />

      <section className="page-hero">
        <div className="container page-hero-flex">
          <div className="page-hero-text">
            <h1>Privacy Policy</h1>
            <p>How Web4rtTech collects, uses, and protects your information</p>
          </div>
          <div className="page-hero-illustration">
            <HeroIllustration variant="contact" />
          </div>
        </div>
      </section>

      <section className="legal-content">
        <div className="container legal-wrap">
          <span className="legal-updated">Last updated: September 2026</span>

          <p className="legal-intro">
            This Privacy Policy explains what information Web4rtTech collects through this website,
            why we collect it, and how we handle it. We only collect what's actually needed to
            respond to your inquiries and run this website.
          </p>

          <div className="legal-disclaimer">
            <strong>Note:</strong> This is a general template written to accurately describe how
            this Site currently operates. It has not been drafted or reviewed by a lawyer. Before
            relying on it for a live business — especially one serving clients in regions with
            specific privacy laws (GDPR, CCPA, etc.) — please have it reviewed by a qualified
            legal professional.
          </div>

          <div className="legal-section">
            <h2>1. Information We Collect</h2>
            <p>We collect information in two ways:</p>
            <ul>
              <li>
                <strong>Contact &amp; quote form submissions:</strong> when you fill out our
                contact/quote form, we collect your name, email address, phone number, company
                name, the service you're interested in, budget range, timeline, subject, and
                message.
              </li>
              <li>
                <strong>Admin access:</strong> our internal team uses a password-protected admin
                login to review submissions. We do not collect any personal information from
                general visitors browsing the public site beyond what's submitted through the
                contact form.
              </li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>2. How We Use Your Information</h2>
            <p>Information submitted through our contact form is used only to:</p>
            <ul>
              <li>Respond to your inquiry and discuss your project</li>
              <li>Follow up with a quote or additional questions if needed</li>
              <li>Keep an internal record of leads and client communications</li>
            </ul>
            <p>We do not sell, rent, or trade your information to third parties.</p>
          </div>

          <div className="legal-section">
            <h2>3. Data Storage &amp; Security</h2>
            <p>
              Contact form submissions are stored in our secured database, accessible only to
              authenticated administrators through a password-protected admin panel. We take
              reasonable technical measures to protect this information, but no method of
              transmission or storage over the internet is 100% secure.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Cookies &amp; Local Storage</h2>
            <p>
              The public website does not currently use tracking or advertising cookies. Our admin
              panel uses your browser's local storage to keep you signed in during an admin
              session — this is not shared with or accessible to other websites. See our{' '}
              <a href="/cookies">Cookie Policy</a> for more detail.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Third-Party Services</h2>
            <p>
              We do not currently use third-party analytics or advertising tools (such as Google
              Analytics) on this Site. If that changes in the future, we will update this policy
              to describe what's added and how it affects your data.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Data Retention</h2>
            <p>
              We retain contact form submissions for as long as needed to respond to your inquiry
              and maintain reasonable business records. If you'd like your information removed
              sooner, contact us using the details below and we'll act on your request.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Your Rights</h2>
            <p>
              You can ask us at any time to tell you what information we hold about you, correct
              inaccurate information, or delete your information from our records. Reach out using
              the contact details below and we'll respond promptly.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Children's Privacy</h2>
            <p>
              This Site is intended for business inquiries and is not directed at children. We do
              not knowingly collect personal information from children under 13.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy as our website or practices change. Updates will
              be posted here with a revised "Last updated" date.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Contact Us</h2>
            <div className="legal-contact-box">
              <p>Questions about this policy or your data? Get in touch:</p>
              <p>Email: <a href="mailto:info@web4rttech.com">info@web4rttech.com</a></p>
              <p>Phone: <a href="tel:+918979528858">+91 89795 28858</a></p>
              <p>Address: Near Monal Farm, Dehradun, Uttarakhand, India 248001</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicy;
