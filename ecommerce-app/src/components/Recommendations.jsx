import React from 'react';
import ProductCard from './ProductCard';

export default function Recommendations({ recommendedProducts, onAddToCart }) {
  return (
    <div className="mt-12 pt-6 border-t border-gray-200">
      <h3 className="text-xl font-extrabold text-gray-800 mb-6">Recommended items for you</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recommendedProducts.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
}
