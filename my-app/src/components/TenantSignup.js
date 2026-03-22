import React, { useState } from "react";
import "./TenantSignup.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../auth/supabaseClient";

const TenantSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
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
  setMessage('');

  if (formData.password !== formData.confirmPassword)
    return setMessage('Passwords do not match.');
  if (formData.password.length < 6)
    return setMessage('Password must be at least 6 characters.');
  if (!agreeToTerms)
    return setMessage('Please agree to the Terms & Conditions.');
  if (!formData.firstName || !formData.lastName)
    return setMessage('Please enter your first and last name.');

  setLoading(true);

  try {
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          first_name: formData.firstName,
          last_name:  formData.lastName,
          age:        parseInt(formData.age) || 0,
          role:       'Tenant',
          phone:      formData.phone || '',
        }
      }
    });

    if (error)      return setMessage(error.message);
    if (!data.user) return setMessage('Could not create user. Try again.');

    setMessage('✅ Account created! Please check your email to verify your account before logging in.');

  } catch (err) {
    setMessage('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="ts-page">
      <div className="ts-image-section">
        <div className="ts-logo-section">
          <div className="ts-logo">
            <span className="ts-logo-text">RUMI</span>
          </div>
        </div>
        <img
          src="https://images.pexels.com/photos/3754595/pexels-photo-3754595.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Modern bedroom"
          className="ts-bg-image"
        />
        <div className="ts-image-overlay">
          <div className="ts-overlay-badge">Tenant</div>
          <div className="ts-overlay-text">
            <h2>Away from Home,</h2>
            <h2>Yet Feels Like Home</h2>
          </div>
        </div>
      </div>

      <div className="ts-form-section">
        <div className="ts-form-inner">
          <div className="ts-form-header">
            <div className="ts-user-icon">
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
            <h3 className="ts-title">Sign Up</h3>
            <p className="ts-subtitle">Create your Tenant account</p>
          </div>

          <form onSubmit={handleSubmit} className="ts-form">
            <div className="ts-row">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="ts-input"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="ts-input"
                required
              />
            </div>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleInputChange}
              className="ts-input ts-full"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number (optional)"
              value={formData.phone}
              onChange={handleInputChange}
              className="ts-input ts-full"
            />

            <div className="ts-password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="ts-input ts-full"
                required
              />
              <button
                type="button"
                className="ts-eye"
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

            <div className="ts-password-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="ts-input ts-full"
                required
              />
              <button
                type="button"
                className="ts-eye"
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

            <div className="ts-terms">
              <input
                type="checkbox"
                id="ts-terms"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
              />
              <label htmlFor="ts-terms">
                I agree to the{" "}
                <a href="#" className="ts-link">
                  Terms & Conditions
                </a>
              </label>
            </div>

            {message && (
              <p style={{ color: "red", fontSize: 13, margin: "0" }}>
                {message}
              </p>
            )}

            <button type="submit" className="ts-submit-btn" disabled={loading}>
              {loading ? "Please wait..." : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="ts-login-row">
            <p>
              Already have an account?{" "}
              <span
                className="ts-link"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>

          <div className="ts-divider">
            <span>or</span>
          </div>

          <div className="ts-social-btns">
            <button
              type="button"
              className="ts-social-btn"
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

export default TenantSignup;
