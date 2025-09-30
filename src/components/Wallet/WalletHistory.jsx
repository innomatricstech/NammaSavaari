import React, { useState, useEffect } from 'react';
// CORRECTED: Import path to match the name of the external CSS file.
import "./WalletHistory.css"

// --- Header Component (Matching Mobile Screenshot Aesthetic) ---
const Header = () => (
    // Replaced Tailwind utility classes with the custom class 'header'
    <div className="header">
        {/* Menu Icon */}
        <div className="text-3xl p-1 rounded-full hover:bg-red-600 transition focus:outline-none cursor-pointer">
            <h3>Wallet History</h3>
        </div>
       
    </div>
);

// --- Transaction History Component (From your selection) ---
const TransactionHistory = ({ transactions }) => {
    // Formatting helper
    const formatCurrency = (amount, type) => {
        const sign = type === 'Credit' ? '+' : '-';
        // Use custom amount classes defined in the CSS file
        const customClass = type === 'Credit' ? 'amount-credit' : 'amount-debit';
        const formattedAmount = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
        
        return (
            <span className={customClass}>
                {sign}{formattedAmount}
            </span>
        );
    };

    const formatDate = (dateString) => {
        // Format to a more compact date presentation
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        // Replaced Tailwind utility classes with the custom class 'transaction-history-card'
        <div className="transaction-history-card">
            <h2 className="text-2xl font-black text-gray-900 mb-6 pb-4 border-b-2 border-red-500/70 tracking-tight">
                Activity Feed
            </h2>
            
            {transactions.length === 0 ? (
                // Updated to match the "No data available" message from the screenshot
                <div className="flex justify-center items-center py-16">
                    <p className="text-gray-500 text-lg italic font-medium">No data available</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Iterate over transactions and display the latest 5 */}
                    {transactions.slice(0, 5).map((t) => (
                        <div 
                            key={t.id} 
                            // Replaced Tailwind utility classes with the custom class 'transaction-item'
                            className="transaction-item"
                        >
                            <div className="flex items-center space-x-4">
                                {/* Enhanced icon display */}
                                {getIcon(t.type)}
                                
                                <div>
                                    {/* Transaction Description - bold and slightly larger */}
                                    <p className="font-bold text-gray-900 leading-tight">{t.description}</p>
                                    
                                    {/* Transaction Date - subtle */}
                                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(t.date)}</p>
                                </div>
                            </div>
                            
                            {/* Formatted Amount - placed on the right */}
                            {formatCurrency(t.amount, t.type)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Main Page Component ---
// This component simulates data management for demonstration purposes.
const mockTransactions = [
    { id: 1, type: 'Credit', amount: 500.00, description: 'Salary Deposit', date: '2025-09-28' },
    { id: 2, type: 'Debit', amount: 45.99, description: 'Amazon Purchase', date: '2025-09-27' },
    { id: 3, type: 'Debit', amount: 12.50, description: 'Coffee Shop', date: '2025-09-26' },
    { id: 4, type: 'Credit', amount: 200.00, description: 'Transfer Received', date: '2025-09-25' },
    { id: 5, type: 'Debit', amount: 15.00, description: 'Netflix Subscription', date: '2025-09-24' },
];

export default function WalletHistoryPage() {
    // Note: In a real app, this data would come from a global state or API call.
    const [transactions, setTransactions] = useState([]); // Start empty to match screenshot
    const [showMockData, setShowMockData] = useState(false);

    useEffect(() => {
        if (showMockData) {
            setTransactions(mockTransactions);
        } else {
            setTransactions([]);
        }
    }, [showMockData]);

    return (
        // Using the custom classes for page styling and layout
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header />
            <div className="container mx-auto p-0 pb-10">
                <TransactionHistory transactions={transactions} />

              
            </div>
        </div>
    );
}
