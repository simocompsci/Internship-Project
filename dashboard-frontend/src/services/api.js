import axios from 'axios';
import { checkApiStatus, handleApiError, fallbackData } from '../utils/apiUtils';

// Create an axios instance with base URL and default headers
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add a response interceptor for global error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

// Flag to track API availability
let isApiAvailable = false;

// Check API connectivity on startup
checkApiStatus().then(available => {
  isApiAvailable = available;
  if (!available) {
    console.warn('API server is not available. The application will use fallback data.');
  } else {
    console.log('API server is available.');
  }
});

// Helper function to handle API requests with fallback
const withFallback = async (apiCall, fallbackValue) => {
  if (!isApiAvailable) {
    console.log('Using fallback data (API unavailable)');
    return { data: fallbackValue };
  }
  
  try {
    return await apiCall();
  } catch (error) {
    console.warn(handleApiError(error));
    console.log('Using fallback data due to API error');
    return { data: fallbackValue };
  }
};

// API services for users
export const userService = {
  getAll: () => withFallback(() => api.get('/users'), fallbackData.users),
  getById: (id) => withFallback(() => api.get(`/users/${id}`), fallbackData.users.find(u => u.id === id) || {}),
  create: (data) => withFallback(() => api.post('/users', data), { ...data, id: Date.now() }),
  update: (id, data) => withFallback(() => api.put(`/users/${id}`, data), { ...data, id }),
  delete: (id) => withFallback(() => api.delete(`/users/${id}`), { success: true }),
  getStats: () => withFallback(() => api.get('/users/stats/overview'), fallbackData.userStats),
  checkHealth: () => api.get('/health-check'),
};

// API services for products
export const productService = {
  getAll: () => withFallback(() => api.get('/products'), fallbackData.products),
  getById: (id) => withFallback(() => api.get(`/products/${id}`), fallbackData.products.find(p => p.id === id) || {}),
  create: (data) => withFallback(() => api.post('/products', data), { ...data, id: Date.now() }),
  update: (id, data) => withFallback(() => api.put(`/products/${id}`, data), { ...data, id }),
  delete: (id) => withFallback(() => api.delete(`/products/${id}`), { success: true }),
  getStats: () => withFallback(() => api.get('/products/stats/overview'), fallbackData.productStats),
  getCategoriesData: () => withFallback(() => api.get('/products/stats/categories'), fallbackData.categoryDistribution),
};

// API services for orders
export const orderService = {
  getAll: () => withFallback(() => api.get('/orders'), []),
  getById: (id) => withFallback(() => api.get(`/orders/${id}`), {}),
  create: (data) => withFallback(() => api.post('/orders', data), { ...data, id: Date.now() }),
  update: (id, data) => withFallback(() => api.put(`/orders/${id}`, data), { ...data, id }),
  delete: (id) => withFallback(() => api.delete(`/orders/${id}`), { success: true }),
  getStats: () => withFallback(() => api.get('/orders/stats/overview'), {}),
  getRecent: () => withFallback(() => api.get('/orders/stats/recent'), []),
  getStatusDistribution: () => withFallback(() => api.get('/orders/stats/status-distribution'), []),
};

// API services for sales
export const saleService = {
  getAll: () => withFallback(() => api.get('/sales'), []),
  getById: (id) => withFallback(() => api.get(`/sales/${id}`), {}),
  create: (data) => withFallback(() => api.post('/sales', data), { ...data, id: Date.now() }),
  update: (id, data) => withFallback(() => api.put(`/sales/${id}`, data), { ...data, id }),
  delete: (id) => withFallback(() => api.delete(`/sales/${id}`), { success: true }),
  getStats: () => withFallback(() => api.get('/sales/stats/overview'), {}),
  getSalesByCategory: () => withFallback(() => api.get('/sales/stats/by-category'), fallbackData.categoryDistribution),
  getMonthlySales: () => withFallback(() => api.get('/sales/stats/monthly'), fallbackData.monthlySales || []),
  getDailySales: () => withFallback(() => api.get('/sales/stats/daily'), fallbackData.dailySales || []),
};

// API services for analytics
export const analyticsService = {
  getDashboardStats: () => withFallback(() => api.get('/analytics/dashboard'), {}),
  getSalesVsTargets: () => withFallback(() => api.get('/analytics/sales-vs-targets'), []),
  getTrafficSources: () => withFallback(() => api.get('/analytics/traffic-sources'), []),
};

export default {
  user: userService,
  product: productService,
  order: orderService,
  sale: saleService,
  analytics: analyticsService,
};
