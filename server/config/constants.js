module.exports = {
  // Order statuses
  ORDER_STATUS: {
    PENDING_PAYMENT: 'pending_payment',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  },

  // Fragrance types
  FRAGRANCE_TYPES: [
    'Eau de Parfum',
    'Eau de Toilette',
    'Eau de Cologne',
    'Parfum',
    'Eau Fraiche'
  ],

  // Perfume categories
  CATEGORIES: [
    'Floral',
    'Woody',
    'Oriental',
    'Fresh',
    'Citrus',
    'Aquatic',
    'Gourmand',
    'Spicy'
  ],

  // Pagination defaults
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 12,
    MAX_LIMIT: 50
  },

  // JWT
  JWT: {
    EXPIRES_IN: '7d',
    COOKIE_NAME: 'perfumehub_token'
  }
};
