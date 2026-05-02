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

interface TripHotel {
  _id: string;
  hotel: Place;
  checkIn: string;
  nights: number;
}

interface Trip {
  _id: string;
  title: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: string;
  places: TripPlace[];
  hotels: TripHotel[];
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
  addHotel: (tripId: string, hotelId: string, checkIn: string, nights: number) => Promise<void>;
  deleteTrip: (tripId: string) => Promise<void>;
}

export const useTripStore = create<TripStore>((set, get) => ({
  trips: [],
  activeTrip: null,
  isLoading: false,

  fetchTrips: async () => {
    set({ isLoading: true });
    const res = await tripsAPI.getAll();
    const allTrips = res.data.data;
    const currentActiveId = get().activeTrip?._id;
    const matching = allTrips.find((t: Trip) => t._id === currentActiveId);
    set({
      trips: allTrips,
      activeTrip: matching || (allTrips.filter((t: Trip) => t.status !== 'confirmed')[0] || null),
      isLoading: false,
    });
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
    set((state) => {
      if (state.activeTrip && state.activeTrip._id === tripId) {
        return { activeTrip: res.data.data };
      }
      return state;
    });
    await get().fetchTrips();
  },

  removePlace: async (tripId, placeEntryId) => {
    const res = await tripsAPI.removePlace(tripId, placeEntryId);
    set((state) => {
      if (state.activeTrip && state.activeTrip._id === tripId) {
        return { activeTrip: res.data.data };
      }
      return state;
    });
    await get().fetchTrips();
  },

  addHotel: async (tripId, hotelId, checkIn, nights) => {
    const res = await tripsAPI.addHotel(tripId, { hotelId, checkIn, nights });
    set((state) => {
      if (state.activeTrip && state.activeTrip._id === tripId) {
        return { activeTrip: res.data.data };
      }
      return state;
    });
    await get().fetchTrips();
  },

  deleteTrip: async (tripId: string) => {
    await tripsAPI.delete(tripId);
    set((state) => {
      const updatedTrips = state.trips.filter((t) => t._id !== tripId);
      return {
        trips: updatedTrips,
        activeTrip: state.activeTrip?._id === tripId ? (updatedTrips[0] || null) : state.activeTrip,
      };
    });
  },
}));
