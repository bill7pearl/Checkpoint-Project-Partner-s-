const router = require('express').Router();
const { Order, OrderItem, Product, Cart, CartItem, User } = require('../models');
const { protect } = require('../middleware/authMiddleware');
const { ORDER_STATUS } = require('../config/constants');
const sequelize = require('../config/database');

// Export router first, we will apply router.use(protect) only to specific routes or after the guest route


// ========================
// POST /api/orders/guest — Create guest order (COD)
// ========================
router.post('/guest', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { items, shipping_address, billing_address } = req.body;

    if (!items || items.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let totalPrice = 0;
    const dbItems = [];

    // Validate stock and calculate total
    for (const item of items) {
      const product = await Product.findByPk(item.product_id);
      if (!product || product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Insufficient stock for ${product ? product.name : 'Unknown item'}`
        });
      }
      totalPrice += parseFloat(product.price) * item.quantity;
      dbItems.push({ product, quantity: item.quantity });
    }

    // Create order
    const order = await Order.create({
      total_price: totalPrice,
      shipping_address,
      billing_address: billing_address || shipping_address,
      payment_method: 'cod',
      status: ORDER_STATUS.PENDING_PAYMENT
    }, { transaction });

    // Create order items and reduce stock
    for (const { product, quantity } of dbItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: product.id,
        quantity,
        price: product.price
      }, { transaction });

      await product.update({
        stock: product.stock - quantity
      }, { transaction });
    }

    await transaction.commit();

    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        include: [{ model: Product, attributes: ['id', 'name', 'image_url', 'brand'] }]
      }]
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating guest order:', error);
    res.status(500).json({ message: 'Error creating guest order' });
  }
});

// Protect remaining endpoints below this
router.use(protect);

// ========================
// POST /api/orders — Create authenticated order from cart (COD)
// ========================
router.post('/', async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { shipping_address, billing_address } = req.body;

    // Get user's cart with items
    const cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: CartItem,
        include: [{ model: Product }]
      }]
    });

    if (!cart || !cart.CartItems || cart.CartItems.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock and calculate total
    let totalPrice = 0;
    for (const item of cart.CartItems) {
      if (item.Product.stock < item.quantity) {
        await transaction.rollback();
        return res.status(400).json({
          message: `Insufficient stock for ${item.Product.name}`
        });
      }
      totalPrice += parseFloat(item.Product.price) * item.quantity;
    }

    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      total_price: totalPrice,
      shipping_address,
      billing_address: billing_address || shipping_address,
      payment_method: 'cod',
      status: ORDER_STATUS.PENDING_PAYMENT
    }, { transaction });

    // Create order items and reduce stock
    for (const item of cart.CartItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.Product.price
      }, { transaction });

      // Reduce stock
      await item.Product.update({
        stock: item.Product.stock - item.quantity
      }, { transaction });
    }

    // Clear cart
    await CartItem.destroy({
      where: { cart_id: cart.id },
      transaction
    });

    await transaction.commit();

    // Fetch complete order
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        include: [{ model: Product, attributes: ['id', 'name', 'image_url', 'brand'] }]
      }]
    });

    res.status(201).json(completeOrder);
  } catch (error) {
    await transaction.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// ========================
// GET /api/orders — User's order history
// ========================
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: OrderItem,
        include: [{ model: Product, attributes: ['id', 'name', 'image_url', 'brand'] }]
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// ========================
// GET /api/orders/:id — Order detail
// ========================
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      include: [{
        model: OrderItem,
        include: [{ model: Product, attributes: ['id', 'name', 'image_url', 'brand', 'volume'] }]
      }]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
});

module.exports = router;
