import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MessageCircle, Calendar, Zap, FileText, CheckCircle, BarChart3, DollarSign, Lock, Users, Shield, Star, User, Building2 } from 'lucide-react';
import './HowItWorks.css';

// Map icon names to React components
const getIcon = (iconName) => {
  const iconMap = {
    '🔍': <Search size={28} />,
    '💬': <MessageCircle size={28} />,
    '🗓': <Calendar size={28} />,
    '🎉': <Zap size={28} />,
    '📝': <FileText size={28} />,
    '✅': <CheckCircle size={28} />,
    '📊': <BarChart3 size={28} />,
    '💰': <DollarSign size={28} />,
    '🔒': <Lock size={28} />,
    '🤝': <Users size={28} />,
    '🏆': <Star size={28} />,
  };
  return iconMap[iconName] || iconName;
};

const tenantSteps = [
  {
    number: '01',
    icon: '🔍',
    title: 'Search for Rooms',
    desc: 'Browse verified listings filtered by city, budget, and room type. Use our smart filters to find exactly what you need.',
  },
  {
    number: '02',
    icon: '💬',
    title: 'Contact Landlords',
    desc: 'Message landlords directly through our secure platform. Ask questions, negotiate terms, and get all the details.',
  },
  {
    number: '03',
    icon: '🗓',
    title: 'Schedule a Visit',
    desc: 'Arrange viewings at your convenience. Visit the property, meet the landlord, and make sure it feels right.',
  },
  {
    number: '04',
    icon: '🎉',
    title: 'Move In!',
    desc: 'Sign your rental agreement and move into your new space. Our platform keeps records safe for both parties.',
  },
];

const landlordSteps = [
  {
    number: '01',
    icon: '📝',
    title: 'Create Your Listing',
    desc: "Sign up and post your property in minutes \u2014 it's free. Add photos, set your price, and describe your space.",
  },
  {
    number: '02',
    icon: '✅',
    title: 'Get Verified Tenants',
    desc: 'Receive applications from verified tenants. Review profiles, check references, and choose the best fit.',
  },
  {
    number: '03',
    icon: '📊',
    title: 'Manage Everything',
    desc: 'Track applications, messages, and listing performance all in one simple dashboard. No spreadsheets needed.',
  },
  {
    number: '04',
    icon: '💰',
    title: 'Start Earning',
    desc: 'Collect rent securely and manage your tenancy with confidence. Expand your portfolio as you grow.',
  },
];

const faqs = [
  { q: 'Is Rumi Rentals free to use?',               a: 'Browsing and posting basic listings is completely free. Premium features for landlords are available at affordable rates.' },
  { q: 'How are landlords and listings verified?',    a: 'All landlords submit NIC and property ownership documents. Listings are reviewed by our team before going live.' },
  { q: 'Can I message landlords before signing up?',  a: 'You need a free account to contact landlords, which helps keep both parties protected.' },
  { q: 'What happens if I have a dispute?',           a: 'Our support team mediates disputes. All conversations and agreements on RUMI are logged and protected.' },
];

export default function HowItWorks() {
  const [tab, setTab]           = useState('tenant');
  const [openFaq, setOpenFaq]   = useState(null);

  const steps = tab === 'tenant' ? tenantSteps : landlordSteps;

  return (
    <div className="hiw-shell">

      {/* ── Top bar ── */}
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

        {/* ── Hero ── */}
        <div className="hiw-hero">
          <p className="hiw-eyebrow">Simple · Transparent · Trusted</p>
          <h1 className="hiw-hero-title">How It Works</h1>
          <p className="hiw-hero-sub">
            RUMI makes renting simple. Whether you're a tenant looking for the perfect room
            or a landlord ready to list — we've got you covered.
          </p>
        </div>

        {/* ── Tabs ── */}
        <div className="hiw-tabs" role="tablist" aria-label="Select your role">
          <button
            className={`hiw-tab${tab === 'tenant' ? ' hiw-tab--active' : ''}`}
            role="tab"
            aria-selected={tab === 'tenant'}
            onClick={() => setTab('tenant')}
          >
            <User size={16} style={{ display: 'inline', marginRight: '6px' }} /> For Tenants
          </button>
          <button
            className={`hiw-tab${tab === 'landlord' ? ' hiw-tab--active' : ''}`}
            role="tab"
            aria-selected={tab === 'landlord'}
            onClick={() => setTab('landlord')}
          >
            <Building2 size={16} style={{ display: 'inline', marginRight: '6px' }} /> For Landlords
          </button>
        </div>

        {/* ── Steps ── */}
        <div className="hiw-steps" role="tabpanel" aria-label={tab === 'tenant' ? 'For Tenants' : 'For Landlords'}>
          {steps.map((step, i) => (
            <div
              className="hiw-step"
              key={step.number}
              style={{ '--delay': `${i * 0.08}s` }}
            >
              <div className="hiw-step-num">{step.number}</div>
              <div className="hiw-step-icon" aria-hidden="true">{getIcon(step.icon)}</div>
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

        {/* ── CTA banner ── */}
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

        {/* ── FAQ ── */}
        <div className="hiw-faq-section">
          <h2 className="hiw-faq-title">Frequently Asked Questions</h2>
          <div className="hiw-faq-list">
            {faqs.map((item, i) => (
              <div
                className={`hiw-faq-item${openFaq === i ? ' hiw-faq-item--open' : ''}`}
                key={i}
              >
                <button
                  className="hiw-faq-q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  {item.q}
                  <svg
                    width="18" height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className={`hiw-faq-chevron${openFaq === i ? ' hiw-faq-chevron--up' : ''}`}
                    aria-hidden="true"
                  >
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {openFaq === i && (
                  <p className="hiw-faq-a">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Trust strip ── */}
        <div className="hiw-trust-strip">
          {[
            { icon: <Lock size={20} />, label: 'Verified Listings' },
            { icon: <Users size={20} />, label: 'Trusted by 12K+ Users' },
            { icon: <MessageCircle size={20} />, label: 'Secure Messaging' },
            { icon: <Star size={20} />, label: '4.8★ Average Rating' },
          ].map(t => (
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
