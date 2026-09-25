import React, { useState } from 'react';
import { OnXWaypoint, OnXWaypointIcon } from '../../types';
import {
  MapPin,
  Tent,
  AlertTriangle,
  Car,
  Fuel,
  Droplets,
  Bird,
  Wrench,
  Eye,
  HardDrive,
  X,
} from 'lucide-react';

interface OnXWaypointModalProps {
  initialCoords: { lat: number; lng: number };
  onSave: (wp: Partial<OnXWaypoint>, syncToDrive: boolean) => void;
  onClose: () => void;
}

export const OnXWaypointModal: React.FC<OnXWaypointModalProps> = ({
  initialCoords,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState<string>('');
  const [icon, setIcon] = useState<OnXWaypointIcon>('viewpoint');
  const [color, setColor] = useState<string>('#D4AF37');
  const [lat, setLat] = useState<number>(initialCoords.lat);
  const [lng, setLng] = useState<number>(initialCoords.lng);
  const [elevationM, setElevationM] = useState<number>(680);
  const [notes, setNotes] = useState<string>('');
  const [syncToDrive, setSyncToDrive] = useState<boolean>(true);

  const iconOptions: { id: OnXWaypointIcon; label: string; icon: React.FC<any> }[] = [
    { id: 'viewpoint', label: 'مطل / إطلالة', icon: Eye },
    { id: 'campsite', label: 'مخيم', icon: Tent },
    { id: 'dune', label: 'طعس رملي', icon: MapPin },
    { id: 'obstacle', label: 'عقبة صخرية', icon: Car },
    { id: 'hazard', label: 'خطر / انزلاق', icon: AlertTriangle },
    { id: 'fuel', label: 'محطة وقود', icon: Fuel },
    { id: 'water', label: 'مصدر ماء', icon: Droplets },
    { id: 'recovery', label: 'نقطة ونش', icon: Wrench },
    { id: 'wildlife', label: 'حياة فطرية', icon: Bird },
  ];

  const colorPalette = [
    '#D4AF37', // Expedition Gold
    '#10B981', // Oasis Emerald
    '#EBE9E4', // Parchment Cream
    '#ef4444', // Alert Red
    '#38bdf8', // Sky Blue
    '#a855f7', // Royal Violet
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave(
      {
        name: name.trim(),
        icon,
        color,
        lat: Number(lat),
        lng: Number(lng),
        elevationM: Number(elevationM),
        notes: notes.trim(),
        createdAt: new Date().toISOString(),
      },
      syncToDrive
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#151412] border border-[rgba(235,233,228,0.12)] p-6 shadow-2xl text-right rtl:text-right space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-[rgba(235,233,228,0.08)] pb-4">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#EBE9E4]/50 mb-1">
              Cartography Marking
            </div>
            <h3 className="font-serif text-2xl text-[#EBE9E4]">تثبيت نقطة إحداثية جديدة</h3>
          </div>
          <button onClick={onClose} className="text-[#EBE9E4]/50 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Waypoint Title */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#EBE9E4]/70 block mb-1">
              اسم النقطة الإحداثية
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: مطل حافة طويق، رأس طعس التحدي، مخيم الوادي"
              className="w-full px-3.5 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.1)] text-[#EBE9E4] text-xs focus:outline-none focus:border-[#D4AF37]"
              required
            />
          </div>

          {/* Icon Category Selector */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#EBE9E4]/70 block mb-2">
              التصنيف التكتيكي
            </label>
            <div className="grid grid-cols-3 gap-2">
              {iconOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = icon === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIcon(opt.id)}
                    className={`p-2 border text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[rgba(212,175,55,0.15)] border-[#D4AF37] text-[#D4AF37] font-bold'
                        : 'bg-[rgba(255,255,255,0.02)] border-[rgba(235,233,228,0.08)] text-[#EBE9E4]/70 hover:border-[#D4AF37]/50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="truncate text-[11px] font-sans">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#EBE9E4]/70 block mb-2">
              لون العلامة
            </label>
            <div className="flex items-center gap-2">
              {colorPalette.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                    color === c
                      ? 'scale-110 border-[#EBE9E4] shadow-md shadow-[#D4AF37]/40'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Coordinates & Elevation */}
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <label className="text-[10px] text-[#EBE9E4]/50 block mb-1">LATITUDE</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.1)] text-[#EBE9E4] text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#EBE9E4]/50 block mb-1">LONGITUDE</label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.1)] text-[#EBE9E4] text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#EBE9E4]/50 block mb-1">ELEVATION (M)</label>
              <input
                type="number"
                value={elevationM}
                onChange={(e) => setElevationM(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.1)] text-[#EBE9E4] text-xs focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-[#EBE9E4]/70 block mb-1">
              ملاحظات الميدان
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="طبيعة الأرض، ضغط الإطارات المناسب، تنبيهات صخرية..."
              className="w-full px-3 py-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.1)] text-[#EBE9E4] text-xs focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Google Drive Option */}
          <div className="p-3 bg-[rgba(212,175,55,0.05)] border border-[rgba(212,175,55,0.2)] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-[#EBE9E4]">
              <HardDrive className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>مزامنة النقطة تلقائياً في سحابة Google Drive</span>
            </div>
            <input
              type="checkbox"
              checked={syncToDrive}
              onChange={(e) => setSyncToDrive(e.target.checked)}
              className="accent-[#D4AF37] w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono uppercase text-[#EBE9E4]/60 hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="bg-[#D4AF37] hover:brightness-110 text-[#151412] px-6 py-2.5 font-serif font-bold text-sm tracking-wide shadow-md cursor-pointer"
            >
              حفظ النقطة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
