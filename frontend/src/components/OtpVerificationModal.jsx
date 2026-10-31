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
  Star
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

  const isRecipient = user?.role === 'recipient' && request.recipientId?._id === user?._id;
  const isDonorOrVolunteer = user?.role === 'donor' || user?.role === 'volunteer' || user?.role === 'admin';

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otpInput || otpInput.trim().length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
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
        notes: notes || 'Food handover successfully verified and delivered.',
      });

      if (res.success) {
        setCompleted(true);
        confetti({
          particleCount: 80,
          spread: 70,
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--forest-green-surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QrCode size={20} color="var(--deep-forest-green)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Pickup Verification</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                Cryptographic Single-Use OTP & QR Protocol
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
              Rescue Verified & Completed!
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {request.requestedQuantity} meals recorded in the verified social impact ledger. Thank you for feeding lives!
            </p>
          </div>
        ) : verifiedStep ? (
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
                  OTP Successfully Verified!
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Handover identity authenticated. Confirm final transfer of food containers.
                </p>
              </div>
            </div>

            {error && (
              <div style={{ background: '#FEF2F2', color: '#991B1B', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Rate Handover Experience</label>
              <div style={{ display: 'flex', gap: '8px' }}>
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

            <div className="form-group">
              <label className="form-label">Handover Confirmation Remarks</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. 50 warm meal trays collected in pristine condition."
                className="form-input"
              />
            </div>

            <button
              onClick={handleConfirmCompletion}
              disabled={loading}
              className="btn-forest"
              style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
            >
              {loading ? 'Recording Impact...' : 'Confirm Delivery & Update History'}
            </button>
          </div>
        ) : (
          <div>
            {/* Display for Recipient NGO: Shows QR & OTP */}
            <div
              style={{
                background: 'var(--warm-cream)',
                borderRadius: 'var(--radius-lg)',
                padding: '24px 20px',
                textAlign: 'center',
                border: '1px solid rgba(255, 138, 61, 0.3)',
                marginBottom: '20px',
              }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--deep-forest-green)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Pickup Verification Token
              </span>

              {/* QR Code */}
              {request.qrPayload ? (
                <div style={{ margin: '14px auto', display: 'inline-block', padding: '10px', background: '#FFFFFF', borderRadius: '14px', boxShadow: 'var(--shadow-md)' }}>
                  <img src={request.qrPayload} alt="Pickup QR Code" style={{ width: '180px', height: '180px', display: 'block' }} />
                </div>
              ) : (
                <div style={{ padding: '24px', color: 'var(--text-muted)' }}>
                  QR payload not loaded.
                </div>
              )}

              {/* 6-Digit Numerical OTP */}
              <div style={{ marginTop: '8px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  Or share this 6-digit OTP code at pickup:
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    background: '#FFFFFF',
                    border: '2px dashed var(--primary-orange)',
                    borderRadius: 'var(--radius-md)',
                    padding: '8px 24px',
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    letterSpacing: '6px',
                    color: 'var(--deep-forest-green)',
                  }}
                >
                  {request.rawOtp || '492815'}
                </div>
              </div>
            </div>

            {/* Input for Donor or Volunteer to verify OTP */}
            <form onSubmit={handleVerifyOtp} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '18px' }}>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <KeyRound size={16} color="var(--primary-orange)" />
                  Verify Recipient OTP (Enter code shown by NGO / Driver)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    maxLength="6"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP"
                    className="form-input"
                    style={{ fontSize: '1.2rem', letterSpacing: '4px', textAlign: 'center', fontWeight: 700 }}
                  />
                  {/* Quick Auto-Fill Demo Button */}
                  {request.rawOtp && (
                    <button
                      type="button"
                      onClick={() => setOtpInput(request.rawOtp)}
                      className="btn-outline btn-sm"
                      style={{ whiteSpace: 'nowrap' }}
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
                style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
              >
                {loading ? 'Verifying Code...' : 'Verify OTP & Proceed to Handover'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
