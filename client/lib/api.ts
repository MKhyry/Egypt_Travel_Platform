import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach token to every request (client-side only)
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      localStorage.removeItem('token');
      // Force reload to reset auth state and redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Places
export const placesAPI = {
  getAll: (filters?: { city?: string; category?: string }) =>
    api.get('/places', { params: filters }),
  getById: (id: string) =>
    api.get(`/places/${id}`),
  create: (data: any) => api.post('/places', data),
  update: (id: string, data: any) => api.put(`/places/${id}`, data),
  delete: (id: string) => api.delete(`/places/${id}`),
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
  addHotel: (tripId: string, data: { hotelId: string; checkIn: string; nights: number }) =>
    api.post(`/trips/${tripId}/hotels`, data),
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
  create: (data: any) => api.post('/hotels', data),
  update: (id: string, data: any) => api.put(`/hotels/${id}`, data),
  delete: (id: string) => api.delete(`/hotels/${id}`),
};

// Packages
export const packagesAPI = {
  getAll: (filters?: { tier?: string; region?: string; duration?: string }) =>
    api.get('/packages', { params: filters }),
  getById: (id: string) =>
    api.get(`/packages/${id}`),
  create: (data: any) => api.post('/packages', data),
  update: (id: string, data: any) => api.put(`/packages/${id}`, data),
  delete: (id: string) => api.delete(`/packages/${id}`),
};

// Bookings
export const bookingsAPI = {
  create: (data: {
    tripId?: string;
    packageId?: string;
    startDate: string;
    guests: number;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    notes?: string;
  }) => api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  getById: (id: string) => api.get(`/bookings/${id}`),
};

// Search
export const searchAPI = {
  search: (query: string) => api.get('/search', { params: { q: query } }),
};

export default api;
