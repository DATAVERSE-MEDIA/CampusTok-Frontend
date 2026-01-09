import api from '../lib/apiClient'

export async function createResource(resourceCreate) {
  return api.apiRequest('/api/v1/student-portal/', { method: 'POST', body: resourceCreate });
}

export async function listResourcesForInstitution(institutionId) {
  return api.apiRequest(`/api/v1/student-portal/institution/${institutionId}`, { method: 'GET' });
}

export async function deleteResource(resourceId) {
  return api.apiRequest(`/api/v1/student-portal/${resourceId}`, { method: 'DELETE' });
}

export default { createResource, listResourcesForInstitution, deleteResource }
