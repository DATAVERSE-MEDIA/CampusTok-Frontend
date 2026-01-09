import api from '../lib/apiClient';

/**
 * Posts service
 * Implements endpoints from OpenAPI:
 * - GET /api/v1/posts/ (read posts)
 * - POST /api/v1/posts/ (create post)
 * - GET /api/v1/posts/media/presigned-url (get presigned upload url)
 * - GET /api/v1/posts/{post_id}
 * - DELETE /api/v1/posts/{post_id}
 */

export async function readPosts({ school_scope = null, skip = 0, limit = 20 } = {}) {
  return api.apiRequest('/api/v1/posts/', {
    method: 'GET',
    query: { school_scope, skip, limit },
    retry: 2,
  });
}

export async function createPost(postCreateModel) {
  return api.apiRequest('/api/v1/posts/', {
    method: 'POST',
    body: postCreateModel,
  });
}

export async function getPresignedUrl(fileName, fileType) {
  return api.apiRequest('/api/v1/posts/media/presigned-url', {
    method: 'GET',
    query: { file_name: fileName, file_type: fileType },
  });
}

export async function readPost(postId) {
  return api.apiRequest(`/api/v1/posts/${postId}`, { method: 'GET' });
}

export async function deletePost(postId) {
  return api.apiRequest(`/api/v1/posts/${postId}`, { method: 'DELETE' });
}

export default {
  readPosts,
  createPost,
  getPresignedUrl,
  readPost,
  deletePost,
};
