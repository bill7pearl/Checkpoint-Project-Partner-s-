const router = require('express').Router();
const { Cart, CartItem, Product } = require('../models');
const { protect } = require('../middleware/authMiddleware');

// All cart routes require authentication
router.use(protect);

// ========================
// GET /api/cart — Get user's cart
// ========================
router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: CartItem,
        include: [{
          model: Product,
          attributes: ['id', 'name', 'price', 'image_url', 'stock', 'brand', 'volume']
        }]
      }]
    });

    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id });
      cart.CartItems = [];
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

// ========================
// POST /api/cart — Add item to cart
// ========================
router.post('/', async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    // Validate product exists and has stock
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Get or create cart
    let cart = await Cart.findOne({ where: { user_id: req.user.id } });
    if (!cart) {
      cart = await Cart.create({ user_id: req.user.id });
    }

    // Check if item already in cart
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id }
    });

    if (cartItem) {
      // Update quantity
      const newQty = cartItem.quantity + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      cartItem.quantity = newQty;
      await cartItem.save();
    } else {
      // Add new item
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id,
        quantity
      });
    }

    // Fetch updated cart
    const updatedCart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: CartItem,
        include: [{ model: Product, attributes: ['id', 'name', 'price', 'image_url', 'stock', 'brand', 'volume'] }]
      }]
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
});

// ========================
// PUT /api/cart/:itemId — Update item quantity
// ========================
router.put('/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItem = await CartItem.findByPk(req.params.itemId, {
      include: [{ model: Product }]
    });

    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    // Verify ownership
    const cart = await Cart.findByPk(cartItem.cart_id);
    if (cart.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (quantity > cartItem.Product.stock) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    if (quantity <= 0) {
      await cartItem.destroy();
    } else {
      cartItem.quantity = quantity;
      await cartItem.save();
    }

    // Fetch updated cart
    const updatedCart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: CartItem,
        include: [{ model: Product, attributes: ['id', 'name', 'price', 'image_url', 'stock', 'brand', 'volume'] }]
      }]
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart' });
  }
});

// ========================
// DELETE /api/cart/:itemId — Remove item from cart
// ========================
router.delete('/:itemId', async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.itemId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const cart = await Cart.findByPk(cartItem.cart_id);
    if (cart.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await cartItem.destroy();

    const updatedCart = await Cart.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: CartItem,
        include: [{ model: Product, attributes: ['id', 'name', 'price', 'image_url', 'stock', 'brand', 'volume'] }]
      }]
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart' });
  }
});

module.exports = router;
