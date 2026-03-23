import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HowItWorks.css';

const Icons = {
  search: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#003f8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
    </svg>
  ),
  message: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#003f8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  calendar: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#003f8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
  home: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#003f8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/>
    </svg>
  ),
  edit: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#003f8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  check: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#003f8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  chart: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#003f8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
    </svg>
  ),
  money: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#003f8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
    </svg>
  ),
  lock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#003f8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#003f8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  chat: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#003f8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  star: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#003f8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
};

const tenantSteps = [
  { number: '01', icon: Icons.search,   title: 'Search for Rooms',    desc: 'Browse verified listings filtered by city, budget, and room type. Use our smart filters to find exactly what you need.' },
  { number: '02', icon: Icons.message,  title: 'Contact Landlords',   desc: 'Message landlords directly through our secure platform. Ask questions, negotiate terms, and get all the details.' },
  { number: '03', icon: Icons.calendar, title: 'Schedule a Visit',    desc: 'Arrange viewings at your convenience. Visit the property, meet the landlord, and make sure it feels right.' },
  { number: '04', icon: Icons.home,     title: 'Move In!',            desc: 'Sign your rental agreement and move into your new space. Our platform keeps records safe for both parties.' },
];

const landlordSteps = [
  { number: '01', icon: Icons.edit,  title: 'Create Your Listing',  desc: "Sign up and post your property in minutes — it's free. Add photos, set your price, and describe your space." },
  { number: '02', icon: Icons.check, title: 'Get Verified Tenants', desc: 'Receive applications from verified tenants. Review profiles, check references, and choose the best fit.' },
  { number: '03', icon: Icons.chart, title: 'Manage Everything',    desc: 'Track applications, messages, and listing performance all in one simple dashboard. No spreadsheets needed.' },
  { number: '04', icon: Icons.money, title: 'Start Earning',        desc: 'Collect rent securely and manage your tenancy with confidence. Expand your portfolio as you grow.' },
];

const trustItems = [
  { icon: Icons.lock,  label: 'Verified Listings'    },
  { icon: Icons.users, label: 'Trusted by 12K+ Users' },
  { icon: Icons.chat,  label: 'Secure Messaging'      },
  { icon: Icons.star,  label: '4.8★ Average Rating'   },
];

const faqs = [
  { q: 'Is Rumi Rentals free to use?',              a: 'Browsing and posting basic listings is completely free. Premium features for landlords are available at affordable rates.' },
  { q: 'How are landlords and listings verified?',   a: 'All landlords submit NIC and property ownership documents. Listings are reviewed by our team before going live.' },
  { q: 'Can I message landlords before signing up?', a: 'You need a free account to contact landlords, which helps keep both parties protected.' },
  { q: 'What happens if I have a dispute?',          a: 'Our support team mediates disputes. All conversations and agreements on RUMI are logged and protected.' },
];

export default function HowItWorks() {
  const [tab, setTab]         = useState('tenant');
  const [openFaq, setOpenFaq] = useState(null);
  const steps = tab === 'tenant' ? tenantSteps : landlordSteps;

  return (
    <div className="hiw-shell">

      <header className="hiw-topbar">
        <Link to="/" className="hiw-back-btn" aria-label="Back to home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>
        <Link to="/" className="hiw-brand" aria-label="Rumi Rentals home">
          <div className="hiw-logo"><span className="hiw-logo-text">RUMI</span></div>
          <span className="hiw-brand-name">Rumi Rentals</span>
        </Link>
        <div className="hiw-topbar-right">
          <Link to="/login"         className="hiw-signin">Sign In</Link>
          <Link to="/signup/tenant" className="hiw-cta">Get Started Free</Link>
        </div>
      </header>

      <main className="hiw-main">

        <div className="hiw-hero">
          <p className="hiw-eyebrow">Simple · Transparent · Trusted</p>
          <h1 className="hiw-hero-title">How It Works</h1>
          <p className="hiw-hero-sub">
            RUMI makes renting simple. Whether you're a tenant looking for the perfect room
            or a landlord ready to list — we've got you covered.
          </p>
        </div>

        <div className="hiw-tabs" role="tablist" aria-label="Select your role">
          <button
            className={`hiw-tab${tab === 'tenant' ? ' hiw-tab--active' : ''}`}
            role="tab" aria-selected={tab === 'tenant'}
            onClick={() => setTab('tenant')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:6}}>
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            For Tenants
          </button>
          <button
            className={`hiw-tab${tab === 'landlord' ? ' hiw-tab--active' : ''}`}
            role="tab" aria-selected={tab === 'landlord'}
            onClick={() => setTab('landlord')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:6}}>
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/>
            </svg>
            For Landlords
          </button>
        </div>

        <div className="hiw-steps" role="tabpanel">
          {steps.map((step, i) => (
            <div className="hiw-step" key={step.number} style={{ '--delay': `${i * 0.08}s` }}>
              <div className="hiw-step-num">{step.number}</div>
              <div className="hiw-step-icon" aria-hidden="true">{step.icon}</div>
              <h3 className="hiw-step-title">{step.title}</h3>
              <p className="hiw-step-desc">{step.desc}</p>
              {i < steps.length - 1 && (
                <div className="hiw-step-arrow" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="#003f8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="hiw-cta-band">
          <div className="hiw-cta-inner">
            <h2 className="hiw-cta-title">
              {tab === 'tenant' ? 'Ready to find your perfect room?' : 'Ready to list your property?'}
            </h2>
            <p className="hiw-cta-sub">
              {tab === 'tenant'
                ? 'Join thousands of tenants who found their home through RUMI.'
                : 'Join hundreds of landlords earning reliably through RUMI.'}
            </p>
            <div className="hiw-cta-btns">
              {tab === 'tenant' ? (
                <>
                  <Link to="/rooms"         className="hiw-cta-primary">Browse Rooms</Link>
                  <Link to="/signup/tenant" className="hiw-cta-secondary">Create Free Account</Link>
                </>
              ) : (
                <>
                  <Link to="/signup/landlord"    className="hiw-cta-primary">List Your Property Free</Link>
                  <Link to="/dashboard/landlord" className="hiw-cta-secondary">Landlord Dashboard</Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="hiw-faq-section">
          <h2 className="hiw-faq-title">Frequently Asked Questions</h2>
          <div className="hiw-faq-list">
            {faqs.map((item, i) => (
              <div className={`hiw-faq-item${openFaq === i ? ' hiw-faq-item--open' : ''}`} key={i}>
                <button className="hiw-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                  {item.q}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    className={`hiw-faq-chevron${openFaq === i ? ' hiw-faq-chevron--up' : ''}`} aria-hidden="true">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {openFaq === i && <p className="hiw-faq-a">{item.a}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="hiw-trust-strip">
          {trustItems.map(t => (
            <div className="hiw-trust-item" key={t.label}>
              <span className="hiw-trust-icon">{t.icon}</span>
              <span className="hiw-trust-label">{t.label}</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}