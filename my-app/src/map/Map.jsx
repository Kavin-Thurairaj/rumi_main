import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GOOGLE_API_KEY = "AIzaSyA0nSgh3fK83f9dm06PdMpqqXUdH35xPtw";

const FALLBACK_LOCATIONS = [
  { id: 1, name: "Room in Colombo 3",  area: "Colombo 3",  price: 25000, lat: 6.9101, lng: 79.8737 },
  { id: 2, name: "Room in Nugegoda",   area: "Nugegoda",   price: 18000, lat: 6.8731, lng: 79.8894 },
  { id: 3, name: "Room in Dehiwala",   area: "Dehiwala",   price: 22000, lat: 6.8519, lng: 79.8652 },
];

const AREA_OPTIONS = [
  { label: "All Areas",    value: "",             lat: 6.9271, lng: 79.8612, zoom: 12 },
  { label: "Colombo 1",    value: "colombo 1",    lat: 6.9344, lng: 79.8428, zoom: 14 },
  { label: "Colombo 2",    value: "colombo 2",    lat: 6.9147, lng: 79.8529, zoom: 14 },
  { label: "Colombo 3",    value: "colombo 3",    lat: 6.9101, lng: 79.8562, zoom: 14 },
  { label: "Nugegoda",     value: "nugegoda",     lat: 6.8731, lng: 79.8894, zoom: 14 },
  { label: "Maharagama",   value: "maharagama",   lat: 6.8478, lng: 79.9265, zoom: 14 },
  { label: "Dehiwala",     value: "dehiwala",     lat: 6.8519, lng: 79.8652, zoom: 14 },
  { label: "Moratuwa",     value: "moratuwa",     lat: 6.7731, lng: 79.8814, zoom: 14 },
  { label: "Kandy",        value: "kandy",        lat: 7.2906, lng: 80.6337, zoom: 13 },
  { label: "Galle",        value: "galle",        lat: 6.0535, lng: 80.2210, zoom: 13 },
  { label: "Negombo",      value: "negombo",      lat: 7.2008, lng: 79.8738, zoom: 13 },
  { label: "Kelaniya",     value: "kelaniya",     lat: 6.9551, lng: 79.9204, zoom: 14 },
  { label: "Battaramulla", value: "battaramulla", lat: 6.9022, lng: 79.9199, zoom: 14 },
];

const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// ── Marker component ──
const Marker = ({ isHighlighted, name, price, area, onClick, onViewRoom }) => (
  <div
    onClick={onClick}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      transform: "translate(-50%, -100%)",
      cursor: "pointer",
      zIndex: isHighlighted ? 999 : 1,
    }}
  >
    {/* Pin icon */}
    <div style={{
      fontSize: isHighlighted ? "36px" : "24px",
      filter: isHighlighted
        ? "drop-shadow(0 4px 8px rgba(26,63,212,0.5))"
        : "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
      transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      transform: isHighlighted ? "scale(1.2)" : "scale(1)",
    }}>
      📍
    </div>

    {/* Popup card */}
    {isHighlighted && (
      <div style={{
        position: "absolute",
        bottom: "48px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#fff",
        border: "1.5px solid #1a3fd4",
        borderRadius: "12px",
        padding: "10px 14px",
        minWidth: "160px",
        boxShadow: "0 8px 24px rgba(26,63,212,0.15)",
        zIndex: 1000,
        animation: "popIn 0.2s ease",
      }}>

        {/* Room name */}
        <div style={{
          fontSize: "12px",
          fontWeight: "600",
          color: "#222",
          marginBottom: "4px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: "140px",
        }}>
          {name}
        </div>

        {/* Area */}
        <div style={{
          fontSize: "11px",
          color: "#666",
          marginBottom: "6px",
          display: "flex",
          alignItems: "center",
          gap: "3px",
        }}>
          📍 {area}
        </div>

        {/* Price */}
        {price && (
          <div style={{
            fontSize: "12px",
            fontWeight: "600",
            color: "#1a3fd4",
            background: "#f0f4ff",
            padding: "3px 8px",
            borderRadius: "6px",
            display: "inline-block",
            marginBottom: "8px",
          }}>
            LKR {price.toLocaleString()} /mo
          </div>
        )}

        {/* 👇 View Room button — navigates to listing_page.js */}
        <div
          onClick={(e) => {
            e.stopPropagation(); // prevent pin click
            onViewRoom();        // navigate to listing page
          }}
          style={{
            background: "#1a3fd4",
            color: "#fff",
            fontSize: "11px",
            fontWeight: "600",
            padding: "6px 10px",
            borderRadius: "6px",
            textAlign: "center",
            cursor: "pointer",
            letterSpacing: "0.3px",
            transition: "background 0.15s",
          }}
        >
          View Room →
        </div>

        {/* Arrow pointing down */}
        <div style={{
          position: "absolute",
          bottom: "-7px",
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: "7px solid #1a3fd4",
        }} />
      </div>
    )}
  </div>
);

