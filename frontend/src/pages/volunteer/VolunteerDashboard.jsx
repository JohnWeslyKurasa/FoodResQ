import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import OtpVerificationModal from '../../components/OtpVerificationModal';
import {
  Bike,
  MapPin,
  Clock,
  CheckCircle,
  QrCode,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Phone
} from 'lucide-react';
import { formatDateTime, getTimeRemaining } from '../../utils/formatters';

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTaskForVerification, setSelectedTaskForVerification] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  const loadVolunteerData = async () => {
    try {
      const res = await api.getVolunteerDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load volunteer data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVolunteerData();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading volunteer rescue route tasks...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    pendingTasksCount: 0,
    completedTasksCount: 0,
    totalMealsDelivered: 0,
  };

  const activeTasks = data?.activeTasks || [];
  const completedTasks = data?.completedTasks || [];

  return (
    <div style={{ padding: '40px 0 80px', background: 'var(--cream-surface)', minHeight: 'calc(100vh - 76px)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-veg">VOLUNTEER RESCUE AGENT</span>
              {user?.isVerified && <ShieldCheck size={16} color="var(--bright-green)" />}
            </div>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--deep-forest-green)', margin: '4px 0 2px' }}>
              {user?.name || 'Vikram Rao'}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
              Operating Base: {user?.address || 'Madhapur & Kondapur Hub, Hyderabad'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <div className="card" style={{ padding: '10px 18px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Tasks</span>
              <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-orange)', margin: 0 }}>
                {stats.pendingTasksCount} Pickups
              </p>
            </div>
            <div className="card" style={{ padding: '10px 18px', textAlign: 'center' }}>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Delivered</span>
              <p style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--bright-green)', margin: 0 }}>
                {stats.totalMealsDelivered} Meals
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

        {/* Active Rescue Assignments */}
        <div style={{ marginBottom: '36px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bike size={22} color="var(--primary-orange)" />
            Active Pickup & Delivery Tasks ({activeTasks.length})
          </h3>

          {activeTasks.length === 0 ? (
            <div className="card" style={{ padding: '48px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Bike size={38} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <p style={{ margin: 0, fontSize: '0.95rem' }}>No active pickup assignments right now.</p>
              <span style={{ fontSize: '0.8rem' }}>When donors accept surplus food requests, nearby pickup tasks appear here.</span>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              {activeTasks.map((task) => {
                const donation = task.donationId || {};
                const donor = donation.donorId || {};
                const recipient = task.recipientId || {};
                const deadline = getTimeRemaining(donation.pickupEndTime);

                return (
                  <div
                    key={task._id}
                    className="card"
                    style={{
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: '4px solid var(--primary-orange)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <span className={`badge ${donation.category === 'Vegetarian' ? 'badge-veg' : 'badge-nonveg'}`} style={{ fontSize: '0.68rem' }}>
                            {donation.category || 'Food Rescue'}
                          </span>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '4px 0 2px' }}>
                            {donation.title || 'Surplus Meal Package'}
                          </h4>
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--primary-orange)' }}>
                            📦 {task.requestedQuantity} {donation.quantityUnit || 'meals'} to transport
                          </span>
                        </div>
                        <span className="badge badge-accepted" style={{ fontSize: '0.7rem' }}>
                          READY FOR PICKUP
                        </span>
                      </div>

                      {/* Route Path: Pickup -> Dropoff */}
                      <div
                        style={{
                          background: 'var(--cream-surface)',
                          borderRadius: 'var(--radius-md)',
                          padding: '14px',
                          border: '1px solid var(--border-color)',
                          marginBottom: '16px',
                        }}
                      >
                        {/* 1. Pickup Origin */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary-orange)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                            A
                          </div>
                          <div>
                            <p style={{ fontSize: '0.78rem', fontWeight: 800, margin: 0, color: 'var(--dark-text)' }}>
                              PICKUP: {donor.organizationName || 'Paradise Biryani'}
                            </p>
                            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '1px 0' }}>
                              📍 {donation.pickupAddress || 'Plot 12, Hitech City, Madhapur'}
                            </p>
                            {donor.phone && (
                              <a href={`tel:${donor.phone}`} style={{ fontSize: '0.72rem', color: 'var(--deep-forest-green)', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '2px' }}>
                                <Phone size={11} /> Call Donor: {donor.phone}
                              </a>
                            )}
                          </div>
                        </div>

                        {/* 2. Destination */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--bright-green)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                            B
                          </div>
                          <div>
                            <p style={{ fontSize: '0.78rem', fontWeight: 800, margin: 0, color: 'var(--dark-text)' }}>
                              DROPOFF: {recipient.organizationName || 'Akshaya Meals Foundation'}
                            </p>
                            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '1px 0' }}>
                              📍 {recipient.address || 'Near RTO Office, Kondapur, Hyderabad'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pickup Deadline */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={13} color="#DC2626" /> Deadline: {deadline.text}
                        </span>
                        <span>
                          {donation.storageConditions || 'Room Temperature'}
                        </span>
                      </div>
                    </div>

                    {/* Action: Open Verification */}
                    <button
                      onClick={() => setSelectedTaskForVerification(task)}
                      className="btn-forest"
                      style={{ width: '100%', padding: '11px', fontSize: '0.9rem', gap: '8px' }}
                    >
                      <QrCode size={17} />
                      <span>Verify Handover with Single-Use OTP</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Completed Delivery History */}
        {completedTasks.length > 0 && (
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>My Completed Delivery Log</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '10px 14px' }}>Food Batch</th>
                    <th style={{ padding: '10px 14px' }}>Donor Origin</th>
                    <th style={{ padding: '10px 14px' }}>Destination NGO</th>
                    <th style={{ padding: '10px 14px' }}>Quantity</th>
                    <th style={{ padding: '10px 14px' }}>Delivered At</th>
                  </tr>
                </thead>
                <tbody>
                  {completedTasks.map((t) => (
                    <tr key={t._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 14px', fontWeight: 700 }}>
                        {t.donationId?.title || 'Surplus Meal Batch'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {t.donorId?.organizationName || 'Paradise Biryani'}
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        {t.recipientId?.organizationName || 'Akshaya Meals Foundation'}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--primary-orange)', fontWeight: 700 }}>
                        {t.verifiedQuantity} {t.quantityUnit || 'meals'}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                        {formatDateTime(t.completedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* OTP Verification Modal */}
      <OtpVerificationModal
        isOpen={!!selectedTaskForVerification}
        onClose={() => setSelectedTaskForVerification(null)}
        request={selectedTaskForVerification}
        onVerificationComplete={() => {
          setStatusMessage('Delivery successfully recorded in the verified social impact ledger!');
          loadVolunteerData();
        }}
      />
    </div>
  );
}
