import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  Building2,
  ShieldCheck,
  HeartHandshake,
  MapPin,
  Phone,
  Star,
  Users,
  Search,
  Bike,
  ChefHat,
  Heart,
  PlusCircle,
  ExternalLink
} from 'lucide-react';

export default function OrganizationsDirectory({ onOpenAuth }) {
  const [organizations, setOrganizations] = useState([]);
  const [filterRole, setFilterRole] = useState('All'); // 'All', 'donor', 'recipient', 'volunteer'
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fallback demo partners in case of network latency
  const fallbackOrgs = [
    {
      _id: 'org1',
      name: 'Chef Suresh Reddy',
      organizationName: 'Paradise Biryani & Banquet',
      organizationType: 'Restaurant',
      role: 'donor',
      address: 'Plot 12, Hitech City Main Rd, Madhapur, Hyderabad',
      isVerified: true,
      rating: 4.9,
      avgDailyMeals: 60,
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80',
    },
    {
      _id: 'org2',
      name: 'Kavita Menon',
      organizationName: 'Akshaya Meals Foundation',
      organizationType: 'NGO',
      role: 'recipient',
      address: 'Near RTO Office, Kondapur, Hyderabad',
      isVerified: true,
      rating: 5.0,
      servingCapacity: 120,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    {
      _id: 'org3',
      name: 'Anita Deshmukh',
      organizationName: 'Green Leaf Gourmet Caterers',
      organizationType: 'Caterer',
      role: 'donor',
      address: 'ISB Road, Financial District, Gachibowli, Hyderabad',
      isVerified: true,
      rating: 4.8,
      avgDailyMeals: 100,
      avatar: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=200&q=80',
    },
    {
      _id: 'org4',
      name: 'Siddharth Roy',
      organizationName: 'Robin Food Army Hyderabad',
      organizationType: 'Charity',
      role: 'recipient',
      address: 'KPHB Colony, Kukatpally, Hyderabad',
      isVerified: true,
      rating: 4.9,
      servingCapacity: 250,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    },
    {
      _id: 'org5',
      name: 'Vikram Rao',
      organizationName: 'City Rescue Fleet',
      organizationType: 'Individual Volunteer',
      role: 'volunteer',
      address: 'Madhapur & Jubilee Hills, Hyderabad',
      vehicleType: 'Bike / Scooter',
      isVerified: true,
      rating: 4.9,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    },
  ];

  useEffect(() => {
    async function loadDirectory() {
      try {
        const res = await api.getPublicOrganizations();
        if (res.success && res.organizations && res.organizations.length > 0) {
          setOrganizations(res.organizations);
        } else {
          setOrganizations(fallbackOrgs);
        }
      } catch (err) {
        console.warn('Using fallback organizations directory:', err);
        setOrganizations(fallbackOrgs);
      } finally {
        setLoading(false);
      }
    }
    loadDirectory();
  }, []);

  const filtered = organizations.filter((u) => {
    // Role filter
    if (filterRole !== 'All' && u.role !== filterRole) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = u.organizationName?.toLowerCase().includes(q) || u.name?.toLowerCase().includes(q);
      const matchAddress = u.address?.toLowerCase().includes(q);
      const matchType = u.organizationType?.toLowerCase().includes(q);
      if (!matchName && !matchAddress && !matchType) return false;
    }
    return true;
  });

  return (
    <div style={{ padding: '50px 0 100px', background: 'var(--cream-surface)', minHeight: '100vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-orange)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Verified Community Network
          </span>
          <h1 style={{ fontSize: '2.6rem', color: 'var(--deep-forest-green)', margin: '6px 0 12px', fontWeight: 800 }}>
            Participating Organizations & Fleet
          </h1>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Verified commercial donors, charitable food banks, shelters, and volunteer dispatchers working together to end food waste in Hyderabad.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
            <button
              onClick={() => onOpenAuth ? onOpenAuth('register', 'donor') : null}
              className="btn-primary btn-sm"
              style={{ gap: '6px' }}
            >
              <PlusCircle size={15} /> Join as Partner Organization
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div
          className="card"
          style={{
            padding: '16px 20px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search partner by name, cuisine, shelter or area..."
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

          {/* Role Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'All', label: 'All Partners' },
              { id: 'donor', label: '🍽️ Food Donors' },
              { id: 'recipient', label: '🤝 Verified NGOs' },
              { id: 'volunteer', label: '🚴 Volunteer Fleet' },
            ].map((tab) => {
              const isSelected = filterRole === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilterRole(tab.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.82rem',
                    fontWeight: isSelected ? 700 : 500,
                    background: isSelected ? 'var(--deep-forest-green)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--dark-text)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Organizations Grid */}
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>Loading network directory...</p>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ padding: '48px 20px', textAlign: 'center' }}>
            <Building2 size={40} color="var(--primary-orange)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--deep-forest-green)' }}>No Organizations Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              No partners match your current search or filter.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {filtered.map((org) => {
              const isDonor = org.role === 'donor';
              const isNgo = org.role === 'recipient';
              const isVol = org.role === 'volunteer';

              return (
                <div key={org._id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <img
                      src={org.avatar || (isDonor ? 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80')}
                      alt={org.name}
                      style={{ width: '56px', height: '56px', borderRadius: '14px', objectFit: 'cover', border: '2px solid var(--border-color)', flexShrink: 0 }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span
                          className={`badge ${isDonor ? 'badge-pending' : isNgo ? 'badge-veg' : 'badge-active'}`}
                          style={{ fontSize: '0.68rem', fontWeight: 800 }}
                        >
                          {isDonor ? 'FOOD DONOR' : isNgo ? 'VERIFIED NGO' : 'VOLUNTEER'}
                        </span>
                        {org.isVerified && <ShieldCheck size={14} color="var(--bright-green)" title="Verified Entity" />}
                        {org.rating && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', fontSize: '0.72rem', fontWeight: 700, color: '#D97706', marginLeft: 'auto' }}>
                            <Star size={12} fill="#F59E0B" color="#F59E0B" /> {org.rating}
                          </span>
                        )}
                      </div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '2px 0', color: 'var(--deep-forest-green)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {org.organizationName || org.name}
                      </h3>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                        {org.organizationType || (isDonor ? 'Restaurant' : isNgo ? 'NGO' : 'Volunteer')} • {org.name}
                      </p>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: 'auto', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} color="var(--primary-orange)" style={{ flexShrink: 0 }} />
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{org.address}</span>
                    </p>
                    {isNgo && org.servingCapacity && (
                      <p style={{ margin: 0, color: 'var(--deep-forest-green)', fontWeight: 700, fontSize: '0.8rem' }}>
                        🍲 Daily Serving Capacity: ~{org.servingCapacity} meals/day
                      </p>
                    )}
                    {isDonor && org.avgDailyMeals > 0 && (
                      <p style={{ margin: 0, color: 'var(--primary-orange)', fontWeight: 700, fontSize: '0.8rem' }}>
                        ✨ Avg Surplus: ~{org.avgDailyMeals} meals/day
                      </p>
                    )}
                    {isVol && org.vehicleType && (
                      <p style={{ margin: 0, color: '#2563EB', fontWeight: 700, fontSize: '0.8rem' }}>
                        🛵 Vehicle Fleet: {org.vehicleType}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
