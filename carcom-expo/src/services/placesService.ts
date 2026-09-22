export interface Place {
  place_id: string;
  name: string;
  description: string;
  types: PlaceType[];
  location: { lat: number; lng: number };
  rating?: number;
  review_count?: number;
  is_verified: boolean;
  saudi_region: string;
}

export type PlaceType =
  | 'fuel'
  | 'restaurant'
  | 'campsite'
  | 'rest_area'
  | 'hotel'
  | 'attraction'
  | 'shop'
  | 'other';

export interface PlaceSuggestion {
  place_id: string;
  main_text: string;
  secondary_text: string;
  types: PlaceType[];
}

export interface RouteDirection {
  distance: string;
  duration: string;
  polyline: string;
  steps: { instruction: string; distance: string; duration: string }[];
}

export const PLACE_CATEGORIES: Record<PlaceType, { label_ar: string; label_en: string; emoji: string }> = {
  fuel: { label_ar: 'محطات وقود', label_en: 'Fuel Stations', emoji: '⛽' },
  restaurant: { label_ar: 'مطاعم', label_en: 'Restaurants', emoji: '🍽️' },
  campsite: { label_ar: 'مواقع تخييم', label_en: 'Campsites', emoji: '⛺' },
  rest_area: { label_ar: 'استراحات', label_en: 'Rest Areas', emoji: '🏪' },
  hotel: { label_ar: 'فنادق', label_en: 'Hotels', emoji: '🏨' },
  attraction: { label_ar: 'معالم سياحية', label_en: 'Attractions', emoji: '🎯' },
  shop: { label_ar: 'متاجر', label_en: 'Shops', emoji: '🛒' },
  other: { label_ar: 'أخرى', label_en: 'Other', emoji: '📍' },
};

export const DEMO_PLACES: Place[] = [
  {
    place_id: 'place-001', name: 'محطة الفيصلية - تبوك',
    description: 'محطة وقود على طريق تبوك الرئيسي، خدمات كاملة',
    types: ['fuel'], location: { lat: 28.4, lng: 36.5 }, rating: 4.2, review_count: 156,
    is_verified: true, saudi_region: 'تبوك',
  },
  {
    place_id: 'place-002', name: 'استراحة وادي ديسي',
    description: 'استراحة ومطعم في مدخل وادي ديسي، منظر خلاب',
    types: ['rest_area', 'restaurant'], location: { lat: 29.0, lng: 36.0 }, rating: 4.5, review_count: 89,
    is_verified: true, saudi_region: 'تبوك',
  },
  {
    place_id: 'place-003', name: 'مخيم وادي ديسي',
    description: 'موقع تخييم في قلب وادي ديسي، مكان هادئ ومحاط بالجبال',
    types: ['campsite'], location: { lat: 29.5, lng: 35.5 }, rating: 4.8, review_count: 234,
    is_verified: true, saudi_region: 'تبوك',
  },
  {
    place_id: 'place-004', name: 'مطعم السدر - الطائف',
    description: 'مطعم شعبي يقدم الأطباق السعودية التقليدية، مندرين',
    types: ['restaurant'], location: { lat: 21.4, lng: 39.8 }, rating: 4.3, review_count: 312,
    is_verified: true, saudi_region: 'الطائف',
  },
  {
    place_id: 'place-005', name: 'محطة وقود الشفا',
    description: 'محطة وقود على طريق الشفا، خدمات محدودة',
    types: ['fuel'], location: { lat: 21.3, lng: 40.2 }, rating: 3.9, review_count: 67,
    is_verified: true, saudi_region: 'الطائف',
  },
  {
    place_id: 'place-006', name: 'مزارع الشفا',
    description: 'منطقة تخييم في مزارع الشفا، أجواء باردة في الصيف',
    types: ['campsite', 'attraction'], location: { lat: 21.3, lng: 40.3 }, rating: 4.6, review_count: 445,
    is_verified: true, saudi_region: 'الطائف',
  },
  {
    place_id: 'place-007', name: 'كورنيش جدة',
    description: 'منظر بحري على البحر الأحمر، مطاعم ومقاهٍ',
    types: ['attraction', 'restaurant'], location: { lat: 21.7, lng: 39.1 }, rating: 4.7, review_count: 1250,
    is_verified: true, saudi_region: 'جدة',
  },
  {
    place_id: 'place-008', name: 'مجمع العرب - جدة',
    description: 'محطة استراحة وتجمع على طريق المدينة',
    types: ['rest_area', 'fuel'], location: { lat: 21.5, lng: 39.2 }, rating: 4.1, review_count: 189,
    is_verified: true, saudi_region: 'جدة',
  },
  {
    place_id: 'place-009', name: 'محطة دواء - حائل',
    description: 'محطة وقود على طريق حائل، استراحة صغيرة',
    types: ['fuel'], location: { lat: 27.5, lng: 41.7 }, rating: 4.0, review_count: 98,
    is_verified: true, saudi_region: 'حائل',
  },
  {
    place_id: 'place-010', name: 'صحراء النفود الكبير',
    description: 'منطقة تطعيس مشهورة، كثبان رملية حمراء',
    types: ['attraction', 'campsite'], location: { lat: 27.5, lng: 41.7 }, rating: 4.9, review_count: 567,
    is_verified: true, saudi_region: 'حائل',
  },
];

