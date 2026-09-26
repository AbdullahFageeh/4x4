// Ford Bronco edition — extended types

export type UserRole = 'member' | 'organizer' | 'community_admin' | 'platform_admin';

export interface BroncoUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  phone: string;
  role: UserRole;
  nationalId: string | null;
  city: string;
  club: string | null;
  preferredLanguage: 'ar' | 'en';
  car: BroncoCar | null;
  subscription: SubscriptionTier | null;
  createdAt: string;
}

export interface BroncoCar {
  model: string; // e.g. "Ford Bronco Badlands"
  year: number;
  color: string;
  plate: string;
  engine: string;
  driveType: string; // 4x4
  modifications: string[];
  lastService: string | null;
}

export type SubscriptionTier = 'free' | 'pro' | 'elite';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  name_ar: string;
  name_en: string;
  price: number; // SAR / month
  features_ar: string[];
  features_en: string[];
  popular: boolean;
}

export interface Subscription {
  id: string;
  user_id: string;
  tier: SubscriptionTier;
  status: 'active' | 'past_due' | 'cancelled';
  started_at: string;
  expires_at: string;
  user?: { id: string; name: string; phone: string };
}

export interface TripReview {
  id: string;
  trip_id: string;
  user_id: string;
  rating: number; // 1-5
  comment: string;
  created_at: string;
  user?: { id: string; name: string };
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string; // emoji or url
  category: string;
  cta_ar: string;
  cta_en: string;
  featured: boolean;
}

export interface SosAlert {
  id: string;
  user_id: string;
  trip_id: string | null;
  type: 'stuck' | 'accident' | 'medical' | 'flat_tire' | 'no_fuel' | 'other';
  location: { lat: number; lng: number; label: string };
  status: 'sent' | 'responded' | 'resolved';
  created_at: string;
  responders: string[];
}

export interface VoiceSession {
  id: string;
  trip_id: string;
  host_user_id: string;
  participants: string[];
  status: 'idle' | 'live' | 'ended';
  started_at: string | null;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  category: 'trip' | 'payment' | 'account' | 'sos' | 'other';
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  user?: { id: string; name: string; phone: string };
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_role: UserRole;
  action: string;
  target: string;
  detail: string;
  created_at: string;
}

export interface OfflineRegion {
  id: string;
  name_ar: string;
  name_en: string;
  sizeMb: number;
  status: 'downloaded' | 'downloading' | 'not_downloaded';
  progress: number;
}

export interface AdminPermission {
  key: string;
  label_ar: string;
  label_en: string;
}

export interface AdminProfile {
  id: string;
  user_id: string;
  name: string;
  role: 'super_admin' | 'admin' | 'support';
  permissions: string[];
  active: boolean;
  last_active_at: string;
}