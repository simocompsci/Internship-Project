/**
 * API Utilities for handling API connectivity and fallback data
 */

// Function to check if the API server is running
export const checkApiStatus = async (baseUrl = 'http://localhost:8000/api') => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(`${baseUrl}/health-check`, {
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('API Status Check Error:', error.message);
    return false;
  }
};

// Function to handle API errors and provide consistent error messages
export const handleApiError = (error) => {
  if (error.code === 'ECONNABORTED') {
    return "Request timed out. The API server might be slow or unavailable.";
  } else if (error.message.includes('Network Error')) {
    return "Network error. Please check if the API server is running.";
  } else if (error.response) {
    if (error.response.status === 404) {
      return "API endpoint not found. Please check the API route configuration.";
    } else if (error.response.status >= 500) {
      return "Server error. Please contact the administrator.";
    } else {
      return `Error: ${error.response.status} - ${error.response.statusText}`;
    }
  }
  return "An unexpected error occurred. Using fallback data instead.";
};

// Fallback data for different components
export const fallbackData = {
  users: [
    { id: 1, name: "John Doe", email: "john@example.com", role: "customer", status: "active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin", status: "active" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "customer", status: "inactive" },
    { id: 4, name: "Alice Brown", email: "alice@example.com", role: "customer", status: "active" },
    { id: 5, name: "Charlie Wilson", email: "charlie@example.com", role: "moderator", status: "active" },
  ],
  userStats: {
    totalUsers: 5243,
    activeUsers: 4137,
    newUsersToday: 27,
    premiumUsers: 843
  },
  userGrowth: [
    { month: "Jan", users: 1000 },
    { month: "Feb", users: 1500 },
    { month: "Mar", users: 2000 },
    { month: "Apr", users: 3000 },
    { month: "May", users: 4000 },
    { month: "Jun", users: 5000 },
  ],
  userActivity: [
    { day: "Mon", hour: "00", value: 3 },
    { day: "Mon", hour: "04", value: 1 },
    { day: "Mon", hour: "08", value: 7 },
    { day: "Mon", hour: "12", value: 12 },
    { day: "Mon", hour: "16", value: 10 },
    { day: "Mon", hour: "20", value: 5 },
    { day: "Tue", hour: "00", value: 2 },
    { day: "Tue", hour: "04", value: 1 },
    { day: "Tue", hour: "08", value: 8 },
    { day: "Tue", hour: "12", value: 13 },
    { day: "Tue", hour: "16", value: 11 },
    { day: "Tue", hour: "20", value: 6 },
    { day: "Wed", hour: "00", value: 2 },
    { day: "Wed", hour: "04", value: 1 },
    { day: "Wed", hour: "08", value: 9 },
    { day: "Wed", hour: "12", value: 14 },
    { day: "Wed", hour: "16", value: 12 },
    { day: "Wed", hour: "20", value: 7 },
    { day: "Thu", hour: "00", value: 3 },
    { day: "Thu", hour: "04", value: 1 },
    { day: "Thu", hour: "08", value: 8 },
    { day: "Thu", hour: "12", value: 13 },
    { day: "Thu", hour: "16", value: 11 },
    { day: "Thu", hour: "20", value: 6 },
    { day: "Fri", hour: "00", value: 2 },
    { day: "Fri", hour: "04", value: 1 },
    { day: "Fri", hour: "08", value: 7 },
    { day: "Fri", hour: "12", value: 12 },
    { day: "Fri", hour: "16", value: 10 },
    { day: "Fri", hour: "20", value: 5 },
    { day: "Sat", hour: "00", value: 4 },
    { day: "Sat", hour: "04", value: 2 },
    { day: "Sat", hour: "08", value: 5 },
    { day: "Sat", hour: "12", value: 9 },
    { day: "Sat", hour: "16", value: 8 },
    { day: "Sat", hour: "20", value: 7 },
    { day: "Sun", hour: "00", value: 4 },
    { day: "Sun", hour: "04", value: 2 },
    { day: "Sun", hour: "08", value: 4 },
    { day: "Sun", hour: "12", value: 8 },
    { day: "Sun", hour: "16", value: 7 },
    { day: "Sun", hour: "20", value: 6 },
  ],
  userDemographics: [
    { name: "18-24", value: 15 },
    { name: "25-34", value: 30 },
    { name: "35-44", value: 25 },
    { name: "45-54", value: 15 },
    { name: "55+", value: 15 },
  ],
  products: [
    { id: 1, name: "Wireless Earbuds", category: "Electronics", price: 79.99, stock: 243 },
    { id: 2, name: "Smart Watch", category: "Electronics", price: 199.99, stock: 120 },
    { id: 3, name: "Yoga Mat", category: "Fitness", price: 29.99, stock: 150 },
    { id: 4, name: "Coffee Maker", category: "Home", price: 89.99, stock: 87 },
    { id: 5, name: "Desk Lamp", category: "Home", price: 39.99, stock: 112 },
  ],
  productStats: {
    totalProducts: 1243,
    lowStock: 37,
    newArrivals: 15,
    topSelling: "Smart Watch"
  },
  salesTrend: [
    { month: "Jan", sales: 12000 },
    { month: "Feb", sales: 19000 },
    { month: "Mar", sales: 15000 },
    { month: "Apr", sales: 22000 },
    { month: "May", sales: 28000 },
    { month: "Jun", sales: 32000 },
  ],
  categoryDistribution: [
    { name: "Electronics", value: 35 },
    { name: "Clothing", value: 25 },
    { name: "Home", value: 20 },
    { name: "Fitness", value: 10 },
    { name: "Books", value: 10 },
  ],
  salesStats : {
    totalRevenue: "$1,234,567",
    averageOrderValue: "$78.90",
    totalOrders: "3.45%",
    revenueGrowth: "12.3%",
  },
  orderStats :{
    totalOrders: "1,234",
    pendingOrders: "56",
    completedOrders: "1,178",
    totalRevenue: "$98,765",
  },
};
