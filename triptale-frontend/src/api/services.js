import { api } from './client';
import { Platform } from 'react-native';

export const AuthApi = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  register: ({ email, password, fullName }) =>
    api.post('/api/auth/register', { email, password, fullName }),
  logout: (refreshToken) => api.post('/api/auth/logout', { refreshToken }),
  me: () => api.get('/api/auth/me'),
};

export const UsersApi = {
  me: () => api.get('/api/users/me'),
  updateMe: (patch) => api.patch('/api/users/me', patch),
  getById: (id) => api.get(`/api/users/${id}`),
  trips: (id, page = 1, limit = 20) =>
    api.get(`/api/users/${id}/trips?page=${page}&limit=${limit}`),
  followStatus: (id) => api.get(`/api/users/${id}/follow`),
  follow: (id) => api.post(`/api/users/${id}/follow`),
  unfollow: (id) => api.delete(`/api/users/${id}/follow`),
  followers: (id) => api.get(`/api/users/${id}/followers`),
  following: (id) => api.get(`/api/users/${id}/following`),
};

export const CategoriesApi = {
  list: () => api.get('/api/categories'),
  getById: (id) => api.get(`/api/categories/${id}`),
};

export const TripsApi = {
  list: (query = {}) => {
    const qs = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
    });
    const q = qs.toString();
    return api.get(`/api/trips${q ? `?${q}` : ''}`);
  },
  getById: (id) => api.get(`/api/trips/${id}`),
  create: (body) => api.post('/api/trips', body),
  update: (id, body) => api.patch(`/api/trips/${id}`, body),
  remove: (id) => api.delete(`/api/trips/${id}`),
};

export const GuidesApi = {
  list: (tripId) => api.get(`/api/trips/${tripId}/guides`),
  replaceAll: (tripId, guides) => api.put(`/api/trips/${tripId}/guides`, { guides }),
  upsert: (tripId, guide) => api.post(`/api/trips/${tripId}/guides`, guide),
  remove: (tripId, guideId) => api.delete(`/api/trips/${tripId}/guides/${guideId}`),
};

export const SavedTripsApi = {
  list: () => api.get('/api/saved-trips'),
  save: (tripId, extras = {}) => api.post('/api/saved-trips', { tripId, ...extras }),
  unsave: (tripId) => api.delete(`/api/saved-trips/by-trip/${tripId}`),
  upsert: (tripId, patch) => api.patch(`/api/saved-trips/by-trip/${tripId}`, patch),
  update: (id, patch) => api.patch(`/api/saved-trips/${id}`, patch),
  isSaved: (tripId) => api.get(`/api/saved-trips/by-trip/${tripId}`),
};

export const CommentsApi = {
  list: (tripId) => api.get(`/api/trips/${tripId}/comments`),
  create: (tripId, content) => api.post(`/api/trips/${tripId}/comments`, { content }),
  remove: (commentId) => api.delete(`/api/comments/${commentId}`),
};

export const RatingsApi = {
  summary: (tripId) => api.get(`/api/trips/${tripId}/ratings`),
  rate: (tripId, value) => api.post(`/api/trips/${tripId}/ratings`, { value }),
  remove: (tripId) => api.delete(`/api/trips/${tripId}/ratings`),
};

const guessMime = (uri) => {
  const ext = (uri.split('.').pop() || '').toLowerCase().split('?')[0];
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'png') return 'image/png';
  if (ext === 'gif') return 'image/gif';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'mp4') return 'video/mp4';
  if (ext === 'mov') return 'video/quicktime';
  return 'image/jpeg';
};

export const MediaApi = {
  upload: async (tripId, uris, caption) => {
    const form = new FormData();
    const list = Array.isArray(uris) ? uris : [uris];

    if (Platform.OS === 'web') {
      await Promise.all(
        list.map(async (uri, i) => {
          const name = uri.split('/').pop() || `file-${i}.jpg`;
          const res = await fetch(uri);
          const blob = await res.blob();
          form.append('files', blob, name);
        })
      );
    } else {
      list.forEach((uri, i) => {
        const name = uri.split('/').pop() || `file-${i}.jpg`;
        form.append('files', {
          uri,
          name,
          type: guessMime(uri),
        });
      });
    }

    if (caption) form.append('caption', caption);
    return api.post(`/api/trips/${tripId}/media`, form);
  },
  remove: (mediaId) => api.delete(`/api/media/${mediaId}`),
};
