import React, { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot, setDoc, serverTimestamp } from "firebase/firestore";
import { FaPercent } from "react-icons/fa";

const Commission = () => {
  const [percentage, setPercentage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(true);

  const docRef = doc(db, "settings", "commission");

  // 🔹 Fetch commission in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setPercentage(data.percentage || "");
        setEditMode(false);
      } else {
        setEditMode(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Input change
  const handleChange = (e) => {
    let val = e.target.value;
    if (val === "") {
      setPercentage("");
      return;
    }
    val = Math.max(0, Math.min(100, Number(val)));
    setPercentage(val);
  };

  // 🔹 Save commission — overwrite document to remove old fields
  const handleSave = async () => {
    if (percentage === "") return;
    try {
      setSaving(true);
      await setDoc(docRef, {
        percentage: Number(percentage),
        updatedAt: serverTimestamp(),
      }); // ❌ No merge: overwrite document
      setEditMode(false);
    } catch (error) {
      console.error("Error saving commission:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-5">Loading Commission...</div>;

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="mb-4 text-center">
        <h2
          className="fw-bold text-danger py-2 px-4 "
          // style={{ background: "linear-gradient(159deg, #e21010ff, #2b4bffff)" }}
        >
          <FaPercent className="me-2" /> Admin Commission Settings
        </h2>
        <p className="text-muted mt-2 text-center">
          {editMode ? "Enter or update the commission percentage below." : "Current commission value:"}
        </p>
      </div>

      <div className="card shadow-lg border-0 p-4 w-100" style={{ maxWidth: "450px", borderRadius: "1rem" }}>
        <div className="mb-3">
          {editMode ? (
            <input
              type="number"
              value={percentage}
              onChange={handleChange}
              className="form-control form-control-lg shadow-sm"
              placeholder="Enter commission % (0-100)"
              style={{ borderRadius: "0.75rem" }}
            />
          ) : (
            <p className="fw-bold text-center fs-3 text-primary">{percentage || "Not set"}%</p>
          )}
        </div>

        <div className="d-flex justify-content-center mt-4 gap-2">
          {editMode ? (
            <>
              <button
                className="btn btn-success btn-lg shadow-sm"
                onClick={handleSave}
                disabled={saving || percentage === ""}
                style={{ borderRadius: "0.75rem" }}
              >
                {saving ? "Saving..." : "Save Commission"}
              </button>
              {percentage && (
                <button
                  className="btn btn-outline-secondary btn-lg shadow-sm"
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                  style={{ borderRadius: "0.75rem" }}
                >
                  Cancel
                </button>
              )}
            </>
          ) : (
            <button
              className="btn btn-primary btn-lg shadow-sm"
              onClick={() => setEditMode(true)}
              style={{ borderRadius: "0.75rem" }}
            >
              Edit Commission
            </button>
          )}
        </div>
      </div>

      <p className="text-muted small mt-4 text-center">Changes are saved directly to Firebase Firestore.</p>
    </div>
  );
};

export default Commission;
