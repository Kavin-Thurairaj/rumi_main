import "../styles/share.css";

const RoomShareCard = ({ room }) => {
  return (
    <div className="room-card">
      <img src="" alt="Room" className="room-img" />
      <div className="room-info">
        <h3>{room.roomTitle}</h3>
        <p className="location">Location: {room.city}, {room.country}</p>
        <p className="price">LKR: {room.amount} / {room.billingCycle}</p>
        <p className="desc">{room.roomDescription}</p>
        <p className="gender">Gender: {room.genderAllowed}</p>
        <p className="spots">Max Roommates: {room.maxRoommates}</p>
        <button className="request-btn">Request to Join</button>
      </div>
    </div>
  );
};

export default RoomShareCard;
