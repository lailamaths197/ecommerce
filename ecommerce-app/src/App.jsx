import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import CheckoutForm from './components/CheckoutForm';
import Recommendations from './components/Recommendations';
import { API_BASE_URL } from './config';
import image1 from './assets/images/headphones.jpg';
import image2 from './assets/images/watch.jpg';
import image3 from './assets/images/backpack.jpg';
import image4 from './assets/images/speakers.avif';


const PRODUCTS = [
  { id: 1, name: "Wireless Pro Headphones", description: "High-quality acoustic engineering with structural hybrid active noise cancellation functionality.", price: 8250.00, image: image1, category: "electronics" },
  { id: 2, name: "Minimalist Chrono Watch", description: "Sleek, scratch-proof modern sapphire timepiece perfect for high-grade daily fashion.", price: 12400.00, image: image2, category: "accessories" },
  { id: 3, name: "Classic Leather Backpack", description: "Water-resistant genuine cowhide leather design spacious enough for heavy laptops and books.", price: 6500.00, image: image3, category: "accessories" },
  { id: 4, name: "Surround Bluetooth Speaker", description: "High fidelity ultra-portable heavy-bass audio equipment built for outdoor waterproofing.", price: 4100.00, image: image4, category: "electronics" }
];

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(PRODUCTS);
  const [orderConfirmation, setOrderConfirmation] = useState(null);

  // Custom standalone JS implementation of a debounce handler
  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  // Case-insensitive lookups parsing target product parameters
  const executeSearchFilter = useCallback(
    debounce((query) => {
      const targetQuery = query.toLowerCase().trim();
      if (!targetQuery) {
        setFilteredProducts(PRODUCTS);
        return;
      }
      
      const filtered = PRODUCTS.filter(product => 
        product.name.toLowerCase().includes(targetQuery) || 
        product.description.toLowerCase().includes(targetQuery)
      );
      setFilteredProducts(filtered);
    }, 400),
    []
  );

  useEffect(() => {
    executeSearchFilter(searchTerm);
  }, [searchTerm, executeSearchFilter]);

  const generateRecommendations = (category, currentProductId) => {
    const filtered = PRODUCTS.filter(prod => prod.category === category && prod.id !== currentProductId);
    setRecommendedProducts(filtered);
  };

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
    generateRecommendations(product.category, product.id);
  };

  const totalItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const grandTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handlePlaceOrder = async (customerData) => {
    const newOrder = {
      customer: customerData,
      items: cartItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
      grand_total: grandTotal
    };

    try {
      const response = await fetch('https://onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });

      if (response.ok) {
        const data = await response.json();
        setOrderConfirmation(`Order #${data.order_id} recorded successfully!`);
        setTimeout(() => setOrderConfirmation(null), 5000);

        setCartItems([]);
        setIsCheckout(false);
        setRecommendedProducts([]);
        setSearchTerm('');
      } else {
        alert("Server rejected processing request metrics.");
      }
    } catch (error) {
      console.error("Network error fallback logs triggered:", error);
      setOrderConfirmation("Order simulation success (Mock Mode)!");
      setTimeout(() => setOrderConfirmation(null), 5000);
      setCartItems([]);
      setIsCheckout(false);
      setRecommendedProducts([]);
      setSearchTerm('');
    }
  };

  return (
    <div className="font-sans antialiased text-gray-800 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative min-h-screen">
      
      {orderConfirmation && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3.5 rounded-xl shadow-2xl z-50 font-bold border border-green-500/30 flex items-center space-x-2 animate-bounce">
          <span className="text-green-400 text-lg">✓</span>
          <span>{orderConfirmation}</span>
        </div>
      )}

      <header className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100 pb-5 mb-8">
        <h2 className="text-2xl font-black tracking-tight text-gray-900 hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setIsCheckout(false)}>
          IND-STORE
        </h2>
        
        <div className="w-full sm:max-w-md relative">
          <input 
            type="text"
            placeholder="Search matching names or descriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm transition-all"
          />
          <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none text-base">🔍</span>
        </div>

        <div 
          onClick={() => setIsCartOpen(!isCartOpen)} 
          className="relative flex items-center gap-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 px-4 py-2 rounded-xl cursor-pointer select-none transition-all duration-150 active:scale-95"
        >
          <span className="text-xl">🛒</span> 
          <span className="font-bold hidden sm:inline text-sm text-gray-700">Cart</span>
          <span className="bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-black min-w-[20px] text-center">
            {totalItemCount}
          </span>
        </div>
      </header>

      {isCartOpen && (
        <Cart 
          cartItems={cartItems} 
          onProceedToCheckout={() => { setIsCheckout(true); setIsCartOpen(false); }} 
          onClose={() => setIsCartOpen(false)}
        />
      )}

      {isCheckout ? (
        <div className="animate-in fade-in duration-300">
          <button 
            onClick={() => setIsCheckout(false)} 
            className="mb-6 inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg"
          >
            ← Continue Browsing Catalog
          </button>
          <CheckoutForm onPlaceOrder={handlePlaceOrder} />
        </div>
      ) : (
        <main className="animate-in fade-in duration-300">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <p className="text-xl font-bold text-gray-600 mb-1">No products found matching your search</p>
              <p className="text-sm text-gray-400">Try checking your spelling or search for alternative item keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
              ))}
            </div>
          )}
        </main>
      )}

      {!isCheckout && recommendedProducts.length > 0 && (
        <Recommendations recommendedProducts={recommendedProducts} onAddToCart={handleAddToCart} />
      )}
    </div>
  );
}
