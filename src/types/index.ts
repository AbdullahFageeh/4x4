export type Language = 'ar' | 'en';

export type MainTab = 'communities' | 'trips' | 'explore' | 'profile';

export type VehicleCategory = 'overland' | 'supercars' | 'classic' | 'tuner' | 'track' | 'family';

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  category: VehicleCategory;
  plateNumber: string;
  color: string;
  modifications?: string[];
  isPrimary?: boolean;
}

export interface Community {
  id: string;
  name: string;
  nameEn: string;
  tagline: string;
  taglineEn: string;
  description: string;
  descriptionEn: string;
  category: VehicleCategory;
  city: string;
  cityEn: string;
  region: string;
  membersCount: number;
  tripsCount: number;
  isVerified: boolean;
  isJoined?: boolean;
  accentColor: string;
  gradient: string;
  leader: {
    name: string;
    avatar: string;
    role: string;
  };
  meetingSpot: string;
  rules: string[];
}

export interface TripParticipant {
  id: string;
  name: string;
  avatar: string;
  vehicle: string;
}

export type TripDifficulty = 'easy' | 'moderate' | 'expert';
export type TripStatus = 'open' | 'confirmed' | 'in_progress' | 'completed';

export interface Trip {
  id: string;
  communityId: string;
  communityName: string;
  title: string;
  titleEn: string;
  date: string;
  time: string;
  startLocation: string;
  endLocation: string;
  distanceKm: number;
  durationHours: number;
  vehicleRequirement: string;
  vehicleCategory: VehicleCategory;
  difficulty: TripDifficulty;
  status: TripStatus;
  maxParticipants: number;
  currentParticipants: number;
  participants: TripParticipant[];
  radioFrequency?: string;
  elevationGainM?: number;
  meetingTime: string;
  isRegistered?: boolean;
  description: string;
  waypoints: string[];
  imageUrl?: string;
  planningPoll?: Poll;
}

export interface UserProfile {
  id: string;
  name: string;
  nameEn: string;
  username: string;
  callsign?: string;
  phone: string;
  city: string;
  cityEn: string;
  avatar: string;
  rankTitle: string;
  rankTitleEn: string;
  bio: string;
  bioEn: string;
  garage: Vehicle[];
  joinedCommunityIds: string[];
  registeredTripIds: string[];
  stats: {
    tripsCompleted: number;
    distanceKm: number;
    communitiesCount: number;
    reputationScore: number;
  };
}

export interface AppNotification {
  id: string;
  title: string;
  titleEn: string;
  message: string;
  messageEn: string;
  time: string;
  isRead: boolean;
  type: 'trip' | 'community' | 'announcement';
}

export type ActivityType = 'announcement' | 'post' | 'photo' | 'question' | 'poll';

export interface PollOption {
  id: string;
  text: string;
  votesCount: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedOptionId?: string;
  category?: 'destination' | 'time' | 'equipment' | 'general';
  expiresAt?: string;
}

export interface ActivityComment {
  id: string;
  authorName: string;
  authorAvatar: string;
  authorVehicle?: string;
  text: string;
  time: string;
}

export interface CommunityActivity {
  id: string;
  communityId: string;
  type: ActivityType;
  authorName: string;
  authorAvatar: string;
  authorRole?: string;
  authorVehicle?: string;
  time: string;
  title?: string;
  content: string;
  likesCount: number;
  isLiked?: boolean;
  comments: ActivityComment[];
  poll?: Poll;
  tripLink?: {
    tripId: string;
    tripTitle: string;
    tripDate: string;
  };
}

export type OnXWaypointIcon =
  | 'campsite'
  | 'obstacle'
  | 'dune'
  | 'hazard'
  | 'fuel'
  | 'water'
  | 'wildlife'
  | 'recovery'
  | 'viewpoint';

export interface OnXWaypoint {
  id: string;
  name: string;
  icon: OnXWaypointIcon;
  color: string;
  lat: number;
  lng: number;
  elevationM: number;
  notes?: string;
  createdAt: string;
}

export interface OnXTrackPoint {
  lat: number;
  lng: number;
  alt?: number;
  timestamp: number;
}

export interface OnXTrack {
  id: string;
  name: string;
  distanceKm: number;
  durationSeconds: number;
  avgSpeedKmh: number;
  elevationGainM: number;
  points: OnXTrackPoint[];
  color: string;
  createdAt: string;
}

export interface OnXOfflineArea {
  id: string;
  name: string;
  region: string;
  sizeMb: number;
  resolution: 'standard' | 'high' | 'ultra';
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
  downloadedAt: string;
}

export type OnXBasemapType = 'satellite_hybrid' | 'topo' | 'tactical_dark' | 'terrain_3d';

export interface OnXLayersState {
  basemap: OnXBasemapType;
  showPublicReserves: boolean;
  showTrailDifficulty: boolean;
  showActiveConvoys: boolean;
  showWindVectors: boolean;
  showWaypoints: boolean;
  showRecordedTracks: boolean;
}

