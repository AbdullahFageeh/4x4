import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  OnXWaypoint,
  OnXTrack,
  OnXLayersState,
  Trip,
} from '../../types';
import {
  INITIAL_WAYPOINTS,
  INITIAL_TRACKS,
  INITIAL_ONX_LAYERS,
} from '../../data/onxData';
import { OnXMapViewer } from './OnXMapViewer';
import { OnXTacticalTopBar } from './OnXTacticalTopBar';
import { OnXTacticalDock } from './OnXTacticalDock';
import { OnXDrawer } from './OnXDrawer';
import { OnXTrackRecorderBar } from './OnXTrackRecorderBar';
import { OnXWaypointModal } from './OnXWaypointModal';
import { OnXOfflineModal } from './OnXOfflineModal';
import { OnXMeasureModal } from './OnXMeasureModal';
import { OnXAreaModal } from './OnXAreaModal';
import { TripDetailModal } from '../trips/TripDetailModal';
import {
  uploadTextToDrive,
  getOrCreateCarComFolder,
} from '../../services/googleDriveService';
import { getAccessToken } from '../../services/googleAuthService';

export const OnXAppContainer: React.FC = () => {
  const {
    trips,
    toggleRegisterTrip,
    setShowGoogleDriveModal,
    setActiveDriveTrip,
  } = useApp();

  // onX State
  const [layersState, setLayersState] = useState<OnXLayersState>(INITIAL_ONX_LAYERS);
  const [waypoints, setWaypoints] = useState<OnXWaypoint[]>(INITIAL_WAYPOINTS);
  const [tracks, setTracks] = useState<OnXTrack[]>(INITIAL_TRACKS);
  const [selectedWaypoint, setSelectedWaypoint] = useState<OnXWaypoint | null>(null);
  const [selectedTripModal, setSelectedTripModal] = useState<Trip | null>(null);

  // Drawer & Tools State
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [drawerTab, setDrawerTab] = useState<'layers' | 'discover' | 'content' | 'weather' | 'rig'>('layers');
  const [activeTool, setActiveTool] = useState<'mark' | 'track' | 'measure' | 'area' | 'offline' | 'layers' | null>(null);

  // Active Center Telemetry Coordinates HUD
  const [centerCoordsHUD, setCenterCoordsHUD] = useState({
    lat: 24.9458,
    lng: 45.9922,
    altM: 980,
    bearingDeg: 42,
  });

  // Track Recording State
  const [isRecordingTrack, setIsRecordingTrack] = useState<boolean>(false);
  const [isTrackPaused, setIsTrackPaused] = useState<boolean>(false);
  const [liveTrackPoints, setLiveTrackPoints] = useState<{ lat: number; lng: number }[]>([]);

  // Modals
  const [showWaypointModal, setShowWaypointModal] = useState<boolean>(false);
  const [waypointInitialCoords, setWaypointInitialCoords] = useState<{ lat: number; lng: number }>({
    lat: 24.9458,
    lng: 45.9922,
  });
  const [showOfflineModal, setShowOfflineModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Handle Mark Waypoint Action from Dock or Center Drop
  const handleOpenMarkModal = (coords?: { lat: number; lng: number }) => {
    const target = coords || { lat: centerCoordsHUD.lat, lng: centerCoordsHUD.lng };
    setWaypointInitialCoords(target);
    setShowWaypointModal(true);
    setActiveTool(null);
  };

  // Sync Waypoint to Google Drive
  const handleSyncWaypointToDrive = async (wp: OnXWaypoint) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setShowGoogleDriveModal(true);
        return;
      }
      const folderId = await getOrCreateCarComFolder(token);
      const fileName = `نقطة_${wp.name.replace(/[\/\\]/g, '_')}_${wp.elevationM}m.json`;
      const payload = {
        type: 'onx_waypoint',
        waypoint: wp,
        exportedAt: new Date().toISOString(),
      };
      await uploadTextToDrive(token, fileName, JSON.stringify(payload, null, 2), 'application/json', folderId);
      alert(`تمت مزامنة نقطة "${wp.name}" في Google Drive بنجاح!`);
    } catch (err: any) {
      console.error('Waypoint sync error:', err);
      alert(`فشل الحفظ في Google Drive: ${err.message}`);
    }
  };

  // Sync Track to Google Drive
  const handleSyncTrackToDrive = async (track: Partial<OnXTrack>) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        setShowGoogleDriveModal(true);
        return;
      }
      const folderId = await getOrCreateCarComFolder(token);
      const fileName = `مسار_${(track.name || 'مسار').replace(/[\/\\]/g, '_')}.gpx.json`;
      const payload = {
        type: 'onx_recorded_track',
        track,
        exportedAt: new Date().toISOString(),
      };
      await uploadTextToDrive(token, fileName, JSON.stringify(payload, null, 2), 'application/json', folderId);
      alert(`تم نسخ مسار "${track.name}" إلى Google Drive بنجاح!`);
    } catch (err: any) {
      console.error('Track sync error:', err);
      alert(`فشل الحفظ في Google Drive: ${err.message}`);
    }
  };

  const handleSaveWaypoint = async (wpData: Partial<OnXWaypoint>, syncToDrive: boolean) => {
    const newWp: OnXWaypoint = {
      id: `wp-${Date.now()}`,
      name: wpData.name || 'نقطة إحداثية جديدة',
      icon: wpData.icon || 'viewpoint',
      color: wpData.color || '#ff6a00',
      lat: wpData.lat || centerCoordsHUD.lat,
      lng: wpData.lng || centerCoordsHUD.lng,
      elevationM: wpData.elevationM || centerCoordsHUD.altM,
      notes: wpData.notes || '',
      createdAt: new Date().toISOString(),
    };

    setWaypoints((prev) => [newWp, ...prev]);
    setShowWaypointModal(false);

    if (syncToDrive) {
      await handleSyncWaypointToDrive(newWp);
    }
  };

  // Toggle Live Track Recording
  const handleToggleTrackRecorder = () => {
    if (!isRecordingTrack) {
      setIsRecordingTrack(true);
      setIsTrackPaused(false);
      setLiveTrackPoints([{ lat: centerCoordsHUD.lat, lng: centerCoordsHUD.lng }]);
    } else {
      setIsTrackPaused(!isTrackPaused);
    }
  };

  const handleStopAndSaveTrack = (trackData: Partial<OnXTrack>) => {
    const newTrack: OnXTrack = {
      id: `tr-${Date.now()}`,
      name: trackData.name || 'مسار صحراوي مسجل',
      distanceKm: trackData.distanceKm || 0,
      durationSeconds: trackData.durationSeconds || 0,
      avgSpeedKmh: trackData.avgSpeedKmh || 0,
      elevationGainM: trackData.elevationGainM || 0,
      color: trackData.color || '#ff6a00',
      createdAt: new Date().toISOString(),
      points: liveTrackPoints.map((pt, i) => ({ ...pt, timestamp: i })),
    };

    setTracks((prev) => [newTrack, ...prev]);
    setIsRecordingTrack(false);
    setIsTrackPaused(false);
    setLiveTrackPoints([]);
    setActiveTool(null);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Check if input is GPS coordinates like "24.9458, 45.9922"
    const coordMatch = searchQuery.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      setCenterCoordsHUD((prev) => ({ ...prev, lat, lng }));
      return;
    }

    // Otherwise find matching trail
    const matchedTrip = trips.find(
      (t) =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.startLocation.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (matchedTrip) {
      setSelectedTripModal(matchedTrip);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] md:h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-[#0c1017]">
      {/* onX Tactical Top Header */}
      <OnXTacticalTopBar
        isDrawerOpen={isDrawerOpen}
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        layersState={layersState}
        setLayersState={setLayersState}
        centerCoordsHUD={centerCoordsHUD}
        onOpenGoogleDriveModal={() => setShowGoogleDriveModal(true)}
        onOpenOfflineModal={() => setShowOfflineModal(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Tactical Map Viewport */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <OnXMapViewer
          waypoints={waypoints}
          tracks={tracks}
          layersState={layersState}
          selectedWaypoint={selectedWaypoint}
          onSelectWaypoint={setSelectedWaypoint}
          onDropWaypointAtCenter={(coords) => handleOpenMarkModal(coords)}
          onSyncWaypointToDrive={handleSyncWaypointToDrive}
          isRecording={isRecordingTrack && !isTrackPaused}
          liveTrackPoints={liveTrackPoints}
          centerCoordsHUD={centerCoordsHUD}
          setCenterCoordsHUD={setCenterCoordsHUD}
        />

        {/* onX Left Flyout Drawer */}
        <OnXDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activeTab={drawerTab}
          setActiveTab={setDrawerTab}
          layersState={layersState}
          setLayersState={setLayersState}
          waypoints={waypoints}
          tracks={tracks}
          onSelectWaypoint={(wp) => {
            setSelectedWaypoint(wp);
            setIsDrawerOpen(false);
          }}
          onSelectTrip={(tr) => setSelectedTripModal(tr)}
          trips={trips}
          onOpenGoogleDriveModal={() => setShowGoogleDriveModal(true)}
          onSyncWaypointToDrive={handleSyncWaypointToDrive}
          onSyncTrackToDrive={handleSyncTrackToDrive}
        />

        {/* Live Track Recording Telemetry Bar */}
        <OnXTrackRecorderBar
          isRecording={isRecordingTrack}
          onPauseResume={() => setIsTrackPaused(!isTrackPaused)}
          isPaused={isTrackPaused}
          onStopAndSave={handleStopAndSaveTrack}
          onDiscard={() => {
            setIsRecordingTrack(false);
            setLiveTrackPoints([]);
            setActiveTool(null);
          }}
          onSyncToDrive={handleSyncTrackToDrive}
        />

        {/* Interactive Measure Distance Modal */}
        {activeTool === 'measure' && (
          <OnXMeasureModal
            centerCoords={{ lat: centerCoordsHUD.lat, lng: centerCoordsHUD.lng }}
            onClose={() => setActiveTool(null)}
          />
        )}

        {/* Interactive Area Measurement Modal */}
        {activeTool === 'area' && (
          <OnXAreaModal
            centerCoords={{ lat: centerCoordsHUD.lat, lng: centerCoordsHUD.lng }}
            onClose={() => setActiveTool(null)}
          />
        )}

        {/* Bottom Floating Tactical Dock (The 6 onX Tools) */}
        <OnXTacticalDock
          activeTool={activeTool}
          setActiveTool={(tool) => {
            setActiveTool(tool);
            if (tool === 'mark') {
              handleOpenMarkModal();
            } else if (tool === 'track') {
              handleToggleTrackRecorder();
            } else if (tool === 'offline') {
              setShowOfflineModal(true);
              setActiveTool(null);
            }
          }}
          isRecordingTrack={isRecordingTrack}
          onOpenDrawerTab={(tab) => {
            setDrawerTab(tab);
            setIsDrawerOpen(true);
          }}
        />
      </div>

      {/* Modals */}
      {showWaypointModal && (
        <OnXWaypointModal
          initialCoords={waypointInitialCoords}
          onSave={handleSaveWaypoint}
          onClose={() => setShowWaypointModal(false)}
        />
      )}

      {showOfflineModal && (
        <OnXOfflineModal
          centerCoords={{ lat: centerCoordsHUD.lat, lng: centerCoordsHUD.lng }}
          onClose={() => setShowOfflineModal(false)}
        />
      )}

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
