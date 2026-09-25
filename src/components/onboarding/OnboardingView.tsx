import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HeroAutomotiveBanner } from '../common/AutomotiveArt';
import { InteractiveDriverOnboardingModal } from './InteractiveDriverOnboardingModal';
import {
  Compass,
  Users,
  ShieldCheck,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Globe,
  Zap,
  Sparkles,
} from 'lucide-react';

export const OnboardingView: React.FC = () => {
  const {
    language,
    setLanguage,
    dir,
    setHasCompletedOnboarding,
    setShowAuthModal,
    loginWithDemo,
  } = useApp();

  const [showInteractiveModal, setShowInteractiveModal] = useState<boolean>(false);
  const isRtl = dir === 'rtl';

  return (
    <div className="min-h-screen bg-[#090c10] text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {showInteractiveModal && (
        <InteractiveDriverOnboardingModal
          isInitialFlow
          onClose={() => setShowInteractiveModal(false)}
        />
      )}
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Header with Brand & Language Toggle */}
      <header className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-amber-500 to-emerald-400 p-[1.5px] shadow-lg shadow-emerald-950/50">
            <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1L2 12v4h3m14 0a2 2 0 100-4 2 2 0 000 4zm-14 0a2 2 0 100-4 2 2 0 000 4z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white font-sans flex items-center gap-1.5">
              CarCom
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                المملكة
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">مجتمع السيارات السعودي الأول</p>
          </div>
        </div>

        <button
          onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-sans font-medium uppercase">{language === 'ar' ? 'English' : 'العربية'}</span>
        </button>
      </header>

      {/* Main Content Hero */}
      <main className="relative z-10 max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 flex-1 flex flex-col justify-center">
        {/* Automotive Visual Hero */}
        <div className="mb-6 shadow-2xl shadow-black/80">
          <HeroAutomotiveBanner />
        </div>

        {/* Value Proposition */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>أكثر من 120 مجتمع و 450 قافلة مرخصة عبر المملكة</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            عشاق السيارات في السعودية..{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-amber-300 to-amber-500">
              في مكان واحد
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            انضم إلى أندية سياراتك المفضلة، نظّم مسارات الأوف رود والجبال، وشارك لحظات الكروز مع مجتمع شغوف يشاركك حب المحركات.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 max-w-3xl mx-auto w-full">
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">تجمعات وأندية متخصصة</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                من ملاك الدفع الرباعي والطعوس إلى السوبركار والكلاسيك.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">قوافل ومسارات موثقة</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                قنوات لاسلكية، نقاط تجمع، وبروفايلات الارتفاع الجبلي.
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white">كراجك وسمعتك كرائد مسار</h3>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                استعرض تعديلات مركبتك واكتسب رتبة كابتن مسار معتمد.
              </p>
            </div>
          </div>
        </div>

        {/* Actions / Primary CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 max-w-lg mx-auto w-full">
          {/* Main Interactive Onboarding Wizard CTA */}
          <button
            onClick={() => setShowInteractiveModal(true)}
            className="w-full sm:w-auto flex-1 min-h-[48px] px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-black font-extrabold text-sm shadow-xl shadow-amber-950/40 transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-black animate-pulse" />
            <span>دليل السائق التفاعلي (تهيئة الرتل)</span>
            {isRtl ? (
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-black" />
            ) : (
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-black" />
            )}
          </button>

          {/* Obvious Demo Mode Button */}
          <button
            onClick={loginWithDemo}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-xl bg-[#141b24] hover:bg-[#1a2330] border border-white/10 hover:border-amber-500/40 text-slate-200 hover:text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>دخول سريع (Demo Mode)</span>
          </button>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 py-4 text-center text-xs text-slate-400 border-t border-white/5">
        <p>كار كوم المملكة العربية السعودية · مجتمع المحركات والمسارات البرية 2026</p>
      </footer>
    </div>
  );
};
