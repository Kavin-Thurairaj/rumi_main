import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CreatePostForm from "../component/CreatePostForm";
import roomSharePostApi from "../../api/roomSharePostApi";

const RoomSharePostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomSharePostApi.getAllPosts();
      setPosts(data);
    } catch (err) {
      setError("Could not load posts. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh" }}>

      {/* ── NAV ── */}
      <header style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0.85rem 1.5rem", background: "#ffffff",
        borderBottom: "1px solid #e6eeff",
        boxShadow: "0 2px 10px rgba(0,30,80,0.05)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <Link to="/share" style={{
          display: "flex", alignItems: "center", gap: "0.4rem",
          color: "#003f8a", fontSize: "0.86rem", fontWeight: 600,
          textDecoration: "none", padding: "0.38rem 0.75rem",
          borderRadius: "8px", border: "1.5px solid #c8d9ff", background: "#f0f5ff",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </Link>

        <Link to="/" style={{
          display: "flex", alignItems: "center", gap: "0.55rem",
          textDecoration: "none", position: "absolute", left: "50%", transform: "translateX(-50%)",
        }}>
          <div style={{
            width: 38, height: 38,
            background: "linear-gradient(140deg, #003f8a 0%, #0057b8 100%)",
            borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 3px 10px rgba(0,87,184,0.28)",
          }}>
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>RUMI</span>
          </div>
          <span style={{ fontSize: "0.98rem", fontWeight: 800, color: "#0b1d40" }}>Rumi Rentals</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <Link to="/login" style={{
            padding: "0.42rem 0.9rem", borderRadius: 8, color: "#003f8a",
            fontSize: "0.86rem", fontWeight: 600, textDecoration: "none",
            border: "1.5px solid #c8d9ff",
          }}>Sign In</Link>
          <Link to="/signup/tenant" style={{
            padding: "0.45rem 1rem", borderRadius: 9,
            background: "linear-gradient(135deg, #003f8a 0%, #0057b8 100%)",
            color: "#fff", fontSize: "0.86rem", fontWeight: 700,
            textDecoration: "none", boxShadow: "0 3px 12px rgba(0,87,184,0.28)",
          }}>Sign Up Free</Link>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <div style={{
        background: "linear-gradient(135deg, #1a4fa8 0%, #1e3a6e 55%, #0f2147 100%)",
        padding: "36px 48px 40px", position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: "-60px", top: "-60px",
          width: "280px", height: "280px", borderRadius: "50%",
          border: "40px solid rgba(255,255,255,0.05)", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: "120px", bottom: "-80px",
          width: "180px", height: "180px", borderRadius: "50%",
          border: "30px solid rgba(255,255,255,0.04)", pointerEvents: "none",
        }} />

        <div style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "20px", padding: "4px 14px", fontSize: "11.5px",
          fontWeight: 600, color: "rgba(255,255,255,0.9)", marginBottom: "14px",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
          Sri Lanka's #1 Room Sharing Platform
        </div>

        <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.5px" }}>
          Room Sharing Board
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.68)", margin: "0 0 26px", maxWidth: "460px", lineHeight: 1.65 }}>
          Find your perfect roommate or post your room sharing ad. {posts.length} ads posted so far.
        </p>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#fff", color: "#1a4fa8", fontWeight: 700, fontSize: "14px",
            padding: "11px 22px", borderRadius: "10px", border: "none", cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
          }}>
          <span style={{
            width: 22, height: 22, background: "#1a4fa8", borderRadius: 6,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 17, lineHeight: 1,
          }}>
            {showForm ? "✕" : "+"}
          </span>
          {showForm ? "Hide Form" : "Post an Ad"}
        </button>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "32px 48px 60px" }}>
        {showForm && <CreatePostForm onPostCreated={() => { fetchPosts(); setShowForm(false); }} />}

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ fontSize: "16px", color: "#64748b" }}>Loading posts...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ color: "red" }}>{error}</p>
          </div>
        ) : posts.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {posts.map((post) => (
              <div key={post.id} style={{
                background: "white", borderRadius: "20px", padding: "24px",
                boxShadow: "0 2px 10px rgba(0,30,80,0.07)",
                border: "1px solid #e6eeff",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,30,80,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 10px rgba(0,30,80,0.07)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "20px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <h3 style={{ margin: 0, color: "#0b1d40", fontSize: "17px", fontWeight: 700 }}>{post.title}</h3>
                      <span style={{
                        background: post.available_spots > 0 ? "#dcfce7" : "#fee2e2",
                        color: post.available_spots > 0 ? "#16a34a" : "#dc2626",
                        padding: "3px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700,
                      }}>
                        {post.available_spots > 0 ? "Available" : "Full"}
                      </span>
                    </div>
                    <p style={{ color: "#2563eb", margin: "0 0 4px", fontSize: "13.5px" }}>📍 {post.location}</p>
                    <p style={{ fontWeight: 800, margin: "0 0 10px", fontSize: "17px", color: "#0b1d40" }}>
                      LKR {post.rent_per_person?.toLocaleString()}
                      <span style={{ fontWeight: 400, fontSize: "13px", color: "#64748b" }}> / person/month</span>
                    </p>
                    <p style={{ color: "#555", margin: "0 0 14px", lineHeight: 1.6, fontSize: "13.5px" }}>{post.description}</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ background: "#eff6ff", color: "#2563eb", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                        👤 {post.gender_preference}
                      </span>
                      <span style={{ background: "#dcfce7", color: "#16a34a", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                        🏠 {post.available_spots}/{post.total_spots} spots
                      </span>
                      <span style={{ background: "#fff7ed", color: "#ea580c", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                        📅 {post.move_in_date}
                      </span>
                      {post.preferences && (
                        <span style={{ background: "#f8fafc", color: "#64748b", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 600 }}>
                          ✨ {post.preferences}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{
                    background: "#f0f5ff", borderRadius: "14px", padding: "18px",
                    minWidth: "180px", textAlign: "center", border: "1px solid #e6eeff",
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: "50%",
                      background: "linear-gradient(135deg, #003f8a, #0057b8)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 8px", color: "white", fontSize: "20px", fontWeight: 700,
                      boxShadow: "0 3px 10px rgba(0,87,184,0.28)",
                    }}>
                      {post.poster_name?.charAt(0).toUpperCase()}
                    </div>
                    <p style={{ fontWeight: 700, margin: "0 0 4px", color: "#0b1d40", fontSize: "14px" }}>{post.poster_name}</p>
                    <p style={{ color: "#64748b", margin: "0 0 14px", fontSize: "12px" }}>📞 {post.contact_number}</p>
                    <button style={{
                      background: "linear-gradient(135deg, #003f8a, #0057b8)",
                      color: "white", padding: "9px 20px", border: "none",
                      borderRadius: "9px", cursor: "pointer", width: "100%",
                      fontWeight: 700, fontSize: "13px",
                      boxShadow: "0 3px 10px rgba(0,87,184,0.25)",
                    }}>
                      Contact
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🏠</div>
            <h2 style={{ color: "#0b1d40", marginBottom: "8px" }}>No posts yet</h2>
            <p style={{ color: "#64748b", marginBottom: "24px" }}>Be the first to post a room sharing ad!</p>
            <button onClick={() => setShowForm(true)} style={{
              background: "linear-gradient(135deg, #003f8a, #0057b8)",
              color: "white", padding: "12px 28px", border: "none",
              borderRadius: "10px", cursor: "pointer", fontSize: "15px", fontWeight: 700,
              boxShadow: "0 4px 14px rgba(0,87,184,0.28)",
            }}>
              + Post an Ad
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSharePostPage;