// Ford Bronco edition — demo data
import {
  BroncoUser,
  TripReview,
  Sponsor,
  SubscriptionPlan,
  Subscription,
  SupportTicket,
  AuditLog,
  OfflineRegion,
  AdminProfile,
  AdminPermission,
} from './types';

export const DEMO_BRONCO_USERS: BroncoUser[] = [
  {
    id: 'user-001',
    name: 'عبدالله الفقي',
    avatarUrl: null,
    phone: '+966501234567',
    role: 'platform_admin',
    nationalId: '1038****',
    city: 'الرياض',
    club: 'Bronco KSA',
    preferredLanguage: 'ar',
    car: {
      model: 'Ford Bronco Badlands',
      year: 2024,
      color: 'Eruption Green',
      plate: 'برونكو 1234',
      engine: '2.3L EcoBoost',
      driveType: '4x4',
      modifications: ['خفقات', 'إطارات 35', 'جيب', 'حبل شد'],
      lastService: '2026-08-10',
    },
    subscription: 'elite',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: 'user-002',
    name: 'سالم الحربي',
    avatarUrl: null,
    phone: '+966551234567',
    role: 'organizer',
    nationalId: '1042****',
    city: 'جدة',
    club: 'Bronco KSA',
    preferredLanguage: 'ar',
    car: {
      model: 'Ford Bronco Black Diamond',
      year: 2025,
      color: 'Cactus Gray',
      plate: 'برونكو 5678',
      engine: '2.7L V6 Turbo',
      driveType: '4x4',
      modifications: ['رفع 2.5', 'إطارات 37', 'شبكة'],
      lastService: '2026-09-01',
    },
    subscription: 'pro',
    createdAt: '2026-02-20T10:00:00Z',
  },
  {
    id: 'user-003',
    name: 'نوف العتيبي',
    avatarUrl: null,
    phone: '+966541234567',
    role: 'community_admin',
    nationalId: '1029****',
    city: 'الرياض',
    club: 'Bronco KSA',
    preferredLanguage: 'ar',
    car: {
      model: 'Ford Bronco',
      year: 2023,
      color: 'Area 51',
      plate: 'برونكو 9012',
      engine: '2.3L EcoBoost',
      driveType: '4x4',
      modifications: ['تعتيم', 'سباكر'],
      lastService: '2026-07-15',
    },
    subscription: 'pro',
    createdAt: '2026-03-10T10:00:00Z',
  },
  {
    id: 'user-004',
    name: 'فهد القحطاني',
    avatarUrl: null,
    phone: '+966561234567',
    role: 'member',
    nationalId: '1051****',
    city: 'الدمام',
    club: null,
    preferredLanguage: 'ar',
    car: null,
    subscription: 'free',
    createdAt: '2026-06-01T10:00:00Z',
  },
];

export const DEMO_TRIP_REVIEWS: TripReview[] = [
  {
    id: 'rev-001',
    trip_id: 'trip-001',
    user_id: 'user-002',
    rating: 5,
    comment: 'تنظيم ممتاز، الطرق كانت مثالية للبرونكو. شكرًا للفرق!',
    created_at: '2026-10-06T10:00:00Z',
    user: { id: 'user-002', name: 'سالم الحربي' },
  },
  {
    id: 'rev-002',
    trip_id: 'trip-001',
    user_id: 'user-004',
    rating: 4,
    comment: 'رحلة رائعة، أتمنى زيادة وقت الاستراحة.',
    created_at: '2026-10-06T12:00:00Z',
    user: { id: 'user-004', name: 'فهد القحطاني' },
  },
  {
    id: 'rev-003',
    trip_id: 'trip-002',
    user_id: 'user-003',
    rating: 5,
    comment: 'أجواء خيالية في الشفا، البرونكو كانت في قمة تألقها.',
    created_at: '2026-10-13T15:00:00Z',
    user: { id: 'user-003', name: 'نوف العتيبي' },
  },
];

export const DEMO_SPONSORS: Sponsor[] = [
  { id: 'sp-001', name: 'موتور أويل كسا', logo: '🛢️', category: 'زيوت', cta_ar: 'خصم 20% لكود BRONCO', cta_en: '20% off with code BRONCO', featured: true },
  { id: 'sp-002', name: 'رمل تاور', logo: '⛽', category: 'وقود', cta_ar: 'وقود مجاني مع كل رحلة', cta_en: 'Free fuel with every trip', featured: true },
  { id: 'sp-003', name: 'درع الحماية', logo: '🛡️', category: 'تأمين', cta_ar: 'تأمين برلي +20%', cta_en: 'Offroad insurance +20%', featured: false },
  { id: 'sp-004', name: 'كامبر كينق', logo: '⛺', category: 'تخييم', cta_ar: 'خيام مخفضة', cta_en: 'Tent discounts', featured: false },
  { id: 'sp-005', name: 'طريق 4x4', logo: '🛻', category: 'إكسسوارات', cta_ar: 'جرافات وشنط مجانية', cta_en: 'Free jacks & bags', featured: false },
];

