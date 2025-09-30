import React, { useState } from 'react';

const CommissionHeader = () => (
    // Updated header background and shadow for depth
    <div className="flex justify-between items-center p-4 ">
        
      
        <div className="text-3xl p-1 rounded-full transition focus:outline-none cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </div>
    </div>
);

export default function CommissionSettingsPage() {
    const [commission, setCommission] = useState('7.0');
    const [message, setMessage] = useState('');

    const handleSaveCommission = () => {
        const percentage = parseFloat(commission);
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            setMessage('Please enter a valid percentage between 0 and 100.');
            return;
        }

        console.log(`Saving new commission percentage: ${percentage}%`);
        setMessage(`Commission saved successfully: ${percentage}%`);
        
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        // Changed background to a subtle off-white/pink hue for contrast
        <div className="min-h-screen bg-pink-50 font-sans">
            <CommissionHeader />
            
            <div className="container mx-auto p-4 pb-10 flex justify-center">
                
                {/* Commission Card - Enhanced shadow and cleaner borders */}
                <div className="bg-white p-8 rounded-3xl shadow-2xl shadow-red-200/50 max-w-sm w-full mt-10 border border-gray-100 transition-all duration-300">
                    
                    {/* Header text - Bolder, darker red, and clear spacing */}
                    <p className="text-2xl font-extrabold text-red-600 mb-8 text-center tracking-tight">Set Commission Percentage</p>

                    {/* Commission Input Field - Focus ring and subtle inner shadow */}
                    <div className="relative flex items-center mb-10 border-2 border-red-500/70 focus-within:border-red-700 rounded-2xl overflow-hidden p-3 bg-white shadow-inner transition-all duration-300">
                        <label 
                            htmlFor="commission" 
                            className="absolute top-[-10px] left-3 px-2 text-sm text-red-700 bg-white font-bold transition-all duration-300"
                        >
                            Commission (%)
                        </label>
                        
                        {/* Percentage symbol on the left - slightly smaller, matching label color */}
                        <span className="text-red-500 text-xl font-bold pr-2">%</span>
                        
                        {/* Input - Larger, more prominent text field */}
                        <input
                            id="commission"
                            type="number"
                            step="0.1"
                            min="0"
                            max="100"
                            value={commission}
                            onChange={(e) => setCommission(e.target.value)}
                            className="w-full text-3xl font-extrabold text-gray-900 p-1 focus:outline-none"
                            style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }} // Hide native number arrows
                        />
                        
                        {/* Percentage symbol on the right - subtle, matching left symbol */}
                        <span className="text-red-500 text-xl font-bold pl-2">%</span>
                    </div>

                    {/* Save Button - Gradient, stronger shadow, and interactive hover effect */}
                    <button
                        onClick={handleSaveCommission}
                        className="w-full py-4 mt-4 text-center bg-gradient-to-r from-red-700 to-red-600 hover:from-red-800 hover:to-red-700 text-white font-extrabold text-xl rounded-2xl shadow-2xl shadow-red-500/50 transition duration-300 transform hover:scale-[1.03] active:scale-[0.98]"
                    >
                        Save Commission
                    </button>

                    {/* Status Message - Clearer color coding and animation */}
                    {message && (
                        <p 
                            className={`mt-6 text-center text-base font-semibold transition-opacity duration-500 ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
