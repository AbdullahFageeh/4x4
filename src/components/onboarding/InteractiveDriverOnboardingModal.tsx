import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VehicleCategory } from '../../types';
import {
  Compass,
  Radio,
  MapPin,
  Car,
  Shield,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  Flame,
  Award,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';

interface InteractiveDriverOnboardingModalProps {
  onClose?: () => void;
  isInitialFlow?: boolean;
}

export const InteractiveDriverOnboardingModal: React.FC<InteractiveDriverOnboardingModalProps> = ({
  onClose,
  isInitialFlow = false,
}) => {
  const { completeDriverOnboarding, dir, selectedCity, currentUser } = useApp();
  const isRtl = dir === 'rtl';

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Identity & Callsign
  const [driverName, setDriverName] = useState<string>(currentUser.name || 'سعود العتيبي');
  const [callsign, setCallsign] = useState<string>(currentUser.callsign || 'صقر طويق 1');
  const [homeCity, setHomeCity] = useState<string>(selectedCity || 'الرياض');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  );

  // Step 2: Rig & Garage
  const [vehicleCat, setVehicleCat] = useState<VehicleCategory>('overland');
  const [vehicleModel, setVehicleModel] = useState<string>('Land Cruiser 300 GR-Sport');
  const [vehicleYear, setVehicleYear] = useState<number>(2024);
  const [hasRadio, setHasRadio] = useState<boolean>(true);
  const [hasRecoveryKit, setHasRecoveryKit] = useState<boolean>(true);
  const [hasDeflator, setHasDeflator] = useState<boolean>(true);

  // Step 3: Preferred Terrains
  const [selectedTerrains, setSelectedTerrains] = useState<string[]>([
    'sand_dunes',
    'mountain_pass',
  ]);

  const avatarOptions = [
    {
      id: 'av_1',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      title: 'كابتن رتل أوف رود',
    },
    {
      id: 'av_2',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      title: 'سائق حلبات وتراك',
    },
    {
      id: 'av_3',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      title: 'خبير كروز وسوبركار',
    },
    {
      id: 'av_4',
      url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
      title: 'مهتم كلاسيك وتراث',
    },
  ];

  const callsignPresets = [
    'صقر طويق 1',
    'ذئب النفود',
    'رماح الدهناء',
    'فالكون الرياض',
    'نسيم الساحل',
    'شاهين عسير',
  ];

  const cityOptions = [
    { id: 'الرياض', name: 'الرياض', region: 'منطقة نجد وطويق', activeClubs: '54 نادي' },
    { id: 'جدة', name: 'جدة', region: 'الساحل الغربي وأبحر', activeClubs: '38 نادي' },
    { id: 'الخبر', name: 'الخبر والدمام', region: 'شاطئ نصف القمر والشرقية', activeClubs: '29 نادي' },
    { id: 'أبها', name: 'أبها وعسير', region: 'عقبة الصماء والسودة', activeClubs: '18 نادي' },
  ];

  const categoryPresets: {
    id: VehicleCategory;
    title: string;
    desc: string;
    defaultModel: string;
    icon: string;
  }[] = [
    {
      id: 'overland',
      title: 'دفع رباعي وأوف رود (4x4)',
      desc: 'صعود كثبان رملية، زحف صخري، ومبيت وتخييم بري',
      defaultModel: 'Land Cruiser 300 GR-Sport',
      icon: '🚙',
    },
    {
      id: 'supercars',
      title: 'سوبركار وسيارات رياضية',
      desc: 'طرق سريعة، جولات ساحلية، وحلبات سباق وتراك داي',
      defaultModel: 'Porsche 911 GT3 RS',
      icon: '🏎️',
    },
    {
      id: 'classic',
      title: 'سيارات كلاسيكية وتراثية',
      desc: 'استعراض سيارات نادرة، معارض تراثية، ومواكب شرفية',
      defaultModel: 'Mercedes-Benz 280SL Pagoda 1969',
      icon: '🚘',
    },
    {
      id: 'tuner',
      title: 'دريفت وتعديل ميكانيكي',
      desc: 'تجهيزات هيدروليكية، حلبات انزلاق، ومحركات معدلة',
      defaultModel: 'Nissan 370Z Nismo Drift Spec',
      icon: '⚡',
    },
  ];

  const terrainOptions = [
    {
      id: 'sand_dunes',
      title: 'طعوس الرمال الحمراء ونفود الثمامة',
      tag: 'كثبان ذهبية وتحديات صعود',
      icon: '🏜️',
    },
    {
      id: 'mountain_pass',
      title: 'حافة العالم وعقبات جبال طويق',
      tag: 'شواهق صخرية ومسارات وعرة',
      icon: '⛰️',
    },
    {
      id: 'coastal_sunset',
      title: 'كورنيش جدة وشواطئ أبحر',
      tag: 'كروز مسائي سلس وأجواء بحرية',
      icon: '🌊',
    },
    {
      id: 'cloud_ridges',
      title: 'عقبة الصماء وضفاف السودة',
      tag: 'منحدرات حادة وأجواء ضبابية باردة',
      icon: '☁️',
    },
  ];

  const toggleTerrain = (id: string) => {
    if (selectedTerrains.includes(id)) {
      if (selectedTerrains.length > 1) {
        setSelectedTerrains(selectedTerrains.filter((t) => t !== id));
      }
    } else {
      setSelectedTerrains([...selectedTerrains, id]);
    }
  };

  const handleFinish = () => {
    completeDriverOnboarding({
      name: driverName.trim() || 'كابتن مسار',
      city: homeCity,
      callsign: callsign.trim() || 'صقر طويق 1',
      avatar: selectedAvatar,
      vehicle: {
        make: vehicleModel.split(' ')[0] || 'Toyota',
        model: vehicleModel,
        year: vehicleYear,
        category: vehicleCat,
        plateNumber: 'ط و ي 1 9 8 5',
        color: 'رمادي تيتانيوم',
        isPrimary: true,
        modifications: [
          hasRadio ? 'جهاز لاسلكي UHF 462 MHz' : '',
          hasRecoveryKit ? 'ونش سحب + ألواح استعادة' : '',
          hasDeflator ? 'ضاغط هواء وتنسيم إطارات' : '',
        ].filter(Boolean),
      },
    });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0b0f16] border border-white/10 shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-amber-500/10 via-emerald-500/5 to-transparent pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="relative z-10 px-6 pt-5 pb-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 p-[1.5px]">
              <div className="w-full h-full bg-[#0b0f16] rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                دليل السائق التفاعلي وتجهيز الرتل
              </h2>
              <p className="text-xs text-slate-400">
                خصص ملف رائد المسار، نداء اللاسلكي، وكراجك المعتمد
              </p>
            </div>
          </div>

          {onClose && !isInitialFlow && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Stepper Progress Bar */}
        <div className="relative z-10 px-6 py-3 bg-[#080b10] border-b border-white/5 flex items-center justify-between text-xs">
          {[
            { step: 1, label: 'الهوية والنداء' },
            { step: 2, label: 'المركبة والكراج' },
            { step: 3, label: 'رادار المسارات' },
            { step: 4, label: 'رخصة رائد المسار' },
          ].map((item) => (
            <button
              key={item.step}
              onClick={() => setCurrentStep(item.step)}
              className={`flex items-center gap-1.5 transition-colors ${
                currentStep === item.step
                  ? 'text-amber-400 font-bold'
                  : currentStep > item.step
                  ? 'text-emerald-400'
                  : 'text-slate-500'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono border ${
                  currentStep === item.step
                    ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                    : currentStep > item.step
                    ? 'border-emerald-400 bg-emerald-400/20 text-emerald-300'
                    : 'border-white/10 bg-white/5 text-slate-500'
                }`}
              >
                {currentStep > item.step ? '✓' : item.step}
              </span>
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Step Content */}
        <div className="relative z-10 p-5 sm:p-7 overflow-y-auto max-h-[68vh] space-y-5">
          {/* STEP 1: Driver Identity & Radio Callsign */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm font-bold text-white">1. حدد هويتك ونداء الراديو الرسمي</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  النداء اللاسلكي يُستخدم للتخاطب أثناء القوافل وعبر قنوات الـ UHF
                </p>
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  اختر صورة الهوية
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {avatarOptions.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatar(av.url)}
                      className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all p-0.5 ${
                        selectedAvatar === av.url
                          ? 'border-amber-400 ring-2 ring-amber-400/30'
                          : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt={av.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover rounded-xl"
                      />
                      {selectedAvatar === av.url && (
                        <div className="absolute top-1 right-1 rtl:right-auto rtl:left-1 w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name & Callsign Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    اسم السائق
                  </label>
                  <input
                    type="text"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b10] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="مثال: سعود العتيبي"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>نداء اللاسلكي (Callsign)</span>
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                  </label>
                  <input
                    type="text"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b10] border border-white/10 text-amber-300 font-mono text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition-colors"
                    placeholder="مثال: صقر طويق 1"
                  />
                </div>
              </div>

              {/* Callsign Quick Presets */}
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-mono">
                  نداءات مقترحة سريعة:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {callsignPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCallsign(preset)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors border ${
                        callsign === preset
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                          : 'bg-white/5 text-slate-400 hover:text-white border-white/5'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  المدينة الرئيسية (نقطة الانطلاق)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {cityOptions.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setHomeCity(c.id)}
                      className={`p-3 rounded-xl border text-right rtl:text-right transition-all flex flex-col justify-between h-20 ${
                        homeCity === c.id
                          ? 'bg-amber-500/10 border-amber-400 text-white shadow-lg'
                          : 'bg-[#070b10] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{c.name}</span>
                        <MapPin className={`w-3.5 h-3.5 ${homeCity === c.id ? 'text-amber-400' : 'text-slate-600'}`} />
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">{c.activeClubs}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Rig & Vehicle Discipline */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm font-bold text-white">2. تجهيزات الكراج والمركبة</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  حدد تخصص مركبتك ومعدات السلامة الخاصة بالرتل
                </p>
              </div>

              {/* Vehicle Category Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categoryPresets.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setVehicleCat(cat.id);
                      setVehicleModel(cat.defaultModel);
                    }}
                    className={`p-3.5 rounded-2xl border text-right rtl:text-right transition-all flex items-start gap-3 ${
                      vehicleCat === cat.id
                        ? 'bg-emerald-500/10 border-emerald-400 text-white shadow-lg ring-1 ring-emerald-500/20'
                        : 'bg-[#070b10] border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-2xl p-2 rounded-xl bg-white/5 shrink-0">{cat.icon}</span>
                    <div className="flex-1">
                      <div className="font-bold text-xs text-white">{cat.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{cat.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Model & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    طراز المركبة
                  </label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b10] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                    placeholder="مثال: Land Cruiser 300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    سنة الصنع
                  </label>
                  <input
                    type="number"
                    value={vehicleYear}
                    onChange={(e) => setVehicleYear(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070b10] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Convoy Rig Readiness Checklist */}
              <div>
                <span className="block text-xs font-semibold text-slate-300 mb-2 font-mono">
                  تجهيزات السلامة والرتل الميدانية:
                </span>
                <div className="space-y-2">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#070b10] border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Radio className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="text-xs font-semibold text-white block">جهاز اتصال لاسلكي VHF / UHF</span>
                        <span className="text-[10px] text-slate-400">للتواصل مع مارشال الرتل على تردد 462 MHz</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={hasRadio}
                      onChange={(e) => setHasRadio(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#070b10] border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-xs font-semibold text-white block">معدات إنقاذ وألواح رملية ونش سحب</span>
                        <span className="text-[10px] text-slate-400">ضرورية لمسارات التحدي الصحراوي والجبال</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={hasRecoveryKit}
                      onChange={(e) => setHasRecoveryKit(e.target.checked)}
                      className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-[#070b10] border border-white/10 cursor-pointer hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <Zap className="w-4 h-4 text-sky-400" />
                      <div>
                        <span className="text-xs font-semibold text-white block">ضاغط هواء ومقياس تنسيم إطارات</span>
                        <span className="text-[10px] text-slate-400">لضبط الضغط بين 12-14 PSI على الرمال</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={hasDeflator}
                      onChange={(e) => setHasDeflator(e.target.checked)}
                      className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Preferred Terrains & Radar */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div>
                <h3 className="text-sm font-bold text-white">3. رادار المسارات والتضاريس المفضلة</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  اختر المسارات التي ترغب في استلام إشعارات القوافل الحية بخصوصها
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {terrainOptions.map((terrain) => {
                  const isSelected = selectedTerrains.includes(terrain.id);
                  return (
                    <button
                      key={terrain.id}
                      type="button"
                      onClick={() => toggleTerrain(terrain.id)}
                      className={`p-4 rounded-2xl border text-right rtl:text-right transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-400 text-white shadow-lg'
                          : 'bg-[#070b10] border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{terrain.icon}</span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            isSelected ? 'bg-amber-400 text-black' : 'border border-white/20'
                          }`}
                        >
                          {isSelected && '✓'}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{terrain.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{terrain.tag}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>
                  ستحصل على إشعارات مخصصة عند انطلاق أي قافلة تطابق تفضيلاتك في منطقة {homeCity}.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: Official Saudi Trailblazer ID Card Issued */}
          {currentStep === 4 && (
            <div className="space-y-6 text-center animate-in fade-in duration-150">
              <div className="space-y-1">
                <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">
                  ★ تم اعتماد رخصة السائق ★
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white">
                  بطاقة عضوية رائد مسار CarCom الرسمية
                </h3>
                <p className="text-xs text-slate-400">
                  ملفك معتمد وموثق الآن في شبكة قوافل المملكة
                </p>
              </div>

              {/* Bespoke Holographic Driver Card */}
              <div className="relative mx-auto max-w-md rounded-2xl bg-gradient-to-br from-[#121824] via-[#0d121c] to-[#080b10] border border-amber-500/40 p-5 shadow-2xl text-right rtl:text-right overflow-hidden group">
                {/* Decorative Metallic Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-white block">رابطة قوافل CarCom المملكة</span>
                      <span className="text-[9px] text-amber-300 font-mono">SAUDI TRAILBLAZER LICENSE</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded bg-emerald-500/10">
                    رقم: SA-2026-CR09
                  </span>
                </div>

                {/* Card Body */}
                <div className="py-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-amber-500/40 shrink-0">
                    <img
                      src={selectedAvatar}
                      alt={driverName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h4 className="text-base font-bold text-white">{driverName}</h4>
                    <div className="text-xs text-amber-400 font-mono flex items-center gap-1.5">
                      <Radio className="w-3.5 h-3.5" />
                      <span>النداء: {callsign}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center gap-1">
                      <Car className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{vehicleModel} ({vehicleYear})</span>
                    </div>
                  </div>
                </div>

                {/* Card Footer Telemetry */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>المركز: {homeCity}</span>
                  <span className="text-emerald-400">قناة الطوارئ: UHF 462.5625 MHz</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Controls */}
        <div className="relative z-10 px-6 py-4 bg-[#080b10] border-t border-white/5 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span>السابق</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 active:scale-95"
            >
              <span>متابعة</span>
              {isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2 shadow-xl shadow-emerald-950/60 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>انطلق إلى قمرة القيادة والمسارات</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
