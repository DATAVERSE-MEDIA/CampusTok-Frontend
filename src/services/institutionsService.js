import api from '../lib/apiClient'

export async function getInstitution(institutionId) {
  return api.apiRequest(`/api/v1/institutions/${institutionId}`, { method: 'GET' });
}

export async function listInstitutionPosts(institutionId, { skip = 0, limit = 50 } = {}) {
  return api.apiRequest(`/api/v1/institutions/${institutionId}/posts`, { method: 'GET', query: { skip, limit } });
}

export async function createInstitutionPost(institutionId, { content, post_type = 'post', mirror_to_general = false } = {}) {
  return api.apiRequest(`/api/v1/institutions/${institutionId}/posts`, { method: 'POST', query: { content, post_type, mirror_to_general } });
}

export async function uploadDocument(institutionId, uploadedDocumentCreate) {
  return api.apiRequest(`/api/v1/institutions/${institutionId}/documents`, { method: 'POST', body: uploadedDocumentCreate });
}

export async function listDocuments(institutionId) {
  return api.apiRequest(`/api/v1/institutions/${institutionId}/documents`, { method: 'GET' });
}

export async function getDocument(documentId) {
  return api.apiRequest(`/api/v1/institutions/documents/${documentId}`, { method: 'GET' });
}

export async function deleteDocument(documentId) {
  return api.apiRequest(`/api/v1/institutions/documents/${documentId}`, { method: 'DELETE' });
}

export async function getMyInstitutionTimeline() {
  return api.apiRequest('/api/v1/institutions/timeline/my-institution', { method: 'GET' });
}

export async function chatbotQuery(institutionId, query) {
  return api.apiRequest(`/api/v1/institutions/${institutionId}/chatbot`, { method: 'POST', query: { query } });
}

export default {
  getInstitution,
  listInstitutionPosts,
  createInstitutionPost,
  uploadDocument,
  listDocuments,
  getDocument,
  deleteDocument,
  getMyInstitutionTimeline,
  chatbotQuery,
}
