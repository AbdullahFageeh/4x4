import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Globe,
  MapPin,
  Compass,
  Users,
  User,
  ShieldCheck,
  Zap,
  Radio,
  Sparkles,
  HardDrive,
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const {
    language,
    setLanguage,
    currentUser,
    isAuthenticated,
    isDemoMode,
    currentTab,
    setCurrentTab,
    setShowAuthModal,
    selectedCity,
    setSelectedCity,
    unreadNotificationsCount,
    setShowNotificationsDrawer,
    setShowOnboardingModal,
    setShowRadioConsoleModal,
    setShowGoogleDriveModal,
  } = useApp();

  const cities = ['الرياض', 'جدة', 'الخبر', 'أبها', 'الدرعية'];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0c1017]/90 backdrop-blur-md border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentTab('communities')}
            className="flex items-center gap-2.5 text-left rtl:text-right group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-[1.5px] shadow-lg shadow-emerald-950/40">
              <div className="w-full h-full bg-[#0d121a] rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400 group-hover:scale-105 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1L2 12v4h3m14 0a2 2 0 100-4 2 2 0 000 4zm-14 0a2 2 0 100-4 2 2 0 000 4z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5 font-sans">
                CarCom
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  سعودي
                </span>
              </span>
            </div>
          </button>

          {/* Interactive Fast Action: Onboarding Guided Tour */}
          <button
            onClick={() => setShowOnboardingModal(true)}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-amber-500/20 hover:from-amber-500/20 hover:to-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-sm transition-all"
            title="فتح دليل السائق التفاعلي لتخصيص الكراج والنداء"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>دليل السائق التفاعلي</span>
          </button>

          {/* Interactive Fast Action: Walkie-Talkie Console */}
          <button
            onClick={() => setShowRadioConsoleModal(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono transition-all"
            title="جهاز لاسلكي القوافل والتخاطب الميداني"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>رادار اللاسلكي: UHF 462.56</span>
          </button>

          {/* Interactive Fast Action: Google Drive Storage */}
          <button
            onClick={() => setShowGoogleDriveModal(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs font-semibold transition-all"
            title="سحابة Google Drive لحفظ ومزامنة المسارات والقوافل وبطاقة السائق"
          >
            <HardDrive className="w-3.5 h-3.5 text-blue-400" />
            <span>Google Drive</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop 1440px) */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => setCurrentTab('communities')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              currentTab === 'communities'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>المجتمعات</span>
          </button>

          <button
            onClick={() => setCurrentTab('trips')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              currentTab === 'trips'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>الرحلات والمسارات</span>
          </button>

          <button
            onClick={() => setCurrentTab('explore')}
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              currentTab === 'explore'
                ? 'bg-white/10 text-white shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <MapPin className="w-4 h-4 text-sky-400" />
            <span>الخريطة الحية</span>
          </button>
        </nav>

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* City selector */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#141b25] border border-white/5 text-xs text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              {cities.map((c) => (
                <option key={c} value={c} className="bg-[#141b25] text-slate-200">
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#141b25] hover:bg-[#1a2330] border border-white/5 text-xs text-slate-300 transition-colors"
            title="تبديل اللغة / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-sans font-semibold uppercase">{language === 'ar' ? 'EN' : 'عربي'}</span>
          </button>

          {/* Notifications Button */}
          {isAuthenticated && (
            <button
              onClick={() => setShowNotificationsDrawer(true)}
              className="relative p-2 rounded-lg bg-[#141b25] hover:bg-[#1a2330] border border-white/5 text-slate-300 transition-colors"
              title="التنبيهات"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 rtl:-left-1 rtl:right-auto w-4 h-4 rounded-full bg-amber-500 text-[10px] font-bold text-black flex items-center justify-center shadow">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          )}

          {/* Profile / Auth Button */}
          {isAuthenticated ? (
            <button
              onClick={() => setCurrentTab('profile')}
              className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg transition-all border ${
                currentTab === 'profile'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                  : 'bg-[#141b25] border-white/5 text-slate-200 hover:bg-[#1a2330]'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-amber-600 p-[1.5px] shrink-0">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="hidden sm:inline text-xs font-medium max-w-[100px] truncate">
                {currentUser.name}
              </span>
            </button>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950/50 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>تسجيل الدخول</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
