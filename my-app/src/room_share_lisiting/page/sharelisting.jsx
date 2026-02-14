import { useState } from "react";
import Header from "../component/shareheader";
import ShareFilterBar from "../component/ShareFilterBar";
import RoomShareCard from "../component/sharecard";
import roomShareData from "../data/sharedata";
import Footer from "../component/footer";
import "../styles/share.css";
import "../styles/sharefilter.css";
import "../styles/shareheader.css";

const RoomShareListing = () => {
  const [filteredRooms, setFilteredRooms] = useState(roomShareData);

  const handleSearch = (filters) => {
    const results = roomShareData.filter(room => {

      const matchLocation =
        !filters.location ||
        room.location.toLowerCase().includes(filters.location.toLowerCase());

      const matchBudget = () => {
        if (!filters.budget) return true;

        if (filters.budget === "below20000")
          return room.rent < 20000;

        if (filters.budget === "20000to30000")
          return room.rent >= 20000 && room.rent <= 30000;

        if (filters.budget === "above30000")
          return room.rent > 30000;

        return true;
      };


      const matchGender =
        !filters.gender ||
        room.gender === filters.gender;

      return matchLocation && matchGender && matchBudget();
    });

    setFilteredRooms(results);
  };

  return (
    <>
      <Header />
      <ShareFilterBar onSearch={handleSearch} />

      <main className="listing-container">
        {filteredRooms.length > 0 ? (
          filteredRooms.map(room => (
            <RoomShareCard key={room.id} room={room} />
          ))
        ) : (
          <p style={{textAlign: "center"}}>No rooms found</p>
        )}
      </main>

      <Footer />
    </>
  );
};

export default RoomShareListing;
