
import React, { useState, useEffect } from "react";
import Room from './Room.png';
import Annex from './Annex.png';
import Home from './Home.png';
import Apartment from './Apartment.png';
import Boarding from './Boarding.png';
import "./CategoryCarousel.css";

const categoryImages = [
  Room,
  Annex,
  Home,
  Apartment,
  Boarding
];

const CategoryCarousel = () => {
  const [activeCategory, setActiveCategory] = useState(0);

  // Auto-rotate categories every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCategory(prev => (prev + 1) % categoryImages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Assign position classes for styling
  const getPositionClass = (index) => {
    const diff = (index - activeCategory + categoryImages.length) % categoryImages.length;
    switch (diff) {
      case 0: return "center";
      case 1: return "right";
      case 2: return "far-right";
      case categoryImages.length - 1: return "left";
      case categoryImages.length - 2: return "far-left";
      default: return "";
    }
  };

  return (
    <div className="category-carousel-container">
      {categoryImages.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`category-${index}`}
          className={`category-carousel-image ${getPositionClass(index)}`}
        />
      ))}
    </div>
  );
};

export default CategoryCarousel;
