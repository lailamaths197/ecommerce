import React, { useState } from 'react';

export default function CheckoutForm({ onPlaceOrder }) {
  const [formData, setFormData] = useState({ fullName: '', address: '', email: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Client-Side Regex Validation Pattern Checks
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.address.trim()) newErrors.address = "Delivery address is required.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please input a valid configuration format (e.g. user@domain.com).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onPlaceOrder(formData);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 border border-gray-200 rounded-2xl bg-gray-50 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-5">Checkout Verification</h3>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
          <input 
            type="text" 
            name="fullName" 
            value={formData.fullName} 
            onChange={handleChange} 
            className={`w-full p-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all ${errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'}`} 
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.fullName}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
          <input 
            type="text" 
            name="address" 
            value={formData.address} 
            onChange={handleChange} 
            className={`w-full p-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all ${errors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'}`} 
          />
          {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>}
        </div>
        
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            className={`w-full p-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'}`} 
          />
          {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-150 cursor-pointer text-base"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}
