import React from 'react';
import {
  Heart,
  TrendingUp,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Soup,
  Users,
  Leaf,
  UtensilsCrossed
} from 'lucide-react';

export default function HeroSection({ onDonateClick, onFindFoodClick, featuredDonations = [], stats = {} }) {
  const benefitIndicators = [
    { title: 'Reduce Food Waste', icon: Leaf, desc: 'Zero edible food to landfills' },
    { title: 'Support Communities', icon: Users, desc: 'Nourish local shelters daily' },
    { title: 'Healthy Meals', icon: Soup, desc: 'Hygienically verified batches' },
    { title: 'Stronger Tomorrow', icon: TrendingUp, desc: 'Transparent social impact' },
  ];

  const previewListing = featuredDonations[0] || {
    title: 'Paneer Butter Masala & Basmati Rice',
    donor: 'Paradise Biryani House',
    quantity: 85,
    unit: 'meals',
    timeRemaining: '3h remaining',
    category: 'Vegetarian',
    location: 'Madhapur, Hyderabad (1.8 km)',
    matchScore: 96,
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '680px',
        padding: '70px 0 90px',
        background: `linear-gradient(105deg, rgba(253, 251, 247, 0.97) 0%, rgba(253, 251, 247, 0.92) 50%, rgba(255, 247, 230, 0.75) 100%), url('https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1800&q=85')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        borderBottom: '1px solid var(--border-color)',
        overflow: 'hidden',
      }}
    >
      {/* Decorative ambient glow circles */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 138, 61, 0.12) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.10) 0%, rgba(255, 255, 255, 0) 70%)',
          pointerEvents: 'none',
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '50px', alignItems: 'center' }} className="hero-grid">
          
          {/* Left Column: Heading, Subtitle, CTAs, Benefits */}
          <div>
            {/* Tagline Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--warm-cream)',
                border: '1.5px solid rgba(255, 138, 61, 0.3)',
                marginBottom: '20px',
              }}
            >
              <Sparkles size={16} color="var(--primary-orange)" />
              <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--deep-forest-green)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Intelligent Food Rescue Network
              </span>
            </div>

            {/* Main Heading */}
            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.2vw, 3.6rem)',
                fontWeight: 800,
                color: 'var(--deep-forest-green)',
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '20px',
              }}
            >
              Good Food <br />
              <span className="text-gradient-orange">Should Reach</span> <br />
              Good People
            </h1>

            {/* Subtitle */}
            <p
              style={{
                fontSize: '1.12rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                maxWidth: '540px',
                marginBottom: '32px',
              }}
            >
              Connect restaurants, shops and community kitchens with NGOs and volunteers to share surplus food and reduce food waste.
            </p>

            {/* Two Prominent CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
              <button
                onClick={onDonateClick}
                className="btn-primary"
                style={{ fontSize: '1.05rem', padding: '14px 32px' }}
              >
                <UtensilsCrossed size={19} />
                <span>Donate Food</span>
              </button>

              <button
                onClick={onFindFoodClick}
                className="btn-forest"
                style={{ fontSize: '1.05rem', padding: '14px 32px' }}
              >
                <Heart size={19} />
                <span>Find Food</span>
              </button>
            </div>

            {/* 4 Benefit Indicators */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                maxWidth: '540px',
              }}
              className="benefit-grid"
            >
              {benefitIndicators.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: 'rgba(255, 255, 255, 0.75)',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid rgba(15, 81, 50, 0.08)',
                      backdropFilter: 'blur(8px)',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'var(--forest-green-surface)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--deep-forest-green)',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={17} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.86rem', fontWeight: 700, margin: 0, color: 'var(--dark-text)' }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0 }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Floating Dashboard Preview Card */}
          <div style={{ position: 'relative' }}>
            <div
              className="glass-card"
              style={{
                padding: '26px',
                borderRadius: 'var(--radius-xl)',
                boxShadow: '0 25px 50px -12px rgba(15, 81, 50, 0.22)',
                position: 'relative',
              }}
            >
              {/* Card Header: Live Impact Pulse */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '18px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: 'var(--bright-green)',
                      boxShadow: '0 0 10px var(--bright-green)',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--deep-forest-green)' }}>
                    Live Rescue Hub • Hyderabad
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'var(--warm-cream)',
                    color: 'var(--primary-orange)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  ⚡ Active Now
                </span>
              </div>

              {/* Featured Food Donation Preview */}
              <div
                style={{
                  background: 'var(--cream-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <img
                    src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=260&q=80"
                    alt="Surplus Food"
                    style={{
                      width: '76px',
                      height: '76px',
                      borderRadius: 'var(--radius-md)',
                      objectFit: 'cover',
                      border: '1px solid var(--border-color)',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span className="badge badge-veg">Vegetarian</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: 'var(--deep-forest-green)',
                          background: 'var(--bright-green-light)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}
                      >
                        96% Match
                      </span>
                    </div>
                    <h4
                      style={{
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {previewListing.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      {previewListing.donor} • <MapPin size={12} style={{ display: 'inline' }} /> 1.8 km away
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '12px',
                    paddingTop: '10px',
                    borderTop: '1px dashed var(--border-color)',
                    fontSize: '0.8rem',
                  }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--primary-orange)' }}>
                    📦 {previewListing.quantity} {previewListing.unit || 'meals'} available
                  </span>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} color="#DC2626" /> Pickup by 6:00 PM
                  </span>
                </div>
              </div>

              {/* 3 Live Mini Metric Counters */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    background: '#FFFFFF',
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--deep-forest-green)', margin: 0 }}>
                    {stats.totalMealsRedistributed || '3,450'}+
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Meals Served
                  </p>
                </div>

                <div
                  style={{
                    background: '#FFFFFF',
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-orange)', margin: 0 }}>
                    100%
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Verified Handover
                  </p>
                </div>

                <div
                  style={{
                    background: '#FFFFFF',
                    padding: '12px 10px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--bright-green)', margin: 0 }}>
                    14 NGOs
                  </p>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                    Standing By
                  </p>
                </div>
              </div>

              {/* NGO Availability & Match Status Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--forest-green-surface)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="var(--deep-forest-green)" />
                  <div>
                    <p style={{ fontSize: '0.78rem', fontWeight: 700, margin: 0, color: 'var(--deep-forest-green)' }}>
                      Akshaya Meals Foundation
                    </p>
                    <p style={{ fontSize: '0.68rem', color: 'var(--text-muted)', margin: 0 }}>
                      Verified Partner • Capacity 120 meals/day
                    </p>
                  </div>
                </div>
                <button
                  onClick={onFindFoodClick}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--deep-forest-green)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  Explore <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 990px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 580px) {
          .benefit-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
