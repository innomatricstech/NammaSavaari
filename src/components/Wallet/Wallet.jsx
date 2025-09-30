import React, { useState, useEffect } from 'react';
import "./Wallet.css"

// --- Local Storage Persistence Functions ---
const WALLET_STORAGE_KEY = 'adminWalletData';

const loadWalletData = () => {
    try {
        const stored = localStorage.getItem(WALLET_STORAGE_KEY);
        return stored ? JSON.parse(stored) : { balance: 1500.00, creditLimit: 7500.00 };
    } catch (e) {
        console.error("Error loading wallet data from localStorage:", e);
        return { balance: 0, creditLimit: 0 };
    }
};

const saveWalletData = (data) => {
    try {
        localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving wallet data to localStorage:", e);
    }
};

// --- Component Definitions ---

// Header component with a deep, attractive gradient
const Header = () => (
    <div className="flex justify-between items-center p-1 bg-gradient-to-r from-red-900 to-red-700 text-white shadow-2xl sticky top-0 z-10">
        {/* Menu Icon */}
        <div className="text-xl p-2 rounded-full hover:bg-red-800 transition focus:outline-none cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
        </div>
        <h1 className="text-2xl">Premium Wallet</h1>
      
    </div>
);

// Wallet Card component with attractive styling
const WalletCard = ({ balance, creditLimit, isLoading }) => {
    // Formatting helper
    const formatCurrency = (amount) => {
        return amount !== null && amount !== undefined
            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount)
            : '---';
    };

    return (
        <div className="bg-gradient-to-br from-white to-red-100 m-4 p-8 rounded-[2rem] shadow-2xl shadow-red-300/60 max-w-lg mx-auto mt-12 transition duration-500 ease-in-out transform hover:scale-[1.02] border-t-8 border-red-600">
            <div className="text-xl font-extrabold mb-6 text-red-800 tracking-wider">
                Financial Snapshot
            </div>
            
            <div className={`space-y-5 ${isLoading ? 'animate-pulse' : ''}`}>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Balance:</span>
                    <span className={`text-3xl font-extrabold transition-colors ${isLoading ? 'text-gray-300 w-2/5 h-8 bg-gray-200 rounded-lg' : 'text-red-700'}`}>
                        {isLoading ? 'Loading...' : formatCurrency(balance)}
                    </span>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-700">Credit Limit:</span>
                    <span className={`text-xl font-bold transition-colors ${isLoading ? 'text-gray-300 w-1/3 h-6 bg-gray-200 rounded-lg' : 'text-gray-500'}`}>
                        {isLoading ? 'Loading...' : formatCurrency(creditLimit)}
                    </span>
                </div>
            </div>
        </div>
    );
};


// Admin control for updating the data
const AdminUpdater = ({ onUpdate }) => {
    return (
        <div className="max-w-lg mx-auto mt-10 p-4 text-center">
            <p className="text-sm text-gray-500 mb-4 italic">
                Simulate data changes locally.
            </p>
            <button
                onClick={onUpdate}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-black text-lg rounded-2xl shadow-xl shadow-red-400/70 hover:from-red-700 hover:to-red-900 transition duration-300 transform hover:scale-[1.01] uppercase tracking-widest"
            >
                Generate & Update Wallet Data
            </button>
        </div>
    );
};


// --- Main Component ---
export default function App() {
    const [walletData, setWalletData] = useState({ balance: null, creditLimit: null });
    const [isLoading, setIsLoading] = useState(true);

    // 1. Initial Load from localStorage
    useEffect(() => {
        const data = loadWalletData();
        setWalletData(data);
        // Simulate a small network delay for the initial "Loading..." state feel
        const timer = setTimeout(() => setIsLoading(false), 500); 
        return () => clearTimeout(timer);
    }, []);

    // 2. Persist to localStorage whenever walletData changes
    useEffect(() => {
        if (walletData.balance !== null) {
            saveWalletData(walletData);
        }
    }, [walletData]);


    const handleUpdate = () => {
        setIsLoading(true);

        const newBalance = (Math.random() * 5000 + 1000).toFixed(2);
        const newLimit = (Math.random() * 10000 + 5000).toFixed(2);
        
        // Simulate a delay for the update operation
        setTimeout(() => {
            setWalletData({
                balance: parseFloat(newBalance),
                creditLimit: parseFloat(newLimit),
            });
            setIsLoading(false);
        }, 300);
    };

    return (
        <div className="min-h-screen bg-gray-100 font-sans pb-20">
            <Header />
            
            <div className="max-w-2xl mx-auto">
                {/* Wallet Card Section */}
                <WalletCard 
                    balance={walletData.balance}
                    creditLimit={walletData.creditLimit}
                    isLoading={isLoading}
                />
                
                {/* Admin/Mock Update Control */}
                <AdminUpdater onUpdate={handleUpdate} />
            </div>
        </div>
    );
}
