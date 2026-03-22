import { useState, useEffect } from "react";
import ShareFilterBar from "../component/ShareFilterBar";
import RoomShareCard from "../component/sharecard";
import Footer from "../component/footer";
import roomFilterApi from "../../api/roomFilterApi";
import "../styles/share.css";
import "../styles/sharefilter.css";
import { Link } from 'react-router-dom';

const RoomShareListing = () => {
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { fetchRooms({}); }, []);

  const fetchRooms = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await roomFilterApi.searchRooms(filters);
      setFilteredRooms(response.data.content);
    } catch (err) {
      setError("Could not load rooms. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    const converted = { ...filters };
    if (filters.budget === "below20000") {
      converted.maxPrice = 20000;
    } else if (filters.budget === "20000to30000") {
      converted.minPrice = 20000;
      converted.maxPrice = 30000;
    } else if (filters.budget === "above30000") {
      converted.minPrice = 30000;
    }
    delete converted.budget;
    fetchRooms(converted);
  };

  return (
    <>
      {/* ── NAV ── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.85rem 1.5rem', background: '#ffffff',
        borderBottom: '1px solid #e6eeff',
        boxShadow: '0 2px 10px rgba(0,30,80,0.05)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          color: '#003f8a', fontSize: '0.86rem', fontWeight: 600,
          textDecoration: 'none', padding: '0.38rem 0.75rem',
          borderRadius: '8px', border: '1.5px solid #c8d9ff', background: '#f0f5ff',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        <Link to="/" style={{
          display: 'flex', alignItems: 'center', gap: '0.55rem',
          textDecoration: 'none',
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
        }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(140deg, #003f8a 0%, #0057b8 100%)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 3px 10px rgba(0,87,184,0.28)',
          }}>
            <span style={{ color: '#fff', fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>RUMI</span>
          </div>
          <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0b1d40' }}>
            Rumi Rentals
          </span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Link to="/login" style={{
            padding: '0.42rem 0.9rem', borderRadius: 8, color: '#003f8a',
            fontSize: '0.86rem', fontWeight: 600, textDecoration: 'none',
            border: '1.5px solid #c8d9ff',
          }}>Sign In</Link>
          <Link to="/signup/tenant" style={{
            padding: '0.45rem 1rem', borderRadius: 9,
            background: 'linear-gradient(135deg, #003f8a 0%, #0057b8 100%)',
            color: '#fff', fontSize: '0.86rem', fontWeight: 700,
            textDecoration: 'none', boxShadow: '0 3px 12px rgba(0,87,184,0.28)',
          }}>Sign Up Free</Link>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1a4fa8 0%, #1e3a6e 55%, #0f2147 100%)',
        padding: '36px 48px 40px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: '-60px', top: '-60px',
          width: '280px', height: '280px', borderRadius: '50%',
          border: '40px solid rgba(255,255,255,0.05)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', right: '120px', bottom: '-80px',
          width: '180px', height: '180px', borderRadius: '50%',
          border: '30px solid rgba(255,255,255,0.04)', pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(255,255,255,0.12)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '20px', padding: '4px 14px',
          fontSize: '11.5px', fontWeight: 600,
          color: 'rgba(255,255,255,0.9)', marginBottom: '14px',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
          Sri Lanka's #1 Room Sharing Platform
        </div>

        <h1 style={{
          fontSize: '32px', fontWeight: 800, color: '#fff',
          margin: '0 0 10px', letterSpacing: '-0.5px', lineHeight: 1.15,
        }}>
          Shared Room Listings
        </h1>

        <p style={{
          fontSize: '14px', color: 'rgba(255,255,255,0.68)',
          margin: '0 0 26px', maxWidth: '460px', lineHeight: 1.65,
        }}>
          Find verified housemates and affordable rooms across Sri Lanka.
          Post your ad — it's free and takes under 2 minutes.
        </p>

        <Link to="/share/post" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#fff', color: '#1a4fa8',
          fontWeight: 700, fontSize: '14px',
          padding: '11px 22px', borderRadius: '10px',
          textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
        }}>
          <span style={{
            width: 22, height: 22, background: '#1a4fa8', borderRadius: 6,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 17, lineHeight: 1,
          }}>+</span>
          Post a Room Ad
        </Link>
      </div>

      {/* ── FILTER BAR ── */}
      <ShareFilterBar onSearch={handleSearch} />

      {/* ── LISTINGS ── */}
      <div className="listing-wrapper">
        <div className="room-list">
          {loading ? (
            <p style={{ textAlign: "center" }}>Loading rooms...</p>
          ) : error ? (
            <p style={{ textAlign: "center", color: "red" }}>{error}</p>
          ) : filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <RoomShareCard key={room.roomId} room={room} />
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No rooms found</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RoomShareListing;