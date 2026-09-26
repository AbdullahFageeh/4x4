import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../store/useAppStore';
import {
  UserRole,
  TripReview,
  SosAlert,
  OfflineRegion,
  SubscriptionTier,
  AdminProfile,
} from './types';
import {
  DEMO_BRONCO_USERS,
  DEMO_TRIP_REVIEWS,
  DEMO_OFFLINE_REGIONS,
  DEMO_ADMINS,
  DEMO_AUDIT_LOGS,
  DEMO_TICKETS,
  DEMO_SUBSCRIPTIONS,
  DEMO_SPONSORS,
} from './demoData';
import type { AuditLog, SupportTicket, Subscription, Sponsor, BroncoUser } from './types';

const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

export interface BroncoState {
  // role-based access
  currentUserId: string;
  setUserId: (id: string) => void;
  users: BroncoUser[];
  role: UserRole;
  setRole: (r: UserRole) => void;

  // trips + reviews
  reviews: TripReview[];
  addReview: (r: TripReview) => void;

  // chats / voice
  voiceActive: boolean;
  voiceParticipants: number;
  startVoice: (participants: number) => void;
  endVoice: () => void;

  // payments / subscriptions
  subscriptions: Subscription[];
  setSubscriptionTier: (tier: SubscriptionTier) => void;
  sponsors: Sponsor[];

  // offline maps
  offlineRegions: OfflineRegion[];
  downloadRegion: (id: string) => void;

  // SOS
  sosAlerts: SosAlert[];
  sendSos: (a: Omit<SosAlert, 'id' | 'status' | 'created_at' | 'responders'>) => void;
  resolveSos: (id: string) => void;

  // live location
  liveSharing: boolean;
  toggleLiveSharing: () => void;

  // admin panel
  admins: AdminProfile[];
  auditLogs: AuditLog[];
  tickets: SupportTicket[];
  updateTicketStatus: (id: string, status: SupportTicket['status']) => void;
  addAdmin: (a: AdminProfile) => void;
  toggleAdminActive: (id: string) => void;
  setAdminPermissions: (id: string, permissions: string[]) => void;
  logAction: (action: string, target: string, detail: string) => void;
  pricing: Record<SubscriptionTier, number>;
  setPricing: (p: Record<SubscriptionTier, number>) => void;

  // onboarding
  broncoOnboardingComplete: boolean;
  setBroncoOnboardingComplete: () => void;
}

export const useBroncoStore = create<BroncoState>()(
  persist(
    (set) => ({
      currentUserId: 'user-001',
      setUserId: (id) => set({ currentUserId: id }),
      users: DEMO_BRONCO_USERS,
      role: 'platform_admin',
      setRole: (role) => set({ role }),

      reviews: DEMO_TRIP_REVIEWS,
      addReview: (r) => set((s) => ({ reviews: [r, ...s.reviews] })),

      voiceActive: false,
      voiceParticipants: 0,
      startVoice: (participants) => set({ voiceActive: true, voiceParticipants: participants }),
      endVoice: () => set({ voiceActive: false, voiceParticipants: 0 }),

      subscriptions: DEMO_SUBSCRIPTIONS,
      setSubscriptionTier: (tier) =>
        set((s) => ({
          subscriptions: s.subscriptions.map((sub) =>
            sub.user_id === s.currentUserId ? { ...sub, tier, status: 'active' as const } : sub
          ),
          users: s.users.map((u) => (u.id === s.currentUserId ? { ...u, subscription: tier } : u)),
        })),
      sponsors: DEMO_SPONSORS,

      offlineRegions: DEMO_OFFLINE_REGIONS,
      downloadRegion: (id) =>
        set((s) => ({
          offlineRegions: s.offlineRegions.map((r) =>
            r.id === id ? { ...r, status: 'downloading' as const, progress: 50 } : r
          ),
        })),

      sosAlerts: [],
      sendSos: (a) =>
        set((s) => ({
          sosAlerts: [
            {
              ...a,
              id: `sos-${Date.now()}`,
              status: 'sent' as const,
              created_at: new Date().toISOString(),
              responders: [],
            },
            ...s.sosAlerts,
          ],
        })),
      resolveSos: (id) =>
        set((s) => ({
          sosAlerts: s.sosAlerts.map((a) => (a.id === id ? { ...a, status: 'resolved' as const } : a)),
        })),

      liveSharing: false,
      toggleLiveSharing: () => set((s) => ({ liveSharing: !s.liveSharing })),

      admins: DEMO_ADMINS,
      auditLogs: DEMO_AUDIT_LOGS,
      tickets: DEMO_TICKETS,
      updateTicketStatus: (id, status) =>
        set((s) => ({ tickets: s.tickets.map((t) => (t.id === id ? { ...t, status } : t)) })),
      addAdmin: (a) => set((s) => ({ admins: [a, ...s.admins] })),
      toggleAdminActive: (id) =>
        set((s) => ({ admins: s.admins.map((a) => (a.id === id ? { ...a, active: !a.active } : a)) })),
      setAdminPermissions: (id, permissions) =>
        set((s) => ({ admins: s.admins.map((a) => (a.id === id ? { ...a, permissions } : a)) })),
      logAction: (action, target, detail) =>
        set((s) => ({
          auditLogs: [
            {
              id: `log-${Date.now()}`,
              actor_id: s.currentUserId,
              actor_role: s.role,
              action,
              target,
              detail,
              created_at: new Date().toISOString(),
            },
            ...s.auditLogs,
          ],
        })),
      pricing: { free: 0, pro: 29, elite: 79 },
      setPricing: (pricing) => set({ pricing }),

      broncoOnboardingComplete: false,
      setBroncoOnboardingComplete: () => set({ broncoOnboardingComplete: true }),
    }),
    {
      name: 'bronco-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        currentUserId: state.currentUserId,
        role: state.role,
        reviews: state.reviews,
        subscriptions: state.subscriptions,
        offlineRegions: state.offlineRegions,
        sosAlerts: state.sosAlerts,
        admins: state.admins,
        auditLogs: state.auditLogs,
        tickets: state.tickets,
        pricing: state.pricing,
        broncoOnboardingComplete: state.broncoOnboardingComplete,
      }),
    }
  )
);

// Derived helper
export function useCurrentBroncoUser() {
  const { currentUserId, users } = useBroncoStore();
  return users.find((u) => u.id === currentUserId) ?? null;
}

export function useHasPermission(key: string) {
  const { admins, currentUserId } = useBroncoStore();
  const admin = admins.find((a) => a.user_id === currentUserId);
  if (!admin) return false;
  if (admin.role === 'super_admin') return true;
  return admin.permissions.includes(key);
}