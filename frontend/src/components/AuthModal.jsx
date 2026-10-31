import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X, LogIn, UserPlus, ChefHat, HeartHandshake, Bike,
  Building, MapPin, Phone, Mail, Lock, User, Utensils,
  Truck, Clock, Users, Heart
} from 'lucide-react';

const ROLE_CONFIG = {
  donor: {
    label: 'Food Donor',
    subtitle: 'Restaurant, Hotel, Bakery, Caterer, Grocery',
    icon: ChefHat,
    color: 'var(--primary-orange)',
    bgColor: 'rgba(255, 138, 61, 0.08)',
    borderColor: 'rgba(255, 138, 61, 0.3)',
    orgTypes: ['Restaurant', 'Hotel', 'Caterer', 'Grocery Store', 'Bakery', 'Community Kitchen', 'Corporate Cafeteria', 'Other'],
    orgLabel: 'Business / Establishment Name',
    orgPlaceholder: 'e.g. Paradise Biryani House',
    extraFields: ['avgDailyMeals'],
  },
  recipient: {
    label: 'Recipient (NGO / Charity)',
    subtitle: 'NGO, Shelter, Food Bank, Orphanage',
    icon: HeartHandshake,
    color: 'var(--bright-green)',
    bgColor: 'rgba(34, 197, 94, 0.08)',
    borderColor: 'rgba(34, 197, 94, 0.3)',
    orgTypes: ['NGO', 'Charity', 'Shelter', 'Food Bank', 'Orphanage', 'Old Age Home', 'Community Center', 'Other'],
    orgLabel: 'Organization Name',
    orgPlaceholder: 'e.g. Akshaya Meals Foundation',
    extraFields: ['servingCapacity', 'preferredCategories'],
  },
  volunteer: {
    label: 'Volunteer (Pickup Agent)',
    subtitle: 'Help transport food from donors to recipients',
    icon: Bike,
    color: '#3B82F6',
    bgColor: 'rgba(59, 130, 246, 0.08)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    orgTypes: ['Individual Volunteer', 'Volunteer Group', 'Student Organization', 'Corporate CSR', 'Other'],
    orgLabel: 'Team / Group Name (optional)',
    orgPlaceholder: 'e.g. City Rescue Fleet (or leave blank)',
    extraFields: ['vehicleType', 'availability'],
  },
};

const FOOD_CATEGORIES = ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Bakery', 'Fruits', 'Vegetables', 'Dairy', 'Packaged Food'];

