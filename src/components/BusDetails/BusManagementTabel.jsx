// BusManagementTable.jsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Eye } from "lucide-react"; 
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import CustomModal from "./CustomModal";
import BookingDetailsView from "./BookingDetailsView";

// --- Mock Data Generation ---
const generateMockBookings = (count) => {
  const data = [];
  const operators = ["RedBus Tours", "VRL Logistics", "KSRTC Premium", "Zing Bus", "SkyNet Travels"];
  const paymentModes = ["Card", "UPI", "Net Banking", "Wallet"];
  const passengers = ["John Smith","Alice Johnson","Robert Brown","Emily Davis","Michael Wilson","Sarah Lee","David Kim","Jessica Chen"];

  for (let i = 1; i <= count; i++) {
    const amount = Math.floor(Math.random() * 2000) + 1000;
    const gst = amount * 0.05; 
    const commission = amount * 0.08;
    const tcs = amount * 0.01;

    data.push({
      id: `BKG-${1000 + i}`,
      bookingDate: `2025-09-${String(i % 30 + 1).padStart(2, "0")}`,
      passengerName: i % 8 === 0 ? null : passengers[i % 8],
      operatorName: operators[i % operators.length],
      paymentDetails: paymentModes[i % paymentModes.length],
      ticketAmount: amount,
      gstCharged: gst, 
      platformCommission: commission,
      tcsCollected: tcs,
      totalAmount: amount + gst + commission + tcs,
    });
  }
  return data;
};

const formatCurrency = (value) => (value != null ? `$${value.toFixed(2)}` : "N/A");

