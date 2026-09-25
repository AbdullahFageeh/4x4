import React from 'react';
import { OnXBasemapType, OnXLayersState } from '../../types';
import {
  Menu,
  Search,
  Crosshair,
  DownloadCloud,
  HardDrive,
  Mountain,
  Wind,
} from 'lucide-react';

interface OnXTacticalTopBarProps {
  isDrawerOpen: boolean;
  onToggleDrawer: () => void;
  layersState: OnXLayersState;
  setLayersState: React.Dispatch<React.SetStateAction<OnXLayersState>>;
  centerCoordsHUD: { lat: number; lng: number; altM: number; bearingDeg: number };
  onOpenGoogleDriveModal: () => void;
  onOpenOfflineModal: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const OnXTacticalTopBar: React.FC<OnXTacticalTopBarProps> = ({
  isDrawerOpen,
  onToggleDrawer,
  layersState,
  setLayersState,
  centerCoordsHUD,
  onOpenGoogleDriveModal,
  onOpenOfflineModal,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}) => {
  return (
    <header className="h-14 bg-[#151412] border-b border-[rgba(235,233,228,0.08)] px-3 sm:px-6 flex items-center justify-between gap-3 text-right rtl:text-right z-30 relative transition-colors">
      {/* Left: 4x4 Brand & Drawer Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleDrawer}
          className={`p-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            isDrawerOpen
              ? 'bg-[#D4AF37] text-[#151412] font-bold shadow-sm'
              : 'bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(235,233,228,0.08)] text-[#EBE9E4]'
          }`}
          title="فتح لوحة الاستكشاف والطبقات"
        >
          <Menu className="w-4 h-4" />
          <span className="hidden sm:inline font-mono text-xs uppercase tracking-wider">
            الطبقات
          </span>
        </button>

        {/* 4x4 Expedition Brand Mark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-[#D4AF37] text-[#151412] flex items-center justify-center font-black text-sm font-mono tracking-tight shadow-md">
            4x4
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-[#EBE9E4] tracking-tight flex items-center gap-1.5 font-sans">
              <span className="font-serif italic text-sm text-[#D4AF37]">CarCom</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 font-mono font-bold uppercase tracking-wider">
                EXPEDITION 4x4
              </span>
            </span>
            <span className="text-[9px] text-[#EBE9E4]/50 font-mono">نظام الملاحة والاستكشاف الصحراوي</span>
          </div>
        </div>
      </div>

      {/* Center: Search & Live Coordinates HUD */}
      <div className="flex-1 max-w-xl mx-2 flex items-center gap-2">
        {/* Search bar */}
        <form onSubmit={onSearchSubmit} className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute right-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-[#EBE9E4]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو بالإحداثيات (مثال: 24.9458°N, 45.9922°E)..."
            className="w-full pr-8 pl-3 py-1.5 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.08)] text-[#EBE9E4] text-xs placeholder:text-[#EBE9E4]/30 focus:outline-none focus:border-[#D4AF37] transition-colors"
          />
        </form>

        {/* Tactical Coordinates HUD (Hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded bg-[rgba(0,0,0,0.3)] border border-[rgba(235,233,228,0.08)] font-mono text-[11px] text-[#EBE9E4]/80">
          <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
            <Crosshair className="w-3 h-3" />
            <span>
              {centerCoordsHUD.lat}°N, {centerCoordsHUD.lng}°E
            </span>
          </div>
          <span className="text-[#EBE9E4]/20">|</span>
          <div className="flex items-center gap-1 text-[#10B981] font-semibold">
            <Mountain className="w-3 h-3" />
            <span>{centerCoordsHUD.altM} M</span>
          </div>
          <span className="text-[#EBE9E4]/20">|</span>
          <div className="flex items-center gap-1 text-[#EBE9E4]/70">
            <Wind className="w-3 h-3 text-[#D4AF37]" />
            <span>18 KM/H</span>
          </div>
        </div>
      </div>

      {/* Right: Basemap Selector Pills & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Basemap Pills */}
        <div className="hidden xl:flex items-center gap-[1px] bg-[rgba(235,233,228,0.08)] border border-[rgba(235,233,228,0.08)] p-[2px] font-mono text-[11px]">
          {[
            { id: 'satellite_hybrid', label: 'هجين' },
            { id: 'topo', label: 'تضاريس' },
            { id: 'tactical_dark', label: 'ليلي' },
          ].map((bm) => (
            <button
              key={bm.id}
              onClick={() =>
                setLayersState((prev) => ({ ...prev, basemap: bm.id as OnXBasemapType }))
              }
              className={`px-3 py-1 transition-colors cursor-pointer ${
                layersState.basemap === bm.id
                  ? 'bg-[#D4AF37] text-[#151412] font-bold'
                  : 'bg-[#151412] text-[#EBE9E4]/60 hover:text-white'
              }`}
            >
              {bm.label}
            </button>
          ))}
        </div>

        {/* Offline Maps Button */}
        <button
          onClick={onOpenOfflineModal}
          className="px-2.5 py-1.5 rounded bg-transparent border border-[#10B981]/50 hover:bg-[#10B981] hover:text-[#151412] text-[#10B981] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          title="خرائط بدون انترنت (Offline Maps)"
        >
          <DownloadCloud className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Offline</span>
        </button>

        {/* Google Drive Button */}
        <button
          onClick={onOpenGoogleDriveModal}
          className="px-2.5 py-1.5 rounded bg-transparent border border-[rgba(235,233,228,0.2)] hover:border-[#D4AF37] text-[#EBE9E4]/80 hover:text-[#D4AF37] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          title="سحابة Google Drive لحفظ ومزامنة المسارات"
        >
          <HardDrive className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="hidden md:inline">Drive</span>
        </button>
      </div>
    </header>
  );
};
