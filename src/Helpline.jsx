// HelpLine.jsx
import React, { useState, useEffect } from "react";
import { FaWhatsapp, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { db } from "./firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

const HelpLine = () => {
  const [data, setData] = useState({ whatsapp: "", phone: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(true);

  // 🔹 Reference to Firestore document
  const docRef = doc(db, "admin", "admindetails");

  // 🔹 Fetch Firestore data in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.data());
        setEditMode(false); // Show view mode if data exists
      } else {
        setEditMode(true); // Start in edit mode if document is empty
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  // 🔹 Save or update data
  const handleSave = async () => {
    try {
      setSaving(true);
      await setDoc(docRef, data, { merge: true }); // Merge with existing doc
      setEditMode(false);
    } catch (error) {
      console.error("Error saving HelpLine data:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading Help Line...</div>;
  }

  return (
    <div
      className="container d-flex flex-column align-items-center justify-content-center vh-100"
      style={{ maxWidth: "600px" }}
    >
      <h2 className="fw-bold text-danger mb-4"><FaPhoneAlt size={25} className="me-2" />Admin Help Line Settings</h2>

      <div className="card shadow-lg border-0 p-4 w-100">
        <p className="text-muted mb-3 text-center">
          {editMode
            ? "Enter or update your help line contact details below."
            : "Your current help line contact details:"}
        </p>

        {/* WhatsApp */}
        <div className="mb-3">
          <label className="fw-bold text-success">
            <FaWhatsapp size={20} className="me-2" /> WhatsApp Number
          </label>
          {editMode ? (
            <input
              type="text"
              name="whatsapp"
              value={data.whatsapp}
              onChange={handleChange}
              className="form-control mt-2"
              placeholder="Enter WhatsApp Number (e.g., 919876543210)"
            />
          ) : (
            <p className="mt-2">{data.whatsapp || "Not added"}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="fw-bold text-primary">
            <FaPhoneAlt size={18} className="me-2" /> Phone Number
          </label>
          {editMode ? (
            <input
              type="text"
              name="phone"
              value={data.phone}
              onChange={handleChange}
              className="form-control mt-2"
              placeholder="Enter Phone Number"
            />
          ) : (
            <p className="mt-2">{data.phone || "Not added"}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="fw-bold text-danger">
            <FaEnvelope size={18} className="me-2" /> Email Address
          </label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              className="form-control mt-2"
              placeholder="Enter Email Address"
            />
          ) : (
            <p className="mt-2">{data.email || "Not added"}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="text-center mt-4">
          {editMode ? (
            <>
              <button
                className="btn btn-success me-2"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Details"}
              </button>
              {data.whatsapp || data.phone || data.email ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              ) : null}
            </>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setEditMode(true)}
            >
              Edit Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HelpLine;
