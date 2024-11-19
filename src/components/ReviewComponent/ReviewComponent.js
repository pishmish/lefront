import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "./ReviewComponent.css";

const ReviewComponent = () => {
  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState("");
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentRating === 0 || currentReview === "") {
      alert("Please select a star rating and write a review.");
      return;
    }

    const newReview = {
      id: Date.now(),
      review: currentReview,
      rating: currentRating,
      date: new Date().toLocaleString(),
    };

    setReviews([...reviews, newReview]);
    setCurrentReview("");
    setCurrentRating(0);
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const averageRating = calculateAverageRating();

  const handleNext = () => {
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="review-container">
      <h2>Average Rating</h2>
      <div className="average-rating">
        <div className="average-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={25}
              color={averageRating >= star ? "#FFD700" : "#ccc"}
            />
          ))}
        </div>
        <p>{reviews.length > 0 ? `(${averageRating} out of 5)` : "No reviews yet."}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="star-container">
          <h3>Star Rating</h3>
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={30}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setCurrentRating(star)}
              color={(hoverRating || currentRating) >= star ? "#FFD700" : "#ccc"}
            />
          ))}
        </div>
        <textarea
          value={currentReview}
          onChange={(e) => setCurrentReview(e.target.value)}
          placeholder="Write your review here..."
          rows="4"
          className="review-input"
        />
        <button type="submit" className="submit-button">
          Submit Review
        </button>
      </form>

      <h3>Reviews</h3>
      {reviews.length > 0 && (
        <div className="review-carousel">
          <button className="nav-button prev" onClick={handlePrev}>
            &lt;
          </button>
          <div className="review-item">
            <div className="review-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  size={20}
                  color={i < reviews[currentIndex].rating ? "#FFD700" : "#ccc"}
                />
              ))}
            </div>
            <p className="review-text">{reviews[currentIndex].review}</p>
            <p className="review-date">{reviews[currentIndex].date}</p>
          </div>
          <button className="nav-button next" onClick={handleNext}>
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewComponent;
