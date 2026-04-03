const router = require('express').Router();
const { Wishlist, Product, Category } = require('../models');
const { protect } = require('../middleware/authMiddleware');

// All wishlist routes require authentication
router.use(protect);

// ========================
// GET /api/wishlist — Get user's wishlist
// ========================
router.get('/', async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Product,
        include: [{ model: Category, attributes: ['id', 'name'] }]
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
});

// ========================
// POST /api/wishlist — Add to wishlist
// ========================
router.post('/', async (req, res) => {
  try {
    const { product_id } = req.body;

    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const existing = await Wishlist.findOne({
      where: { user_id: req.user.id, product_id }
    });

    if (existing) {
      return res.status(409).json({ message: 'Product already in wishlist' });
    }

    await Wishlist.create({ user_id: req.user.id, product_id });

    const wishlist = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Product,
        include: [{ model: Category, attributes: ['id', 'name'] }]
      }],
      order: [['created_at', 'DESC']]
    });

    res.status(201).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist' });
  }
});

// ========================
// DELETE /api/wishlist/:productId — Remove from wishlist
// ========================
router.delete('/:productId', async (req, res) => {
  try {
    const item = await Wishlist.findOne({
      where: { user_id: req.user.id, product_id: req.params.productId }
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not in wishlist' });
    }

    await item.destroy();

    const wishlist = await Wishlist.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Product,
        include: [{ model: Category, attributes: ['id', 'name'] }]
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist' });
  }
});

module.exports = router;
