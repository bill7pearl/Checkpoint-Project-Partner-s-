const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { protect, generateToken } = require('../middleware/authMiddleware');
const { JWT } = require('../config/constants');

// ========================
// Google OAuth
// ========================
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user.id);

    // Set cookie
    res.cookie(JWT.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // Redirect to frontend profile page
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5174';
    res.redirect(`${clientUrl}/profile?token=${token}`);
  }
);

// ========================
// GitHub OAuth
// ========================
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const token = generateToken(req.user.id);

    res.cookie(JWT.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5174';
    res.redirect(`${clientUrl}/profile?token=${token}`);
  }
);

// ========================
// Get Current User
// ========================
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'oauth_id'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ========================
// Logout
// ========================
router.post('/logout', (req, res) => {
  res.clearCookie(JWT.COOKIE_NAME);
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
