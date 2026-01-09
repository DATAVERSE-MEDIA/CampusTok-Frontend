import api from '../lib/apiClient'

export async function createCommunity(communityCreateModel) {
  return api.apiRequest('/api/v1/communities/', { method: 'POST', body: communityCreateModel });
}

export async function joinOrLeaveCommunity(communityId) {
  return api.apiRequest(`/api/v1/communities/${communityId}/join`, { method: 'POST' });
}

export async function getPostsInCommunity(communityId, { skip = 0, limit = 50 } = {}) {
  return api.apiRequest(`/api/v1/communities/${communityId}/posts`, { method: 'GET', query: { skip, limit } });
}

export default { createCommunity, joinOrLeaveCommunity, getPostsInCommunity }