export const DEMO_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    tier: 'free',
    name_ar: 'مجاني',
    name_en: 'Free',
    price: 0,
    popular: false,
    features_ar: ['الانضمام لمجتمع واحد', '3 رحلات شهريًا', 'موقع مباشر 30 دقيقة'],
    features_en: ['Join 1 community', '3 trips/month', '30-min live location'],
  },
  {
    tier: 'pro',
    name_ar: 'برو',
    name_en: 'Pro',
    price: 29,
    popular: true,
    features_ar: ['مجتمعات غير محدودة', 'رحلات غير محدودة', 'موقع مباشر بلا حدود', 'خرائط أوفلاين (3 مناطق)', 'محادثة صوتية'],
    features_en: ['Unlimited communities', 'Unlimited trips', 'Unlimited live location', 'Offline maps (3 regions)', 'Voice chat'],
  },
  {
    tier: 'elite',
    name_ar: 'إيليت',
    name_en: 'Elite',
    price: 79,
    popular: false,
    features_ar: ['كل مزايا برو', 'خرائط أوفلاين بلا حدود', 'زر SOS بملخص', 'أولوية في الدعم', 'شارة مميزة'],
    features_en: ['All Pro features', 'Unlimited offline maps', 'SOS with summary', 'Priority support', 'Elite badge'],
  },
];

export const DEMO_SUBSCRIPTIONS: Subscription[] = [
  { id: 'sub-001', user_id: 'user-001', tier: 'elite', status: 'active', started_at: '2026-08-01T00:00:00Z', expires_at: '2026-10-01T00:00:00Z', user: { id: 'user-001', name: 'عبدالله الفقي', phone: '+966501234567' } },
  { id: 'sub-002', user_id: 'user-002', tier: 'pro', status: 'active', started_at: '2026-07-15T00:00:00Z', expires_at: '2026-09-15T00:00:00Z', user: { id: 'user-002', name: 'سالم الحربي', phone: '+966551234567' } },
  { id: 'sub-003', user_id: 'user-003', tier: 'pro', status: 'past_due', started_at: '2026-06-20T00:00:00Z', expires_at: '2026-09-20T00:00:00Z', user: { id: 'user-003', name: 'نوف العتيبي', phone: '+966541234567' } },
  { id: 'sub-004', user_id: 'user-004', tier: 'free', status: 'active', started_at: '2026-06-01T00:00:00Z', expires_at: null as unknown as string, user: { id: 'user-004', name: 'فهد القحطاني', phone: '+966561234567' } },
];

export const DEMO_TICKETS: SupportTicket[] = [
  { id: 'tkt-001', user_id: 'user-004', subject: 'مشكلة في الدفع على رحلة وادي ديسي', category: 'payment', status: 'open', priority: 'high', created_at: '2026-09-24T09:00:00Z', user: { id: 'user-004', name: 'فهد القحطاني', phone: '+966561234567' } },
  { id: 'tkt-002', user_id: 'user-003', subject: 'طلب رفع مستوى العضوية', category: 'account', status: 'in_progress', priority: 'medium', created_at: '2026-09-23T14:00:00Z', user: { id: 'user-003', name: 'نوف العتيبي', phone: '+966541234567' } },
  { id: 'tkt-003', user_id: 'user-002', subject: 'تنبيه SOS في رحلة النفود — تم الحل', category: 'sos', status: 'resolved', priority: 'critical', created_at: '2026-09-20T22:00:00Z', user: { id: 'user-002', name: 'سالم الحربي', phone: '+966551234567' } },
];

