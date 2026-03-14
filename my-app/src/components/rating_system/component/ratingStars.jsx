import React, { useState } from "react"

function RatingStars({ rating = 0, max = 5, onRate }) {
  const [hover, setHover] = useState(0)
  const value = Math.round(rating)

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 14 }}>
      {Array.from({ length: max }, (_, index) => {
        const star = index + 1
        const active = hover ? star <= hover : star <= value
        return (
          <span
            key={star}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onRate && onRate(star)}
            style={{
              cursor: onRate ? "pointer" : "default",
              color: active ? "#f59e0b" : "#d1d5db",
              fontSize: 18,
              lineHeight: 1,
            }}
          >
            ★
          </span>
        )
      })}
      <span style={{ marginLeft: 6, fontSize: 12, color: "#334155" }}>{rating.toFixed(1)} / {max}</span>
    </div>
  )
}

export default RatingStars