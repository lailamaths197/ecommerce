import React from 'react';
import { formatCurrency } from '../config';

export default function ProductCard({ product, onAddToCart }) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-white text-center flex flex-col justify-between shadow-sm transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl group">
      <div className="overflow-hidden rounded-lg mb-4 bg-gray-50 flex items-center justify-center h-48">
        <img 
          src={product.image} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors duration-200">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-3 min-h-[40px] line-clamp-2">
          {product.description}
        </p>
      </div>
      <div className="mt-auto">
        <p className="text-xl font-extrabold text-gray-900 mb-3">
          {formatCurrency(product.price)}
        </p>
        <button 
          onClick={() => onAddToCart(product)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
