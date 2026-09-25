import React, { useState } from 'react';
import { Square, X } from 'lucide-react';

interface OnXAreaModalProps {
  onClose: () => void;
  centerCoords: { lat: number; lng: number };
}

export const OnXAreaModal: React.FC<OnXAreaModalProps> = ({
  onClose,
}) => {
  const [areaHectares, setAreaHectares] = useState<number>(34.8);
  const [perimeterKm, setPerimeterKm] = useState<number>(2.4);

  return (
    <div className="absolute top-20 left-6 z-40 w-80 bg-[rgba(30,29,27,0.92)] border border-[rgba(235,233,228,0.12)] p-4 shadow-2xl backdrop-blur-xl text-right rtl:text-right text-[#EBE9E4] space-y-3 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-[rgba(235,233,228,0.08)] pb-2">
        <div className="flex items-center gap-2">
          <Square className="w-4 h-4 text-[#D4AF37]" />
          <div>
            <h4 className="font-serif text-base font-bold text-[#EBE9E4]">تحديد المساحة (Area)</h4>
            <span className="text-[9px] text-[#EBE9E4]/50 font-mono uppercase">
              Territory & Perimeter
            </span>
          </div>
        </div>
        <button onClick={onClose} className="text-[#EBE9E4]/50 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 bg-black/40 border border-[rgba(235,233,228,0.06)] space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-[#EBE9E4]/60">المساحة:</span>
          <span className="text-base font-bold text-[#D4AF37]">{areaHectares} هكتار</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#EBE9E4]/60">بالمتر المربع:</span>
          <span className="text-[#10B981] font-semibold">{(areaHectares * 10000).toLocaleString()} M²</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#EBE9E4]/60">المحيط:</span>
          <span className="text-[#EBE9E4]">{perimeterKm} KM</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => {
            setAreaHectares((a) => Number((a + 12.5).toFixed(1)));
            setPerimeterKm((p) => Number((p + 0.8).toFixed(1)));
          }}
          className="flex-1 py-1.5 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] text-[#EBE9E4] font-mono text-xs transition-colors cursor-pointer"
        >
          + توسيع النطاق
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
