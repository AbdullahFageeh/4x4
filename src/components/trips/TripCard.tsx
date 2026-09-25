import React from 'react';
import { Trip } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Radio,
  Check,
  Plus,
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
}) => {
  const statusBadge = {
    confirmed: { text: 'مؤكد الانطلاق', color: 'text-[#10B981]' },
    open: { text: 'باب التسجيل مفتوح', color: 'text-[#D4AF37]' },
    in_progress: { text: 'القافلة جارية الآن', color: 'text-sky-400' },
    completed: { text: 'مكتملة', color: 'text-[#EBE9E4]/40' },
  }[trip.status];

  return (
    <div
      onClick={() => onSelect(trip)}
      className="group relative flex flex-col justify-between bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(212,175,55,0.04)] border border-[rgba(235,233,228,0.08)] hover:border-[#D4AF37] transition-all duration-200 cursor-pointer overflow-hidden p-5 shadow-lg flex-1"
    >
      <div>
        {/* Top Header: Community & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-mono text-[#D4AF37] truncate uppercase tracking-wider">
            {trip.communityName}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-medium">
            <span className={`w-2 h-2 rounded-full ${trip.status === 'confirmed' ? 'bg-[#10B981]' : 'bg-[#D4AF37]'}`} />
            <span className={statusBadge.color}>{statusBadge.text}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-bold text-[#EBE9E4] group-hover:text-[#D4AF37] transition-colors line-clamp-1 mb-2">
          {trip.title}
        </h3>

        {/* Itinerary Timeline Route Box */}
        <div className="p-3 bg-black/40 border border-[rgba(235,233,228,0.06)] space-y-1.5 mb-3.5 font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
            <span className="text-[#EBE9E4]/50 text-[10px] uppercase">START:</span>
            <span className="text-[#EBE9E4] truncate">{trip.startLocation}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#D4AF37] shrink-0" />
            <span className="text-[#EBE9E4]/50 text-[10px] uppercase">DEST:</span>
            <span className="text-[#EBE9E4] truncate">{trip.endLocation}</span>
          </div>
        </div>

        {/* Unboxed Metadata (Zero-Pill Discipline) */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#EBE9E4]/60 font-mono mb-3.5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span className="truncate">{trip.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#EBE9E4]/40 shrink-0" />
            <span className="truncate">{trip.time}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#EBE9E4]/40 shrink-0" />
            <span className="tabular-nums font-bold text-[#EBE9E4]">{trip.distanceKm}</span> KM
          </div>
          {trip.radioFrequency && (
            <div className="flex items-center gap-1.5 text-[#10B981] truncate">
              <Radio className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{trip.radioFrequency.split(' ')[0]}</span>
            </div>
          )}
        </div>

        {/* Vehicle Requirement Note */}
        <div className="text-[11px] text-[#EBE9E4]/60 leading-snug mb-3">
          <span className="text-[#D4AF37] font-mono text-[10px] uppercase block">VEHICLE REQUIREMENT:</span>
          <span>{trip.vehicleRequirement}</span>
        </div>
      </div>

      {/* Footer Info & RSVP Action */}
      <div className="pt-3 border-t border-[rgba(235,233,228,0.06)] flex items-center justify-between gap-2">
        {/* Participants Avatars */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {trip.participants.slice(0, 3).map((p) => (
              <img
                key={p.id}
                src={p.avatar}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover border border-[#151412]"
                title={`${p.name} (${p.vehicle})`}
              />
            ))}
          </div>
          <span className="text-xs text-[#EBE9E4]/60 font-mono">
            <strong className="text-[#EBE9E4] font-bold tabular-nums">{trip.currentParticipants}</strong>/{trip.maxParticipants} سيارة
          </span>
        </div>

        {/* RSVP Join Toggle Button */}
        <button
          onClick={(e) => onToggleRegister(trip.id, e)}
          className={`min-h-[34px] px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 active:scale-95 shrink-0 cursor-pointer ${
            trip.isRegistered
              ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981]/25'
              : 'bg-[#D4AF37] hover:brightness-110 text-[#151412] font-bold shadow-sm'
          }`}
        >
          {trip.isRegistered ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>مشترك</span>
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
  );
};
