jest.mock('react-native-mmkv', () => ({
  MMKV: class MMKV {
    getString() { return null; }
    set() {}
    delete() {}
  },
}));

import { useTripStore } from '../src/store/tripStore';
import { useAppStore } from '../src/store/useAppStore';
import { DEMO_TRIPS, resetDemoData } from '../src/services/demoData';

describe('TripStore', () => {
  beforeEach(() => {
    resetDemoData();
    useTripStore.getState().resetStore();
  });

  const authUser = (id: string = 'test-user') => {
    useAppStore.getState().setAuthenticated({
      id,
      name: 'Test',
      avatarUrl: null,
      phone: '+966',
      preferredLanguage: 'ar' as const,
      carModel: 'Test',
      carDetails: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  describe('fetchTrips', () => {
    it('loads published trips', async () => {
      expect(useTripStore.getState().trips).toHaveLength(0);

      await useTripStore.getState().fetchTrips();

      expect(useTripStore.getState().trips.length).toBeGreaterThan(0);
    });

    it('filters by category', async () => {
      await useTripStore.getState().fetchTrips({ category: 'offroad' });

      const { trips } = useTripStore.getState();
      expect(trips.length).toBeGreaterThan(0);
      expect(trips.every((t) => t.category === 'offroad')).toBe(true);
    });

    it('filters by search', async () => {
      await useTripStore.getState().fetchTrips({ search: 'وادي ديسي' });

      const { trips } = useTripStore.getState();
      expect(trips.length).toBeGreaterThan(0);
    });
  });

  describe('joinTrip', () => {
    it('joins a trip successfully', async () => {
      authUser();

      const result = await useTripStore.getState().joinTrip('trip-001');

      expect(result.ok).toBe(true);
      expect(useTripStore.getState().userTrips).toContain('trip-001');
    });

    it('is idempotent', async () => {
      authUser();

      await useTripStore.getState().joinTrip('trip-001');
      await useTripStore.getState().joinTrip('trip-001');

      const { userTrips } = useTripStore.getState();
      const count = userTrips.filter((id) => id === 'trip-001').length;
      expect(count).toBe(1);
    });

    it('increments participant count', async () => {
      authUser();
      await useTripStore.getState().fetchTrips();
      const initialCount = DEMO_TRIPS.find((t) => t.id === 'trip-001')!.current_participants;

      await useTripStore.getState().joinTrip('trip-001');

      const { trips } = useTripStore.getState();
      const updated = trips.find((t) => t.id === 'trip-001');
      expect(updated!.current_participants).toBe(initialCount + 1);
    });
  });

  describe('leaveTrip', () => {
    it('leaves a trip', async () => {
      authUser();

      await useTripStore.getState().joinTrip('trip-001');
      expect(useTripStore.getState().userTrips).toContain('trip-001');

      const result = await useTripStore.getState().leaveTrip('trip-001');

      expect(result.ok).toBe(true);
      expect(useTripStore.getState().userTrips).not.toContain('trip-001');
    });

    it('prevents organizer from leaving', async () => {
      authUser('user-001');

      await useTripStore.getState().joinTrip('trip-001');

      const result = await useTripStore.getState().leaveTrip('trip-001');
      expect(result.ok).toBe(false);
    });
  });

  describe('cancelTrip', () => {
    it('organizer can cancel a trip', async () => {
      authUser('user-001');
      await useTripStore.getState().fetchTrips();

      const result = await useTripStore.getState().cancelTrip('trip-001');

      expect(result.ok).toBe(true);
      const cancelled = useTripStore.getState().trips.find((t) => t.id === 'trip-001');
      expect(cancelled!.status).toBe('cancelled');
    });

    it('non-organizer cannot cancel', async () => {
      authUser('user-999');

      const result = await useTripStore.getState().cancelTrip('trip-001');

      expect(result.ok).toBe(false);
      expect(result.error).toBe('NOT_ORGANIZER');
    });

    it('is idempotent', async () => {
      authUser('user-001');

      await useTripStore.getState().cancelTrip('trip-001');
      const result = await useTripStore.getState().cancelTrip('trip-001');

      expect(result.ok).toBe(true);
    });
  });

  describe('createTrip', () => {
    it('creates a trip when authenticated', async () => {
      authUser();

      const result = await useTripStore.getState().createTrip({
        community_id: 'comm-001',
        title: 'Test Trip',
        description: 'A test trip',
        category: 'scenic' as const,
        destination: { name: 'Test', lat: 0, lng: 0 },
        meeting_point: { name: 'Test', lat: 0, lng: 0 },
        date: '2026-12-01',
        departure_time: '10:00',
        participant_limit: 5,
        estimated_cost: 100,
      });

      expect(result).not.toBeNull();
      expect(result!.title).toBe('Test Trip');
    });
  });

  describe('resetStore', () => {
    it('resets all state', async () => {
      authUser();

      await useTripStore.getState().fetchTrips();
      await useTripStore.getState().joinTrip('trip-001');

      useTripStore.getState().resetStore();

      const state = useTripStore.getState();
      expect(state.trips).toHaveLength(0);
      expect(state.userTrips).toHaveLength(0);
      expect(state.currentTrip).toBeNull();
      expect(state.participants).toHaveLength(0);
    });
  });
});
