import React, { useState, useEffect } from "react"
import { CheckCircle } from "lucide-react"
import { submitRating, hasUserRated } from "../services/ratingService"
import { checkBooking } from "../utils/checkBooking"
import "./rateRoom.css"

function RateRoom({ roomId, userId }) {
  const [stars, setStars] = useState(0)
  const [hoverStars, setHoverStars] = useState(0)
  const [selectedTags, setSelectedTags] = useState([])
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [hasAlreadyRated, setHasAlreadyRated] = useState(false)
  const [checkingRating, setCheckingRating] = useState(true)

  // Check if user has already rated this room
  useEffect(() => {
    const checkExistingRating = async () => {
      const alreadyRated = await hasUserRated(userId, roomId)
      setHasAlreadyRated(alreadyRated)
      setCheckingRating(false)
    }
    
    if (userId && roomId) {
      checkExistingRating()
    }
  }, [userId, roomId])

  // Rating preset tags matching each star level - rental room specific
  const ratingTags = {
    1: ["Dirty/Unclean", "Noisy/Loud", "Not comfortable", "Poor condition"],
    2: ["Needs cleaning", "Noisy surroundings", "Missing essentials", "Maintenance issues"],
    3: ["Clean enough", "Basic facilities", "Okay location", "Acceptable"],
    4: ["Well-maintained", "Quiet area", "Good Wi-Fi", "Friendly landlord"],
    5: ["Spotless", "Very peaceful", "Excellent facilities", "Highly satisfied"],
  }

  const currentTags = ratingTags[stars] || []

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = async () => {
    if (stars === 0) {
      setSubmitMessage("Please select a rating")
      return
    }

    setIsSubmitting(true)
    try {
      const eligible = await checkBooking(userId, roomId)

      if (!eligible) {
        setSubmitMessage("You can only rate rooms you have booked")
        setIsSubmitting(false)
        return
      }

      const result = await submitRating(userId, roomId, stars, selectedTags, comment)

      if (result.error) {
        setSubmitMessage(`Error: ${result.error}`)
        setIsSubmitting(false)
        return
      }

      if (result.data) {
        setSubmitMessage("Rating submitted successfully!")
        // Mark as rated to prevent future submissions
        setHasAlreadyRated(true)
        // Reset form
        setTimeout(() => {
          setStars(0)
          setSelectedTags([])
          setComment("")
          setSubmitMessage("")
        }, 2000)
      } else {
        setSubmitMessage("Failed to submit rating. Try again.")
      }
    } catch (error) {
      setSubmitMessage("Error submitting rating")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingLabel = () => {
    const labels = ["", "Poor", "Fair", "Good", "Excellent", "Perfect"]
    return labels[stars] || "Select a rating"
  }

  return (
    <div className="rate-room-container">
      <div className="rate-room-card">
        {/* Header */}
        <div className="rate-room-header">
          <h2 className="rate-room-title">How was your experience?</h2>
          <p className="rate-room-subtitle">Your feedback helps us improve</p>
        </div>

        {/* Already Rated Message */}
        {!checkingRating && hasAlreadyRated ? (
          <div className="already-rated-message">
            <CheckCircle size={20} style={{ display: 'inline', marginRight: '8px' }} />
            You have already rated this room. Thank you for your feedback!
          </div>
        ) : (
          <>
            {/* Star Rating Section */}
            <div className="rating-section">
          <div className="stars-container">
            <div className="stars-wrapper">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`star-button ${
                    star <= (hoverStars || stars) ? "active" : ""
                  } ${hoverStars && star <= hoverStars ? "hover" : ""}`}
                  onMouseEnter={() => setHoverStars(star)}
                  onMouseLeave={() => setHoverStars(0)}
                  onClick={() => setStars(star)}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="rating-label">{getRatingLabel()}</span>
          </div>

          {/* Selected Rating Display */}
          {stars > 0 && (
            <div className="rating-display">
              <span className="rating-value">{stars}</span>
              <span className="rating-max">/ 5</span>
            </div>
          )}
        </div>

        {/* Preset Tags Section */}
        {stars > 0 && (
          <div className="tags-section animate-fade-in">
            <label className="tags-label">What stood out?</label>
            <div className="tags-grid">
              {currentTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-button ${selectedTags.includes(tag) ? "selected" : ""}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Comment Section */}
        {stars > 0 && (
          <div className="comment-section animate-fade-in">
            <label htmlFor="feedback" className="comment-label">
              Additional feedback (optional)
            </label>
            <textarea
              id="feedback"
              className="comment-input"
              placeholder="Share more details about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength="500"
              rows="3"
            />
            <span className="char-count">{comment.length} / 500</span>
          </div>
        )}

        {/* Submit Message */}
        {submitMessage && (
          <div className={`submit-message ${submitMessage.includes("success") ? "success" : "error"}`}>
            {submitMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="button-container">
          <button
            className={`submit-button ${stars > 0 ? "enabled" : "disabled"}`}
            onClick={handleSubmit}
            disabled={stars === 0 || isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
          </>
        )}

        {/* Database Table Structure Comment */}
        {/* 
          ═════════════════════════════════════════════════════════════════
          DATABASE TABLE STRUCTURE - To be implemented in backend
          ═════════════════════════════════════════════════════════════════
          
          TABLE: ratings
          ├── id BIGINT PRIMARY KEY (auto-increment)
          ├── user_id BIGINT (FK -> users.user_id)
          ├── room_id BIGINT (FK -> room_detail.room_id)
          ├── stars INT (1-5)
          ├── tags JSONB or TEXT[] (array of preset tags)
          ├── comment TEXT (optional feedback)
          ├── created_at TIMESTAMP DEFAULT NOW()
          ├── updated_at TIMESTAMP DEFAULT NOW()
          └── indexes: (user_id, room_id), (room_id), (created_at)

          TABLE: rating_tags (Reference table for preset tags)
          ├── id BIGINT PRIMARY KEY
          ├── rating_level INT (1-5)
          ├── tag_name VARCHAR(50)
          ├── display_order INT
          └── INDEX: (rating_level)

          RELATIONSHIPS:
          - One User can have many ratings
          - One Room can have many ratings
          - Rating tags are associated with each rating via JSONB or junction table
        ═════════════════════════════════════════════════════════════════
        */}
      </div>
    </div>
  )
}

export default RateRoom
