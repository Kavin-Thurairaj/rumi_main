import React, { useState } from "react";
import "./LandlordSignup.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../auth/supabaseClient";

const LandlordSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    numberOfProperties: "",
    age: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/" },
    });
    if (error) setMessage(error.message);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword)
      return setMessage("Passwords do not match.");
    if (formData.password.length < 6)
      return setMessage("Password must be at least 6 characters.");
    if (!agreeToTerms)
      return setMessage("Please agree to the Terms & Conditions.");
    if (!formData.firstName || !formData.lastName)
      return setMessage("Please enter your first and last name.");

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            age: parseInt(formData.age) || 0,
            role: "Landlord",
          },
        },
      });

      if (error) return setMessage(error.message);
      if (!data.user) return setMessage("Could not create user. Try again.");

      // Auto sign in after signup
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        setMessage("Account created! Please log in.");
        navigate("/login");
      }
      // AuthContext detects session, App.js redirects to /
    } catch (err) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ls-page">
      <div className="ls-image-section">
        <div className="ls-logo-section">
          <div className="ls-logo">
            <span className="ls-logo-text">RUMI</span>
          </div>
        </div>
        <img
          src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Modern property"
          className="ls-bg-image"
        />
        <div className="ls-image-overlay">
          <div className="ls-overlay-badge">Landlord</div>
          <div className="ls-overlay-text">
            <h2>List Your Space,</h2>
            <h2>Find the Right Tenant</h2>
          </div>
        </div>
      </div>

      <div className="ls-form-section">
        <div className="ls-form-card">
          <div className="ls-form-header">
            <div className="ls-building-icon">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="#ccc"
                  strokeWidth="2"
                />
                <path
                  d="M3 9h18M9 21V9"
                  stroke="#ccc"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="ls-title">Sign Up</h3>
            <p className="ls-subtitle">Create your Landlord account</p>
          </div>

          <form onSubmit={handleSubmit} className="ls-form">
            <div className="ls-row">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="ls-input"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="ls-input"
                required
              />
            </div>
            <input
              type="text"
              name="businessName"
              placeholder="Business / Trading name (optional)"
              value={formData.businessName}
              onChange={handleInputChange}
              className="ls-input ls-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className="ls-input ls-full"
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleInputChange}
              className="ls-input ls-full"
              required
            />
            <div className="ls-row">
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className="ls-input"
                required
              />
              <select
                name="numberOfProperties"
                value={formData.numberOfProperties}
                onChange={handleInputChange}
                className="ls-input ls-select"
                required
              >
                <option value="" disabled>
                  No. of properties
                </option>
                <option value="1">1</option>
                <option value="2-5">2 – 5</option>
                <option value="6-10">6 – 10</option>
                <option value="11+">11+</option>
              </select>
            </div>

            <div className="ls-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="ls-input ls-full"
                required
              />
              <button
                type="button"
                className="ls-eye"
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  {showPassword ? (
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
                      stroke="#999"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <>
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        stroke="#999"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#999"
                        strokeWidth="2"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>

            <div className="ls-password-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="ls-input ls-full"
                required
              />
              <button
                type="button"
                className="ls-eye"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  {showConfirm ? (
                    <path
                      d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22"
                      stroke="#999"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ) : (
                    <>
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        stroke="#999"
                        strokeWidth="2"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                        stroke="#999"
                        strokeWidth="2"
                      />
                    </>
                  )}
                </svg>
              </button>
            </div>

            <div className="ls-terms">
              <input
                type="checkbox"
                id="ls-terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label htmlFor="ls-terms">
                I agree to the{" "}
                <a href="#" className="ls-link">
                  Terms & Conditions
                </a>
              </label>
            </div>

            {message && (
              <p style={{ color: "red", fontSize: 13, margin: "0" }}>
                {message}
              </p>
            )}

            <button type="submit" className="ls-submit-btn" disabled={loading}>
              {loading ? "Please wait..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="ls-login-row">
            <p>
              Already have an account?{" "}
              <span
                className="ls-link"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>

          <div className="ls-divider">
            <span>or</span>
          </div>

          <div className="ls-social-btns">
            <button
              type="button"
              className="ls-social-btn"
              onClick={handleGoogleSignIn}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordSignup;
