import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Eye } from "lucide-react";
// import { useNavigate } from "react-router-dom"; // REMOVE or COMMENT OUT if not using routing

import CustomModal from "./CustomModal"; 
import BookingDetailsView from "./BookingDetailsView";

// Firebase imports (keep these)
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, setLogLevel, doc, getDoc } from "firebase/firestore";
import { getAuth, signInAnonymously, signInWithCustomToken } from "firebase/auth";

// External libraries (loaded via CDN) (keep these)
const XLSX = window.XLSX;
const saveAs = window.saveAs;
const jsPDF = window.jsPDF;
const autoTable = (doc, options) => {
  if (window.jspdf && window.jspdf.autoTable) {
    window.jspdf.autoTable(doc, options);
  } else if (window.autoTable) {
    window.autoTable(doc, options);
  } else {
    console.error("jsPDF-autotable not loaded.");
  }
};

// ---------- Helpers ---------- (keep these)
const parseTimestampToDate = (val) => {
  if (!val) return null;
  if (typeof val.toDate === "function") return val.toDate();
  if (val.seconds) return new Date(val.seconds * 1000);
  if (val._seconds) return new Date(val._seconds * 1000);
  if (typeof val === "string") return new Date(val);
  if (typeof val === "number") return new Date(val);
  return null;
};

const formatDateTime = (date) => (date ? date.toLocaleString() : "N/A");
const formatCurrency = (value) =>
  value != null && !isNaN(Number(value)) ? `₹${Number(value).toLocaleString("en-IN")}` : "₹0";

