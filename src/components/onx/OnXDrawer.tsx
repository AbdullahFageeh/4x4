import React, { useState } from 'react';
import {
  OnXWaypoint,
  OnXTrack,
  OnXLayersState,
  OnXBasemapType,
  Trip,
} from '../../types';
import {
  SAUDI_PUBLIC_RESERVES,
  TECHNICAL_TRAIL_RATINGS,
} from '../../data/onxData';
import {
  Layers,
  Compass,
  Folder,
  Wind,
  Car,
  Search,
  MapPin,
  CircleDot,
  CheckCircle2,
  HardDrive,
  ExternalLink,
  ChevronRight,
  Shield,
  AlertTriangle,
  Sun,
  Sunrise,
  Sunset,
  Gauge,
  Sliders,
  X,
  Plus,
  Radio,
} from 'lucide-react';

interface OnXDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'layers' | 'discover' | 'content' | 'weather' | 'rig';
  setActiveTab: (tab: 'layers' | 'discover' | 'content' | 'weather' | 'rig') => void;
  layersState: OnXLayersState;
  setLayersState: React.Dispatch<React.SetStateAction<OnXLayersState>>;
  waypoints: OnXWaypoint[];
  tracks: OnXTrack[];
  onSelectWaypoint: (wp: OnXWaypoint) => void;
  onSelectTrip: (trip: Trip) => void;
  trips: Trip[];
  onOpenGoogleDriveModal: () => void;
  onSyncWaypointToDrive?: (wp: OnXWaypoint) => void;
  onSyncTrackToDrive?: (track: OnXTrack) => void;
}

