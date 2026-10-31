import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Users,
  UtensilsCrossed,
  HeartHandshake,
  AlertOctagon,
  CheckCircle,
  XCircle,
  Trash2,
  RefreshCw,
  Search,
  SlidersHorizontal,
  FileText
} from 'lucide-react';
import { formatDateTime } from '../../utils/formatters';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // 'users', 'listings', 'reports'
  const [usersList, setUsersList] = useState([]);
  const [listingsList, setListingsList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState('');
  const [reseedLoading, setReseedLoading] = useState(false);

  const loadAdminData = async () => {
    try {
      const [sRes, uRes, lRes, rRes] = await Promise.all([
        api.getAdminStats(),
        api.getAdminUsers(),
        api.getAdminListings(),
        api.getAdminReports(),
      ]);

      if (sRes.success) setStats(sRes.stats);
      if (uRes.success) setUsersList(uRes.users);
      if (lRes.success) setListingsList(lRes.listings);
      if (rRes.success) setReportsList(rRes.reports);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleVerify = async (userId, currentStatus) => {
    try {
      const res = await api.verifyUser(userId, !currentStatus);
      if (res.success) {
        setStatusMessage(res.message);
        setTimeout(() => setStatusMessage(''), 4000);
        loadAdminData();
      }
    } catch (err) {
      alert(err.message || 'Error updating verification status.');
    }
  };

  const handleToggleSuspend = async (userId, currentStatus) => {
    if (!window.confirm(`Are you sure you want to ${currentStatus ? 'activate' : 'suspend'} this account?`)) return;
    try {
      const res = await api.suspendUser(userId, !currentStatus);
      if (res.success) {
        setStatusMessage(res.message);
        setTimeout(() => setStatusMessage(''), 4000);
        loadAdminData();
      }
    } catch (err) {
      alert(err.message || 'Error updating account suspension.');
    }
  };

  const handleModerateListing = async (listingId) => {
    if (!window.confirm('Are you sure you want to remove this food listing under platform moderation?')) return;
    try {
      const res = await api.moderateListing(listingId);
      if (res.success) {
        setStatusMessage('Listing cancelled by administrator moderation.');
        setTimeout(() => setStatusMessage(''), 4000);
        loadAdminData();
      }
    } catch (err) {
      alert(err.message || 'Failed to moderate listing.');
    }
  };

  const handleResolveReport = async (reportId) => {
    const note = prompt('Enter resolution remarks for this report:', 'Investigated and verified compliance with food handling protocols.');
    if (!note) return;

    try {
      const res = await api.resolveReport(reportId, { status: 'RESOLVED', adminResolutionNote: note });
      if (res.success) {
        setStatusMessage('Report resolved successfully.');
        setTimeout(() => setStatusMessage(''), 4000);
        loadAdminData();
      }
    } catch (err) {
      alert(err.message || 'Failed to resolve report.');
    }
  };

  const handleResetDatabase = async () => {
    if (!window.confirm('Reset database and re-seed all Hyderabad sample listings, requests, and metrics?')) return;
    setReseedLoading(true);
    try {
      const res = await api.resetDatabase();
      if (res.success) {
        setStatusMessage('Database reset & seeded with clean Hyderabad sample data!');
        setTimeout(() => setStatusMessage(''), 4000);
        loadAdminData();
      }
    } catch (err) {
      alert(err.message || 'Failed to reset database.');
    } finally {
      setReseedLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading administrator controls...</p>
      </div>
    );
  }

  const statBoxes = [
    { label: 'Registered Users', val: stats?.totalUsers || 0, icon: Users, color: 'var(--deep-forest-green)' },
    { label: 'Active Donors', val: stats?.totalDonors || 0, icon: UtensilsCrossed, color: 'var(--primary-orange)' },
    { label: 'Partner NGOs', val: stats?.totalNgos || 0, icon: HeartHandshake, color: 'var(--bright-green)' },
    { label: 'Total Listings', val: stats?.totalDonations || 0, icon: FileText, color: '#3B82F6' },
    { label: 'Completed Deliveries', val: stats?.completedDonations || 0, icon: CheckCircle, color: 'var(--deep-forest-green)' },
    { label: 'Pending Reports', val: stats?.pendingReports || 0, icon: AlertOctagon, color: '#DC2626' },
  ];

  return (
    <div style={{ padding: '40px 0 80px', background: 'var(--cream-surface)', minHeight: 'calc(100vh - 76px)' }}>
      <div className="container">
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-accepted">PLATFORM MODERATION & TRUST</span>
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--deep-forest-green)', margin: '4px 0 2px' }}>
              FoodResQ Administration Portal
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Platform Administrator: {user?.name || 'Rohan Varma'} • All actions audit-logged
            </p>
          </div>

          {/* Quick Reseed Action */}
          <button
            onClick={handleResetDatabase}
            disabled={reseedLoading}
            className="btn-outline btn-sm"
            style={{ gap: '6px', background: '#FFFFFF' }}
          >
            <RefreshCw size={15} className={reseedLoading ? 'spin' : ''} />
            <span>{reseedLoading ? 'Re-seeding...' : 'Reset & Re-seed Sample Data'}</span>
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

        {/* 6 Stats Counters */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {statBoxes.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
                  <Icon size={16} color={s.color} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: s.color }}>
                  {s.val}
                </h3>
              </div>
            );
          })}
        </div>

        {/* Section Tabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            marginBottom: '20px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '8px',
          }}
        >
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: activeTab === 'users' ? 'var(--deep-forest-green)' : 'transparent',
              color: activeTab === 'users' ? '#FFFFFF' : 'var(--dark-text)',
              transition: 'var(--transition)',
            }}
          >
            User & Organization Verification ({usersList.length})
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: activeTab === 'listings' ? 'var(--deep-forest-green)' : 'transparent',
              color: activeTab === 'listings' ? '#FFFFFF' : 'var(--dark-text)',
              transition: 'var(--transition)',
            }}
          >
            Food Listing Moderation ({listingsList.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            style={{
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.88rem',
              fontWeight: 700,
              background: activeTab === 'reports' ? 'var(--deep-forest-green)' : 'transparent',
              color: activeTab === 'reports' ? '#FFFFFF' : 'var(--dark-text)',
              transition: 'var(--transition)',
            }}
          >
            Community Safety Reports ({reportsList.length})
          </button>
        </div>

        {/* Tab 1: Users & Verification */}
        {activeTab === 'users' && (
          <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 14px' }}>Name / Org</th>
                  <th style={{ padding: '10px 14px' }}>Email & Phone</th>
                  <th style={{ padding: '10px 14px' }}>Role & Type</th>
                  <th style={{ padding: '10px 14px' }}>Location</th>
                  <th style={{ padding: '10px 14px' }}>Verification Status</th>
                  <th style={{ padding: '10px 14px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <p style={{ fontWeight: 700, margin: 0, color: 'var(--dark-text)' }}>
                        {u.organizationName || u.name}
                      </p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contact: {u.name}</span>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                      <div>{u.email}</div>
                      <div style={{ fontSize: '0.75rem' }}>{u.phone}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className="badge badge-available" style={{ fontSize: '0.7rem' }}>
                        {u.role.toUpperCase()}
                      </span>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {u.organizationType}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '200px' }}>
                      {u.address}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {u.isVerified ? (
                        <span style={{ color: 'var(--bright-green)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <ShieldCheck size={16} /> Verified
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Unverified</span>
                      )}
                      {u.isSuspended && (
                        <div style={{ color: '#DC2626', fontWeight: 700, fontSize: '0.75rem', marginTop: '2px' }}>
                          ⚠️ SUSPENDED
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleToggleVerify(u._id, u.isVerified)}
                          className="btn-outline btn-sm"
                          style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                        >
                          {u.isVerified ? 'Revoke Verification' : 'Verify Org'}
                        </button>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleSuspend(u._id, u.isSuspended)}
                            className="btn-outline btn-sm"
                            style={{
                              padding: '5px 10px',
                              fontSize: '0.75rem',
                              color: u.isSuspended ? 'var(--bright-green)' : '#DC2626',
                              borderColor: u.isSuspended ? 'var(--bright-green)' : '#FCA5A5',
                            }}
                          >
                            {u.isSuspended ? 'Activate' : 'Suspend'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Listings Moderation */}
        {activeTab === 'listings' && (
          <div className="card" style={{ padding: '24px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '10px 14px' }}>Listing Title</th>
                  <th style={{ padding: '10px 14px' }}>Donor</th>
                  <th style={{ padding: '10px 14px' }}>Quantity</th>
                  <th style={{ padding: '10px 14px' }}>Status</th>
                  <th style={{ padding: '10px 14px' }}>Created</th>
                  <th style={{ padding: '10px 14px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {listingsList.map((item) => (
                  <tr key={item._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={item.imageUrl} alt={item.title} style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }} />
                        <div>
                          <p style={{ fontWeight: 700, margin: 0 }}>{item.title}</p>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>{item.category}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {item.donorId?.organizationName || 'Paradise Biryani'}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--primary-orange)' }}>
                      {item.quantity} {item.quantityUnit}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge badge-${item.status.toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                      {formatDateTime(item.createdAt)}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {item.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleModerateListing(item._id)}
                          className="btn-outline btn-sm"
                          style={{ color: '#DC2626', borderColor: '#FCA5A5', padding: '5px 10px', fontSize: '0.75rem' }}
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Reports */}
        {activeTab === 'reports' && (
          <div className="card" style={{ padding: '24px' }}>
            {reportsList.length === 0 ? (
              <div style={{ padding: '36px 12px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <CheckCircle size={36} color="var(--bright-green)" style={{ marginBottom: '8px' }} />
                <p style={{ margin: 0 }}>Zero open reports or disputes across the network.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reportsList.map((rep) => (
                  <div
                    key={rep._id}
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      background: rep.status === 'PENDING' ? 'var(--warm-cream)' : '#FFFFFF',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span className="badge badge-urgent" style={{ fontSize: '0.7rem' }}>
                          {rep.targetType} REPORT
                        </span>
                        <h4 style={{ fontSize: '0.96rem', fontWeight: 700, margin: '4px 0 2px' }}>
                          Reason: {rep.reason}
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                          Reported by: {rep.reportedBy?.name || 'Anonymous User'} ({rep.reportedBy?.email || 'N/A'})
                        </p>
                      </div>
                      <span className={`badge badge-${rep.status === 'RESOLVED' ? 'available' : 'pending'}`}>
                        {rep.status}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', background: '#FFFFFF', padding: '10px', borderRadius: '6px', margin: '8px 0', border: '1px solid var(--border-color)' }}>
                      "{rep.details || 'No additional details submitted.'}"
                    </p>

                    {rep.status === 'PENDING' ? (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button
                          onClick={() => handleResolveReport(rep._id)}
                          className="btn-primary btn-sm"
                        >
                          <CheckCircle size={14} /> Resolve & Record Admin Action
                        </button>
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.76rem', color: 'var(--deep-forest-green)', fontWeight: 600, margin: '6px 0 0' }}>
                        ✓ Resolved: {rep.adminResolutionNote} ({formatDateTime(rep.resolvedAt)})
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
