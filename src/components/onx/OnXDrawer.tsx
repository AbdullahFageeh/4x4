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
  ChevronRight,
  Shield,
  AlertTriangle,
  Sun,
  Sunrise,
  Sunset,
  Gauge,
  X,
  Plus,
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
  onDropWaypointAtCenter?: () => void;
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
  onDropWaypointAtCenter,
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
    <aside className="absolute top-0 bottom-0 left-0 rtl:left-auto rtl:right-0 z-30 w-full sm:w-[420px] bg-[#151412] border-r rtl:border-r-0 rtl:border-l border-[rgba(235,233,228,0.08)] shadow-[20px_0_60px_rgba(0,0,0,0.5)] flex flex-col text-right rtl:text-right overflow-y-auto animate-in slide-in-from-left rtl:slide-in-from-right duration-200">
      {/* Drawer Header & Tabs */}
      <div className="p-4 border-b border-[rgba(235,233,228,0.08)] bg-[#191816] flex items-center justify-between">
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-[#151412] border border-[rgba(235,233,228,0.08)]">
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
                className={`px-3 py-1.5 text-xs font-mono tracking-wider flex items-center gap-1.5 transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#151412] font-bold shadow-sm'
                    : 'text-[#EBE9E4]/60 hover:text-[#EBE9E4]'
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
          className="p-1.5 text-[#EBE9E4]/50 hover:text-[#EBE9E4] transition-colors"
          title="إغلاق اللوحة"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* ==================== TAB 1: LAYERS ==================== */}
        {activeTab === 'layers' && (
          <div className="space-y-6">
            {/* Exploration Mode Section */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#EBE9E4]/50 mb-1">
                Exploration Mode
              </div>
              <h3 className="font-serif text-2xl text-[#EBE9E4] pb-1 border-b border-[#D4AF37] inline-block mb-2">
                نظام الملاحة الصحراوي
              </h3>
              <p className="text-xs text-[#EBE9E4]/60 leading-relaxed font-sans">
                استكشف المسارات الوعرة والمحميات الملكية في المملكة العربية السعودية بدقة تكتيكية عالية.
              </p>
            </div>

            {/* Maps & Overlays Section */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#EBE9E4]/50 mb-2">
                Maps & Overlays
              </div>

              {/* Basemap Toggle */}
              <div className="flex gap-[1px] bg-[rgba(235,233,228,0.08)] border border-[rgba(235,233,228,0.08)] p-[2px] mb-3">
                {[
                  { id: 'satellite_hybrid', label: 'هجين' },
                  { id: 'topo', label: 'تضاريس' },
                  { id: 'tactical_dark', label: 'ليلي' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() =>
                      setLayersState((prev) => ({ ...prev, basemap: b.id as OnXBasemapType }))
                    }
                    className={`flex-1 py-1.5 text-center font-mono text-xs transition-colors ${
                      layersState.basemap === b.id
                        ? 'bg-[#D4AF37] text-[#151412] font-bold'
                        : 'bg-[#151412] text-[#EBE9E4]/80 hover:text-white'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>

              {/* Layer Items */}
              <div className="space-y-2">
                {[
                  {
                    key: 'showPublicReserves',
                    title: 'المحميات الملكية',
                    subtitle: 'Royal Reserves',
                  },
                  {
                    key: 'showTrailDifficulty',
                    title: 'صعوبة المسارات',
                    subtitle: '4x4 Difficulty',
                  },
                  {
                    key: 'showActiveConvoys',
                    title: 'بث القوافل الحي',
                    subtitle: 'Live Convoys',
                  },
                  {
                    key: 'showWaypoints',
                    title: 'نقاطي المسجلة',
                    subtitle: 'Personal Waypoints',
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex justify-between items-center p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.08)] hover:border-[#D4AF37] hover:bg-[rgba(212,175,55,0.05)] transition-all cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-semibold text-[#EBE9E4]">{item.title}</div>
                      <div className="font-mono text-[9px] uppercase tracking-wider text-[#EBE9E4]/40 mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={(layersState as any)[item.key]}
                      onChange={(e) =>
                        setLayersState((prev) => ({ ...prev, [item.key]: e.target.checked }))
                      }
                      className="w-4 h-4 accent-[#D4AF37] cursor-pointer"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Expedition Log Section */}
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#EBE9E4]/50 mb-2">
                Expedition Log
              </div>

              <div className="space-y-3">
                <div className="text-xs leading-relaxed text-[#10B981] pr-3 border-r-2 border-r-[#10B981]">
                  <strong className="block font-semibold">محمية الملك سلمان الملكية</strong>
                  <span className="text-[#EBE9E4]/70 text-[11px]">
                    الالتزام بالمسارات المحددة. الصيد ممنوع منعاً باتاً.
                  </span>
                </div>

                <div className="text-xs leading-relaxed text-[#D4AF37] pr-3 border-r-2 border-r-[#D4AF37]">
                  <strong className="block font-semibold">محمية الإمام تركي</strong>
                  <span className="text-[#EBE9E4]/70 text-[11px]">
                    مسارات 4x4 معتمدة فقط لتجنب دهس الغطاء النباتي.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: DISCOVER TRAILS ==================== */}
        {activeTab === 'discover' && (
          <div className="space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#EBE9E4]/50 mb-1">
              Curated Trails
            </div>
            <h3 className="font-serif text-2xl text-[#EBE9E4] pb-1 border-b border-[#D4AF37] inline-block mb-2">
              مسارات المملكة الوعرة
            </h3>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute right-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-[#EBE9E4]/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مسار، وادي، طعس..."
                className="w-full pr-8 pl-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.1)] text-[#EBE9E4] text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* Difficulty Tabs */}
            <div className="flex gap-[1px] bg-[rgba(235,233,228,0.08)] border border-[rgba(235,233,228,0.08)] p-[2px]">
              {[
                { id: 'all', label: 'الكل' },
                { id: 'easy', label: 'سهل' },
                { id: 'moderate', label: 'متوسط' },
                { id: 'expert', label: 'وعر' },
              ].map((df) => (
                <button
                  key={df.id}
                  onClick={() => setTrailFilter(df.id as any)}
                  className={`flex-1 py-1 font-mono text-[11px] transition-colors ${
                    trailFilter === df.id
                      ? 'bg-[#D4AF37] text-[#151412] font-bold'
                      : 'bg-[#151412] text-[#EBE9E4]/70 hover:text-white'
                  }`}
                >
                  {df.label}
                </button>
              ))}
            </div>

            {/* Trails List */}
            <div className="space-y-3 pt-2">
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => onSelectTrip(trip)}
                  className="p-3.5 bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(212,175,55,0.05)] border border-[rgba(235,233,228,0.08)] hover:border-[#D4AF37] transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-[#EBE9E4] group-hover:text-[#D4AF37] transition-colors">
                        {trip.title}
                      </h4>
                      <span className="font-mono text-[10px] text-[#EBE9E4]/50 mt-0.5 block">
                        {trip.startLocation} → {trip.endLocation}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-[#D4AF37] font-bold">
                      {trip.distanceKm} KM
                    </span>
                  </div>

                  <p className="text-[11px] text-[#EBE9E4]/60 line-clamp-2 leading-relaxed">
                    {trip.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[rgba(235,233,228,0.06)] font-mono text-[10px] text-[#EBE9E4]/50">
                    <span className="text-[#10B981]">{trip.currentParticipants} سيارة مؤكدة</span>
                    <span className="text-[#D4AF37] flex items-center gap-1">
                      <span>عرض الخطة</span>
                      <ChevronRight className="w-3 h-3 rtl:rotate-180" />
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
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#EBE9E4]/50 mb-1">
                Vault & Cloud
              </div>
              <h3 className="font-serif text-2xl text-[#EBE9E4] pb-1 border-b border-[#D4AF37] inline-block mb-2">
                سحابة الاستكشاف
              </h3>
            </div>

            {/* Google Drive Banner */}
            <div className="p-3.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.1)] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 text-[#D4AF37]" />
                <div>
                  <div className="text-xs font-semibold text-[#EBE9E4]">Google Drive</div>
                  <div className="font-mono text-[10px] text-[#EBE9E4]/50">مزامنة سحابية للنقاط والمسارات</div>
                </div>
              </div>
              <button
                onClick={onOpenGoogleDriveModal}
                className="bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#151412] px-2.5 py-1 text-[10px] font-mono uppercase transition-colors"
              >
                إدارة
              </button>
            </div>

            {/* Saved Waypoints */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#EBE9E4]/60">
                النقاط الإحداثية ({waypoints.length})
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {waypoints.map((wp) => (
                  <div
                    key={wp.id}
                    className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(235,233,228,0.06)] flex items-center justify-between gap-3 text-xs"
                  >
                    <div
                      onClick={() => onSelectWaypoint(wp)}
                      className="cursor-pointer flex-1 min-w-0"
                    >
                      <h5 className="font-semibold text-[#EBE9E4] truncate">{wp.name}</h5>
                      <span className="font-mono text-[10px] text-[#EBE9E4]/50 block mt-0.5">
                        {wp.lat.toFixed(4)}°N, {wp.lng.toFixed(4)}°E · {wp.elevationM} M
                      </span>
                    </div>

                    {onSyncWaypointToDrive && (
                      <button
                        onClick={() => onSyncWaypointToDrive(wp)}
                        className="p-1 text-[#EBE9E4]/50 hover:text-[#D4AF37] transition-colors"
                        title="مزامنة بـ Google Drive"
                      >
                        <HardDrive className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Recorded Tracks */}
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#EBE9E4]/60">
                المسارات المسجلة ({tracks.length})
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {tracks.map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(235,233,228,0.06)] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h5 className="font-semibold text-[#EBE9E4]">{tr.name}</h5>
                      <span className="font-mono text-[10px] text-[#D4AF37] font-bold">
                        {tr.distanceKm} KM
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-[#EBE9E4]/50">
                      صعود: +{tr.elevationGainM} M · السرعة: {tr.avgSpeedKmh} KM/H
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: WEATHER & WIND ==================== */}
        {activeTab === 'weather' && (
          <div className="space-y-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#EBE9E4]/50 mb-1">
                Meteorology
              </div>
              <h3 className="font-serif text-2xl text-[#EBE9E4] pb-1 border-b border-[#D4AF37] inline-block mb-2">
                محطة الرياح والطقس
              </h3>
            </div>

            <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(235,233,228,0.08)] text-center space-y-3">
              <div className="font-mono text-[10px] uppercase text-[#EBE9E4]/50">
                Surface Wind Vector
              </div>
              <div className="font-mono text-2xl font-bold text-[#EBE9E4]">18 KM/H</div>
              <div className="font-mono text-xs text-[#D4AF37]">NE · 45° (شمالية شرقية)</div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(235,233,228,0.06)]">
                <span className="text-[10px] text-[#EBE9E4]/50 block">درجة الحرارة</span>
                <span className="text-sm font-bold text-[#EBE9E4]">31° C</span>
              </div>
              <div className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(235,233,228,0.06)]">
                <span className="text-[10px] text-[#EBE9E4]/50 block">الضغط الجوي</span>
                <span className="text-sm font-bold text-[#EBE9E4]">1013 hPa</span>
              </div>
              <div className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(235,233,228,0.06)]">
                <span className="text-[10px] text-[#EBE9E4]/50 block">شروق الشمس</span>
                <span className="text-xs font-bold text-[#EBE9E4]">05:42 AM</span>
              </div>
              <div className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(235,233,228,0.06)]">
                <span className="text-[10px] text-[#EBE9E4]/50 block">غروب الشمس</span>
                <span className="text-xs font-bold text-[#EBE9E4]">06:05 PM</span>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: RIG SETUP ==================== */}
        {activeTab === 'rig' && (
          <div className="space-y-4">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#EBE9E4]/50 mb-1">
                Vehicle Telemetry
              </div>
              <h3 className="font-serif text-2xl text-[#EBE9E4] pb-1 border-b border-[#D4AF37] inline-block mb-2">
                تجهيزات المركبة
              </h3>
            </div>

            <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(235,233,228,0.08)] space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-[#EBE9E4]">Toyota Land Cruiser LC300 GR</h4>
                <span className="font-mono text-[10px] text-[#D4AF37]">EXPEDITION RIG</span>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-[11px] pt-2 border-t border-[rgba(235,233,228,0.06)]">
                <div className="p-2 bg-[rgba(0,0,0,0.3)]">
                  <span className="text-[9px] text-[#EBE9E4]/50 block">مقاس الإطارات</span>
                  <span className="text-[#EBE9E4] font-bold">33" BFGoodrich AT</span>
                </div>
                <div className="p-2 bg-[rgba(0,0,0,0.3)]">
                  <span className="text-[9px] text-[#EBE9E4]/50 block">الخلوص الأرضي</span>
                  <span className="text-[#EBE9E4] font-bold">11.2 INCH</span>
                </div>
                <div className="p-2 bg-[rgba(0,0,0,0.3)]">
                  <span className="text-[9px] text-[#EBE9E4]/50 block">قفل الدفرنس</span>
                  <span className="text-[#10B981] font-bold">Front + Rear</span>
                </div>
                <div className="p-2 bg-[rgba(0,0,0,0.3)]">
                  <span className="text-[9px] text-[#EBE9E4]/50 block">الونش الأمامي</span>
                  <span className="text-[#EBE9E4] font-bold">WARN 10,000 lbs</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action: "تثبيت نقطة هنا" (btn-gold) */}
      <div className="p-6 pt-0 mt-auto">
        <button
          onClick={() => {
            if (onDropWaypointAtCenter) onDropWaypointAtCenter();
          }}
          className="w-full bg-[#D4AF37] hover:brightness-110 text-[#151412] py-3.5 font-serif font-bold text-base tracking-wide transition-all shadow-lg active:scale-[0.99] cursor-pointer"
        >
          تثبيت نقطة هنا
        </button>
      </div>
    </aside>
  );
};
