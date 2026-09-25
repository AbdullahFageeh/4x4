import React from 'react';
import { Trip } from '../../types';
import { useApp } from '../../context/AppContext';
import { RouteElevationVisualizer, CategoryIconBadge } from '../common/AutomotiveArt';
import { InteractivePoll } from '../common/InteractivePoll';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Radio,
  Check,
  Plus,
  Users,
  AlertTriangle,
  Flag,
  Navigation,
  BarChart3,
  HardDrive,
} from 'lucide-react';

interface TripDetailModalProps {
  trip: Trip;
  onClose: () => void;
  onToggleRegister: (tripId: string) => void;
}

export const TripDetailModal: React.FC<TripDetailModalProps> = ({
  trip,
  onClose,
  onToggleRegister,
}) => {
  const { voteOnTripPoll, setShowGoogleDriveModal, setActiveDriveTrip } = useApp();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f141d] border border-white/10 shadow-2xl p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1">
            <span>{trip.communityName}</span>
            <span>·</span>
            <span className="font-mono text-amber-400">
              {trip.status === 'confirmed' ? 'انطلاق مؤكد' : 'تسجيل متاح'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">{trip.title}</h2>
        </div>

        {/* Action Button */}
        <div className="mb-5">
          <button
            onClick={() => onToggleRegister(trip.id)}
            className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99] ${
              trip.isRegistered
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-lg shadow-amber-950/60'
            }`}
          >
            {trip.isRegistered ? (
              <>
                <Check className="w-4 h-4" />
                <span>أنت مسجل في هذا المسار (انقر لإلغاء التسجيل)</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>تأكيد التسجيل والانضمام للرتل</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveDriveTrip(trip);
              setShowGoogleDriveModal(true);
            }}
            className="w-full mt-2 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <HardDrive className="w-4 h-4 text-blue-400" />
            <span>حفظ ومزامنة بيانات وإحداثيات المسار في Google Drive</span>
          </button>
        </div>

        {/* Route Key Details Card */}
        <div className="p-4 rounded-xl bg-[#141b25] border border-white/5 space-y-3 mb-5">
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 font-mono">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{trip.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>تجمع {trip.meetingTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{trip.distanceKm} كم ({trip.durationHours} ساعات)</span>
            </div>
            {trip.radioFrequency && (
              <div className="flex items-center gap-2 text-emerald-300">
                <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{trip.radioFrequency}</span>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-white/5 space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span className="text-slate-400">نقطة الانطلاق:</span>
              <span className="text-white font-medium">{trip.startLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span className="text-slate-400">الوجهة النهائية:</span>
              <span className="text-white font-medium">{trip.endLocation}</span>
            </div>
          </div>
        </div>

        {/* Elevation Profile Visualizer */}
        <div className="mb-5">
          <RouteElevationVisualizer
            distanceKm={trip.distanceKm}
            elevationGainM={trip.elevationGainM}
            difficulty={trip.difficulty}
          />
        </div>

        {/* Convoy Planning Poll (Vote on Destination, Meeting Time, or Campsite) */}
        {trip.planningPoll && (
          <div className="mb-5">
            <InteractivePoll
              poll={trip.planningPoll}
              onVote={(optionId) => voteOnTripPoll(trip.id, optionId)}
            />
          </div>
        )}

        {/* Route Waypoints */}
        <div className="mb-5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white mb-2.5">
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            <span>محطات التوقف ونقاط التجمع (Waypoints)</span>
          </div>
          <div className="space-y-2">
            {trip.waypoints.map((wp, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-300">
                <span className="w-5 h-5 rounded-full bg-white/5 border border-white/10 text-amber-400 font-mono text-[11px] flex items-center justify-center font-bold shrink-0">
                  {idx + 1}
                </span>
                <span>{wp}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-5 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <h3 className="text-xs font-bold text-white mb-1.5">تفاصيل وخطة المسار</h3>
          <p className="text-xs text-slate-300 leading-relaxed">{trip.description}</p>
        </div>

        {/* Vehicle Requirement & Safety */}
        <div className="mb-5 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
          <div className="flex items-center gap-1.5 font-bold mb-1 text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>اشتراطات المركبة والسلامة</span>
          </div>
          <p className="text-slate-300 leading-snug">{trip.vehicleRequirement}</p>
        </div>

        {/* Registered Participants */}
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold text-white mb-3">
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>المشاركون في القافلة</span>
            </span>
            <span className="font-mono text-slate-400">
              {trip.currentParticipants} من أصل {trip.maxParticipants} سيارة
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {trip.participants.map((p) => (
              <div key={p.id} className="flex items-center gap-2.5 p-2 rounded-lg bg-[#141b25]">
                <img
                  src={p.avatar}
                  alt={p.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-white/10"
                />
                <div className="overflow-hidden">
                  <span className="text-xs font-semibold text-white block truncate">{p.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate font-mono">{p.vehicle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
