import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Building2, ShieldCheck, HeartHandshake, MapPin, Phone, Star, Users } from 'lucide-react';

export default function OrganizationsDirectory({ onOpenAuth }) {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('All'); // 'All', 'donor', 'recipient'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await api.getAdminUsers();
        if (res.success) {
          setUsers(res.users || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filtered = users.filter((u) => {
    if (filterRole === 'All') return u.role === 'donor' || u.role === 'recipient';
    return u.role === filterRole;
  });

  return (
    <div style={{ padding: '60px 0 100px', background: 'var(--cream-surface)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 40px' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary-orange)', textTransform: 'uppercase' }}>
            Verified Community Network
          </span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--deep-forest-green)', margin: '6px 0 10px' }}>
            Participating Organizations
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
            Restaurants, caterers, food banks, and charitable organizations collaborating across Hyderabad.
          </p>

          {/* Role Filters */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            {['All', 'donor', 'recipient'].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: filterRole === r ? 'var(--deep-forest-green)' : '#FFFFFF',
                  color: filterRole === r ? '#FFFFFF' : 'var(--dark-text)',
                  border: '1px solid var(--border-color)',
                  transition: 'var(--transition)',
                }}
              >
                {r === 'All' ? 'All Partners' : (r === 'donor' ? 'Food Donors' : 'Charitable NGOs')}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading network directory...</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: '24px',
            }}
          >
            {filtered.map((org) => (
              <div key={org._id} className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                  <img
                    src={org.avatar || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=200&q=80'}
                    alt={org.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className={`badge ${org.role === 'donor' ? 'badge-pending' : 'badge-veg'}`} style={{ fontSize: '0.68rem' }}>
                        {org.role === 'donor' ? 'DONOR' : 'VERIFIED NGO'}
                      </span>
                      {org.isVerified && <ShieldCheck size={14} color="var(--bright-green)" />}
                    </div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '4px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {org.organizationName || org.name}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                      {org.organizationType} • {org.name}
                    </p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: 'auto', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <p style={{ margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="var(--primary-orange)" /> {org.address}
                  </p>
                  {org.servingCapacity && (
                    <p style={{ margin: 0, color: 'var(--deep-forest-green)', fontWeight: 600 }}>
                      Serving Capacity: ~{org.servingCapacity} meals/day
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
