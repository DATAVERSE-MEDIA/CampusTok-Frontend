import api from '../lib/apiClient';

/**
 * Auth service
 * Implements endpoints from OpenAPI:
 * - POST /api/v1/auth/register
 * - POST /api/v1/auth/login
 * - POST /api/v1/auth/logout
 * - GET /api/v1/auth/institutions
 * - POST /api/v1/auth/verify-email (query token)
 */

export async function register(userCreateModel) {
  return api.apiRequest('/api/v1/auth/register', {
    method: 'POST',
    body: userCreateModel,
  });
}

export async function login(credentials) {
  const res = await api.apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: credentials,
  });
  // If API returns token in `data`, persist it
  if (res && res.data) {
    // common token locations
    const token = res.data.access_token || res.data.accessToken || res.data.token || res.access_token || res.accessToken;
    if (token) api.setAccessToken(token);
  }
  return res;
}

export async function logout() {
  const res = await api.apiRequest('/api/v1/auth/logout', {
    method: 'POST',
  });
  api.clearAccessToken();
  return res;
}

export async function getInstitutions() {
  return api.apiRequest('/api/v1/auth/institutions', { method: 'GET', retry: 2 });
}

export async function verifyEmail(token) {
  return api.apiRequest('/api/v1/auth/verify-email/', { method: 'POST', query: { token } });
}

export async function getCurrentUser() {
  return api.apiRequest('/api/v1/auth/users/me', { method: 'GET', retry: 1 });
}

export async function resendVerification(email) {
  return api.apiRequest('/api/v1/auth/resend-verification-token', { method: 'POST', query: { email } });
}

export default {
  register,
  login,
  logout,
  getInstitutions,
  verifyEmail,
  resendVerification,
};
