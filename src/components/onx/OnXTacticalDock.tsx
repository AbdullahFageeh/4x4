import React from 'react';

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
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
      <div className="flex items-center gap-2 bg-[rgba(30,29,27,0.85)] backdrop-blur-[20px] p-2 rounded border border-[rgba(235,233,228,0.08)] shadow-2xl">
        {/* Mark Button */}
        <button
          onClick={() => setActiveTool(activeTool === 'mark' ? null : 'mark')}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTool === 'mark'
              ? 'bg-[#D4AF37] text-[#151412] font-bold'
              : 'bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#151412]'
          }`}
        >
          Mark
        </button>

        {/* Track Button */}
        <button
          onClick={() => setActiveTool(activeTool === 'track' ? null : 'track')}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            isRecordingTrack || activeTool === 'track'
              ? 'bg-[#D4AF37] text-[#151412] font-bold'
              : 'bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#151412]'
          }`}
        >
          {isRecordingTrack ? 'REC...' : 'Track'}
        </button>

        {/* Line Button */}
        <button
          onClick={() => setActiveTool(activeTool === 'measure' ? null : 'measure')}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTool === 'measure'
              ? 'bg-[#D4AF37] text-[#151412] font-bold'
              : 'bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#151412]'
          }`}
        >
          Line
        </button>

        {/* Area Button */}
        <button
          onClick={() => setActiveTool(activeTool === 'area' ? null : 'area')}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTool === 'area'
              ? 'bg-[#D4AF37] text-[#151412] font-bold'
              : 'bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#151412]'
          }`}
        >
          Area
        </button>

        {/* Offline Map Button (Emerald Styled) */}
        <button
          onClick={() => setActiveTool(activeTool === 'offline' ? null : 'offline')}
          className={`px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTool === 'offline'
              ? 'bg-[#10B981] text-[#151412] font-bold'
              : 'bg-transparent border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-[#151412]'
          }`}
        >
          Offline Map
        </button>
      </div>
    </div>
  );
};
