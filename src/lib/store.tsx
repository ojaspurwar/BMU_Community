'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  CampusEvent,
  MarketplaceItem,
  CampusNotice,
  ThemeAccent,
  CampusWeather,
  ActiveNavTab,
  SportsFacility,
  SportsMatch,
  SportsSquadChallenge,
} from '@/types';
import {
  mockUsers,
  initialEvents,
  initialMarketplaceItems,
  initialNotices,
  campusWeatherData,
  initialSportsFacilities,
  initialSportsMatches,
  initialSportsSquadChallenges,
} from '@/data/mockData';

interface SOSAlert {
  id: string;
  senderName: string;
  senderRoll: string;
  senderHostel: string;
  location: string;
  details: string;
  timestamp: string;
}

interface CampusPulseContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  createCustomProfile: (profile: Omit<UserProfile, 'id' | 'reputation'>) => void;
  updateCurrentUserProfile: (profile: Partial<UserProfile>) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  
  // Theme Customization
  themeAccent: ThemeAccent;
  setThemeAccent: (accent: ThemeAccent) => void;
  
  // Audio Focus Player
  activeAudioTrack: string | null;
  setActiveAudioTrack: (id: string | null) => void;
  isPlayingAudio: boolean;
  setIsPlayingAudio: (playing: boolean) => void;
  togglePlayAudio: () => void;
  audioVolume: number;
  setAudioVolume: (vol: number) => void;
  
  // Weather & Live Campus Metrics
  campusWeather: CampusWeather;
  
  // Events
  events: CampusEvent[];
  toggleRSVP: (eventId: string) => void;
  addEvent: (event: Omit<CampusEvent, 'id' | 'rsvpCount' | 'rsvpUsers'>) => void;
  bookmarkedEvents: string[];
  toggleBookmarkEvent: (eventId: string) => void;
  
  // Marketplace
  marketplaceItems: MarketplaceItem[];
  addMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'createdAt' | 'status' | 'saves'>) => void;
  toggleSaveItem: (itemId: string) => void;
  updateItemStatus: (itemId: string, status: 'Available' | 'Reserved' | 'Completed') => void;
  
  // Notices
  notices: CampusNotice[];
  acknowledgeNotice: (noticeId: string) => void;
  addNotice: (notice: Omit<CampusNotice, 'id' | 'publishedAt' | 'acknowledgements'>) => void;
  bookmarkedNotices: string[];
  toggleBookmarkNotice: (noticeId: string) => void;
  
  // Sports Module
  sportsFacilities: SportsFacility[];
  sportsMatches: SportsMatch[];
  sportsSquadChallenges: SportsSquadChallenge[];
  bookCourtSlot: (facilityId: string, slotTime: string) => boolean;
  cheerMatchTeam: (matchId: string, team: 'A' | 'B') => void;
  createSquadChallenge: (challenge: {
    sport: string;
    title: string;
    venue: string;
    time: string;
    playersNeeded: number;
    skillLevel: 'All Levels Welcome' | 'Competitive' | 'Casual Knockabout';
    notes?: string;
  }) => void;
  joinSquadChallenge: (challengeId: string) => void;
  
  // Emergency SOS Beacon
  activeSOSAlert: SOSAlert | null;
  triggerSOSBeacon: (location: string, details: string) => void;
  dismissSOSBeacon: () => void;
  
  // Global Navigation & UI
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const CampusPulseContext = createContext<CampusPulseContextType | undefined>(undefined);

