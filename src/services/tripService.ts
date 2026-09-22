import { Trip, TripParticipant, CreateTripInput, TripFilter, TRIP_CATEGORIES } from '../types/trip';

// Demo trips with Saudi destinations
export const DEMO_TRIPS: Trip[] = [
  {
    id: 'trip-001',
    community_id: 'comm-001',
    title: 'رحلة وادي ديسي',
    description: 'رحلة برية في وادي ديسي تبوك. تطعيس وتخييم تحت النجوم.',
    category: 'offroad',
    destination: { name: 'وادي ديسي، تبوك', lat: 29.5, lng: 35.5, place_id: 'ChIJdemo1' },
    meeting_point: { name: 'محطة بنزين الفيصلية، تبوك', lat: 28.4, lng: 36.5, place_id: null },
    route_stops: [
      { name: 'محطة وقود الفيصلية', type: 'fuel', lat: 28.5, lng: 36.4 },
      { name: 'استراحة وادي ديسي', type: 'rest_area', lat: 29.0, lng: 36.0 },
    ],
    date: '2026-10-05',
    departure_time: '06:00',
    estimated_return: '18:00',
    participant_limit: 15,
    current_participants: 12,
    estimated_cost: 350,
    cost_currency: 'SAR',
    status: 'published',
    itinerary: '6:00 AM — الاجتماع في محطة الفيصلية\n7:00 AM — الانطلاق نحو وادي ديسي\n9:00 AM — الوصول والتطعيس\n12:00 PM — الغداء\n3:00 PM — استراحة قهوة\n5:00 PM — العودة',
    preparation_checklist: ['إطارات احتياطية', 'وقود كافي', 'ماء وطعام', 'حبل شد', 'GPS أو خرائط'],
    created_by: 'user-001',
    created_at: '2026-09-15T10:00:00Z',
    updated_at: '2026-09-20T15:30:00Z',
    community: { id: 'comm-001', name: 'LC Club KSA', car_model: 'Toyota Land Cruiser' },
  },
  {
    id: 'trip-002',
    community_id: 'comm-001',
    title: 'تخييم في مزارع الشفا',
    description: 'رحلة تخييم في مزارع الشفا الطائف. أجواء باردة وطبيعة خلابة.',
    category: 'camping',
    destination: { name: 'مزارع الشفا، الطائف', lat: 21.3, lng: 40.3, place_id: 'ChIJdemo2' },
    meeting_point: { name: 'مجمع العرب، جدة', lat: 21.5, lng: 39.2, place_id: null },
    route_stops: [
      { name: 'استراحة الكعكية', type: 'restaurant', lat: 21.4, lng: 39.8 },
      { name: 'محطة الشفا', type: 'fuel', lat: 21.3, lng: 40.2 },
    ],
    date: '2026-10-12',
    departure_time: '14:00',
    estimated_return: '10:00',
    participant_limit: 10,
    current_participants: 8,
    estimated_cost: 200,
    cost_currency: 'SAR',
    status: 'published',
    itinerary: '2:00 PM — الاجتماع في مجمع العرب\n4:00 PM — الوصول للمخيم\n5:00 PM — نصب الخيام\n7:00 PM — العشاء والجلسة',
    preparation_checklist: ['خيمة', 'نوميات', 'فحم وشواية', 'ملابس دافئة', 'مصابيح'],
    created_by: 'user-001',
    created_at: '2026-09-18T10:00:00Z',
    updated_at: '2026-09-22T12:00:00Z',
    community: { id: 'comm-001', name: 'LC Club KSA', car_model: 'Toyota Land Cruiser' },
  },
  {
    id: 'trip-003',
    community_id: 'comm-002',
    title: 'لقاء جدة باترول',
    description: 'لقاء أسبوعي لملاك الباترول في كورنيش جدة. تعارف ومشاوي.',
    category: 'city_meetup',
    destination: { name: 'كورنيش جدة', lat: 21.7, lng: 39.1, place_id: 'ChIJdemo3' },
    meeting_point: { name: 'كورنيش جدة - شارع الأندلس', lat: 21.7, lng: 39.1, place_id: null },
    route_stops: [],
    date: '2026-09-26',
    departure_time: '19:00',
    estimated_return: '22:00',
    participant_limit: 30,
    current_participants: 25,
    estimated_cost: 50,
    cost_currency: 'SAR',
    status: 'published',
    itinerary: '7:00 PM — الاجتماع والتعارف\n8:00 PM — المشوي\n9:00 PM — جولة بالكورنيش',
    preparation_checklist: ['سيارتك نظيفة', 'موقف مسبق'],
    created_by: 'user-004',
    created_at: '2026-09-20T10:00:00Z',
    updated_at: '2026-09-22T08:00:00Z',
    community: { id: 'comm-002', name: 'باترول السعودي', car_model: 'Nissan Patrol' },
  },
  {
    id: 'trip-004',
    community_id: 'comm-003',
    title: 'تطعيس النفود الكبير',
    description: 'رحلة تطعيس في صحراء النفود الكبير. مغامرة حقيقية للجيب الشيروكي.',
    category: 'offroad',
    destination: { name: 'صحراء النفود، حائل', lat: 27.5, lng: 41.7, place_id: 'ChIJdemo4' },
    meeting_point: { name: 'محطة دواء، حائل', lat: 27.5, lng: 41.7, place_id: null },
    route_stops: [
      { name: 'محطة دواء', type: 'fuel', lat: 27.5, lng: 41.7 },
    ],
    date: '2026-11-02',
    departure_time: '05:00',
    estimated_return: '20:00',
    participant_limit: 12,
    current_participants: 5,
    estimated_cost: 500,
    cost_currency: 'SAR',
    status: 'published',
    itinerary: '5:00 AM — الانطلاق من حائل\n7:00 AM — الوصول للنفود\n8:00 AM — بدء التطعيس\n12:00 PM — غداء\n4:00 PM — استراحة\n6:00 PM — العودة',
    preparation_checklist: ['GPS', 'إطارات رملية', 'وقود إضافي', 'طعام لمدة يوم', 'حبل شد', 'جيك عالي', 'مفك إطارات'],
    created_by: 'user-001',
    created_at: '2026-09-10T10:00:00Z',
    updated_at: '2026-09-21T14:00:00Z',
    community: { id: 'comm-003', name: 'يوتا أوف رود', car_model: 'Jeep Wrangler' },
  },
];

