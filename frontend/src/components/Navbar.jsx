import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import NotificationDropdown from './NotificationDropdown';
import { Bell, Search, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';

export default function Navbar({ onNavigate, onOpenAuth, onOpenSearch }) {
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardRouteForRole = (role) => {
    switch (role) {
      case 'donor': return '/dashboard/donor';
      case 'recipient': return '/dashboard/ngo';
      case 'volunteer': return '/dashboard/volunteer';
      case 'admin': return '/dashboard/admin';
      default: return '/';
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/listings', label: 'Food Listings' },
    { to: '/organizations', label: 'Organizations' },
    { to: '/impact', label: 'Impact' },
    { to: '/about', label: 'About' },
  ];

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    if (to.startsWith('/#')) return location.pathname === '/' && location.hash === to.replace('/', '');
    return location.pathname === to;
  };

  const handleNavClick = (to) => {
    setMobileMenuOpen(false);
    if (to.startsWith('/#')) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(to.replace('/#', ''));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(to);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar-sticky">
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '76px' }}>
        {/* Brand Logo */}
        <Link
          to="/"
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none', textDecoration: 'none' }}
        >
          {/* Logo Icon: Green Leaf + Orange Bowl */}
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0F5132 0%, #166534 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(15, 81, 50, 0.25)',
              position: 'relative',
            }}
          >
            {/* SVG Logo Bowl and Leaf */}
            <svg width="26" height="26" viewBox="0 0 100 100" fill="none">
              <path d="M20 54 Q50 82 80 54" stroke="#FF8A3D" strokeWidth="8" strokeLinecap="round" />
              <path d="M50 20 C42 34 38 44 50 50 C62 44 58 34 50 20 Z" fill="#22C55E" />
              <circle cx="50" cy="50" r="3" fill="#FACC15" />
            </svg>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--deep-forest-green)', letterSpacing: '-0.02em' }}>
                Food<span style={{ color: 'var(--primary-orange)' }}>ResQ</span>
              </span>
            </div>
            <p style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-muted)', margin: 0, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Rescue Food. Feed Lives.
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hide-on-mobile" style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          {navLinks.map((link) => (
            <button
              key={link.to}
              onClick={() => handleNavClick(link.to)}
              style={{
                fontSize: '0.92rem',
                fontWeight: isActive(link.to) ? 700 : 500,
                color: isActive(link.to) ? 'var(--primary-orange)' : 'var(--dark-text)',
                padding: '6px 0',
                position: 'relative',
                transition: 'var(--transition)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {link.label}
              {isActive(link.to) && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '18px',
                    height: '2.5px',
                    borderRadius: '2px',
                    background: 'var(--primary-orange)',
                  }}
                />
              )}
            </button>
          ))}
        </nav>

        {/* Right Action Icons & Auth Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Search Icon */}
          <button
            onClick={onOpenSearch}
            title="Search listings & partners"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--dark-text)',
              background: 'var(--cream-surface)',
              border: '1px solid var(--border-color)',
            }}
          >
            <Search size={18} />
          </button>

          {/* Notifications Button */}
          {user && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                title="Notifications"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--dark-text)',
                  background: 'var(--cream-surface)',
                  border: '1px solid var(--border-color)',
                  position: 'relative',
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-2px',
                      right: '-2px',
                      background: 'var(--primary-orange)',
                      color: '#FFFFFF',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid #FFFFFF',
                    }}
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
            </div>
          )}

          {/* User Account or Get Started Button */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => navigate(getDashboardRouteForRole(user.role))}
                className="btn-forest btn-sm"
                style={{ gap: '6px' }}
              >
                <LayoutDashboard size={16} />
                <span className="hide-on-mobile">{user.role.toUpperCase()} DASHBOARD</span>
              </button>

              <button
                onClick={handleLogout}
                title="Log Out"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  background: 'transparent',
                }}
              >
                <LogOut size={17} />
              </button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="btn-primary btn-sm">
              Get Started
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              width: '38px',
              height: '38px',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--dark-text)',
            }}
            className="mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#FFFFFF',
            borderBottom: '1px solid var(--border-color)',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {navLinks.map((link) => (
            <button
              key={link.to}
              onClick={() => handleNavClick(link.to)}
              style={{
                textAlign: 'left',
                fontSize: '1rem',
                fontWeight: isActive(link.to) ? 700 : 500,
                color: isActive(link.to) ? 'var(--primary-orange)' : 'var(--dark-text)',
                padding: '8px 0',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {link.label}
            </button>
          ))}
          {user && (
            <button
              onClick={() => {
                navigate(getDashboardRouteForRole(user.role));
                setMobileMenuOpen(false);
              }}
              className="btn-forest"
              style={{ width: '100%', marginTop: '8px' }}
            >
              Go to {user.role.toUpperCase()} Dashboard
            </button>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 860px) {
          .hide-on-mobile { display: none !important; }
          .mobile-toggle-btn { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
