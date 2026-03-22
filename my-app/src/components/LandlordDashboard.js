import React, { useState } from 'react';
import './LandlordDashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { supabase } from '../auth/supabaseClient';
import axiosClient from '../api/rumi_client';

const mockListings = [
  {
    id: 1,
    title: 'Studio Room — Colombo 3',
    location: 'Colombo 3, Western Province',
    price: 'LKR 45,000 / mo',
    type: 'Studio',
    bedrooms: 1,
    status: 'active',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400&h=260',
  },
  {
    id: 2,
    title: '2BR Apartment — Kandy',
    location: 'Kandy, Central Province',
    price: 'LKR 85,000 / mo',
    type: 'Apartment',
    bedrooms: 2,
    status: 'active',
    image: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=400&h=260',
  },
  {
    id: 3,
    title: 'Annex — Galle',
    location: 'Galle, Southern Province',
    price: 'LKR 35,000 / mo',
    type: 'Annex',
    bedrooms: 1,
    status: 'review',
    image: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=400&h=260',
  },
];

const stats = [
  { label: 'Total Listings', value: 3 },
  { label: 'Active', value: 2 },
  { label: 'In Review', value: 1 },
];

const ListingCard = ({ listing, onEdit }) => (
  <div className="ld-listing-card">
    <img src={listing.image} alt={listing.title} className="ld-listing-img" />
    <div className="ld-listing-body">
      <div className="ld-listing-top">
        <div>
          <p className="ld-listing-title">{listing.title}</p>
          <p className="ld-listing-location">{listing.location}</p>
        </div>
        <span className={`ld-badge ${listing.status === 'active' ? 'ld-badge-active' : 'ld-badge-review'}`}>
          {listing.status === 'active' ? 'Active' : 'Pending Review'}
        </span>
      </div>
      <div className="ld-listing-footer">
        <span className="ld-listing-price">{listing.price}</span>
        <div className="ld-listing-meta">
          <span className="ld-listing-type">{listing.type}</span>
          <span className="ld-dot">·</span>
          <span className="ld-listing-type">{listing.bedrooms} BD</span>
        </div>
        <button className="ld-edit-btn" onClick={() => onEdit(listing)}>Edit</button>
      </div>
    </div>
  </div>
);

const LandlordDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listings] = useState(mockListings);
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
    billingCycle: 'MONTHLY'
  });
  
  const [images, setImages] = useState([]);

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
      // Require authentication
      if (!user) {
        setMessage('❌ Please log in to create listings');
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!formData.roomTitle || !formData.roomDescription || !formData.city || !formData.amount || !formData.advance) {
        setMessage('❌ Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Get auth token from session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setMessage('❌ Authentication failed. Please log in again.');
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${session.access_token}`
      };

      // Create room payload
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
          country: formData.country
        },
        price: {
          amount: parseInt(formData.amount),
          advance: parseInt(formData.advance),
          billingCycle: formData.billingCycle
        },
        amenityIds: [],
        ruleIds: [],
        paymentConditionIds: []
      };



      // Post room
      const roomRes = await axiosClient.post(
        '/rooms',
        roomPayload,
        { headers }
      );

      const roomId = roomRes.data.roomId;
      setSuccessId(roomId);
      
      // Upload images if provided
      if (images.length > 0) {
        try {
          const formDataImg = new FormData();
          images.forEach(img => formDataImg.append('image', img));
          
          console.log('Uploading', images.length, 'images to room', roomId);
          console.log('Authorization header:', headers.Authorization?.substring(0, 20) + '...');
          
          // axiosClient will automatically handle multipart headers via interceptor
          const imgRes = await axiosClient.post(
            `/rooms/${roomId}/images`,
            formDataImg,
            { 
              headers
            }
          );
          console.log('✓ Images uploaded successfully:', imgRes.data);
          setMessage(`✅ Room created! ID: ${roomId} with ${images.length} images`);
        } catch (imgErr) {
          // Room was created successfully even if image upload fails
          const errorDetail = imgErr.response?.data?.error || imgErr.response?.data?.message || imgErr.message;
          console.error('❌ Image upload failed:', errorDetail);
          console.error('Full error response:', imgErr.response?.data);
          setMessage(`✅ Room created! ID: ${roomId} but image upload failed: ${errorDetail}`);
        }
      } else {
        setMessage(`✅ Room created! ID: ${roomId}`);
      }

      // Reset form
      setFormData({
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
        billingCycle: 'MONTHLY'
      });
      setImages([]);

    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message;
      console.error('Full error:', err.response?.data);
      setMessage(`❌ Error: ${typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (listing) => {
    console.log('Edit listing:', listing.id);
  };

  const active = listings.filter(l => l.status === 'active');
  const inReview = listings.filter(l => l.status === 'review');

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
              <button className="ld-close-btn" onClick={() => setShowPostForm(false)}>✕</button>
            </div>

            {!user && (
              <div className="ld-auth-notice">
                ℹ️ <strong>Sign In</strong> to post listings with your account. Posting as guest (limited functionality).
              </div>
            )}

            {message && (
              <div className={`ld-message ${message.includes('✅') ? 'ld-success' : 'ld-error'}`}>
                {message}
                {successId && message.includes('✅') && (
                  <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid currentColor' }}>
                    <button 
                      onClick={() => navigate(`/listing/${successId}`)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'inherit',
                        cursor: 'pointer',
                        textDecoration: 'underline'
                      }}
                    >
                      👁️ View Posted Listing
                    </button>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="ld-post-form">
              {/* Room Info */}
              <fieldset className="ld-fieldset">
                <legend>Room Information</legend>
                <input
                  type="text"
                  name="roomTitle"
                  placeholder="Room Title (e.g., Spacious Bedroom in Colombo)"
                  value={formData.roomTitle}
                  onChange={handleInputChange}
                  required
                />
                <textarea
                  name="roomDescription"
                  placeholder="Describe your room, amenities, and what makes it special..."
                  value={formData.roomDescription}
                  onChange={handleInputChange}
                  rows="3"
                  required
                />
                <div className="ld-form-row">
                  <select name="genderAllowed" value={formData.genderAllowed} onChange={handleInputChange}>
                    <option value="OTHER">Any Gender</option>
                    <option value="MALE">Male Only</option>
                    <option value="FEMALE">Female Only</option>
                  </select>
                  <input
                    type="number"
                    name="maxRoommates"
                    placeholder="Max Roommates"
                    value={formData.maxRoommates}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                  />
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

              {/* Location */}
              <fieldset className="ld-fieldset">
                <legend>Location</legend>
                <div className="ld-form-row">
                  <input
                    type="text"
                    name="houseNumber"
                    placeholder="House/Apt Number"
                    value={formData.houseNumber}
                    onChange={handleInputChange}
                  />
                  <input
                    type="text"
                    name="addressLine"
                    placeholder="Street Address"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="ld-form-row">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={handleInputChange}
                  />
                </div>
              </fieldset>

              {/* Pricing */}
              <fieldset className="ld-fieldset">
                <legend>Pricing</legend>
                <div className="ld-form-row">
                  <input
                    type="number"
                    name="amount"
                    placeholder="Monthly Rent (LKR)"
                    value={formData.amount}
                    onChange={handleInputChange}
                    required
                  />
                  <input
                    type="number"
                    name="advance"
                    placeholder="Advance Required (LKR)"
                    value={formData.advance}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <select name="billingCycle" value={formData.billingCycle} onChange={handleInputChange}>
                  <option value="MONTHLY">Monthly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
              </fieldset>

              {/* Images */}
              <fieldset className="ld-fieldset">
                <legend>Room Images</legend>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {images.length > 0 && (
                  <div className="ld-image-preview">
                    {images.map((img, i) => (
                      <div key={i} className="ld-img-item">
                        <img src={URL.createObjectURL(img)} alt={`preview-${i}`} />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="ld-remove-img"
                        >✕</button>
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
              {stats.map(s => (
                <div className="ld-stat-card" key={s.label}>
                  <p className="ld-stat-value">{s.value}</p>
                  <p className="ld-stat-label">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Current Listings */}
            <div className="ld-section">
              <h3 className="ld-section-title">Current Listings</h3>
              {active.length > 0 ? (
                <div className="ld-listings-list">
                  {active.map(l => (
                    <ListingCard key={l.id} listing={l} onEdit={handleEdit} />
                  ))}
                </div>
              ) : (
                <p className="ld-empty">No active listings yet.</p>
              )}
            </div>

            {/* Listings in Review */}
            <div className="ld-section">
              <h3 className="ld-section-title">Listings in Review</h3>
              {inReview.length > 0 ? (
                <div className="ld-listings-list">
                  {inReview.map(l => (
                    <ListingCard key={l.id} listing={l} onEdit={handleEdit} />
                  ))}
                </div>
              ) : (
                <p className="ld-empty">No listings in review.</p>
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
