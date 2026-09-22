import { create } from 'zustand';
import { Trip, TripParticipant, CreateTripInput, TripFilter } from '../types/trip';
import { tripService } from '../services/tripService';
import { useAppStore } from './useAppStore';

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  participants: TripParticipant[];
  isLoading: boolean;
  error: string | null;

  fetchTrips: (filter?: TripFilter) => Promise<void>;
  fetchTrip: (id: string) => Promise<void>;
  createTrip: (input: CreateTripInput) => Promise<Trip | null>;
  joinTrip: (tripId: string) => Promise<void>;
  declineTrip: (tripId: string) => Promise<void>;
  fetchParticipants: (tripId: string) => Promise<void>;
  clearError: () => void;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  currentTrip: null,
  participants: [],
  isLoading: false,
  error: null,

  fetchTrips: async (filter?: TripFilter) => {
    set({ isLoading: true, error: null });
    try {
      const trips = await tripService.getTrips(filter);
      set({ trips, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load trips', isLoading: false });
    }
  },

  fetchTrip: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const trip = await tripService.getTrip(id);
      set({ currentTrip: trip, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load trip', isLoading: false });
    }
  },

  createTrip: async (input: CreateTripInput) => {
    const { user } = useAppStore.getState();
    if (!user) return null;

    set({ isLoading: true, error: null });
    try {
      const trip = await tripService.createTrip(input, user.id);
      set((state) => ({
        trips: [trip, ...state.trips],
        isLoading: false,
      }));
      return trip;
    } catch (error) {
      set({ error: 'Failed to create trip', isLoading: false });
      return null;
    }
  },

  joinTrip: async (tripId: string) => {
    const { user } = useAppStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      await tripService.joinTrip(tripId, user.id);
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to join trip', isLoading: false });
    }
  },

  declineTrip: async (tripId: string) => {
    const { user } = useAppStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      await tripService.declineTrip(tripId, user.id);
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to decline trip', isLoading: false });
    }
  },

  fetchParticipants: async (tripId: string) => {
    set({ isLoading: true, error: null });
    try {
      const participants = await tripService.getParticipants(tripId);
      set({ participants, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load participants', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
