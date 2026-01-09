// Centralized API client for LagTALK integration
// Uses fetch, environment base URL, token handling, retries, and response normalization

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://talk-lgsa.onrender.com';

/**
 * Get access token from storage.
 * Prefer secure storage; fallback to localStorage for compatibility.
 * @returns {string|null}
 */
export function getAccessToken() {
  try {
    return localStorage.getItem('access_token');
  } catch (err) {
    return null;
  }
}

/**
 * Save access token to storage.
 * @param {string} token
 */
export function setAccessToken(token) {
  try {
    localStorage.setItem('access_token', token);
  } catch (err) {}
}

/**
 * Remove access token from storage.
 */
export function clearAccessToken() {
  try {
    localStorage.removeItem('access_token');
  } catch (err) {}
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Low-level request helper with retries for idempotent GETs.
 * Normalizes JSON responses and throws a structured error.
 * @param {string} path - path relative to base (leading slash optional)
 * @param {{method?:string, headers?:Object, body?:any, query?:Object, retry?:number}} opts
 */
export async function apiRequest(path, opts = {}) {
  const { method = 'GET', headers = {}, body, query, retry = 0 } = opts;

  const url = new URL((path.startsWith('/') ? '' : '/') + path, BASE_URL);
  if (query && typeof query === 'object') {
    Object.keys(query).forEach((k) => {
      const v = query[k];
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    });
  }

  const token = getAccessToken();
  const defaultHeaders = {
    'Accept': 'application/json',
  };
  if (token) defaultHeaders['Authorization'] = `Bearer ${token}`;

  let bodyPayload = undefined;
  if (body !== undefined && body !== null) {
    if (body instanceof FormData) {
      bodyPayload = body;
      // do not set content-type; browser will add multipart boundary
    } else if (typeof body === 'object') {
      defaultHeaders['Content-Type'] = 'application/json';
      bodyPayload = JSON.stringify(body);
    } else {
      bodyPayload = body;
    }
  }

  const finalHeaders = { ...defaultHeaders, ...headers };

  try {
    const resp = await fetch(url.toString(), {
      method,
      headers: finalHeaders,
      body: bodyPayload,
      credentials: 'include',
    });

    const contentType = resp.headers.get('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
      data = await resp.json();
    } else {
      try {
        data = await resp.text();
      } catch (e) {
        data = null;
      }
    }

    if (!resp.ok) {
      const err = new Error('API error');
      err.status = resp.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    if (retry > 0 && method === 'GET') {
      await sleep(300);
      return apiRequest(path, { ...opts, retry: retry - 1 });
    }
    throw err;
  }
}

export default {
  BASE_URL,
  apiRequest,
  getAccessToken,
  setAccessToken,
  clearAccessToken,
};
