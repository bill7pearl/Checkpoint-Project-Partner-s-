import api from './api';

export const productService = {
  // Get products with optional filters
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  // Get featured products
  getFeatured: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },

  // Get single product
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // Get all brands
  getBrands: async () => {
    const response = await api.get('/products/brands');
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  }
};

export default productService;
