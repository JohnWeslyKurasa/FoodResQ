import React from 'react';
import { ChefHat, Cpu, QrCode, Heart, ArrowRight } from 'lucide-react';

export default function HowItWorks({ onGetStarted }) {
  const steps = [
    {
      num: '01',
      title: 'Donors Post Surplus Food',
      desc: 'Restaurants, hotels, caterers, and bakeries list edible surplus with preparation timestamps, allergens, and pickup deadlines.',
      icon: ChefHat,
      color: 'var(--primary-orange)',
      bg: 'var(--primary-orange-light)',
    },
    {
      num: '02',
      title: 'Explainable Smart Match',
      desc: 'Our transparent 5-factor rule-based algorithm scores compatibility with nearby verified NGOs based on distance, dietary type, and capacity.',
      icon: Cpu,
      color: 'var(--bright-green)',
      bg: 'var(--bright-green-light)',
    },
    {
      num: '03',
      title: 'Secure OTP & QR Handover',
      desc: 'Single-use cryptographic OTP and QR codes prevent double booking and ensure food is transferred only to authorized volunteers or recipients.',
      icon: QrCode,
      color: '#3B82F6',
      bg: '#EFF6FF',
    },
    {
      num: '04',
      title: 'Communities Fed & Verified',
      desc: 'Meals are served warm and fresh. Completed pickups immediately update live database metrics, carbon savings, and donor impact certificates.',
      icon: Heart,
      color: 'var(--deep-forest-green)',
      bg: 'var(--forest-green-surface)',
    },
  ];

  return (
    <section style={{ padding: '80px 0', background: '#FFFFFF', borderBottom: '1px solid var(--border-color)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 50px' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--primary-orange)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Seamless Redistribution Pipeline
          </span>
          <h2 style={{ fontSize: '2.4rem', color: 'var(--deep-forest-green)', margin: '8px 0 14px' }}>
            How FoodResQ Works
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)' }}>
            A four-step closed-loop network transforming commercial surplus into community meals within hours.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
          }}
        >
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  padding: '28px 24px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Step Number */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '20px',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: s.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: s.color,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.8rem',
                      fontWeight: 800,
                      color: 'rgba(15, 81, 50, 0.12)',
                    }}
                  >
                    {s.num}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.12rem', color: 'var(--dark-text)', marginBottom: '8px' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Banner */}
        <div
          style={{
            marginTop: '50px',
            background: 'var(--warm-cream)',
            borderRadius: 'var(--radius-xl)',
            padding: '28px 36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            border: '1.5px solid rgba(255, 138, 61, 0.3)',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.3rem', color: 'var(--deep-forest-green)', margin: 0 }}>
              Ready to eliminate edible food waste at your facility?
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '4px 0 0' }}>
              Join over 30+ leading Hyderabad hospitality brands and verified community NGOs today.
            </p>
          </div>
          <button onClick={onGetStarted} className="btn-primary" style={{ padding: '12px 28px' }}>
            <span>Join Platform</span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </section>
  );
}
