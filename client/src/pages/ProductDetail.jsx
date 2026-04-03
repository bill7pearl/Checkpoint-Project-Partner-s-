import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiMinus, FiPlus, FiHeart, FiShoppingBag, FiTruck, FiRotateCcw } from 'react-icons/fi';
import gsap from 'gsap';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const imageRef = useRef(null);
  const infoRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  // Entrance Animations
  useEffect(() => {
    if (!loading && product && imageRef.current && infoRef.current) {
      let ctx = gsap.context(() => {
        const tl = gsap.timeline();
        
        tl.from(imageRef.current, {
          x: -50,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out'
        })
        .from(infoRef.current.children, {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out'
        }, '-=0.4');
      });
      return () => ctx.revert();
    }
  }, [loading, product]);

  const handleAddToCart = async () => {
    const res = await addToCart(product.id, quantity, product);
    if (res.success) {
      import('react-hot-toast').then(t => t.default.success("Added to cart"));
    } else {
      import('react-hot-toast').then(t => t.default.error(res.message));
    }
  };

  if (loading) return <div className="product-detail-loading">Summoning essence...</div>;
  if (!product) return <div className="container section">Product not found</div>;

  return (
    <div className="product-detail page-transition">
      <div className="container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to={`/products?category=${product.Category?.slug || ''}`}>
            {product.Category?.name || 'All'}
          </Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>

        <div className="product-detail__layout">
          {/* Image Gallery */}
          <div className="product-detail__gallery" ref={imageRef}>
            <div className="product-detail__image-main">
              <img 
                src={product.image_url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'} 
                alt={product.name} 
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="product-detail__info" ref={infoRef}>
            <div className="product-detail__brand">{product.brand}</div>
            <h1 className="heading-serif product-detail__title">{product.name}</h1>
            <div className="product-detail__price">${parseFloat(product.price).toFixed(2)}</div>
            
            <p className="product-detail__description">{product.description}</p>
            
            <div className="product-detail__meta">
              <div className="meta-item">
                <span className="meta-label">Fragrance Type</span>
                <span className="meta-value">{product.fragrance_type}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Volume</span>
                <span className="meta-value">{product.volume}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Availability</span>
                <span className={`meta-value ${product.stock > 0 ? 'text-green' : 'text-danger'}`}>
                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="product-detail__actions">
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                >
                  <FiPlus />
                </button>
              </div>
              
              <button 
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <FiShoppingBag /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button 
                className="btn btn-outline wishlist-btn" 
                aria-label="Add to Wishlist"
                onClick={async () => {
                  try {
                    if (!isAuthenticated) return window.location.href = '/login';
                    const res = await import('../services/wishlistService').then(m => m.wishlistService.toggleWishlist(product.id));
                    import('react-hot-toast').then(toast => toast.default.success(res.message));
                  } catch (e) { console.error('Wishlist error', e); }
                }}
              >
                <FiHeart />
              </button>
            </div>

            <div className="product-detail__perks">
              <div className="perk">
                <FiTruck size={20} />
                <span>Free shipping on orders over $150</span>
              </div>
              <div className="perk">
                <FiRotateCcw size={20} />
                <span>Free returns within 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
