import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import RoomCard from './RoomCard';
import { mockRooms } from './mockRooms';
import './BrowseRooms.css';

const CITIES   = [
  'All Cities', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Chilaw', 'Colombo',
  'Dambulla', 'Dehiwala', 'Galle', 'Jaffna', 'Kandy', 'Kalutara', 'Kurunegala',
  'Matara', 'Monaragala', 'Negombo', 'Nuwara Eliya', 'Panadura', 'Peradeniya',
  'Polonnaruwa', 'Ratnapura', 'Sri Jayawardenepura Kotte', 'Trincomalee',
];
const TYPES    = ['All Types', 'Studio', 'Apartment', 'Annex', 'House', 'Boarding'];
const BUDGETS  = [
  { label: 'Any Budget',   min: 0,      max: Infinity },
  { label: 'Under 30k',   min: 0,      max: 29999    },
  { label: '30k – 60k',   min: 30000,  max: 60000    },
  { label: '60k – 120k',  min: 60001,  max: 120000   },
  { label: '120k+',       min: 120001, max: Infinity  },
];

const SortOptions = ['Recommended', 'Price: Low → High', 'Price: High → Low', 'Top Rated'];

export default function BrowseRooms() {
  const [city,       setCity]       = useState('All Cities');
  const [type,       setType]       = useState('All Types');
  const [budgetIdx,  setBudgetIdx]  = useState(0);
  const [onlyAvail,  setOnlyAvail]  = useState(false);
  const [sort,       setSort]       = useState('Recommended');

  const filtered = useMemo(() => {
    const { min, max } = BUDGETS[budgetIdx];
    let rooms = mockRooms.filter(r => {
      if (city !== 'All Cities' && r.city !== city) return false;
      if (type !== 'All Types' && r.type !== type) return false;
      if (r.price < min || r.price > max)           return false;
      if (onlyAvail && !r.available)                return false;
      return true;
    });

    if (sort === 'Price: Low → High')  rooms = [...rooms].sort((a, b) => a.price - b.price);
    if (sort === 'Price: High → Low')  rooms = [...rooms].sort((a, b) => b.price - a.price);
    if (sort === 'Top Rated')          rooms = [...rooms].sort((a, b) => b.rating - a.rating);

    return rooms;
  }, [city, type, budgetIdx, onlyAvail, sort]);

  const clearFilters = () => {
    setCity('All Cities');
    setType('All Types');
    setBudgetIdx(0);
    setOnlyAvail(false);
    setSort('Recommended');
  };

  const hasFilters = city !== 'All Cities' || type !== 'All Types' || budgetIdx !== 0 || onlyAvail;

  return (
    <div className="br-shell">

      {/* ── Top bar ── */}
      <header className="br-topbar">
        <Link to="/" className="br-back-btn" aria-label="Back to home">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        <Link to="/" className="br-brand" aria-label="Rumi Rentals home">
          <div className="br-logo"><span className="br-logo-text">RUMI</span></div>
          <span className="br-brand-name">Rumi Rentals</span>
        </Link>

        <div className="br-topbar-right">
          <Link to="/login"         className="br-signin">Sign In</Link>
          <Link to="/signup/tenant" className="br-cta">Sign Up Free</Link>
        </div>
      </header>

      <main className="br-main">
        {/* ── Page title ── */}
        <div className="br-page-hd">
          <h1 className="br-page-title">Browse Rooms</h1>
          <p className="br-page-sub">Find verified rooms across Sri Lanka</p>
        </div>

        {/* ── Filter bar ── */}
        <div className="br-filters" role="search" aria-label="Filter rooms">

          {/* City */}
          <div className="br-filter-group">
            <label className="br-filter-label" htmlFor="br-city">📍 City</label>
            <select id="br-city" className="br-select" value={city} onChange={e => setCity(e.target.value)}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Type */}
          <div className="br-filter-group">
            <label className="br-filter-label" htmlFor="br-type">🏠 Type</label>
            <select id="br-type" className="br-select" value={type} onChange={e => setType(e.target.value)}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Budget */}
          <div className="br-filter-group">
            <label className="br-filter-label" htmlFor="br-budget">💰 Budget</label>
            <select id="br-budget" className="br-select" value={budgetIdx} onChange={e => setBudgetIdx(Number(e.target.value))}>
              {BUDGETS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
            </select>
          </div>

          {/* Sort */}
          <div className="br-filter-group">
            <label className="br-filter-label" htmlFor="br-sort">↕️ Sort</label>
            <select id="br-sort" className="br-select" value={sort} onChange={e => setSort(e.target.value)}>
              {SortOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Available only */}
          <label className="br-avail-check">
            <input
              type="checkbox"
              checked={onlyAvail}
              onChange={e => setOnlyAvail(e.target.checked)}
              className="br-checkbox"
            />
            Available only
          </label>

          {/* Clear filters */}
          {hasFilters && (
            <button className="br-clear-btn" onClick={clearFilters}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── Results header ── */}
        <div className="br-results-hd">
          <p className="br-results-count">
            <strong>{filtered.length}</strong> room{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* ── Room grid ── */}
        {filtered.length > 0 ? (
          <div className="br-grid">
            {filtered.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="br-empty">
            <div className="br-empty-icon">🔍</div>
            <h3 className="br-empty-title">No rooms found</h3>
            <p className="br-empty-sub">Try adjusting your filters to see more results.</p>
            <button className="br-empty-btn" onClick={clearFilters}>Clear Filters</button>
          </div>
        )}
      </main>
    </div>
  );
}
