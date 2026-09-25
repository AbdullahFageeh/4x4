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
  Plus,
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
  const [color, setColor] = useState<string>('#ff6a00');
  const [lat, setLat] = useState<number>(initialCoords.lat);
  const [lng, setLng] = useState<number>(initialCoords.lng);
  const [elevationM, setElevationM] = useState<number>(680);
  const [notes, setNotes] = useState<string>('');
  const [syncToDrive, setSyncToDrive] = useState<boolean>(true);

  const iconOptions: { id: OnXWaypointIcon; label: string; icon: React.FC<any> }[] = [
    { id: 'viewpoint', label: 'مطل / رؤية', icon: Eye },
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
    '#ff6a00', // onX Signal Orange
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#ffffff', // White
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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-[#0f141f] border border-[#ff6a00]/40 p-6 shadow-2xl text-right rtl:text-right space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-[#ff6a00]/20 text-[#ff6a00] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">إضافة نقطة إحداثية جديدة (Mark Waypoint)</h3>
              <p className="text-[11px] text-slate-400">تحديد موقع وعلامة تكتيكية على خريطة onX</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Waypoint Title */}
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">اسم النقطة</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: نقطة تجمع وادي ديراب، رأس الطعس، منبع ماء"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080c13] border border-white/10 text-white text-xs focus:outline-none focus:border-[#ff6a00]"
              required
            />
          </div>

          {/* Icon Category Selector */}
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-2">نوع الأيقونة</label>
            <div className="grid grid-cols-3 gap-2">
              {iconOptions.map((opt) => {
                const IconComponent = opt.icon;
                const isSelected = icon === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIcon(opt.id)}
                    className={`p-2 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-[#ff6a00]/20 border-[#ff6a00] text-white font-bold'
                        : 'bg-[#080c13] border-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 text-[#ff6a00] shrink-0" />
                    <span className="truncate text-[11px]">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-2">لون العلامة</label>
            <div className="flex items-center gap-2">
              {colorPalette.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${
                    color === c ? 'scale-115 border-white shadow-lg' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Coordinates & Elevation */}
          <div className="grid grid-cols-3 gap-2 font-mono text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">خط العرض (Lat)</label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#080c13] border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">خط الطول (Lng)</label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#080c13] border border-white/10 text-white text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">الارتفاع (متر)</label>
              <input
                type="number"
                value={elevationM}
                onChange={(e) => setElevationM(Number(e.target.value))}
                className="w-full px-2.5 py-1.5 rounded-lg bg-[#080c13] border border-white/10 text-white text-xs"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-slate-300 font-semibold block mb-1">
              ملاحظات المسار وإرشادات السلامة
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="تنبيهات الصخور، ضغط الهواء الموصى به، إحداثيات راديو UHF..."
              className="w-full px-3.5 py-2 rounded-xl bg-[#080c13] border border-white/10 text-white text-xs focus:outline-none focus:border-[#ff6a00]"
            />
          </div>

          {/* Google Drive Option */}
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-blue-300">
              <HardDrive className="w-4 h-4 text-blue-400 shrink-0" />
              <span>مزامنة النقطة فوراً في مجلد Google Drive</span>
            </div>
            <input
              type="checkbox"
              checked={syncToDrive}
              onChange={(e) => setSyncToDrive(e.target.checked)}
              className="accent-blue-500 w-4 h-4 rounded"
            />
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#ff7b1a] text-black text-xs font-bold shadow-lg"
            >
              حفظ النقطة على الخريطة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
