import api from '../lib/apiClient'

export async function getMyNotifications({ skip = 0, limit = 50 } = {}) {
  return api.apiRequest('/api/v1/notifications/me', { method: 'GET', query: { skip, limit }, retry: 1 });
}

export async function markNotificationAsRead(notificationId) {
  return api.apiRequest(`/api/v1/notifications/${notificationId}/read`, { method: 'POST' });
}

export default { getMyNotifications, markNotificationAsRead }
