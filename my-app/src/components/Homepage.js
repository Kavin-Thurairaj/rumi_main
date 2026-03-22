import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Star,
  MapPin,
  User,
  Building2,
  Handshake,
  HelpCircle,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Wallet,
  ChevronDown,
  X,
  Check,
  Search,
} from "lucide-react";
import Hero from "./Hero";
import CategoryCarousel from "./CategoryCarousel";
import PlaceScroller from "./PlaceScroller";
import Home_statement from "./Home_statement";
import RoomCard from "./RoomCard";
import roomFilterApi from "../api/roomFilterApi";
import Footer from "./Footer";
import "./HomepageModern.css";
import { supabase } from "../auth/supabaseClient";
import { useAuth } from "../auth/AuthContext";

const HomeStatement = Home_statement;

const trustStats = [
  { value: "12K+", label: "Active listings", Icon: Home },
  { value: "4.8★", label: "Average rating", Icon: Star },
  { value: "120+", label: "Neighborhoods", Icon: MapPin },
];

const desktopNavLinks = [
  { label: "Browse Rooms", to: "/rooms" },
  { label: "Share a Room", to: "/share" },
  { label: "How it Works", to: "/how-it-works" },
  { label: "List Your Space", to: "/signup/landlord" },
];

const cityOptions = [
  "Ampara",
  "Anuradhapura",
  "Avissawella",
  "Badulla",
  "Batticaloa",
  "Beruwala",
  "Chilaw",
  "Colombo",
  "Dambulla",
  "Dehiwala-Mount Lavinia",
  "Galle",
  "Gampaha",
  "Gampola",
  "Hanwella",
  "Homagama",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Katunayaka",
  "Kelaniya",
  "Kotte",
  "Kurunegala",
  "Maharagama",
  "Mannar",
  "Matara",
  "Mawanella",
  "Minuwangoda",
  "Mirissa",
  "Moratuwa",
  "Mullaitivu",
  "Nattandiya",
  "Negombo",
  "Nuwara Eliya",
  "Panadura",
  "Peradeniya",
  "Piliyandala",
  "Polonnaruwa",
  "Puttalam",
  "Ratmalana",
  "Ratnapura",
  "Sri Jayawardenepura Kotte",
  "Thalawakele",
  "Trincomalee",
  "Unawatuna",
  "Vavuniya",
  "Wattala",
  "Weligama",
  "Welisara",
  "Wellawatta",
  "Yakkala",
];
const typeOptions = [
  "Any type",
  "Room",
  "Annex",
  "House",
  "Apartment",
  "Boarding",
];
const budgetOptions = [
  "Any budget",
  "Under 30k",
  "30k – 60k",
  "60k – 120k",
  "120k+",
];

