import { useState } from "react";
import "../styles/sharefilter.css";

const ShareFilterBar = ({ onSearch }) => {
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [gender, setGender] = useState("");

  const handleSearch = () => {
    onSearch({ location, budget, gender });
  };

  return (
    <div className="filter-wrapper">
      <div className="filter-container">

        <div className="filter-field">
          <label>Location</label>
          <input
            type="text"
            placeholder="e.g., Colombo"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label>Budget</label>
          <select onChange={(e) => setBudget(e.target.value)}>
            <option value="">Any Budget</option>
            <option value="below20000">Below 20,000</option>
            <option value="20000to30000">20,000 - 30,000</option>
            <option value="above30000">30,000+</option>
          </select>
        </div>

        <div className="filter-field">
          <label>Roommate Gender</label>
          <select onChange={(e) => setGender(e.target.value)}>
            <option value="">Any Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <button className="search-btn" onClick={handleSearch}>
          Search
        </button>

      </div>
    </div>
  );
};

export default ShareFilterBar;

