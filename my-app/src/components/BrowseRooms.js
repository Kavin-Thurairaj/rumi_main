import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Home, Heart, MapPin, DollarSign, ArrowUpDown, X, Search } from 'lucide-react';
import RoomCard from './RoomCard';
import supabase from '../api/supabaseClient';
import { useAuth } from '../auth/AuthContext';
import { getUserWishlists } from '../api/wishlistService';
import './BrowseRooms.css';

const CITIES = [
  'All Cities', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Chilaw', 'Colombo',
  'Dambulla', 'Dehiwala', 'Galle', 'Jaffna', 'Kandy', 'Kalutara', 'Kurunegala',
  'Matara', 'Monaragala', 'Negombo', 'Nuwara Eliya', 'Panadura', 'Peradeniya',
  'Polonnaruwa', 'Ratnapura', 'Sri Jayawardenepura Kotte', 'Trincomalee',
];

const TYPES = ['All Types', 'Studio', 'Apartment', 'Annex', 'House', 'Boarding'];

const BUDGETS = [
  { label: 'Any Budget',  min: 0,      max: Infinity },
  { label: 'Under 30k',  min: 0,      max: 29999    },
  { label: '30k – 60k',  min: 30000,  max: 60000    },
  { label: '60k – 120k', min: 60001,  max: 120000   },
  { label: '120k+',      min: 120001, max: Infinity  },
];

const SortOptions = ['Recommended', 'Price: Low → High', 'Price: High → Low', 'Top Rated'];

