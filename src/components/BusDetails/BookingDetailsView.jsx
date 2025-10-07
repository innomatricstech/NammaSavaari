import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase.js";

// Currency formatting utility
const formatCurrency = (value) =>
  value != null
    ? `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    : "N/A";

const BookingDetailsView = ({ booking }) => {
  const [seatNumber, setSeatNumber] = useState("Loading...");
  const [route, setRoute] = useState("Loading...");
  const [busType, setBusType] = useState("Loading...");
  const [boardingPoint, setBoardingPoint] = useState("Loading...");
  const [busNumber, setBusNumber] = useState("Loading...");
  const [departureTime, setDepartureTime] = useState("Loading...");
  const [arrivalTime, setArrivalTime] = useState("Loading...");

  useEffect(() => {
    if (!booking?.id) return;

    const fetchBookingDetails = async () => {
      try {
        const bookingDocRef = doc(db, "all_bookings", booking.id);
        const bookingDoc = await getDoc(bookingDocRef);

        if (bookingDoc.exists()) {
          const data = bookingDoc.data();

          // --- Seat Number logic: handle array of objects or strings ---
          let seat = "N/A";

          if (data?.SeatName) {
            if (Array.isArray(data.SeatName)) {
              if (data.SeatName[0]?.SeatName) {
                // Array of objects with 'seat' property
                seat = data.SeatName.map((s) => s.seat).join(", ");
              } else if (typeof data.SeatName[0] === "string") {
                seat = data.SeatName.join(", ");
              }
            } else if (typeof data.SeatName === "string") {
              seat = data.SeatName;
            }
          } else if (data?.selectedSeats) {
            if (Array.isArray(data.selectedSeats)) {
              if (data.selectedSeats[0]?.SeatName) {
                seat = data.selectedSeats.map((s) => s.SeatName).join(", ");
              } else {
                seat = data.selectedSeats.join(", ");
              }
            } else {
              seat = data.selectedSeats;
            }
          }

          setSeatNumber(seat);
          setRoute(data?.journey || "N/A");
          setBusType(data?.busType || "N/A");
          setBoardingPoint(data?.selectedBoardingPoint || "N/A");
          setBusNumber(data?.BusNumber || data?.busNumber || "N/A");
          setDepartureTime(data?.departureTime || "N/A");
          setArrivalTime(data?.arrivalTime || "N/A");
        } else {
          setSeatNumber("N/A");
          setRoute("N/A");
          setBusType("N/A");
          setBoardingPoint("N/A");
          setBusNumber("N/A");
          setDepartureTime("N/A");
          setArrivalTime("N/A");
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
        setSeatNumber("N/A");
        setRoute("N/A");
        setBusType("N/A");
        setBoardingPoint("N/A");
        setBusNumber("N/A");
        setDepartureTime("N/A");
        setArrivalTime("N/A");
      }
    };

    fetchBookingDetails();
  }, [booking?.id]);

  if (!booking)
    return <p className="text-center mt-5 text-muted">No booking selected</p>;

  const userIdDisplay = booking.userId || "N/A (Anonymous)";
  const ticketNumberDisplay =
    booking.ticketNumber || booking.id?.split("-").pop() || "N/A";

  const tripDetails = {
    busType: busType,
    departure: departureTime,
    arrival: arrivalTime,
    ticketStatus: booking.bookingStatus || "Confirmed",
  };

  const handleExportPDF = () => {
    try {
      const pdfError = document.getElementById("pdf-error-message");
      if (pdfError) pdfError.textContent = "";

      const doc = new jsPDF();
      doc.text(`Booking Details - ID: ${booking.id}`, 14, 10);

      autoTable(doc, {
        startY: 20,
        head: [["Field", "Value"]],
        body: [
          ["Booking ID", booking.id],
          ["Ticket Number", ticketNumberDisplay],
          ["User ID", userIdDisplay],
          ["Booking Date", booking.bookingDate || "N/A"],
          ["Passenger Name", booking.passengerName || "N/A (Guest Booking)"],
          ["Operator", booking.operatorName || "N/A"],
          ["Seat Number", seatNumber],
          ["Route", route],
          ["Bus Type", busType],
          ["Boarding Point", boardingPoint],
          ["Departure Time", tripDetails.departure],
          ["Arrival Time", tripDetails.arrival],
          ["Departure / Arrival", `${tripDetails.departure} / ${tripDetails.arrival}`],
          ["Ticket Status", tripDetails.ticketStatus],
          ["Ticket Amount", booking.ticketAmount],
          ["Convenience Fee", booking.gstCharged],
          ["Payment Mode", booking.paymentDetails || "N/A"],
          ["Total Amount Paid", booking.totalAmount],
        ],
        styles: { fontSize: 9 },
        headStyles: { fillColor: [33, 150, 243] },
      });

      doc.save(`Booking_${booking.id}.pdf`);
    } catch (error) {
      console.error("PDF generation error:", error);
      const pdfError = document.getElementById("pdf-error-message");
      if (pdfError)
        pdfError.textContent =
          "❌ Failed to export PDF. Check console for details.";
    }
  };

  return (
    <div className="container my-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary mb-0">🚌 Booking Details Overview</h4>
        <button className="btn btn-gradient shadow-sm" onClick={handleExportPDF}>
          <i className="bi bi-file-earmark-pdf me-2"></i>
          Export as PDF
        </button>
      </div>

      <div id="pdf-error-message" className="text-danger mb-3 small fw-bold"></div>

      {/* Passenger & Booking Info */}
      <div className="card shadow border-0 mb-4 rounded-4">
        <div className="card-header bg-primary text-white rounded-top-4 py-3 px-4">
          <h6 className="mb-0">🎟 Passenger & Booking Details</h6>
        </div>
        <div className="card-body px-4 py-3">
          <div className="row g-3">
            <Info label="Booking ID" value={booking.id} />
            <Info label="Ticket Number" value={ticketNumberDisplay} color="text-primary" />
            <Info label="User ID" value={userIdDisplay} color="text-danger fw-bold" />
            <Info label="Booking Date" value={booking.bookingDate || "N/A"} />
            <Info label="Passenger Name" value={booking.passengerName || "N/A (Guest Booking)"} />
          </div>
        </div>
      </div>

      {/* Trip Info */}
      <div className="card shadow border-0 mb-4 rounded-4">
        <div className="card-header bg-success text-white rounded-top-4 py-3 px-4">
          <h6 className="mb-0">🚌 Trip & Bus Information</h6>
        </div>
        <div className="card-body px-4 py-3">
          <div className="row g-3">
            <Info label="Operator" value={booking.operatorName || "N/A"} />
            <Info label="Route" value={route} color="text-info" />
            <Info label="Bus Type" value={busType} />
            <Info
              label="Ticket Status"
              value={
                <span
                  className={`badge ${
                    tripDetails.ticketStatus === "Confirmed"
                      ? "bg-success"
                      : "bg-warning"
                  }`}
                >
                  {tripDetails.ticketStatus}
                </span>
              }
            />
            <Info label="Seat Number" value={seatNumber} color="text-success" />
            <Info label="Boarding Point" value={boardingPoint} />
            <Info label="Departure Time" value={departureTime} color="text-primary" />
            <Info label="Arrival Time" value={arrivalTime} color="text-primary" />
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="card shadow border-0 mb-4 rounded-4">
        <div className="card-header bg-danger text-white rounded-top-4 py-3 px-4">
          <h6 className="mb-0">💳 Transaction Breakdown</h6>
        </div>
        <div className="card-body px-4 py-3">
          <div className="row g-4">
            <AmountBox
              label="Ticket Amount"
              value={formatCurrency(booking.ticketAmount)}
            />
            <AmountBox
              label="Convenience Fee"
              value={formatCurrency(booking.gstCharged)}
            />
            <AmountBox
              label="Payment Mode"
              value={booking.paymentDetails || "N/A"}
            />
          </div>
        </div>
      </div>

      {/* Total Paid */}
      <div className="p-4 bg-light border border-success rounded-4 shadow-sm text-center">
        <h5 className="text-success mb-1 fw-bold">Total Amount Paid</h5>
        <h3 className="text-success fw-bolder">
          {formatCurrency(booking.totalAmount)}
        </h3>
      </div>

      <style>{`
        .btn-gradient {
          background: linear-gradient(45deg, #007bff, #00c6ff);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 12px;
          transition: 0.3s ease;
        }
        .btn-gradient:hover {
          transform: translateY(-2px);
          background: linear-gradient(45deg, #0056b3, #0096c7);
        }
        .rounded-4 { border-radius: 1rem; }
      `}</style>
    </div>
  );
};

// Reusable Info component
const Info = ({ label, value, color }) => (
  <div className="col-12 col-md-6">
    <p className="mb-1 text-muted small">{label}</p>
    <p className={`fw-semibold mb-0 ${color || ""}`}>{value}</p>
  </div>
);

// Reusable Amount Box
const AmountBox = ({ label, value }) => (
  <div className="col-12 col-md-4">
    <div className="p-3 bg-light rounded-3 border h-100">
      <p className="small text-muted mb-1">{label}</p>
      <h6 className="fw-bold text-dark mb-0">{value}</h6>
    </div>
  </div>
);

export default BookingDetailsView;
