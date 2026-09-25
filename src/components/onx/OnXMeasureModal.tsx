import React, { useState } from 'react';
import { Ruler, Navigation, Mountain, X, Compass, Check } from 'lucide-react';

interface OnXMeasureModalProps {
  onClose: () => void;
  centerCoords: { lat: number; lng: number };
}

export const OnXMeasureModal: React.FC<OnXMeasureModalProps> = ({
  onClose,
  centerCoords,
}) => {
  const [pointsCount, setPointsCount] = useState<number>(3);
  const [distanceKm, setDistanceKm] = useState<number>(14.6);
  const [elevationDeltaM, setElevationDeltaM] = useState<number>(240);
  const [headingDeg, setHeadingDeg] = useState<number>(38);

  const estimatedDrivingTime = Math.round((distanceKm / 20) * 60); // 20 km/h avg offroad trail speed

  return (
    <div className="absolute top-16 left-4 rtl:left-auto rtl:right-4 z-40 w-80 rounded-2xl bg-[#0f141f]/95 border border-[#ff6a00]/40 p-4 shadow-2xl backdrop-blur-xl text-right rtl:text-right text-white space-y-3 animate-in fade-in zoom-in-95">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#ff6a00]/20 text-[#ff6a00]">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold">أداة قياس المسار (Line / Measure)</h4>
            <span className="text-[10px] text-slate-400 font-mono">حساب المسافة والميلان التضاريسي</span>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 rounded-xl bg-[#080c14] border border-white/5 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">إجمالي المسافة المقاسة:</span>
          <span className="text-base font-bold text-[#ff6a00]">{distanceKm} كم</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">فرق الارتفاع (Slope):</span>
          <span className="text-emerald-400 font-semibold">+{elevationDeltaM} م</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">زاوية السمت (Bearing):</span>
          <span className="text-sky-400">{headingDeg}° NE (شمال شرق)</span>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
          <span className="text-slate-400">الوقت التقديري للمسار الوعر:</span>
          <span className="text-white font-bold">{estimatedDrivingTime} دقيقة</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => {
            setDistanceKm((d) => Number((d + 5.2).toFixed(1)));
            setElevationDeltaM((e) => e + 60);
            setPointsCount((p) => p + 1);
          }}
          className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
        >
          + إضافة نقطة بالمسار ({pointsCount})
        </button>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7b1a] text-black text-xs font-bold"
        >
          تم
        </button>
      </div>
    </div>
  );
};
