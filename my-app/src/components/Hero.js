import React from "react";
import "./Hero.css";
import heroImage from "./hero-image.png";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useAuth } from "../auth/AuthContext";

export default function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-eyebrow"><Home size={13} aria-hidden="true" style={{ flexShrink: 0 }} /> Sri Lanka's #1 Room Rental Platform</p>

        <h1 className="her_1">Pick it</h1>
        <h1 className="her_2">Rent it</h1>
        <h1 className="her_3">Enjoy it</h1>

        <div className="hero-cta-row">
          <button className="hero-post-btn" onClick={() => navigate(user ? "/dashboard/landlord" : "/login")}>
            <svg
              width="14" height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Post Your Ad Free
          </button>
        </div>
      </div>

      <div className="hero-image">
        <img src={heroImage} alt="Modern furnished room" />
      </div>
    </section>
  );
}
