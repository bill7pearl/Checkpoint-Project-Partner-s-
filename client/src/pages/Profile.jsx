import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiPackage, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './Profile.css';

export default function Profile() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setOrdersLoading(true);
      api.get('/orders')
        .then(res => setOrders(res.data))
        .catch(err => console.error('Failed to fetch orders:', err))
        .finally(() => setOrdersLoading(false));
    }
  }, [isAuthenticated]);

  if (loading) return <div className="container section">Loading profile...</div>;
  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  return (
    <div className="profile-page container section">
      <div className="profile-layout">
        
        {/* Sidebar */}
        <aside className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-avatar-large">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} />
              ) : (
                <FiUser size={40} />
              )}
            </div>
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            {user.is_admin && <span className="admin-badge">Admin</span>}
          </div>

          <nav className="profile-nav">
            <button className="profile-nav-btn active">
              <FiUser /> Account Details
            </button>
            <button className="profile-nav-btn">
              <FiPackage /> Order History
            </button>
            <button className="profile-nav-btn">
              <FiMapPin /> Saved Addresses
            </button>
            <button className="profile-nav-btn text-danger" onClick={logout}>
              <FiLogOut /> Sign Out
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="profile-content">
          <h1 className="heading-serif profile-title">Account Details</h1>
          
          <div className="profile-section">
            <h3 className="section-title">Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Full Name</span>
                <span className="info-value">{user.name}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email Address</span>
                <span className="info-value">{user.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Account Type</span>
                <span className="info-value">{user.oauth_provider || 'Local'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Member Since</span>
                <span className="info-value">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="section-title">Recent Orders</h3>
            {ordersLoading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading your orders...</div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <p>You haven't placed any orders yet.</p>
                <button className="btn btn-outline" style={{marginTop: '15px'}} onClick={() => window.location.href='/products'}>
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(order => (
                  <div key={order.id} className="order-card" style={{ border: '1px solid var(--border-light)', padding: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                    <div className="order-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px', marginBottom: '15px' }}>
                      <div>
                        <strong>Order #{order.id}</strong>
                        <div style={{ fontSize: '0.85em', color: 'var(--text-muted)' }}>
                          {new Date(order.created_at || order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.1em' }}>
                          ${parseFloat(order.total_price).toFixed(2)}
                        </div>
                        <span style={{ fontSize: '0.75em', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="order-items" style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '5px' }}>
                      {order.OrderItems?.map(item => (
                        <div key={item.id} style={{ textAlign: 'center' }}>
                          <img src={item.Product?.image_url || 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=100'} alt={item.Product?.name} style={{ width: '70px', height: '70px', objectFit: 'cover', background: 'var(--bg-tertiary)' }} />
                          <div style={{ fontSize: '0.75em', marginTop: '5px' }}>Qty: {item.quantity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
