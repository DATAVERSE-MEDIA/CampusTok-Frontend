import api from '../lib/apiClient'

export async function createChannel(channelCreateModel) {
  return api.apiRequest('/api/v1/channels/', { method: 'POST', body: channelCreateModel });
}

export async function joinChannel(channelId) {
  return api.apiRequest(`/api/v1/channels/${channelId}/join`, { method: 'POST' });
}

export async function getPostsInChannel(channelId, { skip = 0, limit = 50 } = {}) {
  return api.apiRequest(`/api/v1/channels/${channelId}/posts`, { method: 'GET', query: { skip, limit }, retry: 1 });
}

export default { createChannel, joinChannel, getPostsInChannel }
