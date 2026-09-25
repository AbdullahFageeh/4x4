import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell, CheckCircle2, AlertTriangle, ShieldCheck, Compass } from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    showNotificationsDrawer,
    setShowNotificationsDrawer,
    notifications,
    markNotificationsAsRead,
    unreadNotificationsCount,
  } = useApp();

  if (!showNotificationsDrawer) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm h-full bg-[#0d1219] border-l rtl:border-l-0 rtl:border-r border-white/10 shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">مركز التنبيهات والقوافل</h3>
            {unreadNotificationsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-bold">
                {unreadNotificationsCount} جديد
              </span>
            )}
          </div>
          <button
            onClick={() => setShowNotificationsDrawer(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            title="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map((notif) => {
            const icon = {
              trip: <Compass className="w-4 h-4 text-emerald-400" />,
              announcement: <AlertTriangle className="w-4 h-4 text-amber-400" />,
              community: <ShieldCheck className="w-4 h-4 text-sky-400" />,
            }[notif.type];

            return (
              <div
                key={notif.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  notif.isRead
                    ? 'bg-[#111722]/50 border-white/5 opacity-80'
                    : 'bg-[#141b25] border-emerald-500/30 shadow-md'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white/5 shrink-0 mt-0.5">
                    {icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-white">{notif.title}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-snug">{notif.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={markNotificationsAsRead}
            className="flex-1 py-2 text-center rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
          >
            تحديد الكل كمقروء
          </button>
          <button
            onClick={() => setShowNotificationsDrawer(false)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
