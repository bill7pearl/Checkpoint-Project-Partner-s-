import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FiArrowRight } from 'react-icons/fi';
import ProductCard from '../components/ui/ProductCard';
import { productService } from '../services/productService';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const marqueeRef = useRef(null);
  const featuredRef = useRef(null);
  const collectionsRef = useRef(null);

  useEffect(() => {
    // Fetch featured products
    const loadFeatured = async () => {
      try {
        const data = await productService.getFeatured();
        setFeaturedProducts(data.slice(0, 4)); // Show 4 on home
      } catch (error) {
        console.error('Error loading featured products:', error);
      }
    };
    loadFeatured();
  }, []);

  useEffect(() => {
    // GSAP Animations
    let ctx = gsap.context(() => {
      // 1. Hero Animation (Load)
      const heroTl = gsap.timeline();
      
      heroTl.from('.hero__badge', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      })
      .from('.hero__title span', {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        ease: 'power4.out'
      }, '-=0.4')
      .from('.hero__text', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6')
      .from('.hero__cta', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6')
      .from('.hero__image-wrapper', {
        scale: 1.05,
        opacity: 0,
        duration: 1.5,
        ease: 'power2.out'
      }, '-=1.2');

      // 2. Parallax Hero Image on Scroll
      gsap.to('.hero__image', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // 3. Featured Products Stagger Reveal
      gsap.from('.featured__card', {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 75%'
        }
      });

      // 4. Collections Fade In
      gsap.from('.collection-item', {
        y: 40,
        opacity: 0,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: collectionsRef.current,
          start: 'top 80%'
        }
      });

    });

    return () => ctx.revert();
  }, [featuredProducts]); // Re-run when products load so DOM elements exist

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="container hero__container">
          <div className="hero__content" ref={heroTextRef}>
            <div className="hero__badge">New Arrival</div>
            <h1 className="hero__title heading-serif">
               <span style={{ display: 'block' }}>Essence</span>
               <span style={{ display: 'block' }}>of <i className="text-gradient-gold">Desire</i>.</span>
            </h1>
            <p className="hero__text">
              Discover our latest collection of artisanal fragrances, crafted with the world's most precious ingredients.
            </p>
            <div className="hero__cta">
              <Link to="/products" className="btn btn-primary">
                Shop Collection <FiArrowRight />
              </Link>
            </div>
          </div>
          
          <div className="hero__visual">
            <div className="hero__image-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1594035910387-fea081db797e?w=800&q=80" 
                alt="Luxury Perfume Bottle" 
                className="hero__image"
              />
              <div className="hero__blur-circle"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Marquee */}
      <div className="marquee" ref={marqueeRef}>
        <div className="marquee__inner">
          <span className="marquee__item">CHANEL</span>
          <span className="marquee__item">DIOR</span>
          <span className="marquee__item">TOM FORD</span>
          <span className="marquee__item">BYREDO</span>
          <span className="marquee__item">LE LABO</span>
          <span className="marquee__item">JO MALONE</span>
          {/* Duplicate for infinite loop */}
          <span className="marquee__item">CHANEL</span>
          <span className="marquee__item">DIOR</span>
          <span className="marquee__item">TOM FORD</span>
          <span className="marquee__item">BYREDO</span>
          <span className="marquee__item">LE LABO</span>
          <span className="marquee__item">JO MALONE</span>
        </div>
      </div>

      {/* Featured Products */}
      <section className="section featured" ref={featuredRef}>
        <div className="container">
          <div className="section__header">
            <h2 className="heading-serif section__title">Curated Selection</h2>
            <Link to="/products?featured=true" className="link-arrow">View All <FiArrowRight /></Link>
          </div>
          
          <div className="featured__grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="featured__card">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="section collections" ref={collectionsRef}>
        <div className="container">
          <h2 className="heading-serif section__title text-center" style={{ marginBottom: 'var(--space-3xl)' }}>
            Scent Profiles
          </h2>
          
          <div className="collections__grid">
            <Link to="/products?category=floral" className="collection-item">
              <div className="collection-item__image">
                <img src="https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600" alt="Floral" />
              </div>
              <div className="collection-item__content">
                <h3>Floral</h3>
                <p>Delicate & Romantic</p>
              </div>
            </Link>
            
            <Link to="/products?category=woody" className="collection-item collection-item--large">
              <div className="collection-item__image">
                <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600" alt="Woody" />
              </div>
              <div className="collection-item__content">
                <h3>Woody & Earthy</h3>
                <p>Warm, Deep & Grounding</p>
              </div>
            </Link>
            
            <Link to="/products?category=fresh" className="collection-item">
              <div className="collection-item__image">
                <img src="https://images.unsplash.com/photo-1495435798646-a289417deff8?w=600" alt="Fresh" />
              </div>
              <div className="collection-item__content">
                <h3>Fresh & Citrus</h3>
                <p>Bright, Clean & Energizing</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
