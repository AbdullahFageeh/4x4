import React, { useState, useEffect } from 'react';
import { OnXTrack } from '../../types';
import {
  CircleDot,
  Pause,
  Play,
  Square,
  HardDrive,
  Navigation,
  Mountain,
  Gauge,
  X,
} from 'lucide-react';

interface OnXTrackRecorderBarProps {
  isRecording: boolean;
  onPauseResume: () => void;
  isPaused: boolean;
  onStopAndSave: (trackData: Partial<OnXTrack>) => void;
  onDiscard: () => void;
  onSyncToDrive?: (track: Partial<OnXTrack>) => void;
}

export const OnXTrackRecorderBar: React.FC<OnXTrackRecorderBarProps> = ({
  isRecording,
  onPauseResume,
  isPaused,
  onStopAndSave,
  onDiscard,
  onSyncToDrive,
}) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [distanceKm, setDistanceKm] = useState<number>(0.0);
  const [speedKmh, setSpeedKmh] = useState<number>(0);
  const [elevGainM, setElevGainM] = useState<number>(0);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [trackName, setTrackName] = useState<string>('');
  const [syncToDrive, setSyncToDrive] = useState<boolean>(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          const nextSec = prev + 1;
          const speed = 22 + Math.round(Math.sin(nextSec / 5) * 8);
          setSpeedKmh(Math.max(5, speed));
          setDistanceKm((d) => Number((d + speed / 3600).toFixed(2)));
          if (nextSec % 6 === 0) {
            setElevGainM((g) => g + Math.floor(Math.random() * 3));
          }
          return nextSec;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, isPaused]);

  if (!isRecording && !showSaveModal) return null;

  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishClick = () => {
    setTrackName(`مسار صحراوي - ${new Date().toLocaleDateString('ar-SA')}`);
    setShowSaveModal(true);
  };

  const confirmSave = () => {
    const newTrack: Partial<OnXTrack> = {
      name: trackName || 'مسار قوافل مسجل',
      distanceKm,
      durationSeconds: seconds,
      avgSpeedKmh: Number((distanceKm / (seconds / 3600 || 1)).toFixed(1)),
      elevationGainM: elevGainM,
      color: '#D4AF37',
    };

    if (syncToDrive && onSyncToDrive) {
      onSyncToDrive(newTrack);
    }

    onStopAndSave(newTrack);
    setShowSaveModal(false);
    setSeconds(0);
    setDistanceKm(0);
  };

  return (
    <>
      {/* Floating HUD Bar */}
      <div className="absolute top-16 inset-x-0 z-30 flex justify-center px-4 pointer-events-none animate-in slide-in-from-top-4">
        <div className="pointer-events-auto flex items-center justify-between gap-4 px-5 py-2.5 bg-[rgba(30,29,27,0.92)] border border-[#10B981]/40 shadow-2xl backdrop-blur-xl text-[#EBE9E4]">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            <div className="text-right rtl:text-right">
              <span className="font-mono text-[9px] text-[#10B981] uppercase tracking-wider block">
                RECORDING (ACTIVE)
              </span>
              <span className="font-mono text-sm font-bold text-[#EBE9E4]">{formatTime(seconds)}</span>
            </div>
          </div>

          {/* Telemetry Stats */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono border-x border-[rgba(235,233,228,0.08)] px-4">
            <div className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{distanceKm} KM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{speedKmh} KM/H</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-[#EBE9E4]/80" />
              <span>+{elevGainM} M</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPauseResume}
              className={`p-2 transition-all cursor-pointer ${
                isPaused
                  ? 'bg-[#D4AF37] text-[#151412]'
                  : 'bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[#EBE9E4]'
              }`}
              title={isPaused ? 'استئناف' : 'إيقاف مؤقت'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleFinishClick}
              className="px-3.5 py-1.5 bg-[#D4AF37] hover:brightness-110 text-[#151412] font-mono text-xs font-bold uppercase transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Square className="w-3 h-3" />
              <span>إنهاء وحفظ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#151412] border border-[rgba(235,233,228,0.12)] p-6 shadow-2xl text-right rtl:text-right space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-[rgba(235,233,228,0.08)] pb-3">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#EBE9E4]/50 mb-0.5">
                  Track Archiving
                </div>
                <h3 className="font-serif text-xl font-bold text-[#EBE9E4]">حفظ المسار المسجل</h3>
              </div>
              <button onClick={() => setShowSaveModal(false)} className="text-[#EBE9E4]/50 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 bg-black/40 border border-[rgba(235,233,228,0.06)] font-mono text-center text-xs">
              <div>
                <span className="text-[10px] text-[#EBE9E4]/50 block">المسافة</span>
                <span className="font-bold text-[#D4AF37]">{distanceKm} KM</span>
              </div>
              <div>
                <span className="text-[10px] text-[#EBE9E4]/50 block">المدة</span>
                <span className="font-bold text-[#EBE9E4]">{formatTime(seconds)}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#EBE9E4]/50 block">صعود الارتفاع</span>
                <span className="font-bold text-[#10B981]">+{elevGainM} M</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-[#EBE9E4]/70 block mb-1">اسم المسار</label>
              <input
                type="text"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                placeholder="مسار قوافل طويق"
                className="w-full px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.1)] text-[#EBE9E4] text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="p-3 bg-[rgba(212,175,55,0.05)] border border-[rgba(212,175,55,0.2)] flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#EBE9E4]">
                <HardDrive className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>مزامنة المسار في سحابة Google Drive</span>
              </div>
              <input
                type="checkbox"
                checked={syncToDrive}
                onChange={(e) => setSyncToDrive(e.target.checked)}
                className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onDiscard();
                  setShowSaveModal(false);
                }}
                className="px-4 py-2 font-mono text-xs text-[#EBE9E4]/50 hover:text-white uppercase"
              >
                تجاهل
              </button>
              <button
                type="button"
                onClick={confirmSave}
                className="bg-[#D4AF37] hover:brightness-110 text-[#151412] px-5 py-2 font-serif font-bold text-sm tracking-wide shadow-md cursor-pointer"
              >
                تأكيد الحفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