export const DEMO_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-001', actor_id: 'user-001', actor_role: 'platform_admin', action: 'UPDATE_SUBSCRIPTION', target: 'sub-002', detail: 'تم تجديد اشتراك سالم الحربي (برو)', created_at: '2026-09-24T10:00:00Z' },
  { id: 'log-002', actor_id: 'user-003', actor_role: 'community_admin', action: 'APPROVE_JOIN', target: 'comm-001', detail: 'قبول انضمام فهد القحطاني لمجتمع Bronco KSA', created_at: '2026-09-23T11:00:00Z' },
  { id: 'log-003', actor_id: 'user-001', actor_role: 'platform_admin', action: 'CREATE_ADMIN', target: 'admin-002', detail: 'إضافة نوف العتيبي كمسؤولة مجتمعات بصلاحية مراجعة الرحلات', created_at: '2026-09-22T09:00:00Z' },
  { id: 'log-004', actor_id: 'system', actor_role: 'platform_admin', action: 'SOS_ALERT', target: 'sos-001', detail: 'تنبيه SOS في رحلة النفود الكبير — تم الاستجابة خلال 4 دقائق', created_at: '2026-09-20T22:00:00Z' },
  { id: 'log-005', actor_id: 'user-002', actor_role: 'organizer', action: 'CREATE_TRIP', target: 'trip-004', detail: 'إنشاء رحلة تطعيس النفود الكبير', created_at: '2026-09-10T10:00:00Z' },
];

export const DEMO_OFFLINE_REGIONS: OfflineRegion[] = [
  { id: 'reg-001', name_ar: 'الرياض والقصيم', name_en: 'Riyadh & Qassim', sizeMb: 85, status: 'downloaded', progress: 100 },
  { id: 'reg-002', name_ar: 'المنطقة الغربية (مكة-مدينه)', name_en: 'Western (Makkah-Madinah)', sizeMb: 120, status: 'downloading', progress: 42 },
  { id: 'reg-003', name_ar: 'الشرقية (الدمام-الخبر)', name_en: 'Eastern (Dammam-Khobar)', sizeMb: 75, status: 'not_downloaded', progress: 0 },
  { id: 'reg-004', name_ar: 'الشمال (تبوك-حائل)', name_en: 'North (Tabuk-Hail)', sizeMb: 140, status: 'not_downloaded', progress: 0 },
];

export const DEMO_ADMINS: AdminProfile[] = [
  { id: 'admin-001', user_id: 'user-001', name: 'عبدالله الفقي', role: 'super_admin', permissions: ['trips', 'subscriptions', 'pricing', 'admins', 'analytics', 'audit', 'tickets', 'users'], active: true, last_active_at: '2026-09-26T08:00:00Z' },
  { id: 'admin-002', user_id: 'user-003', name: 'نوف العتيبي', role: 'admin', permissions: ['trips', 'tickets', 'users'], active: true, last_active_at: '2026-09-25T18:00:00Z' },
  { id: 'admin-003', user_id: 'user-004', name: 'فهد القحطاني', role: 'support', permissions: ['tickets'], active: false, last_active_at: '2026-09-18T12:00:00Z' },
];

export const DEMO_PERMISSIONS: AdminPermission[] = [
  { key: 'trips', label_ar: 'الرحلات', label_en: 'Trips' },
  { key: 'subscriptions', label_ar: 'الاشتراكات', label_en: 'Subscriptions' },
  { key: 'pricing', label_ar: 'التسعير', label_en: 'Pricing' },
  { key: 'admins', label_ar: 'إدارة المسؤلين', label_en: 'Admins' },
  { key: 'analytics', label_ar: 'التحليلات', label_en: 'Analytics' },
  { key: 'audit', label_ar: 'سجل العمليات', label_en: 'Audit Logs' },
  { key: 'tickets', label_ar: 'التذاكر', label_en: 'Tickets' },
  { key: 'users', label_ar: 'المستخدمين', label_en: 'Users' },
];

// Analytics demo numbers
export const DEMO_ANALYTICS = {
  totalUsers: 1284,
  activeUsers: 342,
  totalTrips: 96,
  completedTrips: 71,
  mrr: 18420, // SAR
  activeSubs: 218,
  avgRating: 4.6,
  sosThisMonth: 9,
  sosAvgResponseMin: 6.4,
  weeklyUsers: [
    { label: 'سبت', value: 120 },
    { label: 'أحد', value: 145 },
    { label: 'اثنين', value: 98 },
    { label: 'ثلاثاء', value: 132 },
    { label: 'أربعاء', value: 150 },
    { label: 'خميس', value: 210 },
    { label: 'جمعة', value: 185 },
  ],
  tripCategories: [
    { label: 'طرق وعرة', value: 42, color: '#C8440B' },
    { label: 'تخييم', value: 28, color: '#1D3557' },
    { label: 'سياحية', value: 18, color: '#4CAF50' },
    { label: 'لقاءات', value: 8, color: '#FFB300' },
  ],
};