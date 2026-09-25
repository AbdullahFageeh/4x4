import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { Layers, AlertCircle, Compass, Radio } from 'lucide-react';

export interface MapMarkerItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  region: string;
  type: 'sand' | 'mountain' | 'coastal' | 'track';
  activeDrivers?: number;
}

interface GoogleMapsContainerProps {
  markers: MapMarkerItem[];
  selectedMarkerId?: string | null;
  onSelectMarker: (marker: MapMarkerItem) => void;
  className?: string;
  center?: { lat: number; lng: number };
  zoom?: number;
}

// Dark charcoal automotive styling for nocturnal road and overland exploration
const DARK_AUTOMOTIVE_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0f141d' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#090d14' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#e2e8f0' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#64748b' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#13211c' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#0f172a' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#334155' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f59e0b' }], // Amber highway badges
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#1e293b' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#070b12' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }],
  },
];

export const GoogleMapsContainer: React.FC<GoogleMapsContainerProps> = ({
  markers,
  selectedMarkerId,
  onSelectMarker,
  className = '',
  center = { lat: 24.7136, lng: 46.6753 }, // Riyadh center
  zoom = 6,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<{ [id: string]: google.maps.Marker }>({});
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mapType, setMapType] = useState<'roadmap' | 'hybrid'>('roadmap');

  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCeaqDck9Q9qYW-OuPf7nbJKqUDd_tljCA';

  useEffect(() => {
    let isMounted = true;

    setOptions({
      key: apiKey,
      v: 'weekly',
      language: 'ar',
    });

    Promise.all([importLibrary('maps'), importLibrary('marker')])
      .then(([mapsLib]) => {
        if (!isMounted || !mapRef.current) return;

        const map = new mapsLib.Map(mapRef.current, {
          center,
          zoom,
          styles: DARK_AUTOMOTIVE_MAP_STYLE,
          disableDefaultUI: true,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          backgroundColor: '#0a0d14',
        });

        mapInstanceRef.current = map;
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        console.error('Failed to load Google Maps:', err);
        if (isMounted) {
          setLoadError('تعذر تحميل خريطة Google Maps مباشرة.');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey, center, zoom]);

  // Update Markers when map or markers change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof google === 'undefined') return;

    // Clear previous markers
    Object.values(markersRef.current).forEach((m) => m.setMap(null));
    markersRef.current = {};

    markers.forEach((item) => {
      const isSelected = item.id === selectedMarkerId;

      // Color scheme according to spot terrain
      const pinColor =
        item.type === 'sand'
          ? '#10b981' // emerald
          : item.type === 'mountain'
          ? '#f59e0b' // amber
          : '#38bdf8'; // coastal sky

      const marker = new google.maps.Marker({
        position: { lat: item.lat, lng: item.lng },
        map,
        title: item.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: isSelected ? 10 : 8,
          fillColor: isSelected ? '#ffffff' : pinColor,
          fillOpacity: 1,
          strokeColor: pinColor,
          strokeWeight: isSelected ? 4 : 2,
        },
      });

      marker.addListener('click', () => {
        onSelectMarker(item);
        map.panTo({ lat: item.lat, lng: item.lng });
      });

      markersRef.current[item.id] = marker;
    });
  }, [markers, selectedMarkerId, onSelectMarker]);

  // Pan to selected marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedMarkerId) return;

    const item = markers.find((m) => m.id === selectedMarkerId);
    if (item) {
      map.panTo({ lat: item.lat, lng: item.lng });
      map.setZoom(9);
    }
  }, [selectedMarkerId, markers]);

  const toggleMapType = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const next = mapType === 'roadmap' ? 'hybrid' : 'roadmap';
    map.setMapTypeId(next);
    if (next === 'roadmap') {
      map.setOptions({ styles: DARK_AUTOMOTIVE_MAP_STYLE });
    } else {
      map.setOptions({ styles: [] });
    }
    setMapType(next);
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-[#070b10] border border-white/10 ${className}`}>
      {/* Map Element Container */}
      <div ref={mapRef} className="w-full h-full min-h-[440px]" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#070b10] flex flex-col items-center justify-center gap-3 z-20">
          <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-xs text-slate-300 font-mono">جاري تحميل خريطة Google Maps المباشرة...</span>
        </div>
      )}

      {/* Load Error Fallback Banner */}
      {loadError && (
        <div className="absolute top-4 inset-x-4 z-30 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{loadError}</span>
          </div>
        </div>
      )}

      {/* Top Floating Controls */}
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-20 flex items-center gap-2">
        <button
          onClick={toggleMapType}
          className="px-3 py-1.5 rounded-xl bg-[#0c1017]/90 hover:bg-[#141b25] border border-white/10 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5 shadow-lg"
          title="تبديل نوع الخريطة"
        >
          <Layers className="w-3.5 h-3.5 text-amber-400" />
          <span>{mapType === 'roadmap' ? 'قمر صناعي (Satellite)' : 'خريطة ليلية (Dark)'}</span>
        </button>

        <div className="px-3 py-1.5 rounded-xl bg-[#0c1017]/90 border border-white/10 text-emerald-400 text-xs font-mono backdrop-blur-md hidden sm:flex items-center gap-1.5 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Google Maps Active</span>
        </div>
      </div>

      {/* Bottom Floating Stats */}
      <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between text-xs text-slate-300 font-mono bg-[#0c1017]/90 p-3 rounded-xl border border-white/10 backdrop-blur-md shadow-xl">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <span>المملكة العربية السعودية · مسارات ونقاط تجمع رسمية</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-400">
          <Radio className="w-3.5 h-3.5" />
          <span>قناة القوافل: UHF 462.5625</span>
        </div>
      </div>
    </div>
  );
};
