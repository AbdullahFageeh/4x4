import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Vehicle } from '../../types';
import { AddVehicleModal } from './AddVehicleModal';
import { CategoryIconBadge } from '../common/AutomotiveArt';
import {
  Car,
  Compass,
  Users,
  ShieldCheck,
  Settings,
  Globe,
  Moon,
  Sun,
  LogOut,
  Plus,
  MapPin,
  Award,
  Zap,
  CheckCircle,
  Radio,
  Sparkles,
  HardDrive,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    communities,
    trips,
    logout,
    language,
    setLanguage,
    theme,
    setTheme,
    dir,
    isDemoMode,
    setCurrentTab,
    setShowOnboardingModal,
    setShowRadioConsoleModal,
    setShowGoogleDriveModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'garage' | 'communities' | 'trips' | 'settings'>('garage');
  const [showAddVehicleModal, setShowAddVehicleModal] = useState<boolean>(false);

  const joinedCommunities = communities.filter((c) =>
    currentUser.joinedCommunityIds.includes(c.id)
  );

  const registeredTrips = trips.filter((t) =>
    currentUser.registeredTripIds.includes(t.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. Premium Profile Header Card */}
      <div className="relative rounded-2xl bg-gradient-to-br from-[#121924] via-[#0f1520] to-[#0a0e14] border border-white/10 shadow-2xl overflow-hidden p-6">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* User Info & Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-[2px] shadow-xl shadow-black/60">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-[14px] object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-600 text-white shadow" title="حساب موثق">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  {currentUser.name}
                </h1>
                {isDemoMode && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-mono">
                    Demo
                  </span>
                )}
                {currentUser.callsign && (
                  <span className="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-mono flex items-center gap-1">
                    <Radio className="w-3 h-3" />
                    <span>النداء: {currentUser.callsign}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-slate-300">@{currentUser.username}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Award className="w-3.5 h-3.5" />
                  <span>{currentUser.rankTitle}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{currentUser.city}</span>
                </span>
              </div>
              <p className="text-xs text-slate-300/90 max-w-xl leading-relaxed pt-1">
                {currentUser.bio}
              </p>
            </div>
          </div>

          {/* Quick Actions (Onboarding Wizard, Add Car / Sign Out) */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
              title="إعادة تشغيل دليل السائق التفاعلي وتعديل بطاقة الرتل"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>تعديل بطاقة السائق والنداء</span>
            </button>

            <button
              onClick={() => setShowRadioConsoleModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 font-mono"
              title="جهاز اللاسلكي ورادار الرتل"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>جهاز اللاسلكي</span>
            </button>

            <button
              onClick={() => setShowGoogleDriveModal(true)}
              className="px-3.5 py-2.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
              title="سحابة Google Drive لحفظ وتصدير ملفات الكراج والمسارات"
            >
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>سحابة Drive</span>
            </button>

            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Car className="w-4 h-4" />
              <span>إضافة سيارة</span>
            </button>
            <button
              onClick={logout}
              className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs transition-colors"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Automotive Stats Strip (Tabular Figures) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/5">
          <div className="p-3 rounded-xl bg-[#0c1017] border border-white/5">
            <span className="text-[11px] text-slate-400 block mb-0.5">القوافل المكتملة</span>
            <span className="text-xl sm:text-2xl font-bold text-white font-mono tabular-nums">
              {currentUser.stats.tripsCompleted}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0c1017] border border-white/5">
            <span className="text-[11px] text-slate-400 block mb-0.5">المسافة المقطوعة</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                {currentUser.stats.distanceKm.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-mono">كم</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#0c1017] border border-white/5">
            <span className="text-[11px] text-slate-400 block mb-0.5">المجتمعات المشترك بها</span>
            <span className="text-xl sm:text-2xl font-bold text-amber-400 font-mono tabular-nums">
              {joinedCommunities.length}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#0c1017] border border-white/5">
            <span className="text-[11px] text-slate-400 block mb-0.5">نقاط السمعة والخبرة</span>
            <span className="text-xl sm:text-2xl font-bold text-sky-400 font-mono tabular-nums">
              {currentUser.stats.reputationScore}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs within Profile */}
      <div className="flex items-center gap-1.5 p-1 bg-[#111720] rounded-xl border border-white/5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('garage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'garage'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>كراج السيارات ({currentUser.garage.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('communities')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'communities'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>أنديتي ومجتمعاتي ({joinedCommunities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('trips')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'trips'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>قوافلي المسجلة ({registeredTrips.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'settings'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>الإعدادات والتفضيلات</span>
        </button>
      </div>

      {/* 4. Tab Content */}
      {/* GARAGE TAB */}
      {activeTab === 'garage' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">السيارات المسجلة بالكراج</h3>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة سيارة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser.garage.map((veh) => (
              <div
                key={veh.id}
                className="p-5 rounded-2xl bg-[#111722] border border-white/10 hover:border-emerald-500/30 transition-all space-y-3 relative overflow-hidden"
              >
                {veh.isPrimary && (
                  <span className="absolute top-4 left-4 rtl:left-auto rtl:right-4 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    المركبة الأساسية
                  </span>
                )}

                <div className="flex items-start gap-3">
                  <CategoryIconBadge category={veh.category} size="md" />
                  <div>
                    <h4 className="text-base font-bold text-white">
                      {veh.make} {veh.model}
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {veh.year} · {veh.trim}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400 bg-[#0c1017] p-2.5 rounded-xl border border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-400 block">رقم اللوحة</span>
                    <span className="text-white font-bold">{veh.plateNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">اللون</span>
                    <span className="text-slate-200">{veh.color}</span>
                  </div>
                </div>

                {veh.modifications && veh.modifications.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 block mb-1">
                      التجهيزات والتعديلات المضافة:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                      {veh.modifications.map((mod, i) => (
                        <li key={i}>{mod}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* COMMUNITIES TAB */}
      {activeTab === 'communities' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">المجتمعات التي انضممت إليها</h3>
          {joinedCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {joinedCommunities.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl bg-[#111722] border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <CategoryIconBadge category={c.category} size="sm" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{c.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{c.city} · {c.membersCount} عضو</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentTab('communities')}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-200 font-medium transition-colors"
                  >
                    عرض المجتمع
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              لم تنضم لأي مجتمع بعد.
            </div>
          )}
        </div>
      )}

      {/* TRIPS TAB */}
      {activeTab === 'trips' && (
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white">القوافل والمسارات المسجلة</h3>
          {registeredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {registeredTrips.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-xl bg-[#111722] border border-white/10 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{t.title}</span>
                    <span className="text-[11px] text-amber-400 font-mono">{t.status === 'confirmed' ? 'مؤكد' : 'مفتوح'}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">{t.date} · {t.distanceKm} كم</p>
                  <button
                    onClick={() => setCurrentTab('trips')}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    تفاصيل القافلة ومعلومات اللاسلكي ←
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              لم تسجل في أي قافلة قادمة بعد.
            </div>
          )}
        </div>
      )}

      {/* SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl space-y-4">
          <h3 className="text-base font-bold text-white">إعدادات التطبيق وتفضيلات الحساب</h3>

          <div className="p-4 rounded-xl bg-[#111722] border border-white/10 space-y-4">
            {/* Language Switch */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-amber-400" />
                <div>
                  <span className="text-xs font-bold text-white block">لغة التطبيق</span>
                  <span className="text-[11px] text-slate-400">يدعم الواجهة العربية مع دعم كامل للاتجاه RTL/LTR</span>
                </div>
              </div>
              <button
                onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                className="px-3.5 py-1.5 rounded-lg bg-[#18202d] text-white text-xs font-semibold border border-white/10"
              >
                {language === 'ar' ? 'العربية (RTL)' : 'English (LTR)'}
              </button>
            </div>

            {/* Appearance Mode */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-white block">المظهر والسمة (Theme)</span>
                  <span className="text-[11px] text-slate-400">الوضع الليلي الفحمي المخصص لراحة العين والمقصورات</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold">
                Dark Charcoal (افتراضي)
              </span>
            </div>

            {/* Sign Out */}
            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-red-400 block">تسجيل الخروج</span>
                <span className="text-[11px] text-slate-400">الخروج من الحساب الحالي والعودة إلى البداية</span>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold transition-colors"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddVehicleModal && (
        <AddVehicleModal onClose={() => setShowAddVehicleModal(false)} />
      )}
    </div>
  );
};
