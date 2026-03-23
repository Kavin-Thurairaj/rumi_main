import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BedDouble, ShowerHead } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../api/wishlistService';
import './RoomCard.css';

const formatPrice = (price) =>
  `LKR ${price.toLocaleString('en-LK')}`;

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span className="rc-stars" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full)          return <span key={i} className="rc-star filled">★</span>;
        if (i === full && half) return <span key={i} className="rc-star half">★</span>;
        return                        <span key={i} className="rc-star">★</span>;
      })}
    </span>
  );
};

const PinIcon = () => (
  <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const HeartIcon = ({ filled }) => (
  <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">
    <path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke="currentColor"
      strokeWidth="2"
      fill={filled ? 'currentColor' : 'none'}
    />
  </svg>
);

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClick = () => navigate(`/listing/${room.id}`);

  // Check if room is in wishlist on mount
  useEffect(() => {
    const checkWishlist = async () => {
      if (!user || !room.id) {
        return
      }

      const inWishlist = await isInWishlist(user.id, room.id)
      setWishlisted(inWishlist)
    }

    checkWishlist()
  }, [user, room.id])

  const handleWishlist = async (e) => {
    e.stopPropagation();
    
    if (!user) {
      alert('Please log in to save rooms');
      return
    }

    if (wishlisted) {
      // Remove from wishlist
      const result = await removeFromWishlist(user.id, room.id)
      if (!result.error) {
        setWishlisted(false)
      }
    } else {
      // Add to wishlist
      const result = await addToWishlist(user.id, room.id)
      if (!result.error) {
        setWishlisted(true)
      }
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Use fallback image if primary image fails to load
  const imageSource = imageError || !room.images || room.images.length === 0
    ? 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800'
    : room.images[0];

  return (
    <article
      className="rc-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label={`View listing: ${room.title}`}
    >
      {/* ── Image ── */}
      <div className="rc-img-wrap">
        <img
          src={imageSource}
          alt={room.title}
          className="rc-img"
          loading="lazy"
          onError={handleImageError}
        />

        <span className="rc-type-badge">{room.type}</span>

        {!room.available && (
          <div className="rc-unavailable-overlay">
            <span className="rc-unavailable-badge">Unavailable</span>
          </div>
        )}

        <button
          className={`rc-heart${wishlisted ? ' active' : ''}`}
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <HeartIcon filled={wishlisted} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className="rc-body">
        <div>
          <h3 className="rc-title">{room.title}</h3>
          <p className="rc-location">
            <PinIcon />
            {room.location}
          </p>
        </div>

        <div className="rc-price-row">
          <span className="rc-price">{formatPrice(room.price)}</span>
          <span className="rc-price-unit">&nbsp;/ mo</span>
        </div>

        <div className="rc-footer">
          <div className="rc-rating">
            <StarRating rating={room.rating} />
            <span className="rc-reviews">({room.reviews})</span>
          </div>
          <div className="rc-chips">
            <span className="rc-chip" aria-label={`${room.bedrooms} bedroom${room.bedrooms !== 1 ? 's' : ''}`}>
              <BedDouble size={12} aria-hidden="true" /> {room.bedrooms}
            </span>
            <span className="rc-chip" aria-label={`${room.bathrooms} bathroom${room.bathrooms !== 1 ? 's' : ''}`}>
              <ShowerHead size={12} aria-hidden="true" /> {room.bathrooms}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RoomCard;
