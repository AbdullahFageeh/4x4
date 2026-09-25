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
      <div className="relative bg-[#151412] border border-[rgba(235,233,228,0.08)] shadow-2xl p-6">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* User Info & Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#151412] border-2 border-[#D4AF37] p-1 shadow-xl">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 bg-[#10B981] text-[#151412] shadow" title="حساب موثق">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#EBE9E4]">
                  {currentUser.name}
                </h1>
                {isDemoMode && (
                  <span className="px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono">
                    Demo
                  </span>
                )}
                {currentUser.callsign && (
                  <span className="px-2 py-0.5 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-[11px] font-mono flex items-center gap-1">
                    <Radio className="w-3 h-3" />
                    <span>النداء: {currentUser.callsign}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#EBE9E4]/60">
                <span className="text-[#EBE9E4]">@{currentUser.username}</span>
                <span>·</span>
                <span className="flex items-center gap-1 text-[#10B981]">
                  <Award className="w-3.5 h-3.5" />
                  <span>{currentUser.rankTitle}</span>
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{currentUser.city}</span>
                </span>
              </div>
              <p className="text-xs text-[#EBE9E4]/70 max-w-xl leading-relaxed pt-1 font-sans">
                {currentUser.bio}
              </p>
            </div>
          </div>

          {/* Quick Actions (Onboarding Wizard, Add Car / Sign Out) */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="px-3.5 py-2 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#151412] font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="تعديل بطاقة الرتل والنداء"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>بطاقة السائق</span>
            </button>

            <button
              onClick={() => setShowRadioConsoleModal(true)}
              className="px-3.5 py-2 bg-transparent border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-[#151412] font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="جهاز اللاسلكي ورادار الرتل"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>جهاز اللاسلكي</span>
            </button>

            <button
              onClick={() => setShowGoogleDriveModal(true)}
              className="px-3.5 py-2 bg-transparent border border-[rgba(235,233,228,0.2)] hover:border-[#D4AF37] text-[#EBE9E4]/80 hover:text-[#D4AF37] font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              title="سحابة Google Drive لحفظ وتصدير ملفات الكراج والمسارات"
            >
              <HardDrive className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>سحابة Drive</span>
            </button>

            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="px-4 py-2 bg-[#D4AF37] hover:brightness-110 text-[#151412] font-serif font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Car className="w-4 h-4" />
              <span>إضافة سيارة</span>
            </button>
            <button
              onClick={logout}
              className="p-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Automotive Stats Strip (Tabular Figures) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-[rgba(235,233,228,0.08)]">
          <div className="p-3 bg-black/40 border border-[rgba(235,233,228,0.06)]">
            <span className="text-[11px] font-mono text-[#EBE9E4]/50 block mb-0.5">القوافل المكتملة</span>
            <span className="text-xl sm:text-2xl font-bold text-[#EBE9E4] font-mono tabular-nums">
              {currentUser.stats.tripsCompleted}
            </span>
          </div>

          <div className="p-3 bg-black/40 border border-[rgba(235,233,228,0.06)]">
            <span className="text-[11px] font-mono text-[#EBE9E4]/50 block mb-0.5">المسافة المقطوعة</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-bold text-[#10B981] font-mono tabular-nums">
                {currentUser.stats.distanceKm.toLocaleString()}
              </span>
              <span className="text-xs text-[#EBE9E4]/50 font-mono">KM</span>
            </div>
          </div>

          <div className="p-3 bg-black/40 border border-[rgba(235,233,228,0.06)]">
            <span className="text-[11px] font-mono text-[#EBE9E4]/50 block mb-0.5">المجتمعات المشترك بها</span>
            <span className="text-xl sm:text-2xl font-bold text-[#D4AF37] font-mono tabular-nums">
              {joinedCommunities.length}
            </span>
          </div>

          <div className="p-3 bg-black/40 border border-[rgba(235,233,228,0.06)]">
            <span className="text-[11px] font-mono text-[#EBE9E4]/50 block mb-0.5">نقاط السمعة والخبرة</span>
            <span className="text-xl sm:text-2xl font-bold text-[#EBE9E4] font-mono tabular-nums">
              {currentUser.stats.reputationScore}%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs within Profile */}
      <div className="flex gap-[1px] p-[2px] bg-[rgba(235,233,228,0.08)] border border-[rgba(235,233,228,0.08)] overflow-x-auto">
        <button
          onClick={() => setActiveTab('garage')}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs transition-colors cursor-pointer ${
            activeTab === 'garage'
              ? 'bg-[#D4AF37] text-[#151412] font-bold'
              : 'text-[#EBE9E4]/60 hover:text-white'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>كراج السيارات ({currentUser.garage.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('communities')}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs transition-colors cursor-pointer ${
            activeTab === 'communities'
              ? 'bg-[#D4AF37] text-[#151412] font-bold'
              : 'text-[#EBE9E4]/60 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>أنديتي ومجتمعاتي ({joinedCommunities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('trips')}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs transition-colors cursor-pointer ${
            activeTab === 'trips'
              ? 'bg-[#D4AF37] text-[#151412] font-bold'
              : 'text-[#EBE9E4]/60 hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>قوافلي المسجلة ({registeredTrips.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 font-mono text-xs transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-[#D4AF37] text-[#151412] font-bold'
              : 'text-[#EBE9E4]/60 hover:text-white'
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
            <h3 className="font-serif text-lg font-bold text-[#EBE9E4]">السيارات المسجلة بالكراج</h3>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="text-xs text-[#D4AF37] hover:underline flex items-center gap-1 font-mono uppercase"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة سيارة جديدة</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser.garage.map((veh) => (
              <div
                key={veh.id}
                className="p-5 bg-[rgba(255,255,255,0.02)] border border-[rgba(235,233,228,0.08)] hover:border-[#D4AF37] transition-all space-y-3 relative overflow-hidden"
              >
                {veh.isPrimary && (
                  <span className="absolute top-4 left-4 rtl:left-auto rtl:right-4 px-2 py-0.5 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-[10px] font-mono font-bold">
                    المركبة الأساسية
                  </span>
                )}

                <div className="flex items-start gap-3">
                  <CategoryIconBadge category={veh.category} size="md" />
                  <div>
                    <h4 className="font-serif text-lg font-bold text-[#EBE9E4]">
                      {veh.make} {veh.model}
                    </h4>
                    <p className="text-xs text-[#EBE9E4]/50 font-mono">
                      {veh.year} · {veh.trim}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#EBE9E4]/60 bg-black/40 p-2.5 border border-[rgba(235,233,228,0.06)]">
                  <div>
                    <span className="text-[10px] text-[#EBE9E4]/40 block">رقم اللوحة</span>
                    <span className="text-[#EBE9E4] font-bold">{veh.plateNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#EBE9E4]/40 block">اللون</span>
                    <span className="text-[#EBE9E4]">{veh.color}</span>
                  </div>
                </div>

                {veh.modifications && veh.modifications.length > 0 && (
                  <div>
                    <span className="text-[11px] font-mono uppercase text-[#D4AF37] block mb-1">
                      التجهيزات والتعديلات:
                    </span>
                    <ul className="space-y-1 text-xs text-[#EBE9E4]/70 list-disc list-inside font-sans">
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
          <h3 className="font-serif text-lg font-bold text-[#EBE9E4]">المجتمعات التي انضممت إليها</h3>
          {joinedCommunities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {joinedCommunities.map((c) => (
                <div
                  key={c.id}
                  className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(235,233,228,0.08)] hover:border-[#D4AF37] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <CategoryIconBadge category={c.category} size="sm" />
                    <div>
                      <h4 className="font-serif text-base font-bold text-[#EBE9E4]">{c.name}</h4>
                      <p className="text-xs text-[#EBE9E4]/50 font-mono">{c.city} · {c.membersCount} عضو</p>
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
