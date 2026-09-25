import { OnXWaypoint, OnXTrack, OnXOfflineArea, OnXLayersState } from '../types';

export const INITIAL_ONX_LAYERS: OnXLayersState = {
  basemap: 'satellite_hybrid',
  showPublicReserves: true,
  showTrailDifficulty: true,
  showActiveConvoys: true,
  showWindVectors: true,
  showWaypoints: true,
  showRecordedTracks: true,
};

export const INITIAL_WAYPOINTS: OnXWaypoint[] = [
  {
    id: 'wp-01',
    name: 'مطل شرفة حافة العالم (جبل فهرين)',
    icon: 'viewpoint',
    color: '#ff6a00', // onX Signal Orange
    lat: 24.9458,
    lng: 45.9922,
    elevationM: 980,
    notes: 'إطلالة شواهق طويق، يتطلب دبل ثقيل وإطارات AT 33"',
    createdAt: '2026-09-20T14:30:00Z',
  },
  {
    id: 'wp-02',
    name: 'قمة طعس التحدي - الثمامة',
    icon: 'dune',
    color: '#f59e0b', // Amber
    lat: 25.0421,
    lng: 46.6119,
    elevationM: 670,
    notes: 'تنسيم إلى 12 PSI مع رفع راية الأمان الرملية 3 متر',
    createdAt: '2026-09-21T09:15:00Z',
  },
  {
    id: 'wp-03',
    name: 'مخيم الدخول والخروج - وادي الرمة',
    icon: 'campsite',
    color: '#10b981', // Forest Pine
    lat: 26.0125,
    lng: 44.1542,
    elevationM: 540,
    notes: 'أرضية مستوية محمية من الرياح الشمالية، حطب سمر مرخص',
    createdAt: '2026-09-22T17:00:00Z',
  },
  {
    id: 'wp-04',
    name: 'عقبة الصخور الحادة (Rock Crawl)',
    icon: 'obstacle',
    color: '#ef4444', // Red Alert
    lat: 24.8124,
    lng: 46.1205,
    elevationM: 810,
    notes: 'صخور بازلتية حادة، يوصى بوجود لوكر خلفي وونش سحب',
    createdAt: '2026-09-23T11:45:00Z',
  },
  {
    id: 'wp-05',
    name: 'نقطة تزود بالوقود والماء - محطة ساسكو الصحراوية',
    icon: 'fuel',
    color: '#38bdf8', // Sky Blue
    lat: 24.5501,
    lng: 46.3302,
    elevationM: 615,
    notes: 'بنزين 95 و 91 مع ماء عذب ومحل صيانة إطارات وضاغط هواء',
    createdAt: '2026-09-24T08:00:00Z',
  },
  {
    id: 'wp-06',
    name: 'نقطة طوارئ واستعادة ونش (Recovery Anchor)',
    icon: 'recovery',
    color: '#ec4899', // Pink
    lat: 25.1215,
    lng: 46.4521,
    elevationM: 705,
    notes: 'مكان مناسب لتثبيت حبال السحب وتجهيز ألواح الخروج',
    createdAt: '2026-09-24T16:20:00Z',
  },
];

export const INITIAL_TRACKS: OnXTrack[] = [
  {
    id: 'tr-01',
    name: 'مسار قوافل جبال طويق الصخري',
    distanceKm: 42.8,
    durationSeconds: 9420, // 2h 37m
    avgSpeedKmh: 16.3,
    elevationGainM: 520,
    color: '#ff6a00',
    createdAt: '2026-09-22T16:00:00Z',
    points: [
      { lat: 24.88, lng: 46.08, alt: 640, timestamp: 1 },
      { lat: 24.90, lng: 46.05, alt: 720, timestamp: 2 },
      { lat: 24.92, lng: 46.02, alt: 840, timestamp: 3 },
      { lat: 24.9458, lng: 45.9922, alt: 980, timestamp: 4 },
    ],
  },
  {
    id: 'tr-02',
    name: 'عروق الدهناء ونفود الرمال الحمراء',
    distanceKm: 68.2,
    durationSeconds: 14100, // 3h 55m
    avgSpeedKmh: 17.4,
    elevationGainM: 310,
    color: '#10b981',
    createdAt: '2026-09-18T12:00:00Z',
    points: [
      { lat: 25.01, lng: 46.68, alt: 610, timestamp: 1 },
      { lat: 25.03, lng: 46.64, alt: 645, timestamp: 2 },
      { lat: 25.0421, lng: 46.6119, alt: 670, timestamp: 3 },
      { lat: 25.06, lng: 46.58, alt: 690, timestamp: 4 },
    ],
  },
];

