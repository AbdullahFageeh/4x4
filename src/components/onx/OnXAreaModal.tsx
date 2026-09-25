import React, { useState } from 'react';
import { Square, X } from 'lucide-react';

interface OnXAreaModalProps {
  onClose: () => void;
  centerCoords: { lat: number; lng: number };
}

export const OnXAreaModal: React.FC<OnXAreaModalProps> = ({
  onClose,
  centerCoords,
}) => {
  const [areaHectares, setAreaHectares] = useState<number>(34.8);
  const [perimeterKm, setPerimeterKm] = useState<number>(2.4);

  return (
    <div className="absolute top-16 left-4 rtl:left-auto rtl:right-4 z-40 w-80 rounded-2xl bg-[#0f141f]/95 border border-[#ff6a00]/40 p-4 shadow-2xl backdrop-blur-xl text-right rtl:text-right text-white space-y-3 animate-in fade-in zoom-in-95">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#ff6a00]/20 text-[#ff6a00]">
            <Square className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold">أداة تحديد المساحة (Area Tool)</h4>
            <span className="text-[10px] text-slate-400 font-mono">حساب مساحة المخيم ونطاق الإحداثيات</span>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 rounded-xl bg-[#080c14] border border-white/5 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">المساحة الإجمالية:</span>
          <span className="text-base font-bold text-[#ff6a00]">{areaHectares} هكتار</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">بالمتر المربع:</span>
          <span className="text-emerald-400 font-semibold">{(areaHectares * 10000).toLocaleString()} م²</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-400">محيط المضلع (Perimeter):</span>
          <span className="text-sky-400">{perimeterKm} كم</span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => {
            setAreaHectares((a) => Number((a + 12.5).toFixed(1)));
            setPerimeterKm((p) => Number((p + 0.8).toFixed(1)));
          }}
          className="flex-1 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold transition-colors"
        >
          + توسيع النطاق
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
