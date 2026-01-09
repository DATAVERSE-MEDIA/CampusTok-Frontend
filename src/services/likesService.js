import api from '../lib/apiClient'

export async function toggleLikePost(postId) {
  return api.apiRequest(`/api/v1/likes/post/${postId}`, { method: 'POST' });
}

export default { toggleLikePost }
