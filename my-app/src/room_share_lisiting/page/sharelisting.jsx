import { useState, useEffect } from "react";
import Header from "../component/shareheader";
import ShareFilterBar from "../component/ShareFilterBar";
import RoomShareCard from "../component/sharecard";
import Footer from "../component/footer";
import roomFilterApi from "../../api/roomFilterApi";
import "../styles/share.css";
import "../styles/sharefilter.css";
import "../styles/shareheader.css";

const RoomShareListing = () => {
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all rooms when page loads
  useEffect(() => {
    fetchRooms({});
  }, []);

  const fetchRooms = async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const response = await roomFilterApi.searchRooms(filters);
      setFilteredRooms(response.data.content);
    } catch (err) {
      setError("Could not load rooms. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    // Convert budget to minPrice/maxPrice
    const converted = { ...filters };
    if (filters.budget === "below20000") {
      converted.maxPrice = 20000;
    } else if (filters.budget === "20000to30000") {
      converted.minPrice = 20000;
      converted.maxPrice = 30000;
    } else if (filters.budget === "above30000") {
      converted.minPrice = 30000;
    }
    delete converted.budget;
    fetchRooms(converted);
  };

  return (
    <>
      <Header />
      <ShareFilterBar onSearch={handleSearch} />
      <main className="listing-container">
        {loading ? (
          <p style={{ textAlign: "center" }}>Loading rooms...</p>
        ) : error ? (
          <p style={{ textAlign: "center", color: "red" }}>{error}</p>
        ) : filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomShareCard key={room.roomId} room={room} />
          ))
        ) : (
          <p style={{ textAlign: "center" }}>No rooms found</p>
        )}
      </main>
      <Footer />
    </>
  );
};

export default RoomShareListing;