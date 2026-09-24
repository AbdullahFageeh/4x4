import { create } from 'zustand';
import { Trip, TripParticipant, CreateTripInput, TripFilter, TripOperationState, TripValidationError } from '../types/trip';
import { DEMO_TRIPS, DEMO_PARTICIPANTS, resetDemoData } from '../services/demoData';
import { useAppStore } from './useAppStore';

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  participants: TripParticipant[];
  userTrips: string[];
  ops: TripOperationState;

  fetchTrips: (filter?: TripFilter) => Promise<void>;
  fetchTrip: (id: string) => Promise<void>;
  createTrip: (input: CreateTripInput) => Promise<Trip | null>;
  joinTrip: (tripId: string) => Promise<{ ok: boolean; error?: string }>;
  leaveTrip: (tripId: string) => Promise<{ ok: boolean; error?: string }>;
  declineTrip: (tripId: string) => Promise<{ ok: boolean; error?: string }>;
  cancelTrip: (tripId: string) => Promise<{ ok: boolean; error?: string }>;
  shareLocation: (tripId: string, lat: number, lng: number) => Promise<{ ok: boolean; error?: string }>;
  stopSharingLocation: (tripId: string) => Promise<void>;
  fetchParticipants: (tripId: string) => Promise<void>;
  getUserTrips: () => Promise<void>;
  resetStore: () => void;
  clearError: () => void;
}

