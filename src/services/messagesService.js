import api from '../lib/apiClient'

export async function createConversation(conversationCreate) {
  return api.apiRequest('/api/v1/messages/', { method: 'POST', body: conversationCreate });
}

export async function getMyConversations() {
  return api.apiRequest('/api/v1/messages/me', { method: 'GET', retry: 1 });
}

export async function sendMessage(conversationId, messageCreate) {
  return api.apiRequest(`/api/v1/messages/${conversationId}/messages`, { method: 'POST', body: messageCreate });
}

export async function getMessages(conversationId, { limit = 50, offset = 0 } = {}) {
  return api.apiRequest(`/api/v1/messages/${conversationId}/messages`, { method: 'GET', query: { limit, offset } });
}

export default { createConversation, getMyConversations, sendMessage, getMessages }
