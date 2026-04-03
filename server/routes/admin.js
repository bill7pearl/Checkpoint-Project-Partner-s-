const router = require('express').Router();
const { Order, OrderItem, Product, User, Category } = require('../models');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { ORDER_STATUS } = require('../config/constants');
const sequelize = require('../config/database');

// All admin routes require auth + admin
router.use(protect, adminOnly);

// ========================
// GET /api/admin/stats — Dashboard statistics
// ========================
router.get('/stats', async (req, res) => {
  try {
    const [totalOrders, totalRevenue, totalProducts, totalUsers] = await Promise.all([
      Order.count(),
      Order.sum('total_price', { where: { is_paid: true } }),
      Product.count(),
      User.count()
    ]);

    const recentOrders = await Order.findAll({
      include: [{ model: User, attributes: ['id', 'name', 'email'] }],
      order: [['created_at', 'DESC']],
      limit: 5
    });

    res.json({
      totalOrders,
      totalRevenue: totalRevenue || 0,
      totalProducts,
      totalUsers,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// ========================
// GET /api/admin/orders — All orders
// ========================
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        { model: User, attributes: ['id', 'name', 'email'] },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ['id', 'name', 'image_url'] }]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.json({ orders, total: count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// ========================
// PUT /api/admin/orders/:id/status — Update order status
// ========================
router.put('/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const validStatuses = Object.values(ORDER_STATUS);
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// ========================
// PUT /api/admin/orders/:id/pay — Mark order as paid
// ========================
router.put('/orders/:id/pay', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.is_paid = true;
    order.paid_at = new Date();
    order.status = ORDER_STATUS.PROCESSING;
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error marking order as paid' });
  }
});

// ========================
// GET /api/admin/users — List all users
// ========================
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'oauth_id'] },
      order: [['created_at', 'DESC']]
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// ========================
// GET /api/admin/categories — List categories
// ========================
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

module.exports = router;
