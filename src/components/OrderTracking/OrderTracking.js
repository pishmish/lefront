import React, { useState } from "react";
import "./OrderTracking.css";

const OrderTracking = ({ orderId, customerId }) => {
  const steps = ["Processing", "In-transit", "Delivered"];
  const [currentStep, setCurrentStep] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubAccordionExpanded, setIsSubAccordionExpanded] = useState(false);

  const handleStepClick = (index) => {
    if (index <= currentStep + 1) {
      setCurrentStep(index);
    }
  };

  return (
    <div className="order-tracking-container">
      {/* Ana Akordeon Başlığı */}
      <div className="accordion-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h4>Order ID: {orderId}</h4>
      </div>

      {/* Ana Akordeon İçeriği */}
      {isExpanded && (
        <div className="accordion-content">
          {/* Sipariş Detayları */}
          <div className="order-details">
            <p><strong>Customer ID:</strong> {customerId}</p>
          </div>
          {/* Adımlar */}
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={index} className="step-wrapper">
                <div
                  className={`step ${index <= currentStep ? "active" : ""}`}
                  onClick={() => handleStepClick(index)}
                >
                  <div className="circle">{index + 1}</div>
                  <p className="step-label">{step}</p>
                </div>
                {index < steps.length - 1 && <div className="step-line"></div>}
              </div>
            ))}
          </div>
          {/* Alt Akordeon */}
          <div className="sub-accordion">
            <div
              className="accordion-header"
              onClick={() => setIsSubAccordionExpanded(!isSubAccordionExpanded)}
            >
              <h5>Order Content</h5>
            </div>
            {isSubAccordionExpanded && (
              <div className="accordion-content">
                <p><strong>Ordered Products:</strong> Product 1, Product 2</p>
                <p><strong>Address:</strong> 123 Main St, City, Country</p>
                <p><strong>Total Price:</strong> $99.99</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
