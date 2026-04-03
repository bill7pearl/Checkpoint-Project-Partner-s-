const router = require('express').Router();
const { Review, Product, User } = require('../models');
const { protect } = require('../middleware/authMiddleware');
const sequelize = require('../config/database');

// ========================
// GET /api/reviews/product/:id — Get reviews for a product
// ========================
router.get('/product/:id', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { product_id: req.params.id },
      include: [{ model: User, attributes: ['id', 'name', 'avatar_url'] }],
      order: [['created_at', 'DESC']]
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// ========================
// POST /api/reviews — Submit a review
// ========================
router.post('/', protect, async (req, res) => {
  try {
    const { product_id, rating, comment } = req.body;

    // Check product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const existingReview = await Review.findOne({
      where: { product_id, user_id: req.user.id }
    });

    if (existingReview) {
      return res.status(409).json({ message: 'You have already reviewed this product' });
    }

    // Create review
    const review = await Review.create({
      product_id,
      user_id: req.user.id,
      rating,
      comment
    });

    // Update product average rating
    const stats = await Review.findOne({
      where: { product_id },
      attributes: [
        [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_reviews']
      ],
      raw: true
    });

    await product.update({
      rating_avg: parseFloat(stats.avg_rating).toFixed(1),
      rating_count: parseInt(stats.total_reviews)
    });

    // Fetch with user data
    const reviewWithUser = await Review.findByPk(review.id, {
      include: [{ model: User, attributes: ['id', 'name', 'avatar_url'] }]
    });

    res.status(201).json(reviewWithUser);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
});

module.exports = router;
