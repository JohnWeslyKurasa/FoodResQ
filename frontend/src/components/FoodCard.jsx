import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  MapPin,
  Clock,
  Sparkles,
  Info,
  ShieldCheck,
  Star,
  ChevronDown,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { getTimeRemaining, formatDistance, getCategoryBadgeClass } from '../utils/formatters';

export default function FoodCard({ donation, onRequestClick, onMatchClick, onDetailsClick }) {
  const { user } = useAuth();
  const [showHandling, setShowHandling] = useState(false);

  const remaining = donation.remainingQuantity !== undefined
    ? donation.remainingQuantity
    : Math.max(0, donation.quantity - (donation.reservedQuantity || 0));

  const deadline = getTimeRemaining(donation.pickupEndTime);
  const donor = donation.donorId || {};
  const isDonorUser = user?.role === 'donor';

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        height: '100%',
        position: 'relative',
        transition: 'var(--transition)',
      }}
    >
      {/* Food Image with overlays */}
      <div style={{ position: 'relative', height: '190px', width: '100%', overflow: 'hidden' }}>
        <img
          src={donation.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
          alt={donation.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />

        {/* Category Badge */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
          <span className={`badge ${getCategoryBadgeClass(donation.category)}`} style={{ boxShadow: 'var(--shadow-sm)' }}>
            {donation.category}
          </span>
          {deadline.isUrgent && (
            <span className="badge badge-urgent" style={{ boxShadow: 'var(--shadow-sm)' }}>
              ⚡ {deadline.text}
            </span>
          )}
        </div>

        {/* Smart Match Score Badge (if scored) */}
        {donation.matchScore && (
          <button
            onClick={() => onMatchClick && onMatchClick(donation)}
            title="Click to view explainable matching score breakdown"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(15, 81, 50, 0.92)',
              backdropFilter: 'blur(6px)',
              color: 'var(--golden-yellow)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <Sparkles size={13} />
            <span>{donation.matchScore}% Match</span>
          </button>
        )}

        {/* Remaining Quantity Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(4px)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.76rem',
            fontWeight: 700,
            color: 'var(--deep-forest-green)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {remaining} {donation.quantityUnit || 'meals'} available
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title */}
        <h3
          style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: 'var(--dark-text)',
            marginBottom: '6px',
            lineHeight: 1.35,
          }}
        >
          {donation.title}
        </h3>

        {/* Description snippet */}
        <p
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
            marginBottom: '14px',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {donation.description}
        </p>

        {/* Donor Organization & Distance */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--dark-text)',
            marginBottom: '10px',
            paddingBottom: '10px',
            borderBottom: '1px solid var(--border-color)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
            <span style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {donor.organizationName || donor.name || 'Verified Donor'}
            </span>
            {donor.isVerified && <ShieldCheck size={14} color="var(--bright-green)" />}
          </div>
          <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
            <MapPin size={13} color="var(--primary-orange)" /> {donation.distanceKm ? formatDistance(donation.distanceKm) : 'Nearby'}
          </span>
        </div>

        {/* Pickup Timeline */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={13} /> {deadline.text}
          </span>
          <span style={{ fontSize: '0.74rem', background: 'var(--cream-surface)', padding: '2px 8px', borderRadius: '4px' }}>
            {donation.storageConditions || 'Room Temp'}
          </span>
        </div>

        {/* Handling & Allergen Expandable drawer */}
        {showHandling && (
          <div
            style={{
              background: 'var(--warm-cream)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 12px',
              fontSize: '0.76rem',
              color: 'var(--deep-forest-green)',
              marginBottom: '14px',
              animation: 'modalEnter 0.2s ease',
            }}
          >
            <p style={{ margin: '0 0 4px', fontWeight: 700 }}>
              🛡️ Handling: {donation.handlingInstructions || 'Keep sealed in food containers.'}
            </p>
            <p style={{ margin: 0 }}>
              ⚠️ Allergens: {Array.isArray(donation.allergenInfo) ? donation.allergenInfo.join(', ') : (donation.allergenInfo || 'None specified')}
            </p>
          </div>
        )}

        {/* Footer actions */}
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setShowHandling(!showHandling)}
            title="Toggle Handling Guidelines"
            style={{
              padding: '9px 12px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--cream-surface)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Info size={14} />
            <ChevronDown size={12} style={{ transform: showHandling ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          <button
            type="button"
            disabled={remaining <= 0}
            onClick={() => onRequestClick(donation)}
            className="btn-primary"
            style={{
              flex: 1,
              padding: '9px 14px',
              fontSize: '0.85rem',
              opacity: remaining <= 0 ? 0.5 : 1,
            }}
          >
            <span>{remaining <= 0 ? 'Fully Reserved' : 'Request Food'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
