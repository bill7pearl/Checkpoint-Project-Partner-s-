import { Link } from 'react-router-dom';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const handleAddToCart = async (e) => {
    e.preventDefault(); // Prevent navigating to product detail
    const res = await addToCart(product.id, 1, product);
    if (res.success) {
      import('react-hot-toast').then(t => t.default.success("Added to cart"));
    } else {
      import('react-hot-toast').then(t => t.default.error(res.message));
    }
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card__image-container">
        {product.featured && <span className="product-card__badge">Featured</span>}
        <img 
          src={product.image_url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500'} 
          alt={product.name} 
          className="product-card__image" 
          loading="lazy"
        />
        
        <div className="product-card__actions">
          <button 
            className="product-card__btn product-card__btn--wishlist"
            onClick={async (e) => {
              e.preventDefault();
              try {
                if (!isAuthenticated) return window.location.href = '/login';
                const res = await import('../../services/wishlistService').then(m => m.wishlistService.toggleWishlist(product.id));
                import('react-hot-toast').then(toast => toast.default.success(res.message));
              } catch (err) { console.error('Wishlist error', err); }
            }}
            aria-label="Add to wishlist"
          >
            <FiHeart />
          </button>
          <button 
            className="product-card__btn product-card__btn--cart"
            onClick={handleAddToCart}
            aria-label="Add to cart"
            disabled={product.stock === 0}
          >
            <FiShoppingBag />
            <span>{product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
      
      <div className="product-card__content">
        <div className="product-card__brand">{product.brand || 'PerfumeHub'}</div>
        <h3 className="product-card__title">{product.name}</h3>
        <div className="product-card__meta">
          <span className="product-card__type">{product.fragrance_type}</span>
          <span className="product-card__volume">{product.volume}</span>
        </div>
        <div className="product-card__footer">
          <div className="product-card__price">${parseFloat(product.price).toFixed(2)}</div>
        </div>
      </div>
    </Link>
  );
}
