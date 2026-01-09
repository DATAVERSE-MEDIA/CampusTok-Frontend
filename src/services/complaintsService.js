import api from '../lib/apiClient'

export async function fileComplaint(complaintCreate) {
  return api.apiRequest('/api/v1/complaints/', { method: 'POST', body: complaintCreate });
}

export default { fileComplaint }
