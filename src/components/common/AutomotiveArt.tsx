import React from 'react';
import { VehicleCategory } from '../../types';

interface HeroAutomotiveBannerProps {
  className?: string;
}

export const HeroAutomotiveBanner: React.FC<HeroAutomotiveBannerProps> = ({ className = '' }) => {
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0c131a] via-[#121922] to-[#0a0d12] border border-white/10 ${className}`}>
      {/* Background Topographic Curves */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 400"
        preserveAspectRatio="none"
      >
        <path d="M0,220 C150,180 300,260 450,210 C600,160 700,240 800,200 L800,400 L0,400 Z" fill="rgba(16, 185, 129, 0.08)" />
        <path d="M0,260 C200,220 350,300 500,250 C650,200 750,280 800,240 L800,400 L0,400 Z" fill="rgba(217, 119, 6, 0.08)" />
        <path d="M0,310 C250,270 400,340 550,290 C700,240 750,320 800,290 L800,400 L0,400 Z" fill="rgba(16, 185, 129, 0.05)" />
        <line x1="0" y1="360" x2="800" y2="360" stroke="rgba(255,255,255,0.06)" strokeDasharray="6 6" />
      </svg>

      {/* Atmospheric Glowing Light Beams */}
      <div className="absolute top-1/4 -right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Automotive Silhouette Artwork */}
      <div className="relative w-full h-48 sm:h-64 flex items-end justify-center px-4 pb-2">
        <svg
          viewBox="0 0 640 240"
          className="w-full h-full max-w-xl text-slate-300 filter drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Desert Dune Horizon */}
          <path
            d="M20 200 Q 180 160 340 185 T 620 170 L 620 220 L 20 220 Z"
            fill="url(#duneGradient)"
            opacity="0.4"
          />

          {/* Off-Road 4x4 Rig Silhouette (Left/Center) */}
          <g transform="translate(60, 60) scale(0.85)">
            {/* Roof Rack & Gear */}
            <rect x="70" y="24" width="130" height="6" rx="3" fill="#334155" />
            <rect x="85" y="16" width="35" height="8" rx="2" fill="#475569" />
            <rect x="130" y="14" width="45" height="10" rx="2" fill="#d97706" opacity="0.8" />
            {/* Overland Vehicle Body */}
            <path
              d="M30 115 L 45 68 L 85 40 L 200 40 L 225 70 L 250 82 L 265 115 L 260 130 L 215 130 C 215 110 190 110 190 130 L 105 130 C 105 110 80 110 80 130 L 25 130 Z"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="1.2"
              strokeOpacity="0.4"
            />
            {/* Windows */}
            <path d="M90 48 L 135 48 L 135 75 L 60 75 Z" fill="#0f172a" />
            <path d="M142 48 L 195 48 L 215 75 L 142 75 Z" fill="#0f172a" />
            {/* Wheels & Tires */}
            <circle cx="92" cy="130" r="26" fill="#090d14" stroke="#475569" strokeWidth="4" />
            <circle cx="92" cy="130" r="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
            <circle cx="202" cy="130" r="26" fill="#090d14" stroke="#475569" strokeWidth="4" />
            <circle cx="202" cy="130" r="14" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
            {/* Snorkel & LED Bar */}
            <path d="M224 45 L 228 30 L 235 30" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            <rect x="195" y="36" width="18" height="3" rx="1.5" fill="#fef08a" filter="drop-shadow(0 0 6px #f59e0b)" />
            {/* Headlight Beam */}
            <polygon points="265,95 440,110 440,165 260,115" fill="url(#headlightBeam)" opacity="0.35" />
          </g>

          {/* Performance Supercar Silhouette (Right) */}
          <g transform="translate(340, 100) scale(0.85)">
            {/* Sleek Aerodynamic Body */}
            <path
              d="M10 85 C 30 75 70 70 110 50 C 145 35 200 35 240 50 L 290 68 C 305 72 315 80 320 85 L 310 95 C 310 95 295 95 285 85 C 275 75 255 75 245 85 L 140 85 C 130 75 110 75 100 85 L 5 95 Z"
              fill="#0f172a"
              stroke="#10b981"
              strokeWidth="1.2"
              strokeOpacity="0.5"
            />
            {/* Aerodynamic Cockpit Glass */}
            <path d="M120 50 C 150 40 195 40 230 52 L 210 68 L 135 68 Z" fill="#1e293b" opacity="0.8" />
            {/* Big Carbon Rear Wing */}
            <path d="M15 62 L 5 45 L 40 45 L 35 62 Z" fill="#334155" />
            <line x1="2" y1="44" x2="44" y2="44" stroke="#10b981" strokeWidth="2" />
            {/* Wheels with Low Profile Tires & Red Calipers */}
            <circle cx="100" cy="88" r="20" fill="#0b0f17" stroke="#334155" strokeWidth="3" />
            <circle cx="100" cy="88" r="10" fill="#1e293b" />
            <circle cx="245" cy="88" r="20" fill="#0b0f17" stroke="#334155" strokeWidth="3" />
            <circle cx="245" cy="88" r="10" fill="#1e293b" />
            {/* Laser Taillight / Headlight Accent */}
            <path d="M305 75 L 318 82" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" filter="drop-shadow(0 0 6px #38bdf8)" />
            <path d="M12 70 L 25 70" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" filter="drop-shadow(0 0 6px #ef4444)" />
          </g>

          <defs>
            <linearGradient id="duneGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <linearGradient id="headlightBeam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export const CategoryIconBadge: React.FC<{ category: VehicleCategory; size?: 'sm' | 'md' | 'lg' }> = ({
  category,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
  }[size];

  switch (category) {
    case 'overland':
      return (
        <div className={`${sizeClasses} rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold shadow-sm`}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M3 17h18M6 17l2-7h8l2 7M9 10l1.5-4h3l1.5 4M7 17a2 2 0 104 0M17 17a2 2 0 104 0" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="8" cy="17" r="1.5" fill="currentColor" />
            <circle cx="16" cy="17" r="1.5" fill="currentColor" />
          </svg>
        </div>
      );
    case 'supercars':
      return (
        <div className={`${sizeClasses} rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold shadow-sm`}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2 14l2-4 5-3h6l5 3 2 4M3 14h18v3H3z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6" cy="17" r="2" fill="currentColor" />
            <circle cx="18" cy="17" r="2" fill="currentColor" />
            <path d="M8 7l1.5-3h5L16 7" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'classic':
      return (
        <div className={`${sizeClasses} rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 flex items-center justify-center font-bold shadow-sm`}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 15l2-5 4-2h4l4 2 2 5M2 15h20v3H2z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="7" cy="18" r="2.5" />
            <circle cx="17" cy="18" r="2.5" />
            <line x1="12" y1="8" x2="12" y2="15" strokeLinecap="round" />
          </svg>
        </div>
      );
    case 'tuner':
    case 'track':
      return (
        <div className={`${sizeClasses} rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center font-bold shadow-sm`}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 12a5 5 0 0110 0" strokeDasharray="2 2" />
          </svg>
        </div>
      );
    default:
      return (
        <div className={`${sizeClasses} rounded-xl bg-slate-500/10 border border-slate-500/20 text-slate-300 flex items-center justify-center font-bold shadow-sm`}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 17h14M7 17l1.5-6h7l1.5 6M4 17a2 2 0 104 0M16 17a2 2 0 104 0" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      );
  }
};

export const RouteElevationVisualizer: React.FC<{
  distanceKm: number;
  elevationGainM?: number;
  difficulty: 'easy' | 'moderate' | 'expert';
  className?: string;
}> = ({ distanceKm, elevationGainM = 320, difficulty, className = '' }) => {
  const difficultyColor = {
    easy: '#10b981',
    moderate: '#f59e0b',
    expert: '#ef4444',
  }[difficulty];

  return (
    <div className={`p-3.5 rounded-xl bg-[#0e131b] border border-white/5 ${className}`}>
      <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-mono">
        <span className="flex items-center gap-1.5 text-slate-300">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: difficultyColor }} />
          <span>بروفايل التضاريس والارتفاع</span>
        </span>
        <span className="text-slate-400">+{elevationGainM}m صعود · {distanceKm} كم</span>
      </div>

      <div className="relative w-full h-16">
        <svg viewBox="0 0 320 60" preserveAspectRatio="none" className="w-full h-full">
          <defs>
            <linearGradient id="elevGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={difficultyColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor={difficultyColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="0" y1="15" x2="320" y2="15" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1="0" y1="35" x2="320" y2="35" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

          {/* Elevation Curve */}
          <path
            d="M0,50 Q40,46 80,32 T160,20 T240,38 T320,12 L320,60 L0,60 Z"
            fill="url(#elevGradient)"
          />
          <path
            d="M0,50 Q40,46 80,32 T160,20 T240,38 T320,12"
            fill="none"
            stroke={difficultyColor}
            strokeWidth="2.2"
            strokeLinecap="round"
          />

          {/* Checkpoint Markers */}
          <circle cx="80" cy="32" r="3.5" fill="#f8fafc" stroke={difficultyColor} strokeWidth="1.5" />
          <circle cx="160" cy="20" r="3.5" fill="#f8fafc" stroke={difficultyColor} strokeWidth="1.5" />
          <circle cx="240" cy="38" r="3.5" fill="#f8fafc" stroke={difficultyColor} strokeWidth="1.5" />
          <circle cx="320" cy="12" r="4" fill={difficultyColor} />
        </svg>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1 font-mono">
        <span>الانطلاق (0 كم)</span>
        <span>نقطة التبريد (85 كم)</span>
        <span>الوصول ({distanceKm} كم)</span>
      </div>
    </div>
  );
};
