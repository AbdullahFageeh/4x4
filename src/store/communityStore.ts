import { create } from 'zustand';
import { Community, CommunityMember, CreateCommunityInput, CommunityFilter, CommunityOperationState } from '../types/community';
import { DEMO_COMMUNITIES, resetDemoData } from '../services/demoData';
import { useAppStore } from './useAppStore';

interface CommunityState {
  communities: Community[];
  currentCommunity: Community | null;
  members: CommunityMember[];
  userCommunities: string[];
  ops: CommunityOperationState;

  fetchCommunities: (filter?: CommunityFilter) => Promise<void>;
  fetchCommunity: (id: string) => Promise<void>;
  createCommunity: (input: CreateCommunityInput) => Promise<Community | null>;
  joinCommunity: (communityId: string) => Promise<{ ok: boolean; error?: string }>;
  leaveCommunity: (communityId: string) => Promise<{ ok: boolean; error?: string }>;
  fetchMembers: (communityId: string) => Promise<void>;
  getUserCommunities: () => Promise<void>;
  resetStore: () => void;
  clearError: () => void;
}

const initialOps: CommunityOperationState = {
  fetchStatus: 'idle',
  createStatus: 'idle',
  joinStatus: 'idle',
  leaveStatus: 'idle',
};

// Simulated members for demo
const DEMO_MEMBERS: CommunityMember[] = [
  { community_id: 'comm-001', user_id: 'user-001', role: 'organizer', status: 'approved', joined_at: '2026-01-15T10:00:00Z' },
  { community_id: 'comm-001', user_id: 'user-002', role: 'member', status: 'approved', joined_at: '2026-01-20T10:00:00Z' },
  { community_id: 'comm-001', user_id: 'user-003', role: 'member', status: 'pending', joined_at: '2026-09-20T10:00:00Z' },
  { community_id: 'comm-002', user_id: 'user-004', role: 'organizer', status: 'approved', joined_at: '2026-02-20T10:00:00Z' },
];

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const useCommunityStore = create<CommunityState>((set, get) => ({
  communities: [],
  currentCommunity: null,
  members: [],
  userCommunities: [],
  ops: { ...initialOps },

  fetchCommunities: async (filter?: CommunityFilter) => {
    set((s) => ({ ops: { ...s.ops, fetchStatus: 'loading' } }));
    try {
      await delay(400);
      let result = [...DEMO_COMMUNITIES];

      if (filter?.search) {
        const search = filter.search.toLowerCase();
        result = result.filter(
          (c) => c.name.toLowerCase().includes(search) || c.car_model.toLowerCase().includes(search)
        );
      }
      if (filter?.car_model) {
        result = result.filter((c) => c.car_model === filter.car_model);
      }

      set((s) => ({ communities: result, ops: { ...s.ops, fetchStatus: 'idle' } }));
    } catch {
      set((s) => ({ ops: { ...s.ops, fetchStatus: 'error' } }));
    }
  },

  fetchCommunity: async (id: string) => {
    set((s) => ({ ops: { ...s.ops, fetchStatus: 'loading' } }));
    try {
      await delay(300);
      const community = DEMO_COMMUNITIES.find((c) => c.id === id) || null;
      set((s) => ({ currentCommunity: community, ops: { ...s.ops, fetchStatus: 'idle' } }));
    } catch {
      set((s) => ({ ops: { ...s.ops, fetchStatus: 'error' } }));
    }
  },

  createCommunity: async (input: CreateCommunityInput) => {
    const { user } = useAppStore.getState();
    if (!user) return null;

    set((s) => ({ ops: { ...s.ops, createStatus: 'loading' } }));
    try {
      await delay(600);
      const newCommunity: Community = {
        id: `comm-${Date.now()}`,
        name: input.name,
        description: input.description,
        car_model: input.car_model,
        cover_image_url: null,
        visibility: input.visibility,
        invite_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        rules: input.rules,
        member_count: 1,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Add to demo data so it persists across sessions
      DEMO_COMMUNITIES.unshift(newCommunity);

      set((s) => ({
        communities: [newCommunity, ...s.communities],
        userCommunities: [...s.userCommunities, newCommunity.id],
        ops: { ...s.ops, createStatus: 'idle' },
      }));
      return newCommunity;
    } catch {
      set((s) => ({ ops: { ...s.ops, createStatus: 'error' } }));
      return null;
    }
  },

  joinCommunity: async (communityId: string) => {
    const { user } = useAppStore.getState();
    if (!user) return { ok: false, error: 'not_authenticated' };

    // Idempotency: already joined?
    const { userCommunities } = get();
    if (userCommunities.includes(communityId)) {
      return { ok: true };
    }

    set((s) => ({ ops: { ...s.ops, joinStatus: 'loading' } }));
    try {
      await delay(500);
      const community = DEMO_COMMUNITIES.find((c) => c.id === communityId);
      const isPublic = community?.visibility !== 'private';

      if (isPublic) {
        set((s) => ({
          userCommunities: [...s.userCommunities, communityId],
          ops: { ...s.ops, joinStatus: 'success' },
        }));
      } else {
        // Private: pending approval
        set((s) => ({
          ops: { ...s.ops, joinStatus: 'success' },
        }));
      }
      return { ok: true };
    } catch {
      set((s) => ({ ops: { ...s.ops, joinStatus: 'error' } }));
      return { ok: false, error: 'join_failed' };
    }
  },

  leaveCommunity: async (communityId: string) => {
    // Idempotency: not a member?
    const { userCommunities } = get();
    if (!userCommunities.includes(communityId)) {
      return { ok: true };
    }

    set((s) => ({ ops: { ...s.ops, leaveStatus: 'loading' } }));
    try {
      await delay(300);
      set((s) => ({
        userCommunities: s.userCommunities.filter((id) => id !== communityId),
        currentCommunity: s.currentCommunity?.id === communityId ? null : s.currentCommunity,
        ops: { ...s.ops, leaveStatus: 'success' },
      }));
      return { ok: true };
    } catch {
      set((s) => ({ ops: { ...s.ops, leaveStatus: 'error' } }));
      return { ok: false, error: 'leave_failed' };
    }
  },

  fetchMembers: async (communityId: string) => {
    set((s) => ({ ops: { ...s.ops, fetchStatus: 'loading' } }));
    try {
      await delay(300);
      const members = DEMO_MEMBERS.filter((m) => m.community_id === communityId);
      set((s) => ({ members, ops: { ...s.ops, fetchStatus: 'idle' } }));
    } catch {
      set((s) => ({ ops: { ...s.ops, fetchStatus: 'error' } }));
    }
  },

  getUserCommunities: async () => {
    set((s) => ({ ops: { ...s.ops, fetchStatus: 'loading' } }));
    try {
      await delay(300);
      // For demo, assume user is member of first 2 communities
      set({ userCommunities: ['comm-001', 'comm-002'], ops: { ...get().ops, fetchStatus: 'idle' } });
    } catch {
      set((s) => ({ ops: { ...s.ops, fetchStatus: 'error' } }));
    }
  },

  resetStore: () => {
    resetDemoData();
    set({
      communities: [],
      currentCommunity: null,
      members: [],
      userCommunities: [],
      ops: { ...initialOps },
    });
  },

  clearError: () => set({ ops: { ...initialOps } }),
}));
