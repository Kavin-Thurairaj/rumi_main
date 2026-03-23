import React from "react";
import { MapPin } from "lucide-react";
import GoogleMapReact from "google-map-react";

const Marker = ({ isHighlighted }) => (
  <div
    style={{
      transform: "translate(-50%, -100%)", 
    }}
  >
    <MapPin size={isHighlighted ? 32 : 24} color={isHighlighted ? "blue" : "red"} fill={isHighlighted ? "blue" : "red"} />
  </div>
);

const Map = ({ locations, highlightId }) => {
  const defaultCenter = { lat: 6.9271, lng: 79.8612 };
  const defaultZoom = 12;

  // Highlighted location for centering
  const centerLocation =
    highlightId && locations.length
      ? locations.find((room) => room.id === highlightId) || defaultCenter
      : defaultCenter;

  return (
    <div
      style={{
        height: "80vh", 
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden", 
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyA0nSgh3fK83f9dm06PdMpqqXUdH35xPtw" }}
        defaultCenter={defaultCenter}
        defaultZoom={defaultZoom}
        center={centerLocation}
      >
        {locations.map((room) => (
          <Marker
            key={room.id}
            lat={room.lat}
            lng={room.lng}
            isHighlighted={highlightId === room.id}
          />
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
