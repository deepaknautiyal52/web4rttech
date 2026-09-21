import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import services, { categories } from '../data/services';
import HeroIllustration from '../components/HeroIllustration';
import SEO from '../components/SEO';
import './Contact.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const BUDGET_RANGES = [
  'Under $1,000',
  '$1,000 – $5,000',
  '$5,000 – $15,000',
  '$15,000 – $50,000',
  '$50,000+',
  'Not sure yet'
];

const TIMELINES = ['ASAP', '1–3 months', '3–6 months', '6+ months', 'Just exploring'];

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service_interested: '',
  budget_range: '',
  timeline: '',
  subject: '',
  message: ''
};

const Contact = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(initialFormData);
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-select the service when arriving from a "Get a Quote" link, e.g. /contact?service=seo
  useEffect(() => {
    const serviceId = searchParams.get('service');
    if (serviceId && services.some((s) => s.id === serviceId)) {
      setFormData((prev) => ({ ...prev, service_interested: serviceId }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrors({});
    setErrorMessage('');

    try {
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.status === 422) {
        setErrors(data.errors || {});
        setErrorMessage('Please check the highlighted fields and try again.');
        setStatus('error');
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setFormData(initialFormData);
    } catch (err) {
      setErrorMessage('Unable to send your message right now. Please try again later.');
      setStatus('error');
    }
  };

  return (
    <main>
      <SEO
        title="Contact Us / Get a Quote"
        description="Get in touch with Web4rtTech for a free project quote. We reply within one business day and work with clients across India and internationally."
        path="/contact"
      />

      <section className="page-hero">
        <div className="container page-hero-flex">
          <div className="page-hero-text">
            <h1>Get a Quote</h1>
            <p>Tell us about your project — we typically reply within one business day</p>
          </div>
          <div className="page-hero-illustration">
            <HeroIllustration variant="contact" />
          </div>
        </div>
      </section>

      <section className="contact-content">
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-form-section">
              <h2>Tell Us About Your Project</h2>

              {status === 'success' && (
                <div className="form-alert form-alert-success">
                  Thank you for reaching out! We will get back to you soon.
                </div>
              )}
              {status === 'error' && errorMessage && (
                <div className="form-alert form-alert-error">{errorMessage}</div>
              )}

              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                  />
                  {errors.name && <span className="field-error">{errors.name[0]}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                    />
                    {errors.email && <span className="field-error">{errors.email[0]}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company Name</label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="service_interested">Service You're Interested In</label>
                  <select
                    id="service_interested"
                    name="service_interested"
                    value={formData.service_interested}
                    onChange={handleChange}
                  >
                    <option value="">Select a service...</option>
                    {categories.map((category) => (
                      <optgroup key={category.id} label={category.title}>
                        {services
                          .filter((s) => s.category === category.id)
                          .map((s) => (
                            <option key={s.id} value={s.id}>{s.title}</option>
                          ))}
                      </optgroup>
                    ))}
                    <option value="other">Something else</option>
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="budget_range">Budget Range</label>
                    <select
                      id="budget_range"
                      name="budget_range"
                      value={formData.budget_range}
                      onChange={handleChange}
                    >
                      <option value="">Select a range...</option>
                      {BUDGET_RANGES.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="timeline">Timeline</label>
                    <select
                      id="timeline"
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleChange}
                    >
                      <option value="">Select a timeline...</option>
                      {TIMELINES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="What is this about?"
                  />
                  {errors.subject && <span className="field-error">{errors.subject[0]}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us a bit more about what you're looking to build or achieve..."
                    rows="6"
                  ></textarea>
                  {errors.message && <span className="field-error">{errors.message[0]}</span>}
                </div>

                <button type="submit" className="submit-btn" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            <div className="contact-info-section">
              <h2>Contact Information</h2>

              <div className="info-card">
                <h3>Headquarters</h3>
                <p>
                  Web4rtTech<br/>
                  Near Monal Farm, Dehradun, Uttarakhand, India<br/>
                  248001
                </p>
              </div>

              <div className="info-card">
                <h3>Regional Offices</h3>
                <p>
                  We work with clients across India and internationally, with support available remotely.
                </p>
              </div>

              <div className="info-card">
                <h3>Phone</h3>
                <p>
                  <a href="tel:+918979528858">+91 7417120232</a>,{' '}
                  <a href="tel:+917017857510">+91 70178 57510</a>
                </p>
              </div>

              <div className="info-card">
                <h3>Email</h3>
                <p>
                  <a href="mailto:info@web4rttech.com">info@web4rttech.com</a>
                </p>
              </div>

              <div className="info-card">
                <h3>Business Hours</h3>
                <p>
                  Monday - Friday: 9:00 AM - 6:00 PM IST<br/>
                  Saturday & Sunday: Closed
                </p>
              </div>

              <div className="social-section">
                <h3>Follow Us</h3>
                <div className="social-icons">
                  <a href="#twitter" className="social-icon-link" aria-label="X (Twitter)">𝕏</a>
                  <a href="#facebook" className="social-icon-link" aria-label="Facebook">f</a>
                  <a href="#linkedin" className="social-icon-link" aria-label="LinkedIn">in</a>
                  <a href="#youtube" className="social-icon-link" aria-label="YouTube">▶</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;
