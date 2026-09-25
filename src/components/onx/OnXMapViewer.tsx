import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import {
  OnXWaypoint,
  OnXTrack,
  OnXLayersState,
} from '../../types';
import { SAUDI_PUBLIC_RESERVES } from '../../data/onxData';
import {
  Compass,
  Box,
  MapPin,
  HardDrive,
  Navigation,
  Search,
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
  onSearchSubmit?: (e: React.FormEvent) => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
}

// Dark obsidian luxury styling for Expedition Elite
const EXPEDITION_ELITE_MAP_STYLE: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#151412' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#100f0e' }, { weight: 3 }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#EBE9E4' }] },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#D4AF37' }, { weight: 1.5 }],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#383530' }, { weight: 1 }],
  },
  {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry',
    stylers: [{ color: '#1c1b18' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#112217' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#D4AF37' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#F3E5AB' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#2a2824' }],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [{ color: '#1e1d1a' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0d0f14' }],
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
  onSearchSubmit,
  searchQuery = '',
  setSearchQuery,
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
            : layersState.basemap === 'topo'
            ? 'terrain'
            : 'roadmap';

        const map = new mapsLib.Map(mapRef.current, {
          center: { lat: 24.7136, lng: 46.6753 },
          zoom: 7,
          mapTypeId: initialMapType,
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          tilt: is3DTilted ? 45 : 0,
          backgroundColor: '#151412',
          styles: layersState.basemap === 'tactical_dark' ? EXPEDITION_ELITE_MAP_STYLE : [],
        });

        mapInstanceRef.current = map;

        map.addListener('center_changed', () => {
          const c = map.getCenter();
          if (c) {
            const lat = c.lat();
            const lng = c.lng();
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
        console.error('Google Maps load error:', err);
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
    } else {
      map.setMapTypeId('roadmap');
      map.setOptions({ styles: EXPEDITION_ELITE_MAP_STYLE });
    }
  }, [layersState.basemap]);

  // Update Waypoint Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || typeof google === 'undefined') return;

    Object.values(waypointMarkersRef.current).forEach((m) => m.setMap(null));
    waypointMarkersRef.current = {};

    if (!layersState.showWaypoints) return;

    waypoints.forEach((wp) => {
      const isSelected = selectedWaypoint?.id === wp.id;
      const markerColor = wp.color || '#D4AF37';

      const pinSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="44" viewBox="0 0 34 44">
          <filter id="goldGlow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.8"/>
          </filter>
          <path d="M17 0 C7.6 0 0 7.6 0 17 C0 29.8 17 44 17 44 C17 44 34 29.8 34 17 C34 7.6 26.4 0 17 0 Z"
            fill="${markerColor}" stroke="${isSelected ? '#FFFFFF' : '#151412'}" stroke-width="${isSelected ? '2.5' : '1.5'}" filter="url(#goldGlow)" />
          <circle cx="17" cy="17" r="9" fill="#151412" />
          <circle cx="17" cy="17" r="3.5" fill="${markerColor}" />
        </svg>
      `;

      const marker = new google.maps.Marker({
        position: { lat: wp.lat, lng: wp.lng },
        map,
        title: wp.name,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(pinSvg)}`,
          scaledSize: new google.maps.Size(isSelected ? 38 : 30, isSelected ? 48 : 40),
          anchor: new google.maps.Point(17, 40),
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
        strokeColor: track.color || '#D4AF37',
        strokeOpacity: 0.9,
        strokeWeight: 3.5,
        map,
      });

      line.addListener('click', () => {
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
        strokeColor: '#10B981',
        strokeOpacity: 1.0,
        strokeWeight: 4,
        map,
      });
    }

    if (isRecording && liveTrackPoints.length > 0) {
      liveTrackPolylineRef.current.setPath(liveTrackPoints);
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
        strokeWeight: 1.5,
        fillColor: res.color,
        fillOpacity: 0.1,
        map,
      });

      reservePolygonsRef.current.push(poly);
    });
  }, [layersState.showPublicReserves]);

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

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#151412]">
      {/* Map Element Container */}
      <div ref={mapRef} className="w-full h-full min-h-[500px]" />

      {/* Map Vignette Overlay (Variation 6) */}
      <div className="map-overlay-vignette" />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-[#151412]/95 z-20 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
          <span className="font-mono text-xs text-[#EBE9E4]/60">
            LOADING EXPEDITION CARTOGRAPHY...
          </span>
        </div>
      )}

      {/* Centered Search Pill (Variation 6: .search-pill) */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-[90%] sm:w-[500px] pointer-events-auto">
        <form
          onSubmit={onSearchSubmit}
          className="flex items-center gap-3 px-6 py-2.5 rounded-full bg-[rgba(30,29,27,0.85)] backdrop-blur-[20px] border border-[rgba(235,233,228,0.12)] shadow-2xl transition-all focus-within:border-[#D4AF37]"
        >
          <Search className="w-4 h-4 text-[#EBE9E4]/50 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            placeholder="البحث عن إحداثيات أو مواقع..."
            className="flex-1 bg-transparent border-none text-[#EBE9E4] text-xs sm:text-sm placeholder:text-[#EBE9E4]/40 outline-none"
          />
        </form>
      </div>

      {/* Floating Stats Card (Variation 6: .floating-stats) */}
      <div className="absolute top-6 left-6 z-20 hidden md:flex flex-col gap-3 p-4 rounded bg-[rgba(30,29,27,0.85)] backdrop-blur-[20px] border border-[rgba(235,233,228,0.08)] shadow-2xl min-w-[210px]">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-[#EBE9E4]/50">
            Coordinates
          </div>
          <div className="font-mono text-sm text-[#EBE9E4] font-bold mt-0.5">
            {centerCoordsHUD.lat}° N, {centerCoordsHUD.lng}° E
          </div>
        </div>

        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-[#EBE9E4]/50">
            Elevation
          </div>
          <div className="font-mono text-sm text-[#EBE9E4] font-bold mt-0.5">
            {centerCoordsHUD.altM} M
          </div>
        </div>

        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-[#EBE9E4]/50">
            Surface Wind
          </div>
          <div className="font-mono text-sm text-[#D4AF37] font-bold mt-0.5">
            18 KM/H
          </div>
        </div>
      </div>

      {/* Stacked Map Controls (Variation 6: .map-controls) */}
      <div className="absolute bottom-20 left-6 z-20 flex flex-col gap-[1px]">
        <button
          onClick={handleResetNorth}
          className="w-12 h-12 bg-[rgba(30,29,27,0.85)] hover:bg-[rgba(40,39,36,0.95)] backdrop-blur-[20px] border border-[rgba(235,233,228,0.08)] text-[#EBE9E4] font-mono font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
          title="North Alignment"
        >
          <div style={{ transform: `rotate(${-mapHeading}deg)` }}>
            <span className="text-[#D4AF37]">N</span>
          </div>
        </button>

        <button
          onClick={handleToggle3D}
          className={`w-12 h-12 backdrop-blur-[20px] border border-[rgba(235,233,228,0.08)] font-mono font-bold text-xs flex items-center justify-center transition-colors cursor-pointer ${
            is3DTilted
              ? 'bg-[#D4AF37] text-[#151412]'
              : 'bg-[rgba(30,29,27,0.85)] hover:bg-[rgba(40,39,36,0.95)] text-[#EBE9E4]'
          }`}
          title="3D Tilt View"
        >
          3D
        </button>

        <button
          onClick={handleZoomIn}
          className="w-12 h-12 bg-[rgba(30,29,27,0.85)] hover:bg-[rgba(40,39,36,0.95)] backdrop-blur-[20px] border border-[rgba(235,233,228,0.08)] text-[#EBE9E4] font-mono text-lg flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom In"
        >
          +
        </button>

        <button
          onClick={handleZoomOut}
          className="w-12 h-12 bg-[rgba(30,29,27,0.85)] hover:bg-[rgba(40,39,36,0.95)] backdrop-blur-[20px] border border-[rgba(235,233,228,0.08)] text-[#EBE9E4] font-mono text-lg flex items-center justify-center transition-colors cursor-pointer"
          title="Zoom Out"
        >
          -
        </button>
      </div>

      {/* Selected Waypoint Detail Card Overlay */}
      {selectedWaypoint && (
        <div className="absolute top-20 right-6 z-20 w-80 rounded bg-[rgba(30,29,27,0.92)] border border-[#D4AF37]/40 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="font-serif text-lg font-bold text-[#EBE9E4] line-clamp-1">
                {selectedWaypoint.name}
              </h4>
              <span className="font-mono text-[10px] text-[#EBE9E4]/60">
                {selectedWaypoint.lat.toFixed(4)}°N, {selectedWaypoint.lng.toFixed(4)}°E
              </span>
            </div>
            <button
              onClick={() => onSelectWaypoint(null)}
              className="text-[#EBE9E4]/50 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          <div className="my-3 p-2.5 bg-black/40 border border-[rgba(235,233,228,0.06)] space-y-1 font-mono text-[11px]">
            <div className="flex items-center justify-between text-[#EBE9E4]/70">
              <span>الارتفاع:</span>
              <span className="text-[#D4AF37] font-bold">{selectedWaypoint.elevationM} M</span>
            </div>
            {selectedWaypoint.notes && (
              <p className="text-[#EBE9E4]/80 text-xs font-sans pt-1 border-t border-[rgba(235,233,228,0.06)]">
                {selectedWaypoint.notes}
              </p>
            )}
          </div>

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
              className="flex-1 py-1.5 bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.12)] text-[#EBE9E4] font-mono text-[11px] uppercase transition-colors"
            >
              Pan To
            </button>

            {onSyncWaypointToDrive && (
              <button
                onClick={() => onSyncWaypointToDrive(selectedWaypoint)}
                className="py-1.5 px-3 bg-transparent border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#151412] font-mono text-[11px] uppercase transition-colors"
                title="مزامنة مع Google Drive"
              >
                Drive Sync
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
