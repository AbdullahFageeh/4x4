import { DEMO_COMMUNITIES, DEMO_TRIPS, resetDemoData } from '../src/services/demoData';
import { Community } from '../src/types/community';
import { Trip } from '../src/types/trip';

describe('DemoData', () => {
  describe('Initial data', () => {
    it('has 6 communities', () => {
      expect(DEMO_COMMUNITIES.length).toBeGreaterThanOrEqual(6);
    });

    it('has 4 trips', () => {
      expect(DEMO_TRIPS.length).toBeGreaterThanOrEqual(4);
    });

    it('all communities have unique IDs', () => {
      const ids = DEMO_COMMUNITIES.map((c) => c.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('all trips have unique IDs', () => {
      const ids = DEMO_TRIPS.map((t) => t.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('all trips have positive participant limits', () => {
      DEMO_TRIPS.forEach((t) => {
        expect(t.participant_limit).toBeGreaterThan(0);
      });
    });

    it('all trips have valid statuses', () => {
      const validStatuses = ['draft', 'published', 'cancelled', 'completed'];
      DEMO_TRIPS.forEach((t) => {
        expect(validStatuses).toContain(t.status);
      });
    });
  });

  describe('resetDemoData', () => {
    it('restores initial state', () => {
      const initialCommunityCount = DEMO_COMMUNITIES.length;
      const initialTripCount = DEMO_TRIPS.length;

      // Mutate
      DEMO_COMMUNITIES.push({ id: 'test', name: 'Test' } as Community);
      DEMO_TRIPS.push({ id: 'test', title: 'Test' } as Trip);

      expect(DEMO_COMMUNITIES.length).toBe(initialCommunityCount + 1);
      expect(DEMO_TRIPS.length).toBe(initialTripCount + 1);

      // Reset
      resetDemoData();

      expect(DEMO_COMMUNITIES.length).toBe(initialCommunityCount);
      expect(DEMO_TRIPS.length).toBe(initialTripCount);
    });
  });
});
