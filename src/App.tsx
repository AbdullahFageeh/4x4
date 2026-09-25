import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopBar } from './components/navigation/TopBar';
import { BottomNav } from './components/navigation/BottomNav';
import { OnboardingView } from './components/onboarding/OnboardingView';
import { AuthView } from './components/auth/AuthView';
import { CommunitiesView } from './components/communities/CommunitiesView';
import { TripsView } from './components/trips/TripsView';
import { ExploreMapView } from './components/explore/ExploreMapView';
import { ProfileView } from './components/profile/ProfileView';
import { NotificationsDrawer } from './components/notifications/NotificationsDrawer';
import { InteractiveDriverOnboardingModal } from './components/onboarding/InteractiveDriverOnboardingModal';
import { ConvoyRadioConsoleModal } from './components/telemetry/ConvoyRadioConsoleModal';
import { GoogleDriveManagerModal } from './components/drive/GoogleDriveManagerModal';

const AppContent: React.FC = () => {
  const {
    isAuthenticated,
    hasCompletedOnboarding,
    showAuthModal,
    setShowAuthModal,
    showOnboardingModal,
    setShowOnboardingModal,
    showRadioConsoleModal,
    setShowRadioConsoleModal,
    showGoogleDriveModal,
    setShowGoogleDriveModal,
    activeDriveTrip,
    setActiveDriveTrip,
    currentTab,
  } = useApp();

  // If user hasn't completed onboarding, show onboarding screen
  if (!hasCompletedOnboarding && !isAuthenticated) {
    return (
      <>
        <OnboardingView />
        {showAuthModal && (
          <AuthView isModal onClose={() => setShowAuthModal(false)} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#151412] text-[#EBE9E4] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#D4AF37]">
      {/* Top Header */}
      <TopBar />

      {/* Main Screen Content */}
      <main className="flex-1 pb-20 md:pb-8">
        {currentTab === 'communities' && <CommunitiesView />}
        {currentTab === 'trips' && <TripsView />}
        {currentTab === 'explore' && <ExploreMapView />}
        {currentTab === 'profile' && <ProfileView />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Auth Modal if opened from top bar */}
      {showAuthModal && (
        <AuthView isModal onClose={() => setShowAuthModal(false)} />
      )}

      {/* Interactive Driver Onboarding Guided Tour Modal */}
      {showOnboardingModal && (
        <InteractiveDriverOnboardingModal
          onClose={() => setShowOnboardingModal(false)}
        />
      )}

      {/* Convoy Walkie-Talkie & Live Telemetry Radio Console Modal */}
      {showRadioConsoleModal && (
        <ConvoyRadioConsoleModal
          onClose={() => setShowRadioConsoleModal(false)}
        />
      )}

      {/* Google Drive Trail & Convoy Cloud Storage Modal */}
      {showGoogleDriveModal && (
        <GoogleDriveManagerModal
          onClose={() => {
            setShowGoogleDriveModal(false);
            setActiveDriveTrip(null);
          }}
          targetTripToSync={activeDriveTrip}
        />
      )}

      {/* Notifications Drawer */}
      <NotificationsDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
