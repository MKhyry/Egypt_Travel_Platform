import { create } from 'zustand';
import { tripsAPI } from '@/lib/api';

interface Place {
  _id: string;
  name: string;
  city: string;
  images: string[];
}

interface TripPlace {
  _id: string;
  place: Place;
  day: number;
  order: number;
}

interface Trip {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: string;
  places: TripPlace[];
  notes: string;
}

interface TripStore {
  trips: Trip[];
  activeTrip: Trip | null;
  isLoading: boolean;
  fetchTrips: () => Promise<void>;
  fetchTrip: (id: string) => Promise<void>;
  createTrip: (data: { title: string; startDate: string; endDate: string; notes?: string }) => Promise<Trip>;
  addPlace: (tripId: string, placeId: string, day: number) => Promise<void>;
  removePlace: (tripId: string, placeEntryId: string) => Promise<void>;
}

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  activeTrip: null,
  isLoading: false,

  fetchTrips: async () => {
    set({ isLoading: true });
    const res = await tripsAPI.getAll();
    set({ trips: res.data.data, isLoading: false });
  },

  fetchTrip: async (id) => {
    set({ isLoading: true });
    const res = await tripsAPI.getById(id);
    set({ activeTrip: res.data.data, isLoading: false });
  },

  createTrip: async (data) => {
    const res = await tripsAPI.create(data);
    const newTrip = res.data.data;
    set((state) => ({ trips: [newTrip, ...state.trips] }));
    return newTrip;
  },

  addPlace: async (tripId, placeId, day) => {
    const res = await tripsAPI.addPlace(tripId, { placeId, day });
    set({ activeTrip: res.data.data });
  },

  removePlace: async (tripId, placeEntryId) => {
    const res = await tripsAPI.removePlace(tripId, placeEntryId);
    set({ activeTrip: res.data.data });
  },
}));