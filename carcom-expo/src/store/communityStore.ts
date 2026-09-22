import { create } from 'zustand';
import { Community, CommunityMember, CreateCommunityInput, CommunityFilter } from '../types/community';
import { DEMO_COMMUNITIES } from '../services/demoData';
import { useAppStore } from './useAppStore';

interface CommunityState {
  communities: Community[];
  currentCommunity: Community | null;
  members: CommunityMember[];
  isLoading: boolean;
  error: string | null;
  userCommunities: string[];

  fetchCommunities: (filter?: CommunityFilter) => Promise<void>;
  fetchCommunity: (id: string) => Promise<void>;
  createCommunity: (input: CreateCommunityInput) => Promise<Community | null>;
  joinCommunity: (communityId: string) => Promise<void>;
  leaveCommunity: (communityId: string) => Promise<void>;
  fetchMembers: (communityId: string) => Promise<void>;
  getUserCommunities: () => Promise<void>;
  clearError: () => void;
}

// Simulated members for demo
const DEMO_MEMBERS: CommunityMember[] = [
  { community_id: 'comm-001', user_id: 'user-001', role: 'organizer', status: 'approved', joined_at: '2026-01-15T10:00:00Z' },
  { community_id: 'comm-001', user_id: 'user-002', role: 'member', status: 'approved', joined_at: '2026-01-20T10:00:00Z' },
  { community_id: 'comm-001', user_id: 'user-003', role: 'member', status: 'pending', joined_at: '2026-09-20T10:00:00Z' },
  { community_id: 'comm-002', user_id: 'user-004', role: 'organizer', status: 'approved', joined_at: '2026-02-20T10:00:00Z' },
];

export const useCommunityStore = create<CommunityState>((set, get) => ({
  communities: [],
  currentCommunity: null,
  members: [],
  isLoading: false,
  error: null,
  userCommunities: [],

  fetchCommunities: async (filter?: CommunityFilter) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 400));
      let result = [...DEMO_COMMUNITIES];

      if (filter?.search) {
        const s = filter.search.toLowerCase();
        result = result.filter(
          (c) => c.name.toLowerCase().includes(s) || c.car_model.toLowerCase().includes(s)
        );
      }
      if (filter?.car_model) {
        result = result.filter((c) => c.car_model === filter.car_model);
      }

      set({ communities: result, isLoading: false });
    } catch {
      set({ error: 'Failed to load communities', isLoading: false });
    }
  },

  fetchCommunity: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 300));
      const community = DEMO_COMMUNITIES.find((c) => c.id === id) || null;
      set({ currentCommunity: community, isLoading: false });
    } catch {
      set({ error: 'Failed to load community', isLoading: false });
    }
  },

  createCommunity: async (input: CreateCommunityInput) => {
    const { user } = useAppStore.getState();
    if (!user) return null;

    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 600));
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

      set((state) => ({
        communities: [newCommunity, ...state.communities],
        userCommunities: [...state.userCommunities, newCommunity.id],
        isLoading: false,
      }));
      return newCommunity;
    } catch {
      set({ error: 'Failed to create community', isLoading: false });
      return null;
    }
  },

  joinCommunity: async (communityId: string) => {
    const { user } = useAppStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 500));
      const community = DEMO_COMMUNITIES.find((c) => c.id === communityId);
      const isPublic = community?.visibility !== 'private';

      set((state) => ({
        userCommunities: isPublic ? [...state.userCommunities, communityId] : state.userCommunities,
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to join community', isLoading: false });
    }
  },

  leaveCommunity: async (communityId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 300));
      set((state) => ({
        userCommunities: state.userCommunities.filter((id) => id !== communityId),
        isLoading: false,
      }));
    } catch {
      set({ error: 'Failed to leave community', isLoading: false });
    }
  },

  fetchMembers: async (communityId: string) => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 300));
      const members = DEMO_MEMBERS.filter((m) => m.community_id === communityId);
      set({ members, isLoading: false });
    } catch {
      set({ error: 'Failed to load members', isLoading: false });
    }
  },

  getUserCommunities: async () => {
    set({ isLoading: true, error: null });
    try {
      await new Promise((r) => setTimeout(r, 300));
      // For demo, assume user is member of first 2 communities
      set({ userCommunities: ['comm-001', 'comm-002'], isLoading: false });
    } catch {
      set({ error: 'Failed to load your communities', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
