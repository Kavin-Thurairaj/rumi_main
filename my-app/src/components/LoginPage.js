import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('Tenant');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted:', { ...formData, userType });
  };

  return (
    <div className="login-page">
      <div className="lp-image-section">
        <div className="lp-logo-section">
          <div className="lp-logo"><span className="lp-logo-text">RUMI</span></div>
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
                <circle cx="12" cy="12" r="10" stroke="#ccc" strokeWidth="2"/>
                <circle cx="12" cy="8" r="3" stroke="#ccc" strokeWidth="2"/>
                <path d="M6.168 18.849A4 4 0 0110 16h4a4 4 0 013.834 2.855" stroke="#ccc" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="lp-title">Welcome Back</h3>
            <p className="lp-subtitle">Login as</p>
          </div>

          <div className="lp-role-selector">
            <button type="button" className={`lp-role-btn ${userType === 'Tenant' ? 'active' : ''}`} onClick={() => setUserType('Tenant')}>Tenant</button>
            <button type="button" className={`lp-role-btn ${userType === 'Landlord' ? 'active' : ''}`} onClick={() => setUserType('Landlord')}>Landlord</button>
          </div>

          <form onSubmit={handleSubmit} className="lp-form">
            <input type="email" name="email" placeholder="Email address"
              value={formData.email} onChange={handleInputChange} className="lp-input" required />

            <div className="lp-password-wrapper">
              <input type={showPassword ? 'text' : 'password'} name="password"
                placeholder="Password" value={formData.password}
                onChange={handleInputChange} className="lp-input" required />
              <button type="button" className="lp-eye-btn" onClick={() => setShowPassword(!showPassword)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  {showPassword ? (
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#999" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="3" stroke="#999" strokeWidth="2"/>
                    </>
                  )}
                </svg>
              </button>
            </div>

            <div className="lp-forgot-row">
              <a href="#" className="lp-forgot-link">Forgot password?</a>
            </div>

            <button type="submit" className="lp-submit-btn">LOGIN</button>
          </form>

          <div className="lp-signup-row">
            <p>Don't have an account?{' '}
              <span className="lp-link" style={{cursor:'pointer'}} onClick={() => navigate(userType === 'Tenant' ? '/signup/tenant' : '/signup/landlord')}>
                {userType === 'Tenant' ? 'Sign up as Tenant' : 'Sign up as Landlord'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
