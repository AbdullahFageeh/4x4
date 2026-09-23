import { create } from 'zustand';
import { Trip, TripParticipant, CreateTripInput, TripFilter } from '../types/trip';
import { DEMO_TRIPS } from '../services/demoData';
import { useAppStore } from './useAppStore';

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  participants: TripParticipant[];
  isLoading: boolean;
  error: string | null;
  userTrips: string[];

  fetchTrips: (filter?: TripFilter) => Promise<void>;
  fetchTrip: (id: string) => Promise<void>;
  createTrip: (input: CreateTripInput) => Promise<Trip | null>;
  joinTrip: (tripId: string) => Promise<void>;
  declineTrip: (tripId: string) => Promise<void>;
  cancelTrip: (tripId: string) => Promise<void>;
  shareLocation: (tripId: string, lat: number, lng: number) => Promise<void>;
  fetchParticipants: (tripId: string) => Promise<void>;
  getUserTrips: () => Promise<void>;
  clearError: () => void;
}

const DEMO_PARTICIPANTS: TripParticipant[] = [
  { trip_id: 'trip-001', user_id: 'user-001', status: 'going', joined_at: '2026-09-15T10:00:00Z' },
  { trip_id: 'trip-001', user_id: 'user-002', status: 'going', joined_at: '2026-09-16T10:00:00Z' },
  { trip_id: 'trip-001', user_id: 'user-003', status: 'waitlisted', joined_at: '2026-09-18T10:00:00Z' },
  { trip_id: 'trip-002', user_id: 'user-001', status: 'going', joined_at: '2026-09-18T10:00:00Z' },
  { trip_id: 'trip-003', user_id: 'user-004', status: 'going', joined_at: '2026-09-20T10:00:00Z' },
];

export const useTripStore = create<TripState>((set) => ({
  trips: [],
  currentTrip: null,
  participants: [],
  isLoading: false,
  error: null,
  userTrips: [],

  fetchTrips: async (filter?: TripFilter) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 400));
      let result = [...DEMO_TRIPS].filter((t) => t.status === 'published');

      if (filter?.search) {
        const s = filter.search.toLowerCase();
        result = result.filter(
          (t) => t.title.toLowerCase().includes(s) || t.description.toLowerCase().includes(s)
        );
      }
      if (filter?.category) {
        result = result.filter((t) => t.category === filter.category);
      }
      if (filter?.community_id) {
        result = result.filter((t) => t.community_id === filter.community_id);
      }

      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      set({ trips: result, isLoading: false });
    } catch {
      set({ error: 'Failed to load trips', isLoading: false });
    }
  },

  fetchTrip: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 300));
      const trip = DEMO_TRIPS.find((t) => t.id === id) || null;
      set({ currentTrip: trip, isLoading: false });
    } catch {
      set({ error: 'Failed to load trip', isLoading: false });
    }
  },

  createTrip: async (input: CreateTripInput) => {
    const { user } = useAppStore.getState();
    if (!user) return null;

    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 600));
      const newTrip: Trip = {
        id: `trip-${Date.now()}`,
        community_id: input.community_id,
        title: input.title,
        description: input.description,
        category: input.category,
        destination: input.destination,
        meeting_point: input.meeting_point,
        route_stops: input.route_stops || [],
        date: input.date,
        departure_time: input.departure_time,
        estimated_return: input.estimated_return || null,
        participant_limit: input.participant_limit,
        current_participants: 1,
        estimated_cost: input.estimated_cost,
        cost_currency: 'SAR',
        status: 'published',
        itinerary: input.itinerary || '',
        preparation_checklist: input.preparation_checklist || [],
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      set((state) => ({
        trips: [newTrip, ...state.trips],
        userTrips: [...state.userTrips, newTrip.id],
        isLoading: false,
      }));
      return newTrip;
    } catch {
      set({ error: 'Failed to create trip', isLoading: false });
      return null;
    }
  },

  joinTrip: async (tripId: string) => {
    const { user } = useAppStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 500));
      const trip = DEMO_TRIPS.find((t) => t.id === tripId);
      const isFull = trip ? trip.current_participants >= trip.participant_limit : false;

      set((state) => ({
        userTrips: isFull ? state.userTrips : [...state.userTrips, tripId],
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to join trip', isLoading: false });
    }
  },

  declineTrip: async (tripId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        userTrips: state.userTrips.filter((id) => id !== tripId),
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to decline trip', isLoading: false });
    }
  },

  cancelTrip: async (tripId: string) => {
    const { user } = useAppStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        trips: state.trips.map((trip) =>
          trip.id === tripId ? { ...trip, status: 'cancelled' } : trip
        ),
        currentTrip:
          state.currentTrip?.id === tripId
            ? { ...state.currentTrip, status: 'cancelled' }
            : state.currentTrip,
        userTrips: state.userTrips.filter((id) => id !== tripId),
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to cancel trip', isLoading: false });
    }
  },

  shareLocation: async (_tripId: string, _lat: number, _lng: number) => {
    const { user } = useAppStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 300));
      set({ isLoading: false });
    } catch {
      set({ error: 'Failed to share location', isLoading: false });
    }
  },

  fetchParticipants: async (tripId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 300));
      const participants = DEMO_PARTICIPANTS.filter((p) => p.trip_id === tripId);
      set({ participants, isLoading: false });
    } catch {
      set({ error: 'Failed to load participants', isLoading: false });
    }
  },

  getUserTrips: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 300));
      set({ userTrips: ['trip-001', 'trip-002'], isLoading: false });
    } catch {
      set({ error: 'Failed to load your trips', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