// ── Main Map component ──
const Map = ({ highlightId, onHighlight }) => {
  const navigate = useNavigate();
  const defaultCenter = { lat: 6.9271, lng: 79.8612 };

  const [locations, setLocations]         = useState([]);
  const [loading, setLoading]             = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [selectedArea, setSelectedArea]   = useState(AREA_OPTIONS[0]);
  const [mapCenter, setMapCenter]         = useState(defaultCenter);
  const [mapZoom, setMapZoom]             = useState(12);
  const [radius, setRadius]               = useState(3);
  const [activePin, setActivePin]         = useState(null);

  // Fetch locations from database
  useEffect(() => {
    setLoading(true);
    axios.get("http://localhost:8080/api/rooms")
      .then((res) => {
        const content = res.data.content ?? res.data;
        const mapped = content
          .filter((r) => r.lat && r.lng)
          .map((r) => ({
            id: r.roomId,
            name: r.title ?? r.roomTitle,
            area: r.area ?? r.city ?? "",
            price: r.price ?? r.amount,
            lat: r.lat,
            lng: r.lng,
          }));

        if (mapped.length === 0) {
          setLocations(FALLBACK_LOCATIONS);
          setUsingFallback(true);
        } else {
          setLocations(mapped);
          setUsingFallback(false);
        }
        setLoading(false);
      })
      .catch(() => {
        setLocations(FALLBACK_LOCATIONS);
        setUsingFallback(true);
        setLoading(false);
      });
  }, []);

  // Filter by selected area and radius
  const filteredLocations = selectedArea.value
    ? locations.filter((room) =>
        getDistance(selectedArea.lat, selectedArea.lng, room.lat, room.lng) <= radius
      )
    : locations;

  const handleAreaChange = (e) => {
    const area = AREA_OPTIONS.find((a) => a.value === e.target.value);
    setSelectedArea(area);
    setMapCenter({ lat: area.lat, lng: area.lng });
    setMapZoom(area.zoom);
    setActivePin(null);
  };

  const handleClear = () => {
    setSelectedArea(AREA_OPTIONS[0]);
    setMapCenter(defaultCenter);
    setMapZoom(12);
    setRadius(3);
    setActivePin(null);
  };

  if (loading) return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px",
      gap: "12px",
      color: "#666",
      fontSize: "14px",
    }}>
      <div style={{
        width: "20px",
        height: "20px",
        border: "2px solid #e0e0e0",
        borderTop: "2px solid #1a3fd4",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      Loading room locations...
    </div>
  );

  return (
    <div style={{ width: "100%" }}>

      {/* CSS animations */}
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: translateX(-50%) scale(0.8); }
          to   { opacity: 1; transform: translateX(-50%) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .map-select:hover  { border-color: #1a3fd4 !important; }
        .map-select:focus  { outline: none; border-color: #1a3fd4 !important; box-shadow: 0 0 0 3px rgba(26,63,212,0.1); }
        .clear-btn:hover   { background: #f5f5f5 !important; border-color: #999 !important; }
        .radius-btn        { padding: 6px 12px; border-radius: 20px; border: 1px solid #d0d5e8; background: #fff; color: #666; font-size: 12px; cursor: pointer; transition: all 0.15s; }
        .radius-btn:hover  { border-color: #1a3fd4; color: #1a3fd4; }
        .radius-btn.active { background: #1a3fd4; border-color: #1a3fd4; color: #fff; font-weight: 500; }
      `}</style>

      {/* Fallback warning */}
      {usingFallback && (
        <div style={{
          padding: "10px 16px",
          background: "#fff8e1",
          border: "1px solid #ffe082",
          borderRadius: "10px",
          fontSize: "13px",
          color: "#e65100",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          
        </div>
      )}

      {/* Search Bar */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "12px",
        padding: "16px 20px",
        background: "linear-gradient(135deg, #f5f7ff 0%, #eef1ff 100%)",
        borderRadius: "14px",
        marginBottom: "12px",
        flexWrap: "wrap",
        border: "1px solid #e0e6ff",
      }}>

        {/* Area dropdown */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{
            fontSize: "10px",
            color: "#888",
            fontWeight: "600",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            Search Area
          </label>
          <select
            className="map-select"
            value={selectedArea.value}
            onChange={handleAreaChange}
            style={{
              padding: "9px 14px",
              borderRadius: "9px",
              border: "1.5px solid #d0d5e8",
              fontSize: "14px",
              cursor: "pointer",
              background: "#fff",
              color: "#222",
              minWidth: "170px",
              fontWeight: "500",
              transition: "border-color 0.15s",
            }}
          >
            {AREA_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Radius pills */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          <label style={{
            fontSize: "10px",
            color: "#888",
            fontWeight: "600",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            Radius
          </label>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[1, 2, 3, 5, 10].map((km) => (
              <button
                key={km}
                className={`radius-btn ${radius === km ? "active" : ""}`}
                onClick={() => setRadius(km)}
              >
                {km}km
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "8px 14px",
          background: "#fff",
          border: "1.5px solid #d0d5e8",
          borderRadius: "9px",
          fontSize: "13px",
          color: "#1a3fd4",
          fontWeight: "600",
        }}>
          📍 {filteredLocations.length} room{filteredLocations.length !== 1 ? "s" : ""}
        </div>

        {/* Clear button */}
        {selectedArea.value && (
          <button
            className="clear-btn"
            onClick={handleClear}
            style={{
              padding: "9px 16px",
              borderRadius: "9px",
              border: "1.5px solid #d0d5e8",
              background: "#fff",
              cursor: "pointer",
              fontSize: "13px",
              color: "#666",
              fontWeight: "500",
              transition: "all 0.15s",
            }}
          >
            ✕ Clear
          </button>
        )}

        {/* Hint */}
        <div style={{
          marginLeft: "auto",
          fontSize: "12px",
          color: "#999",
          alignSelf: "center",
        }}>
          Click a pin to preview · Click View Room to open
        </div>
      </div>

      {/* No results */}
      {filteredLocations.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "60px 40px",
          background: "#f9f9f9",
          borderRadius: "14px",
          color: "#aaa",
          border: "1px dashed #ddd",
        }}>
          <div style={{ fontSize: "40px", marginBottom: "12px" }}>🗺️</div>
          <p style={{ fontSize: "15px", fontWeight: "500", color: "#666" }}>
            No rooms found within {radius}km
          </p>
          <p style={{ fontSize: "13px", marginTop: "4px" }}>
            Try increasing the radius or selecting a different area
          </p>
          <button
            onClick={handleClear}
            style={{
              marginTop: "16px",
              padding: "8px 20px",
              borderRadius: "8px",
              border: "1.5px solid #1a3fd4",
              background: "#fff",
              color: "#1a3fd4",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500",
            }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{
          height: "80vh",
          width: "100%",
          borderRadius: "14px",
          overflow: "hidden",
          border: "1.5px solid #e0e6ff",
          boxShadow: "0 4px 20px rgba(26,63,212,0.08)",
        }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: GOOGLE_API_KEY }}
            center={mapCenter}
            zoom={mapZoom}
            onClick={() => setActivePin(null)}
          >
            {filteredLocations.map((room) => (
              <Marker
                key={room.id}
                lat={room.lat}
                lng={room.lng}
                name={room.name}
                price={room.price}
                area={room.area}
                isHighlighted={activePin === room.id}
                onClick={() => setActivePin(room.id)}
                onViewRoom={() =>
                  navigate("/listing", { state: { roomId: room.id } }) 
                }
              />
            ))}
          </GoogleMapReact>
        </div>
      )}

    </div>
  );
};

export default Map;
