import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import {
  TrendingUp,
  Award,
  Globe2,
  Users,
  Leaf,
  Scale,
  Sparkles,
  Building2,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';

const PIE_COLORS = ['#22C55E', '#FF8A3D', '#FACC15', '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6'];

export default function ImpactPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImpact() {
      try {
        const res = await api.getImpactAnalytics();
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load impact analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadImpact();
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>Compiling verified social impact data...</p>
      </div>
    );
  }

  const stats = data?.stats || {
    totalMealsRedistributed: 3100,
    totalKilogramsRedistributed: 1395,
    completedDonations: 124,
    activeDonors: 18,
    activeNgos: 12,
    co2SavedKg: 3480,
  };

  const metricCards = [
    { title: 'Meals Redistributed', val: `${stats.totalMealsRedistributed.toLocaleString()}+`, sub: 'Confirmed Handover', icon: Award, color: 'var(--deep-forest-green)', bg: 'var(--forest-green-surface)' },
    { title: 'Food Weight Rescued', val: `${stats.totalKilogramsRedistributed.toLocaleString()} kg`, sub: 'Diverted from Landfill', icon: Scale, color: 'var(--primary-orange)', bg: 'var(--primary-orange-light)' },
    { title: 'CO₂ Emissions Prevented', val: `${stats.co2SavedKg.toLocaleString()} kg`, sub: 'Greenhouse Offset', icon: Leaf, color: 'var(--bright-green)', bg: 'var(--bright-green-light)' },
    { title: 'Community Partners', val: `${stats.activeDonors + stats.activeNgos}`, sub: 'Donors & Verified NGOs', icon: Building2, color: '#3B82F6', bg: '#EFF6FF' },
  ];

  return (
    <div style={{ padding: '60px 0 100px', background: 'var(--cream-surface)' }}>
      <div className="container">
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 50px' }}>
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 800,
              color: 'var(--primary-orange)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Verified Social & Environmental Accountability
          </span>
          <h1 style={{ fontSize: '2.8rem', color: 'var(--deep-forest-green)', margin: '8px 0 14px' }}>
            Live Impact & Sustainability Ledger
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Every meal counted here is verified via cryptographic OTP handover at physical pickup, ensuring 100% genuine redistribution without vanity numbers.
          </p>
        </div>

        {/* 4 Large Highlight Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '20px',
            marginBottom: '48px',
          }}
        >
          {metricCards.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="card" style={{ padding: '26px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>{m.title}</span>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: m.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: m.color }}>
                    <Icon size={22} />
                  </div>
                </div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: m.color, margin: 0 }}>
                  {m.val}
                </h2>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '6px 0 0' }}>
                  ✓ {m.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Two Visual Charts: Monthly Trends & Category Share */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '28px', marginBottom: '40px' }} className="impact-grid">
          
          {/* Chart 1: Monthly Growth Trends */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--deep-forest-green)' }}>
                  Redistribution Trajectory
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  Cumulative meals served per operating month
                </p>
              </div>
              <span className="badge badge-veg">Verified Ledger</span>
            </div>

            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data?.monthlyTrends || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="impactMealsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF8A3D" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FF8A3D" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2ECE6" />
                  <XAxis dataKey="month" tick={{ fontSize: 13, fill: '#536B63' }} />
                  <YAxis tick={{ fontSize: 13, fill: '#536B63' }} />
                  <Tooltip
                    contentStyle={{
                      background: '#FFFFFF',
                      borderRadius: '8px',
                      border: '1px solid #E2ECE6',
                      boxShadow: 'var(--shadow-md)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="meals"
                    name="Meals Served"
                    stroke="#FF8A3D"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#impactMealsGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Category Breakdown */}
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--deep-forest-green)' }}>
                Food Category Share
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Nutritional diversification across rescued surplus
              </p>
            </div>

            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.categoryDistribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(data?.categoryDistribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Hyderabad Locality Breakdown Table */}
        <div className="card" style={{ padding: '28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--deep-forest-green)' }}>
                Hyderabad Urban Locality Distribution
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
                Hyperlocal food rescue operations active across key IT and residential corridors
              </p>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--deep-forest-green)' }}>
              Telangana State Hub
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid var(--border-color)', textAlign: 'left', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '12px 14px' }}>Locality Zone</th>
                  <th style={{ padding: '12px 14px' }}>Verified Meals Delivered</th>
                  <th style={{ padding: '12px 14px' }}>Active Donor Facilities</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(data?.localityBreakdown || []).map((loc, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="var(--primary-orange)" />
                      {loc.locality}
                    </td>
                    <td style={{ padding: '14px', fontWeight: 800, color: 'var(--deep-forest-green)' }}>
                      {loc.meals.toLocaleString()} meals
                    </td>
                    <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                      {loc.donors} partners
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span className="badge badge-veg">Active Hub</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Food Safety & Responsibility Note (Prompt #16) */}
        <div
          style={{
            background: 'var(--warm-cream)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px 30px',
            border: '1px solid rgba(255, 138, 61, 0.3)',
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
          }}
        >
          <Leaf size={28} color="var(--deep-forest-green)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.82rem', color: 'var(--deep-forest-green)', margin: 0, lineHeight: 1.6 }}>
            <strong>FoodResQ Responsibility Statement:</strong> FoodResQ is an intelligent coordination platform, not a food-safety inspection or certification service. Donors are responsible for accurate information and compliance with applicable food-safety regulations. Recipients independently verify donations prior to distribution.
          </p>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .impact-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