const initialOps: TripOperationState = {
  fetchStatus: 'idle',
  createStatus: 'idle',
  joinStatus: 'idle',
  declineStatus: 'idle',
  cancelStatus: 'idle',
  participantsStatus: 'idle',
  locationStatus: 'idle',
};

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Domain validation helpers
function validateTripAction(trip: Trip | undefined, action: 'join' | 'leave' | 'decline' | 'cancel', userId: string): TripValidationError | null {
  if (!trip) return { code: 'TRIP_CANCELLED', message: 'Trip not found' };
  if (trip.status === 'cancelled' && action !== 'join' && action !== 'cancel') return { code: 'TRIP_CANCELLED', message: 'Trip has been cancelled' };
  if (trip.status === 'completed') return { code: 'TRIP_COMPLETED', message: 'Trip has already completed' };
  if (action === 'cancel' && trip.created_by !== userId) return { code: 'NOT_ORGANIZER', message: 'Only the organizer can cancel this trip' };
  if (action === 'join' && trip.current_participants >= trip.participant_limit) return { code: 'TRIP_FULL', message: 'This trip is full' };
  return null;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  currentTrip: null,
  participants: [],
  userTrips: [],
  ops: { ...initialOps },

  fetchTrips: async (filter?: TripFilter) => {
    set((s) => ({ ops: { ...s.ops, fetchStatus: 'loading' } }));
    try {
      await delay(400);
      let result = [...DEMO_TRIPS].filter((t) => t.status === 'published');

      if (filter?.search) {
        const search = filter.search.toLowerCase();
        result = result.filter(
          (t) => t.title.toLowerCase().includes(search) || t.description.toLowerCase().includes(search)
        );
      }
      if (filter?.category) {
        result = result.filter((t) => t.category === filter.category);
      }
      if (filter?.community_id) {
        result = result.filter((t) => t.community_id === filter.community_id);
      }

      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      set((s) => ({ trips: result, ops: { ...s.ops, fetchStatus: 'idle' } }));
    } catch {
      set((s) => ({ ops: { ...s.ops, fetchStatus: 'error' } }));
    }
  },

  fetchTrip: async (id: string) => {
    set((s) => ({ ops: { ...s.ops, fetchStatus: 'loading' } }));
    try {
      await delay(300);
      const trip = DEMO_TRIPS.find((t) => t.id === id) || null;
      set((s) => ({ currentTrip: trip, ops: { ...s.ops, fetchStatus: 'idle' } }));
    } catch {
      set((s) => ({ ops: { ...s.ops, fetchStatus: 'error' } }));
    }
  },

  createTrip: async (input: CreateTripInput) => {
    const { user } = useAppStore.getState();
    if (!user) return null;

    set((s) => ({ ops: { ...s.ops, createStatus: 'loading' } }));
    try {
      await delay(600);
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

      DEMO_TRIPS.unshift(newTrip);
      DEMO_PARTICIPANTS.push({ trip_id: newTrip.id, user_id: user.id, status: 'going', joined_at: new Date().toISOString() });

      set((s) => ({
        trips: [newTrip, ...s.trips],
        userTrips: [...s.userTrips, newTrip.id],
        ops: { ...s.ops, createStatus: 'idle' },
      }));
      return newTrip;
    } catch {
      set((s) => ({ ops: { ...s.ops, createStatus: 'error' } }));
      return null;
    }
  },

  joinTrip: async (tripId: string) => {
    const { user } = useAppStore.getState();
    if (!user) return { ok: false, error: 'not_authenticated' };

    // Idempotency
    const { userTrips } = get();
    if (userTrips.includes(tripId)) return { ok: true };

    const trip = DEMO_TRIPS.find((t) => t.id === tripId);
    const validationError = validateTripAction(trip, 'join', user.id);
    if (validationError) return { ok: false, error: validationError.code };

    set((s) => ({ ops: { ...s.ops, joinStatus: 'loading' } }));
    try {
      await delay(500);
      // Update participant count
      const idx = DEMO_TRIPS.findIndex((t) => t.id === tripId);
      if (idx >= 0) {
        DEMO_TRIPS[idx] = { ...DEMO_TRIPS[idx], current_participants: DEMO_TRIPS[idx].current_participants + 1 };
      }
      DEMO_PARTICIPANTS.push({ trip_id: tripId, user_id: user.id, status: 'going', joined_at: new Date().toISOString() });

      set((s) => {
        const updatedTrip = idx >= 0 ? DEMO_TRIPS[idx] : null;
        return {
          userTrips: [...s.userTrips, tripId],
          trips: s.trips.map((t) => (t.id === tripId ? updatedTrip! : t)),
          currentTrip: s.currentTrip?.id === tripId ? updatedTrip : s.currentTrip,
          ops: { ...s.ops, joinStatus: 'success' },
        };
      });
      return { ok: true };
    } catch {
      set((s) => ({ ops: { ...s.ops, joinStatus: 'error' } }));
      return { ok: false, error: 'join_failed' };
    }
  },

  leaveTrip: async (tripId: string) => {
    const { user } = useAppStore.getState();
    if (!user) return { ok: false, error: 'not_authenticated' };

    // Idempotency
    const { userTrips } = get();
    if (!userTrips.includes(tripId)) return { ok: true };

    const trip = DEMO_TRIPS.find((t) => t.id === tripId);
    if (!trip || trip.created_by === user.id) {
      return { ok: false, error: 'organizer cannot leave — cancel instead' };
    }

    set((s) => ({ ops: { ...s.ops, joinStatus: 'loading' } }));
    try {
      await delay(300);
      const idx = DEMO_TRIPS.findIndex((t) => t.id === tripId);
      if (idx >= 0) {
        DEMO_TRIPS[idx] = { ...DEMO_TRIPS[idx], current_participants: Math.max(0, DEMO_TRIPS[idx].current_participants - 1) };
      }
      const pIdx = DEMO_PARTICIPANTS.findIndex((p) => p.trip_id === tripId && p.user_id === user.id);
      if (pIdx >= 0) DEMO_PARTICIPANTS.splice(pIdx, 1);

      set((s) => ({
        userTrips: s.userTrips.filter((id) => id !== tripId),
        trips: s.trips.map((t) => (t.id === tripId ? { ...t, current_participants: Math.max(0, t.current_participants - 1) } : t)),
        ops: { ...s.ops, joinStatus: 'success' },
      }));
      return { ok: true };
    } catch {
      set((s) => ({ ops: { ...s.ops, joinStatus: 'error' } }));
      return { ok: false, error: 'leave_failed' };
    }
  },

  declineTrip: async (tripId: string) => {
    const { user } = useAppStore.getState();
    if (!user) return { ok: false, error: 'not_authenticated' };

    // Idempotency
    const { userTrips } = get();
    if (!userTrips.includes(tripId)) return { ok: true };

    set((s) => ({ ops: { ...s.ops, declineStatus: 'loading' } }));
    try {
      await delay(300);
      set((s) => ({
        userTrips: s.userTrips.filter((id) => id !== tripId),
        ops: { ...s.ops, declineStatus: 'success' },
      }));
      return { ok: true };
    } catch {
      set((s) => ({ ops: { ...s.ops, declineStatus: 'error' } }));
      return { ok: false, error: 'decline_failed' };
    }
  },

  cancelTrip: async (tripId: string) => {
    const { user } = useAppStore.getState();
    if (!user) return { ok: false, error: 'not_authenticated' };

    // Idempotency
    const { trips } = get();
    const existingTrip = trips.find((t) => t.id === tripId);
    if (existingTrip?.status === 'cancelled') return { ok: true };

    const trip = DEMO_TRIPS.find((t) => t.id === tripId);
    const validationError = validateTripAction(trip, 'cancel', user.id);
    if (validationError) return { ok: false, error: validationError.code };

    set((s) => ({ ops: { ...s.ops, cancelStatus: 'loading' } }));
    try {
      await delay(300);
      const idx = DEMO_TRIPS.findIndex((t) => t.id === tripId);
      if (idx >= 0) {
        DEMO_TRIPS[idx] = { ...DEMO_TRIPS[idx], status: 'cancelled', updated_at: new Date().toISOString() };
      }

      set((s) => ({
        trips: s.trips.map((t) => (t.id === tripId ? { ...t, status: 'cancelled' as const } : t)),
        currentTrip: s.currentTrip?.id === tripId ? { ...s.currentTrip, status: 'cancelled' as const } : s.currentTrip,
        userTrips: s.userTrips.filter((id) => id !== tripId),
        ops: { ...s.ops, cancelStatus: 'success' },
      }));
      return { ok: true };
    } catch {
      set((s) => ({ ops: { ...s.ops, cancelStatus: 'error' } }));
      return { ok: false, error: 'cancel_failed' };
    }
  },

  shareLocation: async (_tripId: string, _lat: number, _lng: number) => {
    const { user } = useAppStore.getState();
    if (!user) return { ok: false, error: 'not_authenticated' };

    set((s) => ({ ops: { ...s.ops, locationStatus: 'sharing' } }));
    try {
      await delay(300);
      // In demo mode, just track that sharing is active
      set((s) => ({ ops: { ...s.ops, locationStatus: 'sharing' } }));
      return { ok: true };
    } catch {
      set((s) => ({ ops: { ...s.ops, locationStatus: 'error' } }));
      return { ok: false, error: 'location_failed' };
    }
  },

  stopSharingLocation: async (_tripId: string) => {
    set((s) => ({ ops: { ...s.ops, locationStatus: 'stopped' } }));
  },

  fetchParticipants: async (tripId: string) => {
    set((s) => ({ ops: { ...s.ops, participantsStatus: 'loading' } }));
    try {
      await delay(300);
      const participants = DEMO_PARTICIPANTS.filter((p) => p.trip_id === tripId) as TripParticipant[];
      set((s) => ({ participants, ops: { ...s.ops, participantsStatus: 'idle' } }));
    } catch {
      set((s) => ({ ops: { ...s.ops, participantsStatus: 'error' } }));
    }
  },

  getUserTrips: async () => {
    set((s) => ({ ops: { ...s.ops, fetchStatus: 'loading' } }));
    try {
      await delay(300);
      set({ userTrips: ['trip-001', 'trip-002'], ops: { ...get().ops, fetchStatus: 'idle' } });
    } catch {
      set((s) => ({ ops: { ...s.ops, fetchStatus: 'error' } }));
    }
  },

  resetStore: () => {
    resetDemoData();
    set({
      trips: [],
      currentTrip: null,
      participants: [],
      userTrips: [],
      ops: { ...initialOps },
    });
  },

  clearError: () => set({ ops: { ...initialOps } }),
}));
