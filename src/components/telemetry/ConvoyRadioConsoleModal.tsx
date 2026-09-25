import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Radio,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Signal,
  Wind,
  Compass,
  AlertTriangle,
  X,
  Play,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';

interface RadioChannel {
  id: number;
  freq: string;
  name: string;
  region: string;
  activeDrivers: number;
  marshal: string;
  currentStatus: string;
}

const RADIO_CHANNELS: RadioChannel[] = [
  {
    id: 1,
    freq: '462.5625 MHz',
    name: 'قناة طويق الرئيسية (الرتل 1)',
    region: 'الرياض · جبل فهرين',
    activeDrivers: 24,
    marshal: 'مارشال النسر (أبو فهد)',
    currentStatus: 'الرتل متوقف عند نقطة التجمع الثانية، جاهزون لصعود الحافة الصخرية',
  },
  {
    id: 2,
    freq: '462.5875 MHz',
    name: 'دعم نفود الثمامة والرمال الحمراء',
    region: 'الرياض · طعوس الدهناء',
    activeDrivers: 48,
    marshal: 'كابتن ذئب الصحراء',
    currentStatus: 'انتبهوا لقصة الكثيب الغربي، يرجى التنسيم إلى 12 PSI قبل الصعود',
  },
  {
    id: 3,
    freq: '467.6375 MHz',
    name: 'كروز كورنيش جدة وسوبركار',
    region: 'جدة · نادي اليخوت وأبحر',
    activeDrivers: 32,
    marshal: 'كروز ليدر (عمر)',
    currentStatus: 'المسار الأسفلتي سالك بسرعة 80 كم/س بمحاذاة الشاطئ',
  },
  {
    id: 4,
    freq: '462.6125 MHz',
    name: 'طوارئ عقبة الصماء وعسير',
    region: 'أبها · السودة',
    activeDrivers: 14,
    marshal: 'دعم عسير الجبلي',
    currentStatus: 'ضباب كثيف مع انخفاض الرؤية إلى 50 متراً، شغلو الأنوار التحذيرية',
  },
];

export const ConvoyRadioConsoleModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { currentUser, selectedCity } = useApp();
  const [selectedChannel, setSelectedChannel] = useState<RadioChannel>(RADIO_CHANNELS[0]);
  const [isPushToTalk, setIsPushToTalk] = useState<boolean>(false);
  const [squelchEnabled, setSquelchEnabled] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(85);
  const [transmissions, setTransmissions] = useState<
    { id: string; time: string; sender: string; text: string; isUser?: boolean }[]
  >([
    {
      id: 'tx_01',
      time: '19:42',
      sender: 'مارشال النسر [CH-01]',
      text: 'نداء لجميع السائقين: الالتزام بمسافة أمان لا تقل عن 20 متراً في المنحدرات.',
    },
    {
      id: 'tx_02',
      time: '19:46',
      sender: 'ذئب النفود [CH-01]',
      text: 'تم الاستلام كابتن.. سيارة المقدمة وصلت نقطة الحماية.',
    },
  ]);

  const handlePushToTalkRelease = () => {
    if (!isPushToTalk) return;
    setIsPushToTalk(false);

    // Add user's transmitted message to log
    const now = new Date();
    const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newTx = {
      id: `tx_${Date.now()}`,
      time: timeStr,
      sender: `${currentUser.callsign || currentUser.name} [أنت]`,
      text: 'تم تأكيد التواجد على التردد، الرتل في وضع الاستعداد التام.',
      isUser: true,
    };
    setTransmissions((prev) => [newTx, ...prev]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#090d14] border border-amber-500/30 shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#0e141f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  وحدة اللاسلكي ورادار الرتل (UHF Transceiver)
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  متصل ومفعل
                </span>
              </div>
              <p className="text-xs text-slate-400">
                قناة التخاطب المباشرة بين مركبات القافلة والمارشال الميداني
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital LED Frequency Cockpit Display */}
        <div className="p-6 bg-gradient-to-b from-[#06090f] to-[#0a0e17] border-b border-white/5">
          <div className="rounded-2xl bg-[#03060a] border border-amber-500/30 p-5 shadow-inner relative overflow-hidden">
            {/* Scanlines visual */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-amber-400/80">
                  <Signal className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>CH-0{selectedChannel.id} · UHF BAND · SQUELCH {squelchEnabled ? 'ON' : 'OFF'}</span>
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-extrabold text-amber-400 tracking-wider mt-1 drop-shadow-[0_0_12px_rgba(245,158,11,0.4)]">
                  {selectedChannel.freq}
                </div>
                <div className="text-xs text-slate-300 font-semibold mt-1">
                  {selectedChannel.name} · <span className="text-slate-400">{selectedChannel.region}</span>
                </div>
              </div>

              {/* Live Signal Gauge & Squelch Toggle */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 border-white/10 pt-2 sm:pt-0">
                <div className="text-right rtl:text-right">
                  <span className="text-[10px] font-mono text-slate-400 block">مارشال القناة:</span>
                  <span className="text-xs font-bold text-white">{selectedChannel.marshal}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>{selectedChannel.activeDrivers} سائق يستمع الآن</span>
                </div>
              </div>
            </div>

            {/* Current Marshal Transmission Ticker */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-start gap-2 text-xs text-amber-200/90 font-mono">
              <span className="shrink-0 text-amber-400">📻 البث الأخير:</span>
              <span className="italic leading-relaxed">{selectedChannel.currentStatus}</span>
            </div>
          </div>
        </div>

        {/* Channel Switcher Tabs */}
        <div className="px-6 py-3 bg-[#0d131e] border-b border-white/5 flex items-center gap-2 overflow-x-auto">
          {RADIO_CHANNELS.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setSelectedChannel(ch)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap flex items-center gap-1.5 ${
                selectedChannel.id === ch.id
                  ? 'bg-amber-500 text-black font-bold shadow'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>CH-0{ch.id}</span>
              <span className="text-[10px] opacity-80">({ch.name.split(' ')[1]})</span>
            </button>
          ))}
        </div>

        {/* Transmission Feed & Push-To-Talk Control Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Transmission History */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>سجل التخاطب اللاسلكي</span>
              <span className="text-emerald-400 text-[10px]">مباشر</span>
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {transmissions.map((tx) => (
                <div
                  key={tx.id}
                  className={`p-3 rounded-xl border text-xs leading-relaxed ${
                    tx.isUser
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-white/5 border-white/5 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] font-mono text-slate-400">
                    <span className="font-bold text-amber-400">{tx.sender}</span>
                    <span>{tx.time}</span>
                  </div>
                  <p>{tx.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Push-To-Talk (PTT) Button & Volume Controls */}
          <div className="flex flex-col justify-between space-y-4 p-4 rounded-2xl bg-[#06090f] border border-white/5">
            <div>
              <span className="text-xs font-mono text-slate-400 block mb-2">
                زر التحدث للرتل (Push-To-Talk)
              </span>

              {/* PTT Interactive Button */}
              <button
                type="button"
                onMouseDown={() => setIsPushToTalk(true)}
                onMouseUp={handlePushToTalkRelease}
                onTouchStart={() => setIsPushToTalk(true)}
                onTouchEnd={handlePushToTalkRelease}
                className={`w-full py-6 rounded-2xl font-bold text-sm transition-all flex flex-col items-center justify-center gap-2 select-none active:scale-95 shadow-xl ${
                  isPushToTalk
                    ? 'bg-red-600 text-white ring-4 ring-red-500/50 animate-pulse'
                    : 'bg-gradient-to-b from-[#1c2636] to-[#121924] text-white hover:border-amber-400 border border-white/10'
                }`}
              >
                <div className={`p-3 rounded-full ${isPushToTalk ? 'bg-white text-red-600' : 'bg-amber-500/20 text-amber-400'}`}>
                  {isPushToTalk ? <Mic className="w-6 h-6 animate-bounce" /> : <MicOff className="w-6 h-6" />}
                </div>
                <span>{isPushToTalk ? 'جاري البث للرتل.. تحدث الآن' : 'اضغط مع الاستمرار للتحدث (PTT)'}</span>
                <span className="text-[10px] font-mono opacity-60">النداء: {currentUser.callsign || currentUser.name}</span>
              </button>
            </div>

            {/* Volume & Squelch Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-24 accent-amber-500 cursor-pointer"
                />
              </div>

              <button
                onClick={() => setSquelchEnabled(!squelchEnabled)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono border transition-colors ${
                  squelchEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                Squelch: {squelchEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0a0e17] border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>نطاق الإرسال: 15 كم في المناطق المفتوحة</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors"
          >
            إغلاق الوحدة
          </button>
        </div>
      </div>
    </div>
  );
};