export const INITIAL_OFFLINE_AREAS: OnXOfflineArea[] = [
  {
    id: 'off-01',
    name: 'قطاع حافة العالم وجبال طويق',
    region: 'منطقة الرياض',
    sizeMb: 148,
    resolution: 'high',
    bounds: {
      north: 25.2,
      south: 24.7,
      east: 46.3,
      west: 45.8,
    },
    downloadedAt: '2026-09-20',
  },
  {
    id: 'off-02',
    name: 'كثبان نفود الثمامة والرمال الحمراء',
    region: 'منطقة الرياض',
    sizeMb: 92,
    resolution: 'standard',
    bounds: {
      north: 25.3,
      south: 24.9,
      east: 46.8,
      west: 46.4,
    },
    downloadedAt: '2026-09-22',
  },
  {
    id: 'off-03',
    name: 'محمية شرعان وأودية العلا',
    region: 'المدينة المنورة - العلا',
    sizeMb: 215,
    resolution: 'ultra',
    bounds: {
      north: 26.8,
      south: 26.2,
      east: 38.3,
      west: 37.8,
    },
    downloadedAt: '2026-09-23',
  },
];

export interface PublicReserveBoundary {
  id: string;
  name: string;
  nameEn: string;
  authority: string;
  type: 'royal_reserve' | 'wildlife_sanctuary' | 'national_park' | 'public_blm';
  rules: string;
  color: string;
  center: { lat: number; lng: number };
}

export const SAUDI_PUBLIC_RESERVES: PublicReserveBoundary[] = [
  {
    id: 'res-01',
    name: 'محمية الملك سلمان الملكية',
    nameEn: 'King Salman Royal Reserve',
    authority: 'هيئة تطوير محمية الملك سلمان الملكية',
    type: 'royal_reserve',
    rules: 'يسمح بالعبور في المسارات المحددة فقط. الصيد ممنوع منعاً باتاً. تصريح دخول مطلوب للتخييم.',
    color: '#059669', // Emerald Green boundary
    center: { lat: 29.1, lng: 39.5 },
  },
  {
    id: 'res-02',
    name: 'محمية الإمام تركي بن عبد الله',
    nameEn: 'Imam Turki Royal Reserve',
    authority: 'هيئة تطوير محمية الإمام تركي الملكية',
    type: 'royal_reserve',
    rules: 'مسارات مخصصة لمركبات 4x4. الالتزام بعدم دهس الغطاء النباتي وتجنب بطون الأودية المحمية.',
    color: '#d97706', // Amber boundary
    center: { lat: 27.8, lng: 43.6 },
  },
  {
    id: 'res-03',
    name: 'محمية شرعان الطبيعية - العلا',
    nameEn: 'Sharaan Nature Reserve',
    authority: 'الهيئة الملكية لمحافظة العلا',
    type: 'wildlife_sanctuary',
    rules: 'محمية كائنات فطرية ونمور عربية. الدخول برفقة مرشد مرخص أو قافلة معتمدة.',
    color: '#7c3aed', // Purple boundary
    center: { lat: 26.6, lng: 38.1 },
  },
  {
    id: 'res-04',
    name: 'أراضي الدرع العربي الصحراوية المفتوحة',
    nameEn: 'Public Wilderness & BLM Trail Land',
    authority: 'أراضي عامة للرياضات الرملية والدفع الرباعي',
    type: 'public_blm',
    rules: 'مفتوحة لممارسي الدفع الرباعي وهواة التطعيس مع الالتزام بقواعد السلامة واللاسلكي.',
    color: '#2563eb', // Blue boundary
    center: { lat: 24.8, lng: 46.2 },
  },
];

export const TECHNICAL_TRAIL_RATINGS = [
  {
    level: '1-2 (سهل)',
    badge: 'Stock 4x4',
    color: '#10b981',
    desc: 'طرق رملية ممهدة أو مسارات ترابية جافة، مناسبة لسيارات الدفع الرباعي غير المعدلة.',
    clearance: '8+ إنش خلوص أرضي',
    tires: 'إطارات وكالة أو All-Terrain',
  },
  {
    level: '3-4 (متوسط)',
    badge: 'High Clearance',
    color: '#f59e0b',
    desc: 'طعوس رملية حادة، مسارات صخرية متوسطة، بطون أودية تتطلب تنسيم الإطارات ومهارة توجيه.',
    clearance: '10+ إنش مع صفائح حماية (Skid Plates)',
    tires: 'إطارات 33" AT/MT مع ضاغط هواء',
  },
  {
    level: '5+ (وعر جداً)',
    badge: 'Technical Crawler',
    color: '#ef4444',
    desc: 'جروف صخرية حادة، كثبان رملية شاهقة، ميلان جانبي خطر، يتطلب لوكر خلفي/أمامي وونش.',
    clearance: '12+ إنش مع تعليق مدعم',
    tires: 'إطارات 35"+ Mud Terrain مع بيادلوك',
  },
];
