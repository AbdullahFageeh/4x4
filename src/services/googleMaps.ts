import * as Location from 'expo-location';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PlaceSearchResult {
  id: string;
  name: string;
  address: string;
  types: string[];
  rating?: number;
  location: Coordinates;
  isVerified: boolean;
  saudiRegion: string;
}

export interface RouteResult {
  distance: string;
  duration: string;
  steps: { instruction: string; distance: string; duration: string }[];
}

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// Demo data — replace with real Google Places/Geocoding/Directions API calls
const DEMO_PLACES: PlaceSearchResult[] = [
  {
    id: 'place-001', name: 'محطة الفيصلية - تبوك',
    address: 'تبوك، المملكة العربية السعودية', types: ['fuel'],
    rating: 4.2, location: { latitude: 28.4, longitude: 36.5 },
    isVerified: true, saudiRegion: 'تبوك',
  },
  {
    id: 'place-002', name: 'استراحة وادي ديسي',
    address: 'تبوك، المملكة العربية السعودية', types: ['rest_area', 'restaurant'],
    rating: 4.5, location: { latitude: 29.0, longitude: 36.0 },
    isVerified: true, saudiRegion: 'تبوك',
  },
  {
    id: 'place-003', name: 'مخيم وادي ديسي',
    address: 'تبوك، المملكة العربية السعودية', types: ['campsite'],
    rating: 4.8, location: { latitude: 29.5, longitude: 35.5 },
    isVerified: true, saudiRegion: 'تبوك',
  },
  {
    id: 'place-004', name: 'مطعم السدر - الطائف',
    address: 'الطائف، المملكة العربية السعودية', types: ['restaurant'],
    rating: 4.3, location: { latitude: 21.4, longitude: 39.8 },
    isVerified: true, saudiRegion: 'الطائف',
  },
  {
    id: 'place-005', name: 'مزارع الشفا',
    address: 'الطائف، المملكة العربية السعودية', types: ['campsite', 'attraction'],
    rating: 4.6, location: { latitude: 21.3, longitude: 40.3 },
    isVerified: true, saudiRegion: 'الطائف',
  },
];

class GoogleMapsService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  get isConfigured(): boolean {
    return Boolean(this.apiKey);
  }

  async requestLocationPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  }

  async getCurrentLocation(): Promise<Coordinates | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) return null;
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch {
      return null;
    }
  }

  async geocodeAddress(address: string): Promise<Coordinates | null> {
    if (!this.apiKey) {
      // Return demo coords
      return DEMO_PLACES[0]?.location || { latitude: 24.7136, longitude: 46.6753 };
    }
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`
      );
      const data = await response.json();
      if (data.results?.[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        return { latitude: lat, longitude: lng };
      }
    } catch {
      // fallback
    }
    return null;
  }

  async searchNearby(
    location: Coordinates,
    radius: number = 5000,
    types: string[] = []
  ): Promise<PlaceSearchResult[]> {
    if (!this.apiKey) {
      return DEMO_PLACES;
    }
    try {
      const typeFilter = types.length > 0 ? `&types=${types.join('|')}` : '';
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=${radius}${typeFilter}&key=${this.apiKey}`
      );
      const data = await response.json();
      return (data.results || []).map((place: any) => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        types: place.types || [],
        rating: place.rating,
        location: {
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
        },
        isVerified: false,
        saudiRegion: '',
      }));
    } catch {
      return DEMO_PLACES;
    }
  }

  async getDirections(
    origin: Coordinates,
    destination: Coordinates,
    waypoints?: Coordinates[]
  ): Promise<RouteResult | null> {
    if (!this.apiKey) {
      return {
        distance: '150 km',
        duration: '1 hour 30 mins',
        steps: [
          { instruction: 'Head towards destination', distance: '5 km', duration: '5 mins' },
          { instruction: 'Continue straight', distance: '140 km', duration: '1 hour 20 mins' },
          { instruction: 'Arrive at destination', distance: '5 km', duration: '5 mins' },
        ],
      };
    }
    try {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destStr = `${destination.latitude},${destination.longitude}`;
      const waypointsStr = waypoints
        ? `&waypoints=${waypoints.map((w) => `${w.latitude},${w.longitude}`).join('|')}`
        : '';
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${originStr}&destination=${destStr}${waypointsStr}&key=${this.apiKey}`
      );
      const data = await response.json();
      if (data.routes?.[0]) {
        const leg = data.routes[0].legs[0];
        return {
          distance: leg.distance.text,
          duration: leg.duration.text,
          steps: leg.steps.map((step: any) => ({
            instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
            distance: step.distance.text,
            duration: step.duration.text,
          })),
        };
      }
    } catch {
      // fallback
    }
    return null;
  }

  getMapImageUrl(location: Coordinates, zoom: number = 14, size: string = '400x200'): string {
    if (!this.apiKey) {
      return `https://via.placeholder.com/${size}/1B5E20/fff?text=Map`;
    }
    return `https://maps.googleapis.com/maps/api/staticmap?center=${location.latitude},${location.longitude}&zoom=${zoom}&size=${size}&markers=${location.latitude},${location.longitude}&key=${this.apiKey}`;
  }
}

export const googleMapsService = new GoogleMapsService(GOOGLE_MAPS_API_KEY);