export const OnXDrawer: React.FC<OnXDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  layersState,
  setLayersState,
  waypoints,
  tracks,
  onSelectWaypoint,
  onSelectTrip,
  trips,
  onOpenGoogleDriveModal,
  onSyncWaypointToDrive,
  onSyncTrackToDrive,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trailFilter, setTrailFilter] = useState<'all' | 'easy' | 'moderate' | 'expert'>('all');

  if (!isOpen) return null;

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.startLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.communityName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = trailFilter === 'all' || t.difficulty === trailFilter;
    return matchesSearch && matchesDiff;
  });

  return (
    <aside className="absolute top-14 bottom-0 left-0 rtl:left-auto rtl:right-0 z-30 w-full sm:w-[410px] bg-[#0c1018]/98 border-r rtl:border-r-0 rtl:border-l border-white/10 shadow-2xl backdrop-blur-xl flex flex-col text-right rtl:text-right animate-in slide-in-from-left rtl:slide-in-from-right duration-200">
      {/* Drawer Header Tabs */}
      <div className="p-3 border-b border-white/10 bg-[#0e1422] flex items-center justify-between">
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#070a10] rounded-xl border border-white/5">
          {[
            { id: 'layers', label: 'الطبقات', icon: Layers },
            { id: 'discover', label: 'المسارات', icon: Compass },
            { id: 'content', label: 'محتواي', icon: Folder },
            { id: 'weather', label: 'الطقس', icon: Wind },
            { id: 'rig', label: 'الكراج', icon: Car },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#ff6a00] text-black shadow-md font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* ==================== TAB 1: LAYERS ==================== */}
        {activeTab === 'layers' && (
          <div className="space-y-5">
            {/* Basemap Switcher */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block font-mono">
                خرائط الأساس (BASEMAPS)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: 'satellite_hybrid',
                    title: 'قمر صناعي هجين',
                    sub: 'Satellite Hybrid',
                    desc: 'صور جوية عالية الدقة مع تسميات الطرق والمسارات',
                  },
                  {
                    id: 'topo',
                    title: 'تضاريس 20m Topo',
                    sub: 'Topographic Contour',
                    desc: 'خطوط الارتفاع الكنتورية وتفاصيل الأودية والشواهق',
                  },
                  {
                    id: 'terrain_3d',
                    title: 'مجسم 3D Relief',
                    sub: '3D Aerial Perspective',
                    desc: 'إسقاط مائل 45 درجة للشعبان والكثبان الرملية',
                  },
                  {
                    id: 'tactical_dark',
                    title: 'تكتيكي ليلي',
                    sub: 'Tactical Dark Vector',
                    desc: 'وضع عالي التباين بلمسات برتقالية للرؤية الليلية',
                  },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() =>
                      setLayersState((prev) => ({ ...prev, basemap: b.id as OnXBasemapType }))
                    }
                    className={`p-3 rounded-xl border text-right rtl:text-right transition-all flex flex-col justify-between ${
                      layersState.basemap === b.id
                        ? 'bg-[#ff6a00]/15 border-[#ff6a00] shadow-md shadow-[#ff6a00]/20'
                        : 'bg-[#101622] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-white block">{b.title}</span>
                        {layersState.basemap === b.id && (
                          <span className="w-2 h-2 rounded-full bg-[#ff6a00]" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block font-mono">{b.sub}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Overlays Toggles */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block font-mono">
                طبقات الحدود والتضاريس (OVERLAYS)
              </span>
              <div className="space-y-2">
                {[
                  {
                    key: 'showPublicReserves',
                    title: 'المحميات الملكية والأراضي العامة',
                    desc: 'محمية الملك سلمان، الإمام تركي، شرعان، وأراضي BLM المفتوحة',
                    badge: 'الملكية والأذونات',
                    color: 'text-emerald-400',
                  },
                  {
                    key: 'showTrailDifficulty',
                    title: 'تصنيف صعوبة مسارات 4x4',
                    desc: 'ترميز لوني حسب ارتفاع الخلوص الأرضي ونوع الإطارات المطلوبة',
                    badge: 'المسارات الوعرة',
                    color: 'text-amber-400',
                  },
                  {
                    key: 'showActiveConvoys',
                    title: 'قوافل CarCom الميدانية النشطة',
                    desc: 'رؤية سيارات القافلة المباشرة وترددات اللاسلكي UHF',
                    badge: 'بث حي',
                    color: 'text-blue-400',
                  },
                  {
                    key: 'showWindVectors',
                    title: 'ناقلات حركة الرياح والعواصف',
                    desc: 'مؤشرات اتجاه وسرعة الرياح فوق الكثبان الرملية',
                    badge: 'الطقس الميداني',
                    color: 'text-sky-400',
                  },
                  {
                    key: 'showWaypoints',
                    title: 'نقاطي الإحداثية (My Waypoints)',
                    desc: 'عرض المخيمات وعلامات العقبات المسجلة',
                    badge: 'محتواي',
                    color: 'text-[#ff6a00]',
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="p-3 rounded-xl bg-[#101622] border border-white/5 hover:border-white/10 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="pr-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{item.title}</span>
                        <span className={`text-[10px] font-mono ${item.color}`}>({item.badge})</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={(layersState as any)[item.key]}
                      onChange={(e) =>
                        setLayersState((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="w-4 h-4 accent-[#ff6a00] rounded shrink-0 cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Public Reserves Quick Info */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block font-mono">
                المحميات والأنظمة الرسمية
              </span>
              <div className="space-y-2">
                {SAUDI_PUBLIC_RESERVES.map((res) => (
                  <div
                    key={res.id}
                    className="p-3 rounded-xl bg-[#090d14] border-l-4 border-l-emerald-500 border border-white/5 text-xs space-y-1"
                    style={{ borderLeftColor: res.color }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{res.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{res.nameEn}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{res.rules}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: DISCOVER TRAILS ==================== */}
        {activeTab === 'discover' && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مسار، وادي، طعس..."
                className="w-full pr-9 pl-3 py-2 rounded-xl bg-[#090d14] border border-white/10 text-white text-xs focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5 p-1 bg-[#090d14] rounded-xl border border-white/5">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'easy', label: 'سهل (Stock)' },
                { id: 'moderate', label: 'متوسط' },
                { id: 'expert', label: 'وعر (Rock Crawl)' },
              ].map((df) => (
                <button
                  key={df.id}
                  onClick={() => setTrailFilter(df.id as any)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                    trailFilter === df.id
                      ? 'bg-[#ff6a00] text-black font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {df.label}
                </button>
              ))}
            </div>

            {/* Trail Technical Rating Legend */}
            <div className="p-3 rounded-xl bg-[#090d14] border border-white/5 space-y-2 text-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                مقياس onX الفني للمسارات
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {TECHNICAL_TRAIL_RATINGS.map((r, i) => (
                  <div key={i} className="p-1.5 rounded-lg bg-black/40 border border-white/5 text-center">
                    <span
                      className="text-[10px] font-bold block"
                      style={{ color: r.color }}
                    >
                      {r.level}
                    </span>
                    <span className="text-[9px] text-slate-400 block">{r.badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trails List */}
            <div className="space-y-3">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-4 rounded-2xl bg-[#101622] hover:bg-[#141b2a] border border-white/10 hover:border-[#ff6a00]/40 transition-all space-y-3 cursor-pointer group"
                  onClick={() => onSelectTrip(trip)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#ff6a00] transition-colors">
                        {trip.title}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
                        {trip.startLocation} → {trip.endLocation}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#ff6a00]/20 text-[#ff6a00] border border-[#ff6a00]/30 shrink-0">
                      {trip.distanceKm} كم
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300">
                    <div className="p-2 rounded-lg bg-[#090d14] border border-white/5">
                      <span className="text-[10px] text-slate-500 block">صعود الارتفاع</span>
                      <span className="text-emerald-400 font-bold">+{trip.elevationGainM || 340} م</span>
                    </div>
                    <div className="p-2 rounded-lg bg-[#090d14] border border-white/5">
                      <span className="text-[10px] text-slate-500 block">رادار اللاسلكي</span>
                      <span className="text-[#ff6a00] font-bold">UHF 462.56</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {trip.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                    <span className="text-emerald-400 text-[11px] font-semibold">
                      {trip.currentParticipants} سيارة مؤكدة
                    </span>
                    <span className="text-slate-400 group-hover:text-white flex items-center gap-1 text-[11px]">
                      <span>تفاصيل المسار الكاملة</span>
                      <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: MY CONTENT ==================== */}
        {activeTab === 'content' && (
          <div className="space-y-5">
            {/* Google Drive Quick Sync Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">سحابة Google Drive</h4>
                  <p className="text-[11px] text-slate-400">نسخ احتياطي لجميع النقاط والمسارات</p>
                </div>
              </div>
              <button
                onClick={onOpenGoogleDriveModal}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors"
              >
                إدارة السحابة
              </button>
            </div>

            {/* Saved Waypoints List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#ff6a00]" />
                  <span>النقاط الإحداثية المحفوظة ({waypoints.length})</span>
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {waypoints.map((wp) => (
                  <div
                    key={wp.id}
                    className="p-3 rounded-xl bg-[#101622] hover:bg-[#141b2a] border border-white/5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div
                      onClick={() => onSelectWaypoint(wp)}
                      className="cursor-pointer flex-1 min-w-0"
                    >
                      <h5 className="font-semibold text-white truncate">{wp.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                        {wp.lat.toFixed(4)}°N, {wp.lng.toFixed(4)}°E · {wp.elevationM} م
                      </span>
                    </div>

                    {onSyncWaypointToDrive && (
                      <button
                        onClick={() => onSyncWaypointToDrive(wp)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 transition-colors shrink-0"
                        title="مزامنة في Google Drive"
                      >
                        <HardDrive className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recorded Tracks List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <CircleDot className="w-3.5 h-3.5 text-emerald-400" />
                <span>المسارات المسجلة ({tracks.length})</span>
              </span>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {tracks.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3 rounded-xl bg-[#101622] border border-white/5 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold text-white">{tr.name}</h5>
                      <span className="text-[10px] font-mono font-bold text-[#ff6a00]">
                        {tr.distanceKm} كم
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>المدة: {Math.round(tr.durationSeconds / 60)} دقيقة</span>
                      <span>صعود: +{tr.elevationGainM} م</span>
                      <span>السرعة: {tr.avgSpeedKmh} كم/س</span>
                    </div>

                    {onSyncTrackToDrive && (
                      <button
                        onClick={() => onSyncTrackToDrive(tr)}
                        className="w-full mt-1 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <HardDrive className="w-3 h-3 text-blue-400" />
                        <span>نسخ المسار إلى Google Drive</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: WEATHER & WIND ==================== */}
        {activeTab === 'weather' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#101622] border border-white/10 space-y-4 text-center">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                مؤشر سرعة واتجاه الرياح الصحراوية
              </span>

              {/* Wind Rose Compass Dial */}
              <div className="w-32 h-32 mx-auto rounded-full bg-[#080c14] border-2 border-white/10 relative flex items-center justify-center">
                <span className="absolute top-1 text-[10px] font-bold text-[#ff6a00] font-mono">N (شمال)</span>
                <span className="absolute bottom-1 text-[10px] font-bold text-slate-400 font-mono">S (جنوب)</span>
                <span className="absolute left-1 text-[10px] font-bold text-slate-400 font-mono">W</span>
                <span className="absolute right-1 text-[10px] font-bold text-slate-400 font-mono">E</span>

                {/* Rotating Wind Arrow */}
                <div
                  className="w-16 h-1 bg-gradient-to-r from-transparent to-[#ff6a00] rounded-full relative"
                  style={{ transform: 'rotate(45deg)' }}
                >
                  <div className="w-3 h-3 bg-[#ff6a00] rotate-45 absolute -right-1 -top-1" />
                </div>
              </div>

              <div className="text-center">
                <span className="text-2xl font-mono font-bold text-white block">18 كم/س</span>
                <span className="text-xs text-slate-400 font-mono">رياح شمالية شرقية معتدلة (NE · 45°)</span>
              </div>
            </div>

            {/* Weather Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#101622] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Sun className="w-4 h-4" />
                  <span className="text-[10px] text-slate-400">درجة الحرارة</span>
                </div>
                <span className="text-base font-bold text-white">31° م</span>
                <span className="text-[10px] text-slate-500 block">المحسوسة: 29° م</span>
              </div>

              <div className="p-3 rounded-xl bg-[#101622] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-sky-400">
                  <Gauge className="w-4 h-4" />
                  <span className="text-[10px] text-slate-400">الضغط الجوي</span>
                </div>
                <span className="text-base font-bold text-white">1013 hPa</span>
                <span className="text-[10px] text-slate-500 block">مستقر</span>
              </div>

              <div className="p-3 rounded-xl bg-[#101622] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Sunrise className="w-4 h-4" />
                  <span className="text-[10px] text-slate-400">شروق الشمس</span>
                </div>
                <span className="text-sm font-bold text-white">05:42 ص</span>
                <span className="text-[10px] text-slate-500 block">بدء الإضاءة الكافية</span>
              </div>

              <div className="p-3 rounded-xl bg-[#101622] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-rose-400">
                  <Sunset className="w-4 h-4" />
                  <span className="text-[10px] text-slate-400">غروب الشمس</span>
                </div>
                <span className="text-sm font-bold text-white">06:05 م</span>
                <span className="text-[10px] text-slate-500 block">موعد نصب المخيم</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: RIG / GARAGE SETUP ==================== */}
        {activeTab === 'rig' && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#101622] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">مركبة الاستكشاف الأساسية</h4>
                  <span className="text-[11px] text-[#ff6a00] font-mono">Toyota Land Cruiser LC300 GR</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                  جاهزة للصحراء
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-white/5">
                <div className="p-2 rounded-lg bg-[#090d14]">
                  <span className="text-[10px] text-slate-500 block">مقاس الإطارات</span>
                  <span className="text-white font-bold">33" BFGoodrich AT</span>
                </div>
                <div className="p-2 rounded-lg bg-[#090d14]">
                  <span className="text-[10px] text-slate-500 block">الخلوص الأرضي</span>
                  <span className="text-white font-bold">11.2 إنش (مرفوع 2")</span>
                </div>
                <div className="p-2 rounded-lg bg-[#090d14]">
                  <span className="text-[10px] text-slate-500 block">قفل الدفرنس</span>
                  <span className="text-emerald-400 font-bold">Front + Rear Lockers</span>
                </div>
                <div className="p-2 rounded-lg bg-[#090d14]">
                  <span className="text-[10px] text-slate-500 block">الونش الأمامي</span>
                  <span className="text-white font-bold">WARN 10,000 lbs Synthetic</span>
                </div>
              </div>
            </div>

            {/* Recommended Offroad Tire Pressure Matrix */}
            <div className="p-4 rounded-2xl bg-[#090d14] border border-white/5 space-y-2 text-xs">
              <span className="text-xs font-bold text-white block">جدول تنسيم ضغط الإطارات الموصى به</span>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40">
                  <span className="text-slate-300">الأسفلت والطرق السريعة:</span>
                  <span className="text-white font-bold">32 - 35 PSI</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40">
                  <span className="text-slate-300">مسارات الحصى والصخور:</span>
                  <span className="text-amber-400 font-bold">20 - 22 PSI</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40">
                  <span className="text-slate-300">الكثبان والرمال الناعمة:</span>
                  <span className="text-[#ff6a00] font-bold">12 - 14 PSI</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-black/40">
                  <span className="text-slate-300">التغريز الشديد والطوارئ:</span>
                  <span className="text-red-400 font-bold">8 - 10 PSI</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
