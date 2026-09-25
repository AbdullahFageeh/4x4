import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bell,
  Globe,
  MapPin,
  Compass,
  Users,
  User,
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
    <header className="sticky top-0 z-40 w-full h-[70px] bg-[#151412] border-b border-[rgba(235,233,228,0.08)] px-4 sm:px-8 flex items-center justify-between transition-colors">
      {/* Brand & Expedition Telemetry */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          onClick={() => setCurrentTab('explore')}
          className="focus:outline-none flex items-center"
        >
          <span className="font-serif italic text-2xl sm:text-3xl font-semibold text-[#D4AF37] tracking-tight">
            CarCom
          </span>
        </button>

        {/* Radio Pill */}
        <button
          onClick={() => setShowRadioConsoleModal(true)}
          className="bg-[#10B981] hover:brightness-110 text-[#151412] px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-tight transition-all active:scale-95 shadow-sm"
          title="جهاز لاسلكي القوافل والتخاطب الميداني"
        >
          RADIO: UHF 462.56
        </button>

        {/* Geographic Coordinates Metadata */}
        <div className="hidden lg:block font-mono text-[10px] tracking-widest text-[#EBE9E4]/50 uppercase">
          SAUDI ARABIA // 24.7136, 46.6753
        </div>
      </div>

      {/* Navigation Items (Clean Typography) */}
      <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider">
        <button
          onClick={() => setCurrentTab('communities')}
          className={`transition-colors py-1 ${
            currentTab === 'communities'
              ? 'text-[#D4AF37] font-bold border-b border-[#D4AF37]'
              : 'text-[#EBE9E4]/60 hover:text-[#EBE9E4]'
          }`}
        >
          المجتمعات
        </button>

        <button
          onClick={() => setCurrentTab('trips')}
          className={`transition-colors py-1 ${
            currentTab === 'trips'
              ? 'text-[#D4AF37] font-bold border-b border-[#D4AF37]'
              : 'text-[#EBE9E4]/60 hover:text-[#EBE9E4]'
          }`}
        >
          الرحلات
        </button>

        <button
          onClick={() => setCurrentTab('explore')}
          className={`transition-colors py-1 ${
            currentTab === 'explore'
              ? 'text-[#D4AF37] font-bold border-b border-[#D4AF37]'
              : 'text-[#EBE9E4]/60 hover:text-[#EBE9E4]'
          }`}
        >
          الخريطة (onX)
        </button>
      </nav>

      {/* Right Controls & Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* City selector */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.08)] text-[11px] font-mono text-[#EBE9E4]/70">
          <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-transparent border-none text-[11px] text-[#EBE9E4] focus:outline-none cursor-pointer"
          >
            {cities.map((c) => (
              <option key={c} value={c} className="bg-[#151412] text-[#EBE9E4]">
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Driver Guide (btn-action) */}
        <button
          onClick={() => setShowOnboardingModal(true)}
          className="hidden sm:flex items-center gap-1.5 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#151412] px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-all duration-200"
          title="دليل السائق التفاعلي لتخصيص الكراج والنداء"
        >
          <Sparkles className="w-3 h-3 text-inherit" />
          <span>دليل السائق</span>
        </button>

        {/* Google Drive (btn-action) */}
        <button
          onClick={() => setShowGoogleDriveModal(true)}
          className="hidden md:flex items-center gap-1.5 bg-transparent border border-[rgba(235,233,228,0.2)] hover:border-[#D4AF37] text-[#EBE9E4]/80 hover:text-[#D4AF37] px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-all duration-200"
          title="سحابة Google Drive لحفظ ومزامنة المسارات"
        >
          <HardDrive className="w-3 h-3 text-inherit" />
          <span>Google Drive</span>
        </button>

        {/* Notifications */}
        {isAuthenticated && (
          <button
            onClick={() => setShowNotificationsDrawer(true)}
            className="relative p-2 rounded bg-[rgba(255,255,255,0.03)] border border-[rgba(235,233,228,0.08)] text-[#EBE9E4]/80 hover:text-white transition-colors"
            title="التنبيهات"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D4AF37] text-[9px] font-bold text-[#151412] flex items-center justify-center">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        )}

        {/* Profile / Gold Login Button */}
        {isAuthenticated ? (
          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 transition-all border ${
              currentTab === 'profile'
                ? 'bg-[#D4AF37] text-[#151412] border-[#D4AF37] font-semibold'
                : 'bg-[rgba(255,255,255,0.03)] border-[rgba(235,233,228,0.08)] text-[#EBE9E4] hover:border-[#D4AF37]'
            }`}
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#D4AF37]">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="hidden sm:inline font-mono text-xs max-w-[90px] truncate">
              {currentUser.name}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-[#D4AF37] hover:brightness-110 text-[#151412] px-5 py-2 font-serif font-bold text-sm tracking-wide transition-all shadow-md active:scale-95"
          >
            دخول
          </button>
        )}
      </div>
    </header>
  );
};
