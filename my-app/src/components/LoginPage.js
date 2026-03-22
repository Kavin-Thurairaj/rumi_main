import React, { useState } from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../auth/supabaseClient";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("Tenant");
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
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Supabase returns this error when email is not verified
        if (error.message.toLowerCase().includes("email not confirmed")) {
          return setMessage(
            "❌ Please verify your email before logging in. Check your inbox for the confirmation link.",
          );
        }
        return setMessage("❌ " + error.message);
      }

      // AuthContext detects session, App.js redirects automatically
    } catch (err) {
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="lp-image-section">
        <div className="lp-logo-section">
          <div className="lp-logo">
            <span className="lp-logo-text">RUMI</span>
          </div>
        </div>
        <img
          src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Modern interior"
          className="lp-bg-image"
        />
        <div className="lp-image-overlay">
          <div className="lp-overlay-text">
            <h2>Your Perfect Space</h2>
            <h2>Awaits You</h2>
          </div>
        </div>
      </div>

      <div className="lp-form-section">
        <div className="lp-form-inner">
          <div className="lp-form-header">
            <div className="lp-user-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#ccc" strokeWidth="2" />
                <circle cx="12" cy="8" r="3" stroke="#ccc" strokeWidth="2" />
                <path
                  d="M6.168 18.849A4 4 0 0110 16h4a4 4 0 013.834 2.855"
                  stroke="#ccc"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <h3 className="lp-title">Welcome Back</h3>
            <p className="lp-subtitle">Login as</p>
          </div>

          <div className="lp-role-selector">
            <button
              type="button"
              className={`lp-role-btn ${userType === "Tenant" ? "active" : ""}`}
              onClick={() => setUserType("Tenant")}
            >
              Tenant
            </button>
            <button
              type="button"
              className={`lp-role-btn ${userType === "Landlord" ? "active" : ""}`}
              onClick={() => setUserType("Landlord")}
            >
              Landlord
            </button>
          </div>

          <form onSubmit={handleSubmit} className="lp-form">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className="lp-input"
              required
            />

            <div className="lp-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="lp-input"
                required
              />
              <button
                type="button"
                className="lp-eye-btn"
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

            <div className="lp-forgot-row">
              <a href="#" className="lp-forgot-link">
                Forgot password?
              </a>
            </div>

            {message && (
              <p style={{ color: "red", fontSize: 13, margin: "0" }}>
                {message}
              </p>
            )}

            <button type="submit" className="lp-submit-btn" disabled={loading}>
              {loading ? "Please wait..." : "LOGIN"}
            </button>
          </form>

          <div className="lp-signup-row">
            <p>
              Don't have an account?{" "}
              <span
                className="lp-link"
                onClick={() =>
                  navigate(
                    userType === "Tenant"
                      ? "/signup/tenant"
                      : "/signup/landlord",
                  )
                }
              >
                {userType === "Tenant"
                  ? "Sign up as Tenant"
                  : "Sign up as Landlord"}
              </span>
            </p>
          </div>

          <div className="lp-divider">
            <span>or</span>
          </div>

          <div className="lp-social-btns">
            <button
              type="button"
              className="lp-social-btn"
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

export default LoginPage;
