import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Clock, Utensils, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { getTimeRemaining, formatDistance } from '../utils/formatters';

// Custom modern SVG marker icons using L.divIcon
const createCustomIcon = (type, label = '') => {
  const isDonation = type === 'donation';
  const isNgo = type === 'ngo';
  const color = isDonation ? '#FF8A3D' : (isNgo ? '#0F5132' : '#22C55E');
  const iconEmoji = isDonation ? '🍲' : '🏠';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        position: relative;
        width: 36px;
        height: 36px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        border: 2px solid #FFFFFF;
      ">
        <span style="transform: rotate(45deg); font-size: 15px;">${iconEmoji}</span>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

export default function LiveMap({ donations = [], onRequestClick }) {
  // Center: Hitech City / Madhapur, Hyderabad
  const hyderabadCenter = [17.4483, 78.3826];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredDonations = selectedCategory === 'All'
    ? donations
    : donations.filter((d) => d.category === selectedCategory);

  // Demo verified NGOs in Hyderabad for map display
  const demoNgos = [
    {
      id: 'ngo1',
      name: 'Akshaya Meals Foundation',
      coords: [17.4622, 78.3614], // Kondapur
      type: 'ngo',
      address: 'Kondapur, Hyderabad',
      capacity: '120 meals/day',
    },
    {
      id: 'ngo2',
      name: 'Robin Food Army Hyd',
      coords: [17.4938, 78.3995], // Kukatpally
      type: 'ngo',
      address: 'Kukatpally, Hyderabad',
      capacity: '250 meals/day',
    },
    {
      id: 'ngo3',
      name: 'Hope Community Kitchen',
      coords: [17.4968, 78.3582], // Miyapur
      type: 'ngo',
      address: 'Miyapur, Hyderabad',
      capacity: '80 meals/day',
    },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '560px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
      {/* Floating Category Filter Pill Bar */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          padding: '6px 12px',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          gap: '6px',
          alignItems: 'center',
          maxWidth: 'calc(100% - 32px)',
          overflowX: 'auto',
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--deep-forest-green)', textTransform: 'uppercase', marginRight: '4px' }}>
          Filter:
        </span>
        {['All', 'Vegetarian', 'Non-Vegetarian', 'Bakery', 'Fruits', 'Vegetables'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              fontWeight: 600,
              background: selectedCategory === cat ? 'var(--deep-forest-green)' : 'transparent',
              color: selectedCategory === cat ? '#FFFFFF' : 'var(--dark-text)',
              transition: 'var(--transition)',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Floating Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-md)',
          fontSize: '0.75rem',
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#FF8A3D' }} />
          <span>Surplus Food ({filteredDonations.length})</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0F5132' }} />
          <span>Verified NGOs ({demoNgos.length})</span>
        </div>
      </div>

      <MapContainer
        center={hyderabadCenter}
        zoom={12}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Donation Markers */}
        {filteredDonations.map((d) => {
          const coords = d.location?.coordinates
            ? [d.location.coordinates[1], d.location.coordinates[0]] // Leaflet expects [lat, lng]
            : [17.4483 + (Math.random() - 0.5) * 0.05, 78.3826 + (Math.random() - 0.5) * 0.05];
          const deadline = getTimeRemaining(d.pickupEndTime);

          return (
            <Marker key={d._id} position={coords} icon={createCustomIcon('donation', d.category)}>
              <Popup>
                <div style={{ padding: '8px', minWidth: '220px' }}>
                  <span className={`badge ${d.category === 'Vegetarian' ? 'badge-veg' : 'badge-nonveg'}`} style={{ fontSize: '0.68rem', marginBottom: '4px' }}>
                    {d.category}
                  </span>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '4px 0', color: 'var(--dark-text)' }}>
                    {d.title}
                  </h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0 6px' }}>
                    By: {d.donorId?.organizationName || 'Paradise Biryani'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '8px', fontWeight: 600 }}>
                    <span style={{ color: 'var(--primary-orange)' }}>
                      📦 {d.remainingQuantity || d.quantity} {d.quantityUnit}
                    </span>
                    <span style={{ color: '#DC2626' }}>
                      ⏰ {deadline.text}
                    </span>
                  </div>
                  <button
                    onClick={() => onRequestClick && onRequestClick(d)}
                    className="btn-primary btn-sm"
                    style={{ width: '100%', padding: '6px 10px', fontSize: '0.78rem' }}
                  >
                    Request Surplus Food
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* NGO Markers */}
        {demoNgos.map((ngo) => (
          <Marker key={ngo.id} position={ngo.coords} icon={createCustomIcon('ngo')}>
            <Popup>
              <div style={{ padding: '8px', minWidth: '200px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                  <ShieldCheck size={16} color="var(--bright-green)" />
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--deep-forest-green)' }}>
                    VERIFIED RECIPIENT NGO
                  </span>
                </div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '2px 0', color: 'var(--dark-text)' }}>
                  {ngo.name}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '2px 0' }}>
                  📍 {ngo.address}
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--deep-forest-green)', fontWeight: 600, margin: '4px 0 0' }}>
                  Serving Capacity: {ngo.capacity}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
