// components/ReviewApproval/ReviewApproval.js
import React, { useState } from 'react';
import './ReviewApproval.css';

const ReviewApproval = () => {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      productName: 'Product A',
      rating: 4,
      comment: 'Great product!',
      approved: false,
    },
    {
      id: 2,
      productName: 'Product B',
      rating: 5,
      comment: 'Excellent quality!',
      approved: false,
    },
  ]);

  const handleApprove = (id) => {
    setReviews((prevReviews) =>
      prevReviews.map((review) =>
        review.id === id ? { ...review, approved: true } : review
      )
    );
  };

  const handleReject = (id) => {
    setReviews((prevReviews) => prevReviews.filter((review) => review.id !== id));
  };

  return (
    <div className="review-approval">
      <h2>Pending Reviews</h2>
      <ul className="review-list">
        {reviews.map((review) => (
          <li
            key={review.id}
            className={`review-item ${review.approved ? 'approved' : ''}`}
          >
            <div className="review-details">
              <p><strong>Product:</strong> {review.productName}</p>
              <p><strong>Rating:</strong> {review.rating} / 5</p>
              <p><strong>Comment:</strong> {review.comment}</p>
            </div>
            <div className="review-actions">
              {!review.approved && (
                <>
                  <button
                    className="approve-button"
                    onClick={() => handleApprove(review.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => handleReject(review.id)}
                  >
                    Reject
                  </button>
                </>
              )}
              {review.approved && <span className="approved-label">Approved</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewApproval;
