import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Trip, TripDifficulty, VehicleCategory } from '../../types';
import { TripCard } from './TripCard';
import { TripDetailModal } from './TripDetailModal';
import { CreateTripModal } from './CreateTripModal';
import {
  Compass,
  Calendar,
  MapPin,
  Plus,
  Search,
  Filter,
  Radio,
  Navigation,
  CheckCircle,
  Flag,
  Car,
  X,
  RotateCcw,
  SlidersHorizontal,
  Clock,
} from 'lucide-react';

export const TripsView: React.FC = () => {
  const { trips, toggleRegisterTrip, currentUser, dir } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'registered' | 'completed'>('upcoming');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedVehicleType, setSelectedVehicleType] = useState<string>('all');
  const [selectedDestination, setSelectedDestination] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  const isRtl = dir === 'rtl';

  // Vehicle category localized labels for intelligent search matching
  const vehicleCategoryKeywords: Record<string, string[]> = {
    '4x4': ['4x4', 'دفع رباعي', 'جيب', 'أوف رود', 'off-road', 'طعوس', 'تطعيس', 'بر', 'صحراوي', 'لاندكروزر', 'باترول'],
    'supercar': ['سوبركار', 'supercar', 'رياضية', 'سبورت', 'sport', 'فيراري', 'بورشه', 'gt', 'كوبيه', 'لامبورغيني'],
    'classic': ['كلاسيك', 'classic', 'تاريخية', 'تراثية', 'قديمة', 'فنتج'],
    'drift': ['دريفت', 'drift', 'تعديل', 'حلبة', 'tuning'],
    'motorcycle': ['دراجة', 'دباب', 'motorcycle', 'bike'],
    'electric': ['كهربائية', 'electric', 'ev'],
  };

  // Pre-defined key destinations for quick filtering
  const destinationOptions = [
    { id: 'all', label: 'كافة الوجهات' },
    { id: 'طويق', label: 'حافة العالم وطويق' },
    { id: 'الرمال الحمراء', label: 'كثبان الرمال الحمراء' },
    { id: 'جدة', label: 'كورنيش جدة وأبحر' },
    { id: 'عسير', label: 'عقبة الصماء وعسير' },
  ];

  // Vehicle type options
  const vehicleTypeOptions: { id: string; label: string; icon?: string }[] = [
    { id: 'all', label: 'كافة أنواع المركبات' },
    { id: '4x4', label: 'دفع رباعي و4x4' },
    { id: 'supercar', label: 'سوبركار وسيارات رياضية' },
    { id: 'classic', label: 'سيارات كلاسيكية' },
    { id: 'drift', label: 'دريفت وتعديل' },
  ];

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedDifficulty !== 'all' ||
    selectedVehicleType !== 'all' ||
    selectedDestination !== 'all' ||
    selectedDate
  );

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDifficulty('all');
    setSelectedVehicleType('all');
    setSelectedDestination('all');
    setSelectedDate('');
  };

  const filteredTrips = useMemo(() => {
    return trips.filter((t) => {
      // 1. Tab filter
      if (activeTab === 'registered' && !t.isRegistered) return false;
      if (activeTab === 'completed' && t.status !== 'completed') return false;

      // 2. Difficulty filter
      if (selectedDifficulty !== 'all' && t.difficulty !== selectedDifficulty) return false;

      // 3. Vehicle Type dropdown / pill filter
      if (selectedVehicleType !== 'all' && t.vehicleCategory !== selectedVehicleType) {
        return false;
      }

      // 4. Destination dropdown / pill filter
      if (selectedDestination !== 'all') {
        const matchesDest =
          t.endLocation.toLowerCase().includes(selectedDestination.toLowerCase()) ||
          t.startLocation.toLowerCase().includes(selectedDestination.toLowerCase()) ||
          t.waypoints.some((wp) => wp.toLowerCase().includes(selectedDestination.toLowerCase()));
        if (!matchesDest) return false;
      }

      // 5. Date filter
      if (selectedDate && t.date !== selectedDate) {
        return false;
      }

      // 6. Search query (matches Destination, Date, or Vehicle Type, or Title/Community)
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();

        // Check destination match
        const matchesDestination =
          t.endLocation.toLowerCase().includes(query) ||
          t.startLocation.toLowerCase().includes(query) ||
          t.waypoints.some((wp) => wp.toLowerCase().includes(query));

        // Check date match (e.g. "2026-10-02", "10-02", "2026", "أكتوبر", "جمعة", etc.)
        const matchesDate =
          t.date.toLowerCase().includes(query) ||
          t.meetingTime.toLowerCase().includes(query);

        // Check vehicle type match (category keywords + vehicle requirements)
        const vehicleKeywords = vehicleCategoryKeywords[t.vehicleCategory] || [];
        const matchesVehicleType =
          t.vehicleCategory.toLowerCase().includes(query) ||
          t.vehicleRequirement.toLowerCase().includes(query) ||
          vehicleKeywords.some((kw) => kw.toLowerCase().includes(query));

        // General title & community match
        const matchesGeneral =
          t.title.toLowerCase().includes(query) ||
          t.titleEn.toLowerCase().includes(query) ||
          t.communityName.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query);

        if (!matchesDestination && !matchesDate && !matchesVehicleType && !matchesGeneral) {
          return false;
        }
      }

      return true;
    });
  }, [
    trips,
    activeTab,
    selectedDifficulty,
    selectedVehicleType,
    selectedDestination,
    selectedDate,
    searchQuery,
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Header with Stats & Create Trip Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-[#111722] border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              قوافل ومسارات المملكة
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
              {trips.length} قافلة نشطة
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            رحلات برية منظمة، مسارات جبلية، وكروزات ساحلية مع أجهزة لاسلكية وبروتوكولات سلامة
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>تنظيم مسار جديد</span>
        </button>
      </div>

      {/* 2. Interactive Map / Route Preview Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c1219] via-[#101722] to-[#090d13] border border-white/10 p-5 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>خريطة القوافل والمسارات النشطة اليوم</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              مسار الأسبوع: خشم العان وحافة طويق الصخرية
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              مسار متكامل يمتد 145 كم، نقطة التجمع عند مخرج صلبوخ، مع رتل مجهز بلاسلكي UHF وقائد مسار معتمد، ينتهي بمطل جبلي خيالي وعشاء شبة نار.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono pt-1">
              <span className="flex items-center gap-1 text-slate-200">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>الرياض · طويق</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-slate-200">
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>145 كم</span>
              </span>
              <span>·</span>
              <span className="text-amber-400">تردد اللاسلكي: UHF 462.5625 MHz</span>
            </div>
          </div>

          {/* Graphical Topographic Route Preview Card */}
          <div className="w-full lg:w-96 rounded-xl bg-[#090d14] border border-white/10 p-3.5 relative overflow-hidden shadow-inner">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
              <span className="text-emerald-400 font-bold">● مسار حي (Live Route)</span>
              <span>GPS 24.7136° N, 46.6753° E</span>
            </div>

            {/* SVG Topographic Mini Map */}
            <div className="relative w-full h-28 rounded-lg overflow-hidden bg-[#070b10] border border-white/5">
              <svg className="w-full h-full opacity-60" viewBox="0 0 300 120">
                <path d="M10,80 Q60,30 120,60 T220,40 T290,70" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="5 3" />
                <path d="M0,100 Q80,70 150,90 T300,75 L300,120 L0,120 Z" fill="rgba(16, 185, 129, 0.1)" />
                <circle cx="10" cy="80" r="5" fill="#10b981" />
                <circle cx="120" cy="60" r="4" fill="#38bdf8" />
                <circle cx="220" cy="40" r="4" fill="#f59e0b" />
                <circle cx="290" cy="70" r="6" fill="#ef4444" />
                <text x="15" y="98" fill="#94a3b8" fontSize="10" fontFamily="monospace">انطلاق</text>
                <text x="250" y="95" fill="#94a3b8" fontSize="10" fontFamily="monospace">القمة</text>
              </svg>
              <div className="absolute bottom-1 right-2 rtl:right-auto rtl:left-2 text-[10px] text-slate-400 font-mono">
                صعود: +420م
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-[11px] text-slate-300">
              <span>حالة الطريق: رمال جافة ومسار صخري</span>
              <button
                onClick={() => {
                  const t = trips.find((x) => x.id === 'trip_01');
                  if (t) setSelectedTrip(t);
                }}
                className="text-amber-400 hover:underline font-semibold"
              >
                عرض المسار الكامل ←
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Navigation & Enhanced Multi-Attribute Search Bar */}
      <div className="space-y-4">
        {/* Top Control Bar: Main Tabs & Reset Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Main Tabs (Upcoming / Registered / Completed) */}
          <div className="flex p-1 bg-[#111720] rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-amber-500 text-black shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              جميع القوافل القادمة
            </button>
            <button
              onClick={() => setActiveTab('registered')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'registered'
                  ? 'bg-amber-500 text-black shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>رحلاتي المشترك بها</span>
              <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-mono">
                {trips.filter((t) => t.isRegistered).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'completed'
                  ? 'bg-amber-500 text-black shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الرحلات المكتملة
            </button>
          </div>

          {/* Reset Filters Action */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-400 hover:text-amber-300 text-xs font-semibold border border-amber-500/20 transition-colors self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة ضبط التصفية</span>
            </button>
          )}
        </div>

        {/* Multi-Criteria Search Bar */}
        <div className="relative rounded-2xl bg-[#111720] border border-white/10 p-2.5 sm:p-3 shadow-lg space-y-3">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="absolute right-3.5 rtl:right-3.5 rtl:left-auto left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالوجهة (طويق، الرمال الحمراء...)، التاريخ (2026-10-02...)، أو نوع المركبة (4x4، سوبركار...)"
              className="w-full pr-10 pl-10 rtl:pr-10 rtl:pl-10 py-2.5 rounded-xl bg-[#090d14] border border-white/10 text-white text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:border-amber-500 transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3.5 rtl:left-3.5 rtl:right-auto right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="مسح البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Dedicated Filter Dropdowns & Inputs (Destination, Date, Vehicle Type, Difficulty) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
            {/* 1. Destination Filter */}
            <div className="relative flex items-center bg-[#090d14] rounded-xl border border-white/10 px-3 py-1.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mr-2 rtl:mr-0 rtl:ml-2" />
              <select
                value={selectedDestination}
                onChange={(e) => setSelectedDestination(e.target.value)}
                className="w-full bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                {destinationOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#0f141d] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Vehicle Type Filter */}
            <div className="relative flex items-center bg-[#090d14] rounded-xl border border-white/10 px-3 py-1.5">
              <Car className="w-4 h-4 text-emerald-400 shrink-0 mr-2 rtl:mr-0 rtl:ml-2" />
              <select
                value={selectedVehicleType}
                onChange={(e) => setSelectedVehicleType(e.target.value)}
                className="w-full bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                {vehicleTypeOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-[#0f141d] text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Date Filter */}
            <div className="relative flex items-center bg-[#090d14] rounded-xl border border-white/10 px-3 py-1.5">
              <Calendar className="w-4 h-4 text-sky-400 shrink-0 mr-2 rtl:mr-0 rtl:ml-2" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-transparent text-xs text-white focus:outline-none cursor-pointer [color-scheme:dark]"
                title="تصفية حسب تاريخ القافلة"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate('')}
                  className="p-0.5 rounded text-slate-400 hover:text-white mr-1 rtl:mr-0 rtl:ml-1"
                  title="إلغاء تحديد التاريخ"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* 4. Difficulty Filter */}
            <div className="relative flex items-center bg-[#090d14] rounded-xl border border-white/10 px-3 py-1.5">
              <SlidersHorizontal className="w-4 h-4 text-purple-400 shrink-0 mr-2 rtl:mr-0 rtl:ml-2" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-[#0f141d] text-white">كافة مستويات الصعوبة</option>
                <option value="easy" className="bg-[#0f141d] text-white">سهل (طرق ممهدة)</option>
                <option value="moderate" className="bg-[#0f141d] text-white">متوسط (طعوس ورمال)</option>
                <option value="expert" className="bg-[#0f141d] text-white">وعر للمحترفين</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips and Result Count */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs text-slate-400 font-mono">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] text-slate-400">
                تم العثور على <strong className="text-white">{filteredTrips.length}</strong> قافلة
              </span>

              {/* Removable Chip: Search Query */}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">
                  <span>بحث: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Removable Chip: Destination */}
              {selectedDestination !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px]">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{destinationOptions.find((d) => d.id === selectedDestination)?.label}</span>
                  <button onClick={() => setSelectedDestination('all')} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Removable Chip: Vehicle Type */}
              {selectedVehicleType !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px]">
                  <Car className="w-3 h-3 text-emerald-400" />
                  <span>{vehicleTypeOptions.find((v) => v.id === selectedVehicleType)?.label}</span>
                  <button onClick={() => setSelectedVehicleType('all')} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Removable Chip: Date */}
              {selectedDate && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/20 text-[11px]">
                  <Calendar className="w-3 h-3 text-sky-400" />
                  <span>{selectedDate}</span>
                  <button onClick={() => setSelectedDate('')} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {/* Removable Chip: Difficulty */}
              {selectedDifficulty !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px]">
                  <span>صعوبة: {selectedDifficulty}</span>
                  <button onClick={() => setSelectedDifficulty('all')} className="hover:text-white">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-amber-400 hover:underline"
              >
                مسح الكل
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4. Trips Cards Grid */}
      <div>
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onSelect={(t) => setSelectedTrip(t)}
                onToggleRegister={(id, e) => {
                  e.stopPropagation();
                  toggleRegisterTrip(id);
                }}
                isRtl={isRtl}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 px-4 rounded-2xl bg-[#111722]/50 border border-white/5 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">لا توجد رحلات مسجلة في هذا القسم</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {activeTab === 'registered'
                ? 'لم تقم بالتسجيل في أي قافلة بعد. تصفح القوافل المتاحة وانضم إلى رتل السيارات القادم!'
                : 'لا توجد نتائج تطابق خيارات البحث الحالية.'}
            </p>
            {activeTab === 'registered' ? (
              <button
                onClick={() => setActiveTab('upcoming')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow transition-all"
              >
                <span>استكشاف القوافل القادمة</span>
              </button>
            ) : (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold shadow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>تنظيم مسار جديد</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedTrip && (
        <TripDetailModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onToggleRegister={(id) => toggleRegisterTrip(id)}
        />
      )}

      {showCreateModal && (
        <CreateTripModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};
