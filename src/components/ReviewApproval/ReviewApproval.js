// components/ReviewApproval/ReviewApproval.js
import React, { useState, useEffect } from 'react';
import { fetchPendingReviews, updateReviewApprovalStatus } from '../../api/storeapi';
import './ReviewApproval.css';

const ReviewApproval = ({ username }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getReviews = async () => {
      try {
        const response = await fetchPendingReviews(username);
        //console.log('username:', username);
        if (response && response.data) {
          // console.log('Pending reviews:', response.data);
          setReviews(response.data);
        } else {
          console.error('No data in response:', response);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setError('Failed to fetch pending reviews');
      }
    };

    if (username) {
      getReviews();
    }
  }, [username]);

  const handleApprove = async (reviewId) => {
    try {
      await updateReviewApprovalStatus(reviewId, { approvalStatus: 1 });
      setReviews(prevReviews => 
        prevReviews.filter(review => review.reviewID !== reviewId)
      );
    } catch (error) {
      console.error('Error approving review:', error);
    }
  };

  const handleReject = async (reviewId) => {
    try {
      await updateReviewApprovalStatus(reviewId, { approvalStatus: 2 });
      setReviews(prevReviews => 
        prevReviews.filter(review => review.reviewID !== reviewId)
      );
    } catch (error) {
      console.error('Error rejecting review:', error);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="review-approval">
      {reviews.length === 0 ? (
        <p>No pending reviews</p>
      ) : (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.reviewID} className="review-item">
              <div className="review-details">
                <p><strong>Product ID:</strong> {review.productID}</p>
                <p><strong>Customer ID:</strong> {review.customerID}</p>
                <p><strong>Rating:</strong> {review.reviewStars} / 5</p>
                <p><strong>Review:</strong> {review.reviewContent}</p>
              </div>
              <div className="review-actions">
                <button
                  className="approve-button"
                  onClick={() => handleApprove(review.reviewID)}
                >
                  Approve
                </button>
                <button
                  className="reject-button"
                  onClick={() => handleReject(review.reviewID)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewApproval;
