/**
 * Admin-only middleware — must be used AFTER protect middleware
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.is_admin) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = { adminOnly };
