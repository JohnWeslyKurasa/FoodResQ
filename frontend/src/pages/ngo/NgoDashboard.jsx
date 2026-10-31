import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import FoodCard from '../../components/FoodCard';
import LiveMap from '../../components/LiveMap';
import RequestFoodModal from '../../components/RequestFoodModal';
import MatchingBreakdownModal from '../../components/MatchingBreakdownModal';
import OtpVerificationModal from '../../components/OtpVerificationModal';
import {
  Compass,
  LayoutGrid,
  Map,
  Sparkles,
  HeartHandshake,
  Clock,
  CheckCircle,
  QrCode,
  ShieldCheck,
  Search,
  Filter,
  SlidersHorizontal,
  XCircle
} from 'lucide-react';
import { formatDateTime, getTimeRemaining } from '../../utils/formatters';

export default function NgoDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'

  // Filter & Search states
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('match'); // 'match', 'nearest', 'urgent', 'quantity'

  // Modals state
  const [selectedDonationForRequest, setSelectedDonationForRequest] = useState(null);
  const [selectedDonationForMatch, setSelectedDonationForMatch] = useState(null);
  const [selectedRequestForOtp, setSelectedRequestForOtp] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const loadRecipientData = async () => {
    try {
      const res = await api.getRecipientDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load recipient dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipientData();
  }, []);

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation request?')) return;
    try {
      const res = await api.cancelRequest(requestId);
      if (res.success) {
        setStatusMessage('Request cancelled and food restored to available surplus.');
        setTimeout(() => setStatusMessage(''), 4000);
        loadRecipientData();
      }
    } catch (err) {
      alert(err.message || 'Failed to cancel request.');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading food rescue discovery engine...</p>
      </div>
    );
  }

  const allAvailable = data?.allAvailable || [];

  // Filter and sort donations
  let displayedDonations = allAvailable.filter((d) => {
    if (categoryFilter !== 'All' && d.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = d.title.toLowerCase().includes(q);
      const matchDesc = d.description.toLowerCase().includes(q);
      const matchDonor = d.donorId?.organizationName?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchDonor) return false;
    }
    return true;
  });

  if (sortOption === 'nearest') {
    displayedDonations.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  } else if (sortOption === 'match') {
    displayedDonations.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  } else if (sortOption === 'urgent') {
    const ranks = { critical: 3, urgent: 2, normal: 1 };
    displayedDonations.sort((a, b) => (ranks[b.urgency] || 0) - (ranks[a.urgency] || 0));
  } else if (sortOption === 'quantity') {
    displayedDonations.sort((a, b) => (b.remainingQuantity || 0) - (a.remainingQuantity || 0));
  }

  const stats = data?.stats || {};

  return (
    <div style={{ padding: '40px 0 80px', background: 'var(--cream-surface)', minHeight: 'calc(100vh - 76px)' }}>
      <div className="container">
        
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-veg">VERIFIED RECIPIENT PORTAL</span>
              {user?.isVerified && <ShieldCheck size={16} color="var(--bright-green)" />}
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--deep-forest-green)', margin: '4px 0 2px' }}>
              {user?.organizationName || 'Akshaya Meals Foundation'}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Serving Capacity: ~{user?.servingCapacity || 120} meals/day • {user?.address || 'Kondapur, Hyderabad'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div className="card" style={{ padding: '10px 16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Available Nearby</span>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--deep-forest-green)', margin: 0 }}>
                {stats.availableNearby || 0} Batches
              </p>
            </div>
            <div className="card" style={{ padding: '10px 16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ready for Pickup</span>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-orange)', margin: 0 }}>
                {stats.acceptedCount || 0} Orders
              </p>
            </div>
            <div className="card" style={{ padding: '10px 16px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Meals Received</span>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--bright-green)', margin: 0 }}>
                {stats.totalMealsReceived || 0}+
              </p>
            </div>
          </div>
        </div>

        {statusMessage && (
          <div
            style={{
              background: 'var(--forest-green-surface)',
              border: '1px solid var(--bright-green)',
              color: 'var(--deep-forest-green)',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: '24px',
            }}
          >
            {statusMessage}
          </div>
        )}

        {/* Accepted Donations: Ready For Pickup with QR Code & OTP! */}
        {data?.acceptedDonations && data.acceptedDonations.length > 0 && (
          <div
            style={{
              background: 'var(--warm-cream)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              border: '1.5px solid rgba(255, 138, 61, 0.4)',
              marginBottom: '32px',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <QrCode size={22} color="var(--primary-orange)" />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-forest-green)', margin: 0 }}>
                  Active Ready-For-Pickup Orders ({data.acceptedDonations.length})
                </h3>
              </div>
              <span className="badge badge-accepted">
                Donor Accepted
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              {data.acceptedDonations.map((req) => (
                <div
                  key={req._id}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--dark-text)' }}>
                      {req.donationId?.title || 'Surplus Meal Package'}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                      Donor: <strong>{req.donationId?.donorId?.organizationName || 'Paradise Biryani'}</strong>
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--primary-orange)', fontWeight: 700, margin: '4px 0 10px' }}>
                      Allocated Quantity: {req.requestedQuantity} {req.donationId?.quantityUnit || 'meals'}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      📍 Pickup Address: {req.donationId?.pickupAddress || 'Madhapur, Hyderabad'}
                    </p>
                  </div>

                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                      onClick={() => setSelectedRequestForOtp(req)}
                      className="btn-primary"
                      style={{ width: '100%', padding: '10px', fontSize: '0.88rem' }}
                    >
                      <QrCode size={16} /> View Pickup QR & OTP Code
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Requests List */}
        {data?.pendingRequests && data.pendingRequests.length > 0 && (
          <div className="card" style={{ padding: '20px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--primary-orange)" />
              My Pending Food Reservation Requests ({data.pendingRequests.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {data.pendingRequests.map((r) => (
                <div
                  key={r._id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: 'var(--cream-surface)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0 }}>
                      {r.donationId?.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                      Requested: {r.requestedQuantity} {r.donationId?.quantityUnit} • Placed {formatDateTime(r.createdAt)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="badge badge-pending">Pending Donor Approval</span>
                    <button
                      onClick={() => handleCancelRequest(r._id)}
                      className="btn-outline btn-sm"
                      style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Discovery & Search Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, donors, or areas..."
              className="form-input"
              style={{ paddingLeft: '36px', paddingRight: '12px', paddingBottom: '9px', paddingTop: '9px' }}
            />
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '100%' }}>
            {['All', 'Vegetarian', 'Non-Vegetarian', 'Bakery', 'Fruits', 'Vegetables', 'Dairy'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: categoryFilter === cat ? 'var(--deep-forest-green)' : '#FFFFFF',
                  color: categoryFilter === cat ? '#FFFFFF' : 'var(--dark-text)',
                  border: '1px solid var(--border-color)',
                  whiteSpace: 'nowrap',
                  transition: 'var(--transition)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Toggle & Sort Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Sort Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={15} color="var(--text-muted)" />
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="form-select"
                style={{ padding: '7px 12px', fontSize: '0.82rem' }}
              >
                <option value="match">✨ Best Match Score</option>
                <option value="nearest">📍 Nearest First</option>
                <option value="urgent">⏰ Most Urgent</option>
                <option value="quantity">📦 Most Quantity</option>
              </select>
            </div>

            {/* Grid vs Map Toggle */}
            <div style={{ display: 'flex', background: '#FFFFFF', padding: '3px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <button
                onClick={() => setViewMode('grid')}
                title="Grid Cards View"
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: viewMode === 'grid' ? 'var(--forest-green-surface)' : 'transparent',
                  color: viewMode === 'grid' ? 'var(--deep-forest-green)' : 'var(--text-muted)',
                }}
              >
                <LayoutGrid size={17} />
              </button>
              <button
                onClick={() => setViewMode('map')}
                title="Interactive Map View"
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: viewMode === 'map' ? 'var(--forest-green-surface)' : 'transparent',
                  color: viewMode === 'map' ? 'var(--deep-forest-green)' : 'var(--text-muted)',
                }}
              >
                <Map size={17} />
              </button>
            </div>
          </div>
        </div>

        {/* Listings Display: Grid or Interactive Map */}
        {viewMode === 'map' ? (
          <LiveMap
            donations={displayedDonations}
            onRequestClick={(d) => setSelectedDonationForRequest(d)}
          />
        ) : (
          displayedDonations.length === 0 ? (
            <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Compass size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <h3 style={{ fontSize: '1.1rem', margin: 0, color: 'var(--dark-text)' }}>
                No active listings match the selected filters.
              </h3>
              <p style={{ fontSize: '0.85rem', margin: '4px 0 16px' }}>
                Try resetting your food category filter or search keywords.
              </p>
              <button onClick={() => { setCategoryFilter('All'); setSearchQuery(''); }} className="btn-outline btn-sm">
                Reset All Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                gap: '24px',
              }}
            >
              {displayedDonations.map((donation) => (
                <FoodCard
                  key={donation._id}
                  donation={donation}
                  onRequestClick={(d) => setSelectedDonationForRequest(d)}
                  onMatchClick={(d) => setSelectedDonationForMatch(d)}
                />
              ))}
            </div>
          )
        )}

      </div>

      {/* Modals */}
      <RequestFoodModal
        isOpen={!!selectedDonationForRequest}
        onClose={() => setSelectedDonationForRequest(null)}
        donation={selectedDonationForRequest}
        onRequestSuccess={() => {
          setStatusMessage('Reservation placed! Donor notified in real-time.');
          loadRecipientData();
        }}
      />

      <MatchingBreakdownModal
        isOpen={!!selectedDonationForMatch}
        onClose={() => setSelectedDonationForMatch(null)}
        donation={selectedDonationForMatch}
      />

      <OtpVerificationModal
        isOpen={!!selectedRequestForOtp}
        onClose={() => setSelectedRequestForOtp(null)}
        request={selectedRequestForOtp}
        onVerificationComplete={() => {
          loadRecipientData();
        }}
      />
    </div>
  );
}
