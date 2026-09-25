import React from 'react';
import { Trip } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  Users,
  Radio,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Check,
  Plus,
  Flame,
  Gauge,
  ArrowUpRight,
} from 'lucide-react';

interface FeaturedTripsSectionProps {
  onSelectTrip: (trip: Trip) => void;
}

export const FeaturedTripsSection: React.FC<FeaturedTripsSectionProps> = ({
  onSelectTrip,
}) => {
  const { trips, toggleRegisterTrip, setCurrentTab, dir } = useApp();

  // Take top 3 upcoming trips as featured
  const featuredTrips = trips.slice(0, 3);

  const difficultyMeta = {
    easy: { label: 'مسار سهل للمبتدئين', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    moderate: { label: 'مسار متوسط للخبراء', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    expert: { label: 'مسار وعر للمحترفين', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  };

  return (
    <div className="space-y-4 pt-1">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                قوافل الأسبوع المميزة
              </h2>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold font-mono">
                أماكن محدودة
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              انضم لأقوى مسارات نهاية الأسبوع المنظمة برعاية روابط القيادة المعتمدة
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab('trips')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors self-start sm:self-auto group"
        >
          <span>استعراض كافة القوافل ({trips.length})</span>
          {dir === 'rtl' ? (
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          ) : (
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          )}
        </button>
      </div>

      {/* Featured Trips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {featuredTrips.map((trip) => {
          const diff = difficultyMeta[trip.difficulty] || difficultyMeta.moderate;
          const capacityPercent = Math.min(
            100,
            Math.round((trip.currentParticipants / trip.maxParticipants) * 100)
          );

          return (
            <div
              key={trip.id}
              onClick={() => onSelectTrip(trip)}
              className="group relative rounded-2xl bg-[#0f141d] border border-white/10 hover:border-amber-500/40 shadow-xl hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
            >
              {/* Image Banner Container */}
              <div className="relative h-48 w-full overflow-hidden bg-[#0c1017]">
                {trip.imageUrl ? (
                  <img
                    src={trip.imageUrl}
                    alt={trip.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#121924] to-[#0a0d14] flex items-center justify-center">
                    <Compass className="w-12 h-12 text-slate-700" />
                  </div>
                )}

                {/* Dark Vignette Overlay for Typography Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f141d] via-[#0f141d]/30 to-black/40" />

                {/* Top Badges */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                  <span
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold backdrop-blur-md shadow ${diff.color}`}
                  >
                    {diff.label}
                  </span>

                  <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-white text-[11px] font-mono backdrop-blur-md flex items-center gap-1 shadow">
                    <Gauge className="w-3 h-3 text-amber-400" />
                    <span>{trip.distanceKm} كم</span>
                  </span>
                </div>

                {/* Community Tag Overlaid on Image */}
                <div className="absolute bottom-3 right-3 rtl:right-3 rtl:left-auto left-3 z-10">
                  <span className="text-xs font-semibold text-white/90 bg-[#0f141d]/85 px-2.5 py-1 rounded-lg border border-white/10 backdrop-blur-sm shadow flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{trip.communityName}</span>
                  </span>
                </div>
              </div>

              {/* Trip Body Content */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 leading-snug">
                    {trip.title}
                  </h3>

                  {/* Destination & Date details */}
                  <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-400 shrink-0">الوجهة:</span>
                      <span className="text-white truncate font-medium">{trip.endLocation}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-slate-300">{trip.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{trip.meetingTime.split(' ')[0]}</span>
                      </div>
                    </div>

                    {trip.radioFrequency && (
                      <div className="flex items-center gap-2 text-emerald-400 text-[11px]">
                        <Radio className="w-3 h-3 shrink-0" />
                        <span className="truncate">{trip.radioFrequency}</span>
                      </div>
                    )}
                  </div>

                  {/* Description snippet */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">
                    {trip.description}
                  </p>
                </div>

                {/* Convoy Capacity Progress Bar & Action Button */}
                <div className="pt-2 border-t border-white/5 space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3 text-slate-500" />
                        <span>اكتمال الرتل:</span>
                      </span>
                      <span className="text-white font-bold tabular-nums">
                        {trip.currentParticipants} / {trip.maxParticipants} سيارة ({capacityPercent}%)
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          capacityPercent >= 90
                            ? 'bg-red-500'
                            : capacityPercent >= 60
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${capacityPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Interactive Button Row */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTrip(trip);
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-white/5"
                    >
                      <span>تفاصيل المسار</span>
                      <ArrowUpRight className="w-3 h-3 rtl:rotate-90" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRegisterTrip(trip.id);
                      }}
                      className={`min-h-[34px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 shrink-0 ${
                        trip.isRegistered
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                      }`}
                    >
                      {trip.isRegistered ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>مسجل</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>انضمام</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
