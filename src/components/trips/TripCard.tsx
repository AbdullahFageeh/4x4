import React from 'react';
import { Trip } from '../../types';
import { CategoryIconBadge } from '../common/AutomotiveArt';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Radio,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  AlertCircle,
} from 'lucide-react';

interface TripCardProps {
  trip: Trip;
  onSelect: (trip: Trip) => void;
  onToggleRegister: (tripId: string, e: React.MouseEvent) => void;
  isRtl?: boolean;
}

export const TripCard: React.FC<TripCardProps> = ({
  trip,
  onSelect,
  onToggleRegister,
  isRtl = true,
}) => {
  const difficultyBadge = {
    easy: { text: 'مسار سهل', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    moderate: { text: 'تحدي متوسط', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    expert: { text: 'مسار وعر للمحترفين', color: 'text-red-400 bg-red-500/10 border-red-500/20' },
  }[trip.difficulty];

  const statusBadge = {
    confirmed: { text: 'مؤكد الانطلاق', color: 'text-emerald-400' },
    open: { text: 'باب التسجيل مفتوح', color: 'text-amber-400' },
    in_progress: { text: 'القافلة جارية الآن', color: 'text-sky-400' },
    completed: { text: 'مكتملة', color: 'text-slate-400' },
  }[trip.status];

  return (
    <div
      onClick={() => onSelect(trip)}
      className="group relative rounded-2xl bg-[#111722] hover:bg-[#151c2a] border border-white/10 hover:border-amber-500/30 transition-all duration-200 cursor-pointer overflow-hidden p-5 shadow-lg shadow-black/40 flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Community & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-semibold text-emerald-400 truncate">
            {trip.communityName}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium">
            <span className={`w-2 h-2 rounded-full ${trip.status === 'confirmed' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span className={statusBadge.color}>{statusBadge.text}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 mb-2">
          {trip.title}
        </h3>

        {/* Itinerary Timeline Route Box */}
        <div className="p-3 rounded-xl bg-[#0c1017] border border-white/5 space-y-2 mb-3.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-400 text-[11px]">الانطلاق:</span>
            <span className="text-slate-200 font-medium truncate">{trip.startLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-slate-400 text-[11px]">الوجهة:</span>
            <span className="text-slate-200 font-medium truncate">{trip.endLocation}</span>
          </div>
        </div>

        {/* Unboxed Metadata (Zero-Pill Discipline) */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-mono mb-3.5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{trip.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{trip.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="tabular-nums font-bold text-white">{trip.distanceKm}</span> كم مسافة
          </div>
          {trip.radioFrequency && (
            <div className="flex items-center gap-1.5 text-emerald-400 truncate">
              <Radio className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{trip.radioFrequency.split(' ')[0]}</span>
            </div>
          )}
        </div>

        {/* Vehicle Requirement Note */}
        <div className="text-[11px] text-slate-400 leading-snug mb-3">
          <span className="text-amber-400/90 font-medium">المركبة المطلوبة: </span>
          <span>{trip.vehicleRequirement}</span>
        </div>
      </div>

      {/* Footer Info & RSVP Action */}
      <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
        {/* Participants Avatars */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {trip.participants.slice(0, 3).map((p) => (
              <img
                key={p.id}
                src={p.avatar}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border-2 border-[#111722]"
                title={`${p.name} (${p.vehicle})`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-mono">
            <strong className="text-white font-bold tabular-nums">{trip.currentParticipants}</strong>/{trip.maxParticipants} سيارة
          </span>
        </div>

        {/* RSVP Join Toggle Button */}
        <button
          onClick={(e) => onToggleRegister(trip.id, e)}
          className={`min-h-[36px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 active:scale-95 shrink-0 ${
            trip.isRegistered
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
              : 'bg-amber-500 hover:bg-amber-400 text-black font-bold shadow-md shadow-amber-950/40'
          }`}
        >
          {trip.isRegistered ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>مؤكد الحضور</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>تسجيل بالقافلة</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
