import React, { useState } from 'react';
import { api } from '../services/api';
import { X, Heart, ShieldAlert, Clock, MapPin, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RequestFoodModal({ isOpen, onClose, donation, onRequestSuccess }) {
  const [requestedQuantity, setRequestedQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !donation) return null;

  const remaining = donation.remainingQuantity !== undefined
    ? donation.remainingQuantity
    : Math.max(0, donation.quantity - (donation.reservedQuantity || 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (requestedQuantity <= 0) {
      setError('Please request at least 1 unit.');
      return;
    }

    if (requestedQuantity > remaining) {
      setError(`Cannot exceed remaining available quantity (${remaining} ${donation.quantityUnit}).`);
      return;
    }

    setLoading(true);
    try {
      const res = await api.createRequest({
        donationId: donation._id,
        requestedQuantity: Number(requestedQuantity),
        notes,
      });

      if (res.success) {
        setSubmitted(true);
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FF8A3D', '#22C55E', '#FACC15', '#0F5132'],
        });
        setTimeout(() => {
          if (onRequestSuccess) onRequestSuccess(res.request);
          handleClose();
        }, 1800);
      }
    } catch (err) {
      setError(err.message || 'Failed to place food request. Inventory might have changed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setError('');
    setRequestedQuantity(1);
    setNotes('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '28px', maxWidth: '520px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--warm-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Heart size={20} color="var(--primary-orange)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Request Surplus Food</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Direct reservation for verified NGOs & shelters
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
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

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '36px 12px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'var(--forest-green-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle size={36} color="var(--bright-green)" />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-forest-green)', marginBottom: '8px' }}>
              Request Sent to Donor!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {donation.donorId?.organizationName || 'The donor'} has received your request for {requestedQuantity} {donation.quantityUnit}. You will receive a real-time notification with your pickup OTP once accepted.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Listing Summary Preview */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                background: 'var(--cream-surface)',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                marginBottom: '18px',
              }}
            >
              <img
                src={donation.imageUrl}
                alt={donation.title}
                style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className={`badge ${donation.category === 'Vegetarian' ? 'badge-veg' : 'badge-nonveg'}`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                  {donation.category}
                </span>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {donation.title}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Available: <strong style={{ color: 'var(--primary-orange)' }}>{remaining} {donation.quantityUnit}</strong>
                </p>
              </div>
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

            {/* Requested Quantity Input */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Requested Quantity ({donation.quantityUnit}) *
                </label>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Max available: {remaining}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input
                  type="number"
                  min="1"
                  max={remaining}
                  value={requestedQuantity}
                  onChange={(e) => setRequestedQuantity(Math.max(1, Math.min(remaining, Number(e.target.value))))}
                  className="form-input"
                  style={{ fontSize: '1.1rem', fontWeight: 700 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setRequestedQuantity(remaining)}
                  className="btn-outline btn-sm"
                  style={{ whiteSpace: 'nowrap' }}
                >
                  Take All ({remaining})
                </button>
              </div>
            </div>

            {/* Notes to Donor */}
            <div className="form-group">
              <label className="form-label">
                Distribution Purpose & Note to Donor (Optional)
              </label>
              <textarea
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. For our evening shelter dinner service in Kondapur. We have insulated transport boxes ready."
                className="form-textarea"
                style={{ resize: 'none' }}
              />
            </div>

            {/* Disclaimer & Pickup Alert */}
            <div
              style={{
                background: 'var(--forest-green-surface)',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                gap: '10px',
                fontSize: '0.78rem',
                color: 'var(--deep-forest-green)',
                marginBottom: '20px',
              }}
            >
              <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Pickup Commitment:</strong> Upon donor acceptance, your organization is responsible for timely collection before pickup expiration. Single-use OTP will be required during collection handover.
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleClose} className="btn-outline">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? 'Submitting Reservation...' : `Confirm Request for ${requestedQuantity} ${donation.quantityUnit}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
