import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, Sparkles, ChefHat, HeartHandshake, Bike, ShieldCheck } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialTab = 'login', defaultRole = 'donor', onLoginSuccess }) {
  const { login, register, switchRoleDemo } = useAuth();
  const [tab, setTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('Restaurant');
  const [address, setAddress] = useState('Hitech City, Hyderabad');

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const loggedUser = await login(loginEmail, loginPassword);
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(loggedUser?.role || 'donor');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const newUser = await register({
        name,
        email,
        password,
        phone,
        role,
        organizationName,
        organizationType,
        address,
      });
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(newUser?.role || role);
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoRole) => {
    setLoading(true);
    setError('');
    try {
      const demoUser = await switchRoleDemo(demoRole);
      onClose();
      if (onLoginSuccess) {
        onLoginSuccess(demoUser?.role || demoRole);
      }
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '30px', maxWidth: '520px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--deep-forest-green)' }}>
              {tab === 'login' ? 'Welcome Back to FoodResQ' : 'Join FoodResQ Network'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {tab === 'login' ? 'Access your dashboard or use 1-click demo login below' : 'Register your organization or volunteer profile'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--cream-surface)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 1-Click Demo Accounts Quick Bar */}
        <div
          style={{
            background: 'var(--warm-cream)',
            borderRadius: 'var(--radius-lg)',
            padding: '14px',
            marginBottom: '20px',
            border: '1.5px solid rgba(255, 138, 61, 0.3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Sparkles size={15} color="var(--primary-orange)" />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--deep-forest-green)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              ⚡ Instant 1-Click Demo Sign-In
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('donor')}
              className="btn-cream btn-sm"
              style={{ padding: '8px 4px', fontSize: '0.74rem', flexDirection: 'column', gap: '4px' }}
            >
              <ChefHat size={16} color="var(--primary-orange)" />
              <span>Donor</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('recipient')}
              className="btn-cream btn-sm"
              style={{ padding: '8px 4px', fontSize: '0.74rem', flexDirection: 'column', gap: '4px' }}
            >
              <HeartHandshake size={16} color="var(--bright-green)" />
              <span>NGO</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('volunteer')}
              className="btn-cream btn-sm"
              style={{ padding: '8px 4px', fontSize: '0.74rem', flexDirection: 'column', gap: '4px' }}
            >
              <Bike size={16} color="#3B82F6" />
              <span>Volunteer</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin')}
              className="btn-cream btn-sm"
              style={{ padding: '8px 4px', fontSize: '0.74rem', flexDirection: 'column', gap: '4px' }}
            >
              <ShieldCheck size={16} color="var(--deep-forest-green)" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div
          style={{
            display: 'flex',
            background: 'var(--cream-surface)',
            borderRadius: 'var(--radius-full)',
            padding: '4px',
            marginBottom: '20px',
            border: '1px solid var(--border-color)',
          }}
        >
          <button
            type="button"
            onClick={() => { setTab('login'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.85rem',
              background: tab === 'login' ? '#FFFFFF' : 'transparent',
              color: tab === 'login' ? 'var(--deep-forest-green)' : 'var(--text-muted)',
              boxShadow: tab === 'login' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition)',
            }}
          >
            Log In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.85rem',
              background: tab === 'register' ? '#FFFFFF' : 'transparent',
              color: tab === 'register' ? 'var(--deep-forest-green)' : 'var(--text-muted)',
              boxShadow: tab === 'register' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition)',
            }}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {/* Login Form */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="name@organization.com"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '10px' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Suresh Reddy"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Role *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="form-select"
                >
                  <option value="donor">Donor (Restaurant/Hotel/Bakery)</option>
                  <option value="recipient">Recipient (NGO/Charity/Shelter)</option>
                  <option value="volunteer">Volunteer (Pickup Agent)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Work Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="suresh@kitchen.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98490 00000"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Organization Name *</label>
              <input
                type="text"
                required
                value={organizationName}
                onChange={(e) => setOrganizationName(e.target.value)}
                placeholder="e.g. Paradise Banquets & Caterers"
                className="form-input"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Organization Type</label>
                <select
                  value={organizationType}
                  onChange={(e) => setOrganizationType(e.target.value)}
                  className="form-select"
                >
                  <option value="Restaurant">Restaurant</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Caterer">Caterer</option>
                  <option value="Grocery Store">Grocery Store</option>
                  <option value="Bakery">Bakery</option>
                  <option value="NGO">NGO / Charity</option>
                  <option value="Shelter">Shelter / Food Bank</option>
                  <option value="Individual Volunteer">Individual Volunteer</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Password *</label>
                <input
                  type="password"
                  required
                  minLength="6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Facility Address (Hyderabad) *</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Road 36, Jubilee Hills, Hyderabad"
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '10px' }}
            >
              {loading ? 'Creating Account...' : 'Complete Registration'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
