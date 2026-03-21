export const mapStyles = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "600px",
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    borderRadius: "16px",
    overflow: "hidden",
  },

  topbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: "14px 14px 0",
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },

  searchPill: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(255,255,255,0.97)",
    borderRadius: "12px",
    padding: "0 14px",
    height: "48px",
    boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
    border: "0.5px solid rgba(0,0,0,0.08)",
  },

  input: {
    flex: 1,
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "14px",
    fontWeight: 500,
    color: "#1e293b",
    fontFamily: "inherit",
    minWidth: 0,
  },

  goBtn: {
    background: "#2563EB",
    color: "white",
    border: "none",
    borderRadius: "12px",
    height: "48px",
    padding: "0 18px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    flexShrink: 0,
    boxShadow: "0 2px 12px rgba(37,99,235,0.35)",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontFamily: "inherit",
  },

  originBadge: {
    position: "absolute",
    top: "74px",
    left: "14px",
    background: "rgba(255,255,255,0.97)",
    borderRadius: "20px",
    padding: "5px 12px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    boxShadow: "0 1px 8px rgba(0,0,0,0.1)",
    border: "0.5px solid rgba(0,0,0,0.07)",
    zIndex: 10,
  },

  originBadgeText: {
    fontSize: "12px",
    color: "#475569",
    fontWeight: 500,
  },

  originDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#2563EB",
    boxShadow: "0 0 0 3px rgba(37,99,235,0.18)",
    flexShrink: 0,
  },

  resultsPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    padding: "0 14px 14px",
  },

  resultsCard: {
    background: "rgba(255,255,255,0.97)",
    borderRadius: "16px",
    padding: "16px 18px",
    boxShadow: "0 -2px 20px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.08)",
    border: "0.5px solid rgba(0,0,0,0.07)",
  },

  routeHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
  },

  routeHeaderFromText: {
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "3px",
  },

  routeHeaderDestText: {
    fontSize: "16px",
    fontWeight: 700,
    color: "#1e293b",
  },

  routeDistanceBadge: {
    fontSize: "14px",
    color: "#1e293b",
    fontWeight: 700,
    background: "#f1f5f9",
    padding: "6px 14px",
    borderRadius: "20px",
    border: "0.5px solid #e2e8f0",
  },

  modesGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
  },

  modeTile: {
    borderRadius: "12px",
    padding: "16px 8px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "7px",
    cursor: "pointer",
    transition: "all 0.18s ease",
  },

  modeEmoji: {
    fontSize: "28px",
    lineHeight: 1,
  },

  modeLabel: {
    fontSize: "10px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
  },

  modeDuration: {
    lineHeight: 1.1,
    fontWeight: 700,
    textAlign: "center",
  },

  skeleton: {
    width: "60px",
    height: "24px",
    borderRadius: "6px",
    background: "linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s infinite",
  },
};

export const modeConfig = [
  {
    key: "driving",
    label: "Drive",
    emoji: "🚗",
    activeColor: "#2563EB",
    activeBg: "#eff6ff",
    activeBorder: "#2563EB",
  },
  {
    key: "transit",
    label: "Public Transport",
    emoji: "🚌",
    activeColor: "#7C3AED",
    activeBg: "#f5f3ff",
    activeBorder: "#7C3AED",
  },
  {
    key: "walking",
    label: "Walk",
    emoji: "🚶",
    activeColor: "#059669",
    activeBg: "#ecfdf5",
    activeBorder: "#059669",
  },
];

export const globalCss = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
  @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
  #destination-input::placeholder { color: #94a3b8; font-weight: 400; }
`;

export const mapOptions = {
  disableDefaultUI: true,
  zoomControl: false,
  styles: [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "all", elementType: "geometry", stylers: [{ saturation: -15 }] },
  ],
};