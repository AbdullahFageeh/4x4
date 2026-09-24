export interface Trip {
  id: string;
  community_id: string;
  title: string;
  description: string;
  category: 'scenic' | 'camping' | 'offroad' | 'city_meetup';
  destination: { name: string; lat: number; lng: number };
  meeting_point: { name: string; lat: number; lng: number };
  route_stops: { name: string; type: string; lat: number; lng: number }[];
  date: string;
  departure_time: string;
  estimated_return: string | null;
  participant_limit: number;
  current_participants: number;
  estimated_cost: number;
  cost_currency: 'SAR';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  itinerary: string;
  preparation_checklist: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  community?: { id: string; name: string; car_model: string };
}

export interface TripParticipant {
  trip_id: string;
  user_id: string;
  status: 'going' | 'declined' | 'waitlisted';
  joined_at: string;
  user?: { id: string; name: string; avatar_url: string | null };
}

export interface CreateTripInput {
  community_id: string;
  title: string;
  description: string;
  category: Trip['category'];
  destination: Trip['destination'];
  meeting_point: Trip['meeting_point'];
  route_stops?: Trip['route_stops'];
  date: string;
  departure_time: string;
  estimated_return?: string;
  participant_limit: number;
  estimated_cost: number;
  itinerary?: string;
  preparation_checklist?: string[];
}

export interface TripFilter {
  search?: string;
  category?: Trip['category'];
  community_id?: string;
  date_from?: string;
  date_to?: string;
}

export type TripLifecycle = 'draft' | 'published' | 'active' | 'completed' | 'cancelled';

export interface TripOperationState {
  fetchStatus: 'idle' | 'loading' | 'error';
  createStatus: 'idle' | 'loading' | 'error';
  joinStatus: 'idle' | 'loading' | 'success' | 'error';
  declineStatus: 'idle' | 'loading' | 'success' | 'error';
  cancelStatus: 'idle' | 'loading' | 'success' | 'error';
  participantsStatus: 'idle' | 'loading' | 'error';
  locationStatus: 'idle' | 'sharing' | 'stopped' | 'error';
}

export interface TripValidationError {
  code: 'TRIP_FULL' | 'TRIP_CANCELLED' | 'TRIP_COMPLETED' | 'NOT_ORGANIZER' | 'ALREADY_JOINED';
  message: string;
}

export const TRIP_CATEGORIES = [
  { key: 'scenic', label_ar: 'رحلات سياحية', label_en: 'Scenic Drives', emoji: '🌄' },
  { key: 'camping', label_ar: 'تخييم', label_en: 'Camping', emoji: '⛺' },
  { key: 'offroad', label_ar: 'طرق وعرة', label_en: 'Off-road', emoji: '🏜️' },
  { key: 'city_meetup', label_ar: 'لقاء مدينة', label_en: 'City Meetups', emoji: '🏙️' },
] as const;
