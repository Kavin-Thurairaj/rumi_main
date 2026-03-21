import { useState } from "react";
import "../styles/sharefilter.css";

const CITIES = [
  'All Cities', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Chilaw', 'Colombo',
  'Dambulla', 'Dehiwala', 'Galle', 'Jaffna', 'Kandy', 'Kalutara', 'Kurunegala',
  'Matara', 'Monaragala', 'Negombo', 'Nuwara Eliya', 'Panadura', 'Peradeniya',
  'Polonnaruwa', 'Ratnapura', 'Sri Jayawardenepura Kotte', 'Trincomalee',
];

const ShareFilterBar = ({ onSearch }) => {
  const [city, setCity] = useState("All Cities");
  const [budget, setBudget] = useState("");
  const [gender, setGender] = useState("");

  const handleSearch = () => {
      console.log("City being sent:", city);
    onSearch({
      city: city === "All Cities" ? "" : city,
      budget,
      genderAllowed: gender
    });
  };

  return (
    <div className="filter-wrapper">
      <div className="filter-container">

        <div className="filter-field">
          <label>Location</label>
          <select onChange={(e) => setCity(e.target.value)}>
            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
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
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
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