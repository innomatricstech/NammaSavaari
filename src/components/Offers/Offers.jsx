import React, { useState, useEffect } from "react";
import { db, storage } from "../../firebase";
import {
  collection,
  collectionGroup,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "./Offers.css";

export default function OfferForm() {
  const [offerData, setOfferData] = useState({
    offerLine: "",
    couponCode: "",
    validTill: "",
    terms: "", 
    selectedImage: null, // Preview URL
    imageFile: null, // File to upload
  });

  const [uploading, setUploading] = useState(false);
  const [offers, setOffers] = useState([]);
  const [viewOffers, setViewOffers] = useState(false);

  const adminDocId = "admin"; // Document ID under 'admin' collection

  // --- Input handlers ---
  const handleChange = (e) => {
    const { id, value } = e.target;
    setOfferData({ ...offerData, [id]: value });
  };

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

  // --- Form submission ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offerData.offerLine || !offerData.couponCode || !offerData.imageFile) {
      alert("Please fill all required fields and select an image.");
      return;
    }

    try {
      setUploading(true);

      // Upload image to Firebase Storage
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

      // Add offer document to admin_offers/offers
      const offersCollectionRef = collection(db, "admin", "admin_offers", "offers");
      await addDoc(offersCollectionRef, {
        offerLine: offerData.offerLine,
        couponCode: offerData.couponCode,
        validTill: offerData.validTill,
        terms: offerData.terms, // Save as 'terms'
        imageUrl,
        createdAt: serverTimestamp(),
      });

      alert("Offer uploaded successfully!");
      // Reset form
      setOfferData({
        offerLine: "",
        couponCode: "",
        validTill: "",
        terms: "",
        selectedImage: null,
        imageFile: null,
      });
      setUploading(false);
    } catch (error) {
      console.error("Upload failed:", error);
      alert(`Failed to upload offer: ${error.message}`);
      setUploading(false);
    }
  };

  // --- Fetch offers (Collection Group query) ---
  useEffect(() => {
    if (viewOffers) {
      const q = query(collectionGroup(db, "offers"), orderBy("createdAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedOffers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOffers(fetchedOffers);
      });
      return () => unsubscribe();
    }
  }, [viewOffers]);

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
        <input
          type="text"
          id="offerLine"
          placeholder="Offer Line"
          value={offerData.offerLine}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          id="couponCode"
          placeholder="Coupon Code"
          value={offerData.couponCode}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          id="validTill"
          value={offerData.validTill}
          onChange={handleChange}
        />
        <textarea
          id="terms"
          placeholder="Terms"
          value={offerData.terms}
          onChange={handleChange}
        />

        <button type="submit" className="btn-red" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload Offer"}
        </button>
      </form>

      {/* Toggle offers */}
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
            <p>No offers available.</p>
          ) : (
            offers.map((offer) => (
              <div className="offer-card" key={offer.id}>
                <img src={offer.imageUrl} alt={offer.offerLine} />
                <div className="offer-details">
                  <h4>{offer.offerLine}</h4>
                  <p>Coupon: <strong>{offer.couponCode}</strong></p>
                  {offer.validTill && <p>Valid Till: {offer.validTill}</p>}
                  {offer.terms && <p className="terms-text">{offer.terms}</p>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