// ---------- Component ----------
const BusManagementTable = () => {
  // const navigate = useNavigate(); // REMOVE or COMMENT OUT if not using routing

  // State
  const [dbInstance, setDbInstance] = useState(null);
  const [authInstance, setAuthInstance] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // NEW STATE FOR MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Headers (keep these)
  const headers = useMemo(
    () => [
      { key: "dateOfBooking", label: "Date of Booking" },
      { key: "passengerName", label: "Passenger Name" },
      { key: "operatorName", label: "Operator Name" },
      { key: "ticketAmount", label: "Ticket Amount" },
      { key: "convenienceFee", label: "Convenience Fee" },
      { key: "paymentMode", label: "Payment Mode" },
      { key: "totalAmount", label: "Total Amount" },
      { key: "actions", label: "Actions" },
    ],
    []
  );

  // ---------- Initialize Firebase ---------- (keep these)
  useEffect(() => {
    try {
      setLogLevel("Debug");
      let rawCfg = typeof __firebase_config !== "undefined" ? __firebase_config : window.__firebase_config;
      let parsedCfg = rawCfg ? (typeof rawCfg === "string" ? JSON.parse(rawCfg) : rawCfg) : {};

      if (parsedCfg && Object.keys(parsedCfg).length > 0) {
        let app = !getApps().length ? initializeApp(parsedCfg) : getApp();
        const db = getFirestore(app);
        const auth = getAuth(app);
        setDbInstance(db);
        setAuthInstance(auth);

        const authAttempt = async () => {
          try {
            if (typeof __initial_auth_token !== "undefined") {
              await signInWithCustomToken(auth, __initial_auth_token);
            } else {
              await signInAnonymously(auth);
            }
          } catch (err) {
            console.error("Firebase Auth sign-in failed:", err);
          }
        };
        authAttempt();
        return;
      }

      if (window.__FIREBASE_DB) {
        setDbInstance(window.__FIREBASE_DB);
        if (window.__FIREBASE_AUTH) setAuthInstance(window.__FIREBASE_AUTH);
        return;
      }

      setLoading(false);
      console.warn("No Firebase config found. Table will not fetch data.");
    } catch (err) {
      console.error("Error during Firebase initialization:", err);
      setLoading(false);
    }
  }, []);

  // ---------- Fetch bookings ---------- (keep these)
  useEffect(() => {
    if (!dbInstance) return;

    setLoading(true);
    const bookingsRef = collection(dbInstance, "all_bookings");
    const unsubscribe = onSnapshot(
      bookingsRef,
      async (snapshot) => {
        const rawDocs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
        const userIds = [...new Set(rawDocs.map((d) => d.userId).filter(Boolean))];
        const customerNameMap = {};

        if (userIds.length > 0) {
          await Promise.all(
            userIds.map(async (id) => {
              try {
                const customerDocRef = doc(dbInstance, "customers", id);
                const customerDoc = await getDoc(customerDocRef);
                customerNameMap[id] = customerDoc.exists() ? customerDoc.data().name || id : `User ID: ${id}`;
              } catch (err) {
                console.error("Customer fetch error:", id, err);
                customerNameMap[id] = `Error: ${id}`;
              }
            })
          );
        }

        const enrichedDocs = rawDocs.map((data) => {
          const bookingTime = parseTimestampToDate(data.bookingTime || data.createdAt);
          const ticketAmount = Number(data.ticketAmount || data.amount || 0);
          const convenienceFee = Number(data.convenienceFee || data.ConvenienceFee || 0);
          const totalAmount = ticketAmount + convenienceFee;
          const passengerName = data.userId ? customerNameMap[data.userId] : data.name || "N/A";

          return {
            id: data.id,
            dateOfBooking: bookingTime ? formatDateTime(bookingTime) : "N/A",
            passengerName,
            operatorName: data.travelName || "N/A",
            ticketAmount,
            convenienceFee,
            totalAmount,
            pnr: data.pnr || "N/A",
            ticketNumber: data.ticketNumber || "N/A",
            bookingStatus: data.bookingStatus || "N/A",
            paymentMode: data.paymentMode || "Online",
            userId: data.userId || "N/A",
            raw: data,
            
         
          };
        });

        setBookings(enrichedDocs);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore onSnapshot error:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [dbInstance]);

  // ---------- Filtering & Pagination ---------- (keep these)
  const { filteredBookings, paginatedBookings, totalEntries, totalPages, startEntry, endEntry } = useMemo(() => {
    let current = bookings;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      current = current.filter((b) => Object.values(b).some((v) => String(v).toLowerCase().includes(lower)));
    }

    if (startDate || endDate) {
      current = current.filter((b) => {
        const d = parseTimestampToDate(b.raw.bookingTime || b.raw.createdAt || b.dateOfBooking);
        const ts = d ? d.getTime() : 0;
        const startTs = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : 0;
        const endTs = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;
        return ts >= startTs && ts <= endTs;
      });
    }

    const total = current.length;
    const pages = Math.max(1, Math.ceil(total / entriesPerPage));
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, total);
    return {
      filteredBookings: current,
      paginatedBookings: current.slice(startIndex, endIndex),
      totalEntries: total,
      totalPages: pages,
      startEntry: total > 0 ? startIndex + 1 : 0,
      endEntry: endIndex,
    };
  }, [bookings, searchTerm, currentPage, entriesPerPage, startDate, endDate]);

 // ---------- Export functions (fixed) ----------
const handleExportExcel = useCallback(() => {
  try {
    if (!window.XLSX || !window.saveAs) {
      alert("❌ Excel export libraries not loaded. Please check index.html CDN scripts.");
      return;
    }

    const rows = filteredBookings.map((b) => ({
      "Date of Booking": b.dateOfBooking,
      "Passenger Name": b.passengerName,
      "Operator Name": b.operatorName,
      "Ticket Amount": b.ticketAmount,
      "Convenience Fee": b.convenienceFee,
      "Payment Mode": b.paymentMode,
      "Total Amount": b.totalAmount,
      PNR: b.pnr,
      "Ticket Number": b.ticketNumber,
      "Booking Status": b.bookingStatus,
      "User ID": b.userId,
    }));

    if (!rows.length) {
      alert("No bookings to export.");
      return;
    }

    const ws = window.XLSX.utils.json_to_sheet(rows);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Bookings_Report");

    const buffer = window.XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    window.saveAs(blob, "Bookings_Report.xlsx");
  } catch (err) {
    console.error("Excel export failed:", err);
    alert("Failed to export Excel. Check console for details.");
  }
}, [filteredBookings]);

const handleExportPDF = useCallback(() => {
  try {
    if (!window.jspdf?.jsPDF) {
      alert("❌ jsPDF not loaded. Please check CDN order.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    if (!doc.autoTable) {
      alert("❌ jsPDF-AutoTable plugin missing. Make sure the plugin script is added after jsPDF.");
      return;
    }

    const head = [
      headers.filter((h) => h.key !== "actions").map((h) => h.label),
    ];
    const body = filteredBookings.map((b) => [
      b.dateOfBooking,
      b.passengerName,
      b.operatorName,
      b.ticketAmount,
      b.convenienceFee,
      b.paymentMode,
      b.totalAmount,
    ]);

    doc.text(" Bookings Report", 14, 15);
    doc.autoTable({
      head,
      body,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [52, 58, 64] },
      margin: { top: 20 },
    });

    doc.save("Bookings_Report.pdf");
  } catch (err) {
    console.error("PDF export failed:", err);
    alert("Failed to export PDF. Check console for details.");
  }
}, [filteredBookings, headers]);


  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // NEW FUNCTION: Handle "View" button click to open modal
  const handleActionClick = (action, bookingId) => {
    if (action === "View") {
      const booking = bookings.find(b => b.id === bookingId);
      if (booking) {
        // NOTE: The BookingDetailsView component expects `booking.bookingDate`
        // which isn't present in the table data, but `dateOfBooking` is. 
        // We'll map the data to match the expected format or just pass `dateOfBooking`.
        setSelectedBooking({
          ...booking,
          bookingDate: booking.dateOfBooking, // Mapping for consistency with BookingDetailsView.jsx
          gstCharged: booking.convenienceFee, // Mapping for consistency with BookingDetailsView.jsx
          // Add placeholder values for fields only present in BookingDetailsView.jsx's financial section for a complete view
          platformCommission: booking.totalAmount * 0.08, 
          tcsCollected: booking.totalAmount * 0.01,
          paymentDetails: booking.paymentMode, // Mapping for consistency
        });
        setIsModalOpen(true);
      }
    }
  };


  // ---------- Render ----------
  return (
    <div className="container-fluid p-4">
      <h4 className="pb-2 border-bottom border-primary mb-4 fw-bold text-primary">Booking Details Management</h4>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label small text-muted">Search by any field</label>
              <input
                className="form-control"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="Search..."
              />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small text-muted">From (Booking Date)</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="col-6 col-md-2">
              <label className="form-label small text-muted">To (Booking Date)</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <div className="col-12 col-md-4 d-flex justify-content-end gap-2">
              <button className="btn btn-success" onClick={handleExportExcel} disabled={loading || totalEntries === 0}>Export Excel</button>
              <button className="btn btn-danger" onClick={handleExportPDF} disabled={loading || totalEntries === 0}>Export PDF</button>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive shadow-lg rounded-3">
        <table className="table table-striped table-hover table-light mb-0 align-middle">
          <thead className="table-dark">
            <tr>{headers.map((h) => <th key={h.key}>{h.label}</th>)}</tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={headers.length} className="text-center py-5">Loading bookings...</td></tr>
            ) : paginatedBookings.length > 0 ? paginatedBookings.map((b) => (
              <tr key={b.id}>
                {headers.map((h) => {
                  const val = b[h.key];
                  if (["ticketAmount", "convenienceFee", "totalAmount"].includes(h.key)) return <td key={h.key}>{formatCurrency(val)}</td>;
                  if (h.key === "actions") return (
                   <td>
                    <button className="btn btn-sm btn-info text-white" onClick={() => handleActionClick("View", b.id)}>
                      <Eye className="d-inline d-md-none" size={16} />
                      <span className="d-none d-md-inline"><Eye/></span>
                    </button>
                  </td>
                  );
                  return <td key={h.key}>{val}</td>;
                })}
              </tr>
            )) : (
              <tr><td colSpan={headers.length} className="text-center py-5 text-muted">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-4 gap-3">
        <div className="text-muted small">Showing {startEntry} to {endEntry} of {totalEntries} entries</div>
        <div className="d-flex gap-1 flex-wrap align-items-center">
          <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} className={`btn btn-sm ${i + 1 === currentPage ? "btn-primary" : "btn-outline-primary"} rounded-pill`} onClick={() => handlePageChange(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
      
      {/* NEW: Custom Modal for Booking Details */}
      <CustomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Booking Details: ${selectedBooking?.id || ''}`}
        size="xl"
        footerButtons={<button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Close</button>}
      >
        <BookingDetailsView booking={selectedBooking} />
      </CustomModal>
      
    </div>
  );
};

export default BusManagementTable;