import React from 'react';
import {
  MapPin,
  Radio,
  Ruler,
  Square,
  DownloadCloud,
  Layers,
  CircleDot,
  Compass,
} from 'lucide-react';

interface OnXTacticalDockProps {
  activeTool: 'mark' | 'track' | 'measure' | 'area' | 'offline' | 'layers' | null;
  setActiveTool: (tool: 'mark' | 'track' | 'measure' | 'area' | 'offline' | 'layers' | null) => void;
  isRecordingTrack: boolean;
  onOpenDrawerTab: (tab: 'layers' | 'discover' | 'content' | 'weather' | 'rig') => void;
}

export const OnXTacticalDock: React.FC<OnXTacticalDockProps> = ({
  activeTool,
  setActiveTool,
  isRecordingTrack,
  onOpenDrawerTab,
}) => {
  const tools = [
    {
      id: 'layers' as const,
      label: 'الطبقات',
      labelEn: 'Layers',
      icon: Layers,
      action: () => {
        onOpenDrawerTab('layers');
        setActiveTool(activeTool === 'layers' ? null : 'layers');
      },
      highlight: false,
    },
    {
      id: 'mark' as const,
      label: 'نقطة (Mark)',
      labelEn: 'Mark Waypoint',
      icon: MapPin,
      action: () => setActiveTool(activeTool === 'mark' ? null : 'mark'),
      highlight: true,
    },
    {
      id: 'track' as const,
      label: isRecordingTrack ? 'جاري التسجيل...' : 'تسجيل (Track)',
      labelEn: isRecordingTrack ? 'Recording...' : 'Record Track',
      icon: CircleDot,
      action: () => setActiveTool(activeTool === 'track' ? null : 'track'),
      highlight: isRecordingTrack,
      isRecording: isRecordingTrack,
    },
    {
      id: 'measure' as const,
      label: 'قياس (Line)',
      labelEn: 'Measure Line',
      icon: Ruler,
      action: () => setActiveTool(activeTool === 'measure' ? null : 'measure'),
      highlight: false,
    },
    {
      id: 'area' as const,
      label: 'مساحة (Area)',
      labelEn: 'Measure Area',
      icon: Square,
      action: () => setActiveTool(activeTool === 'area' ? null : 'area'),
      highlight: false,
    },
    {
      id: 'offline' as const,
      label: 'بدون نت (Offline)',
      labelEn: 'Offline Maps',
      icon: DownloadCloud,
      action: () => setActiveTool(activeTool === 'offline' ? null : 'offline'),
      highlight: false,
    },
  ];

  return (
    <div className="absolute bottom-5 inset-x-0 z-30 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-[#0f141f]/95 border border-white/10 shadow-2xl backdrop-blur-xl max-w-full overflow-x-auto">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTool === t.id || t.isRecording;

          return (
            <button
              key={t.id}
              onClick={t.action}
              className={`flex flex-col items-center justify-center min-w-[62px] sm:min-w-[76px] py-2 px-2 rounded-xl transition-all active:scale-95 group ${
                isActive
                  ? 'bg-[#ff6a00] text-black shadow-lg shadow-[#ff6a00]/30 font-bold'
                  : 'hover:bg-white/5 text-slate-300 hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110 ${
                    t.isRecording ? 'text-black animate-pulse' : ''
                  }`}
                />
                {t.isRecording && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 animate-ping" />
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold mt-1 tracking-tight whitespace-nowrap">
                {t.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
