import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Places
export const placesAPI = {
  getAll: (filters?: { city?: string; category?: string }) =>
    api.get('/places', { params: filters }),
  getById: (id: string) =>
    api.get(`/places/${id}`),
};

// Auth
export const authAPI = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () =>
    api.get('/auth/me'),
};

// Trips
export const tripsAPI = {
  create: (data: { title: string; startDate: string; endDate: string; notes?: string }) =>
    api.post('/trips', data),
  getAll: () =>
    api.get('/trips'),
  getById: (id: string) =>
    api.get(`/trips/${id}`),
  addPlace: (tripId: string, data: { placeId: string; day: number }) =>
    api.post(`/trips/${tripId}/places`, data),
  removePlace: (tripId: string, placeId: string) =>
    api.delete(`/trips/${tripId}/places/${placeId}`),
  delete: (id: string) =>
    api.delete(`/trips/${id}`),
};

// Hotels
export const hotelsAPI = {
  getAll: (filters?: { city?: string; stars?: number; maxPrice?: number }) =>
    api.get('/hotels', { params: filters }),
  getById: (id: string) =>
    api.get(`/hotels/${id}`),
  getSuggestions: (tripId: string) =>
    api.get(`/hotels/suggestions/${tripId}`),
};

// Packages
export const packagesAPI = {
  getAll: (filters?: { tier?: string; region?: string; duration?: string }) =>
    api.get('/packages', { params: filters }),
  getById: (id: string) =>
    api.get(`/packages/${id}`),
};

export default api;
