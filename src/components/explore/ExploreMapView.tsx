import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trip } from '../../types';
import { TripDetailModal } from '../trips/TripDetailModal';
import { GoogleMapsContainer, MapMarkerItem } from '../common/GoogleMapsContainer';
import {
  MapPin,
  Navigation,
  Compass,
  Wind,
  Sun,
  Shield,
  Layers,
  ChevronRight,
  Eye,
  Radio,
  BarChart3,
} from 'lucide-react';

interface RouteSpot extends MapMarkerItem {
  coordinates: string;
  distanceFromUser: string;
  terrainDesc: string;
  recommendedVehicle: string;
  windSpeed: string;
  temperature: string;
}

export const ExploreMapView: React.FC = () => {
  const { trips, toggleRegisterTrip, setCurrentTab } = useApp();

  const [activeTerrain, setActiveTerrain] = useState<string>('all');
  const [selectedSpot, setSelectedSpot] = useState<RouteSpot | null>(null);
  const [selectedTripModal, setSelectedTripModal] = useState<Trip | null>(null);

  const spots: RouteSpot[] = [
    {
      id: 'spot_01',
      name: 'مطل حافة العالم (جبل فهرين - طويق)',
      region: 'الرياض',
      lat: 24.9458,
      lng: 45.9922,
      type: 'mountain',
      coordinates: '24.9458° N, 45.9922° E',
      distanceFromUser: '94 كم',
      terrainDesc: 'مسار صخري رسوبي شديد الوعورة مع شواهق صخرية ترتفع 300 متر عن قاع الوادي',
      recommendedVehicle: 'مركبة 4x4 مرتفعة مع دبل ثقيل وإطارات All-Terrain',
      windSpeed: '18 كم/س (معتدل)',
      temperature: '28°م',
      activeDrivers: 24,
    },
    {
      id: 'spot_02',
      name: 'كثبان الرمال الحمراء ونفود الثمامة',
      region: 'الرياض',
      lat: 25.0421,
      lng: 46.6119,
      type: 'sand',
      coordinates: '25.0421° N, 46.6119° E',
      distanceFromUser: '45 كم',
      terrainDesc: 'طعوس رملية ذهبية ناعمة ومساحات واسعة لممارسة صعود الكثبان والتخييم',
      recommendedVehicle: 'دفع رباعي مع تنسيم الإطارات إلى 12-14 PSI وأعلام تنبيه',
      windSpeed: '22 كم/س (نشط)',
      temperature: '31°م',
      activeDrivers: 48,
    },
    {
      id: 'spot_03',
      name: 'كورنيش جدة وشاطئ أبحر الشمالية',
      region: 'جدة',
      lat: 21.5433,
      lng: 39.1728,
      type: 'coastal',
      coordinates: '21.5433° N, 39.1728° E',
      distanceFromUser: '860 كم',
      terrainDesc: 'طريق بحري أسفلتي أملس بمحاذاة الواجهة البحرية ونادي اليخوت',
      recommendedVehicle: 'سيارات سوبركار، كوبيه رياضية، وسيارات كلاسيكية',
      windSpeed: '14 كم/س (نسيم بحري)',
      temperature: '32°م',
      activeDrivers: 32,
    },
    {
      id: 'spot_04',
      name: 'عقبة الصماء وضفاف السودة',
      region: 'عسير - أبها',
      lat: 18.2612,
      lng: 42.3681,
      type: 'mountain',
      coordinates: '18.2612° N, 42.3681° E',
      distanceFromUser: '920 كم',
      terrainDesc: 'منحدرات جبلية حادة ومنعطفات حلزونية مع إطلالات ضبابية خلابة',
      recommendedVehicle: 'دفع رباعي بمكابح ممتازة ونظام نزول المنحدرات (HDC)',
      windSpeed: '12 كم/س (ضباب خفيف)',
      temperature: '19°م',
      activeDrivers: 14,
    },
  ];

  const filteredSpots = spots.filter(
    (s) => activeTerrain === 'all' || s.type === activeTerrain
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl bg-[#111722] border border-white/10 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              الخريطة الحية ومواقع التجمعات
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
              Google Maps Platform
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            استكشف المسارات الصحراوية، العقبات الجبلية، ونقاط تجمع الكروز في مدينتك
          </p>
        </div>

        {/* Terrain Filter Segmented Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-[#090d14] rounded-xl border border-white/5 overflow-x-auto">
          {[
            { id: 'all', label: 'الكل' },
            { id: 'sand', label: 'رمال وطعوس 4x4' },
            { id: 'mountain', label: 'عقبات وجبال' },
            { id: 'coastal', label: 'كروز ساحلي' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTerrain(t.id)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTerrain === t.id
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map Canvas & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Map Canvas with Google Maps (2 Columns on Desktop) */}
        <div className="lg:col-span-2">
          <GoogleMapsContainer
            markers={filteredSpots}
            selectedMarkerId={selectedSpot?.id}
            onSelectMarker={(m) => {
              const fullSpot = spots.find((s) => s.id === m.id);
              if (fullSpot) setSelectedSpot(fullSpot);
            }}
            className="h-[500px] shadow-2xl"
          />
        </div>

        {/* Spot Detail Sidebar (1 Column on Desktop) */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#111722] border border-white/10 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span>تفاصيل المسار المحدد</span>
            </h3>

            {selectedSpot ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-white">{selectedSpot.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                    <span className="text-amber-400">{selectedSpot.region}</span>
                    <span>·</span>
                    <span>{selectedSpot.distanceFromUser} من موقعك</span>
                    <span>·</span>
                    <span className="text-emerald-400 font-bold">{selectedSpot.activeDrivers} سيارة بالموقع</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#0c1017] border border-white/5 space-y-2 text-xs">
                  <p className="text-slate-300 leading-relaxed">{selectedSpot.terrainDesc}</p>
                  <div className="pt-2 border-t border-white/5 text-[11px] text-amber-300">
                    <strong>المركبة الموصى بها: </strong>
                    <span>{selectedSpot.recommendedVehicle}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#141b25] border border-white/5 flex items-center gap-2">
                    <Wind className="w-4 h-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">سرعة الرياح</span>
                      <span className="text-white font-bold">{selectedSpot.windSpeed}</span>
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#141b25] border border-white/5 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">درجة الحرارة</span>
                      <span className="text-white font-bold">{selectedSpot.temperature}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const match = trips.find((t) => t.startLocation.includes(selectedSpot.region) || t.title.includes(selectedSpot.name.split(' ')[0]));
                    if (match) setSelectedTripModal(match);
                    else setSelectedTripModal(trips[0]);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>عرض القوافل المتجهة لهذا المسار</span>
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-400 space-y-2">
                <MapPin className="w-8 h-8 mx-auto text-slate-600" />
                <p>اختر أحد المواقع من الخريطة لاستعراض حالة الطقس، عدد السائقين، والمسار الموصى به.</p>
              </div>
            )}
          </div>

          {/* Quick list of available spots */}
          <div className="p-4 rounded-2xl bg-[#111722] border border-white/10 space-y-2">
            <span className="text-xs font-bold text-slate-400 block mb-2">المسارات المقترحة بالقرب منك</span>
            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                onClick={() => setSelectedSpot(spot)}
                className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                  selectedSpot?.id === spot.id
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : 'bg-[#141b24] border-white/5 text-slate-300 hover:bg-[#1a2330]'
                }`}
              >
                <div>
                  <h5 className="text-xs font-semibold">{spot.name}</h5>
                  <span className="text-[10px] text-slate-400 font-mono">{spot.region} · {spot.distanceFromUser}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 rtl:rotate-180" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedTripModal && (
        <TripDetailModal
          trip={selectedTripModal}
          onClose={() => setSelectedTripModal(null)}
          onToggleRegister={(id) => toggleRegisterTrip(id)}
        />
      )}
    </div>
  );
};