/* ── Scroll-reveal wrapper ── */
const RevealSection = ({
  children,
  className = "",
  delay = 0,
  style,
  ...rest
}) => {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVis(true);
          observer.disconnect();
        }
      },
      { threshold: 0.07, rootMargin: "0px 0px -20px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal-section${vis ? " is-visible" : ""} ${className}`}
      style={{ "--reveal-delay": `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </div>
  );
};

/* ── Custom search dropdown field ── */
const SearchField = ({
  icon: Icon,
  label,
  options,
  value,
  onChange,
  isOpen,
  onToggle,
}) => (
  <div
    className={`hp-sf${isOpen ? " hp-sf--open" : ""}`}
    onClick={onToggle}
    role="combobox"
    aria-expanded={isOpen}
    aria-haspopup="listbox"
    tabIndex={0}
    onKeyDown={(e) => e.key === "Enter" && onToggle()}
  >
    <label className="hp-sf-label">
      <Icon size={10} aria-hidden="true" /> {label}
    </label>
    <div className="hp-sf-row">
      <span className="hp-sf-value">{value}</span>
      <ChevronDown
        size={13}
        className={`hp-sf-chevron${isOpen ? " hp-sf-chevron--up" : ""}`}
        aria-hidden="true"
      />
    </div>

    {isOpen && (
      <div
        className="hp-sf-dropdown"
        role="listbox"
        onClick={(e) => e.stopPropagation()}
      >
        {options.map((opt) => (
          <button
            key={opt}
            className={`hp-sf-opt${value === opt ? " hp-sf-opt--active" : ""}`}
            role="option"
            aria-selected={value === opt}
            onClick={() => {
              onChange(opt);
              onToggle();
            }}
          >
            {value === opt && (
              <Check size={12} className="hp-sf-opt-check" aria-hidden="true" />
            )}
            {opt}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default function Homepage() {
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [cityVal, setCityVal] = useState("Colombo");
  const [typeVal, setTypeVal] = useState("Any type");
  const [budgetVal, setBudgetVal] = useState("Any budget");
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  const signupRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (signupRef.current && !signupRef.current.contains(e.target))
        setSignupOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target))
        setProfileOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const h = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setActiveField(null);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Fetch featured rooms from backend API
  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        setLoadingFeatured(true);
        const response = await roomFilterApi.searchRooms({}, 0, 3);
        const data = response.data;

        const formatted = data.content.map(room => ({
          id: room.roomId,
          title: room.roomTitle || 'Room',
          location: `${room.city}, ${room.country}`,
          city: room.city,
          price: room.amount,
          type: room.roomType || 'Apartment',
          bedrooms: room.maxRoommates || 1,
          bathrooms: 1,
          sqft: 500,
          rating: 4.7,
          reviews: 0,
          available: room.roomStatus === 'AVAILABLE',
          landlord: { name: 'RUMI', joined: '2024' },
          amenities: ['WiFi', 'Modern Amenities'],
          rules: [],
          description: room.roomDescription || 'Beautiful room available now',
          images: room.imageUrl 
            ? [room.imageUrl] 
            : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800']
        }));

        setFeaturedRooms(formatted);
      } catch (err) {
        console.error('Error fetching featured rooms:', err);
        setFeaturedRooms([]);
      } finally {
        setLoadingFeatured(false);
      }
    };

    fetchFeaturedRooms();
  }, []);

  const toggleField = (field) =>
    setActiveField((prev) => (prev === field ? null : field));

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setProfileOpen(false);
  };

  const initials = profile
    ? `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`.toUpperCase()
    : (user?.email?.[0].toUpperCase() ?? "?");

  return (
    <>
      <section className="hp-shell">
        <div className="hp-container">
          {/* ══ Navbar ══ */}
          <header className="hp-navbar">
            <Link
              to="/"
              className="hp-brand-link"
              aria-label="Rumi Rentals home"
            >
              <div className="hp-brand">
                <div className="hp-logo">
                  <span className="hp-logo-text">RUMI</span>
                </div>
                <div>
                  <p className="hp-brand-name">Rumi Rentals</p>
                  <p className="hp-brand-tag">Find rooms that feel like home</p>
                </div>
              </div>
            </Link>

            <nav className="hp-nav" aria-label="Primary navigation">
              {desktopNavLinks.map((link) => (
                <Link to={link.to} className="hp-nav-link" key={link.label}>
                  {link.label}
                </Link>
              ))}
              <Link
                to="/"
                className="hp-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("popular-areas")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Popular Areas
              </Link>
            </nav>

            <div className="hp-auth-group">
              {user ? (
                <div className="hp-profile-wrap" ref={profileRef}>
                  <button
                    className="hp-avatar-btn"
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-label="Open profile menu"
                    aria-expanded={profileOpen}
                  >
                    {initials}
                  </button>

                  {profileOpen && (
                    <div className="hp-profile-dropdown">
                      <div className="hp-profile-header">
                        <div className="hp-profile-avatar-lg">{initials}</div>
                        <div>
                          <p className="hp-profile-name">
                            {profile?.first_name} {profile?.last_name}
                          </p>
                          <p className="hp-profile-role">
                            {profile?.role ?? "User"}
                          </p>
                        </div>
                      </div>

                      <div className="hp-profile-details">
                        {[
                          {
                            label: "Email",
                            value: profile?.email ?? user?.email,
                          },
                          { label: "Age", value: profile?.age },
                          { label: "Phone", value: profile?.phone ?? "—" },
                        ].map((row) => (
                          <div key={row.label} className="hp-profile-row">
                            <span className="hp-profile-key">{row.label}</span>
                            <span className="hp-profile-val">{row.value}</span>
                          </div>
                        ))}
                      </div>

                      <Link
                        to="/dashboard/landlord"
                        className="hp-profile-link"
                        onClick={() => setProfileOpen(false)}
                      >
                        <LayoutDashboard size={16} /> Landlord Dashboard
                      </Link>

                      <button
                        className="hp-signout-btn"
                        onClick={handleSignOut}
                      >
                        ⎋ Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="hp-signin-btn">
                    Sign In
                  </Link>

                  <div className="hp-signup-wrap" ref={signupRef}>
                    <button
                      className="hp-cta-btn"
                      onClick={() => setSignupOpen((v) => !v)}
                      aria-haspopup="true"
                      aria-expanded={signupOpen}
                    >
                      Sign Up
                      <ChevronDown
                        size={12}
                        className={`hp-chevron${signupOpen ? " hp-chevron--up" : ""}`}
                        aria-hidden="true"
                      />
                    </button>

                    {signupOpen && (
                      <div className="hp-signup-dropdown" role="menu">
                        <Link
                          to="/signup/tenant"
                          className="hp-dropdown-item"
                          role="menuitem"
                          onClick={() => setSignupOpen(false)}
                        >
                          <div className="hp-dropdown-icon">
                            <User size={16} />
                          </div>
                          <span className="hp-dropdown-text">
                            <strong>Tenant</strong>
                            <span className="hp-dropdown-sub">
                              Find and book a room
                            </span>
                          </span>
                        </Link>
                        <div className="hp-dropdown-divider" />
                        <Link
                          to="/signup/landlord"
                          className="hp-dropdown-item"
                          role="menuitem"
                          onClick={() => setSignupOpen(false)}
                        >
                          <div className="hp-dropdown-icon">
                            <Building2 size={16} />
                          </div>
                          <span className="hp-dropdown-text">
                            <strong>Landlord</strong>
                            <span className="hp-dropdown-sub">
                              List and manage properties
                            </span>
                          </span>
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}

              <button
                className="hp-hamburger"
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation menu"
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </header>

          {/* ══ Mobile Overlay + Drawer ══ */}
          {mobileOpen && (
            <div
              className="hp-mobile-overlay"
              onClick={() => setMobileOpen(false)}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div
                className="hp-mobile-drawer"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="hp-drawer-hd">
                  <div className="hp-brand" style={{ gap: "0.5rem" }}>
                    <div className="hp-logo" style={{ width: 36, height: 36 }}>
                      <span className="hp-logo-text">RUMI</span>
                    </div>
                    <p className="hp-brand-name">Rumi Rentals</p>
                  </div>
                  <button
                    className="hp-drawer-close"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={14} />
                  </button>
                </div>

                <nav className="hp-mobile-nav" aria-label="Mobile navigation">
                  <Link
                    to="/rooms"
                    className="hp-mob-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="hp-mob-icon">
                      <Home size={17} />
                    </span>{" "}
                    Browse Rooms
                  </Link>
                  <Link
                    to="/share"
                    className="hp-mob-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="hp-mob-icon">
                      <Handshake size={17} />
                    </span>{" "}
                    Share a Room
                  </Link>
                  <Link
                    to="/how-it-works"
                    className="hp-mob-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="hp-mob-icon">
                      <HelpCircle size={17} />
                    </span>{" "}
                    How it Works
                  </Link>
                  <Link
                    to="/signup/landlord"
                    className="hp-mob-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="hp-mob-icon">
                      <ClipboardList size={17} />
                    </span>{" "}
                    List Your Space
                  </Link>
                  <Link
                    to="/"
                    className="hp-mob-link"
                    onClick={() => {
                      setMobileOpen(false);
                      setTimeout(
                        () =>
                          document
                            .getElementById("popular-areas")
                            ?.scrollIntoView({ behavior: "smooth" }),
                        200,
                      );
                    }}
                  >
                    <span className="hp-mob-icon">
                      <MapPin size={17} />
                    </span>{" "}
                    Popular Areas
                  </Link>
                </nav>

                <div className="hp-mob-auth">
                  {user ? (
                    <>
                      <p className="hp-mob-auth-label">
                        Signed in as {profile?.first_name ?? user.email}
                      </p>
                      <button
                        className="hp-mob-signup"
                        onClick={() => {
                          handleSignOut();
                          setMobileOpen(false);
                        }}
                      >
                        ⎋ Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="hp-mob-auth-label">Your Account</p>
                      <Link
                        to="/login"
                        className="hp-mob-signin"
                        onClick={() => setMobileOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/signup/tenant"
                        className="hp-mob-signup"
                        onClick={() => setMobileOpen(false)}
                      >
                        Sign Up as Tenant
                      </Link>
                      <Link
                        to="/signup/landlord"
                        className="hp-mob-signup2"
                        onClick={() => setMobileOpen(false)}
                      >
                        Sign Up as Landlord
                      </Link>
                    </>
                  )}
                </div>

                <div className="hp-mob-footer">
                  <Link
                    to="/dashboard/landlord"
                    className="hp-mob-footer-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    <LayoutDashboard size={15} /> Landlord Dashboard
                  </Link>
                  <Link
                    to="/admin"
                    className="hp-mob-footer-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    <Settings size={15} /> Admin Console
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* ── Hero ── */}
          <div className="hp-hero-wrap">
            <Hero />
          </div>

          {/* ── Search bar ── */}
          <div className="hp-search-wrap" ref={searchRef}>
            <form
              className="hp-search"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Search for rooms"
            >
              <SearchField
                icon={MapPin}
                label="City"
                options={cityOptions}
                value={cityVal}
                onChange={setCityVal}
                isOpen={activeField === "city"}
                onToggle={() => toggleField("city")}
              />
              <div className="hp-sf-div" aria-hidden="true" />
              <SearchField
                icon={Home}
                label="Room type"
                options={typeOptions}
                value={typeVal}
                onChange={setTypeVal}
                isOpen={activeField === "type"}
                onToggle={() => toggleField("type")}
              />
              <div className="hp-sf-div" aria-hidden="true" />
              <SearchField
                icon={Wallet}
                label="Budget (LKR)"
                options={budgetOptions}
                value={budgetVal}
                onChange={setBudgetVal}
                isOpen={activeField === "budget"}
                onToggle={() => toggleField("budget")}
              />
              <Link to="/rooms" className="hp-sf-btn">
                <Search
                  size={15}
                  aria-hidden="true"
                  style={{ flexShrink: 0 }}
                />
                Search
              </Link>
            </form>
          </div>

          {/* ── Trust stats ── */}
          <RevealSection className="hp-stats-bar">
            {trustStats.map((s, i) => (
              <article className="hp-stat" key={s.label} style={{ "--i": i }}>
                <span className="hp-stat-icon" aria-hidden="true">
                  <s.Icon size={18} />
                </span>
                <strong className="hp-stat-value">{s.value}</strong>
                <span className="hp-stat-label">{s.label}</span>
              </article>
            ))}
          </RevealSection>

          {/* ── Browse by Category ── */}
          <RevealSection className="hp-section" delay={60}>
            <div className="hp-section-hd">
              <h2 className="hp-section-title">Browse by Category</h2>
              <p className="hp-section-desc">
                Find the type of space that suits your lifestyle
              </p>
            </div>
            <CategoryCarousel />
          </RevealSection>

          {/* ── Featured Rooms ── */}
          <RevealSection className="hp-section" delay={80}>
            <div className="hp-section-hd">
              <h2 className="hp-section-title">Featured Rooms</h2>
              <p className="hp-section-desc">
                Handpicked stays across Sri Lanka
              </p>
            </div>
            <div className="hp-rooms-grid">
              {loadingFeatured ? (
                <p style={{ textAlign: 'center', padding: '20px', gridColumn: '1 / -1' }}>Loading featured rooms...</p>
              ) : featuredRooms.length > 0 ? (
                featuredRooms.map((room, i) => (
                  <div
                    key={room.id}
                    className="hp-card-reveal"
                    style={{ "--card-i": i }}
                  >
                    <RoomCard room={room} />
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', gridColumn: '1 / -1' }}>No featured rooms available</p>
              )}
            </div>
            <div className="hp-view-all-wrap">
              <Link to="/rooms" className="hp-view-all-btn">
                View All Rooms
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M5 12h14M12 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </RevealSection>

          {/* ── Statement banner ── */}
          <RevealSection className="hp-statement" delay={40}>
            <HomeStatement />
          </RevealSection>

          {/* ── Popular Areas ── */}
          <RevealSection
            className="hp-section hp-section--last"
            id="popular-areas"
            delay={60}
          >
            <div className="hp-section-hd">
              <h2 className="hp-section-title">Popular Areas</h2>
              <p className="hp-section-desc">
                Trending neighborhoods across Sri Lanka
              </p>
            </div>
            <PlaceScroller />
          </RevealSection>
        </div>
      </section>

      {/* ── Footer — outside hp-container so it spans full width ── */}
      <Footer />
    </>
  );
}
