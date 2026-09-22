import { create } from 'zustand';
import { Community, CommunityMember, CreateCommunityInput, CommunityFilter } from '../types/community';
import { communityService } from '../services/communityService';
import { useAppStore } from './useAppStore';

interface CommunityState {
  communities: Community[];
  currentCommunity: Community | null;
  members: CommunityMember[];
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchCommunities: (filter?: CommunityFilter) => Promise<void>;
  fetchCommunity: (id: string) => Promise<void>;
  createCommunity: (input: CreateCommunityInput) => Promise<Community | null>;
  joinCommunity: (communityId: string) => Promise<void>;
  fetchMembers: (communityId: string) => Promise<void>;
  getUserCommunities: () => Promise<void>;
  clearError: () => void;
}

export const useCommunityStore = create<CommunityState>((set, get) => ({
  communities: [],
  currentCommunity: null,
  members: [],
  isLoading: false,
  error: null,

  fetchCommunities: async (filter?: CommunityFilter) => {
    set({ isLoading: true, error: null });
    try {
      const communities = await communityService.getCommunities(filter);
      set({ communities, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load communities', isLoading: false });
    }
  },

  fetchCommunity: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const community = await communityService.getCommunity(id);
      set({ currentCommunity: community, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load community', isLoading: false });
    }
  },

  createCommunity: async (input: CreateCommunityInput) => {
    const { user } = useAppStore.getState();
    if (!user) return null;

    set({ isLoading: true, error: null });
    try {
      const community = await communityService.createCommunity(input, user.id);
      set((state) => ({
        communities: [community, ...state.communities],
        isLoading: false,
      }));
      return community;
    } catch (error) {
      set({ error: 'Failed to create community', isLoading: false });
      return null;
    }
  },

  joinCommunity: async (communityId: string) => {
    const { user } = useAppStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      await communityService.joinCommunity(communityId, user.id);
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to join community', isLoading: false });
    }
  },

  fetchMembers: async (communityId: string) => {
    set({ isLoading: true, error: null });
    try {
      const members = await communityService.getMembers(communityId);
      set({ members, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load members', isLoading: false });
    }
  },

  getUserCommunities: async () => {
    const { user } = useAppStore.getState();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const communities = await communityService.getUserCommunities(user.id);
      set({ communities, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load your communities', isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