export const DEMO_TRIP_PARTICIPANTS: TripParticipant[] = [
  { trip_id: 'trip-001', user_id: 'user-001', status: 'going', joined_at: '2026-09-15T10:00:00Z' },
  { trip_id: 'trip-001', user_id: 'user-002', status: 'going', joined_at: '2026-09-16T10:00:00Z' },
  { trip_id: 'trip-001', user_id: 'user-003', status: 'waitlisted', joined_at: '2026-09-18T10:00:00Z' },
  { trip_id: 'trip-002', user_id: 'user-001', status: 'going', joined_at: '2026-09-18T10:00:00Z' },
  { trip_id: 'trip-003', user_id: 'user-004', status: 'going', joined_at: '2026-09-20T10:00:00Z' },
];

class TripService {
  private trips: Trip[] = [...DEMO_TRIPS];
  private participants: TripParticipant[] = [...DEMO_TRIP_PARTICIPANTS];

  async getTrips(filter?: TripFilter): Promise<Trip[]> {
    await this.delay();
    let result = [...this.trips].filter((t) => t.status === 'published');

    if (filter?.search) {
      const search = filter.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search) ||
          t.destination.name.toLowerCase().includes(search)
      );
    }

    if (filter?.category) {
      result = result.filter((t) => t.category === filter.category);
    }

    if (filter?.community_id) {
      result = result.filter((t) => t.community_id === filter.community_id);
    }

    if (filter?.date_from) {
      result = result.filter((t) => t.date >= filter.date_from!);
    }

    if (filter?.date_to) {
      result = result.filter((t) => t.date <= filter.date_to!);
    }

    // Sort by date (soonest first)
    result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return result;
  }

  async getTrip(id: string): Promise<Trip | null> {
    await this.delay();
    return this.trips.find((t) => t.id === id) || null;
  }

  async createTrip(input: CreateTripInput, userId: string): Promise<Trip> {
    await this.delay();
    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      community_id: input.community_id,
      title: input.title,
      description: input.description,
      category: input.category,
      destination: input.destination,
      meeting_point: input.meeting_point,
      route_stops: input.route_stops || [],
      date: input.date,
      departure_time: input.departure_time,
      estimated_return: input.estimated_return || null,
      participant_limit: input.participant_limit,
      current_participants: 1,
      estimated_cost: input.estimated_cost,
      cost_currency: 'SAR',
      status: 'published',
      itinerary: input.itinerary || '',
      preparation_checklist: input.preparation_checklist || [],
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.trips.push(newTrip);

    // Auto-add creator as participant
    this.participants.push({
      trip_id: newTrip.id,
      user_id: userId,
      status: 'going',
      joined_at: new Date().toISOString(),
    });

    return newTrip;
  }

  async joinTrip(tripId: string, userId: string): Promise<TripParticipant> {
    await this.delay();
    const trip = this.trips.find((t) => t.id === tripId);
    if (!trip) throw new Error('Trip not found');

    const existing = this.participants.find(
      (p) => p.trip_id === tripId && p.user_id === userId
    );
    if (existing) throw new Error('Already joined');

    const participant: TripParticipant = {
      trip_id: tripId,
      user_id: userId,
      status: trip.current_participants < trip.participant_limit ? 'going' : 'waitlisted',
      joined_at: new Date().toISOString(),
    };

    this.participants.push(participant);

    if (participant.status === 'going') {
      trip.current_participants++;
    }

    return participant;
  }

  async declineTrip(tripId: string, userId: string): Promise<void> {
    await this.delay();
    this.participants = this.participants.filter(
      (p) => !(p.trip_id === tripId && p.user_id === userId)
    );
  }

  async getParticipants(tripId: string): Promise<TripParticipant[]> {
    await this.delay();
    return this.participants.filter((p) => p.trip_id === tripId);
  }

  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));
  }
}

export const tripService = new TripService();
