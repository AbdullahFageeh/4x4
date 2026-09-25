import React, { useState, useEffect } from 'react';
import { OnXTrack } from '../../types';
import {
  CircleDot,
  Pause,
  Play,
  Square,
  HardDrive,
  Timer,
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

  // Timer interval when recording and not paused
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && !isPaused) {
      timer = setInterval(() => {
        setSeconds((prev) => {
          const nextSec = prev + 1;
          // Simulate GPS telemetry progression
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
      name: trackName || 'مسار قوافل 4x4 مسجل',
      distanceKm,
      durationSeconds: seconds,
      avgSpeedKmh: Number((distanceKm / (seconds / 3600 || 1)).toFixed(1)),
      elevationGainM: elevGainM,
      color: '#ff6a00',
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
        <div className="pointer-events-auto flex items-center justify-between gap-4 px-4 py-2.5 rounded-2xl bg-[#0e131d]/95 border border-red-500/40 shadow-2xl backdrop-blur-xl text-white">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute" />
              <span className="w-3 h-3 rounded-full bg-red-600 relative" />
            </div>
            <div className="text-right rtl:text-right">
              <span className="text-[10px] text-red-400 font-mono block">تسجيل المسار الحقيقي (REC)</span>
              <span className="text-sm font-mono font-bold">{formatTime(seconds)}</span>
            </div>
          </div>

          {/* Telemetry Stats */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono border-x border-white/10 px-4">
            <div className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>{distanceKm} كم</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-emerald-400" />
              <span>{speedKmh} كم/س</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-sky-400" />
              <span>+{elevGainM} م</span>
            </div>
          </div>

          {/* Recording Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPauseResume}
              className={`p-2 rounded-xl transition-all ${
                isPaused
                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={isPaused ? 'استئناف' : 'إيقاف مؤقت'}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>

            <button
              onClick={handleFinishClick}
              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-red-950/50"
            >
              <Square className="w-3.5 h-3.5" />
              <span>إنهاء وحفظ</span>
            </button>
          </div>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0f141f] border border-[#ff6a00]/40 p-6 shadow-2xl text-right rtl:text-right space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CircleDot className="w-4 h-4 text-[#ff6a00]" />
                <span>حفظ المسار المسجل في onX</span>
              </h3>
              <button onClick={() => setShowSaveModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-center">
              <div>
                <span className="text-[10px] text-slate-400 block">المسافة</span>
                <span className="text-xs font-bold text-white">{distanceKm} كم</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">المدة</span>
                <span className="text-xs font-bold text-white">{formatTime(seconds)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">صعود الارتفاع</span>
                <span className="text-xs font-bold text-emerald-400">+{elevGainM} م</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">اسم المسار</label>
              <input
                type="text"
                value={trackName}
                onChange={(e) => setTrackName(e.target.value)}
                placeholder="مسار نفود الثمامة الشمالي"
                className="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-white/10 text-white text-xs focus:outline-none focus:border-[#ff6a00]"
              />
            </div>

            {/* Google Drive Sync Option */}
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-blue-300">
                <HardDrive className="w-4 h-4 text-blue-400 shrink-0" />
                <span>مزامنة المسار تلقائياً إلى Google Drive</span>
              </div>
              <input
                type="checkbox"
                checked={syncToDrive}
                onChange={(e) => setSyncToDrive(e.target.checked)}
                className="accent-blue-500 w-4 h-4 rounded"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onDiscard();
                  setShowSaveModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs"
              >
                تجاهل المسار
              </button>
              <button
                type="button"
                onClick={confirmSave}
                className="px-5 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#ff7b1a] text-black text-xs font-bold shadow-lg"
              >
                تأكيد الحفظ في المحتوى
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
