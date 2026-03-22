import "../styles/share.css";
import { useNavigate } from "react-router-dom";

const ROOM_IMAGES = [
  "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/439227/pexels-photo-439227.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=400",
  "https://images.pexels.com/photos/2631746/pexels-photo-2631746.jpeg?auto=compress&cs=tinysrgb&w=400",
];

const RoomShareCard = ({ room }) => {
  const navigate = useNavigate();

  // cycles through images based on roomId so each card looks different
  const imageUrl = ROOM_IMAGES[room.roomId % ROOM_IMAGES.length];

  return (
    <div className="room-card" onClick={() => navigate(`/share/${room.roomId}`)}>
      <img
        src={imageUrl}
        alt="Room"
        className="room-img"
      />

      <div className="room-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ margin: '0 0 4px', fontSize: '16px', color: '#0b1d40', fontWeight: 700 }}>
            {room.roomTitle}
          </h3>
          <span style={{
            background: room.roomStatus === 'AVAILABLE' ? '#dcfce7' : '#fee2e2',
            color: room.roomStatus === 'AVAILABLE' ? '#16a34a' : '#dc2626',
            fontSize: '11px', fontWeight: 700, padding: '3px 10px',
            borderRadius: '20px', whiteSpace: 'nowrap',
          }}>
            {room.roomStatus}
          </span>
        </div>

        <p className="location">📍 {room.city}, {room.country}</p>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0 6px' }}>
          📌 {room.addressLine}
        </p>
        <p className="price">LKR {room.amount?.toLocaleString()} / {room.billingCycle}</p>
        <p className="desc">{room.roomDescription}</p>

        <div style={{ display: 'flex', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>
            👤 Gender: <strong>{room.genderAllowed}</strong>
          </p>
          <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>
            🏠 Max Roommates: <strong>{room.maxRoommates}</strong>
          </p>
        </div>

        <button
          className="request-btn"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Request sent for "${room.roomTitle}"! Feature coming soon.`);
          }}
        >
          Request to Join
        </button>
      </div>
    </div>
  );
};

export default RoomShareCard;