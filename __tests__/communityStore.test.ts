jest.mock('react-native-mmkv', () => ({
  MMKV: class MMKV {
    getString() { return null; }
    set() {}
    delete() {}
  },
}));

import { useCommunityStore } from '../src/store/communityStore';
import { useAppStore } from '../src/store/useAppStore';
import { resetDemoData } from '../src/services/demoData';

describe('CommunityStore', () => {
  beforeEach(() => {
    resetDemoData();
    useCommunityStore.getState().resetStore();
  });

  const authUser = () => {
    useAppStore.getState().setAuthenticated({
      id: 'test-user',
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

  describe('fetchCommunities', () => {
    it('loads communities successfully', async () => {
      expect(useCommunityStore.getState().communities).toHaveLength(0);

      await useCommunityStore.getState().fetchCommunities();

      expect(useCommunityStore.getState().communities.length).toBeGreaterThan(0);
    });

    it('filters by search term', async () => {
      await useCommunityStore.getState().fetchCommunities({ search: 'LC' });

      const { communities } = useCommunityStore.getState();
      expect(communities.length).toBeGreaterThan(0);
      expect(communities.every((c) => c.name.toLowerCase().includes('lc') || c.car_model.toLowerCase().includes('lc'))).toBe(true);
    });

    it('filters by car model', async () => {
      await useCommunityStore.getState().fetchCommunities({ car_model: 'Nissan Patrol' });

      const { communities } = useCommunityStore.getState();
      expect(communities.length).toBeGreaterThan(0);
      expect(communities.every((c) => c.car_model === 'Nissan Patrol')).toBe(true);
    });
  });

  describe('joinCommunity', () => {
    it('joins a public community', async () => {
      authUser();

      const result = await useCommunityStore.getState().joinCommunity('comm-001');

      expect(result.ok).toBe(true);
      expect(useCommunityStore.getState().userCommunities).toContain('comm-001');
    });

    it('is idempotent — joining twice does not duplicate', async () => {
      authUser();

      await useCommunityStore.getState().joinCommunity('comm-001');
      await useCommunityStore.getState().joinCommunity('comm-001');

      const { userCommunities } = useCommunityStore.getState();
      const count = userCommunities.filter((id) => id === 'comm-001').length;
      expect(count).toBe(1);
    });

    it('does not join private communities directly', async () => {
      authUser();

      const result = await useCommunityStore.getState().joinCommunity('comm-005');

      expect(result.ok).toBe(true);
      expect(useCommunityStore.getState().userCommunities).not.toContain('comm-005');
    });
  });

  describe('leaveCommunity', () => {
    it('leaves a community', async () => {
      authUser();

      await useCommunityStore.getState().joinCommunity('comm-001');
      expect(useCommunityStore.getState().userCommunities).toContain('comm-001');

      const result = await useCommunityStore.getState().leaveCommunity('comm-001');

      expect(result.ok).toBe(true);
      expect(useCommunityStore.getState().userCommunities).not.toContain('comm-001');
    });

    it('is idempotent — leaving when not a member succeeds', async () => {
      const result = await useCommunityStore.getState().leaveCommunity('comm-001');

      expect(result.ok).toBe(true);
    });
  });

  describe('createCommunity', () => {
    it('creates a community when authenticated', async () => {
      authUser();

      const result = await useCommunityStore.getState().createCommunity({
        name: 'Test Community',
        description: 'A test community',
        car_model: 'Test Car',
        visibility: 'public',
        rules: 'Be nice',
      });

      expect(result).not.toBeNull();
      expect(result!.name).toBe('Test Community');
    });

    it('returns null when not authenticated', async () => {
      useAppStore.getState().signOut();

      const result = await useCommunityStore.getState().createCommunity({
        name: 'Test',
        description: 'Test',
        car_model: 'Test',
        visibility: 'public',
        rules: 'Test',
      });

      expect(result).toBeNull();
    });
  });

  describe('resetStore', () => {
    it('resets all state to initial', async () => {
      authUser();

      await useCommunityStore.getState().fetchCommunities();
      await useCommunityStore.getState().joinCommunity('comm-001');

      useCommunityStore.getState().resetStore();

      const state = useCommunityStore.getState();
      expect(state.communities).toHaveLength(0);
      expect(state.userCommunities).toHaveLength(0);
      expect(state.currentCommunity).toBeNull();
      expect(state.members).toHaveLength(0);
    });
  });
});
