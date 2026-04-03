import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiCheckCircle, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';
import './Cart.css';

export default function Cart() {
  const { cart, cartTotal, itemCount, updateQuantity, removeItem, fetchCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      await orderService.createOrder(cart.CartItems, !isAuthenticated);
      
      setCheckoutSuccess(true);
      if (!isAuthenticated) localStorage.removeItem('guest_cart');
      fetchCart(); // refresh context
      
      // Close popup and redirect after a delay, or wait for them to click close
      setTimeout(() => {
        setCheckoutSuccess(false);
        window.location.href = isAuthenticated ? '/profile' : '/';
      }, 5000);
    } catch (error) {
      console.error('Checkout failed:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (checkoutSuccess) {
    return (
      <div className="cart-page container section" style={{ position: 'relative', minHeight: '60vh' }}>
        <div className="cart-success-overlay">
          <div className="cart-success-modal">
            <button 
              className="cart-success-close" 
              onClick={() => {
                setCheckoutSuccess(false);
                window.location.href = isAuthenticated ? '/profile' : '/';
              }}
            >
              <FiX size={24} />
            </button>
            <FiCheckCircle size={64} className="cart-success-icon" />
            <h2 className="heading-serif">Order Indulged Successfully</h2>
            <p className="cart-success-msg">Your luxury fragrance is on its way. Ensure to have Cash on Delivery ready.</p>
            <div className="cart-success-action">
              Redirecting...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart?.CartItems || cart.CartItems.length === 0) {
    return (
      <div className="cart-empty container section" style={{ minHeight: '60vh' }}>
        <div className="cart-empty__icon">🛍️</div>
        <h2 className="heading-serif">Your cart is empty</h2>
        <p>Discover our luxury collection and find your signature scent.</p>
        <Link to="/products" className="btn btn-primary" style={{ marginTop: 'var(--space-xl)' }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page container section" style={{ position: 'relative' }}>


      <h1 className="heading-serif cart-title">Shopping Cart ({itemCount})</h1>
      
      <div className="cart-layout">
        <div className="cart-items">
          {cart.CartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div className="cart-item__image">
                <img 
                  src={item.Product.image_url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=200'} 
                  alt={item.Product.name} 
                />
              </div>
              
              <div className="cart-item__details">
                <div className="cart-item__brand">{item.Product.brand}</div>
                <h3 className="cart-item__name">
                  <Link to={`/products/${item.product_id}`}>{item.Product.name}</Link>
                </h3>
                <div className="cart-item__meta">
                  {item.Product.volume} · {item.Product.fragrance_type}
                </div>
              </div>
              
              <div className="cart-item__quantity">
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.Product.stock}
                >
                  <FiPlus />
                </button>
              </div>
              
              <div className="cart-item__price">
                ${(parseFloat(item.Product.price) * item.quantity).toFixed(2)}
              </div>
              
              <button 
                className="cart-item__remove" 
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <h2 className="cart-summary__title heading-serif">Order Summary</h2>
          
          <div className="cart-summary__row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="cart-summary__row">
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className="cart-summary__row">
            <span>Payment Method</span>
            <span>Cash on Delivery</span>
          </div>
          
          <div className="cart-summary__total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            className="btn btn-primary cart-summary__checkout"
            onClick={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Proceed to Checkout'} <FiArrowRight />
          </button>
          
          <p className="cart-summary__note">
            Payment will be collected upon delivery of your items.
          </p>
        </div>
      </div>
    </div>
  );
}
