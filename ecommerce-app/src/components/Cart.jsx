import React from 'react';
import { formatCurrency } from '../config';

export default function Cart({ cartItems, onProceedToCheckout, onClose }) {
  const totalCartCost = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="absolute top-20 right-4 sm:right-6 bg-white border border-gray-100 rounded-2xl p-5 w-full max-w-[340px] shadow-2xl z-50 animate-in fade-in slide-in-from-top-5 duration-200">
      <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
        <h3 className="text-lg font-bold text-gray-800">Your Shopping Cart</h3>
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 rounded-lg hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
        >
          ✕
        </button>
      </div>
      
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center py-6">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-50 max-h-60 overflow-y-auto pr-1">
            {cartItems.map(item => (
              <li key={item.id} className="py-3 flex justify-between items-start text-sm">
                <div className="flex-1 pr-2">
                  <span className="font-medium text-gray-800">{item.name}</span>
                  <span className="text-gray-400 text-xs block mt-0.5">Qty: {item.quantity} × {formatCurrency(item.price)}</span>
                </div>
                <span className="font-semibold text-gray-900 whitespace-nowrap">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          
          <div className="mt-4 pt-3 border-t-2 border-gray-100 flex justify-between items-center font-bold text-gray-900">
            <span>Total Cost:</span>
            <span className="text-xl text-blue-600">{formatCurrency(totalCartCost)}</span>
          </div>
          
          <button 
            onClick={onProceedToCheckout}
            className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all duration-150 cursor-pointer"
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}
