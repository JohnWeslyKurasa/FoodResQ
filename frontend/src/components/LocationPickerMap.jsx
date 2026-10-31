import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Search, CheckCircle2, Loader2 } from 'lucide-react';

// Modern Leaflet custom pin
const pickerPinIcon = L.divIcon({
  className: 'custom-picker-pin',
  html: `
    <div style="
      position: relative;
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #FF8A3D 0%, #EA580C 100%);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(234, 88, 12, 0.45);
      border: 2.5px solid #FFFFFF;
    ">
      <span style="transform: rotate(45deg); font-size: 16px;">📍</span>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

// Map controller for handling click, dragging, and auto-resize
function MapClickHandler({ position, onPositionChange }) {
  const map = useMap();

  useEffect(() => {
    // Invalidate map size after mounting in modal
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (position) {
      map.flyTo(position, Math.max(map.getZoom(), 14), { duration: 0.8 });
    }
  }, [position, map]);

  useMapEvents({
    click(e) {
      onPositionChange(e.latlng.lat, e.latlng.lng);
    },
  });

  const markerRef = useRef(null);

  const eventHandlers = {
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const latlng = marker.getLatLng();
        onPositionChange(latlng.lat, latlng.lng);
      }
    },
  };

  return position ? (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={pickerPinIcon}
    />
  ) : null;
}

export default function LocationPickerMap({
  initialLat = 17.4483,
  initialLng = 78.3826,
  onLocationSelected,
  currentAddress = '',
}) {
  const [coords, setCoords] = useState({ lat: initialLat, lng: initialLng });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Click map or drag the pin to pick exact spot');

  // Reverse geocode to get street name/address from coordinates
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          const shortAddress = [
            data.address?.road || data.address?.suburb || '',
            data.address?.neighbourhood || data.address?.city_district || '',
            data.address?.city || data.address?.town || 'Hyderabad',
            data.address?.postcode || '',
          ].filter(Boolean).join(', ');

          const formatted = shortAddress.length > 5 ? shortAddress : data.display_name;
          onLocationSelected({
            lat,
            lng: lon,
            address: formatted,
          });
          setStatusMessage(`📍 Selected: ${formatted.slice(0, 42)}...`);
          return;
        }
      }
    } catch (err) {
      console.warn('Reverse geocoding error:', err);
    }
    onLocationSelected({ lat, lng: lon, address: null });
    setStatusMessage(`📍 Location set: ${lat.toFixed(4)}, ${lon.toFixed(4)}`);
  };

  const handlePositionChange = (lat, lng) => {
    setCoords({ lat, lng });
    reverseGeocode(lat, lng);
  };

  // Search address by name
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setStatusMessage('Searching location...');
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const newLat = parseFloat(data[0].lat);
        const newLng = parseFloat(data[0].lon);
        setCoords({ lat: newLat, lng: newLng });
        onLocationSelected({
          lat: newLat,
          lng: newLng,
          address: data[0].display_name,
        });
        setStatusMessage(`Found: ${data[0].display_name.slice(0, 45)}...`);
      } else {
        setStatusMessage('Location not found. Try clicking on the map directly.');
      }
    } catch (err) {
      setStatusMessage('Search failed. Click directly on the map to pin.');
    } finally {
      setIsSearching(false);
    }
  };

  // Detect GPS Location
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetecting(true);
    setStatusMessage('Detecting GPS location...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
        setIsDetecting(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setStatusMessage('Could not get GPS. Please click your location on the map.');
        setIsDetecting(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  return (
    <div style={{ marginTop: '8px', marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--deep-forest-green)', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <MapPin size={14} color="var(--primary-orange)" />
          Pinpoint Exact Facility / Delivery Location *
        </label>
        <button
          type="button"
          onClick={handleDetectCurrentLocation}
          disabled={isDetecting}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--deep-forest-green)',
            background: 'var(--forest-green-surface)',
            border: '1px solid rgba(15, 81, 50, 0.2)',
            padding: '3px 8px',
            borderRadius: 'var(--radius-full)',
            cursor: 'pointer',
          }}
        >
          {isDetecting ? <Loader2 size={12} className="spin" /> : <Navigation size={12} />}
          {isDetecting ? 'Detecting...' : 'Use My GPS'}
        </button>
      </div>

      {/* Quick Search Bar */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            placeholder="Search landmark, street or area..."
            style={{
              width: '100%',
              padding: '7px 10px 7px 30px',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid var(--border-color)',
              fontSize: '0.8rem',
              background: '#FFFFFF',
              outline: 'none',
            }}
          />
          <Search size={14} style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          style={{
            padding: '7px 12px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--deep-forest-green)',
            color: '#FFFFFF',
            fontSize: '0.78rem',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {isSearching ? <Loader2 size={13} className="spin" /> : 'Search'}
        </button>
      </div>

      {/* Leaflet Map Frame */}
      <div
        style={{
          width: '100%',
          height: '210px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          border: '2px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative',
        }}
      >
        <MapContainer
          center={[coords.lat, coords.lng]}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler
            position={[coords.lat, coords.lng]}
            onPositionChange={handlePositionChange}
          />
        </MapContainer>

        {/* Live Coordinate Badge Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            background: 'rgba(15, 81, 50, 0.92)',
            color: '#FFFFFF',
            backdropFilter: 'blur(4px)',
            padding: '4px 8px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.68rem',
            fontWeight: 700,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          <CheckCircle2 size={12} color="#4ADE80" />
          <span>{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
        </div>
      </div>

      {/* Hint and feedback */}
      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '5px', marginBottom: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span>👆</span> {statusMessage}
      </p>
    </div>
  );
}
