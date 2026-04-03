import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiArrowUpRight } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="main-footer">
      <div className="footer__container container">
        {/* Top Section */}
        <div className="footer__top">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <span className="footer__logo-icon">✦</span>
              <span className="footer__logo-text">PerfumeHub</span>
            </Link>
            <p className="footer__tagline">
              Discover your signature scent. Curated collections of the world's finest fragrances.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="Instagram"><FiInstagram size={18} /></a>
              <a href="#" className="footer__social-link" aria-label="Twitter"><FiTwitter size={18} /></a>
              <a href="#" className="footer__social-link" aria-label="Facebook"><FiFacebook size={18} /></a>
              <a href="#" className="footer__social-link" aria-label="Email"><FiMail size={18} /></a>
            </div>
          </div>

          <div className="footer__links-grid">
            <div className="footer__links-col">
              <h4 className="footer__links-title">Shop</h4>
              <Link to="/products" className="footer__link">All Perfumes</Link>
              <Link to="/products?category=floral" className="footer__link">Floral</Link>
              <Link to="/products?category=woody" className="footer__link">Woody</Link>
              <Link to="/products?category=oriental" className="footer__link">Oriental</Link>
              <Link to="/products?featured=true" className="footer__link">Featured</Link>
            </div>
            <div className="footer__links-col">
              <h4 className="footer__links-title">Account</h4>
              <Link to="/login" className="footer__link">Sign In</Link>
              <Link to="/cart" className="footer__link">Shopping Cart</Link>
              <Link to="/wishlist" className="footer__link">Wishlist</Link>
              <Link to="/orders" className="footer__link">Order History</Link>
            </div>
            <div className="footer__links-col">
              <h4 className="footer__links-title">Info</h4>
              <a href="#" className="footer__link">About Us</a>
              <a href="#" className="footer__link">Shipping & Returns</a>
              <a href="#" className="footer__link">Contact</a>
              <a href="#" className="footer__link">Privacy Policy</a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer__newsletter">
            <h4 className="footer__links-title">Newsletter</h4>
            <p className="footer__newsletter-text">Get exclusive offers and new arrival updates.</p>
            <form className="footer__newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email address"
                className="footer__newsletter-input"
                id="newsletter-email"
              />
              <button type="submit" className="footer__newsletter-btn" id="newsletter-submit">
                <FiArrowUpRight size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">© 2026 PerfumeHub. All rights reserved. MSc Graduation Project.</p>
          <div className="footer__payment-text">Cash on Delivery Available</div>
        </div>
      </div>
    </footer>
  );
}
