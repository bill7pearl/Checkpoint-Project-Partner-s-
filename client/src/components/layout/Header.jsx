import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiUser, FiShoppingBag, FiHeart, FiMenu, FiX } from 'react-icons/fi';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (itemCount > 0) {
      gsap.fromTo('.header__cart-badge', 
        { scale: 0.5, backgroundColor: 'var(--gold-light)' }, 
        { scale: 1, backgroundColor: 'var(--gold)', duration: 0.4, ease: 'back.out(2)' }
      );
    }
  }, [itemCount]);

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`} id="main-header">
      <div className="header__container">
        {/* Mobile Menu Toggle */}
        <button
          className="header__menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="menu-toggle"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        {/* Logo */}
        <Link to="/" className="header__logo" id="logo-link">
          <span className="header__logo-icon">✦</span>
          <span className="header__logo-text">PerfumeHub</span>
        </Link>

        {/* Navigation */}
        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`} id="main-nav">
          <Link to="/products" className="header__nav-link">Shop All</Link>
          <Link to="/products?category=floral" className="header__nav-link">Floral</Link>
          <Link to="/products?category=woody" className="header__nav-link">Woody</Link>
          <Link to="/products?category=oriental" className="header__nav-link">Oriental</Link>
          <Link to="/products?featured=true" className="header__nav-link">Featured</Link>
        </nav>

        {/* Actions */}
        <div className="header__actions">
          <Link to="/products" className="header__action-btn" aria-label="Search" id="search-btn">
            <FiSearch size={20} />
          </Link>

          <Link to="/wishlist" className="header__action-btn" aria-label="Wishlist" id="wishlist-btn">
            <FiHeart size={20} />
          </Link>

          <Link to="/cart" className="header__action-btn header__cart-btn" aria-label="Cart" id="cart-btn">
            <FiShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="header__cart-badge">{itemCount}</span>
            )}
          </Link>

          {isAuthenticated ? (
            <Link to="/profile" className="header__action-btn header__user-btn" aria-label="Profile" id="profile-btn">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="header__avatar" />
              ) : (
                <FiUser size={20} />
              )}
            </Link>
          ) : (
            <Link to="/login" className="header__action-btn" aria-label="Login" id="login-btn">
              <FiUser size={20} />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
