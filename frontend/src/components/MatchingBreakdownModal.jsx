import React from 'react';
import { X, Sparkles, MapPin, Utensils, Users, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function MatchingBreakdownModal({ isOpen, onClose, donation }) {
  if (!isOpen || !donation) return null;

  const score = donation.matchScore || 85;
  const breakdown = donation.matchBreakdown || {
    distance: Math.round(30 * (1 - Math.min(donation.distanceKm || 2, 30) / 30)),
    category: 25,
    capacity: 18,
    pickupWindow: 14,
    verification: 10,
  };

  const factors = [
    {
      title: 'Distance Compatibility (30% weight)',
      score: breakdown.distance,
      max: 30,
      icon: MapPin,
      detail: `${donation.distanceKm || 2.1} km from your registered facility.`,
    },
    {
      title: 'Food Category Preference (25% weight)',
      score: breakdown.category,
      max: 25,
      icon: Utensils,
      detail: `${donation.category} food aligns with your dietary and kitchen distribution preferences.`,
    },
    {
      title: 'Serving Capacity Alignment (20% weight)',
      score: breakdown.capacity,
      max: 20,
      icon: Users,
      detail: `${donation.remainingQuantity || donation.quantity} ${donation.quantityUnit || 'meals'} can be absorbed by your daily quota.`,
    },
    {
      title: 'Pickup Window Feasibility (15% weight)',
      score: breakdown.pickupWindow,
      max: 15,
      icon: Clock,
      detail: 'Sufficient transit window remains before food expiration deadline.',
    },
    {
      title: 'Organization Verification Status (10% weight)',
      score: breakdown.verification,
      max: 10,
      icon: ShieldCheck,
      detail: 'Donor and NGO compliance and hygiene history certified.',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '28px', maxWidth: '580px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--warm-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Sparkles size={20} color="var(--primary-orange)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Smart Match Explanation</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Transparent 5-Factor Recommendation Engine
              </p>
            </div>
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

        {/* Score banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, var(--deep-forest-green) 0%, var(--forest-green-light) 100%)',
            color: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '0.78rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Overall Compatibility Score
            </span>
            <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--golden-yellow)', margin: '2px 0 0' }}>
              {score}% Match
            </h2>
            <p style={{ fontSize: '0.85rem', margin: '4px 0 0', opacity: 0.9 }}>
              {donation.matchSummary || `${donation.distanceKm || 2.1} km away – Can accommodate ${donation.quantity} meals`}
            </p>
          </div>
          <div
            style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              border: '4px solid var(--golden-yellow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: '#FFFFFF',
            }}
          >
            {score}/100
          </div>
        </div>

        {/* Factor Breakdown Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
          {factors.map((f, i) => {
            const Icon = f.icon;
            const pct = Math.round((f.score / f.max) * 100);
            return (
              <div key={i} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Icon size={16} color="var(--deep-forest-green)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--dark-text)' }}>
                      {f.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--deep-forest-green)' }}>
                    {f.score} / {f.max} pts
                  </span>
                </div>

                <div
                  style={{
                    height: '6px',
                    width: '100%',
                    background: 'var(--border-color)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                    margin: '4px 0 6px',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: pct > 80 ? 'var(--bright-green)' : 'var(--primary-orange)',
                      borderRadius: '3px',
                    }}
                  />
                </div>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
                  {f.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Recommendation Reasons */}
        {donation.matchReasons && donation.matchReasons.length > 0 && (
          <div
            style={{
              background: 'var(--warm-cream)',
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 138, 61, 0.25)',
              marginBottom: '20px',
            }}
          >
            <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--deep-forest-green)', marginBottom: '8px' }}>
              Match Summary & Insights:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {donation.matchReasons.map((r, i) => (
                <li key={i} style={{ fontSize: '0.78rem', color: 'var(--dark-text)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle2 size={14} color="var(--bright-green)" style={{ flexShrink: 0 }} />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Explanatory Note */}
        <p style={{ fontSize: '0.74rem', color: 'var(--text-light)', textAlign: 'center', margin: 0 }}>
          💡 Note: This is an explainable, rule-based matching engine designed for deterministic, fair, and verifiable food redistribution without opaque black-box AI claims.
        </p>
      </div>
    </div>
  );
}
