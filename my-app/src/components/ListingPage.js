import React, { useState, useEffect, memo, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import RoomCard from './RoomCard';
import axiosClient from '../api/rumi_client';
import supabase from '../api/supabaseClient';
import { createBooking, checkExistingBooking } from './rating_system/services/bookingService';
import { useAuth } from '../auth/AuthContext';
import Footer from './Footer';
import './ListingPage.css';

// Lazy load heavy components
const RateRoom = lazy(() => import('./rating_system/component/rateRoom'));
const RatingDisplay = lazy(() => import('./rating_system/component/ratingDisplay'));

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
  const { user, profile, loading: authLoading } = useAuth();

  // States for room data and images
  const [room, setRoom] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similar, setSimilar] = useState([]);

  const [activeImg, setActiveImg]     = useState(0);
  const [contacted, setContacted]     = useState(false);
  const [shareMsg, setShareMsg]       = useState('');
  const [isBooking, setIsBooking]     = useState(false);
  const [bookingMsg, setBookingMsg]   = useState('');
  const [booked, setBooked]           = useState(false);
  const [userReview, setUserReview]   = useState(null);
  
  // Check if user is tenant
  const isTenant = profile?.role === 'Tenant' || profile?.role === 'RENTEE';
  const canReview = user && isTenant && booked;

  // Normalize room data from Supabase to match UI expectations
  const normalizeRoomData = (rawData) => {
    if (!rawData) return null;
    return {
      ...rawData,
      roomid: rawData.roomid,  // Explicitly preserve the database roomid (BIGINT)
      id: rawData.id,           // Explicitly preserve the database id (BIGSERIAL)
      roomTitle: rawData.roomtitle || rawData.title || 'Unnamed Room',
      roomDescription: rawData.roomdescription || rawData.description || '',
      roomStatus: rawData.roomstatus || 'AVAILABLE',
      amount: rawData.amount || rawData.price || 0,
      maxRoommates: rawData.maxroommates || 1,
      roomType: rawData.roomtype || 'Apartment',
      allergies: rawData.allergies || [],
      amenities: rawData.amenities || [],
      address: rawData.address || {
        addressLine: rawData.addressline || '',
        city: rawData.city || '',
        country: rawData.country || ''
      },
      renter: rawData.renter || {
        full_name: rawData.rentername || 'Landlord',
        profileImage: rawData.renterimage || ''
      },
      avgRating: rawData.avgrating || 0,
      totalReviews: rawData.totalreviews || 0
    };
  };

  // Fetch room data directly from Supabase
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        
        // Get roomId from URL param
        const roomIdStr = String(id).trim();
        const roomId = parseInt(roomIdStr, 10);
        
        console.log('Fetching room - URL id:', id, 'parsed roomId:', roomId);

        // Query Supabase for the room
        const { data: roomsData, error: queryError } = await supabase
          .from('rooms')
          .select('*')
          .eq('roomid', roomId);

        if (queryError || !roomsData || roomsData.length === 0) {
          console.error('Room not found:', { roomId, queryError });
          setError('Room not found');
          setLoading(false);
          return;
        }

        const rawRoomData = roomsData[0];
        const roomData = normalizeRoomData(rawRoomData);
        setRoom(roomData);
        console.log('✓ Fetched room:', roomData);

        // Fetch images from Supabase Storage
        // Use the actual roomid from the database, not the URL param
        const actualRoomId = rawRoomData.roomid || roomId;
        console.log('🖼️ Fetching images for roomId:', actualRoomId);
        
        try {
          const { data: storageFiles, error: storageError } = await supabase.storage
            .from('RoomImages')
            .list(String(actualRoomId), {
              limit: 100,
              offset: 0,
              sortBy: { column: 'name', order: 'asc' }
            });

          console.log('Storage response:', { storageError, fileCount: storageFiles?.length });

          if (!storageError && storageFiles && storageFiles.length > 0) {
            const fileUrls = storageFiles.map(file => {
              const { data: urlData } = supabase.storage
                .from('RoomImages')
                .getPublicUrl(`${actualRoomId}/${file.name}`);
              console.log('Image URL:', urlData?.publicUrl);
              return urlData?.publicUrl;
            }).filter(url => url);

            console.log('✓ Found', fileUrls.length, 'images');
            setImages(fileUrls.length > 0 ? fileUrls : ['https://via.placeholder.com/800x600?text=Room+Image']);
          } else {
            console.warn('No images found in storage');
            setImages(['https://via.placeholder.com/800x600?text=Room+Image']);
          }
        } catch (imgErr) {
          console.warn('Could not fetch images:', imgErr);
          setImages(['https://via.placeholder.com/800x600?text=Room+Image']);
        }

        // Check if already booked
        if (user) {
          const { data: bookingData, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('user_id', user.id)
            .eq('room_id', roomId);

          if (!bookingError && bookingData && bookingData.length > 0) {
            setBooked(true);
          }
        }

        setError(null);
      } catch (err) {
        console.error('Error fetching room:', err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchRoomData();
    }
  }, [id, user, authLoading]);

  /* ── Share ── */
  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setShareMsg('Link copied!');
    setTimeout(() => setShareMsg(''), 2200);
  };

  /* ── Book Room ── */
  const handleBook = async () => {
    if (!user) {
      alert('Please log in to book a room');
      navigate('/login');
      return;
    }

    if (!isTenant) {
      alert('Only tenants can book rooms. Please sign up as a tenant.');
      navigate('/signup/tenant');
      return;
    }

    setIsBooking(true);
    try {
      const effectiveRoomId = room.roomid || room.id || room.roomId;
      console.log('Booking params - userId:', user.id, 'type:', typeof user.id);
      console.log('Booking params - roomId candidates:', { 'room.roomid': room.roomid, 'room.id': room.id, 'room.roomId': room.roomId });
      console.log('Effective roomId:', effectiveRoomId, 'type:', typeof effectiveRoomId);
      
      if (!user.id) {
        setBookingMsg('Error: User ID not found. Please log in again.');
        setTimeout(() => setBookingMsg(''), 3000);
        setIsBooking(false);
        return;
      }

      if (!effectiveRoomId) {
        setBookingMsg('Error: Room ID not found.');
        setTimeout(() => setBookingMsg(''), 3000);
        setIsBooking(false);
        return;
      }

      const result = await createBooking(user.id, effectiveRoomId);

      if (result && result.length > 0) {
        setBooked(true);
        setBookingMsg('✓ Room booked successfully!');
        setTimeout(() => setBookingMsg(''), 3000);
      } else {
        console.error('Booking failed - no result data returned');
        setBookingMsg('Failed to book room. Please check the console and try again.');
        setTimeout(() => setBookingMsg(''), 5000);
      }
    } catch (error) {
      console.error('Error booking room:', error);
      const errorMsg = error.message || error.toString();
      setBookingMsg(`Error: ${errorMsg}`);
      setTimeout(() => setBookingMsg(''), 5000);
    } finally {
      setIsBooking(false);
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="lst-shell">
        <div className="lst-container">
          <div className="lst-notfound">
            <p className="lst-notfound-icon">⏳</p>
            <h2>Loading room details...</h2>
          </div>
        </div>
      </div>
    );
  }

  /* ── 404 / Not Found ── */
  if (!room) {
    return (
      <div className="lst-shell">
        <div className="lst-container">
          <div className="lst-notfound">
            <p className="lst-notfound-icon">🔍</p>
            <h2>Listing not found</h2>
            <p>The room you're looking for doesn't exist or has been removed.</p>
            {error && <p style={{fontSize: '0.9rem', color: '#999'}}>Error: {error}</p>}
            <button className="lst-back-inline" onClick={() => navigate('/home')}>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const landlordName = room.renter?.full_name || 'Landlord';
  const landlordInitials = landlordName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

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
              src={images.length > 0 ? images[activeImg] : 'https://via.placeholder.com/800x600?text=No+Image'}
              alt={`${room.roomTitle} — photo ${activeImg + 1}`}
              className="lst-gallery-main-img"
            />
            {images.length > 1 && (
              <span className="lst-gallery-count-pill">
                📷 {images.length} photos
              </span>
            )}
          </div>

          {images.length > 1 && (
            <div className="lst-gallery-thumbs">
              {images.slice(1, 3).map((img, i) => (
                <button
                  key={i}
                  className={`lst-thumb${activeImg === i + 1 ? ' active' : ''}`}
                  onClick={() => setActiveImg(i + 1)}
                  aria-label={`View photo ${i + 2}`}
                >
                  <img src={img} alt={`${room.roomTitle} thumbnail ${i + 2}`} loading="lazy" />
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
                <h1 className="lst-title">{room.roomTitle}</h1>
                <span className={`lst-avail-badge ${room.roomStatus === 'AVAILABLE' ? 'avail' : 'unavail'}`}>
                  {room.roomStatus === 'AVAILABLE' ? '● Available' : `● ${room.roomStatus}`}
                </span>
              </div>
              {room.address && (
                <p className="lst-location">
                  <IconPin />
                  {`${room.address.addressLine || ''}, ${room.address.city || 'Unknown'}, ${room.address.country || ''}`}
                </p>
              )}

              <div className="lst-meta-chips">
                <span className="lst-meta-chip">
                  <IconBed /> {room.maxRoommates || 1} Max Roommate{room.maxRoommates !== 1 ? 's' : ''}
                </span>
                {room.roomType && (
                  <span className="lst-meta-chip lst-type-chip">{room.roomType}</span>
                )}
              </div>
            </div>

            <div className="lst-divider" />

            {/* About */}
            <div className="lst-section">
              <h2 className="lst-section-title">About this space</h2>
              <p className="lst-description">{room.roomDescription}</p>
            </div>

            <div className="lst-divider" />

            {/* Amenities */}
            <div className="lst-section">
              <h2 className="lst-section-title">Amenities</h2>
              <div className="lst-amenities-grid">
                {room.amenities && room.amenities.length > 0 ? (
                  room.amenities.map(a => (
                    <div className="lst-amenity" key={a.amenityId || a.name}>
                      <span className="lst-amenity-icon" aria-hidden="true">
                        {amenityIcons[a.name] || '✅'}
                      </span>
                      <span className="lst-amenity-label">{a.name}</span>
                    </div>
                  ))
                ) : (
                  <p style={{ gridColumn: '1 / -1', color: '#999' }}>No amenities listed</p>
                )}
              </div>
            </div>

            <div className="lst-divider" />

            {/* House rules */}
            <div className="lst-section">
              <h2 className="lst-section-title">House Rules</h2>
              <ul className="lst-rules-list">
                {room.rules && room.rules.length > 0 ? (
                  room.rules.map(rule => (
                    <li className="lst-rule" key={rule.ruleId || rule.ruleName}>
                      <span className="lst-rule-icon"><IconCheck /></span>
                      {rule.ruleName || rule}
                    </li>
                  ))
                ) : (
                  <li className="lst-rule" style={{ color: '#999' }}>No specific rules listed</li>
                )}
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
                    {room.price ? `LKR ${room.price.amount?.toLocaleString('en-LK') || 'N/A'}` : 'Price on request'}
                  </span>
                  <span className="lst-sidebar-per"> / {room.price?.billingCycle?.toLowerCase() || 'month'}</span>
                </div>
              </div>

              {room.roomStatus === 'AVAILABLE' ? (
                <>
                  <button
                    className={`lst-cta-btn${booked ? ' done' : ''}`}
                    onClick={handleBook}
                    disabled={isBooking || booked}
                    aria-busy={isBooking}
                  >
                    {isBooking ? '⏳ Booking...' : booked ? '✓ Booked!' : 'Book Now'}
                  </button>
                  {bookingMsg && (
                    <p className={`lst-cta-msg ${booked ? 'success' : 'error'}`}>
                      {bookingMsg}
                    </p>
                  )}
                  {booked && (
                    <p className="lst-cta-msg success">
                      Confirmation has been sent. You can now rate this room.
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
                <p className="lst-landlord-name">{landlordName}</p>
                  <p className="lst-landlord-since">Contact: {room.renter?.phone_number || 'Available on request'}</p>
                </div>
              </div>
              <button
                className="lst-msg-btn"
                onClick={() => alert(`Message feature coming soon!`)}
              >
                Message Landlord
              </button>
            </div>

            {/* Rating Display */}
            {room && (
              <div className="lst-rating-display">
                <h3 className="lst-section-title">Room Ratings</h3>
                <Suspense fallback={<p style={{color: '#999'}}>Loading ratings...</p>}>
                  <RatingDisplay roomId={room.roomid || room.id || id} />
                </Suspense>
              </div>
            )}
          </aside>
        </div>

        {/* ── Similar rooms ── */}
        {similar.length > 0 && (
          <div className="lst-divider">
            <div className="lst-similar-section">
              <h2 className="lst-similar-hd">Similar Rooms</h2>
              <div className="lst-similar-grid">
                {similar.map(r => (
                  <RoomCard key={r.id} room={r} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Authenticated Review Section ── */}
        {room && (
          <div className="lst-review-section">
            {user && isTenant && booked ? (
              // Logged in tenant who booked
              <div className="lst-rating-form-section">
                <h2 className="lst-section-title">Share Your Experience</h2>
                <Suspense fallback={<p style={{color: '#999'}}>Loading review form...</p>}>
                  <RateRoom roomId={room.roomid || room.id || id} userId={user.id} onReviewSubmitted={(review) => setUserReview(review)} />
                </Suspense>
              </div>
            ) : !user ? (
              // Not logged in
              <div style={{ padding: '2rem', backgroundColor: '#f0f9ff', borderRadius: '12px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '1rem' }}>Want to share your review?</h3>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>Log in as a tenant and book this room to leave a review.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={() => navigate('/login')} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Log In</button>
                  <button onClick={() => navigate('/signup/tenant')} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Sign Up</button>
                </div>
              </div>
            ) : !isTenant ? (
              // Logged in but not a tenant
              <div style={{ padding: '2rem', backgroundColor: '#fef3c7', borderRadius: '12px', border: '1px solid #fcd34d', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '1rem' }}>Not a tenant yet?</h3>
                <p style={{ color: '#666', marginBottom: '1.5rem' }}>Switch to a tenant account to book and review rooms.</p>
                <button onClick={() => navigate('/signup/tenant')} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Become a Tenant</button>
              </div>
            ) : user && isTenant && !booked ? (
              // Logged in tenant but hasn't booked
              <div style={{ padding: '2rem', backgroundColor: '#f5f3ff', borderRadius: '12px', border: '1px solid #ddd6fe', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '1rem' }}>Book first to review</h3>
                <p style={{ color: '#666' }}>Book this room above to unlock the review feature and share your experience.</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingPage;
