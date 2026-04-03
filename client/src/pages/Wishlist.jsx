import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiHeart } from 'react-icons/fi';
import { wishlistService } from '../services/wishlistService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Wishlist.css';

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    
    try {
      const data = await wishlistService.getWishlist();
      setWishlistItems(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await wishlistService.toggleWishlist(productId);
      setWishlistItems(wishlistItems.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product.id, 1);
    handleRemove(product.id);
  };

  if (loading) return <div className="container section empty-state">Loading wishlist...</div>;

  if (!isAuthenticated) {
    return (
      <div className="container section empty-state">
        <FiHeart size={64} style={{ opacity: 0.3, marginBottom: '20px' }} />
        <h2 className="heading-serif">Your Wishlist</h2>
        <p>Please log in to view and manage your curated wishlist.</p>
        <Link to="/login" className="btn btn-primary" style={{ marginTop: '20px' }}>
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page container section">
      <h1 className="heading-serif wishlist-title">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="empty-state">
          <FiHeart size={64} style={{ opacity: 0.3, marginBottom: '20px' }} />
          <h2 className="heading-serif">Your wishlist is empty</h2>
          <p>Curate your signature collection by clicking the heart icon on any product.</p>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Discover Fragrances
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-item">
              <div className="wishlist-item__image">
                <Link to={`/products/${item.Product.id}`}>
                  <img 
                    src={item.Product.image_url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400'} 
                    alt={item.Product.name} 
                  />
                </Link>
                <button 
                  className="wishlist-item__remove"
                  onClick={() => handleRemove(item.Product.id)}
                  aria-label="Remove from wishlist"
                >
                  <FiTrash2 />
                </button>
              </div>
              
              <div className="wishlist-item__info">
                <div className="wishlist-item__brand">{item.Product.brand}</div>
                <h3 className="wishlist-item__name">
                  <Link to={`/products/${item.Product.id}`}>{item.Product.name}</Link>
                </h3>
                <div className="wishlist-item__price">${parseFloat(item.Product.price).toFixed(2)}</div>
                
                <button 
                  className="btn btn-outline wishlist-item__add"
                  onClick={() => handleAddToCart(item.Product)}
                  disabled={item.Product.stock === 0}
                >
                  <FiShoppingBag /> {item.Product.stock > 0 ? 'Move to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
