import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Search, X, MapPin, ArrowRight } from 'lucide-react';
import { formatDistance } from '../utils/formatters';

export default function SearchModal({ isOpen, onClose, onSelectListing }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.getDonations(`search=${encodeURIComponent(query.trim())}`);
        if (res.success) {
          setResults(res.donations || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '24px', maxWidth: '580px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1.5px solid var(--border-color)', paddingBottom: '14px', marginBottom: '16px' }}>
          <Search size={22} color="var(--primary-orange)" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search surplus dishes, restaurants, or Hyderabad areas..."
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '1.1rem',
              color: 'var(--dark-text)',
              background: 'transparent',
            }}
          />
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

        {/* Results */}
        <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
          {loading && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px' }}>
              Searching active food listings...
            </p>
          )}

          {!loading && query && results.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
              No food listings found matching "{query}".
            </p>
          )}

          {!loading && results.map((d) => (
            <div
              key={d._id}
              onClick={() => {
                onSelectListing(d);
                onClose();
              }}
              style={{
                display: 'flex',
                gap: '12px',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'background 0.2s',
                borderBottom: '1px solid var(--border-color)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--cream-surface)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <img
                src={d.imageUrl}
                alt={d.title}
                style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={`badge ${d.category === 'Vegetarian' ? 'badge-veg' : 'badge-nonveg'}`} style={{ fontSize: '0.65rem' }}>
                    {d.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--primary-orange)', fontWeight: 700 }}>
                    {d.remainingQuantity || d.quantity} {d.quantityUnit} available
                  </span>
                </div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '2px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {d.title}
                </h4>
                <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
                  {d.donorId?.organizationName || 'Paradise Biryani'} • <MapPin size={11} style={{ display: 'inline' }} /> {d.pickupAddress}
                </p>
              </div>
              <ArrowRight size={16} color="var(--deep-forest-green)" style={{ alignSelf: 'center' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
