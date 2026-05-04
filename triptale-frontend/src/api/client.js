import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBaseUrl } from './config';

const TOKEN_KEY = 'triptale.accessToken';
const REFRESH_KEY = 'triptale.refreshToken';

export const setTokens = async (accessToken, refreshToken) => {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, accessToken || ''],
    [REFRESH_KEY, refreshToken || ''],
  ]);
};

export const clearTokens = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY]);
};

export const getAccessToken = () => AsyncStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => AsyncStorage.getItem(REFRESH_KEY);

const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;
  try {
    const res = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    await setTokens(data.accessToken, data.refreshToken);
    return data.accessToken;
  } catch {
    return null;
  }
};

const doFetch = async (path, options = {}, retry = true) => {
  const token = await getAccessToken();
  const headers = {
    ...(options.body && !(options.body instanceof FormData)
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(options.headers || {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = path.startsWith('http') ? path : `${getApiBaseUrl()}${path}`;
  const res = await fetch(url, { ...options, headers });

  if (res.status === 401 && retry && token) {
    const newToken = await refreshAccessToken();
    if (newToken) return doFetch(path, options, false);
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const message = (data && (data.message || data.error)) || `HTTP ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
};

export const api = {
  get: (path, options) => doFetch(path, { method: 'GET', ...(options || {}) }),
  post: (path, body, options) =>
    doFetch(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
      ...(options || {}),
    }),
  patch: (path, body, options) =>
    doFetch(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
      ...(options || {}),
    }),
  put: (path, body, options) =>
    doFetch(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
      ...(options || {}),
    }),
  delete: (path, options) => doFetch(path, { method: 'DELETE', ...(options || {}) }),
};
