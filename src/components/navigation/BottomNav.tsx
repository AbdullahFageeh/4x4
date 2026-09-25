import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Compass, MapPin, User } from 'lucide-react';
import { MainTab } from '../../types';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab } = useApp();

  const tabs: { id: MainTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'communities', label: 'المجتمعات', icon: Users },
    { id: 'trips', label: 'الرحلات', icon: Compass },
    { id: 'explore', label: 'onX 4x4', icon: MapPin },
    { id: 'profile', label: 'حسابي', icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d1219]/95 backdrop-blur-lg border-t border-white/10 pb-safe shadow-2xl">
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className="relative flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all group focus:outline-none"
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full" />
              )}
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive
                    ? 'text-amber-400 scale-110'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span
                className={`text-[11px] font-medium tracking-tight mt-0.5 whitespace-nowrap ${
                  isActive ? 'text-white font-semibold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
