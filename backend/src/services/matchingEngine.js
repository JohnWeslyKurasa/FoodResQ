/**
 * Smart Food Matching Engine (Transparent Rule-Based Recommendation Algorithm)
 * 
 * Weights:
 * - Distance: 30%
 * - Food Category Compatibility: 25%
 * - Serving Capacity vs Available Quantity: 20%
 * - Pickup Window Compatibility: 15%
 * - NGO Verification Status: 10%
 */

// Calculate great-circle distance in kilometers using the Haversine formula
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lon1 === undefined || lat2 === undefined || lon2 === undefined) {
    return 10.0; // fallback default
  }
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Score a single donation for an NGO user
 */
function calculateMatchScore(donation, ngo) {
  const now = new Date();
  const pickupEnd = new Date(donation.pickupEndTime);

  // Hard filter 1: Expired listing
  if (pickupEnd < now || donation.status !== 'AVAILABLE') {
    return null;
  }

  // Hard filter 2: No remaining quantity
  const remaining = Math.max(0, donation.quantity - (donation.reservedQuantity || 0));
  if (remaining <= 0) {
    return null;
  }

  // Coordinates
  const dCoords = donation.location?.coordinates || [78.3826, 17.4483];
  const nCoords = ngo.location?.coordinates || [78.3826, 17.4483];
  const distanceKm = calculateDistanceKm(dCoords[1], dCoords[0], nCoords[1], nCoords[0]);

  // Hard filter 3: Beyond reasonable maximum service radius (e.g. 35km)
  const maxRadiusKm = 35;
  if (distanceKm > maxRadiusKm) {
    return null;
  }

  // 1. Distance Score (30%) - Higher score for closer distance
  // 0 km -> 30 pts, 15 km -> 15 pts, >=30 km -> 2 pts
  const distanceScore = Math.max(2, Math.round(30 * (1 - Math.min(distanceKm, 30) / 30)));

  // 2. Food Category Compatibility (25%)
  let categoryScore = 15; // baseline
  const preferred = ngo.preferredCategories || [];
  if (preferred.length === 0 || preferred.includes(donation.category)) {
    categoryScore = 25;
  } else {
    // If not in preferred list, downweight
    categoryScore = 10;
  }

  // 3. Capacity Compatibility (20%)
  // Compare remaining quantity with NGO's servingCapacity
  const ngoCapacity = ngo.servingCapacity || 50;
  let capacityScore = 10;
  if (remaining <= ngoCapacity * 1.5 && remaining >= ngoCapacity * 0.2) {
    // Ideal range: NGO can absorb all or majority in one run
    capacityScore = 20;
  } else if (remaining > ngoCapacity * 1.5) {
    // Large donation: NGO can take a partial lot
    capacityScore = 16;
  } else {
    capacityScore = 12;
  }

  // 4. Pickup Window Compatibility (15%)
  // How much time is left before pickup ends?
  const hoursLeft = (pickupEnd - now) / (1000 * 60 * 60);
  let pickupScore = 5;
  if (hoursLeft > 2 && hoursLeft < 12) {
    // Sweet spot for rescue operations
    pickupScore = 15;
  } else if (hoursLeft >= 12) {
    pickupScore = 13;
  } else if (hoursLeft >= 1) {
    pickupScore = 10;
  } else if (hoursLeft > 0) {
    pickupScore = 6;
  }

  // 5. NGO Verification Status (10%)
  const verificationScore = ngo.isVerified ? 10 : 4;

  const totalScore = Math.min(100, Math.round(
    distanceScore + categoryScore + capacityScore + pickupScore + verificationScore
  ));

  const reasons = [
    `${distanceKm} km away (${distanceKm <= 5 ? 'Within immediate 5km zone' : 'Accessible via city transit'})`,
    `${donation.category} category matches distribution preferences`,
    `Donation size of ${remaining} ${donation.quantityUnit} aligns with ${ngo.organizationName || 'your'} serving capacity of ~${ngoCapacity} meals/day`,
    `${hoursLeft > 1 ? Math.round(hoursLeft) + ' hours remaining in pickup window' : 'Urgent pickup needed within 1 hour'}`,
    ngo.isVerified ? 'Verified organization priority matching' : 'Standard priority matching',
  ];

  const summary = `${totalScore}% Match – ${distanceKm} km away – Can accommodate ${remaining} ${donation.quantityUnit}.`;

  return {
    score: totalScore,
    distanceKm,
    remainingQuantity: remaining,
    breakdown: {
      distance: distanceScore,
      category: categoryScore,
      capacity: capacityScore,
      pickupWindow: pickupScore,
      verification: verificationScore,
    },
    reasons,
    summary,
  };
}

module.exports = {
  calculateDistanceKm,
  calculateMatchScore,
};