export function CampusPulseProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [currentUser, setCurrentUserState] = useState<UserProfile>(mockUsers[0]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [themeAccent, setThemeAccentState] = useState<ThemeAccent>('tricolor');
  
  const [events, setEvents] = useState<CampusEvent[]>(initialEvents);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<string[]>([]);
  
  const [marketplaceItems, setMarketplaceItems] = useState<MarketplaceItem[]>(initialMarketplaceItems);
  
  const [notices, setNotices] = useState<CampusNotice[]>(initialNotices);
  const [bookmarkedNotices, setBookmarkedNotices] = useState<string[]>([]);
  
  // Sports State
  const [sportsFacilities, setSportsFacilities] = useState<SportsFacility[]>(initialSportsFacilities as SportsFacility[]);
  const [sportsMatches, setSportsMatches] = useState<SportsMatch[]>(initialSportsMatches as SportsMatch[]);
  const [sportsSquadChallenges, setSportsSquadChallenges] = useState<SportsSquadChallenge[]>(initialSportsSquadChallenges as SportsSquadChallenge[]);
  
  // Audio state
  const [activeAudioTrack, setActiveAudioTrack] = useState<string | null>('track-lofi');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioVolume, setAudioVolume] = useState(65);
  
  // SOS beacon state
  const [activeSOSAlert, setActiveSOSAlert] = useState<SOSAlert | null>(null);
  
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('events');
  const [searchQuery, setSearchQuery] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('campuspulse_user');
      const savedUsersList = localStorage.getItem('campuspulse_users_list');
      const savedTheme = localStorage.getItem('campuspulse_theme');
      const savedEvents = localStorage.getItem('campuspulse_events');
      const savedEventBookmarks = localStorage.getItem('campuspulse_event_bm');
      const savedItems = localStorage.getItem('campuspulse_items');
      const savedNotices = localStorage.getItem('campuspulse_notices');
      const savedNoticeBookmarks = localStorage.getItem('campuspulse_notice_bm');
      const savedFacilities = localStorage.getItem('campuspulse_facilities');
      const savedMatches = localStorage.getItem('campuspulse_matches');
      const savedChallenges = localStorage.getItem('campuspulse_challenges');

      if (savedUsersList) setUsers(JSON.parse(savedUsersList));
      if (savedUser) setCurrentUserState(JSON.parse(savedUser));
      if (savedTheme) setThemeAccentState(savedTheme as ThemeAccent);
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedEventBookmarks) setBookmarkedEvents(JSON.parse(savedEventBookmarks));
      if (savedItems) setMarketplaceItems(JSON.parse(savedItems));
      if (savedNotices) setNotices(JSON.parse(savedNotices));
      if (savedNoticeBookmarks) setBookmarkedNotices(JSON.parse(savedNoticeBookmarks));
      if (savedFacilities) setSportsFacilities(JSON.parse(savedFacilities));
      if (savedMatches) setSportsMatches(JSON.parse(savedMatches));
      if (savedChallenges) setSportsSquadChallenges(JSON.parse(savedChallenges));
    } catch (e) {
      console.warn('Could not load stored state:', e);
    }
  }, []);

  // Broadcast Channel setup for multi-tab sync
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;

    const channel = new BroadcastChannel('campuspulse_bmu_sync');
    channel.onmessage = (event) => {
      const { type, payload } = event.data;
      if (type === 'SYNC_THEME') setThemeAccentState(payload);
      if (type === 'SYNC_EVENTS') setEvents(payload);
      if (type === 'SYNC_MARKETPLACE') setMarketplaceItems(payload);
      if (type === 'SYNC_NOTICES') setNotices(payload);
      if (type === 'SYNC_SPORTS_FACILITIES') setSportsFacilities(payload);
      if (type === 'SYNC_SPORTS_MATCHES') setSportsMatches(payload);
      if (type === 'SYNC_SPORTS_CHALLENGES') setSportsSquadChallenges(payload);
      if (type === 'SYNC_SOS') setActiveSOSAlert(payload);
    };

    return () => {
      channel.close();
    };
  }, []);

  const broadcast = useCallback((type: string, payload: unknown) => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('campuspulse_bmu_sync');
        channel.postMessage({ type, payload });
        channel.close();
      } catch (e) {
        console.warn('Broadcast failed', e);
      }
    }
  }, []);

  const setThemeAccent = useCallback((accent: ThemeAccent) => {
    setThemeAccentState(accent);
    try {
      localStorage.setItem('campuspulse_theme', accent);
    } catch (e) {}
    broadcast('SYNC_THEME', accent);
  }, [broadcast]);

  const setCurrentUser = useCallback((user: UserProfile) => {
    setCurrentUserState(user);
    try {
      localStorage.setItem('campuspulse_user', JSON.stringify(user));
    } catch (e) {}
  }, []);

  const createCustomProfile = useCallback((profileData: Omit<UserProfile, 'id' | 'reputation'>) => {
    const newProfile: UserProfile = {
      ...profileData,
      id: `user-custom-${Date.now()}`,
      reputation: 98,
      karmaPoints: 1500,
      studyHoursThisWeek: 18,
    };
    setCurrentUserState(newProfile);
    setUsers((prev) => {
      const updated = [newProfile, ...prev.filter((u) => u.id !== newProfile.id)];
      try {
        localStorage.setItem('campuspulse_users_list', JSON.stringify(updated));
        localStorage.setItem('campuspulse_user', JSON.stringify(newProfile));
      } catch (e) {}
      return updated;
    });
  }, []);

  const updateCurrentUserProfile = useCallback((profileData: Partial<UserProfile>) => {
    setCurrentUserState((prev) => {
      const updated = { ...prev, ...profileData };
      setUsers((uList) => {
        const nextList = uList.map((u) => (u.id === prev.id ? updated : u));
        try {
          localStorage.setItem('campuspulse_users_list', JSON.stringify(nextList));
          localStorage.setItem('campuspulse_user', JSON.stringify(updated));
        } catch (e) {}
        return nextList;
      });
      return updated;
    });
  }, []);

  const togglePlayAudio = useCallback(() => {
    setIsPlayingAudio((prev) => !prev);
  }, []);

  // --- EVENTS ACTIONS ---
  const toggleRSVP = useCallback((eventId: string) => {
    setEvents((prev) => {
      const updated = prev.map((ev) => {
        if (ev.id !== eventId) return ev;
        const alreadyRSVP = ev.rsvpUsers.includes(currentUser.id);
        const newRSVPUsers = alreadyRSVP
          ? ev.rsvpUsers.filter((id) => id !== currentUser.id)
          : [...ev.rsvpUsers, currentUser.id];
        return {
          ...ev,
          rsvpUsers: newRSVPUsers,
          rsvpCount: newRSVPUsers.length,
        };
      });
      try {
        localStorage.setItem('campuspulse_events', JSON.stringify(updated));
      } catch (e) {}
      broadcast('SYNC_EVENTS', updated);
      return updated;
    });
  }, [currentUser.id, broadcast]);

  const toggleBookmarkEvent = useCallback((eventId: string) => {
    setBookmarkedEvents((prev) => {
      const next = prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId];
      try {
        localStorage.setItem('campuspulse_event_bm', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  const addEvent = useCallback((eventData: Omit<CampusEvent, 'id' | 'rsvpCount' | 'rsvpUsers'>) => {
    const newEvent: CampusEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      rsvpCount: 1,
      rsvpUsers: [currentUser.id],
    };
    setEvents((prev) => {
      const updated = [newEvent, ...prev];
      try {
        localStorage.setItem('campuspulse_events', JSON.stringify(updated));
      } catch (e) {}
      broadcast('SYNC_EVENTS', updated);
      return updated;
    });
  }, [currentUser.id, broadcast]);

  // --- MARKETPLACE ACTIONS ---
  const addMarketplaceItem = useCallback(
    (itemData: Omit<MarketplaceItem, 'id' | 'createdAt' | 'status' | 'saves'>) => {
      const newItem: MarketplaceItem = {
        ...itemData,
        id: `item-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'Available',
        saves: [],
      };
      setMarketplaceItems((prev) => {
        const updated = [newItem, ...prev];
        try {
          localStorage.setItem('campuspulse_items', JSON.stringify(updated));
        } catch (e) {}
        broadcast('SYNC_MARKETPLACE', updated);
        return updated;
      });
    },
    [broadcast]
  );

  const toggleSaveItem = useCallback((itemId: string) => {
    setMarketplaceItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id !== itemId) return item;
        const isSaved = item.saves.includes(currentUser.id);
        const newSaves = isSaved
          ? item.saves.filter((id) => id !== currentUser.id)
          : [...item.saves, currentUser.id];
        return { ...item, saves: newSaves };
      });
      try {
        localStorage.setItem('campuspulse_items', JSON.stringify(updated));
      } catch (e) {}
      broadcast('SYNC_MARKETPLACE', updated);
      return updated;
    });
  }, [currentUser.id, broadcast]);

  const updateItemStatus = useCallback((itemId: string, status: 'Available' | 'Reserved' | 'Completed') => {
    setMarketplaceItems((prev) => {
      const updated = prev.map((item) => (item.id === itemId ? { ...item, status } : item));
      try {
        localStorage.setItem('campuspulse_items', JSON.stringify(updated));
      } catch (e) {}
      broadcast('SYNC_MARKETPLACE', updated);
      return updated;
    });
  }, [broadcast]);

  // --- NOTICES ACTIONS ---
  const acknowledgeNotice = useCallback(
    (noticeId: string) => {
      setNotices((prev) => {
        const updated = prev.map((not) => {
          if (not.id !== noticeId) return not;
          const isAcked = not.acknowledgements.includes(currentUser.id);
          const newAcks = isAcked
            ? not.acknowledgements.filter((id) => id !== currentUser.id)
            : [...not.acknowledgements, currentUser.id];
          return { ...not, acknowledgements: newAcks };
        });
        try {
          localStorage.setItem('campuspulse_notices', JSON.stringify(updated));
        } catch (e) {}
        broadcast('SYNC_NOTICES', updated);
        return updated;
      });
    },
    [currentUser.id, broadcast]
  );

  const toggleBookmarkNotice = useCallback((noticeId: string) => {
    setBookmarkedNotices((prev) => {
      const next = prev.includes(noticeId) ? prev.filter((id) => id !== noticeId) : [...prev, noticeId];
      try {
        localStorage.setItem('campuspulse_notice_bm', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }, []);

  const addNotice = useCallback(
    (noticeData: Omit<CampusNotice, 'id' | 'publishedAt' | 'acknowledgements'>) => {
      const newNotice: CampusNotice = {
        ...noticeData,
        id: `not-${Date.now()}`,
        publishedAt: new Date().toISOString(),
        acknowledgements: [currentUser.id],
      };
      setNotices((prev) => {
        const updated = [newNotice, ...prev];
        try {
          localStorage.setItem('campuspulse_notices', JSON.stringify(updated));
        } catch (e) {}
        broadcast('SYNC_NOTICES', updated);
        return updated;
      });
    },
    [currentUser.id, broadcast]
  );

  // --- SPORTS ACTIONS ---
  const bookCourtSlot = useCallback((facilityId: string, slotTime: string): boolean => {
    let success = false;
    setSportsFacilities((prev) => {
      const updated = prev.map((fac) => {
        if (fac.id !== facilityId) return fac;
        const slot = fac.slots.find((s) => s.time === slotTime);
        if (!slot || slot.status === 'booked') return fac;

        success = true;
        const newSlots = fac.slots.map((s) =>
          s.time === slotTime
            ? { ...s, status: 'booked' as const, bookedBy: currentUser.name, bookedHostel: currentUser.hostel }
            : s
        );
        return {
          ...fac,
          slots: newSlots,
          currentOccupancy: Math.min(fac.maxCapacity, fac.currentOccupancy + 2),
        };
      });

      if (success) {
        try {
          localStorage.setItem('campuspulse_facilities', JSON.stringify(updated));
        } catch (e) {}
        broadcast('SYNC_SPORTS_FACILITIES', updated);
      }
      return updated;
    });
    return success;
  }, [currentUser, broadcast]);

  const cheerMatchTeam = useCallback((matchId: string, team: 'A' | 'B') => {
    setSportsMatches((prev) => {
      const updated = prev.map((match) => {
        if (match.id !== matchId) return match;
        if (match.userCheeredTeam === team) return match;

        const nextCheersA = team === 'A' ? match.cheersA + 1 : (match.userCheeredTeam === 'A' ? match.cheersA - 1 : match.cheersA);
        const nextCheersB = team === 'B' ? match.cheersB + 1 : (match.userCheeredTeam === 'B' ? match.cheersB - 1 : match.cheersB);

        return {
          ...match,
          cheersA: nextCheersA,
          cheersB: nextCheersB,
          userCheeredTeam: team,
        };
      });

      try {
        localStorage.setItem('campuspulse_matches', JSON.stringify(updated));
      } catch (e) {}
      broadcast('SYNC_SPORTS_MATCHES', updated);
      return updated;
    });
  }, [broadcast]);

  const createSquadChallenge = useCallback((challengeData: {
    sport: string;
    title: string;
    venue: string;
    time: string;
    playersNeeded: number;
    skillLevel: 'All Levels Welcome' | 'Competitive' | 'Casual Knockabout';
    notes?: string;
  }) => {
    const newChallenge: SportsSquadChallenge = {
      ...challengeData,
      id: `sq-${Date.now()}`,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      creatorHostel: currentUser.hostel,
      joinedPlayers: [
        {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar,
          rollNo: currentUser.rollNo,
        },
      ],
    };

    setSportsSquadChallenges((prev) => {
      const updated = [newChallenge, ...prev];
      try {
        localStorage.setItem('campuspulse_challenges', JSON.stringify(updated));
      } catch (e) {}
      broadcast('SYNC_SPORTS_CHALLENGES', updated);
      return updated;
    });
  }, [currentUser, broadcast]);

  const joinSquadChallenge = useCallback((challengeId: string) => {
    setSportsSquadChallenges((prev) => {
      const updated = prev.map((sq) => {
        if (sq.id !== challengeId) return sq;
        if (sq.joinedPlayers.some((p) => p.id === currentUser.id)) return sq;
        if (sq.playersNeeded <= 0) return sq;

        return {
          ...sq,
          playersNeeded: Math.max(0, sq.playersNeeded - 1),
          joinedPlayers: [
            ...sq.joinedPlayers,
            {
              id: currentUser.id,
              name: currentUser.name,
              avatar: currentUser.avatar,
              rollNo: currentUser.rollNo,
            },
          ],
        };
      });

      try {
        localStorage.setItem('campuspulse_challenges', JSON.stringify(updated));
      } catch (e) {}
      broadcast('SYNC_SPORTS_CHALLENGES', updated);
      return updated;
    });
  }, [currentUser, broadcast]);

  // --- SOS ACTIONS ---
  const triggerSOSBeacon = useCallback(
    (location: string, details: string) => {
      const alert: SOSAlert = {
        id: `sos-${Date.now()}`,
        senderName: currentUser.name,
        senderRoll: currentUser.rollNo,
        senderHostel: currentUser.hostel,
        location,
        details,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setActiveSOSAlert(alert);
      broadcast('SYNC_SOS', alert);
    },
    [currentUser, broadcast]
  );

  const dismissSOSBeacon = useCallback(() => {
    setActiveSOSAlert(null);
    broadcast('SYNC_SOS', null);
  }, [broadcast]);

  return (
    <CampusPulseContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        createCustomProfile,
        updateCurrentUserProfile,
        isProfileModalOpen,
        setIsProfileModalOpen,
        themeAccent,
        setThemeAccent,
        activeAudioTrack,
        setActiveAudioTrack,
        isPlayingAudio,
        setIsPlayingAudio,
        togglePlayAudio,
        audioVolume,
        setAudioVolume,
        campusWeather: campusWeatherData,
        events,
        toggleRSVP,
        addEvent,
        bookmarkedEvents,
        toggleBookmarkEvent,
        marketplaceItems,
        addMarketplaceItem,
        toggleSaveItem,
        updateItemStatus,
        notices,
        acknowledgeNotice,
        addNotice,
        bookmarkedNotices,
        toggleBookmarkNotice,
        sportsFacilities,
        sportsMatches,
        sportsSquadChallenges,
        bookCourtSlot,
        cheerMatchTeam,
        createSquadChallenge,
        joinSquadChallenge,
        activeSOSAlert,
        triggerSOSBeacon,
        dismissSOSBeacon,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </CampusPulseContext.Provider>
  );
}

export function useCampusPulse() {
  const context = useContext(CampusPulseContext);
  if (!context) {
    throw new Error('useCampusPulse must be used within a CampusPulseProvider');
  }
  return context;
}
