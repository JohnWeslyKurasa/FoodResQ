const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('foodresq_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.message || `Request failed with status ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  register: (userData) => request('/auth/register', { method: 'POST', body: userData }),
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PATCH', body: data }),

  // Donations
  getDonations: (params = '') => request(`/donations${params ? `?${params}` : ''}`),
  getDonationById: (id) => request(`/donations/${id}`),
  createDonation: (data) => request('/donations', { method: 'POST', body: data }),
  updateDonation: (id, data) => request(`/donations/${id}`, { method: 'PATCH', body: data }),
  deleteDonation: (id) => request(`/donations/${id}`, { method: 'DELETE' }),
  getMyDonations: () => request('/donations/my'),
  getNearbyDonations: () => request('/donations/nearby'),

  // Requests
  createRequest: (data) => request('/requests', { method: 'POST', body: data }),
  getMyRequests: () => request('/requests/my'),
  getRequestById: (id) => request(`/requests/${id}`),
  acceptRequest: (id) => request(`/requests/${id}/accept`, { method: 'PATCH' }),
  rejectRequest: (id, reason) => request(`/requests/${id}/reject`, { method: 'PATCH', body: { reason } }),
  cancelRequest: (id) => request(`/requests/${id}/cancel`, { method: 'PATCH' }),

  // Pickup Verification
  generatePickupTokens: (requestId) => request(`/pickup/${requestId}/generate`, { method: 'POST' }),
  verifyPickupOtp: (requestId, otp) => request(`/pickup/${requestId}/verify`, { method: 'POST', body: { otp } }),
  confirmPickupDelivery: (requestId, data) => request(`/pickup/${requestId}/confirm`, { method: 'POST', body: data }),

  // Dashboards
  getDonorDashboard: () => request('/dashboard/donor'),
  getRecipientDashboard: () => request('/dashboard/recipient'),
  getVolunteerDashboard: () => request('/dashboard/volunteer'),
  getImpactAnalytics: () => request('/dashboard/impact'),

  // Admin
  getAdminStats: () => request('/admin/stats'),
  getAdminUsers: (params = '') => request(`/admin/users${params ? `?${params}` : ''}`),
  verifyUser: (id, isVerified) => request(`/admin/users/${id}/verify`, { method: 'PATCH', body: { isVerified } }),
  suspendUser: (id, isSuspended) => request(`/admin/users/${id}/suspend`, { method: 'PATCH', body: { isSuspended } }),
  getAdminListings: () => request('/admin/listings'),
  moderateListing: (id) => request(`/admin/listings/${id}`, { method: 'DELETE' }),
  getAdminReports: () => request('/admin/reports'),
  resolveReport: (id, data) => request(`/admin/reports/${id}/resolve`, { method: 'PATCH', body: data }),

  // Notifications & Reports
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PATCH' }),
  createReport: (data) => request('/notifications/reports', { method: 'POST', body: data }),

  // Seed Reset
  resetDatabase: () => request('/seed', { method: 'POST' }),
};
