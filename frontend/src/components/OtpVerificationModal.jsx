import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  X,
  QrCode,
  KeyRound,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Star,
  Bike,
  Building,
  HeartHandshake
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OtpVerificationModal({ isOpen, onClose, request, onVerificationComplete }) {
  const { user } = useAuth();
  const [otpInput, setOtpInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedStep, setVerifiedStep] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');

  if (!isOpen || !request) return null;

  const isRecipient = user?.role === 'recipient';
  const isVolunteer = user?.role === 'volunteer';
  const isDonor = user?.role === 'donor';
  const isAdmin = user?.role === 'admin';

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP provided by the recipient.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.verifyPickupOtp(request._id, otpInput.trim());
      if (res.success) {
        setVerifiedStep(true);
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCompletion = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.confirmPickupDelivery(request._id, {
        donorRating: rating,
        recipientRating: rating,
        notes: notes || 'Food delivery successfully verified with single-use OTP.',
      });

      if (res.success) {
        setCompleted(true);
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#22C55E', '#FF8A3D', '#FACC15', '#0F5132'],
        });
        setTimeout(() => {
          if (onVerificationComplete) onVerificationComplete(res.request);
          onClose();
        }, 2200);
      }
    } catch (err) {
      setError(err.message || 'Failed to complete delivery.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '28px', maxWidth: '520px' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: isRecipient ? 'var(--bright-green-light)' : 'var(--primary-orange-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isRecipient ? <QrCode size={20} color="var(--bright-green)" /> : <Bike size={20} color="var(--primary-orange)" />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--deep-forest-green)' }}>
                {isRecipient ? 'Recipient Authorization Pass' : 'Volunteer Delivery Verification'}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                {isRecipient ? 'Verified Single-Use Token for Arriving Volunteer' : 'Verify Recipient Code at Physical Handover'}
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
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 1. COMPLETED SUCCESS STATE */}
        {completed ? (
          <div style={{ textAlign: 'center', padding: '36px 12px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                background: 'var(--forest-green-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}
            >
              <CheckCircle size={40} color="var(--bright-green)" />
            </div>
            <h3 style={{ fontSize: '1.35rem', color: 'var(--deep-forest-green)', marginBottom: '8px' }}>
              Handover Verified & Completed!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {request.requestedQuantity || 50} meals verified and added to the platform impact ledger. Excellent work!
            </p>
          </div>
        ) : verifiedStep ? (
          /* 2. RATING & REMARKS STEP (VOLUNTEER POST-VERIFICATION) */
          <div>
            <div
              style={{
                background: 'var(--forest-green-surface)',
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <CheckCircle size={24} color="var(--bright-green)" />
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: 'var(--deep-forest-green)' }}>
                  Recipient OTP Authenticated!
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Handover identity confirmed. Submit remarks to finalize delivery.
                </p>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
                {error}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '14px' }}>
              <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Rate Handover Experience</label>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <Star
                      size={24}
                      fill={star <= rating ? 'var(--golden-yellow)' : 'none'}
                      color={star <= rating ? 'var(--golden-yellow)' : '#CBD5E1'}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}>
              <label className="form-label" style={{ fontSize: '0.82rem', fontWeight: 700 }}>Volunteer Delivery Remarks</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Delivered 80 warm meal containers safely to shelter."
                className="form-input"
                style={{ fontSize: '0.88rem' }}
              />
            </div>

            <button
              onClick={handleConfirmCompletion}
              disabled={loading}
              className="btn-forest"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700 }}
            >
              {loading ? 'Recording Impact...' : 'Confirm Delivery & Record Impact'}
            </button>
          </div>
        ) : isRecipient ? (
          /* ========================================================
             3. RECIPIENT NGO VIEW: ONLY SHOWS QR + 6-DIGIT OTP PASS
             (Recipient DOES NOT verify; they show it to volunteer)
             ======================================================== */
          <div>
            <div
              style={{
                background: 'var(--warm-cream)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 20px',
                textAlign: 'center',
                border: '1.5px solid rgba(255, 138, 61, 0.4)',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 138, 61, 0.15)', padding: '4px 12px', borderRadius: 'var(--radius-full)', marginBottom: '12px' }}>
                <ShieldCheck size={14} color="var(--primary-orange)" />
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--deep-forest-green)', textTransform: 'uppercase' }}>
                  Show to Volunteer Upon Arrival
                </span>
              </div>

              {/* QR Code */}
              {request.qrPayload ? (
                <div style={{ margin: '10px auto', display: 'inline-block', padding: '10px', background: '#FFFFFF', borderRadius: '14px', boxShadow: 'var(--shadow-md)' }}>
                  <img src={request.qrPayload} alt="Pickup QR Code" style={{ width: '170px', height: '170px', display: 'block' }} />
                </div>
              ) : (
                <div style={{ padding: '24px', color: 'var(--text-muted)' }}>
                  QR payload not loaded.
                </div>
              )}

              {/* 6-Digit Numerical OTP */}
              <div style={{ marginTop: '10px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Or share this 6-digit confirmation code with the volunteer:
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    background: '#FFFFFF',
                    border: '2px dashed var(--primary-orange)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 24px',
                    fontSize: '1.9rem',
                    fontWeight: 900,
                    letterSpacing: '6px',
                    color: 'var(--deep-forest-green)',
                  }}
                >
                  {request.rawOtp || '492815'}
                </div>
              </div>
            </div>

            {/* Instruction Notice for Recipient */}
            <div
              style={{
                background: 'var(--forest-green-surface)',
                border: '1px solid rgba(15, 81, 50, 0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <Clock size={18} color="var(--deep-forest-green)" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.8rem', color: 'var(--deep-forest-green)', margin: 0, lineHeight: 1.4 }}>
                <strong>Awaiting Volunteer Verification:</strong> The assigned volunteer will arrive at your facility and enter this OTP code into their app to complete the verified transfer.
              </p>
            </div>
          </div>
        ) : (
          /* ========================================================
             4. VOLUNTEER (OR DONOR/ADMIN) VIEW: VERIFIES THE OTP
             ======================================================== */
          <div>
            {/* Handover Details Summary */}
            <div
              style={{
                background: 'var(--cream-surface)',
                borderRadius: 'var(--radius-md)',
                padding: '14px',
                border: '1px solid var(--border-color)',
                marginBottom: '18px',
                fontSize: '0.82rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Food Package:</span>
                <strong style={{ color: 'var(--deep-forest-green)' }}>{request.donationId?.title || 'Surplus Meal Package'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Portions:</span>
                <strong style={{ color: 'var(--primary-orange)' }}>{request.requestedQuantity || 50} meals</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Delivering To:</span>
                <strong style={{ color: 'var(--deep-forest-green)' }}>{request.recipientId?.organizationName || 'Akshaya Meals Foundation'}</strong>
              </div>
            </div>

            {/* OTP Entry Form for Volunteer */}
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700 }}>
                  <KeyRound size={16} color="var(--primary-orange)" />
                  Enter Recipient NGO's 6-Digit OTP Code
                </label>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '2px 0 8px' }}>
                  Ask the recipient shelter or NGO representative to show their 6-digit confirmation code.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    maxLength="6"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="form-input"
                    style={{ fontSize: '1.3rem', letterSpacing: '4px', textAlign: 'center', fontWeight: 800, padding: '10px' }}
                    autoFocus
                  />
                  {/* Demo Helper Button */}
                  {request.rawOtp && (
                    <button
                      type="button"
                      onClick={() => setOtpInput(request.rawOtp)}
                      className="btn-outline btn-sm"
                      style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}
                      title="Auto-fill code for hackathon demonstration"
                    >
                      Fill Demo OTP
                    </button>
                  )}
                </div>
              </div>

              {error && (
                <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', padding: '13px', fontSize: '0.98rem', fontWeight: 700 }}
              >
                {loading ? 'Authenticating Code...' : 'Verify OTP & Complete Delivery'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
