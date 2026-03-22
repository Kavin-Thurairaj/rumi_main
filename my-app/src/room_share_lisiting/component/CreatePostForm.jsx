import { useState } from "react";
import roomSharePostApi from "../../api/roomSharePostApi";

const inputStyle = {
  width: "100%", padding: "11px 14px", borderRadius: "10px",
  border: "1.5px solid #e5e7eb", fontSize: "14px", fontWeight: 500,
  color: "#374151", background: "#f9fafb", fontFamily: "inherit",
  boxSizing: "border-box", transition: "border-color 0.15s", outline: "none",
};

const labelStyle = {
  fontSize: "11px", fontWeight: 700, color: "#9ca3af",
  letterSpacing: "0.6px", textTransform: "uppercase",
  display: "block", marginBottom: "6px",
};

const CreatePostForm = ({ onPostCreated }) => {
  const [formData, setFormData] = useState({
    title: "", location: "", rent_per_person: "", gender_preference: "",
    total_spots: "", available_spots: "", move_in_date: "",
    poster_name: "", contact_number: "", description: "", preferences: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await roomSharePostApi.createPost({
        ...formData,
        rent_per_person: parseInt(formData.rent_per_person),
        total_spots: parseInt(formData.total_spots),
        available_spots: parseInt(formData.available_spots),
      });
      setSuccess(true);
      setFormData({
        title: "", location: "", rent_per_person: "", gender_preference: "",
        total_spots: "", available_spots: "", move_in_date: "",
        poster_name: "", contact_number: "", description: "", preferences: "",
      });
      if (onPostCreated) onPostCreated();
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: "white", borderRadius: "20px", marginBottom: "28px",
      border: "1px solid #e6eeff", overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,30,80,0.08)",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #003f8a 0%, #0057b8 100%)",
        padding: "20px 28px",
      }}>
        <h2 style={{ margin: 0, color: "#fff", fontSize: "18px", fontWeight: 800 }}>
          Post a Room Sharing Ad
        </h2>
        <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
          Fill in the details below — it only takes 2 minutes
        </p>
      </div>

      <div style={{ padding: "28px" }}>
        {success && (
          <div style={{
            background: "#dcfce7", border: "1px solid #bbf7d0", borderRadius: "10px",
            padding: "12px 16px", marginBottom: "20px", color: "#16a34a", fontWeight: 600, fontSize: "14px",
          }}>
            ✅ Post created successfully!
          </div>
        )}
        {error && (
          <div style={{
            background: "#fee2e2", border: "1px solid #fecaca", borderRadius: "10px",
            padding: "12px 16px", marginBottom: "20px", color: "#dc2626", fontWeight: 600, fontSize: "14px",
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

            <div>
              <label style={labelStyle}>Title *</label>
              <input name="title" value={formData.title} onChange={handleChange} required
                placeholder="e.g. Looking for female roommate near IIT"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1a4fa8"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>

            <div>
              <label style={labelStyle}>Location *</label>
              <input name="location" value={formData.location} onChange={handleChange} required
                placeholder="e.g. Colombo 07"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1a4fa8"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>

            <div>
              <label style={labelStyle}>Rent per Person (LKR) *</label>
              <input name="rent_per_person" type="number" value={formData.rent_per_person} onChange={handleChange} required
                placeholder="e.g. 15000"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1a4fa8"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>

            <div>
              <label style={labelStyle}>Gender Preference *</label>
              <select name="gender_preference" value={formData.gender_preference} onChange={handleChange} required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1a4fa8"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Any">Any</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Total Spots *</label>
              <input name="total_spots" type="number" value={formData.total_spots} onChange={handleChange} required
                placeholder="e.g. 3"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1a4fa8"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>

            <div>
              <label style={labelStyle}>Available Spots *</label>
              <input name="available_spots" type="number" value={formData.available_spots} onChange={handleChange} required
                placeholder="e.g. 1"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1a4fa8"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>

            <div>
              <label style={labelStyle}>Move In Date *</label>
              <input name="move_in_date" type="date" value={formData.move_in_date} onChange={handleChange} required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1a4fa8"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>

            <div>
              <label style={labelStyle}>Your Name *</label>
              <input name="poster_name" value={formData.poster_name} onChange={handleChange} required
                placeholder="e.g. Akshaiaan"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1a4fa8"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>

            <div>
              <label style={labelStyle}>Contact Number *</label>
              <input name="contact_number" value={formData.contact_number} onChange={handleChange} required
                placeholder="e.g. 0771234567"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1a4fa8"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>

            <div>
              <label style={labelStyle}>Preferences</label>
              <input name="preferences" value={formData.preferences} onChange={handleChange}
                placeholder="e.g. Students only, no pets"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1a4fa8"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required
                placeholder="Describe the room, facilities, location details..."
                rows={4}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={e => e.target.style.borderColor = "#1a4fa8"}
                onBlur={e => e.target.style.borderColor = "#e5e7eb"} />
            </div>

          </div>

          <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
            <button type="submit" disabled={loading} style={{
              background: loading ? "#93c5fd" : "linear-gradient(135deg, #003f8a, #0057b8)",
              color: "white", padding: "12px 32px", border: "none",
              borderRadius: "10px", cursor: loading ? "not-allowed" : "pointer",
              fontSize: "14px", fontWeight: 700,
              boxShadow: loading ? "none" : "0 4px 14px rgba(0,87,184,0.28)",
            }}>
              {loading ? "Posting..." : "Post Ad"}
            </button>
            <span style={{ fontSize: "12px", color: "#9ca3af" }}>* Required fields</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostForm;