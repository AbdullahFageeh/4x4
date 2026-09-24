export interface Community {
  id: string;
  name: string;
  description: string;
  car_model: string;
  cover_image_url: string | null;
  visibility: 'public' | 'private';
  invite_code: string;
  rules: string;
  member_count: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface CommunityMember {
  community_id: string;
  user_id: string;
  role: 'organizer' | 'member';
  status: 'pending' | 'approved' | 'blocked';
  joined_at: string;
  user?: {
    id: string;
    name: string;
    avatar_url: string | null;
    car_model: string;
  };
}

export interface CreateCommunityInput {
  name: string;
  description: string;
  car_model: string;
  cover_image_url?: string | null;
  visibility: 'public' | 'private';
  rules: string;
}

export interface CommunityFilter {
  search?: string;
  car_model?: string;
  location?: 'near_me' | 'all';
}

export type MembershipStatus = 'not_joined' | 'pending' | 'member';

export interface CommunityOperationState {
  fetchStatus: 'idle' | 'loading' | 'error';
  createStatus: 'idle' | 'loading' | 'error';
  joinStatus: 'idle' | 'loading' | 'success' | 'error';
  leaveStatus: 'idle' | 'loading' | 'success' | 'error';
}
