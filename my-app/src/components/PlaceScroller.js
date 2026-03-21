import React from "react";
import { Home as HomeIcon } from "lucide-react";
import Kandy from "./Kandy.png";
import Colombo from "./Colombo.png";
import Galle from "./Galle.png";
import Negombo from "./Negombo.png";
import "./PlaceScroller.css";

const places = [
  { img: Kandy,   name: 'Kandy',   listings: '1.2K+ listings' },
  { img: Colombo, name: 'Colombo', listings: '4.8K+ listings' },
  { img: Galle,   name: 'Galle',   listings: '900+ listings'  },
  { img: Negombo, name: 'Negombo', listings: '1.1K+ listings' },
];

// Duplicate for seamless infinite scroll loop
const allPlaces = [...places, ...places];

const PlaceScroller = () => (
  <div className="scroller-wrap" aria-label="Popular areas">
    <div className="scroller-track">
      {allPlaces.map(({ img, name, listings }, i) => (
        <div
          key={i}
          className="scroller-card"
          role="button"
          tabIndex={i < places.length ? 0 : -1}
          aria-label={`Explore ${name} – ${listings}`}
        >
          <img src={img} alt={name} className="scroller-img" />
          <div className="scroller-name-tag">{name}</div>
          <div className="scroller-overlay">
            <span className="scroller-badge"><HomeIcon size={12} aria-hidden="true" /> {listings}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default PlaceScroller;
