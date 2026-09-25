import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import {
  OnXWaypoint,
  OnXTrack,
  OnXBasemapType,
  OnXLayersState,
} from '../../types';
import { SAUDI_PUBLIC_RESERVES } from '../../data/onxData';
import {
  Compass,
  Layers,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Box,
  MapPin,
  ExternalLink,
  HardDrive,
  Wind,
  Navigation,
  Mountain,
} from 'lucide-react';

interface OnXMapViewerProps {
  waypoints: OnXWaypoint[];
  tracks: OnXTrack[];
  layersState: OnXLayersState;
  selectedWaypoint: OnXWaypoint | null;
  onSelectWaypoint: (wp: OnXWaypoint | null) => void;
  onDropWaypointAtCenter: (coords: { lat: number; lng: number }) => void;
  onSyncWaypointToDrive?: (wp: OnXWaypoint) => void;
  isRecording?: boolean;
  liveTrackPoints?: { lat: number; lng: number }[];
  centerCoordsHUD: { lat: number; lng: number; altM: number; bearingDeg: number };
  setCenterCoordsHUD: (coords: { lat: number; lng: number; altM: number; bearingDeg: number }) => void;
}

// onX Dark Topo High-Contrast Tactical Basemap Styling
const ONX_TACTICAL_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#131821' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0c1017' }, { weight: 3 }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#cbd5e1' }] },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#ff6a00' }, { weight: 1.5 }], // onX Signal Orange borders
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#334155' }, { weight: 1 }],
  },
  {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry',
    stylers: [{ color: '#171f2c' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#062016' }], // Deep forest green
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#ff6a00' }], // onX Signal Orange highways
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#fed7aa' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#27354a' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{ color: '#1a2332' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#09101d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#38bdf8' }],
  },
];

export const OnXMapViewer: React.FC<OnXMapViewerProps> = ({
  waypoints,
  tracks,
  layersState,
  selectedWaypoint,
  onSelectWaypoint,
  onDropWaypointAtCenter,
  onSyncWaypointToDrive,
  isRecording = false,
  liveTrackPoints = [],
  centerCoordsHUD,
  setCenterCoordsHUD,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const waypointMarkersRef = useRef<{ [id: string]: google.maps.Marker }>({});
  const tracksPolylinesRef = useRef<google.maps.Polyline[]>([]);
  const liveTrackPolylineRef = useRef<google.maps.Polyline | null>(null);
  const reservePolygonsRef = useRef<google.maps.Polygon[]>([]);

  const [is3DTilted, setIs3DTilted] = useState<boolean>(false);
  const [mapHeading, setMapHeading] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyCeaqDck9Q9qYW-OuPf7nbJKqUDd_tljCA';

  // Initialize Map
  useEffect(() => {
    let isMounted = true;
    setOptions({
      key: apiKey,
      v: 'weekly',
      language: 'ar',
    });

    Promise.all([importLibrary('maps'), importLibrary('marker'), importLibrary('geometry')])
      .then(([mapsLib]) => {
        if (!isMounted || !mapRef.current) return;

        const initialMapType =
          layersState.basemap === 'satellite_hybrid'
            ? 'hybrid'
            : layersState.basemap === 'topo' || layersState.basemap === 'terrain_3d'
            ? 'terrain'
            : 'roadmap';

        const map = new mapsLib.Map(mapRef.current, {
          center: { lat: 24.7136, lng: 46.6753 }, // Riyadh
          zoom: 7,
          mapTypeId: initialMapType,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          tilt: is3DTilted ? 45 : 0,
          backgroundColor: '#0c1017',
          styles: layersState.basemap === 'tactical_dark' ? ONX_TACTICAL_MAP_STYLE : [],
        });

        mapInstanceRef.current = map;

        // Map movement listeners to update tactical HUD coordinates
        map.addListener('center_changed', () => {
          const c = map.getCenter();
          if (c) {
            const lat = c.lat();
            const lng = c.lng();
            // Approximated altitude from terrain elevation (mock calc or real)
            const altM = Math.round(520 + Math.sin(lat * 10) * 240 + Math.cos(lng * 10) * 180);
            setCenterCoordsHUD({
              lat: Number(lat.toFixed(5)),
              lng: Number(lng.toFixed(5)),
              altM,
              bearingDeg: Math.round(map.getHeading() || 0),
            });
          }
        });

        map.addListener('heading_changed', () => {
          setMapHeading(map.getHeading() || 0);
        });

        setIsLoading(false);
      })
      .catch((err) => {
        console.error('onX Google Maps load error:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  // Update Basemap & Styles
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (layersState.basemap === 'satellite_hybrid') {
      map.setMapTypeId('hybrid');
      map.setOptions({ styles: [] });
    } else if (layersState.basemap === 'topo') {
      map.setMapTypeId('terrain');
      map.setOptions({ styles: [] });
    } else if (layersState.basemap === 'terrain_3d') {
      map.setMapTypeId('hybrid');
      map.setTilt(45);
      map.setOptions({ styles: [] });
    } else {
      // Tactical Dark
      map.setMapTypeId('roadmap');
      map.setOptions({ styles: ONX_TACTICAL_MAP_STYLE });
    }
  }, [layersState.basemap]);

  // Update Waypoint Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof google === 'undefined') return;

    // Clear old markers
    Object.values(waypointMarkersRef.current).forEach((m) => m.setMap(null));
    waypointMarkersRef.current = {};

    if (!layersState.showWaypoints) return;

    waypoints.forEach((wp) => {
      const isSelected = selectedWaypoint?.id === wp.id;

      // onX Signature Pin Icon (SVG Pin with Category Glyph)
      const pinSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="46" viewBox="0 0 36 46">
          <filter id="shadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000000" flood-opacity="0.6"/>
          </filter>
          <path d="M18 0 C8.06 0 0 8.06 0 18 C0 31.5 18 46 18 46 C18 46 36 31.5 36 18 C36 8.06 27.94 0 18 0 Z"
            fill="${wp.color}" stroke="${isSelected ? '#ffffff' : '#0c1017'}" stroke-width="${isSelected ? '3' : '1.5'}" filter="url(#shadow)" />
          <circle cx="18" cy="18" r="10" fill="#12161f" />
          <circle cx="18" cy="18" r="4" fill="${wp.color}" />
        </svg>
      `;

      const marker = new google.maps.Marker({
        position: { lat: wp.lat, lng: wp.lng },
        map,
        title: wp.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSvg)}`,
          scaledSize: new google.maps.Size(isSelected ? 42 : 34, isSelected ? 52 : 44),
          anchor: new google.maps.Point(18, 44),
        },
      });

      marker.addListener('click', () => {
        onSelectWaypoint(wp);
        map.panTo({ lat: wp.lat, lng: wp.lng });
      });

      waypointMarkersRef.current[wp.id] = marker;
    });
  }, [waypoints, selectedWaypoint, layersState.showWaypoints, onSelectWaypoint]);

  // Update Tracks (Polylines)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof google === 'undefined') return;

    tracksPolylinesRef.current.forEach((p) => p.setMap(null));
    tracksPolylinesRef.current = [];

    if (!layersState.showRecordedTracks) return;

    tracks.forEach((track) => {
      const line = new google.maps.Polyline({
        path: track.points.map((pt) => ({ lat: pt.lat, lng: pt.lng })),
        geodesic: true,
        strokeColor: track.color || '#ff6a00',
        strokeOpacity: 0.9,
        strokeWeight: 4,
        map,
      });

      line.addListener('click', () => {
        // center map on track start
        if (track.points.length > 0) {
          map.panTo({ lat: track.points[0].lat, lng: track.points[0].lng });
        }
      });

      tracksPolylinesRef.current.push(line);
    });
  }, [tracks, layersState.showRecordedTracks]);

  // Update Live Track Recording Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof google === 'undefined') return;

    if (!liveTrackPolylineRef.current) {
      liveTrackPolylineRef.current = new google.maps.Polyline({
        path: [],
        geodesic: true,
        strokeColor: '#ef4444', // Red recording stroke
        strokeOpacity: 1.0,
        strokeWeight: 5,
        map,
      });
    }

    if (isRecording && liveTrackPoints.length > 0) {
      liveTrackPolylineRef.current.setPath(liveTrackPoints);
      // Pan to latest point
      const latest = liveTrackPoints[liveTrackPoints.length - 1];
      map.panTo(latest);
    } else if (!isRecording) {
      liveTrackPolylineRef.current.setPath([]);
    }
  }, [isRecording, liveTrackPoints]);

  // Update Public Land Reserves Polygons
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof google === 'undefined') return;

    reservePolygonsRef.current.forEach((p) => p.setMap(null));
    reservePolygonsRef.current = [];

    if (!layersState.showPublicReserves) return;

    SAUDI_PUBLIC_RESERVES.forEach((res) => {
      // Draw simulated reserve boundary polygon around center
      const d = 0.55;
      const coords = [
        { lat: res.center.lat + d, lng: res.center.lng - d },
        { lat: res.center.lat + d, lng: res.center.lng + d },
        { lat: res.center.lat - d, lng: res.center.lng + d },
        { lat: res.center.lat - d, lng: res.center.lng - d },
      ];

      const poly = new google.maps.Polygon({
        paths: coords,
        strokeColor: res.color,
        strokeOpacity: 0.85,
        strokeWeight: 2,
        fillColor: res.color,
        fillOpacity: 0.12,
        map,
      });

      reservePolygonsRef.current.push(poly);
    });
  }, [layersState.showPublicReserves]);

  // Controls Handlers
  const handleZoomIn = () => {
    const map = mapInstanceRef.current;
    if (map) map.setZoom((map.getZoom() || 7) + 1);
  };

  const handleZoomOut = () => {
    const map = mapInstanceRef.current;
    if (map) map.setZoom((map.getZoom() || 7) - 1);
  };

  const handleResetNorth = () => {
    const map = mapInstanceRef.current;
    if (map) {
      map.setHeading(0);
      setMapHeading(0);
    }
  };

  const handleToggle3D = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const nextTilt = !is3DTilted;
    setIs3DTilted(nextTilt);
    map.setTilt(nextTilt ? 45 : 0);
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          mapInstanceRef.current?.panTo({ lat, lng });
          mapInstanceRef.current?.setZoom(12);
        },
        () => {
          // Default to Riyadh center if blocked
          mapInstanceRef.current?.panTo({ lat: 24.7136, lng: 46.6753 });
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0a0d13]">
      {/* Map Container Element */}
      <div ref={mapRef} className="w-full h-full min-h-[500px]" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#090d14]/90 z-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-3 border-[#ff6a00]/30 border-t-[#ff6a00] rounded-full animate-spin" />
          <span className="text-xs font-mono text-slate-300">
            جاري تهيئة منصة خرائط onX Tactical التضاريسية...
          </span>
        </div>
      )}

      {/* Center Reticle (Crosshair) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-[#ff6a00] rounded-full opacity-70" />
          <div className="absolute w-8 h-[1px] bg-[#ff6a00] opacity-50" />
          <div className="absolute h-8 w-[1px] bg-[#ff6a00] opacity-50" />
        </div>
      </div>

      {/* Right Floating onX Tactical HUD Bar */}
      <div className="absolute top-20 right-4 z-20 flex flex-col items-center gap-2">
        {/* Compass Rose */}
        <button
          onClick={handleResetNorth}
          className="w-10 h-10 rounded-xl bg-[#121620]/90 hover:bg-[#1a202c] border border-white/10 text-white shadow-xl flex items-center justify-center backdrop-blur-md transition-all active:scale-95 group"
          title="محاذاة الشمال (North)"
        >
          <div
            className="transition-transform duration-300"
            style={{ transform: `rotate(${-mapHeading}deg)` }}
          >
            <Compass className="w-5 h-5 text-[#ff6a00] group-hover:scale-110" />
          </div>
        </button>

        {/* 3D Terrain Tilt Button */}
        <button
          onClick={handleToggle3D}
          className={`w-10 h-10 rounded-xl border shadow-xl flex items-center justify-center backdrop-blur-md transition-all active:scale-95 font-bold text-xs font-mono ${
            is3DTilted
              ? 'bg-[#ff6a00] text-black border-[#ff6a00]'
              : 'bg-[#121620]/90 hover:bg-[#1a202c] border-white/10 text-white'
          }`}
          title="تبديل المنظور ثلاثي الأبعاد 3D Tilt"
        >
          <Box className="w-4 h-4" />
        </button>

        {/* Locate Me (GPS Crosshair) */}
        <button
          onClick={handleLocateMe}
          className="w-10 h-10 rounded-xl bg-[#121620]/90 hover:bg-[#1a202c] border border-white/10 text-[#ff6a00] shadow-xl flex items-center justify-center backdrop-blur-md transition-all active:scale-95"
          title="تحديد موقعي GPS"
        >
          <Crosshair className="w-5 h-5" />
        </button>

        {/* Zoom In & Out */}
        <div className="flex flex-col rounded-xl bg-[#121620]/90 border border-white/10 overflow-hidden shadow-xl backdrop-blur-md">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 hover:bg-white/10 text-white flex items-center justify-center transition-colors border-b border-white/10"
            title="تقريب (+)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 hover:bg-white/10 text-white flex items-center justify-center transition-colors"
            title="إبعاد (-)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Waypoint Detail Card Overlay */}
      {selectedWaypoint && (
        <div className="absolute top-20 left-4 rtl:left-auto rtl:right-16 z-20 w-80 rounded-2xl bg-[#0f141e]/95 border border-[#ff6a00]/40 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${selectedWaypoint.color}25`, color: selectedWaypoint.color }}
              >
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white line-clamp-1">
                  {selectedWaypoint.name}
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">
                  {selectedWaypoint.lat.toFixed(4)}°N, {selectedWaypoint.lng.toFixed(4)}°E
                </span>
              </div>
            </div>
            <button
              onClick={() => onSelectWaypoint(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          <div className="my-3 p-2.5 rounded-xl bg-[#090d14] border border-white/5 space-y-1.5 text-[11px] font-mono">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400">الارتفاع عن البحر:</span>
              <span className="text-[#ff6a00] font-bold">{selectedWaypoint.elevationM} م</span>
            </div>
            {selectedWaypoint.notes && (
              <p className="text-slate-300 text-xs font-sans leading-relaxed pt-1 border-t border-white/5">
                {selectedWaypoint.notes}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (mapInstanceRef.current) {
                  mapInstanceRef.current.panTo({
                    lat: selectedWaypoint.lat,
                    lng: selectedWaypoint.lng,
                  });
                  mapInstanceRef.current.setZoom(14);
                }
              }}
              className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Navigation className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span>تقريب النقطة</span>
            </button>

            {onSyncWaypointToDrive && (
              <button
                onClick={() => onSyncWaypointToDrive(selectedWaypoint)}
                className="py-1.5 px-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                title="مزامنة في Google Drive"
              >
                <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                <span>حفظ بـ Drive</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Floating Center Drop Button (Fast Waypoint Drop) */}
      <div className="absolute bottom-24 right-4 z-20">
        <button
          onClick={() => {
            onDropWaypointAtCenter({
              lat: centerCoordsHUD.lat,
              lng: centerCoordsHUD.lng,
            });
          }}
          className="px-3.5 py-2 rounded-xl bg-[#ff6a00] hover:bg-[#ff7b1a] text-black font-extrabold text-xs shadow-xl flex items-center gap-2 transition-all active:scale-95"
          title="إسقاط نقطة إحداثية عند منتصف الخريطة"
        >
          <MapPin className="w-4 h-4" />
          <span>تثبيت نقطة هنا</span>
        </button>
      </div>
    </div>
  );
};
