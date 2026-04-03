const { body, param, query } = require('express-validator');

const validateProduct = [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
  body('brand').optional().isString(),
  body('volume').optional().isString(),
  body('fragrance_type').optional().isString(),
];

const validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().isString(),
  body('product_id').isInt().withMessage('Product ID is required'),
];

const validateOrder = [
  body('shipping_address').notEmpty().withMessage('Shipping address is required'),
  body('shipping_address.street').notEmpty().withMessage('Street is required'),
  body('shipping_address.city').notEmpty().withMessage('City is required'),
  body('shipping_address.country').notEmpty().withMessage('Country is required'),
  body('shipping_address.zip').notEmpty().withMessage('Zip code is required'),
];

const validateId = [
  param('id').isInt().withMessage('ID must be an integer'),
];

module.exports = { validateProduct, validateReview, validateOrder, validateId };
