import React, { useRef } from "react";
import { Star, MapPin, Home } from "lucide-react";
import "./roomshareexpand.css";

function App() {
  const scrollContainer = useRef(null);

  const scroll = (direction) => {
    if (scrollContainer.current) {
      const scrollAmount = 200;
      if (direction === 'left') {
        scrollContainer.current.scrollLeft -= scrollAmount;
      } else {
        scrollContainer.current.scrollLeft += scrollAmount;
      }
    }
  };

  return (
    <div className="container">

      {/* LEFT SIDE */}
      <div className="left">

        <img
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85"
          alt="Room"
          className="main-img"
        />

        <h2>Private Room in Modern Shared Apartment</h2>

        <p className="location">
          <Star size={16} style={{ display: 'inline', marginRight: '4px' }} /> 4.9 (23 reviews) | <MapPin size={16} style={{ display: 'inline', marginRight: '4px' }} /> Colombo, City Center
        </p>

        {/* House Rules */}
        <div className="box">
          <h3>House Rules</h3>
          <ul>
            <li>Quiet hours: 10 PM - 8 AM</li>
            <li>Guests allowed with notice</li>
            <li>No smoking</li>
          </ul>
        </div>

        {/* Map */}
        <div className="box">
          <h3>Location</h3>

          <iframe
            title="map"
            src="https://maps.google.com/maps?q=colombo&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="map"
          ></iframe>
        </div>

        {/* Logo under map */}
        <div className="footer-logo">
          <img src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7" alt="Logo" className="logo-img" />
          <p>© 2026 Rumi Rooms</p>
        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="right">

        {/* Owner & Booking Container */}
        <div className="top-boxes">
          {/* Owner */}
          <div className="box owner">
            <h3>Owner</h3>
            <p><b>Yohan</b> (Verified)</p>
            <button className="btn contact">Contact</button>
          </div>

          {/* New Box */}
          <div className="box" onClick={() => window.location.href = '/private-room'} style={{cursor: 'pointer'}}>
            <h3>Private Room</h3>
            <p>View room not shared with roommate</p>
            <p>Details & photos</p>
            <button className="btn">View Room</button>
          </div>
        </div>

        {/* Room Details */}
        <div className="box">
          <h3>Room Details</h3>

          <p>🛏 Private Bedroom</p>
          <p>🚿 Shared Bathroom</p>
          <p>👥 3 People Total</p>
          <p><Home size={16} style={{ display: 'inline', marginRight: '4px' }} />3 Bed, 2 Bath</p>
        </div>

        {/* Amenities */}
        <div className="box">
          <h3>Amenities</h3>

          <ul>
            <li>📶 High-Speed WiFi</li>
            <li>🚗 Free Parking</li>
            <li>❄ Air Conditioning</li>
          </ul>
        </div>

        {/* Roommates */}
        <div className="box">
          <h3>Your Roommates</h3>

          <p>Alex (28) - Works from home</p>
          <p>Sam (24) - Works from home</p>
        </div>

        {/* Other Room Sharing Posts */}
        <div className="box">
          <h3>Other Room Sharing Posts</h3>
          <div className="scroll-container">
            <button className="scroll-btn scroll-left" onClick={() => scroll('left')}>❮</button>
            <div className="room-scroll" ref={scrollContainer}>
              <div className="room-card" onClick={() => window.location.href = '/room/modern-studio'}>
                <img src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688" alt="Room" />
                <h4>Modern Studio</h4>
                <p><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />Colombo, Galle Road</p>
                <p className="price">Rs. 25,000/month</p>
              </div>

              <div className="room-card" onClick={() => window.location.href = '/room/cozy-apartment'}>
                <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994" alt="Room" />
                <h4>Cozy Apartment</h4>
                <p><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />Colombo, Fort</p>
                <p className="price">Rs. 30,000/month</p>
              </div>

              <div className="room-card" onClick={() => window.location.href = '/room/shared-house'}>
                <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267" alt="Room" />
                <h4>Shared House</h4>
                <p><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />Colombo, Rajagiriya</p>
                <p className="price">Rs. 20,000/month</p>
              </div>

              <div className="room-card" onClick={() => window.location.href = '/room/luxury-room'}>
                <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2" alt="Room" />
                <h4>Luxury Room</h4>
                <p><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />Colombo, Bambalapitiya</p>
                <p className="price">Rs. 35,000/month</p>
              </div>

              <div className="room-card" onClick={() => window.location.href = '/room/budget-room'}>
                <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6" alt="Room" />
                <h4>Budget Room</h4>
                <p><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />Colombo, Dehiwala</p>
                <p className="price">Rs. 15,000/month</p>
              </div>
            </div>
            <button className="scroll-btn scroll-right" onClick={() => scroll('right')}>❯</button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default App;