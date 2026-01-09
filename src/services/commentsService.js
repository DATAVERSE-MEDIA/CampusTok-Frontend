import api from '../lib/apiClient'

export async function createComment(postId, commentCreate) {
  return api.apiRequest(`/api/v1/posts/${postId}/comments/`, { method: 'POST', body: commentCreate });
}

export async function readComments(postId, { skip = 0, limit = 50 } = {}) {
  return api.apiRequest(`/api/v1/posts/${postId}/comments/`, { method: 'GET', query: { skip, limit }, retry: 1 });
}

export default { createComment, readComments }
