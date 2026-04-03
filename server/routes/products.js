const router = require('express').Router();
const { Op } = require('sequelize');
const { Product, Category, Review } = require('../models');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { PAGINATION } = require('../config/constants');

// ========================
// GET /api/products — List products with filtering, search, pagination
// ========================
router.get('/', async (req, res) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      category,
      brand,
      minPrice,
      maxPrice,
      fragrance_type,
      search,
      sort = 'created_at',
      order = 'DESC',
      featured
    } = req.query;

    const where = {};
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Filters
    if (category) where.category_id = category;
    if (brand) where.brand = brand;
    if (fragrance_type) where.fragrance_type = fragrance_type;
    if (featured === 'true') where.featured = true;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) where.price[Op.lte] = parseFloat(maxPrice);
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
        { brand: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Validate sort field
    const allowedSorts = ['created_at', 'price', 'name', 'rating_avg'];
    const sortField = allowedSorts.includes(sort) ? sort : 'created_at';
    const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
      limit: Math.min(parseInt(limit), PAGINATION.MAX_LIMIT),
      offset,
      order: [[sortField, sortOrder]]
    });

    res.json({
      products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// ========================
// GET /api/products/featured — Featured products
// ========================
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { featured: true },
      include: [{ model: Category, attributes: ['id', 'name', 'slug'] }],
      limit: 8,
      order: [['created_at', 'DESC']]
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured products' });
  }
});

// ========================
// GET /api/products/brands — Get all unique brands
// ========================
router.get('/brands', async (req, res) => {
  try {
    const brands = await Product.findAll({
      attributes: ['brand'],
      group: ['brand'],
      where: { brand: { [Op.ne]: null } }
    });
    res.json(brands.map(b => b.brand));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching brands' });
  }
});

// ========================
// GET /api/products/:id — Product detail
// ========================
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, attributes: ['id', 'name', 'slug'] },
        {
          model: Review,
          include: [{ model: require('../models/User'), attributes: ['id', 'name', 'avatar_url'] }],
          order: [['created_at', 'DESC']]
        }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// ========================
// POST /api/products — Create product (Admin)
// ========================
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error: error.message });
  }
});

// ========================
// PUT /api/products/:id — Update product (Admin)
// ========================
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.update(req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error: error.message });
  }
});

// ========================
// DELETE /api/products/:id — Delete product (Admin)
// ========================
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
