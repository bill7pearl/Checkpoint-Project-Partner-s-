import { useEffect, useRef } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { loginWithGoogle, loginWithGithub, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const formRef = useRef(null);

  // Animate on mount
  useEffect(() => {
    if (!loading && !isAuthenticated && formRef.current) {
      gsap.fromTo(formRef.current, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
    }
  }, [loading, isAuthenticated]);

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  // Redirect if already logged in
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/profile';
    return <Navigate to={from} replace />;
  }

  return (
    <div className="login-page">
      <div className="login-container" ref={formRef}>
        <div className="login-header">
          <div className="login-icon">✦</div>
          <h1 className="heading-serif login-title">Welcome to PerfumeHub</h1>
          <p className="login-subtitle">Sign in or create an account to curate your signature collection.</p>
        </div>

        <div className="oauth-buttons">
          <button 
            className="oauth-btn oauth-btn--google"
            onClick={loginWithGoogle}
          >
            <FcGoogle size={24} />
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="login-footer">
          By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
