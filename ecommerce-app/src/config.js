export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://onrender.com'  // Replace with your Render backend URL later
  : 'http://localhost:8000/api'; 

// Currency formatting standard utility using Rupee symbol formatting logic
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
};
