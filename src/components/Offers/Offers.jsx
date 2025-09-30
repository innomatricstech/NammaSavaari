import React, { useState } from "react";
import "./Offers.css"

export default function OfferForm() {
  const [offerData, setOfferData] = useState({
    offerLine: "",
    couponCode: "",
    validTill: "",
    termsAndConditions: "",
    selectedImage: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setOfferData({ ...offerData, [id]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setOfferData({ ...offerData, selectedImage: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Offer uploaded successfully!");
  };

  return (
    <div className="offer-container">
      <h2 className="form-title">Upload Offer</h2>

      {/* Image Preview */}
      <div className="image-box">
        {offerData.selectedImage ? (
          <img src={offerData.selectedImage} alt="Offer" />
        ) : (
          <p>No image selected</p>
        )}
      </div>

      {/* Upload button */}
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        onChange={handleImageChange}
        hidden
      />
      <label htmlFor="imageUpload" className="btn-red">
        Select Offer Image
      </label>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="offerLine"
          placeholder="Offer Line"
          value={offerData.offerLine}
          onChange={handleChange}
        />
        <input
          type="text"
          id="couponCode"
          placeholder="Coupon Code"
          value={offerData.couponCode}
          onChange={handleChange}
        />
        <input
          type="date"
          id="validTill"
          value={offerData.validTill}
          onChange={handleChange}
        />
        <textarea
          id="termsAndConditions"
          placeholder="Terms and Conditions"
          value={offerData.termsAndConditions}
          onChange={handleChange}
        />

        <button type="submit" className="btn-red">
          Upload Offer
        </button>
      </form>

      <button className="btn-red-outline">View Offers</button>
    </div>
  );
}
