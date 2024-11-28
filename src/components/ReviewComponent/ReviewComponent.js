import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { jwtDecode } from 'jwt-decode'; // Use named import
import { fetchReviews, createReview } from '../../api/storeapi'; // Adjust the import path as necessary
import './ReviewComponent.css'; // Adjust the import path as necessary

const ReviewComponent = ({ id, overallRating }) => {
  const [reviews, setReviews] = useState([]);
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [currentReview, setCurrentReview] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await fetchReviews(id);
        console.log('Reviews response:', response); // Log the response
        if (response && response.data) {
          console.log('Reviews data:', response.data); // Log the reviews data
          setReviews(response.data);
        } else {
          console.error('No data in response:', response);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    getReviews();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Extract customer ID from JWT token
      const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
      if (!token) {
        throw new Error('No auth token found');
      }
      const decodedToken = jwtDecode(token.split('=')[1]);
      const customerID = decodedToken.customerID;

      const reviewData = {
        reviewContent: currentReview,
        reviewStars: currentRating,
        productID: id,
        customerID: customerID, // Include customer ID
        approvalStatus: 'pending', // Set the initial approval status
      };
      const response = await createReview(id, reviewData);
      console.log('Review submitted:', response.data);
      setCurrentReview('');
      setCurrentRating(0);
      setHoverRating(0);
      // Optionally, fetch the reviews again to update the list
      const updatedReviews = await fetchReviews(id);
      setReviews(updatedReviews.data);
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

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
      <div className="overall-rating">
        <div className="average-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={25}
              color={overallRating >= star ? "#FFD700" : "#ccc"}
            />
          ))}
        </div>
        <p>{reviews.length > 0 ? `(${overallRating} out of 5)` : "No reviews yet."}</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="star-container">
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
                  color={reviews[currentIndex].reviewStars >= i + 1 ? "#FFD700" : "#ccc"}
                />
              ))}
            </div>
            <p>{reviews[currentIndex].reviewContent}</p>
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
