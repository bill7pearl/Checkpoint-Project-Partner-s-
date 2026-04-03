const router = require('express').Router();
const { User } = require('../models');
const { protect } = require('../middleware/authMiddleware');

// ========================
// GET /api/users/profile — Get user profile
// ========================
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'oauth_id'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// ========================
// PUT /api/users/profile — Update profile
// ========================
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, avatar_url } = req.body;
    const user = await User.findByPk(req.user.id);

    if (name) user.name = name;
    if (avatar_url) user.avatar_url = avatar_url;

    await user.save();

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      is_admin: user.is_admin
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router;
