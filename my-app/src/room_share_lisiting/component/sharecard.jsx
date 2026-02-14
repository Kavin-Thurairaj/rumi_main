import "../styles/share.css";

const RoomShareCard = ({ room }) => {
  return (
    <div className="room-card">
      <img src={room.image} alt="Room" className="room-img" />

      <div className="room-info">
        <h3>{room.title}</h3>
        <p className="location">Location: {room.location}</p>
        <p className="price">LKR: {room.rent}</p>
        <p className="desc">{room.description}</p>

        <button className="request-btn">Request to Join</button>
      </div>
    </div>
  );
};

export default RoomShareCard;