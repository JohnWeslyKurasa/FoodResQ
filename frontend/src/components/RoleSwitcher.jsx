import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, ChefHat, HeartHandshake, Bike, ShieldCheck, ChevronDown, Check } from 'lucide-react';

export default function RoleSwitcher({ onRoleSwitched }) {
  const { user, switchRoleDemo, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [switching, setSwitching] = useState(false);

  const roles = [
    {
      id: 'donor',
      title: 'Donor (Restaurant)',
      name: 'Paradise Biryani House',
      person: 'Chef Suresh Reddy',
      icon: ChefHat,
      color: 'var(--primary-orange)',
    },
    {
      id: 'recipient',
      title: 'Recipient (Verified NGO)',
      name: 'Akshaya Meals Foundation',
      person: 'Kavita Menon',
      icon: HeartHandshake,
      color: 'var(--bright-green)',
    },
    {
      id: 'volunteer',
      title: 'Volunteer (Rescue Agent)',
      name: 'City Rescue Fleet',
      person: 'Vikram Rao',
      icon: Bike,
      color: '#3B82F6',
    },
    {
      id: 'admin',
      title: 'Platform Administrator',
      name: 'FoodResQ Trust & Safety',
      person: 'Rohan Varma',
      icon: ShieldCheck,
      color: 'var(--deep-forest-green)',
    },
  ];

  const handleSelectRole = async (roleId) => {
    setSwitching(true);
    try {
      await switchRoleDemo(roleId);
      setIsOpen(false);
      if (onRoleSwitched) {
        onRoleSwitched(roleId);
      }
    } catch (err) {
      console.error('Role switch failed:', err);
    } finally {
      setSwitching(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--warm-cream)',
          color: 'var(--deep-forest-green)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.82rem',
          fontWeight: 700,
          border: '1.5px solid rgba(255, 138, 61, 0.35)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <Users size={15} color="var(--primary-orange)" />
        <span>{user ? `Switch: ${user.role.toUpperCase()}` : '⚡ 1-Click Demo Accounts'}</span>
        <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '310px',
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border-color)',
            zIndex: 1200,
            padding: '10px',
            animation: 'modalEnter 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
              Select Active Persona (No typing needed)
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
            {roles.map((r) => {
              const Icon = r.icon;
              const isCurrent = user?.role === r.id;
              return (
                <button
                  key={r.id}
                  disabled={switching}
                  onClick={() => handleSelectRole(r.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isCurrent ? 'var(--forest-green-surface)' : 'transparent',
                    textAlign: 'left',
                    width: '100%',
                    border: isCurrent ? '1px solid rgba(15, 81, 50, 0.2)' : 'none',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = 'var(--cream-surface)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${r.color}`,
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={18} color={r.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0, color: 'var(--dark-text)' }}>
                        {r.title}
                      </p>
                      {isCurrent && <Check size={14} color="var(--deep-forest-green)" />}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.name} • {r.person}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {user && (
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                  if (onRoleSwitched) {
                    onRoleSwitched(null);
                  }
                }}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#DC2626',
                  padding: '6px 12px',
                }}
              >
                Log Out to Guest Mode
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
