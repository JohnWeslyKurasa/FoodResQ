import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FoodCard from '../components/FoodCard';
import LiveMap from '../components/LiveMap';
import RequestFoodModal from '../components/RequestFoodModal';
import MatchingBreakdownModal from '../components/MatchingBreakdownModal';
import {
  Utensils,
  Search,
  Filter,
  MapPin,
  Clock,
  Sparkles,
  LayoutGrid,
  Map as MapIcon,
  PlusCircle,
  AlertCircle
} from 'lucide-react';

export default function FoodListingsPage({ onOpenAuth, onNavigate }) {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [selectedDonationForRequest, setSelectedDonationForRequest] = useState(null);
  const [selectedDonationForMatch, setSelectedDonationForMatch] = useState(null);

  const categories = ['All', 'Vegetarian', 'Non-Vegetarian', 'Bakery', 'Fruits', 'Vegetables', 'Dairy', 'Packaged Food'];

  const loadDonations = async () => {
    setLoading(true);
    try {
      const res = await api.getDonations('status=AVAILABLE');
      if (res.success) {
        setDonations(res.donations || []);
      }
    } catch (err) {
      console.error('Failed to load food listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const handleRequestClick = (donation) => {
    if (!user) {
      // Prompt sign in as NGO
      if (onOpenAuth) onOpenAuth('login', 'recipient');
      return;
    }
    if (user.role === 'recipient') {
      setSelectedDonationForRequest(donation);
    } else {
      alert(`You are signed in as a ${user.role.toUpperCase()}. Claiming surplus food is reserved for verified Charitable NGOs.`);
    }
  };

  // Filter donations
  const filteredDonations = donations.filter((d) => {
    // Category
    if (selectedCategory !== 'All' && d.category !== selectedCategory) return false;
    // Urgency
    if (urgencyFilter === 'urgent' && d.urgency !== 'urgent' && d.urgency !== 'critical') return false;
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = d.title?.toLowerCase().includes(query);
      const matchDonor = d.donorId?.organizationName?.toLowerCase().includes(query) || d.donorId?.name?.toLowerCase().includes(query);
      const matchAddress = d.location?.address?.toLowerCase().includes(query);
      if (!matchTitle && !matchDonor && !matchAddress) return false;
    }
    return true;
  });

  return (
    <div style={{ background: 'var(--cream-surface)', minHeight: '100vh', padding: '40px 0 90px' }}>
      <div className="container">
        
        {/* Page Top Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-active" style={{ fontSize: '0.72rem' }}>
                🟢 {donations.length} Active Surplus Lots Available
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Updated real-time</span>
            </div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--deep-forest-green)', margin: 0 }}>
              Live Surplus Food Directory
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Browse and claim surplus meals from certified restaurants, hotels, and caterers across Hyderabad.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {/* View Mode Switcher */}
            <div style={{ display: 'flex', background: '#FFFFFF', padding: '3px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: viewMode === 'grid' ? 'var(--deep-forest-green)' : 'transparent',
                  color: viewMode === 'grid' ? '#FFFFFF' : 'var(--dark-text)',
                  transition: 'all 0.15s',
                }}
              >
                <LayoutGrid size={15} /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  background: viewMode === 'map' ? 'var(--deep-forest-green)' : 'transparent',
                  color: viewMode === 'map' ? '#FFFFFF' : 'var(--dark-text)',
                  transition: 'all 0.15s',
                }}
              >
                <MapIcon size={15} /> Map View
              </button>
            </div>

            {/* Post Food CTA for Donors */}
            <button
              onClick={() => {
                if (user?.role === 'donor') onNavigate('donor-dashboard');
                else onOpenAuth('register', 'donor');
              }}
              className="btn-primary"
              style={{ gap: '6px', padding: '10px 18px', fontSize: '0.88rem' }}
            >
              <PlusCircle size={16} /> Donate Surplus Food
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div
          className="card"
          style={{
            padding: '16px 20px',
            marginBottom: '28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* Top row: Search input + Urgency toggle */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search food by title, restaurant, or locality..."
                style={{
                  width: '100%',
                  padding: '9px 14px 9px 38px',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px solid var(--border-color)',
                  fontSize: '0.88rem',
                  outline: 'none',
                }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--dark-text)' }}>Urgency:</span>
              <button
                type="button"
                onClick={() => setUrgencyFilter(urgencyFilter === 'urgent' ? 'All' : 'urgent')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: urgencyFilter === 'urgent' ? '#EF4444' : 'var(--border-color)',
                  background: urgencyFilter === 'urgent' ? '#FEE2E2' : '#FFFFFF',
                  color: urgencyFilter === 'urgent' ? '#DC2626' : 'var(--dark-text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Clock size={13} />
                <span>Urgent (&lt;2 hrs)</span>
              </button>
            </div>
          </div>

          {/* Bottom row: Food Category Pills */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>
              Categories:
            </span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--deep-forest-green)' : 'var(--border-color)',
                    background: isSelected ? 'var(--deep-forest-green)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--dark-text)',
                    transition: 'all 0.15s',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content View */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading active surplus listings...</p>
          </div>
        ) : viewMode === 'map' ? (
          /* Map View */
          <div style={{ height: '600px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
            <LiveMap
              donations={filteredDonations}
              onRequestClick={(donation) => handleRequestClick(donation)}
            />
          </div>
        ) : filteredDonations.length === 0 ? (
          /* Empty State */
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Utensils size={44} color="var(--primary-orange)" style={{ margin: '0 auto 14px' }} />
            <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-forest-green)', margin: '0 0 6px' }}>
              No Food Listings Found
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 16px' }}>
              {searchQuery || selectedCategory !== 'All' || urgencyFilter !== 'All'
                ? 'Try clearing your filters or search terms to see available donations.'
                : 'All surplus donations have been successfully claimed by community shelters! Check back soon or donate new surplus.'}
            </p>
            {(searchQuery || selectedCategory !== 'All' || urgencyFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setUrgencyFilter('All');
                }}
                className="btn-outline btn-sm"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          /* Grid View */
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {filteredDonations.map((donation) => (
              <FoodCard
                key={donation._id}
                donation={donation}
                onRequestClick={() => handleRequestClick(donation)}
                onExplainMatch={() => setSelectedDonationForMatch(donation)}
              />
            ))}
          </div>
        )}

        {/* Claim / Request Food Modal */}
        {selectedDonationForRequest && (
          <RequestFoodModal
            isOpen={!!selectedDonationForRequest}
            onClose={() => setSelectedDonationForRequest(null)}
            donation={selectedDonationForRequest}
            onSuccess={() => {
              setSelectedDonationForRequest(null);
              loadDonations();
            }}
          />
        )}

        {/* Explainable Match Breakdown Modal */}
        {selectedDonationForMatch && (
          <MatchingBreakdownModal
            isOpen={!!selectedDonationForMatch}
            onClose={() => setSelectedDonationForMatch(null)}
            donation={selectedDonationForMatch}
            recipient={user}
            onRequestClick={() => {
              setSelectedDonationForRequest(selectedDonationForMatch);
              setSelectedDonationForMatch(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