export default function AuthModal({ isOpen, onClose, initialTab = 'login', defaultRole = 'donor', onLoginSuccess }) {
  const { login, register } = useAuth();
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [organizationName, setOrganizationName] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [address, setAddress] = useState('');

  // Role-specific fields
  const [servingCapacity, setServingCapacity] = useState('');
  const [preferredCategories, setPreferredCategories] = useState([]);
  const [vehicleType, setVehicleType] = useState('');
  const [availability, setAvailability] = useState('');
  const [avgDailyMeals, setAvgDailyMeals] = useState('');

  // Reset tab when opened
  useEffect(() => {
    if (isOpen) {
      setTab(initialTab);
      setError('');
    }
  }, [isOpen, initialTab]);

  // Reset role-specific fields when role changes
  useEffect(() => {
    setOrganizationType(ROLE_CONFIG[role]?.orgTypes[0] || '');
  }, [role]);

  if (!isOpen) return null;

  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG.donor;
  const RoleIcon = roleConfig.icon;

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

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const userData = {
        name,
        email,
        password,
        phone,
        role,
        organizationName: organizationName || name,
        organizationType,
        address,
      };

      // Add role-specific data
      if (role === 'donor') {
        userData.avgDailyMeals = avgDailyMeals ? parseInt(avgDailyMeals, 10) : 0;
      } else if (role === 'recipient') {
        userData.servingCapacity = servingCapacity ? parseInt(servingCapacity, 10) : 50;
        userData.preferredCategories = preferredCategories.length > 0 ? preferredCategories : FOOD_CATEGORIES.slice(0, 5);
      } else if (role === 'volunteer') {
        userData.vehicleType = vehicleType || 'Bike';
        userData.availability = availability || 'Flexible';
      }

      const newUser = await register(userData);
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

  const toggleCategory = (cat) => {
    setPreferredCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 12px 10px 38px',
    borderRadius: 'var(--radius-md)',
    border: '1.5px solid var(--border-color)',
    fontSize: '0.88rem',
    fontFamily: 'var(--font-body)',
    background: '#FFFFFF',
    transition: 'border-color 0.2s',
    outline: 'none',
  };

  const iconWrapStyle = {
    position: 'absolute',
    left: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'var(--text-muted)',
    pointerEvents: 'none',
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '28px 30px', maxWidth: '540px', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', margin: 0, color: 'var(--deep-forest-green)', fontWeight: 800 }}>
              {tab === 'login' ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              {tab === 'login' ? 'Sign in to access your FoodResQ dashboard' : 'Join the food rescue network today'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--cream-surface)', border: 'none', cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
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
              flex: 1, padding: '10px', borderRadius: 'var(--radius-full)',
              fontWeight: 700, fontSize: '0.88rem',
              background: tab === 'login' ? '#FFFFFF' : 'transparent',
              color: tab === 'login' ? 'var(--deep-forest-green)' : 'var(--text-muted)',
              boxShadow: tab === 'login' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '6px', border: 'none', cursor: 'pointer',
            }}
          >
            <LogIn size={16} /> Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(''); }}
            style={{
              flex: 1, padding: '10px', borderRadius: 'var(--radius-full)',
              fontWeight: 700, fontSize: '0.88rem',
              background: tab === 'register' ? '#FFFFFF' : 'transparent',
              color: tab === 'register' ? 'var(--deep-forest-green)' : 'var(--text-muted)',
              boxShadow: tab === 'register' ? 'var(--shadow-sm)' : 'none',
              transition: 'var(--transition)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '6px', border: 'none', cursor: 'pointer',
            }}
          >
            <UserPlus size={16} /> Create Account
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div
            style={{
              background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B',
              padding: '10px 14px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {/* =================== LOGIN FORM =================== */}
        {tab === 'login' ? (
          <form onSubmit={handleLoginSubmit}>
            <div style={{ marginBottom: '14px', position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dark-text)', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <span style={iconWrapStyle}><Mail size={16} /></span>
                <input
                  type="email" required value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@organization.com"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dark-text)', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <span style={iconWrapStyle}><Lock size={16} /></span>
                <input
                  type="password" required value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  style={inputStyle}
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '1rem', marginTop: '10px', fontWeight: 700 }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <button type="button" onClick={() => { setTab('register'); setError(''); }}
                style={{ color: 'var(--primary-orange)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Create one
              </button>
            </p>
          </form>
        ) : (
          /* =================== REGISTER FORM =================== */
          <form onSubmit={handleRegisterSubmit}>

            {/* STEP 1: Role Selection Cards */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--dark-text)', marginBottom: '8px' }}>
                I want to join as *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  const isSelected = role === key;
                  return (
                    <button
                      key={key} type="button"
                      onClick={() => setRole(key)}
                      style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                        padding: '14px 8px', borderRadius: 'var(--radius-md)',
                        background: isSelected ? cfg.bgColor : '#FFFFFF',
                        border: `2px solid ${isSelected ? cfg.color : 'var(--border-color)'}`,
                        cursor: 'pointer', transition: 'all 0.2s',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                      }}
                    >
                      <Icon size={22} color={isSelected ? cfg.color : 'var(--text-muted)'} />
                      <span style={{
                        fontSize: '0.72rem', fontWeight: isSelected ? 800 : 600,
                        color: isSelected ? cfg.color : 'var(--dark-text)',
                        textAlign: 'center', lineHeight: 1.2,
                      }}>
                        {key === 'donor' ? 'Food Donor' : key === 'recipient' ? 'NGO / Charity' : 'Volunteer'}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {roleConfig.subtitle}
              </p>
            </div>

            {/* STEP 2: Personal Details */}
            <div style={{
              background: 'var(--cream-surface)', borderRadius: 'var(--radius-lg)',
              padding: '16px', marginBottom: '16px', border: '1px solid var(--border-color)',
            }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                Personal Information
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '4px' }}>Full Name *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrapStyle}><User size={15} /></span>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name" style={{ ...inputStyle, padding: '9px 12px 9px 34px', fontSize: '0.84rem' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '4px' }}>Phone *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrapStyle}><Phone size={15} /></span>
                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98490 00000" style={{ ...inputStyle, padding: '9px 12px 9px 34px', fontSize: '0.84rem' }} />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '4px' }}>Email Address *</label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrapStyle}><Mail size={15} /></span>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organization.com" style={{ ...inputStyle, padding: '9px 12px 9px 34px', fontSize: '0.84rem' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '4px' }}>Password *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrapStyle}><Lock size={15} /></span>
                    <input type="password" required minLength="6" value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters" style={{ ...inputStyle, padding: '9px 12px 9px 34px', fontSize: '0.84rem' }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '4px' }}>Confirm Password *</label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrapStyle}><Lock size={15} /></span>
                    <input type="password" required minLength="6" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password" style={{ ...inputStyle, padding: '9px 12px 9px 34px', fontSize: '0.84rem' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 3: Role-Specific Details */}
            <div style={{
              background: roleConfig.bgColor, borderRadius: 'var(--radius-lg)',
              padding: '16px', marginBottom: '16px', border: `1.5px solid ${roleConfig.borderColor}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                <RoleIcon size={16} color={roleConfig.color} />
                <p style={{ fontSize: '0.72rem', fontWeight: 800, color: roleConfig.color, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
                  {role === 'donor' ? 'Business Details' : role === 'recipient' ? 'Organization Details' : 'Volunteer Details'}
                </p>
              </div>

              {/* Organization/Team Name */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '4px' }}>
                  {roleConfig.orgLabel} {role !== 'volunteer' ? '*' : ''}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrapStyle}><Building size={15} /></span>
                  <input type="text" required={role !== 'volunteer'} value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder={roleConfig.orgPlaceholder}
                    style={{ ...inputStyle, padding: '9px 12px 9px 34px', fontSize: '0.84rem' }} />
                </div>
              </div>

              {/* Organization Type */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '4px' }}>
                  {role === 'donor' ? 'Business Type *' : role === 'recipient' ? 'Organization Type *' : 'Volunteer Type *'}
                </label>
                <select value={organizationType} onChange={(e) => setOrganizationType(e.target.value)}
                  style={{
                    width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)',
                    border: '1.5px solid var(--border-color)', fontSize: '0.84rem',
                    fontFamily: 'var(--font-body)', background: '#FFFFFF',
                  }}
                >
                  {roleConfig.orgTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Address */}
              <div style={{ marginBottom: '10px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '4px' }}>
                  {role === 'volunteer' ? 'Your Area / Locality *' : 'Facility Address *'}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={iconWrapStyle}><MapPin size={15} /></span>
                  <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)}
                    placeholder={role === 'volunteer' ? 'e.g. Gachibowli, Hyderabad' : 'e.g. Road 36, Jubilee Hills, Hyderabad'}
                    style={{ ...inputStyle, padding: '9px 12px 9px 34px', fontSize: '0.84rem' }} />
                </div>
              </div>

              {/* === DONOR-SPECIFIC: Avg daily surplus === */}
              {role === 'donor' && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '4px' }}>
                    Average Daily Surplus Meals (approx)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={iconWrapStyle}><Utensils size={15} /></span>
                    <input type="number" min="0" value={avgDailyMeals} onChange={(e) => setAvgDailyMeals(e.target.value)}
                      placeholder="e.g. 50"
                      style={{ ...inputStyle, padding: '9px 12px 9px 34px', fontSize: '0.84rem' }} />
                  </div>
                </div>
              )}

              {/* === RECIPIENT-SPECIFIC: Serving capacity + preferred categories === */}
              {role === 'recipient' && (
                <>
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '4px' }}>
                      Daily Serving Capacity (people) *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <span style={iconWrapStyle}><Users size={15} /></span>
                      <input type="number" required min="1" value={servingCapacity}
                        onChange={(e) => setServingCapacity(e.target.value)}
                        placeholder="e.g. 200"
                        style={{ ...inputStyle, padding: '9px 12px 9px 34px', fontSize: '0.84rem' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '6px' }}>
                      Preferred Food Categories
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {FOOD_CATEGORIES.map((cat) => {
                        const isSelected = preferredCategories.includes(cat);
                        return (
                          <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                            style={{
                              padding: '5px 10px', borderRadius: 'var(--radius-full)',
                              fontSize: '0.74rem', fontWeight: isSelected ? 700 : 500,
                              background: isSelected ? 'var(--bright-green)' : '#FFFFFF',
                              color: isSelected ? '#FFFFFF' : 'var(--dark-text)',
                              border: `1.5px solid ${isSelected ? 'var(--bright-green)' : 'var(--border-color)'}`,
                              cursor: 'pointer', transition: 'all 0.15s',
                            }}
                          >
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}

              {/* === VOLUNTEER-SPECIFIC: Vehicle type + availability === */}
              {role === 'volunteer' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '4px' }}>
                        Vehicle Type
                      </label>
                      <select value={vehicleType} onChange={(e) => setVehicleType(e.target.value)}
                        style={{
                          width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-color)', fontSize: '0.84rem',
                          fontFamily: 'var(--font-body)', background: '#FFFFFF',
                        }}
                      >
                        <option value="">Select...</option>
                        <option value="Bike">Bike / Scooter</option>
                        <option value="Car">Car</option>
                        <option value="Auto">Auto Rickshaw</option>
                        <option value="Van">Mini Van</option>
                        <option value="Bicycle">Bicycle</option>
                        <option value="Walk">On Foot</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 600, color: 'var(--dark-text)', marginBottom: '4px' }}>
                        Availability
                      </label>
                      <select value={availability} onChange={(e) => setAvailability(e.target.value)}
                        style={{
                          width: '100%', padding: '9px 12px', borderRadius: 'var(--radius-md)',
                          border: '1.5px solid var(--border-color)', fontSize: '0.84rem',
                          fontFamily: 'var(--font-body)', background: '#FFFFFF',
                        }}
                      >
                        <option value="">Select...</option>
                        <option value="Morning">Morning (6AM–12PM)</option>
                        <option value="Afternoon">Afternoon (12PM–5PM)</option>
                        <option value="Evening">Evening (5PM–10PM)</option>
                        <option value="Weekends">Weekends Only</option>
                        <option value="Flexible">Flexible / Anytime</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '13px', fontSize: '1rem', fontWeight: 700 }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <button type="button" onClick={() => { setTab('login'); setError(''); }}
                style={{ color: 'var(--primary-orange)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
