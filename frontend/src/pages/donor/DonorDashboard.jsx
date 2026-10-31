import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  PlusCircle,
  TrendingUp,
  PackageCheck,
  Clock,
  HeartHandshake,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MapPin,
  UtensilsCrossed,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { formatDateTime, getTimeRemaining } from '../../utils/formatters';
import CreateDonationModal from '../../components/CreateDonationModal';
import OtpVerificationModal from '../../components/OtpVerificationModal';

export default function DonorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequestForOtp, setSelectedRequestForOtp] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const loadDonorData = async () => {
    try {
      const res = await api.getDonorDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load donor dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonorData();
  }, []);

  const handleAcceptRequest = async (requestId) => {
    setActionLoading(true);
    try {
      const res = await api.acceptRequest(requestId);
      if (res.success) {
        setStatusMessage('Request accepted! Verification OTP & QR code generated.');
        setTimeout(() => setStatusMessage(''), 4000);
        loadDonorData();
      }
    } catch (err) {
      alert(err.message || 'Failed to accept request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    const reason = prompt('Please provide reason for declining this request:', 'Capacity already committed');
    if (!reason) return;

    setActionLoading(true);
    try {
      const res = await api.rejectRequest(requestId, reason);
      if (res.success) {
        setStatusMessage('Request declined and food quantity restored to available surplus.');
        setTimeout(() => setStatusMessage(''), 4000);
        loadDonorData();
      }
    } catch (err) {
      alert(err.message || 'Failed to reject request.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading donor analytics & listings...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalDonations: 0,
    activeListings: 0,
    pendingRequestsCount: 0,
    completedDonations: 0,
    mealsRedistributed: 0,
  };

  const statCards = [
    { title: 'Total Donations', value: stats.totalDonations, icon: UtensilsCrossed, color: 'var(--deep-forest-green)', bg: 'var(--forest-green-surface)' },
    { title: 'Active Listings', value: stats.activeListings, icon: Clock, color: 'var(--primary-orange)', bg: 'var(--primary-orange-light)' },
    { title: 'Pending NGO Requests', value: stats.pendingRequestsCount, icon: HeartHandshake, color: '#DC2626', bg: '#FEE2E2' },
    { title: 'Completed Donations', value: stats.completedDonations, icon: PackageCheck, color: 'var(--bright-green)', bg: 'var(--bright-green-light)' },
    { title: 'Meals Redistributed', value: stats.mealsRedistributed, icon: TrendingUp, color: '#3B82F6', bg: '#EFF6FF' },
  ];

  return (
    <div style={{ padding: '40px 0 80px', background: 'var(--cream-surface)', minHeight: 'calc(100vh - 76px)' }}>
      <div className="container">
        
        {/* Top Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-veg">DONOR COMMAND CENTER</span>
              {user?.isVerified && <ShieldCheck size={16} color="var(--bright-green)" />}
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--deep-forest-green)', margin: '4px 0 2px' }}>
              {user?.organizationName || 'Paradise Biryani House'}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              {user?.address || 'Madhapur, Hitech City, Hyderabad'} • Rating {user?.rating || 4.9} ★
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary"
            style={{ padding: '14px 28px', fontSize: '1rem' }}
          >
            <PlusCircle size={20} />
            <span>Add Food Donation</span>
          </button>
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
              animation: 'modalEnter 0.2s ease',
            }}
          >
            {statusMessage}
          </div>
        )}

        {/* 5 Statistic Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {statCards.map((sc, i) => {
            const Icon = sc.icon;
            return (
              <div key={i} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    {sc.title}
                  </span>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: sc.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: sc.color }}>
                    <Icon size={18} />
                  </div>
                </div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dark-text)', margin: 0 }}>
                  {sc.value}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Two Columns: Incoming Requests & Monthly Chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '24px', marginBottom: '32px' }} className="donor-grid">
          
          {/* Incoming NGO Requests */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HeartHandshake size={20} color="var(--primary-orange)" />
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Incoming NGO Requests</h3>
              </div>
              <span className="badge badge-pending">
                {data?.incomingRequests?.length || 0} Pending
              </span>
            </div>

            {(!data?.incomingRequests || data.incomingRequests.length === 0) ? (
              <div style={{ padding: '36px 12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ margin: 0 }}>No pending reservation requests right now.</p>
                <span style={{ fontSize: '0.78rem' }}>When NGOs claim your surplus food, they will appear here for one-click approval.</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data.incomingRequests.map((req) => (
                  <div
                    key={req._id}
                    style={{
                      background: 'var(--warm-cream)',
                      border: '1px solid rgba(255, 138, 61, 0.25)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--deep-forest-green)' }}>
                          {req.recipientId?.organizationName || 'Akshaya Meals Foundation'}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                          Requested: <strong style={{ color: 'var(--primary-orange)' }}>{req.requestedQuantity} {req.donationId?.quantityUnit || 'meals'}</strong> of {req.donationId?.title}
                        </p>
                      </div>
                      <span className="badge badge-pending" style={{ fontSize: '0.7rem' }}>
                        PENDING
                      </span>
                    </div>

                    {req.notes && (
                      <p style={{ fontSize: '0.78rem', background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', color: 'var(--dark-text)', margin: '8px 0 12px' }}>
                        💬 Note: "{req.notes}"
                      </p>
                    )}

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleRejectRequest(req._id)}
                        className="btn-outline btn-sm"
                        style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                      >
                        <XCircle size={15} /> Decline
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={() => handleAcceptRequest(req._id)}
                        className="btn-primary btn-sm"
                      >
                        <CheckCircle2 size={15} /> Accept & Issue OTP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Monthly Trends Area Chart */}
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={20} color="var(--deep-forest-green)" />
                <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Monthly Redistribution Trend</h3>
              </div>
            </div>

            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.monthlyTrends || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="mealGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2ECE6" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#536B63' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#536B63' }} />
                  <Tooltip
                    contentStyle={{
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2ECE6',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="meals"
                    name="Meals Redistributed"
                    stroke="#166534"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#mealGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', margin: '8px 0 0' }}>
              Verified meals tracked from physical handover confirmations
            </p>
          </div>
        </div>

        {/* Active Food Listings Section */}
        <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>My Active & Recent Food Listings</h3>
            <button onClick={() => setIsCreateModalOpen(true)} className="btn-outline btn-sm">
              <PlusCircle size={15} /> Add New Listing
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            {data?.recentListings?.map((item) => {
              const deadline = getTimeRemaining(item.pickupEndTime);
              const remaining = Math.max(0, item.quantity - (item.reservedQuantity || 0));

              return (
                <div
                  key={item._id}
                  style={{
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    background: item.status === 'AVAILABLE' ? '#FFFFFF' : 'var(--cream-surface)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span className={`badge ${item.category === 'Vegetarian' ? 'badge-veg' : 'badge-nonveg'}`} style={{ fontSize: '0.68rem' }}>
                        {item.category}
                      </span>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '4px 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                        <Clock size={12} style={{ display: 'inline' }} /> {deadline.text}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
                    <span>
                      Available: <strong style={{ color: 'var(--primary-orange)' }}>{remaining}</strong> / {item.quantity} {item.quantityUnit}
                    </span>
                    <span className={`badge badge-${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Handover History */}
        {data?.history && data.history.length > 0 && (
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Completed Redistribution History</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 14px' }}>Food Title</th>
                    <th style={{ padding: '10px 14px' }}>Recipient NGO</th>
                    <th style={{ padding: '10px 14px' }}>Quantity Verified</th>
                    <th style={{ padding: '10px 14px' }}>Completed Date</th>
                    <th style={{ padding: '10px 14px' }}>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {data.history.map((h) => (
                    <tr key={h._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                        {h.donationId?.title || 'Surplus Food Batch'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {h.recipientId?.organizationName || 'Akshaya Meals Foundation'}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--primary-orange)', fontWeight: 700 }}>
                        {h.verifiedQuantity} {h.quantityUnit}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                        {formatDateTime(h.completedAt)}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {'★'.repeat(h.recipientRating || 5)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Create Listing Modal */}
      <CreateDonationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onListingCreated={(newListing) => {
          setStatusMessage(`Donation "${newListing.title}" published and broadcasted to local NGOs!`);
          loadDonorData();
        }}
      />

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={!!selectedRequestForOtp}
        onClose={() => setSelectedRequestForOtp(null)}
        request={selectedRequestForOtp}
        onVerificationComplete={() => {
          loadDonorData();
        }}
      />

      <style>{`
        @media (max-width: 900px) {
          .donor-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
