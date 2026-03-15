import React from "react";
import "./Hero.css";
import heroImage from "./hero-image.png";


export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        
          <h1 className="her_1">Pick it </h1><br />
          <h1 className="her_2">Rent it</h1> <br />
          <h1 className="her_3">Enjoy it</h1>
        
      </div>

      <div className="hero-image">
        <img src={heroImage} alt="Furniture" />
      </div>
    </section>
  );
}