export default function BrowseRooms() {
  const { user } = useAuth();
  const [city,      setCity]      = useState('All Cities');
  const [type,      setType]      = useState('All Types');
  const [budgetIdx, setBudgetIdx] = useState(0);
  const [onlyAvail, setOnlyAvail] = useState(false);
  const [sort,      setSort]      = useState('Recommended');
  const [rooms,     setRooms]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [showWishlist, setShowWishlist] = useState(false);
  const [wishlistRooms, setWishlistRooms] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, [city, budgetIdx, onlyAvail, type]);

  // Fetch wishlisted rooms when user logs in
  useEffect(() => {
    if (user) {
      fetchWishlistRooms();
    }
  }, [user]);

  const fetchWishlistRooms = async () => {
    if (!user) return;
    
    setWishlistLoading(true);
    try {
      // Get wishlist items for user
      const wishlists = await getUserWishlists(user.id);
      const wishlistRoomIds = wishlists.map(w => w.room_id);
      
      if (wishlistRoomIds.length === 0) {
        setWishlistRooms([]);
        setWishlistLoading(false);
        return;
      }
      
      // Fetch room data for all wishlisted rooms
      const { data: roomData, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .in('roomid', wishlistRoomIds);
      
      if (fetchError) throw fetchError;
      
      // Fetch images for each wishlisted room
      const roomsWithImages = await Promise.all((roomData || []).map(async (room) => {
        let images = ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'];
        
        try {
          const { data: storageFiles } = await supabase.storage
            .from('RoomImages')
            .list(String(room.roomid), { limit: 10 });

          if (storageFiles && storageFiles.length > 0) {
            const fileUrls = storageFiles
              .filter(f => f.name.length > 0)
              .map(file => {
                const { data: urlData } = supabase.storage
                  .from('RoomImages')
                  .getPublicUrl(`${room.roomid}/${file.name}`);
                return urlData?.publicUrl;
              })
              .filter(url => url);
            
            if (fileUrls.length > 0) images = fileUrls;
          }
        } catch (imgErr) {
          console.warn(`Could not fetch images for room ${room.roomid}:`, imgErr);
        }

        return {
          id: room.roomid,
          title: room.roomtitle,
          location: `${room.city}, ${room.country}`,
          price: room.amount,
          type: room.roomtype || 'Apartment',
          images: images,
          available: room.roomstatus === 'AVAILABLE',
          rating: room.avgrating || 0,
          reviews: room.totalreviews || 0,
          bedrooms: room.bedrooms || room.maxroommates,
          bathrooms: room.bathrooms || 1,
          city: room.city
        };
      }));
      
      setWishlistRooms(roomsWithImages);
    } catch (err) {
      console.error('Error fetching wishlisted rooms:', err);
      setWishlistRooms([]);
    } finally {
      setWishlistLoading(false);
    }
  };

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const { min, max } = BUDGETS[budgetIdx];
<<<<<<< HEAD
      
      // Build Supabase query
      let query = supabase
        .from('rooms')
        .select('*')
        .eq('roomstatus', 'AVAILABLE');
      
      // Apply city filter
      if (city !== 'All Cities') {
        query = query.eq('city', city);
      }
      
      // Apply price filter
      if (min > 0) {
        query = query.gte('amount', min);
      }
      if (max !== Infinity) {
        query = query.lte('amount', max);
      }
      
      const { data, error: fetchError } = await query;
      
      if (fetchError) throw fetchError;
      
      // Fetch images for each room in parallel
      const roomsWithImages = await Promise.all((data || []).map(async (room) => {
        let images = ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688']; // Fallback
        
        try {
          const { data: storageFiles, error: storageError } = await supabase.storage
            .from('RoomImages')
            .list(String(room.roomid), { limit: 10 });

          if (!storageError && storageFiles && storageFiles.length > 0) {
            const fileUrls = storageFiles
              .filter(f => f.name.length > 0)
              .map(file => {
                const { data: urlData } = supabase.storage
                  .from('RoomImages')
                  .getPublicUrl(`${room.roomid}/${file.name}`);
                return urlData?.publicUrl;
              })
              .filter(url => url);
            
            if (fileUrls.length > 0) {
              images = fileUrls;
              console.log(`✓ Loaded ${fileUrls.length} images for room ${room.roomid}`);
            }
          }
        } catch (imgErr) {
          console.warn(`Could not fetch images for room ${room.roomid}:`, imgErr);
        }

        return {
          id: room.roomid,
          title: room.roomtitle,
          location: `${room.city}, ${room.country}`,
          price: room.amount,
          type: room.roomtype || 'Apartment',
          images: images,
          available: room.roomstatus === 'AVAILABLE',
          rating: room.avgrating || 0,
          reviews: room.totalreviews || 0,
          bedrooms: room.bedrooms || room.maxroommates,
          bathrooms: room.bathrooms || 1,
          city: room.city
        };
=======
      const filters = {
        city: city === 'All Cities' ? null : city,
        minPrice: min === 0 ? null : min,
        maxPrice: max === Infinity ? null : max,
        roomStatus: onlyAvail ? 'AVAILABLE' : null,
        roomType: type === 'All Types' ? null : type.toUpperCase(),
      };
      const response = await roomFilterApi.searchRooms(filters, 0, 50);
      const mappedRooms = response.data.content.map(room => ({
        id: room.roomId,
        title: room.roomTitle,
        location: `${room.city}, ${room.country}`,
        price: room.amount,
        type: room.roomType,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'],
        available: room.roomStatus === 'AVAILABLE',
        rating: 4.5,
        reviews: 0,
        bedrooms: room.maxRoommates,
        bathrooms: 1,
        city: room.city
>>>>>>> origin/main
      }));
      
      setRooms(roomsWithImages);
    } catch (err) {
      setError("Could not load rooms. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const filtered = useMemo(() => {
    // Use wishlist rooms or regular rooms based on view
    const source = showWishlist ? wishlistRooms : rooms;
    
    let result = [...source];
    if (sort === 'Price: Low → High') result = result.sort((a, b) => a.price - b.price);
    if (sort === 'Price: High → Low') result = result.sort((a, b) => b.price - a.price);
    if (sort === 'Top Rated') result = result.sort((a, b) => b.rating - a.rating);
    return result;
}, [rooms, wishlistRooms, sort, showWishlist]);

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
          <Link to="/login" className="br-signin">Sign In</Link>
          <Link to="/signup/tenant" className="br-cta">Sign Up Free</Link>
        </div>
      </header>

      <main className="br-main">
        <div className="br-page-hd">
          <h1 className="br-page-title">Browse Rooms</h1>
          <p className="br-page-sub">Find verified rooms across Sri Lanka</p>
        </div>

        {/* View Tabs */}
        <div className="br-view-tabs">
          <button 
            className={`br-tab ${!showWishlist ? 'br-tab--active' : ''}`}
            onClick={() => setShowWishlist(false)}
          >
            <Home size={16} style={{ display: 'inline', marginRight: '6px' }} />
            All Rooms
          </button>
          {user && (
            <button 
              className={`br-tab ${showWishlist ? 'br-tab--active' : ''}`}
              onClick={() => setShowWishlist(true)}
            >
              <Heart size={16} style={{ display: 'inline', marginRight: '6px' }} />
              Rooms I Like ({wishlistRooms.length})
=======
        <div className="br-filters" role="search" aria-label="Filter rooms">

          <div className="br-filter-group">
            <label className="br-filter-label" htmlFor="br-city">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginRight: 5, flexShrink: 0}}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              City
            </label>
            <select id="br-city" className="br-select" value={city} onChange={e => setCity(e.target.value)}>
              {CITIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="br-filter-group">
            <label className="br-filter-label" htmlFor="br-type">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 5, flexShrink: 0}}>
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
                <path d="M9 21V12h6v9"/>
              </svg>
              Type
            </label>
            <select id="br-type" className="br-select" value={type} onChange={e => setType(e.target.value)}>
              {TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          <div className="br-filter-group">
            <label className="br-filter-label" htmlFor="br-budget">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 5, flexShrink: 0}}>
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
              Budget
            </label>
            <select id="br-budget" className="br-select" value={budgetIdx} onChange={e => setBudgetIdx(Number(e.target.value))}>
              {BUDGETS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
            </select>
          </div>

          <div className="br-filter-group">
            <label className="br-filter-label" htmlFor="br-sort">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 5, flexShrink: 0}}>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="15" y2="12"/>
                <line x1="3" y1="18" x2="9" y2="18"/>
              </svg>
              Sort
            </label>
            <select id="br-sort" className="br-select" value={sort} onChange={e => setSort(e.target.value)}>
              {SortOptions.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <label className="br-avail-check">
            <input
              type="checkbox"
              checked={onlyAvail}
              onChange={e => setOnlyAvail(e.target.checked)}
              className="br-checkbox"
            />
            Available only
          </label>

          {hasFilters && (
            <button className="br-clear-btn" onClick={clearFilters}>
              ✕ Clear
>>>>>>> origin/main
            </button>
          )}
        </div>

        <div className="br-filters" role="search" aria-label="Filter rooms">
          {!showWishlist && (
            <>
              <div className="br-filter-group">
                <label className="br-filter-label" htmlFor="br-city"><MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> City</label>
                <select id="br-city" className="br-select" value={city} onChange={e => setCity(e.target.value)}>
                  {CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="br-filter-group">
                <label className="br-filter-label" htmlFor="br-type"><Home size={12} style={{ display: 'inline', marginRight: '4px' }} /> Type</label>
                <select id="br-type" className="br-select" value={type} onChange={e => setType(e.target.value)}>
                  {TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div className="br-filter-group">
                <label className="br-filter-label" htmlFor="br-budget"><DollarSign size={12} style={{ display: 'inline', marginRight: '4px' }} /> Budget</label>
                <select id="br-budget" className="br-select" value={budgetIdx} onChange={e => setBudgetIdx(Number(e.target.value))}>
                  {BUDGETS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
                </select>
              </div>

              <div className="br-filter-group">
                <label className="br-filter-label" htmlFor="br-sort"><ArrowUpDown size={12} style={{ display: 'inline', marginRight: '4px' }} /> Sort</label>
                <select id="br-sort" className="br-select" value={sort} onChange={e => setSort(e.target.value)}>
                  {SortOptions.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              <label className="br-avail-check">
                <input
                  type="checkbox"
                  checked={onlyAvail}
                  onChange={e => setOnlyAvail(e.target.checked)}
                  className="br-checkbox"
                />
                Available only
              </label>

              {hasFilters && (
                <button className="br-clear-btn" onClick={clearFilters}>
                  <X size={14} style={{ display: 'inline', marginRight: '4px' }} /> Clear
                </button>
              )}
            </>
          )}
          {showWishlist && (
            <div className="br-filter-group">
              <label className="br-filter-label" htmlFor="br-sort"><ArrowUpDown size={12} style={{ display: 'inline', marginRight: '4px' }} /> Sort</label>
              <select id="br-sort" className="br-select" value={sort} onChange={e => setSort(e.target.value)}>
                {SortOptions.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}
        </div>

        <div className="br-results-hd">
          <p className="br-results-count">
            <strong>{filtered.length}</strong> room{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {showWishlist && wishlistLoading ? (
          <p style={{ textAlign: 'center' }}>Loading saved rooms...</p>
        ) : !showWishlist && loading ? (
          <p style={{ textAlign: 'center' }}>Loading rooms...</p>
        ) : showWishlist && !user ? (
          <div className="br-empty">
            <div className="br-empty-icon"><Heart size={48} /></div>
            <h3 className="br-empty-title">Sign in to save rooms</h3>
            <p className="br-empty-sub">Log in to start saving your favorite rooms.</p>
            <Link to="/login" className="br-empty-btn">Sign In</Link>
          </div>
        ) : error && !showWishlist ? (
          <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>
        ) : filtered.length > 0 ? (
          <div className="br-grid">
            {filtered.map(room => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <div className="br-empty">
            <div className="br-empty-icon">{showWishlist ? <Heart size={48} /> : <Search size={48} />}</div>
            <h3 className="br-empty-title">
              {showWishlist ? 'No saved rooms' : 'No rooms found'}
            </h3>
            <p className="br-empty-sub">
              {showWishlist 
                ? 'Start adding rooms to your wishlist.' 
                : 'Try adjusting your filters to see more results.'}
            </p>
            {!showWishlist && (
              <button className="br-empty-btn" onClick={clearFilters}>Clear Filters</button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}