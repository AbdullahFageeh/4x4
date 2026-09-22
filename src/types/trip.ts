export interface Trip {
  id: string;
  community_id: string;
  title: string;
  description: string;
  category: 'scenic' | 'camping' | 'offroad' | 'city_meetup';
  
  // Location
  destination: {
    name: string;
    lat: number;
    lng: number;
    place_id?: string | null;
  };
  meeting_point: {
    name: string;
    lat: number;
    lng: number;
    place_id?: string | null;
  };
  route_stops: {
    name: string;
    type: 'fuel' | 'restaurant' | 'campsite' | 'rest_area' | 'other';
    lat: number;
    lng: number;
  }[];
  
  // Schedule
  date: string;
  departure_time: string;
  estimated_return: string | null;
  
  // Capacity & Cost
  participant_limit: number;
  current_participants: number;
  estimated_cost: number; // SAR
  cost_currency: 'SAR';
  
  // Status
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  itinerary: string;
  preparation_checklist: string[];
  
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Community info for display
  community?: {
    id: string;
    name: string;
    car_model: string;
  };
}

export interface TripParticipant {
  trip_id: string;
  user_id: string;
  status: 'going' | 'declined' | 'waitlisted';
  joined_at: string;
  user?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
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

export const TRIP_CATEGORIES = [
  { key: 'scenic', label_ar: 'رحلات سياحية', label_en: 'Scenic Drives', emoji: '🌄' },
  { key: 'camping', label_ar: 'تخييم', label_en: 'Camping', emoji: '⛺' },
  { key: 'offroad', label_ar: 'طرق وعرة', label_en: 'Off-road', emoji: '🏜️' },
  { key: 'city_meetup', label_ar: 'لقاء مدينة', label_en: 'City Meetups', emoji: '🏙️' },
] as const;
