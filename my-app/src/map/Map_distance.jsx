import React, { useState, useRef } from "react";
import GoogleMapReact from "google-map-react";
import { mapStyles, modeConfig, globalCss, mapOptions } from "./style/Mapstyles";



const RoomMarker = () => (
  <div style={{ transform: "translate(-20px, -44px)", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.25))" }}>
    <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
      <path d="M20 0C10.6 0 3 7.6 3 17C3 29 20 48 20 48C20 48 37 29 37 17C37 7.6 29.4 0 20 0Z" fill="#2563EB"/>
      <circle cx="20" cy="17" r="11" fill="white"/>
      <path d="M20 9L12 15V25H17V20H23V25H28V15L20 9Z" fill="#2563EB"/>
      <rect x="17" y="20" width="6" height="5" rx="0.5" fill="white"/>
    </svg>
  </div>
);

const DestinationMarker = () => (
  <div style={{ transform: "translate(-16px, -40px)", filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.25))" }}>
    <svg width="32" height="42" viewBox="0 0 32 42" fill="none">
      <path d="M16 0C7.2 0 0 7.2 0 16C0 26 16 42 16 42C16 42 32 26 32 16C32 7.2 24.8 0 16 0Z" fill="#EF4444"/>
      <circle cx="16" cy="16" r="7" fill="white"/>
      <circle cx="16" cy="16" r="3.5" fill="#EF4444"/>
    </svg>
  </div>
);


const Map_distance = () => {
  const [durations, setDurations]     = useState({ driving: "", transit: "", walking: "" });
  const [loading, setLoading]         = useState(false);
  const [activeMode, setActiveMode]   = useState("driving");
  const [routeInfo, setRouteInfo]     = useState(null);
  const [destCoords, setDestCoords]   = useState(null);

  const mapRef               = useRef();
  const mapsRef              = useRef();
  const directionsRendererRef = useRef();

  const origin = { lat: 6.90346, lng: 79.85357 };

  // Google Maps init

  const onGoogleApiLoaded = ({ map, maps }) => {
    mapRef.current  = map;
    mapsRef.current = maps;

    directionsRendererRef.current = new maps.DirectionsRenderer({
      polylineOptions: { strokeColor: "#2563EB", strokeWeight: 5, strokeOpacity: 0.85 },
      suppressMarkers: true,
    });
    directionsRendererRef.current.setMap(map);

    const input = document.getElementById("destination-input");
    const autocomplete = new maps.places.Autocomplete(input);
    autocomplete.setFields(["geometry", "formatted_address"]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        document.getElementById("destination-input").value = place.formatted_address;
      }
    });
  };

  // Route search 

  const handleSearch = () => {
    const dest = document.getElementById("destination-input").value;
    if (!dest || !mapsRef.current || !mapRef.current) return;

    setLoading(true);
    setDurations({ driving: "", transit: "", walking: "" });
    setRouteInfo(null);
    setDestCoords(null);

    const directionsService = new mapsRef.current.DirectionsService();
    let done = 0;

    ["DRIVING", "TRANSIT", "WALKING"].forEach((mode) => {
      directionsService.route(
        { origin, destination: dest, travelMode: mapsRef.current.TravelMode[mode] },
        (result, status) => {
          done++;
          if (status === "OK") {
            const leg = result.routes[0].legs[0];
            setDurations((prev) => ({ ...prev, [mode.toLowerCase()]: leg.duration.text }));

            if (mode === "DRIVING") {
              directionsRendererRef.current.setDirections(result);
              setRouteInfo({
                distance:    leg.distance.text,
                destination: leg.end_address.split(",").slice(0, 2).join(","),
              });
              const endLoc = leg.end_location;
              setDestCoords({ lat: endLoc.lat(), lng: endLoc.lng() });
            }
          }
          if (done === 3) setLoading(false);
        }
      );
    });
  };

  const hasResults = durations.driving || durations.transit || durations.walking || loading;



  return (
    <>
      <style>{globalCss}</style>

      <div style={mapStyles.wrapper}>

        {/* Map */}
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBuimP0s0KCy4y3PBmgk4IHGkSVuJozyr8", libraries: ["places"] }}
          defaultCenter={origin}
          defaultZoom={13}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={onGoogleApiLoaded}
          options={mapOptions}
        >
          <RoomMarker lat={origin.lat} lng={origin.lng} />
          {destCoords && <DestinationMarker lat={destCoords.lat} lng={destCoords.lng} />}
        </GoogleMapReact>

        {/* Search bar */}
        <div style={mapStyles.topbar}>
          <div style={mapStyles.searchPill}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, opacity: 0.4 }}>
              <circle cx="6.5" cy="6.5" r="4.5" stroke="#1e293b" strokeWidth="1.5"/>
              <line x1="10" y1="10" x2="14" y2="14" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              id="destination-input"
              type="text"
              placeholder="Where do you want to go?"
              style={mapStyles.input}
            />
          </div>

          <button style={mapStyles.goBtn} onClick={handleSearch}>
            {loading ? "..." : (
              <>
                Route
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 7H12M12 7L8 3M12 7L8 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </>
            )}
          </button>
        </div>

        {/*  Origin badge */}
        <div style={mapStyles.originBadge}>
          <div style={mapStyles.originDot} />
          <span style={mapStyles.originBadgeText}>Colombo, Sri Lanka</span>
        </div>

        {/*  Results panel  */}
        {hasResults && (
          <div style={mapStyles.resultsPanel}>
            <div style={mapStyles.resultsCard}>

              {/* Route header */}
              {routeInfo && (
                <div style={mapStyles.routeHeader}>
                  <div>
                    <div style={mapStyles.routeHeaderFromText}>From Colombo</div>
                    <div style={mapStyles.routeHeaderDestText}>{routeInfo.destination}</div>
                  </div>
                  <div style={mapStyles.routeDistanceBadge}>{routeInfo.distance}</div>
                </div>
              )}

              {/* Mode tiles */}
              <div style={mapStyles.modesGrid}>
                {modeConfig.map(({ key, label, emoji, activeColor, activeBg, activeBorder }) => {
                  const isActive = activeMode === key;
                  return (
                    <div
                      key={key}
                      onClick={() => setActiveMode(key)}
                      style={{
                        ...mapStyles.modeTile,
                        background: isActive ? activeBg : "#f8fafc",
                        border: isActive ? `1.5px solid ${activeBorder}` : "0.5px solid #e2e8f0",
                      }}
                    >
                      <span style={mapStyles.modeEmoji}>{emoji}</span>

                      <span style={{ ...mapStyles.modeLabel, color: isActive ? activeColor : "#94a3b8" }}>
                        {label}
                      </span>

                      {loading && !durations[key] ? (
                        <div style={mapStyles.skeleton} />
                      ) : (
                        <span style={{
                          ...mapStyles.modeDuration,
                          fontSize: durations[key] && durations[key].length > 6 ? "18px" : "30px",
                          color: isActive ? activeColor : "#1e293b",
                        }}>
                          {durations[key] || "—"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default Map_distance;