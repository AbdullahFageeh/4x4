import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TripDifficulty, VehicleCategory } from '../../types';
import { X, Plus, AlertCircle, Calendar, MapPin, Radio } from 'lucide-react';

interface CreateTripModalProps {
  onClose: () => void;
}

export const CreateTripModal: React.FC<CreateTripModalProps> = ({ onClose }) => {
  const { createTrip, communities } = useApp();

  const [communityId, setCommunityId] = useState(communities[0]?.id || '');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('الجمعة، 30 أكتوبر 2026');
  const [time, setTime] = useState('03:30 عصراً - 09:00 مساءً');
  const [meetingTime, setMeetingTime] = useState('03:00 عصراً');
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [distanceKm, setDistanceKm] = useState(120);
  const [durationHours, setDurationHours] = useState(5);
  const [vehicleRequirement, setVehicleRequirement] = useState('دفع رباعي 4x4 مع إطارات مهيأة للرمال');
  const [difficulty, setDifficulty] = useState<TripDifficulty>('moderate');
  const [maxParticipants, setMaxParticipants] = useState(20);
  const [radioFrequency, setRadioFrequency] = useState('UHF 462.5625 MHz');
  const [description, setDescription] = useState('');
  const [waypointsText, setWaypointsText] = useState('نقطة التجمع الأولى\nمدخل المسار البري\nنقطة التخييم والعشاء');
  const [error, setError] = useState('');

  const selectedComm = communities.find((c) => c.id === communityId) || communities[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('يرجى كتابة عنوان الرحلة أو القافلة');
      return;
    }
    if (!startLocation.trim() || !endLocation.trim()) {
      setError('يرجى تحديد نقطة الانطلاق والوجهة');
      return;
    }

    createTrip({
      communityId,
      communityName: selectedComm.name,
      title,
      titleEn: title,
      date,
      time,
      meetingTime,
      startLocation,
      endLocation,
      distanceKm: Number(distanceKm) || 100,
      durationHours: Number(durationHours) || 4,
      vehicleRequirement,
      vehicleCategory: selectedComm.category,
      difficulty,
      status: 'confirmed',
      maxParticipants: Number(maxParticipants) || 15,
      radioFrequency,
      elevationGainM: 280,
      description: description || 'قافلة منظمة تشمل تعليمات السلامة ومحطات توقف دورية.',
      waypoints: waypointsText.split('\n').filter((w) => w.trim().length > 0),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-[#0f141d] border border-white/10 shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">تنظيم مسار أو قافلة جديدة</h2>
          <p className="text-xs text-slate-400 mt-1">
            حدد خط السير، التوقيت، ونوعية المركبات المؤهلة
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              النادي أو المجتمع المُنظّم
            </label>
            <select
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            >
              {communities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              عنوان القافلة / المسار
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: جولة نفود الدهناء وتحدي الطعوس الرملية"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                نقطة الانطلاق
              </label>
              <input
                type="text"
                value={startLocation}
                onChange={(e) => setStartLocation(e.target.value)}
                placeholder="محطة ساسكو صلبوخ"
                className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الوجهة النهائية
              </label>
              <input
                type="text"
                value={endLocation}
                onChange={(e) => setEndLocation(e.target.value)}
                placeholder="مطل جبل فهرين"
                className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                المسافة (كم)
              </label>
              <input
                type="number"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                مستوى الصعوبة
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as TripDifficulty)}
                className="w-full px-2 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              >
                <option value="easy">سهل (ممهد)</option>
                <option value="moderate">متوسط (رمال / صخور)</option>
                <option value="expert">وعر للمحترفين</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                الحد الأقصى للسيارات
              </label>
              <input
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                تاريخ الرحلة
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                تردد اللاسلكي
              </label>
              <input
                type="text"
                value={radioFrequency}
                onChange={(e) => setRadioFrequency(e.target.value)}
                placeholder="UHF 462.5625 MHz"
                className="w-full px-3 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              اشتراطات ومواصفات المركبة
            </label>
            <input
              type="text"
              value={vehicleRequirement}
              onChange={(e) => setVehicleRequirement(e.target.value)}
              placeholder="مثال: دفع رباعي مرتفع مع إطارات مناسبة"
              className="w-full px-3.5 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              محطات التوقف (سطر لكل محطة)
            </label>
            <textarea
              rows={2}
              value={waypointsText}
              onChange={(e) => setWaypointsText(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[46px] py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-sm shadow-lg shadow-amber-950/60 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>نشر المسار وفتح التسجيل</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
