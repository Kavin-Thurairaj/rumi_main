import { useState, useEffect } from "react";
import { Home, MapPin, Calendar, Users } from "lucide-react";
import CreatePostForm from "../component/CreatePostForm";
import roomSharePostApi from "../../api/roomSharePostApi";

const RoomSharePostPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

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
    <div style={{ background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)", minHeight: "100vh" }}>

      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #1E293B 0%, #2563eb 100%)",
        padding: "60px 120px",
        color: "white",
        marginBottom: "40px"
      }}>
        <h1 style={{ fontSize: "36px", margin: "0 0 12px 0" }}><Home size={32} style={{ display: 'inline', marginRight: '12px' }} />Room Sharing Board</h1>
        <p style={{ fontSize: "18px", opacity: 0.8, margin: "0 0 24px 0" }}>
          Find your perfect roommate or post your room sharing ad
        </p>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              background: "white", color: "#2563eb", padding: "12px 28px",
              border: "none", borderRadius: "8px", cursor: "pointer",
              fontSize: "16px", fontWeight: "600"
            }}>
            {showForm ? "✕ Hide Form" : "+ Post an Ad"}
          </button>
          <span style={{ opacity: 0.8 }}>{posts.length} ads posted</span>
        </div>
      </div>

      <div style={{ padding: "0 120px 60px 120px" }}>

        {/* Create Post Form */}
        {showForm && (
          <CreatePostForm onPostCreated={() => {
            fetchPosts();
            setShowForm(false);
          }} />
        )}

        {/* Posts List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ fontSize: "18px", color: "#64748B" }}>Loading posts...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ color: "red" }}>{error}</p>
          </div>
        ) : posts.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {posts.map((post) => (
              <div key={post.id} style={{
                background: "white",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                border: "1px solid #E2E8F0",
                transition: "transform 0.2s ease",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "20px" }}>

                  {/* Left side */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <h3 style={{ margin: 0, color: "#1E293B", fontSize: "18px" }}>{post.title}</h3>
                      <span style={{
                        background: post.available_spots > 0 ? "#F0FDF4" : "#FEF2F2",
                        color: post.available_spots > 0 ? "#16A34A" : "#DC2626",
                        padding: "2px 10px", borderRadius: "20px", fontSize: "12px", fontWeight: "600"
                      }}>
                        {post.available_spots > 0 ? "Available" : "Full"}
                      </span>
                    </div>

                    <p style={{ color: "#2563eb", margin: "0 0 6px 0", fontSize: "14px" }}><MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />{post.location}</p>
                    <p style={{ fontWeight: "700", margin: "0 0 10px 0", fontSize: "18px", color: "#1E293B" }}>
                      LKR {post.rent_per_person?.toLocaleString()}
                      <span style={{ fontWeight: "400", fontSize: "14px", color: "#64748B" }}> / person/month</span>
                    </p>
                    <p style={{ color: "#555", margin: "0 0 14px 0", lineHeight: "1.5" }}>{post.description}</p>

                    {/* Tags */}
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ background: "#EFF6FF", color: "#2563eb", padding: "4px 12px", borderRadius: "20px", fontSize: "13px" }}>
                        <Users size={14} style={{ display: 'inline', marginRight: '4px' }} />{post.gender_preference}
                      </span>
                      <span style={{ background: "#F0FDF4", color: "#16A34A", padding: "4px 12px", borderRadius: "20px", fontSize: "13px" }}>
                        <Home size={14} style={{ display: 'inline', marginRight: '4px' }} />{post.available_spots}/{post.total_spots} spots
                      </span>
                      <span style={{ background: "#FFF7ED", color: "#EA580C", padding: "4px 12px", borderRadius: "20px", fontSize: "13px" }}>
                        <Calendar size={14} style={{ display: 'inline', marginRight: '4px' }} />{post.move_in_date}
                      </span>
                      {post.preferences && (
                        <span style={{ background: "#F8FAFC", color: "#64748B", padding: "4px 12px", borderRadius: "20px", fontSize: "13px" }}>
                          ✨ {post.preferences}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right side — Contact */}
                  <div style={{
                    background: "#F8FAFC", borderRadius: "12px", padding: "16px",
                    minWidth: "180px", textAlign: "center"
                  }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "50%",
                      background: "linear-gradient(135deg, #2563eb, #1E293B)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      margin: "0 auto 8px auto", color: "white", fontSize: "20px", fontWeight: "700"
                    }}>
                      {post.poster_name?.charAt(0).toUpperCase()}
                    </div>
                    <p style={{ fontWeight: "600", margin: "0 0 4px 0", color: "#1E293B" }}>{post.poster_name}</p>
                    <p style={{ color: "#64748B", margin: "0 0 12px 0", fontSize: "13px" }}>📞 {post.contact_number}</p>
                    <button style={{
                      background: "#2563eb", color: "white", padding: "8px 20px",
                      border: "none", borderRadius: "8px", cursor: "pointer",
                      width: "100%", fontWeight: "600"
                    }}>
                      Contact
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px" }}>
            <div style={{ fontSize: "64px", marginBottom: "16px" }}><Home size={64} /></div>
            <h2 style={{ color: "#1E293B", marginBottom: "8px" }}>No posts yet</h2>
            <p style={{ color: "#64748B", marginBottom: "24px" }}>Be the first to post a room sharing ad!</p>
            <button
              onClick={() => setShowForm(true)}
              style={{
                background: "#2563eb", color: "white", padding: "12px 28px",
                border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px"
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