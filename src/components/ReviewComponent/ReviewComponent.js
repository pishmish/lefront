import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import {jwtDecode} from 'jwt-decode';
import { createReview, fetchOverAllRating, fetchReviews } from '../../api/storeapi'; // Adjust the import path as necessary
import './ReviewComponent.css'; // Adjust the import path as necessary

const ReviewComponent = ({ productID }) => {
  const [reviews, setReviews] = useState([]);
  const [currentRating, setCurrentRating] = useState(0);
  const [overallRating, setOverallRating] = useState();
  const [hoverRating, setHoverRating] = useState(0);
  const [currentReview, setCurrentReview] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const getOverallRating = async () => {
    try {
      const response = await fetchOverAllRating(productID);
      if (response && response.data) {
        setOverallRating(response.data[0].overallRating);
      }
    } catch (error) {
      console.error('Error fetching overall rating:', error);
    }
  };

  const getReviews = async () => {
    try {
      const response = await fetchReviews(productID);
      if (response && response.data) {
        //console.log('Reviews data:', response.data); // Log the reviews data

        // Modify reviewContent based on approvalStatus
        const modifiedReviews = response.data.map(review => {
          if (review.approvalStatus === 0) {
            review.reviewContent = "";
          } else if (review.approvalStatus === 2) {
            review.reviewContent = "";
          }
          // If approvalStatus is 1, keep the same review content
          return review;
        });

        //console.log('Modified reviews:', modifiedReviews); // Log the modified reviews

        setReviews(modifiedReviews);
        // Fetch overall rating separately
        await getOverallRating();
      } else {
        console.error('No data in response:', response);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    getReviews();
  }, [productID, getReviews]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      if (currentRating === 0) {
        setErrorMessage('Please select a star rating.');
        return;
      }

      const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
      if (!token) {
        console.log('No auth token found');
        navigate('/login'); // Redirect to login page
        return;
      }

      const decodedToken = jwtDecode(token.split('=')[1]);
      const customerID = decodedToken.customerID;

      if (!customerID) {
        console.log('Customer ID not found in token');
        navigate('/login'); // Redirect to login page
        return;
      }

      const response = await createReview({ 
        productID: productID, 
        reviewContent: currentReview, 
        reviewStars: currentRating, 
        customerID: customerID 
      });

      if (response.status === 200){
      setSuccessMessage('Review submitted successfully!');
      // Clear form
      setCurrentReview('');
      setCurrentRating(0);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
      
      // Refresh reviews and overall rating
      await getReviews();
      await getOverallRating();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      setErrorMessage('Failed to submit review. Please try again.');
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
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && (
          <div className="success-message" style={{
            color: 'green',
            padding: '10px',
            marginTop: '10px',
            backgroundColor: '#f0fff0',
            borderRadius: '4px'
          }}>
            {successMessage}
          </div>
        )}
      </form>

      <h3>Reviews</h3>
      {reviews.length > 0 && (
        <div className="review-carousel">
          <button className="nav-button prev" onClick={handlePrev}>
            &lt;
          </button>
          <div className="review-item">
            <div className="review-stars">
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