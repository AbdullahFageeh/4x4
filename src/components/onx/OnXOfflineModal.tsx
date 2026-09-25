import React, { useState } from 'react';
import { OnXOfflineArea } from '../../types';
import { INITIAL_OFFLINE_AREAS } from '../../data/onxData';
import {
  DownloadCloud,
  HardDrive,
  Trash2,
  CheckCircle2,
  X,
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
  const [newAreaName, setNewAreaName] = useState<string>('قطاع الاستكشاف الميداني');
  const [resolution, setResolution] = useState<'standard' | 'high' | 'ultra'>('high');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const estimatedSizes = {
    standard: 45,
    high: 125,
    ultra: 280,
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
            name: newAreaName.trim() || 'خريطة صحراوية أوفلاين',
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-[#151412] border border-[rgba(235,233,228,0.12)] p-6 shadow-2xl text-right rtl:text-right space-y-5 animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(235,233,228,0.08)] pb-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#EBE9E4]/50 mb-1">
              Offline Cartography
            </div>
            <h3 className="font-serif text-2xl text-[#EBE9E4]">حزم الخرائط غير المتصلة</h3>
          </div>
          <button onClick={onClose} className="text-[#EBE9E4]/50 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="p-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.08)] flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-[#EBE9E4]/70">
            <HardDrive className="w-4 h-4 text-[#D4AF37]" />
            <span>المساحة المحملة في الذاكرة:</span>
            <span className="text-[#EBE9E4] font-bold">{totalUsedMb} MB</span>
          </div>
          <span className="text-[#10B981] font-semibold">جاهز للاستكشاف اللاسلكي</span>
        </div>

        {/* Download New Region */}
        <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(235,233,228,0.08)] space-y-3">
          <span className="font-serif text-base font-bold text-[#EBE9E4] block">
            تحميل القطاع الحالي (Sector Cache)
          </span>

          <div>
            <label className="text-[11px] font-mono text-[#EBE9E4]/60 block mb-1">اسم الحزمة</label>
            <input
              type="text"
              value={newAreaName}
              onChange={(e) => setNewAreaName(e.target.value)}
              placeholder="مثال: رمال بحرة، صحراء طويق"
              className="w-full px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.1)] text-[#EBE9E4] text-xs focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono text-[#EBE9E4]/60 block mb-1.5">دقة الطبقات</label>
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
                  className={`p-2 border text-xs text-center transition-all cursor-pointer ${
                    resolution === res.id
                      ? 'bg-[rgba(212,175,55,0.15)] border-[#D4AF37] text-[#D4AF37] font-bold'
                      : 'bg-[rgba(255,255,255,0.02)] border-[rgba(235,233,228,0.08)] text-[#EBE9E4]/60'
                  }`}
                >
                  <span className="block font-sans text-xs">{res.label}</span>
                  <span className="block text-[10px] font-mono opacity-60 mt-0.5">{res.size}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          {isDownloading ? (
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#EBE9E4]/70">
                <span>جاري حفظ البلاطات...</span>
                <span className="text-[#D4AF37] font-bold">{downloadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-black/60 overflow-hidden">
                <div
                  className="h-full bg-[#D4AF37] transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              onClick={handleDownload}
              className="w-full py-2.5 bg-[#D4AF37] hover:brightness-110 text-[#151412] font-serif font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>تحميل القطاع ({estimatedSizes[resolution]} MB)</span>
            </button>
          )}
        </div>

        {/* Existing Downloaded Areas */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#EBE9E4]/60 block">
            الحزم المحفوظة ({offlineAreas.length})
          </span>
          <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
            {offlineAreas.map((area) => (
              <div
                key={area.id}
                className="p-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(235,233,228,0.06)] flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                  <div>
                    <h5 className="font-semibold text-[#EBE9E4]">{area.name}</h5>
                    <span className="text-[10px] text-[#EBE9E4]/50 font-mono">
                      {area.region} · {area.sizeMb} MB · دقة {area.resolution}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteArea(area.id)}
                  className="p-1.5 text-[#EBE9E4]/40 hover:text-red-400 transition-colors"
                  title="حذف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-mono uppercase text-[#EBE9E4]/60 hover:text-white"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
