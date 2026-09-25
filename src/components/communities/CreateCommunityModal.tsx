import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleCategory } from '../../types';
import { X, Plus, ShieldCheck, AlertCircle } from 'lucide-react';

interface CreateCommunityModalProps {
  onClose: () => void;
}

export const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({ onClose }) => {
  const { createCommunity, currentUser } = useApp();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VehicleCategory>('overland');
  const [city, setCity] = useState('الرياض');
  const [meetingSpot, setMeetingSpot] = useState('');
  const [rulesText, setRulesText] = useState('الالتزام بأنظمة المرور\nاحترام جميع الأعضاء\nالمحافظة على نظافة الأماكن');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى كتابة اسم المجتمع');
      return;
    }
    if (!description.trim()) {
      setError('يرجى كتابة وصف المجتمع');
      return;
    }

    createCommunity({
      name,
      nameEn: name,
      tagline: tagline || 'مجتمع سيارات سعودي شغوف',
      taglineEn: tagline || 'Passionate Saudi car club',
      description,
      descriptionEn: description,
      category,
      city,
      cityEn: city,
      region: `منطقة ${city}`,
      isJoined: true,
      accentColor: '#10b981',
      gradient: 'from-emerald-950 via-slate-900 to-black',
      leader: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: 'مؤسس المجتمع',
      },
      meetingSpot: meetingSpot || `نقطة تجمع عامة في ${city}`,
      rules: rulesText.split('\n').filter((r) => r.trim().length > 0),
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
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>تأسيس مجتمع أو نادي جديد</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            اجمع ملاك فئتك في مدينتك ونظم معهم فعاليات دورية
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
              اسم المجتمع
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: رابطة باترول سوبر سفاري الرياض"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              الشعار / العبارة التعريفية
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="مثال: مسارات الرمال ونبض البراري"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                فئة المركبات
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VehicleCategory)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="overland">أوف رود ودفع رباعي (4x4)</option>
                <option value="supercars">سوبركار وسيارات رياضية</option>
                <option value="classic">سيارات كلاسيكية وتراثية</option>
                <option value="tuner">تعديل وحلبات (Tuners)</option>
                <option value="family">كروزات عائلية وجولات</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                المدينة الرئيسية
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="الرياض">الرياض</option>
                <option value="جدة">جدة</option>
                <option value="الخبر">الخبر</option>
                <option value="أبها">أبها</option>
                <option value="الدرعية">الدرعية</option>
                <option value="الأحساء">الأحساء</option>
                <option value="حائل">حائل</option>
                <option value="تبوك">تبوك</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              وصف أنشطة المجتمع
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتب أهداف التجمع وأنواع الفعاليات التي ستقام..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              نقطة التجمع المقترحة
            </label>
            <input
              type="text"
              value={meetingSpot}
              onChange={(e) => setMeetingSpot(e.target.value)}
              placeholder="مثال: طريق الملك سلمان - محطة ساسكو المقابلة للمطار"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              قواعد الانضمام (سطر لكل قاعدة)
            </label>
            <textarea
              rows={2}
              value={rulesText}
              onChange={(e) => setRulesText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-xs font-mono placeholder:text-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full min-h-[46px] py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>إنشاء ونشر المجتمع فوراً</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
