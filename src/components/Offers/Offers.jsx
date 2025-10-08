import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./Offers.css";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_red.css"; // flatpickr theme

export default function OfferForm() {
  const [offerData, setOfferData] = useState({
    offerLine: "",
    couponCode: "",
    validTill: "",
    terms: "",
    selectedImage: null,
    imageFile: null,
  });

  const [uploading, setUploading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [viewOffers, setViewOffers] = useState(false);

  // Handle text inputs
  const handleChange = (e) => {
    const { id, value } = e.target;
    setOfferData({ ...offerData, [id]: value });
  };

  // Handle image upload selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }
      setOfferData({
        ...offerData,
        selectedImage: URL.createObjectURL(file),
        imageFile: file,
      });
    }
  };

  // Upload offer to Firestore + Storage
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offerData.offerLine || !offerData.couponCode || !offerData.imageFile) {
      alert("Please fill all required fields and select an image.");
      return;
    }

    try {
      setUploading(true);

      const storageRef = ref(
        storage,
        `offers/${offerData.imageFile.name}_${Date.now()}`
      );

      const imageUrl = await new Promise((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, offerData.imageFile);
        uploadTask.on(
          "state_changed",
          null,
          (error) => reject(error),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(url);
          }
        );
      });

      const offersCollectionRef = collection(db, "admin", "admin_offers", "offers");
      await addDoc(offersCollectionRef, {
        offerLine: offerData.offerLine,
        couponCode: offerData.couponCode,
        validTill: offerData.validTill,
        terms: offerData.terms,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Offer uploaded successfully!");
      setOfferData({
        offerLine: "",
        couponCode: "",
        validTill: "",
        terms: "",
        selectedImage: null,
        imageFile: null,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Failed to upload offer: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Fetch ALL offers from Firestore
  useEffect(() => {
    if (viewOffers) {
      const offersRef = collection(db, "admin", "admin_offers", "offers");
      const q = query(offersRef, orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedOffers = snapshot.docs.map((doc) => ({
          id: doc.id,
          refPath: doc.ref.path,
          ...doc.data(),
        }));
        setOffers(fetchedOffers);
      });
      return () => unsubscribe();
    }
  }, [viewOffers]);

  // Delete offer from Firestore
  const handleDelete = async (offer) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${offer.offerLine}"?`
    );
    if (!confirmDelete) return;

    try {
      const docRef = doc(db, "admin", "admin_offers", "offers", offer.id);
      await deleteDoc(docRef);
      alert("Offer deleted successfully!");
    } catch (error) {
      console.error("Error deleting offer:", error);
      alert("Failed to delete offer.");
    }
  };

  return (
    <div className="offer-container">
      <h2 className="form-title">Upload Offer</h2>

      {/* Image Preview */}
      <div className="image-box">
        {offerData.selectedImage ? (
          <img src={offerData.selectedImage} alt="Offer Preview" />
        ) : (
          <p>No image selected</p>
        )}
      </div>

      {/* Image Upload */}
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
        <label htmlFor="offerLine" className="input-label">
          Offer Line
        </label>
        <input
          type="text"
          id="offerLine"
          placeholder="Enter offer headline"
          value={offerData.offerLine}
          onChange={handleChange}
          required
        />

        <label htmlFor="couponCode" className="input-label">
          Coupon Code
        </label>
        <input
          type="text"
          id="couponCode"
          placeholder="Enter coupon code"
          value={offerData.couponCode}
          onChange={handleChange}
          required
        />

        <label htmlFor="validTill" className="input-label">
          Valid Till
        </label>
        <Flatpickr
          id="validTill"
          value={offerData.validTill}
          onChange={([date]) => {
            if (date) {
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
              const day = String(date.getDate()).padStart(2, "0");
              setOfferData({ ...offerData, validTill: `${year}-${month}-${day}` });
            } else {
              setOfferData({ ...offerData, validTill: "" });
            }
          }}
          options={{
            dateFormat: "Y-m-d",
            minDate: "today",
            disableMobile: false,
          }}
          className="input-date"
          placeholder="Select date"
        />

        <label htmlFor="terms" className="input-label">
          Terms & Conditions
        </label>
        <textarea
          id="terms"
          placeholder="Enter offer terms and conditions"
          value={offerData.terms}
          onChange={handleChange}
        />

        <button type="submit" className="btn-red" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Offer"}
        </button>
      </form>

      {/* View Offers Toggle */}
      <button
        className="btn-red-outline mt-3"
        onClick={() => setViewOffers(!viewOffers)}
      >
        {viewOffers ? "Hide Offers" : "View Offers"}
      </button>

      {/* Offers List */}
      {viewOffers && (
        <div className="offers-list mt-4">
          {offers.length === 0 ? (
            <p className="no-offers">No offers available.</p>
          ) : (
            offers.map((offer) => (
              <div className="offer-row" key={offer.id}>
                <div className="offer-row-image">
                  <img src={offer.imageUrl} alt={offer.offerLine} />
                </div>
                <div className="offer-row-details">
                  <h4>{offer.offerLine}</h4>
                  <p><strong>Coupon:</strong> {offer.couponCode}</p>
                  {offer.validTill && (
                    <p><strong>Valid Till:</strong> {offer.validTill}</p>
                  )}
                  {offer.terms && (
                    <p className="terms-text">{offer.terms}</p>
                  )}
                  <button
                    className="btn-red delete-btn"
                    onClick={() => handleDelete(offer)}
                  >
                    Delete Offer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
