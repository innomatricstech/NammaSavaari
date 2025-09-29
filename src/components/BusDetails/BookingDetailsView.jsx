import React from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Currency formatting utility
const formatCurrency = (value) =>
  value != null ? `$${value.toFixed(2)}` : "N/A";

/**
 * Generates hypothetical trip and seat details to enrich the view.
 * @param {string} id - The booking ID to use as a seed.
 * @returns {Object} Hypothetical details.
 */
const getHypotheticalDetails = (id) => {
  const busNumbers = ["KA01-AB-1234", "MH12-CD-5678", "DL09-EF-9012"];
  const routes = [
    "Bangalore to Hyderabad",
    "Mumbai to Pune",
    "Delhi to Chandigarh",
    "Chennai to Coimbatore",
  ];
  const departureTimes = ["21:30", "22:00", "23:45", "19:00"];
  const arrivalTimes = ["06:00", "04:30", "07:00", "02:00"];

  const hash = parseInt(id.split("-")[1]) % 4;

  return {
    busNumber: busNumbers[hash % busNumbers.length],
    busType: hash % 2 === 0 ? "AC Sleeper" : "Non-AC Seater",
    route: routes[hash],
    departure: departureTimes[hash],
    arrival: arrivalTimes[hash],
    seatNumber: `S${10 + hash}`,
    ticketStatus: hash % 3 === 0 ? "Confirmed" : "Processing",
  };
};

const BookingDetailsView = ({ booking }) => {
  if (!booking) return <p>No booking selected</p>;

  const tripDetails = getHypotheticalDetails(booking.id);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Booking Details - ID: ${booking.id}`, 14, 10);

    autoTable(doc, {
      startY: 20,
      head: [["Field", "Value"]],
      body: [
        ["Booking Date", booking.bookingDate || "N/A"],
        ["Passenger Name", booking.passengerName || "N/A (Guest Booking)"],
        ["Operator", booking.operatorName || "N/A"],
        ["Bus Number", tripDetails.busNumber],
        ["Route", tripDetails.route],
        ["Bus Type", tripDetails.busType],
        ["Departure / Arrival", `${tripDetails.departure} / ${tripDetails.arrival}`],
        ["Seat Number", tripDetails.seatNumber],
        ["Ticket Status", tripDetails.ticketStatus],
        ["Ticket Amount", formatCurrency(booking.ticketAmount)],
        ["Convenience Fee", formatCurrency(booking.gstCharged)],
        ["Platform Commission", formatCurrency(booking.platformCommission)],
        ["TCS Collected", formatCurrency(booking.tcsCollected)],
        ["Payment Mode", booking.paymentDetails || "N/A"],
        ["Total Amount Paid", formatCurrency(booking.totalAmount)],
      ],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [0, 123, 255] },
    });

    doc.save(`Booking_${booking.id}.pdf`);
  };

  return (
    <div className="container-fluid">
      <div className="text-end mb-3">
        <button className="btn btn-outline-primary" onClick={handleExportPDF}>
          Export as PDF
        </button>
      </div>

      {/* Passenger and Booking Overview */}
      <h6 className="text-primary border-bottom border-primary pb-2 mb-3 fw-bold">
        Booking & Passenger Details
      </h6>
      <dl className="row g-2 mb-4">
        <dt className="col-sm-3 fw-normal text-muted">Booking ID</dt>
        <dd className="col-sm-3 fw-bold">{booking.id}</dd>

        <dt className="col-sm-3 fw-normal text-muted">Booking Date</dt>
        <dd className="col-sm-3">{booking.bookingDate}</dd>

        <dt className="col-sm-3 fw-normal text-muted">Passenger Name</dt>
        <dd className="col-sm-9">
          <span className="fw-bold">
            {booking.passengerName || "N/A (Guest Booking)"}
          </span>
        </dd>
      </dl>

      {/* Trip and Operator Details */}
      <h6 className="text-primary border-bottom border-primary pb-2 mb-3 fw-bold">
        Trip & Bus Information
      </h6>
      <dl className="row g-2 mb-4">
        <dt className="col-sm-3 fw-normal text-muted">Operator</dt>
        <dd className="col-sm-3 fw-bold">{booking.operatorName}</dd>

        <dt className="col-sm-3 fw-normal text-muted">Bus Number</dt>
        <dd className="col-sm-3">{tripDetails.busNumber}</dd>

        <dt className="col-sm-3 fw-normal text-muted">Route</dt>
        <dd className="col-sm-9">{tripDetails.route}</dd>

        <dt className="col-sm-3 fw-normal text-muted">Bus Type</dt>
        <dd className="col-sm-3">{tripDetails.busType}</dd>

        <dt className="col-sm-3 fw-normal text-muted">Departure / Arrival</dt>
        <dd className="col-sm-3">
          {tripDetails.departure} / {tripDetails.arrival}
        </dd>

        <dt className="col-sm-3 fw-normal text-muted">Seat Number</dt>
        <dd className="col-sm-3 fw-bold text-success">{tripDetails.seatNumber}</dd>

        <dt className="col-sm-3 fw-normal text-muted">Ticket Status</dt>
        <dd className="col-sm-3 text-info fw-bold">{tripDetails.ticketStatus}</dd>
      </dl>

      {/* Financial Breakdown */}
      <h6 className="text-danger border-bottom border-danger pb-2 mb-3 fw-bold">
        Transaction Breakdown
      </h6>
      <div className="row g-3">
        <div className="col-12 col-md-6 col-lg-3">
          <span className="d-block small text-muted">Ticket Amount (Base)</span>
          <strong className="text-dark">{formatCurrency(booking.ticketAmount)}</strong>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <span className="d-block small text-muted">Convenience Fee (5%)</span>
          <strong className="text-secondary">{formatCurrency(booking.gstCharged)}</strong>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <span className="d-block small text-muted">Platform Commission (8%)</span>
          <strong className="text-secondary">{formatCurrency(booking.platformCommission)}</strong>
        </div>
        <div className="col-12 col-md-6 col-lg-3">
          <span className="d-block small text-muted">TCS Collected (1%)</span>
          <strong className="text-secondary">{formatCurrency(booking.tcsCollected)}</strong>
        </div>
      </div>

      {/* Total Summary */}
      <div className="mt-4 pt-3 border-top">
        <div className="row align-items-center">
          <div className="col-12 col-md-8">
            <span className="h5 fw-normal d-block text-muted">
              Payment Mode:{" "}
              <strong className="text-dark">{booking.paymentDetails}</strong>
            </span>
          </div>
          <div className="col-12 col-md-4 text-md-end">
            <span className="d-block small text-muted">Total Amount Paid</span>
            <span className="h4 text-success fw-bold">
              {formatCurrency(booking.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsView;