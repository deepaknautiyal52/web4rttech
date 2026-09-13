import React from 'react';
import HeroIllustration from '../components/HeroIllustration';
import SEO from '../components/SEO';
import './LegalPage.css';

const TermsOfUse = () => {
  return (
    <main>
      <SEO
        title="Terms of Use"
        description="The terms and conditions that govern your use of the Web4rtTech website."
        path="/terms"
      />

      <section className="page-hero">
        <div className="container page-hero-flex">
          <div className="page-hero-text">
            <h1>Terms of Use</h1>
            <p>The terms that govern your use of the Web4rtTech website</p>
          </div>
          <div className="page-hero-illustration">
            <HeroIllustration variant="about" />
          </div>
        </div>
      </section>

      <section className="legal-content">
        <div className="container legal-wrap">
          <span className="legal-updated">Last updated: September 2026</span>

          <p className="legal-intro">
            These Terms of Use ("Terms") govern your access to and use of the Web4rtTech website
            (the "Site"). By using the Site, you agree to these Terms. If you do not agree, please
            do not use the Site.
          </p>

          <div className="legal-disclaimer">
            <strong>Note:</strong> This is a general template intended to give visitors a clear,
            good-faith overview of how this Site may be used. It has not been drafted or reviewed
            by a lawyer and should not be treated as legal advice. Before relying on it for a live
            business, please have it reviewed by a qualified legal professional for your
            jurisdiction.
          </div>

          <div className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using this Site, you confirm that you accept these Terms and agree
              to comply with them. If you are using the Site on behalf of a company or other
              entity, you confirm that you have the authority to bind that entity to these Terms.
            </p>
          </div>

          <div className="legal-section">
            <h2>2. Use of the Website</h2>
            <p>You agree to use this Site only for lawful purposes. You must not:</p>
            <ul>
              <li>Use the Site in any way that breaches applicable local, national, or international law</li>
              <li>Attempt to gain unauthorized access to any part of the Site, its servers, or the admin systems behind it</li>
              <li>Introduce viruses, malware, or other harmful material through the Site</li>
              <li>Use automated systems (bots, scrapers) to extract content from the Site without our prior written consent</li>
            </ul>
          </div>

          <div className="legal-section">
            <h2>3. Services Described</h2>
            <p>
              Information about our services, process, and pricing on this Site is provided for
              general informational purposes. Final scope, timelines, and pricing for any project
              are agreed separately in writing (e.g. a proposal or contract) between Web4rtTech and
              the client before work begins.
            </p>
          </div>

          <div className="legal-section">
            <h2>4. Intellectual Property</h2>
            <p>
              Unless otherwise stated, the Site and all content on it — including text, graphics,
              logos, and the "Web4rtTech" name and mark — are the property of Web4rtTech or its licensors
              and are protected by applicable intellectual property laws. You may view and print
              pages from the Site for personal, non-commercial use, but may not reproduce,
              republish, or distribute content from the Site without our prior written permission.
            </p>
          </div>

          <div className="legal-section">
            <h2>5. Submissions Through Our Contact Form</h2>
            <p>
              When you submit an inquiry through our contact or quote form, you're giving us
              permission to use that information to respond to you and evaluate your request. See
              our <a href="/privacy">Privacy Policy</a> for details on how that information is
              handled.
            </p>
          </div>

          <div className="legal-section">
            <h2>6. Third-Party Links</h2>
            <p>
              This Site may contain links to third-party websites (for example, our social media
              profiles). We are not responsible for the content, accuracy, or practices of any
              linked third-party sites.
            </p>
          </div>

          <div className="legal-section">
            <h2>7. Disclaimer of Warranties</h2>
            <p>
              This Site is provided on an "as is" and "as available" basis. While we work to keep
              information accurate and the Site available, we make no warranties, express or
              implied, regarding the Site's operation, availability, or the accuracy of its
              content.
            </p>
          </div>

          <div className="legal-section">
            <h2>8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Web4rtTech shall not be liable for any indirect,
              incidental, or consequential damages arising from your use of, or inability to use,
              this Site.
            </p>
          </div>

          <div className="legal-section">
            <h2>9. Governing Law</h2>
            <p>
              These Terms are governed by the laws of India, and any disputes relating to them
              will be subject to the exclusive jurisdiction of the courts located in Uttarakhand,
              India.
            </p>
          </div>

          <div className="legal-section">
            <h2>10. Changes to These Terms</h2>
            <p>
              We may update these Terms from time to time. Changes will be posted on this page
              with an updated "Last updated" date. Continued use of the Site after changes are
              posted constitutes acceptance of the revised Terms.
            </p>
          </div>

          <div className="legal-section">
            <h2>11. Contact Us</h2>
            <div className="legal-contact-box">
              <p>If you have questions about these Terms, reach out to us:</p>
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

export default TermsOfUse;
