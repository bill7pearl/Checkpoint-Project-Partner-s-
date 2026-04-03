import api from './api';

export const orderService = {
  createOrder: async (cartItems, isGuest) => {
    if (isGuest) {
      const response = await api.post('/orders/guest', {
        items: cartItems,
        shipping_address: '123 Guest Avenue, GC 00000',
        payment_method: 'COD'
      });
      return response.data;
    }
    const response = await api.post('/orders', {
      shipping_address: '123 Luxury Ave, CA 90210',
      payment_method: 'COD'
    });
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  }
};