// --- Main Component ---
const BusManagementTable = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalConfig, setModalConfig] = useState({});

  const headers = useMemo(() => ([
    { key: "bookingDate", label: "Date of Booking" },
    { key: "passengerName", label: "Passenger Name" },
    { key: "operatorName", label: "Operator Name" },
    { key: "ticketAmount", label: "Ticket Amount" },
    { key: "convensionfee", label: "Convension Fee" },
    { key: "platformCommission", label: "Platform Commission" },
    { key: "tcsCollected", label: "TCS Collected" },
    { key: "paymentMode", label: "Payment Mode" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "actions", label: "Actions" },
  ]), []);

  useEffect(() => {
    setBookings(generateMockBookings(100));
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleEntriesPerPageChange = (e) => {
    setEntriesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // --- Filtering and Pagination Logic ---
  const { filteredBookings, paginatedBookings, totalEntries, totalPages, startEntry, endEntry } = useMemo(() => {
    let currentBookings = bookings;

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      currentBookings = currentBookings.filter(b =>
        Object.values(b).some(value =>
          String(value).toLowerCase().includes(lowerCaseSearch)
        )
      );
    }

    if (startDate || endDate) {
      currentBookings = currentBookings.filter(b => {
        const bookingTimestamp = new Date(b.bookingDate).getTime();
        const startTimestamp = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : 0;
        const endTimestamp = endDate ? new Date(endDate).setHours(23, 59, 59, 999) : Infinity;
        return bookingTimestamp >= startTimestamp && bookingTimestamp <= endTimestamp;
      });
    }

    const totalEntries = currentBookings.length;
    const totalPages = Math.ceil(totalEntries / entriesPerPage);
    const startIndex = (currentPage - 1) * entriesPerPage;
    const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
    const paginatedBookings = currentBookings.slice(startIndex, endIndex);

    return {
      filteredBookings: currentBookings,
      paginatedBookings,
      totalEntries,
      totalPages,
      startEntry: totalEntries > 0 ? startIndex + 1 : 0,
      endEntry: endIndex,
    };
  }, [bookings, searchTerm, currentPage, entriesPerPage, startDate, endDate]);

  // --- Export PDF ---
  const handleExportPDF = useCallback(() => {
  try {
    const doc = new jsPDF();
    const sortedBookings = [...filteredBookings].sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate));

    const headers = [[
      "Date of Booking",
      "Passenger Name",
      "Operator Name",
      "Ticket Amount",
      "Convenience Fee",
      "Platform Commission",
      "TCS Collected",
      "Payment Mode",
      "Total Amount"
    ]];

    const data = sortedBookings.map(b => [
      b.bookingDate || "N/A",
      b.passengerName || "N/A",
      b.operatorName || "N/A",
      b.ticketAmount != null ? `$${b.ticketAmount.toFixed(2)}` : "N/A",
      b.gstCharged != null ? `$${b.gstCharged.toFixed(2)}` : "N/A",
      b.platformCommission != null ? `$${b.platformCommission.toFixed(2)}` : "N/A",
      b.tcsCollected != null ? `$${b.tcsCollected.toFixed(2)}` : "N/A",
      b.paymentDetails || "N/A",
      b.totalAmount != null ? `$${b.totalAmount.toFixed(2)}` : "N/A",
    ]);

    // --- Calculate Totals ---
    const totals = {
      ticketAmount: sortedBookings.reduce((sum, b) => sum + (b.ticketAmount || 0), 0),
      gstCharged: sortedBookings.reduce((sum, b) => sum + (b.gstCharged || 0), 0),
      platformCommission: sortedBookings.reduce((sum, b) => sum + (b.platformCommission || 0), 0),
      tcsCollected: sortedBookings.reduce((sum, b) => sum + (b.tcsCollected || 0), 0),
      totalAmount: sortedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
    };

    // --- Append totals row ---
    data.push([
      "—", "—", "Overall Totals →",
      `$${totals.ticketAmount.toFixed(2)}`,
      `$${totals.gstCharged.toFixed(2)}`,
      `$${totals.platformCommission.toFixed(2)}`,
      `$${totals.tcsCollected.toFixed(2)}`,
      "—",
      `$${totals.totalAmount.toFixed(2)}`
    ]);

    autoTable(doc, {
      head: headers,
      body: data,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [52, 58, 64] },
      margin: { top: 20 },
    });

    doc.save("Bus_Bookings_Detailed.pdf");
  } catch (error) {
    console.error("PDF generation failed:", error);
    alert("Failed to generate PDF. Please check the console for details.");
  }
}, [filteredBookings]);


  // --- Export Excel ---
  const handleExportExcel = useCallback(() => {
  const sortedBookings = [...filteredBookings].sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate));

  const dataToExport = sortedBookings.map(b => ({
    "Date of Booking": b.bookingDate,
    "Passenger Name": b.passengerName || "N/A",
    "Operator Name": b.operatorName,
    "Ticket Amount": b.ticketAmount,
    "Convenience Fee": b.gstCharged,
    "Platform Commission": b.platformCommission,
    "TCS Collected": b.tcsCollected,
    "Payment Mode": b.paymentDetails,
    "Total Amount": b.totalAmount,
  }));

  // --- Calculate Totals ---
  const totals = {
    ticketAmount: sortedBookings.reduce((sum, b) => sum + (b.ticketAmount || 0), 0),
    gstCharged: sortedBookings.reduce((sum, b) => sum + (b.gstCharged || 0), 0),
    platformCommission: sortedBookings.reduce((sum, b) => sum + (b.platformCommission || 0), 0),
    tcsCollected: sortedBookings.reduce((sum, b) => sum + (b.tcsCollected || 0), 0),
    totalAmount: sortedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
  };

  // --- Append totals row ---
  dataToExport.push({
    "Date of Booking": "",
    "Passenger Name": "",
    "Operator Name": "Overall Totals →",
    "Ticket Amount": totals.ticketAmount,
    "Convenience Fee": totals.gstCharged,
    "Platform Commission": totals.platformCommission,
    "TCS Collected": totals.tcsCollected,
    "Payment Mode": "",
    "Total Amount": totals.totalAmount,
  });

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8" });
  saveAs(data, "Bus_Bookings_Detailed.xlsx");
}, [filteredBookings]);


  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    if (endPage - startPage < maxButtons - 1) startPage = Math.max(1, endPage - maxButtons + 1);
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button key={i} className={`btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-primary"} rounded-pill`} onClick={() => handlePageChange(i)} disabled={i === currentPage && totalPages > 0}>{i}</button>
      );
    }
    return buttons;
  };

  const handleActionClick = (action, bookingId) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    setSelectedBooking(booking);

    if (action === "View") {
      setModalConfig({
        title: `Booking Details: ${booking.id}`,
        content: <BookingDetailsView booking={booking} />,
        size: "xl",
        footerButtons: <button className="btn btn-primary" onClick={() => setIsModalOpen(false)}>Close</button>
      });
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="container-fluid p-4">
        <h4 className="pb-2 border-bottom border-primary mb-4 fw-bold text-primary">Booking Details Management</h4>

        {/* Filters and Exports */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-4">
                <label htmlFor="search-input" className="form-label small text-muted">Search by ID, Passenger, or Operator</label>
                <input type="text" id="search-input" className="form-control" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <div className="col-6 col-md-2">
                <label htmlFor="start-date" className="form-label small text-muted">From Date</label>
                <input type="date" id="start-date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="col-6 col-md-2">
                <label htmlFor="end-date" className="form-label small text-muted">To Date</label>
                <input type="date" id="end-date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="col-12 col-md-4 d-flex justify-content-end gap-2">
                <button className="btn btn-success" onClick={handleExportExcel}><i className="fas fa-file-excel me-1"></i> Excel</button>
                <button className="btn btn-danger" onClick={handleExportPDF}><i className="fas fa-file-pdf me-1"></i> PDF</button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive shadow-lg rounded-3">
          <table className="table table-striped table-hover table-light mb-0 align-middle">
            <thead className="table-dark">
              <tr>{headers.map(h => <th key={h.key}>{h.label}</th>)}</tr>
            </thead>
            <tbody>
              {paginatedBookings.length > 0 ? paginatedBookings.map(b => (
                <tr key={b.id}>
                  <td>{b.bookingDate}</td>
                  <td>{b.passengerName || <span className="text-danger fst-italic">N/A</span>}</td>
                  <td>{b.operatorName}</td>
                  <td>{formatCurrency(b.ticketAmount)}</td>
                  <td>{formatCurrency(b.gstCharged)}</td>
                  <td>{formatCurrency(b.platformCommission)}</td>
                  <td>{formatCurrency(b.tcsCollected)}</td>
                  <td>{b.paymentDetails}</td>
                  <td>{formatCurrency(b.totalAmount)}</td>
                  <td>
                    <button className="btn btn-sm btn-info text-white" onClick={() => handleActionClick("View", b.id)}>
                      <Eye className="d-inline d-md-none" size={16} />
                      <span className="d-none d-md-inline">View</span>
                    </button>
                  </td>
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
            {renderPaginationButtons()}
            <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>Next</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <CustomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalConfig.title} size={modalConfig.size} footerButtons={modalConfig.footerButtons}>
        {modalConfig.content}
      </CustomModal>
    </>
  );
};

export default BusManagementTable;
