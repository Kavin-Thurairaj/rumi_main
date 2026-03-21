import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockRooms } from './mockRooms';
import RoomCard from './RoomCard';
import './ListingPage.css';

/* ── Amenity icon map ── */
const amenityIcons = {
  'WiFi':           '📶',
  'Air Conditioning':'❄️',
  'Hot Water':      '🚿',
  'Parking':        '🚗',
  'Security':       '🔒',
  'Furnished':      '🛋️',
  'Garden':         '🌿',
  'Balcony':        '🏠',
  'Sea View':       '🌊',
  'Gym':            '💪',
  'Pool':           '🏊',
  'Generator':      '⚡',
  'Shared Kitchen': '🍳',
  'Common Area':    '🪑',
  'Quiet':          '🎵',
};

/* ── Icon components ── */
const IconBack = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 12H5"/><path d="m12 5-7 7 7 7"/>
  </svg>
);

const IconShare = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);

const IconPin = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

const IconBed = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>
  </svg>
);

const IconBath = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><line x1="10" y1="5" x2="8" y2="7"/><line x1="2" y1="12" x2="22" y2="12"/>
  </svg>
);

const IconRuler = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m1 6 4.5 4.5M5 2l4 4"/><rect width="20" height="8" x="2" y="8" rx="1"/><path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01"/>
  </svg>
);

const IconCheck = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const IconUser = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

/* ── Star Rating ── */
const StarRating = ({ rating, size = 'md' }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const fs = size === 'lg' ? '1.1rem' : '0.9rem';
  return (
    <span className="lst-stars" aria-label={`${rating} out of 5 stars`} style={{ fontSize: fs }}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full)          return <span key={i} className="lst-star filled">★</span>;
        if (i === full && half) return <span key={i} className="lst-star half">★</span>;
        return                        <span key={i} className="lst-star">★</span>;
      })}
    </span>
  );
};

