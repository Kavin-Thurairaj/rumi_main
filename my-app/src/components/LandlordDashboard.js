import React, { useState, useEffect, useCallback } from 'react';
import './LandlordDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../auth/supabaseClient';
import axiosClient from '../api/rumi_client';

/* ── Helpers ── */
const getAuthHeaders = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error('Not authenticated');
  return { Authorization: `Bearer ${session.access_token}` };
};

const formatPrice = (listing) => {
  if (!listing.price?.amount) return 'Price N/A';
  return `LKR ${listing.price.amount.toLocaleString('en-LK')} / ${listing.price.billingCycle?.toLowerCase() || 'mo'}`;
};

const getFirstImage = (listing) =>
  listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls[0] : null;

/* ── Listing Card ── */
const ListingCard = ({ listing, onDelete, onView, deleting }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const images = listing.imageUrls && listing.imageUrls.length > 0 ? listing.imageUrls : [];
  const imgSrc = images.length > 0 ? images[imgIdx] : null;
  const location = listing.address
    ? `${listing.address.city || ''}${listing.address.country ? ', ' + listing.address.country : ''}`
    : 'Location N/A';

  const prevImg = (e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + images.length) % images.length); };
  const nextImg = (e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % images.length); };

  return (
    <div className="ld-listing-card">
      <div className="ld-listing-img-wrap">
        {imgSrc ? (
          <img src={imgSrc} alt={listing.roomTitle} className="ld-listing-img" />
        ) : (
          <div className="ld-listing-img ld-listing-img-placeholder">
            <span>No Image</span>
          </div>
        )}
        {images.length > 1 && (
          <>
            <button className="ld-img-arrow prev" onClick={prevImg} aria-label="Previous image">&#8249;</button>
            <button className="ld-img-arrow next" onClick={nextImg} aria-label="Next image">&#8250;</button>
            <div className="ld-img-dots">
              {images.map((_, i) => (
                <div key={i} className={`ld-img-dot${i === imgIdx ? ' active' : ''}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="ld-listing-body">
        <div className="ld-listing-top">
          <div>
            <p className="ld-listing-title">{listing.roomTitle}</p>
            <p className="ld-listing-location">{location}</p>
          </div>
          <span className={`ld-badge ${listing.roomStatus === 'AVAILABLE' ? 'ld-badge-active' : 'ld-badge-review'}`}>
            {listing.roomStatus === 'AVAILABLE' ? 'Active' : listing.roomStatus || 'Pending'}
          </span>
        </div>
        <div className="ld-listing-footer">
          <span className="ld-listing-price">{formatPrice(listing)}</span>
          <div className="ld-listing-meta">
            <span className="ld-listing-type">{listing.roomType || 'Room'}</span>
            {listing.maxRoommates > 0 && (
              <>
                <span className="ld-dot">·</span>
                <span className="ld-listing-type">{listing.maxRoommates} max</span>
              </>
            )}
          </div>
          <div className="ld-listing-actions">
            <button className="ld-view-btn" onClick={() => onView(listing.roomId)}>View</button>
            <button
              className="ld-delete-btn"
              onClick={() => onDelete(listing.roomId)}
              disabled={deleting}
            >
              {deleting ? '...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ── */
const LandlordDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listings, setListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [listingsError, setListingsError] = useState('');

  const [showPostForm, setShowPostForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [successId, setSuccessId] = useState(null);

  const [formData, setFormData] = useState({
    roomTitle: '',
    roomDescription: '',
    genderAllowed: 'OTHER',
    maxRoommates: 1,
    roomStatus: 'AVAILABLE',
    roomType: 'STUDIO',
    houseNumber: '',
    addressLine: '',
    city: '',
    country: '',
    amount: '',
    advance: '',
    billingCycle: 'MONTHLY',
  });
  const [images, setImages] = useState([]);

  /* ── Fetch real listings ── */
  const fetchMyListings = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingListings(true);
      setListingsError('');
      const headers = await getAuthHeaders();
      const res = await axiosClient.get('/rooms/my-listings', { headers });
      setListings(res.data || []);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setListingsError('Could not load your listings. Please refresh.');
    } finally {
      setLoadingListings(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMyListings();
  }, [fetchMyListings]);

  /* ── Delete listing ── */
  const handleDelete = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this listing? This cannot be undone.')) return;
    try {
      setDeletingId(roomId);
      const headers = await getAuthHeaders();
      await axiosClient.delete(`/rooms/${roomId}`, { headers });
      setListings(prev => prev.filter(l => l.roomId !== roomId));
    } catch (err) {
      console.error('Error deleting listing:', err);
      alert('Failed to delete listing. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Form handlers ── */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    setSuccessId(null);

    try {
      if (!user) {
        setMessage('❌ Please log in to create listings');
        return;
      }
      if (!formData.roomTitle || !formData.roomDescription || !formData.city || !formData.amount || !formData.advance) {
        setMessage('❌ Please fill in all required fields');
        return;
      }

      const headers = await getAuthHeaders();

      const roomPayload = {
        roomTitle: formData.roomTitle,
        roomDescription: formData.roomDescription,
        genderAllowed: formData.genderAllowed,
        maxRoommates: parseInt(formData.maxRoommates) || 1,
        roomStatus: formData.roomStatus,
        roomType: formData.roomType,
        address: {
          houseNumber: parseInt(formData.houseNumber) || 1,
          addressLine: formData.addressLine || 'N/A',
          city: formData.city,
          country: formData.country,
        },
        price: {
          amount: parseInt(formData.amount),
          advance: parseInt(formData.advance),
          billingCycle: formData.billingCycle,
        },
        amenityIds: [],
        ruleIds: [],
        paymentConditionIds: [],
      };

      const roomRes = await axiosClient.post('/rooms', roomPayload, { headers });
      const roomId = roomRes.data.roomId;
      setSuccessId(roomId);

      if (images.length > 0) {
        try {
          const formDataImg = new FormData();
          images.forEach(img => formDataImg.append('image', img));
          await axiosClient.post(`/rooms/${roomId}/images`, formDataImg, { headers });
          setMessage(`✅ Room created! ID: ${roomId} with ${images.length} images`);
        } catch (imgErr) {
          const errorDetail = imgErr.response?.data?.error || imgErr.message;
          setMessage(`✅ Room created! ID: ${roomId} — image upload failed: ${errorDetail}`);
        }
      } else {
        setMessage(`✅ Room created! ID: ${roomId}`);
      }

      // Reset form
      setFormData({
        roomTitle: '', roomDescription: '', genderAllowed: 'OTHER',
        maxRoommates: 1, roomStatus: 'AVAILABLE', roomType: 'STUDIO',
        houseNumber: '', addressLine: '', city: '', country: '',
        amount: '', advance: '', billingCycle: 'MONTHLY',
      });
      setImages([]);

      // Refresh listings to show newly created one
      await fetchMyListings();

    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      setMessage(`❌ Error: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
    } finally {
      setLoading(false);
    }
  };

  /* ── Stats ── */
  const activeCount = listings.filter(l => l.roomStatus === 'AVAILABLE').length;
  const totalCount = listings.length;

  return (
    <div className="ld-page">
      {/* ── Left image panel ── */}
      <div className="ld-image-section">
        <div className="ld-logo-section">
          <div className="ld-logo"><span className="ld-logo-text">RUMI</span></div>
        </div>
        <img
          src="https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&h=900&w=600"
          alt="Property"
          className="ld-bg-image"
        />
        <div className="ld-image-overlay">
          <div className="ld-overlay-badge">Landlord</div>
          <div className="ld-overlay-text">
            <h2>Welcome back,</h2>
            <h2>Landlord</h2>
            <p className="ld-overlay-sub">Manage your spaces with ease</p>
          </div>
        </div>
      </div>

      {/* ── Right dashboard panel ── */}
      <div className="ld-dashboard-section">

        {/* POST FORM VIEW */}
        {showPostForm ? (
          <div className="ld-form-container">
            <div className="ld-form-header">
              <h2>Post New Listing</h2>
              <button className="ld-close-btn" onClick={() => { setShowPostForm(false); setMessage(''); }}>✕</button>
            </div>

            {!user && (
              <div className="ld-auth-notice">
                ℹ️ <strong>Sign In</strong> to post listings with your account.
              </div>
            )}

            {message && (
              <div className={`ld-message ${message.includes('✅') ? 'ld-success' : 'ld-error'}`}>
                {message}
                {successId && message.includes('✅') && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid currentColor' }}>
                    <button
                      onClick={() => navigate(`/listing/${successId}`)}
                      style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      👁️ View Posted Listing
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="ld-post-form">
              <fieldset className="ld-fieldset">
                <legend>Room Information</legend>
                <input type="text" name="roomTitle" placeholder="Room Title (e.g., Spacious Bedroom in Colombo)"
                  value={formData.roomTitle} onChange={handleInputChange} required />
                <textarea name="roomDescription" placeholder="Describe your room..."
                  value={formData.roomDescription} onChange={handleInputChange} rows="3" required />
                <div className="ld-form-row">
                  <select name="genderAllowed" value={formData.genderAllowed} onChange={handleInputChange}>
                    <option value="OTHER">Any Gender</option>
                    <option value="MALE">Male Only</option>
                    <option value="FEMALE">Female Only</option>
                  </select>
                  <input type="number" name="maxRoommates" placeholder="Max Roommates"
                    value={formData.maxRoommates} onChange={handleInputChange} min="1" max="10" />
                </div>
                <div className="ld-form-row-full">
                  <select name="roomStatus" value={formData.roomStatus} onChange={handleInputChange}>
                    <option value="AVAILABLE">Status: Available</option>
                    <option value="FULL">Full</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  <select name="roomType" value={formData.roomType} onChange={handleInputChange}>
                    <option value="STUDIO">Room Type: Studio</option>
                    <option value="APARTMENT">Apartment</option>
                    <option value="ANNEX">Annex</option>
                    <option value="HOUSE">House</option>
                    <option value="BOARDING">Boarding</option>
                  </select>
                </div>
              </fieldset>

              <fieldset className="ld-fieldset">
                <legend>Location</legend>
                <div className="ld-form-row">
                  <input type="text" name="houseNumber" placeholder="House/Apt Number"
                    value={formData.houseNumber} onChange={handleInputChange} />
                  <input type="text" name="addressLine" placeholder="Street Address"
                    value={formData.addressLine} onChange={handleInputChange} />
                </div>
                <div className="ld-form-row">
                  <input type="text" name="city" placeholder="City"
                    value={formData.city} onChange={handleInputChange} required />
                  <input type="text" name="country" placeholder="Country"
                    value={formData.country} onChange={handleInputChange} />
                </div>
              </fieldset>

              <fieldset className="ld-fieldset">
                <legend>Pricing</legend>
                <div className="ld-form-row">
                  <input type="number" name="amount" placeholder="Monthly Rent (LKR)"
                    value={formData.amount} onChange={handleInputChange} required />
                  <input type="number" name="advance" placeholder="Advance Required (LKR)"
                    value={formData.advance} onChange={handleInputChange} required />
                </div>
                <select name="billingCycle" value={formData.billingCycle} onChange={handleInputChange}>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </fieldset>

              <fieldset className="ld-fieldset">
                <legend>Room Images</legend>
                <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                {images.length > 0 && (
                  <div className="ld-image-preview">
                    {images.map((img, i) => (
                      <div key={i} className="ld-img-item">
                        <img src={URL.createObjectURL(img)} alt={`preview-${i}`} />
                        <button type="button" onClick={() => removeImage(i)} className="ld-remove-img">✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </fieldset>

              <button type="submit" disabled={loading} className="ld-submit-btn">
                {loading ? '📤 Posting...' : '📤 Post Listing'}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Header row */}
            <div className="ld-dashboard-header">
              <div>
                <h2 className="ld-dashboard-title">Landlord Dashboard</h2>
                <p className="ld-dashboard-subtitle">Your property overview</p>
              </div>
              <button className="ld-logout-btn" onClick={() => navigate('/login')}>Logout</button>
            </div>

            {/* Stats row */}
            <div className="ld-stats-row">
              <div className="ld-stat-card">
                <p className="ld-stat-value">{loadingListings ? '—' : totalCount}</p>
                <p className="ld-stat-label">Total Listings</p>
              </div>
              <div className="ld-stat-card">
                <p className="ld-stat-value">{loadingListings ? '—' : activeCount}</p>
                <p className="ld-stat-label">Active</p>
              </div>
            </div>

            {/* Current Listings */}
            <div className="ld-section">
              <h3 className="ld-section-title">My Listings</h3>

              {loadingListings ? (
                <p className="ld-empty">Loading your listings...</p>
              ) : listingsError ? (
                <div className="ld-listings-error">
                  <p>{listingsError}</p>
                  <button className="ld-retry-btn" onClick={fetchMyListings}>Retry</button>
                </div>
              ) : listings.length === 0 ? (
                <p className="ld-empty">No listings yet. Post your first one below!</p>
              ) : (
                <div className="ld-listings-list">
                  {listings.map(l => (
                    <ListingCard
                      key={l.roomId}
                      listing={l}
                      onDelete={handleDelete}
                      onView={(id) => navigate(`/listing/${id}`)}
                      deleting={deletingId === l.roomId}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Post New Listing CTA */}
            <button className="ld-post-btn" onClick={() => setShowPostForm(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Post New Listing
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LandlordDashboard;