export const DEMO_DIRECTIONS: Record<string, RouteDirection> = {
  'riyadh-tabuk': {
    distance: '680 km', duration: '7 hours', polyline: 'mock',
    steps: [
      { instruction: 'Head north on King Fahd Road', distance: '5 km', duration: '10 mins' },
      { instruction: 'Merge onto Highway 65', distance: '15 km', duration: '15 mins' },
      { instruction: 'Continue through Buraidah (fuel stop)', distance: '400 km', duration: '4 hours' },
      { instruction: 'Continue north towards Ha\'il', distance: '200 km', duration: '2 hours' },
      { instruction: 'Take exit towards Tabuk', distance: '60 km', duration: '45 mins' },
    ],
  },
  'riyadh-jeddah': {
    distance: '950 km', duration: '9 hours 30 mins', polyline: 'mock',
    steps: [
      { instruction: 'Head west on King Fahd Road', distance: '5 km', duration: '10 mins' },
      { instruction: 'Merge onto Highway 40', distance: '50 km', duration: '30 mins' },
      { instruction: 'Continue to Jeddah (fuel at Taif)', distance: '900 km', duration: '8 hours 30 mins' },
    ],
  },
  'riyadh-taif': {
    distance: '780 km', duration: '8 hours', polyline: 'mock',
    steps: [
      { instruction: 'Head west on King Fahd Road', distance: '5 km', duration: '10 mins' },
      { instruction: 'Merge onto Highway 40 towards Taif', distance: '775 km', duration: '7 hours 50 mins' },
    ],
  },
};

class PlacesService {
  async searchPlaces(query: string, types?: PlaceType[]): Promise<PlaceSuggestion[]> {
    await this.delay();
    let results = DEMO_PLACES;
    if (query) {
      const q = query.toLowerCase();
      results = results.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.saudi_region.includes(q)
      );
    }
    if (types && types.length > 0) {
      results = results.filter((p) => p.types.some((t) => types.includes(t)));
    }
    return results.map((p) => ({
      place_id: p.place_id,
      main_text: p.name,
      secondary_text: `${p.saudi_region} • ${p.description.substring(0, 50)}`,
      types: p.types,
    }));
  }

  async getPlaceDetails(placeId: string): Promise<Place | null> {
    await this.delay();
    return DEMO_PLACES.find((p) => p.place_id === placeId) || null;
  }

  async getNearbyPlaces(lat: number, lng: number, radius: number = 50, types?: PlaceType[]): Promise<Place[]> {
    await this.delay();
    let results = DEMO_PLACES.filter((p) => {
      const dist = Math.sqrt(Math.pow(p.location.lat - lat, 2) + Math.pow(p.location.lng - lng, 2));
      return dist < (radius / 111);
    });
    if (types && types.length > 0) {
      results = results.filter((p) => p.types.some((t) => types.includes(t)));
    }
    return results;
  }

  async getDirections(from: string, to: string): Promise<RouteDirection | null> {
    await this.delay();
    const key = `${from}-${to}`.toLowerCase().replace(/\s+/g, '-');
    for (const [demoKey, directions] of Object.entries(DEMO_DIRECTIONS)) {
      if (key.includes(demoKey) || demoKey.includes(key)) return directions;
    }
    return {
      distance: '150 km', duration: '1 hour 30 mins', polyline: 'mock',
      steps: [
        { instruction: 'Head towards destination', distance: '5 km', duration: '5 mins' },
        { instruction: 'Continue straight', distance: '140 km', duration: '1 hour 20 mins' },
        { instruction: 'Arrive at destination', distance: '5 km', duration: '5 mins' },
      ],
    };
  }

  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300));
  }
}

export const placesService = new PlacesService();
