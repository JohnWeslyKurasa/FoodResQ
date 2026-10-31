const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');

/**
 * Generate a 6-digit OTP and QR code data URL for an accepted request
 */
async function generatePickupTokens(requestId, donationId, recipientId) {
  // Generate random 6-digit numerical OTP
  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash the OTP with bcrypt
  const salt = await bcrypt.genSalt(10);
  const otpHash = await bcrypt.hash(rawOtp, salt);

  // OTP expires in 12 hours
  const otpExpiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000);

  // Generate payload for QR Code
  const qrData = JSON.stringify({
    type: 'FOODRESQ_PICKUP',
    requestId: requestId.toString(),
    donationId: donationId.toString(),
    recipientId: recipientId.toString(),
    otp: rawOtp,
    generatedAt: new Date().toISOString(),
  });

  const qrDataUrl = await QRCode.toDataURL(qrData, {
    errorCorrectionLevel: 'H',
    margin: 2,
    color: {
      dark: '#0F5132', // FoodResQ Deep Forest Green
      light: '#FFF7E6', // Warm Cream background
    },
    width: 320,
  });

  return {
    rawOtp,
    otpHash,
    otpExpiresAt,
    qrPayload: qrDataUrl,
  };
}

/**
 * Verify provided OTP against stored hash
 */
async function verifyOtp(rawOtp, storedHash, expiresAt, isAlreadyVerified) {
  if (isAlreadyVerified) {
    return { success: false, message: 'Pickup has already been verified and completed.' };
  }

  if (new Date() > new Date(expiresAt)) {
    return { success: false, message: 'Pickup OTP has expired. Please request a new code.' };
  }

  const isValid = await bcrypt.compare(rawOtp.trim(), storedHash);
  if (!isValid) {
    return { success: false, message: 'Invalid OTP code. Please check and try again.' };
  }

  return { success: true, message: 'OTP verified successfully.' };
}

module.exports = {
  generatePickupTokens,
  verifyOtp,
};
