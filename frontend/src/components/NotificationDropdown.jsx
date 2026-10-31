import React from 'react';
import { useSocket } from '../context/SocketContext';
import { Bell, CheckCheck, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

export default function NotificationDropdown({ isOpen, onClose }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 12px)',
        right: 0,
        width: '360px',
        maxWidth: '92vw',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--border-color)',
        zIndex: 1100,
        overflow: 'hidden',
        animation: 'modalEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--cream-surface)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Bell size={18} color="var(--deep-forest-green)" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
            Notifications {unreadCount > 0 && <span style={{ color: 'var(--primary-orange)' }}>({unreadCount})</span>}
          </h4>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              fontSize: '0.75rem',
              color: 'var(--deep-forest-green)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '36px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Bell size={32} style={{ opacity: 0.3, marginBottom: '8px' }} />
            <p style={{ fontSize: '0.875rem' }}>No notifications right now.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => markAsRead(n._id)}
              style={{
                padding: '14px 18px',
                borderBottom: '1px solid var(--border-color)',
                cursor: 'pointer',
                background: n.isRead ? '#FFFFFF' : 'var(--warm-cream)',
                transition: 'background 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ marginTop: '2px' }}>
                  {n.type === 'REQUEST_ACCEPTED' || n.type === 'DONATION_COMPLETED' ? (
                    <CheckCircle size={16} color="var(--bright-green)" />
                  ) : n.type === 'REQUEST_REJECTED' ? (
                    <AlertCircle size={16} color="#DC2626" />
                  ) : (
                    <Clock size={16} color="var(--primary-orange)" />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--dark-text)', margin: 0 }}>
                      {n.title}
                    </p>
                    {!n.isRead && (
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: 'var(--primary-orange)',
                          display: 'inline-block',
                        }}
                      />
                    )}
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-light)', display: 'block', marginTop: '6px' }}>
                    {formatDateTime(n.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
