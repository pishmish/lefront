import React, { useEffect, useState } from "react";
import { fetchUserProfile, updateUserProfile } from "../../api/userapi"; // Import API functions
import "./CustomerInfo.css";

const CustomerInfo = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user profile data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetchUserProfile();
        //console.log("response profilepage:", response);
        setUserData(response.data);
        setUpdatedData({
          name: response.data.user.name,
          phone: response.data.customer.phone || "",
          email: response.data.user.email,
          taxID: response.data.customer.taxID || "",
        });
        console.log("userData:", userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setErrorMessage("Failed to load user data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setErrorMessage("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      await updateUserProfile(updatedData);
      setUserData({
        ...userData,
        user: { ...userData.user, name: updatedData.name, email: updatedData.email },
        customer: { ...userData.customer, phone: updatedData.phone, taxID: updatedData.taxID },
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
      setErrorMessage("Failed to update profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>{errorMessage || "No user data available."}</p>;

  return (
    <div className="customer-info">
      <h2>Customer Information</h2>

      <div className="profile-section">
        <p>
          <strong>Name:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={updatedData.name}
              onChange={handleInputChange}
            />
          ) : (
            userData.user.name
          )}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="email"
              value={updatedData.email}
              onChange={handleInputChange}
            />
          ) : (
            userData.user.email
          )}
        </p>
        <p>
          <strong>Phone:</strong>{" "}
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={updatedData.phone}
              onChange={handleInputChange}
            />
          ) : (
            userData.customer.phone || "No phone number provided"
          )}
        </p>
        <p>
          <strong>Tax ID:</strong>{" "}
          {isEditing ? (
            <input
              type="number"
              name="taxID"
              value={updatedData.taxID}
              onChange={handleInputChange}
            />
          ) : (
            userData.customer.taxID || "No tax ID provided"
          )}
        </p>
        <p>
          <strong>Default Address:</strong> {userData.address.streetAddress},{" "}
          {userData.address.city}, {userData.address.country}
        </p>
      </div>

      {isEditing ? (
        <div className="edit-buttons">
          <button onClick={handleSave} disabled={loading}>
            Save
          </button>
          <button onClick={handleEditToggle} disabled={loading}>
            Cancel
          </button>
        </div>
      ) : (
        <button className="edit-profile-button" onClick={handleEditToggle}>
          Edit Profile
        </button>
      )}

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default CustomerInfo;
