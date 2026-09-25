import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Community,
  Trip,
  AppNotification,
  Language,
  MainTab,
  Vehicle,
  CommunityActivity,
  ActivityType,
} from '../types';
import {
  INITIAL_USER,
  MOCK_COMMUNITIES,
  MOCK_TRIPS,
  MOCK_NOTIFICATIONS,
  MOCK_COMMUNITY_ACTIVITIES,
} from '../data/mockData';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  isAuthenticated: boolean;
  isDemoMode: boolean;
  currentUser: UserProfile;
  currentTab: MainTab;
  setCurrentTab: (tab: MainTab) => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (val: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (val: boolean) => void;
  communities: Community[];
  trips: Trip[];
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  showNotificationsDrawer: boolean;
  setShowNotificationsDrawer: (val: boolean) => void;
  showOnboardingModal: boolean;
  setShowOnboardingModal: (val: boolean) => void;
  showRadioConsoleModal: boolean;
  setShowRadioConsoleModal: (val: boolean) => void;
  showGoogleDriveModal: boolean;
  setShowGoogleDriveModal: (val: boolean) => void;
  activeDriveTrip: any | null;
  setActiveDriveTrip: (trip: any | null) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  activities: CommunityActivity[];
  // Actions
  completeDriverOnboarding: (data: {
    name: string;
    city: string;
    callsign: string;
    avatar: string;
    vehicle?: Omit<Vehicle, 'id'>;
  }) => void;
  loginWithDemo: () => void;
  loginWithCredentials: (phone: string, pass: string) => Promise<boolean>;
  logout: () => void;
  toggleJoinCommunity: (communityId: string) => void;
  toggleRegisterTrip: (tripId: string) => void;
  createCommunity: (newComm: Omit<Community, 'id' | 'membersCount' | 'tripsCount' | 'isVerified'>) => void;
  createTrip: (newTrip: Omit<Trip, 'id' | 'currentParticipants' | 'participants' | 'isRegistered'>) => void;
  addVehicleToGarage: (vehicle: Omit<Vehicle, 'id'>) => void;
  markNotificationsAsRead: () => void;
  toggleLikeActivity: (activityId: string) => void;
  addCommentToActivity: (activityId: string, text: string) => void;
  createActivityPost: (
    communityId: string,
    post: {
      title: string;
      content: string;
      type: ActivityType;
      poll?: {
        question: string;
        options: string[];
        category?: 'destination' | 'time' | 'equipment' | 'general';
      };
    }
  ) => void;
  voteOnActivityPoll: (activityId: string, optionId: string) => void;
  voteOnTripPoll: (tripId: string, optionId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<MainTab>('communities');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [trips, setTrips] = useState<Trip[]>(MOCK_TRIPS);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState<boolean>(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [showRadioConsoleModal, setShowRadioConsoleModal] = useState<boolean>(false);
  const [showGoogleDriveModal, setShowGoogleDriveModal] = useState<boolean>(false);
  const [activeDriveTrip, setActiveDriveTrip] = useState<any | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>('الرياض');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activities, setActivities] = useState<CommunityActivity[]>(MOCK_COMMUNITY_ACTIVITIES);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  // Sync document direction and lang attribute
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const completeDriverOnboarding = (data: {
    name: string;
    city: string;
    callsign: string;
    avatar: string;
    vehicle?: Omit<Vehicle, 'id'>;
  }) => {
    setIsAuthenticated(true);
    setHasCompletedOnboarding(true);
    setSelectedCity(data.city);
    setCurrentUser(prev => {
      const newGarage = data.vehicle
        ? [
            {
              ...data.vehicle,
              id: `veh_${Date.now()}`,
              isPrimary: true,
            },
            ...prev.garage.map(v => ({ ...v, isPrimary: false })),
          ]
        : prev.garage;

      return {
        ...prev,
        name: data.name || prev.name,
        city: data.city || prev.city,
        callsign: data.callsign || 'صقر طويق',
        avatar: data.avatar || prev.avatar,
        garage: newGarage,
      };
    });
    setShowOnboardingModal(false);
  };

  const loginWithDemo = () => {
    setIsAuthenticated(true);
    setIsDemoMode(true);
    setHasCompletedOnboarding(true);
    setShowAuthModal(false);
  };

  const loginWithCredentials = async (phone: string, pass: string): Promise<boolean> => {
    // Simulating authentication with validation
    if (phone.length < 8 || pass.length < 4) {
      return false;
    }
    setIsAuthenticated(true);
    setIsDemoMode(false);
    setHasCompletedOnboarding(true);
    setShowAuthModal(false);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsDemoMode(false);
    setHasCompletedOnboarding(false);
    setCurrentTab('communities');
  };

  const toggleJoinCommunity = (communityId: string) => {
    setCommunities(prev =>
      prev.map(comm => {
        if (comm.id === communityId) {
          const isJoining = !comm.isJoined;
          return {
            ...comm,
            isJoined: isJoining,
            membersCount: isJoining ? comm.membersCount + 1 : Math.max(0, comm.membersCount - 1),
          };
        }
        return comm;
      })
    );

    setCurrentUser(prev => {
      const alreadyJoined = prev.joinedCommunityIds.includes(communityId);
      const updated = alreadyJoined
        ? prev.joinedCommunityIds.filter(id => id !== communityId)
        : [...prev.joinedCommunityIds, communityId];
      return {
        ...prev,
        joinedCommunityIds: updated,
        stats: {
          ...prev.stats,
          communitiesCount: updated.length,
        },
      };
    });
  };

  const toggleRegisterTrip = (tripId: string) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id === tripId) {
          const isJoining = !trip.isRegistered;
          const updatedParticipants = isJoining
            ? [
                ...trip.participants,
                {
                  id: currentUser.id,
                  name: currentUser.name,
                  avatar: currentUser.avatar,
                  vehicle: currentUser.garage[0]?.model || 'Land Cruiser 300',
                },
              ]
            : trip.participants.filter(p => p.id !== currentUser.id);

          return {
            ...trip,
            isRegistered: isJoining,
            currentParticipants: isJoining
              ? trip.currentParticipants + 1
              : Math.max(0, trip.currentParticipants - 1),
            participants: updatedParticipants,
          };
        }
        return trip;
      })
    );

    setCurrentUser(prev => {
      const alreadyRegistered = prev.registeredTripIds.includes(tripId);
      const updated = alreadyRegistered
        ? prev.registeredTripIds.filter(id => id !== tripId)
        : [...prev.registeredTripIds, tripId];
      return {
        ...prev,
        registeredTripIds: updated,
      };
    });
  };

  const createCommunity = (
    newComm: Omit<Community, 'id' | 'membersCount' | 'tripsCount' | 'isVerified'>
  ) => {
    const id = `comm_${Date.now()}`;
    const community: Community = {
      ...newComm,
      id,
      membersCount: 1,
      tripsCount: 0,
      isVerified: false,
      isJoined: true,
    };
    setCommunities(prev => [community, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      joinedCommunityIds: [...prev.joinedCommunityIds, id],
      stats: {
        ...prev.stats,
        communitiesCount: prev.stats.communitiesCount + 1,
      },
    }));
  };

  const createTrip = (
    newTrip: Omit<Trip, 'id' | 'currentParticipants' | 'participants' | 'isRegistered'>
  ) => {
    const id = `trip_${Date.now()}`;
    const trip: Trip = {
      ...newTrip,
      id,
      currentParticipants: 1,
      isRegistered: true,
      participants: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          vehicle: currentUser.garage[0]?.model || '4x4 Rig',
        },
      ],
    };
    setTrips(prev => [trip, ...prev]);
    setCurrentUser(prev => ({
      ...prev,
      registeredTripIds: [...prev.registeredTripIds, id],
    }));
  };

  const addVehicleToGarage = (vehicleData: Omit<Vehicle, 'id'>) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: `veh_${Date.now()}`,
    };
    setCurrentUser(prev => ({
      ...prev,
      garage: [newVehicle, ...prev.garage],
    }));
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const toggleLikeActivity = (activityId: string) => {
    setActivities(prev =>
      prev.map(act => {
        if (act.id === activityId) {
          const isLiked = !act.isLiked;
          return {
            ...act,
            isLiked,
            likesCount: isLiked ? act.likesCount + 1 : Math.max(0, act.likesCount - 1),
          };
        }
        return act;
      })
    );
  };

  const addCommentToActivity = (activityId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: `c_${Date.now()}`,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorVehicle: currentUser.garage[0]?.model || '4x4 Rig',
      text: text.trim(),
      time: 'الآن',
    };

    setActivities(prev =>
      prev.map(act => {
        if (act.id === activityId) {
          return {
            ...act,
            comments: [...act.comments, newComment],
          };
        }
        return act;
      })
    );
  };

  const createActivityPost = (
    communityId: string,
    post: {
      title: string;
      content: string;
      type: ActivityType;
      poll?: {
        question: string;
        options: string[];
        category?: 'destination' | 'time' | 'equipment' | 'general';
      };
    }
  ) => {
    const pollData = post.poll && post.poll.options.length >= 2 ? {
      id: `poll_${Date.now()}`,
      question: post.poll.question,
      category: post.poll.category || 'general',
      totalVotes: 1,
      userVotedOptionId: `opt_0`,
      options: post.poll.options.map((opt, idx) => ({
        id: `opt_${idx}`,
        text: opt,
        votesCount: idx === 0 ? 1 : 0,
      })),
      expiresAt: 'خلال 48 ساعة',
    } : undefined;

    const newActivity: CommunityActivity = {
      id: `act_${Date.now()}`,
      communityId,
      type: post.poll ? 'poll' : post.type,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.rankTitle,
      authorVehicle: currentUser.garage[0]?.model || 'Land Cruiser 300',
      time: 'الآن',
      title: post.title,
      content: post.content,
      likesCount: 1,
      isLiked: true,
      comments: [],
      poll: pollData,
    };

    setActivities(prev => [newActivity, ...prev]);
  };

  const voteOnActivityPoll = (activityId: string, optionId: string) => {
    setActivities(prev =>
      prev.map(act => {
        if (act.id !== activityId || !act.poll) return act;

        const currentVotedId = act.poll.userVotedOptionId;
        if (currentVotedId === optionId) return act; // already voted for this option

        const hadVotedBefore = Boolean(currentVotedId);
        const updatedOptions = act.poll.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votesCount: opt.votesCount + 1 };
          }
          if (opt.id === currentVotedId) {
            return { ...opt, votesCount: Math.max(0, opt.votesCount - 1) };
          }
          return opt;
        });

        const newTotalVotes = hadVotedBefore ? act.poll.totalVotes : act.poll.totalVotes + 1;

        return {
          ...act,
          poll: {
            ...act.poll,
            options: updatedOptions,
            totalVotes: newTotalVotes,
            userVotedOptionId: optionId,
          },
        };
      })
    );
  };

  const voteOnTripPoll = (tripId: string, optionId: string) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id !== tripId || !trip.planningPoll) return trip;

        const currentVotedId = trip.planningPoll.userVotedOptionId;
        if (currentVotedId === optionId) return trip;

        const hadVotedBefore = Boolean(currentVotedId);
        const updatedOptions = trip.planningPoll.options.map(opt => {
          if (opt.id === optionId) {
            return { ...opt, votesCount: opt.votesCount + 1 };
          }
          if (opt.id === currentVotedId) {
            return { ...opt, votesCount: Math.max(0, opt.votesCount - 1) };
          }
          return opt;
        });

        const newTotalVotes = hadVotedBefore ? trip.planningPoll.totalVotes : trip.planningPoll.totalVotes + 1;

        return {
          ...trip,
          planningPoll: {
            ...trip.planningPoll,
            options: updatedOptions,
            totalVotes: newTotalVotes,
            userVotedOptionId: optionId,
          },
        };
      })
    );
  };

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        dir,
        isAuthenticated,
        isDemoMode,
        currentUser,
        currentTab,
        setCurrentTab,
        hasCompletedOnboarding,
        setHasCompletedOnboarding,
        showAuthModal,
        setShowAuthModal,
        communities,
        trips,
        notifications,
        unreadNotificationsCount,
        showNotificationsDrawer,
        setShowNotificationsDrawer,
        showOnboardingModal,
        setShowOnboardingModal,
        showRadioConsoleModal,
        setShowRadioConsoleModal,
        showGoogleDriveModal,
        setShowGoogleDriveModal,
        activeDriveTrip,
        setActiveDriveTrip,
        selectedCity,
        setSelectedCity,
        theme,
        setTheme,
        activities,
        completeDriverOnboarding,
        loginWithDemo,
        loginWithCredentials,
        logout,
        toggleJoinCommunity,
        toggleRegisterTrip,
        createCommunity,
        createTrip,
        addVehicleToGarage,
        markNotificationsAsRead,
        toggleLikeActivity,
        addCommentToActivity,
        createActivityPost,
        voteOnActivityPoll,
        voteOnTripPoll,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