/* ══════════════════════════════════════════
   ListingPage
══════════════════════════════════════════ */
const ListingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const room = mockRooms.find(r => r.id === Number(id));

  const [activeImg, setActiveImg]     = useState(0);
  const [contacted, setContacted]     = useState(false);
  const [shareMsg, setShareMsg]       = useState('');

  /* ── Nearby rooms ── */
  const similar = mockRooms.filter(r => r.id !== Number(id)).slice(0, 3);

  /* ── Share ── */
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setShareMsg('Link copied!');
    setTimeout(() => setShareMsg(''), 2200);
  };

  /* ── 404 ── */
  if (!room) {
    return (
      <div className="lst-shell">
        <div className="lst-container">
          <div className="lst-notfound">
            <p className="lst-notfound-icon">🔍</p>
            <h2>Listing not found</h2>
            <p>The room you're looking for doesn't exist or has been removed.</p>
            <button className="lst-back-inline" onClick={() => navigate('/home')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const landlordInitials = room.landlord.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="lst-shell">
      <div className="lst-container">

        {/* ── Navbar ── */}
        <header className="lst-navbar">
          <button className="lst-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
            <IconBack />
            <span>Back</span>
          </button>

          <div className="lst-nav-brand">
            <div className="lst-logo"><span className="lst-logo-text">RUMI</span></div>
            <span className="lst-brand-name">Rumi Rentals</span>
          </div>

          <button className="lst-share-btn" onClick={handleShare} aria-label="Share listing">
            <IconShare />
            <span>{shareMsg || 'Share'}</span>
          </button>
        </header>

        {/* ── Image gallery ── */}
        <div className="lst-gallery">
          <div className="lst-gallery-main" onClick={() => {}}>
            <img
              src={room.images[activeImg]}
              alt={`${room.title} — photo ${activeImg + 1}`}
              className="lst-gallery-main-img"
            />
            {room.images.length > 1 && (
              <span className="lst-gallery-count-pill">
                📷 {room.images.length} photos
              </span>
            )}
          </div>

          {room.images.length > 1 && (
            <div className="lst-gallery-thumbs">
              {room.images.slice(1, 3).map((img, i) => (
                <button
                  key={i}
                  className={`lst-thumb${activeImg === i + 1 ? ' active' : ''}`}
                  onClick={() => setActiveImg(i + 1)}
                  aria-label={`View photo ${i + 2}`}
                >
                  <img src={img} alt={`${room.title} thumbnail ${i + 2}`} loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Content area ── */}
        <div className="lst-content">

          {/* ── Left: main details ── */}
          <div className="lst-main">

            {/* Title + badges */}
            <div className="lst-title-section">
              <div className="lst-title-row">
                <h1 className="lst-title">{room.title}</h1>
                <span className={`lst-avail-badge ${room.available ? 'avail' : 'unavail'}`}>
                  {room.available ? '● Available' : '● Unavailable'}
                </span>
              </div>
              <p className="lst-location">
                <IconPin />
                {room.location}
              </p>

              <div className="lst-meta-chips">
                <span className="lst-meta-chip">
                  <IconBed /> {room.bedrooms} Bedroom{room.bedrooms !== 1 ? 's' : ''}
                </span>
                <span className="lst-meta-chip">
                  <IconBath /> {room.bathrooms} Bathroom{room.bathrooms !== 1 ? 's' : ''}
                </span>
                <span className="lst-meta-chip">
                  <IconRuler /> {room.sqft.toLocaleString()} sq ft
                </span>
                <span className="lst-meta-chip lst-type-chip">{room.type}</span>
              </div>

              <div className="lst-rating-row">
                <StarRating rating={room.rating} size="lg" />
                <span className="lst-rating-val">{room.rating}</span>
                <span className="lst-rating-count">({room.reviews} reviews)</span>
              </div>
            </div>

            <div className="lst-divider" />

            {/* About */}
            <div className="lst-section">
              <h2 className="lst-section-title">About this space</h2>
              <p className="lst-description">{room.description}</p>
            </div>

            <div className="lst-divider" />

            {/* Amenities */}
            <div className="lst-section">
              <h2 className="lst-section-title">Amenities</h2>
              <div className="lst-amenities-grid">
                {room.amenities.map(a => (
                  <div className="lst-amenity" key={a}>
                    <span className="lst-amenity-icon" aria-hidden="true">
                      {amenityIcons[a] || '✅'}
                    </span>
                    <span className="lst-amenity-label">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lst-divider" />

            {/* House rules */}
            <div className="lst-section">
              <h2 className="lst-section-title">House Rules</h2>
              <ul className="lst-rules-list">
                {room.rules.map(rule => (
                  <li className="lst-rule" key={rule}>
                    <span className="lst-rule-icon"><IconCheck /></span>
                    {rule}
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* ── Right: booking sidebar ── */}
          <aside className="lst-sidebar">

            {/* Price card */}
            <div className="lst-price-card">
              <div className="lst-price-top">
                <div>
                  <span className="lst-sidebar-price">
                    LKR {room.price.toLocaleString('en-LK')}
                  </span>
                  <span className="lst-sidebar-per"> / month</span>
                </div>
                <div className="lst-sidebar-rating">
                  <span className="lst-star-sm">★</span>
                  <span className="lst-rating-sm">{room.rating}</span>
                </div>
              </div>

              {room.available ? (
                <>
                  <button
                    className={`lst-cta-btn${contacted ? ' done' : ''}`}
                    onClick={() => setContacted(true)}
                  >
                    {contacted ? '✓ Request Sent!' : 'Request to View'}
                  </button>
                  {contacted && (
                    <p className="lst-cta-msg">
                      The landlord will contact you shortly.
                    </p>
                  )}
                </>
              ) : (
                <div className="lst-unavailable-msg">
                  This listing is currently unavailable.
                </div>
              )}

              <div className="lst-price-note">Free to enquire · No fees</div>
            </div>

            {/* Landlord card */}
            <div className="lst-landlord-card">
              <h3 className="lst-landlord-heading">Your Landlord</h3>
              <div className="lst-landlord-info">
                <div className="lst-landlord-avatar">
                  <IconUser />
                </div>
                <div>
                  <p className="lst-landlord-name">{room.landlord.name}</p>
                  <p className="lst-landlord-since">Member since {room.landlord.joined}</p>
                </div>
              </div>
              <button
                className="lst-msg-btn"
                onClick={() => alert(`Message feature coming soon!`)}
              >
                Message Landlord
              </button>
            </div>

          </aside>
        </div>

        {/* ── Similar Rooms ── */}
        <div className="lst-similar-section">
          <div className="lst-similar-hd">
            <h2 className="lst-similar-title">Similar Rooms</h2>
            <p className="lst-similar-desc">Other spaces you might like</p>
          </div>
          <div className="lst-similar-grid">
            {similar.map(r => (
              <RoomCard key={r.id} room={r} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListingPage;
