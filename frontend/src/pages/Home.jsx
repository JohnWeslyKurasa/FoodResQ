import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import FoodCard from '../components/FoodCard';
import LiveMap from '../components/LiveMap';
import RequestFoodModal from '../components/RequestFoodModal';
import MatchingBreakdownModal from '../components/MatchingBreakdownModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  Heart,
  Leaf,
  MapPin,
  UtensilsCrossed,
  Award,
  PhoneCall
} from 'lucide-react';

export default function Home({ onNavigate, onOpenAuth }) {
  const { user } = useAuth();
  const [featuredDonations, setFeaturedDonations] = useState([]);
  const [impactStats, setImpactStats] = useState({});
  const [selectedDonationForRequest, setSelectedDonationForRequest] = useState(null);
  const [selectedDonationForMatch, setSelectedDonationForMatch] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [dRes, iRes] = await Promise.all([
          api.getDonations('status=AVAILABLE'),
          api.getImpactAnalytics(),
        ]);
        if (dRes.success) setFeaturedDonations(dRes.donations || []);
        if (iRes.success) setImpactStats(iRes.stats || {});
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    }
    loadHomeData();
  }, []);

  const handleDonateClick = () => {
    if (user?.role === 'donor') {
      onNavigate('donor-dashboard');
    } else {
      onOpenAuth('register', 'donor');
    }
  };

  const handleFindFoodClick = () => {
    if (user?.role === 'recipient') {
      onNavigate('ngo-dashboard');
    } else {
      onNavigate('listings');
    }
  };

  const filteredDonations = selectedCategory === 'All'
    ? featuredDonations
    : featuredDonations.filter((d) => d.category === selectedCategory);

  return (
    <div>
      {/* 1. HERO SECTION (Follows attached reference image) */}
      <HeroSection
        onDonateClick={handleDonateClick}
        onFindFoodClick={handleFindFoodClick}
        featuredDonations={featuredDonations}
        stats={impactStats}
      />

      {/* 2. STATS COUNTER STRIP */}
      <section style={{ background: '#FFFFFF', borderBottom: '1px solid var(--border-color)', padding: '36px 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px',
              textAlign: 'center',
            }}
          >
            <div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--deep-forest-green)', margin: 0 }}>
                {impactStats.totalMealsRedistributed || 3450}+
              </h2>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Nutritious Meals Redistributed
              </p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-orange)', margin: 0 }}>
                {impactStats.totalKilogramsRedistributed || 1550}+ kg
              </h2>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Commercial Food Rescued
              </p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--bright-green)', margin: 0 }}>
                30+ Facilities
              </h2>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Restaurants, Hotels & Caterers
              </p>
            </div>
            <div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#3B82F6', margin: 0 }}>
                100% Cryptographic
              </h2>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', margin: '4px 0 0' }}>
                Single-Use OTP & QR Verifications
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED SURPLUS FOOD LISTINGS */}
      <section style={{ padding: '80px 0', background: 'var(--cream-surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-orange)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Live Surplus Rescue Batches
              </span>
              <h2 style={{ fontSize: '2.2rem', color: 'var(--deep-forest-green)', margin: '4px 0 0' }}>
                Available Food in Hyderabad
              </h2>
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', maxWidth: '100%', paddingBottom: '4px' }}>
              {['All', 'Vegetarian', 'Non-Vegetarian', 'Bakery', 'Fruits', 'Vegetables'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    background: selectedCategory === cat ? 'var(--deep-forest-green)' : '#FFFFFF',
                    color: selectedCategory === cat ? '#FFFFFF' : 'var(--dark-text)',
                    border: '1px solid var(--border-color)',
                    transition: 'var(--transition)',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '24px',
              marginBottom: '40px',
            }}
          >
            {filteredDonations.slice(0, 6).map((donation) => (
              <FoodCard
                key={donation._id}
                donation={donation}
                onRequestClick={(d) => {
                  if (!user) {
                    onOpenAuth('login');
                  } else {
                    setSelectedDonationForRequest(d);
                  }
                }}
                onMatchClick={(d) => setSelectedDonationForMatch(d)}
              />
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => onNavigate('listings')}
              className="btn-forest"
              style={{ padding: '14px 32px', fontSize: '1rem' }}
            >
              <span>Explore All Listings on Map</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS WORKFLOW */}
      <HowItWorks onGetStarted={() => onOpenAuth('register')} />

      {/* 5. INTERACTIVE LIVE RESCUE MAP PREVIEW */}
      <section style={{ padding: '80px 0', background: 'var(--cream-surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 40px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-orange)', textTransform: 'uppercase' }}>
              Real-Time Locality Coordination
            </span>
            <h2 style={{ fontSize: '2.2rem', color: 'var(--deep-forest-green)', margin: '6px 0 10px' }}>
              Hyderabad Food Rescue Map
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
              OpenStreetMap powered live dispatch connecting kitchens in Madhapur, Gachibowli, and Jubilee Hills with local shelters.
            </p>
          </div>

          <LiveMap
            donations={featuredDonations}
            onRequestClick={(d) => {
              if (!user) {
                onOpenAuth('login');
              } else {
                setSelectedDonationForRequest(d);
              }
            }}
          />
        </div>
      </section>

      {/* 6. PARTNER ORGANIZATIONS */}
      <section style={{ padding: '70px 0', background: '#FFFFFF', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Trusted by Top Food Donors & Verified NGOs
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '40px',
              opacity: 0.85,
            }}
          >
            {[
              'Paradise Biryani & Banquets',
              'Green Leaf Gourmet Caterers',
              'Grand Palace Hotel & Bakery',
              'Akshaya Meals Foundation',
              'Robin Food Army Hyderabad',
              'Hope Community Kitchen',
            ].map((name, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: 'var(--deep-forest-green)',
                }}
              >
                <ShieldCheck size={18} color="var(--bright-green)" />
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FOOD SAFETY DISCLAIMER BANNER (Prompt #16) */}
      <section style={{ padding: '40px 0', background: 'var(--warm-cream)' }}>
        <div className="container">
          <div
            style={{
              border: '1.5px solid rgba(255, 138, 61, 0.3)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px 30px',
              display: 'flex',
              gap: '16px',
              alignItems: 'flex-start',
              background: '#FFFFFF',
            }}
          >
            <Leaf size={26} color="var(--deep-forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--deep-forest-green)' }}>
                Food Safety & Community Responsibility Statement
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--dark-text)', margin: 0, lineHeight: 1.6 }}>
                FoodResQ is a coordination platform, not a food-safety inspection or certification service. Donors are responsible for accurate information and compliance with applicable food-safety regulations. Recipients should independently assess donations before accepting or distributing them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer style={{ background: 'var(--forest-green-dark)', color: '#FFFFFF', padding: '60px 0 30px' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '40px',
              marginBottom: '50px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Food<span style={{ color: 'var(--primary-orange)' }}>ResQ</span>
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.6, marginBottom: '14px' }}>
                Intelligent food rescue and redistribution platform bridging surplus kitchens with local communities.
              </p>
              <p style={{ fontSize: '0.82rem', color: 'var(--golden-yellow)', fontWeight: 700 }}>
                "Rescue Food. Feed Lives."
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#FFFFFF' }}>
                Platform Roles
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#CBD5E1' }}>
                <li>Restaurants & Caterers (Donors)</li>
                <li>Verified NGOs & Food Banks</li>
                <li>Volunteer Rescue Fleet</li>
                <li>Platform Administration</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#FFFFFF' }}>
                Redistribution Engine
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#CBD5E1' }}>
                <li>Smart 5-Factor Matching Algorithm</li>
                <li>Single-Use Cryptographic OTP Protocol</li>
                <li>Leaflet & OpenStreetMap Live Geo-Routing</li>
                <li>Carbon Offsets & Verified Impact Ledger</li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px', color: '#FFFFFF' }}>
                Headquarters
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
                Cyber Towers, Hitech City Main Rd,<br />
                Madhapur, Hyderabad, Telangana 500081<br />
                support@foodresq.org
              </p>
            </div>
          </div>

          <div
            style={{
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '0.78rem',
              color: '#94A3B8',
            }}
          >
            <span>&copy; {new Date().getFullYear()} FoodResQ Platform Inc. All rights reserved.</span>
            <span>Mission: Every meal deserves a destination.</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <RequestFoodModal
        isOpen={!!selectedDonationForRequest}
        onClose={() => setSelectedDonationForRequest(null)}
        donation={selectedDonationForRequest}
        onRequestSuccess={() => {
          onNavigate('ngo-dashboard');
        }}
      />

      <MatchingBreakdownModal
        isOpen={!!selectedDonationForMatch}
        onClose={() => setSelectedDonationForMatch(null)}
        donation={selectedDonationForMatch}
      />
    </div>
  );
}
