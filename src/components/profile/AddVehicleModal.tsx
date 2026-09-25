import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleCategory } from '../../types';
import { X, Plus, AlertCircle } from 'lucide-react';

interface AddVehicleModalProps {
  onClose: () => void;
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ onClose }) => {
  const { addVehicleToGarage } = useApp();

  const [make, setMake] = useState('Toyota');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2024);
  const [trim, setTrim] = useState('');
  const [category, setCategory] = useState<VehicleCategory>('overland');
  const [plateNumber, setPlateNumber] = useState('');
  const [color, setColor] = useState('');
  const [modsText, setModsText] = useState('نظام تعليق مرفوع\nإطارات صخرية');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!model.trim()) {
      setError('يرجى إدخال طراز المركبة');
      return;
    }

    addVehicleToGarage({
      make,
      model,
      year: Number(year) || 2024,
      trim,
      category,
      plateNumber: plateNumber || 'س ع د 123',
      color: color || 'رمادي / أسود',
      modifications: modsText.split('\n').filter((m) => m.trim().length > 0),
      isPrimary: false,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f141d] border border-white/10 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">إضافة مركبة إلى الكراج</h2>
          <p className="text-xs text-slate-400 mt-1">
            سجل سيارتك لتظهر في ملفك الشخصي ومشاركات القوافل
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الشركة المصنعة
              </label>
              <input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="Toyota / Porsche / Nissan"
                className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                طراز المركبة
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="Land Cruiser / 911 / Patrol"
                className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                سنة الصنع
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الفئة والنوع
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="overland">أوف رود ودفع رباعي</option>
                <option value="supercars">سوبركار ورياضية</option>
                <option value="classic">كلاسيك وتراثي</option>
                <option value="tuner">تعديل وحلبات</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                رقم اللوحة
              </label>
              <input
                type="text"
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="ق ط ع 111"
                className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                اللون
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="أسود مطفي"
                className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              التجهيزات والتعديلات (سطر لكل تعديل)
            </label>
            <textarea
              rows={2}
              value={modsText}
              onChange={(e) => setModsText(e.target.value)}
              placeholder="مثال: نظام تعليق BP-51&#10;إطارات BFGoodrich"
              className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[44px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-950/50 flex items-center justify-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة المركبة للكراج</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
