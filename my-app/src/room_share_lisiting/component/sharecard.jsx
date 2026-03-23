import "../styles/share.css";
import { useNavigate } from "react-router-dom";

const HouseIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" fill="#bfdbfe" stroke="#2563eb" strokeWidth="1.5"/>
    <path d="M9 21V12h6v9" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const PinIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#9ca3af">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const PersonIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#9ca3af">
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);

const GroupIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#9ca3af">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="#2563eb">
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
);

const RoomShareCard = ({ room }) => {
  const navigate = useNavigate();

  return (
    <div className="room-card" onClick={() => navigate(`/share/${room.roomId}`)}>

      {/* Corner icon */}
      <div className="card-corner-icon">
        <HouseIcon size={14} />
      </div>

      {/* Type badge */}
      <span className="card-type-badge">{room.roomType || "Room"}</span>

      {/* Title */}
      <h3 className="card-title">{room.roomTitle}</h3>

      {/* Location */}
      <p className="card-location">
        <PinIcon /> {room.city}, {room.country}
      </p>

      {/* Price */}
      <p className="card-price">
        LKR {room.amount?.toLocaleString()}
        <span className="card-cycle"> / mo</span>
      </p>

      {/* Divider */}
      <div className="card-divider" />

      {/* Footer — gender + roommates + status */}
      <div className="card-footer">
        <span className="card-footer-item">
          <PersonIcon /> {room.genderAllowed}
        </span>
        <span className="card-footer-item">
          <GroupIcon /> {room.maxRoommates} max
        </span>
        <span className="card-status-pill" style={{
          background: room.roomStatus === 'AVAILABLE' ? '#dcfce7' : '#fee2e2',
          color: room.roomStatus === 'AVAILABLE' ? '#16a34a' : '#dc2626',
          marginLeft: 'auto',
        }}>
          {room.roomStatus}
        </span>
      </div>

      {/* Contact */}
      <div className="card-contact">
        <PhoneIcon />
        {room.contactNumber || "Contact via platform"}
      </div>

    </div>
  );
};

export default RoomShareCard;