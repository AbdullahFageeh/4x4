import React, { useState } from 'react';
import { Ruler, X } from 'lucide-react';

interface OnXMeasureModalProps {
  onClose: () => void;
  centerCoords: { lat: number; lng: number };
}

export const OnXMeasureModal: React.FC<OnXMeasureModalProps> = ({
  onClose,
}) => {
  const [pointsCount, setPointsCount] = useState<number>(3);
  const [distanceKm, setDistanceKm] = useState<number>(14.6);
  const [elevationDeltaM, setElevationDeltaM] = useState<number>(240);
  const [headingDeg, setHeadingDeg] = useState<number>(38);

  const estimatedDrivingTime = Math.round((distanceKm / 20) * 60);

  return (
    <div className="absolute top-20 left-6 z-40 w-80 bg-[rgba(30,29,27,0.92)] border border-[rgba(235,233,228,0.12)] p-4 shadow-2xl backdrop-blur-xl text-right rtl:text-right text-[#EBE9E4] space-y-3 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-[rgba(235,233,228,0.08)] pb-2">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-[#D4AF37]" />
          <div>
            <h4 className="font-serif text-base font-bold text-[#EBE9E4]">قياس المسار (Line)</h4>
            <span className="text-[9px] text-[#EBE9E4]/50 font-mono uppercase">
              Distance & Terrain Slope
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-[#EBE9E4]/50 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 bg-black/40 border border-[rgba(235,233,228,0.06)] space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#EBE9E4]/60">المسافة:</span>
          <span className="text-base font-bold text-[#D4AF37]">{distanceKm} KM</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#EBE9E4]/60">الميلان (Slope):</span>
          <span className="text-[#10B981] font-semibold">+{elevationDeltaM} M</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#EBE9E4]/60">السمت (Bearing):</span>
          <span className="text-[#EBE9E4]">{headingDeg}° NE</span>
        </div>
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[rgba(235,233,228,0.06)]">
          <span className="text-[#EBE9E4]/60">الوقت التقديري:</span>
          <span className="text-[#EBE9E4] font-bold">{estimatedDrivingTime} دقيقة</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => {
            setDistanceKm((d) => Number((d + 5.2).toFixed(1)));
            setElevationDeltaM((e) => e + 60);
            setPointsCount((p) => p + 1);
          }}
          className="flex-1 py-1.5 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[#EBE9E4] font-mono text-xs transition-colors cursor-pointer"
        >
          + نقطة ({pointsCount})
        </button>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-[#D4AF37] hover:brightness-110 text-[#151412] font-mono text-xs font-bold cursor-pointer"
        >
          تم
        </button>
      </div>
    </div>
  );
};
