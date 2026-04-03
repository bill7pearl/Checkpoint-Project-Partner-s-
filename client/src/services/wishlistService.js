import api from './api';

export const wishlistService = {
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },
  
  toggleWishlist: async (productId) => {
    const response = await api.post('/wishlist', { product_id: productId });
    return response.data; // { isAdded, message }
  }
};
