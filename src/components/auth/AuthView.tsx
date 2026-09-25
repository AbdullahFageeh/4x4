import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { googleSignIn, setCachedAccessToken } from '../../services/googleAuthService';
import {
  Phone,
  Lock,
  Eye,
  EyeOff,
  Zap,
  ShieldCheck,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  HardDrive,
} from 'lucide-react';

interface AuthViewProps {
  isModal?: boolean;
  onClose?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ isModal = false, onClose }) => {
  const { loginWithDemo, loginWithCredentials, dir, setShowAuthModal } = useApp();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [phone, setPhone] = useState<string>('501234567');
  const [password, setPassword] = useState<string>('carcom2026');
  const [name, setName] = useState<string>('');
  const [carModel, setCarModel] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const isRtl = dir === 'rtl';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!phone || phone.trim().length < 8) {
      setErrorMessage(
        isRtl
          ? 'يرجى إدخال رقم هاتف سعودي صحيح يبدأ بـ 5 (مثال: 501234567)'
          : 'Please enter a valid Saudi phone number starting with 5'
      );
      return;
    }

    if (!password || password.length < 4) {
      setErrorMessage(
        isRtl
          ? 'كلمة المرور يجب أن تكون 4 خانات على الأقل'
          : 'Password must be at least 4 characters'
      );
      return;
    }

    setIsLoading(true);

    try {
      // Simulate real auth network latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      const success = await loginWithCredentials(phone, password);
      if (!success) {
        setErrorMessage(
          isRtl ? 'بيانات الدخول غير صحيحة، يرجى المحاولة ثانية' : 'Invalid credentials'
        );
      } else {
        if (onClose) onClose();
      }
    } catch {
      setErrorMessage(
        isRtl ? 'حدث خطأ في الاتصال بالخادم' : 'Server connection error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithDemo();
      setIsLoading(false);
      if (onClose) onClose();
    }, 400);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await googleSignIn();
      if (res?.accessToken) {
        setCachedAccessToken(res.accessToken);
        loginWithDemo(); // Initialize user session in the app
        if (onClose) onClose();
      }
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setErrorMessage(
        isRtl
          ? 'تعذر تسجيل الدخول بحساب Google. يرجى التأكد من الموافقة على الصلاحيات المطلوبة.'
          : 'Google sign-in failed. Please grant required permissions.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const content = (
    <div className="w-full max-w-md mx-auto p-6 sm:p-8 rounded-2xl bg-[#0e131b] border border-white/10 shadow-2xl relative overflow-hidden">
      {/* Ambient gradient */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500" />
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Close button if in modal */}
      {isModal && onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-[1.5px] shadow-lg shadow-emerald-950/50">
          <div className="w-full h-full bg-[#0d1219] rounded-[10px] flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-3.6a1 1 0 00-.8-.4H5.24a2 2 0 00-1.8 1.1L2 12v4h3m14 0a2 2 0 100-4 2 2 0 000 4zm-14 0a2 2 0 100-4 2 2 0 000 4z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          {mode === 'signin' ? 'تسجيل الدخول إلى CarCom' : 'إنشاء حساب سائق جديد'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {mode === 'signin'
            ? 'بوابة مجتمع السيارات ومسارات المملكة'
            : 'انضم لمجتمع ملاك وهواة السيارات في السعودية'}
        </p>
      </div>

      {/* Mode Toggle Tabs */}
      <div className="flex p-1 mb-5 bg-[#141b24] rounded-xl border border-white/5">
        <button
          type="button"
          onClick={() => {
            setMode('signin');
            setErrorMessage('');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            mode === 'signin'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          تسجيل الدخول
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('signup');
            setErrorMessage('');
          }}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            mode === 'signup'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          حساب جديد
        </button>
      </div>

      {/* Demo Mode Highlight Banner */}
      <div className="mb-5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-bold block">دخول سريع بدون بيانات (Demo Mode)</span>
              <span className="text-[11px] text-amber-200/80">
                استكشف التطبيق فوراً بهوية "سعود العتيبي"
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoClick}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md active:scale-95 shrink-0"
          >
            {isLoading ? 'جاري الدخول...' : 'دخول فوري'}
          </button>
        </div>
      </div>

      {/* Google Sign In Button */}
      <div className="mb-5">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-3 active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
          </svg>
          <span>المتابعة باستخدام حساب Google (مع تفعيل Drive)</span>
        </button>

        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-white/10" />
          <span className="flex-shrink mx-3 text-[11px] text-slate-500 font-mono">أو برقم الهاتف</span>
          <div className="flex-grow border-t border-white/10" />
        </div>
      </div>

      {/* Error Message if any */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              الاسم الكامل
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="مثال: سلطان القحطاني"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        )}

        {/* Saudi Phone Input */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            رقم الجوال
          </label>
          <div className="relative flex items-center" dir="ltr">
            <span className="absolute left-3 flex items-center gap-1 text-xs font-semibold text-slate-400 font-mono select-none">
              <span>🇸🇦</span>
              <span>+966</span>
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="50 123 4567"
              className="w-full pl-20 pr-3.5 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            أدخل رقم الهاتف المكون من 9 أرقام بدون الصفر
          </span>
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-medium text-slate-300">كلمة المرور</label>
            {mode === 'signin' && (
              <button
                type="button"
                onClick={() => alert('في الوضع التجريبي يمكنك استخدام الرمز الافتراضي أو الضغط على زر الدخول التجريبي.')}
                className="text-[11px] text-emerald-400 hover:underline"
              >
                نسيت كلمة المرور؟
              </button>
            )}
          </div>
          <div className="relative flex items-center">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute left-3 rtl:left-3 rtl:right-auto p-1 text-slate-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {mode === 'signup' && (
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              مركبتك الأساسية (اختياري)
            </label>
            <input
              type="text"
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              placeholder="مثال: لاندكروزر GR أو بورشه 911"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b24] border border-white/10 text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full min-h-[46px] mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{mode === 'signin' ? 'تسجيل الدخول' : 'إتمام التسجيل'}</span>
              <ShieldCheck className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer text */}
      <div className="mt-6 pt-4 border-t border-white/5 text-center">
        <p className="text-[11px] text-slate-400">
          بالتسجيل فإنك توافق على ميثاق سلامة الطرق وقواعد قوافل CarCom
        </p>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090c10] flex items-center justify-center p-4">
      {content}
    </div>
  );
};
