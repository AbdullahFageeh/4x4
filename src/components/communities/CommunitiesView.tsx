import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Community, VehicleCategory, Trip } from '../../types';
import { CommunityCard } from './CommunityCard';
import { CommunityDetailModal } from './CommunityDetailModal';
import { CreateCommunityModal } from './CreateCommunityModal';
import { FeaturedTripsSection } from './FeaturedTripsSection';
import { TripDetailModal } from '../trips/TripDetailModal';
import { CategoryIconBadge } from '../common/AutomotiveArt';
import {
  Search,
  Plus,
  Compass,
  MapPin,
  Sparkles,
  Users,
  ShieldCheck,
  X,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

export const CommunitiesView: React.FC = () => {
  const {
    communities,
    currentUser,
    toggleJoinCommunity,
    toggleRegisterTrip,
    selectedCity,
    setSelectedCity,
    dir,
    setCurrentTab,
    activities,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [selectedFeaturedTrip, setSelectedFeaturedTrip] = useState<Trip | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const categories: { id: string; label: string; cat?: VehicleCategory }[] = [
    { id: 'all', label: 'جميع الفئات' },
    { id: 'overland', label: 'أوف رود ورمال 4x4', cat: 'overland' },
    { id: 'supercars', label: 'سيارات خارقة ورياضية', cat: 'supercars' },
    { id: 'classic', label: 'كلاسيك وتراثي', cat: 'classic' },
    { id: 'tuner', label: 'تعديل وحلبات', cat: 'tuner' },
  ];

  // Filter logic
  const filteredCommunities = useMemo(() => {
    return communities.filter((comm) => {
      const matchesSearch =
        comm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        comm.city.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || comm.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [communities, searchQuery, selectedCategory]);

  const featuredCommunity = communities.find((c) => c.id === 'comm_tuwaiq') || communities[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Header Greeting & Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-[#151412] border border-[rgba(235,233,228,0.08)] shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded object-cover border border-[#D4AF37]"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-[#10B981] border border-[#151412]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#EBE9E4]">
                مرحباً بك، {currentUser.name}
              </h1>
              <span className="text-xs px-2 py-0.5 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-mono">
                {currentUser.rankTitle}
              </span>
            </div>
            <p className="text-xs text-[#EBE9E4]/60 mt-0.5 flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
              <span>{selectedCity}، المملكة العربية السعودية</span>
              <span>·</span>
              <span>{currentUser.garage[0]?.model || 'Land Cruiser 300'}</span>
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-[#D4AF37] hover:brightness-110 text-[#151412] font-serif font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>تأسيس مجتمع جديد</span>
          </button>
        </div>
      </div>

      {/* 2. Featured Community Spotlight Card */}
      {featuredCommunity && !searchQuery && selectedCategory === 'all' && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/50 via-[#111722] to-[#0c1017] border border-emerald-500/30 p-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  مجتمع الأسبوع المميز
                </span>
                <span className="text-xs text-slate-400 font-mono">منطقة الرياض</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <span>{featuredCommunity.name}</span>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {featuredCommunity.description}
              </p>

              {/* Unboxed Metadata */}
              <div className="flex items-center gap-3 pt-2 text-xs text-slate-400 font-mono">
                <span className="text-slate-300">
                  <strong className="text-white font-bold">{featuredCommunity.membersCount}</strong> عضو نشط
                </span>
                <span>·</span>
                <span className="text-slate-300">
                  <strong className="text-white font-bold">{featuredCommunity.tripsCount}</strong> قافلة منتهية
                </span>
                <span>·</span>
                <span className="text-amber-400 font-medium">القافلة القادمة: هذا الجمعة في طويق</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-row md:flex-col items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedCommunity(featuredCommunity)}
                className="flex-1 md:w-36 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-all border border-white/10 text-center"
              >
                تفاصيل المجتمع
              </button>
              <button
                onClick={(e) => toggleJoinCommunity(featuredCommunity.id)}
                className={`flex-1 md:w-36 py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 text-center ${
                  featuredCommunity.isJoined
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {featuredCommunity.isJoined ? 'مشترك بالرابطة' : 'انضمام فوري'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Featured Trips Section */}
      {!searchQuery && selectedCategory === 'all' && (
        <FeaturedTripsSection onSelectTrip={(trip) => setSelectedFeaturedTrip(trip)} />
      )}

      {/* 3. Search and Category Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute right-3.5 rtl:right-3.5 rtl:left-auto left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مجتمع، نوع سيارة، أو مدينة (مثال: طويق، سوبركار، جدة)..."
              className="w-full pr-10 pl-10 rtl:pr-10 rtl:pl-10 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.1)] text-[#EBE9E4] text-xs placeholder:text-[#EBE9E4]/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 p-1 text-[#EBE9E4]/50 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Buttons (Interactive Segmented Discipline) */}
        <div className="flex gap-[1px] p-[2px] bg-[rgba(235,233,228,0.08)] border border-[rgba(235,233,228,0.08)] overflow-x-auto scrollbar-none font-mono text-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-3.5 py-1.5 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#151412] font-bold'
                    : 'text-[#EBE9E4]/60 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Communities Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">المجتمعات المتاحة</h3>
            <span className="text-xs text-slate-400 font-mono">
              ({filteredCommunities.length} مجتمع)
            </span>
          </div>
        </div>

        {filteredCommunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommunities.map((comm) => (
              <CommunityCard
                key={comm.id}
                community={comm}
                latestActivity={activities.find((a) => a.communityId === comm.id)}
                onSelect={(c) => setSelectedCommunity(c)}
                onToggleJoin={(id, e) => {
                  e.stopPropagation();
                  toggleJoinCommunity(id);
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-12 px-4 rounded-2xl bg-[#111722]/50 border border-white/5 space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">لا توجد نتائج مطابقة</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              لم نعثر على أي مجتمع يطابق كلمة البحث أو التصنيف المحدد. يمكنك تأسيس مجتمعك الخاص الآن!
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>تأسيس مجتمع جديد</span>
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedCommunity && (
        <CommunityDetailModal
          community={selectedCommunity}
          onClose={() => setSelectedCommunity(null)}
          onToggleJoin={(id) => toggleJoinCommunity(id)}
        />
      )}

      {showCreateModal && (
        <CreateCommunityModal onClose={() => setShowCreateModal(false)} />
      )}

      {selectedFeaturedTrip && (
        <TripDetailModal
          trip={selectedFeaturedTrip}
          onClose={() => setSelectedFeaturedTrip(null)}
          onToggleRegister={(id) => toggleRegisterTrip(id)}
        />
      )}
    </div>
  );
};
