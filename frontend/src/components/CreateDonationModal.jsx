import React, { useState } from 'react';
import { api } from '../services/api';
import {
  X,
  PlusCircle,
  MapPin,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Upload,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

const HYDERABAD_LOCALITIES = [
  { name: 'Madhapur / Hitech City', lat: 17.4483, lng: 78.3826 },
  { name: 'Kondapur / Financial Dist', lat: 17.4622, lng: 78.3614 },
  { name: 'Gachibowli Bio-Park', lat: 17.4401, lng: 78.3489 },
  { name: 'Jubilee Hills Road 36', lat: 17.4319, lng: 78.4072 },
  { name: 'Kukatpally KPHB', lat: 17.4938, lng: 78.3995 },
  { name: 'Miyapur Metro Zone', lat: 17.4968, lng: 78.3582 },
];

const PRESET_IMAGES = {
  Vegetarian: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
  'Non-Vegetarian': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
  Bakery: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  Fruits: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80',
  Vegetables: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
  Dairy: 'https://images.unsplash.com/photo-1571212515416-fef01fc43637?auto=format&fit=crop&w=800&q=80',
  'Packaged Food': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  Other: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
};

export default function CreateDonationModal({ isOpen, onClose, onListingCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Vegetarian');
  const [quantity, setQuantity] = useState(50);
  const [quantityUnit, setQuantityUnit] = useState('meals');
  const [imageUrl, setImageUrl] = useState(PRESET_IMAGES.Vegetarian);
  const [storageConditions, setStorageConditions] = useState('Keep Warm (>60°C)');
  const [handlingInstructions, setHandlingInstructions] = useState('Packed in food-grade insulated aluminum containers.');
  const [allergenInfo, setAllergenInfo] = useState('None specified');
  const [pickupAddress, setPickupAddress] = useState('Plot 12, Hitech City Main Rd, Madhapur, Hyderabad');
  const [selectedLocality, setSelectedLocality] = useState(HYDERABAD_LOCALITIES[0]);

  // Times
  const nowStr = new Date().toISOString().slice(0, 16);
  const plusFourHours = new Date(Date.now() + 4 * 3600000).toISOString().slice(0, 16);
  const [pickupStartTime, setPickupStartTime] = useState(nowStr);
  const [pickupEndTime, setPickupEndTime] = useState(plusFourHours);
  const [preparationTime, setPreparationTime] = useState(nowStr);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setImageUrl(PRESET_IMAGES[cat] || PRESET_IMAGES.Other);
  };

  const handleLocalityChange = (e) => {
    const loc = HYDERABAD_LOCALITIES.find((l) => l.name === e.target.value) || HYDERABAD_LOCALITIES[0];
    setSelectedLocality(loc);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !description || !pickupAddress) {
      setError('Please fill in all mandatory fields.');
      return;
    }

    if (new Date(pickupEndTime) <= new Date(pickupStartTime)) {
      setError('Pickup end time must be after pickup start time.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.createDonation({
        title,
        description,
        category,
        quantity: Number(quantity),
        quantityUnit,
        imageUrl,
        preparationTime,
        pickupStartTime,
        pickupEndTime,
        storageConditions,
        handlingInstructions,
        allergenInfo: allergenInfo.split(',').map((s) => s.trim()),
        pickupAddress,
        latitude: selectedLocality.lat,
        longitude: selectedLocality.lng,
      });

      if (res.success) {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FF8A3D', '#22C55E', '#0F5132'],
        });
        if (onListingCreated) onListingCreated(res.donation);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to list food donation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '30px', maxWidth: '680px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'var(--warm-cream)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PlusCircle size={22} color="var(--primary-orange)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Add Food Donation Listing</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                List edible surplus food for immediate community redistribution
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--cream-surface)',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Title & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Food Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fresh Steamed Rice & Dal Makhani"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="form-select"
              >
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
                <option value="Bakery">Bakery</option>
                <option value="Fruits">Fruits</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Dairy">Dairy</option>
                <option value="Packaged Food">Packaged Food</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Detailed Description & Preparation Context *</label>
            <textarea
              required
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the dish, preparation source (buffet/banquet/bakery display), and packing method."
              className="form-textarea"
            />
          </div>

          {/* Quantity & Unit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Total Quantity *</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit of Measure *</label>
              <select
                value={quantityUnit}
                onChange={(e) => setQuantityUnit(e.target.value)}
                className="form-select"
              >
                <option value="meals">meals (individual servings)</option>
                <option value="kg">kg (weight)</option>
                <option value="boxes">boxes (packaged cartons)</option>
                <option value="portions">portions</option>
                <option value="packets">packets</option>
              </select>
            </div>
          </div>

          {/* Times: Prep, Pickup Start, Pickup End */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Prep Time *</label>
              <input
                type="datetime-local"
                required
                value={preparationTime}
                onChange={(e) => setPreparationTime(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.8rem', padding: '10px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pickup Start *</label>
              <input
                type="datetime-local"
                required
                value={pickupStartTime}
                onChange={(e) => setPickupStartTime(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.8rem', padding: '10px' }}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pickup Deadline *</label>
              <input
                type="datetime-local"
                required
                value={pickupEndTime}
                onChange={(e) => setPickupEndTime(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.8rem', padding: '10px' }}
              />
            </div>
          </div>

          {/* Storage & Allergens */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Storage Conditions</label>
              <select
                value={storageConditions}
                onChange={(e) => setStorageConditions(e.target.value)}
                className="form-select"
              >
                <option value="Keep Warm (>60°C)">Keep Warm (&gt;60°C)</option>
                <option value="Room Temperature (15-25°C)">Room Temperature (15-25°C)</option>
                <option value="Refrigerated (0-4°C)">Refrigerated (0-4°C)</option>
                <option value="Frozen (-18°C)">Frozen (-18°C)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Allergen Information</label>
              <input
                type="text"
                value={allergenInfo}
                onChange={(e) => setAllergenInfo(e.target.value)}
                placeholder="e.g. Dairy, Nuts, Gluten (or None)"
                className="form-input"
              />
            </div>
          </div>

          {/* Handling & Pickup Address */}
          <div className="form-group">
            <label className="form-label">Handling & Food Transport Instructions</label>
            <input
              type="text"
              value={handlingInstructions}
              onChange={(e) => setHandlingInstructions(e.target.value)}
              placeholder="e.g. Keep upright in insulated crates. Consume within 4 hours."
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Pickup Facility Address *</label>
              <input
                type="text"
                required
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hyderabad Map Locality</label>
              <select
                value={selectedLocality.name}
                onChange={handleLocalityChange}
                className="form-select"
              >
                {HYDERABAD_LOCALITIES.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Food Safety & Responsibility Disclaimer Banner (Prompt #16) */}
          <div
            style={{
              background: 'var(--warm-cream)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              fontSize: '0.74rem',
              color: 'var(--deep-forest-green)',
              border: '1px solid rgba(255, 138, 61, 0.25)',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
              marginBottom: '20px',
            }}
          >
            <Info size={16} color="var(--primary-orange)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Food Safety Disclaimer:</strong> FoodResQ is a coordination platform, not a food-safety inspection or certification service. Donors are responsible for accurate information and compliance with applicable food-safety regulations. Recipients should independently assess donations before accepting or distributing them.
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '12px 28px' }}>
              {loading ? 'Publishing Listing...' : 'Publish Surplus Food Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
