import React from 'react';
import { OnXBasemapType, OnXLayersState } from '../../types';
import {
  Menu,
  Search,
  Crosshair,
  DownloadCloud,
  HardDrive,
  Radio,
  Layers,
  Sparkles,
  Mountain,
  Compass,
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
    <header className="h-14 bg-[#0a0d14]/95 border-b border-white/10 px-3 sm:px-4 flex items-center justify-between gap-3 text-right rtl:text-right backdrop-blur-md z-40 relative">
      {/* Left: onX Brand & Drawer Toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onToggleDrawer}
          className={`p-2 rounded-xl transition-all flex items-center gap-1.5 ${
            isDrawerOpen
              ? 'bg-[#ff6a00] text-black shadow-md shadow-[#ff6a00]/30 font-bold'
              : 'bg-[#121620] hover:bg-[#1a202c] border border-white/10 text-white'
          }`}
          title="فتح لوحة onX التكتيكية والطبقات"
        >
          <Menu className="w-4 h-4" />
          <span className="hidden sm:inline text-xs font-bold">القائمة والطبقات</span>
        </button>

        {/* onX Offroad / Hunt Brand Mark */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#ff6a00] text-black flex items-center justify-center font-black text-sm tracking-tighter shadow-md shadow-[#ff6a00]/40">
            onX
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1">
              <span>CarCom</span>
              <span className="text-[10px] px-1 rounded bg-[#ff6a00]/20 text-[#ff6a00] border border-[#ff6a00]/30 font-mono">
                OFFROAD 4x4
              </span>
            </span>
            <span className="text-[9px] text-slate-400 font-mono">نظام الملاحة والاستكشاف الصحراوي</span>
          </div>
        </div>
      </div>

      {/* Center: Search & Live Coordinates HUD */}
      <div className="flex-1 max-w-xl mx-2 flex items-center gap-2">
        {/* Search bar */}
        <form onSubmit={onSearchSubmit} className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute right-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالاسم أو بالإحداثيات (مثال: 24.9458°N, 45.9922°E)..."
            className="w-full pr-8 pl-3 py-1.5 rounded-xl bg-[#101520] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#ff6a00] transition-colors"
          />
        </form>

        {/* Tactical Coordinates HUD (Hidden on mobile) */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#070a10] border border-white/5 font-mono text-[11px] text-slate-300">
          <div className="flex items-center gap-1 text-[#ff6a00] font-bold">
            <Crosshair className="w-3 h-3" />
            <span>
              {centerCoordsHUD.lat}°N, {centerCoordsHUD.lng}°E
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Mountain className="w-3 h-3" />
            <span>{centerCoordsHUD.altM} م</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-sky-400">
            <Wind className="w-3 h-3" />
            <span>18 كم/س</span>
          </div>
        </div>
      </div>

      {/* Right: Basemap Selector Pills & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Quick Basemap Pills */}
        <div className="hidden xl:flex items-center gap-1 p-1 bg-[#090d14] rounded-xl border border-white/5 text-[11px] font-semibold">
          {[
            { id: 'satellite_hybrid', label: 'هجين (Hybrid)' },
            { id: 'topo', label: 'تضاريس (Topo)' },
            { id: 'tactical_dark', label: 'ليلي (Dark)' },
          ].map((bm) => (
            <button
              key={bm.id}
              onClick={() =>
                setLayersState((prev) => ({ ...prev, basemap: bm.id as OnXBasemapType }))
              }
              className={`px-2.5 py-1 rounded-lg transition-all ${
                layersState.basemap === bm.id
                  ? 'bg-[#ff6a00] text-black font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {bm.label}
            </button>
          ))}
        </div>

        {/* Offline Maps Button */}
        <button
          onClick={onOpenOfflineModal}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#121620] hover:bg-[#1a202c] border border-white/10 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          title="تحميل خرائط بدون انترنت (Offline Maps)"
        >
          <DownloadCloud className="w-4 h-4 text-[#ff6a00]" />
          <span className="hidden sm:inline">أوفلاين</span>
        </button>

        {/* Google Drive Button */}
        <button
          onClick={onOpenGoogleDriveModal}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          title="سحابة Google Drive لحفظ المسارات والنقاط"
        >
          <HardDrive className="w-4 h-4 text-blue-400" />
          <span className="hidden md:inline">Google Drive</span>
        </button>
      </div>
    </header>
  );
};
