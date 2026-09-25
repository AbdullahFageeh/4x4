import React, { useState } from 'react';
import { OnXOfflineArea } from '../../types';
import { INITIAL_OFFLINE_AREAS } from '../../data/onxData';
import {
  DownloadCloud,
  HardDrive,
  Trash2,
  CheckCircle2,
  AlertCircle,
  MapPin,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';

interface OnXOfflineModalProps {
  onClose: () => void;
  centerCoords: { lat: number; lng: number };
}

export const OnXOfflineModal: React.FC<OnXOfflineModalProps> = ({
  onClose,
  centerCoords,
}) => {
  const [offlineAreas, setOfflineAreas] = useState<OnXOfflineArea[]>(INITIAL_OFFLINE_AREAS);
  const [newAreaName, setNewAreaName] = useState<string>('منطقة الاستكشاف الحالية');
  const [resolution, setResolution] = useState<'standard' | 'high' | 'ultra'>('high');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const estimatedSizes = {
    standard: 45, // MB
    high: 125, // MB
    ultra: 280, // MB
  };

  const handleDownload = () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);

          const newPack: OnXOfflineArea = {
            id: `off-${Date.now()}`,
            name: newAreaName.trim() || 'خريطة صحراوية غير متصلة',
            region: `إحداثيات ${centerCoords.lat.toFixed(2)}°N, ${centerCoords.lng.toFixed(2)}°E`,
            sizeMb: estimatedSizes[resolution],
            resolution,
            bounds: {
              north: centerCoords.lat + 0.35,
              south: centerCoords.lat - 0.35,
              east: centerCoords.lng + 0.35,
              west: centerCoords.lng - 0.35,
            },
            downloadedAt: new Date().toISOString().slice(0, 10),
          };

          setOfflineAreas((prevList) => [newPack, ...prevList]);
          return 100;
        }
        return prev + 15;
      });
    }, 250);
  };

  const handleDeleteArea = (id: string) => {
    setOfflineAreas((prev) => prev.filter((a) => a.id !== id));
  };

  const totalUsedMb = offlineAreas.reduce((acc, a) => acc + a.sizeMb, 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-[#0f1420] border border-[#ff6a00]/40 p-6 shadow-2xl text-right rtl:text-right space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff6a00]/20 text-[#ff6a00] flex items-center justify-center">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">الخرائط غير المتصلة (onX Offline Maps)</h3>
              <p className="text-xs text-slate-400">
                تحميل بلاطات الأقمار الصناعية وخطوط التضاريس للاستخدام بدون شبكة جوال
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Offline Storage Status Bar */}
        <div className="p-3.5 rounded-xl bg-[#080c14] border border-white/5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <HardDrive className="w-4 h-4 text-[#ff6a00]" />
            <span>المساحة المحملة أوفلاين:</span>
            <span className="text-white font-bold">{totalUsedMb} MB</span>
          </div>
          <span className="text-[11px] text-emerald-400">جاهزة للاستكشاف اللاسلكي</span>
        </div>

        {/* Download New Region Card */}
        <div className="p-4 rounded-xl bg-[#141b26] border border-white/5 space-y-3">
          <span className="text-xs font-bold text-white block">حفظ القطاع الحالي (Center Tile)</span>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">اسم المنطقة</label>
            <input
              type="text"
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              placeholder="اسم المنطقة (مثال: طعوس بحرة، وادي الدواسر)"
              className="w-full px-3 py-2 rounded-xl bg-[#090d14] border border-white/10 text-white text-xs focus:outline-none focus:border-[#ff6a00]"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1.5">دقة طبقات التضاريس</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'standard', label: 'عادية (Standard)', size: '45 MB' },
                { id: 'high', label: 'عالية (High-Res)', size: '125 MB' },
                { id: 'ultra', label: 'فائقة (Ultra 3D)', size: '280 MB' },
              ].map((res) => (
                <button
                  key={res.id}
                  type="button"
                  onClick={() => setResolution(res.id as any)}
                  className={`p-2 rounded-xl border text-xs text-center transition-all ${
                    resolution === res.id
                      ? 'bg-[#ff6a00]/20 border-[#ff6a00] text-white font-bold'
                      : 'bg-[#090d14] border-white/5 text-slate-400'
                  }`}
                >
                  <span className="block font-semibold">{res.label}</span>
                  <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{res.size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar if downloading */}
          {isDownloading ? (
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                <span>جاري تحميل بلاطات الخريطة والتضاريس...</span>
                <span className="text-[#ff6a00] font-bold">{downloadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#ff6a00] to-amber-400 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleDownload}
              className="w-full py-2.5 rounded-xl bg-[#ff6a00] hover:bg-[#ff7b1a] text-black font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>بدء تحميل هذا القطاع للاستخدام بدون نت ({estimatedSizes[resolution]} MB)</span>
            </button>
          )}
        </div>

        {/* Existing Downloaded Areas List */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 block">المناطق المحملة مسبقاً في جهازك</span>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {offlineAreas.map((area) => (
              <div
                key={area.id}
                className="p-3 rounded-xl bg-[#090d14] border border-white/5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <h5 className="font-semibold text-white">{area.name}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {area.region} · {area.sizeMb} MB · دقة {area.resolution}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteArea(area.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  title="حذف المنطقة"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
