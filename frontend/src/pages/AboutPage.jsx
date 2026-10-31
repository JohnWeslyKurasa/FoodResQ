import React from 'react';
import { Leaf, ShieldCheck, Heart, Cpu, QrCode, Globe2, Sparkles, Building2 } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ padding: '60px 0 100px', background: 'var(--cream-surface)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 60px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-orange)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Our Mission & Platform Architecture
          </span>
          <h1 style={{ fontSize: '2.8rem', color: 'var(--deep-forest-green)', margin: '8px 0 14px' }}>
            Every Meal Deserves a Destination
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            FoodResQ is a social-impact technology platform built to bridge the gap between commercial food surplus and urban food insecurity through intelligent logistics and cryptographic verification.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '60px',
          }}
        >
          <div className="card" style={{ padding: '30px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-orange-light)', color: 'var(--primary-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Heart size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-forest-green)', marginBottom: '10px' }}>
              Human Dignity & Zero Hunger
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Surplus food from weddings, corporate cafeterias, and fine-dining kitchens is hygienically packaged and redistributed to shelters, community kitchens, and orphanages within 2-4 hours.
            </p>
          </div>

          <div className="card" style={{ padding: '30px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--bright-green-light)', color: 'var(--bright-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-forest-green)', marginBottom: '10px' }}>
              Transparent Rule-Based Matching
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              No opaque black-box machine learning claims. We use a transparent, deterministic 5-factor scoring engine: Distance (30%), Category compatibility (25%), Serving capacity (20%), Pickup window (15%), and Verification (10%).
            </p>
          </div>

          <div className="card" style={{ padding: '30px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--forest-green-surface)', color: 'var(--deep-forest-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <QrCode size={24} />
            </div>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-forest-green)', marginBottom: '10px' }}>
              Single-Use OTP Protocol
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Double-booking and phantom pickups are prevented via cryptographic OTP generation. Pickup tokens expire after 12 hours and can only be verified once upon physical handover.
            </p>
          </div>
        </div>

        {/* Technical Architecture Overview */}
        <div className="card" style={{ padding: '36px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--deep-forest-green)', marginBottom: '16px' }}>
            Technology & System Stack
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', fontSize: '0.88rem' }}>
            <div>
              <h4 style={{ fontWeight: 700, color: 'var(--primary-orange)', marginBottom: '6px' }}>Frontend</h4>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                React, Vite, Vanilla CSS design system, Lucide icons, Leaflet OpenStreetMap, Recharts.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: 'var(--bright-green)', marginBottom: '6px' }}>Backend & APIs</h4>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                Node.js, Express.js REST API (/api/v1), JWT bearer authentication, bcrypt password hashing.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: '#3B82F6', marginBottom: '6px' }}>Database Layer</h4>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                MongoDB Atlas / local Mongoose, 2dsphere geospatial indexing, atomic inventory reservations.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: 700, color: 'var(--deep-forest-green)', marginBottom: '6px' }}>Real-Time Push</h4>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>
                Socket.IO event bus with persistent MongoDB notifications and personal user rooms.
              </p>
            </div>
          </div>
        </div>

        {/* Food Safety & Responsibility (Section 16 requirement) */}
        <div
          style={{
            background: 'var(--warm-cream)',
            borderRadius: 'var(--radius-xl)',
            padding: '30px',
            border: '1.5px solid rgba(255, 138, 61, 0.3)',
          }}
        >
          <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <Leaf size={28} color="var(--deep-forest-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--deep-forest-green)', margin: '0 0 8px' }}>
                Food Safety Disclaimer & Operational Transparency
              </h3>
              <p style={{ fontSize: '0.86rem', color: 'var(--dark-text)', lineHeight: 1.6, margin: 0 }}>
                FoodResQ is a coordination platform, not a food-safety inspection or certification service. Donors are responsible for accurate information and compliance with applicable food-safety regulations. Recipients should independently assess donations before accepting or distributing them.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
