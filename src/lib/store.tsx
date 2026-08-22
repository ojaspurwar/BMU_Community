'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  UserProfile,
  UserRole,
  CampusEvent,
  MarketplaceItem,
  CampusNotice,
  StudentCircle,
  StudentCircleCategory,
  ThemeAccent,
  CampusWeather,
  ActiveNavTab,
  SportsFacility,
  SportsMatch,
  SportsSquadChallenge,
  AIChatMessage,
  AIModelPreset,
  UserScheduleItem,
} from '@/types';
import {
  mockUsers,
  initialEvents,
  initialMarketplaceItems,
  initialNotices,
  initialStudentCircles,
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

export const AI_MODEL_PRESETS: AIModelPreset[] = [
  {
    id: 'deepseek/deepseek-chat',
    name: 'DeepSeek V3',
    provider: 'DeepSeek',
    badge: 'Lightning Fast',
    description: 'High-speed reasoning, technical coding & campus guidance.',
  },
  {
    id: 'openai/gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    badge: 'Smart & Crisp',
    description: 'Fast, precise answers for academic, schedule & campus queries.',
  },
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B',
    provider: 'Meta',
    badge: 'Open Source',
    description: 'Open-weight flagship model with balanced general knowledge.',
  },
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badge: 'Deep Reasoning',
    description: 'Nuanced writing, essay help & complex problem solving.',
  },
  {
    id: 'google/gemini-flash-1.5',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    badge: 'Multimodal',
    description: 'Rapid responses with wide context memory.',
  },
  {
    id: 'custom',
    name: 'Custom AnyModel Slug',
    provider: 'OpenRouter 300+ Models',
    badge: 'User Defined',
    description: 'Input any model slug from OpenRouter (e.g. qwen/qwen-2.5-72b-instruct).',
    isCustom: true,
  },
];

const DEFAULT_API_KEY = '';

interface CampusPulseContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  createCustomProfile: (profile: Omit<UserProfile, 'id' | 'reputation'>) => void;
  updateCurrentUserProfile: (profile: Partial<UserProfile>) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  
  // Admin Privileges & Role Management
  isAdmin: boolean;
  setUserRole: (role: UserRole) => void;
  
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
  
  // Official Events (Admin / Council Verified)
  events: CampusEvent[];
  toggleRSVP: (eventId: string) => void;
  addEvent: (event: Omit<CampusEvent, 'id' | 'rsvpCount' | 'rsvpUsers'>) => void;
  deleteEvent: (eventId: string) => void;
  bookmarkedEvents: string[];
  toggleBookmarkEvent: (eventId: string) => void;
  
  // Student Circles (Casual Games, Study Groups, Small Events, Dorm Hangouts)
  studentCircles: StudentCircle[];
  addStudentCircle: (circle: Omit<StudentCircle, 'id' | 'createdAt' | 'joinedMembers' | 'status'>) => void;
  joinStudentCircle: (circleId: string) => void;
  leaveStudentCircle: (circleId: string) => void;
  deleteStudentCircle: (circleId: string) => void;
  
  // Marketplace
  marketplaceItems: MarketplaceItem[];
  addMarketplaceItem: (item: Omit<MarketplaceItem, 'id' | 'createdAt' | 'status' | 'saves'>) => void;
  toggleSaveItem: (itemId: string) => void;
  updateItemStatus: (itemId: string, status: 'Available' | 'Reserved' | 'Completed') => void;
  
  // Notices
  notices: CampusNotice[];
  acknowledgeNotice: (noticeId: string) => void;
  addNotice: (notice: Omit<CampusNotice, 'id' | 'publishedAt' | 'acknowledgements'>) => void;
  deleteNotice: (noticeId: string) => void;
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
  
  // AI Assistant (AnyModel via OpenRouter)
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  aiMessages: AIChatMessage[];
  selectedAIModel: string;
  setSelectedAIModel: (model: string) => void;
  customAIModelSlug: string;
  setCustomAIModelSlug: (slug: string) => void;
  aiApiKey: string;
  setAIApiKey: (key: string) => void;
  isAILoading: boolean;
  sendAIMessage: (userText: string) => Promise<void>;
  clearAIChat: () => void;
  
  // Global Navigation & UI
  activeTab: ActiveNavTab;
  setActiveTab: (tab: ActiveNavTab) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Personal Schedule & Google Calendar Integration
  isScheduleModalOpen: boolean;
  setIsScheduleModalOpen: (open: boolean) => void;
  customScheduleItems: UserScheduleItem[];
  addCustomScheduleItem: (item: Omit<UserScheduleItem, 'id'>) => void;
  removeCustomScheduleItem: (id: string) => void;
  toggleCompleteScheduleItem: (id: string) => void;
  getUserScheduleList: () => UserScheduleItem[];
}

const CampusPulseContext = createContext<CampusPulseContextType | undefined>(undefined);

export function CampusPulseProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<UserProfile[]>(mockUsers);
  const [currentUser, setCurrentUserState] = useState<UserProfile>(mockUsers[0]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('campuspulse_auth') === 'true';
    }
    return false;
  });
  const [themeAccent, setThemeAccentState] = useState<ThemeAccent>('tricolor');

  const setIsAuthenticated = useCallback((val: boolean) => {
    setIsAuthenticatedState(val);
    try {
      localStorage.setItem('campuspulse_auth', val ? 'true' : 'false');
    } catch(e) {}
  }, []);
  
  const [events, setEvents] = useState<CampusEvent[]>(initialEvents);
  const [bookmarkedEvents, setBookmarkedEvents] = useState<string[]>([]);
  
  // Student Circles State (Casual games, study jams, dorm meetups, hobby clubs)
  const [studentCircles, setStudentCircles] = useState<StudentCircle[]>(initialStudentCircles);
  
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
  
  // AI Assistant state
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [selectedAIModel, setSelectedAIModel] = useState<string>('deepseek/deepseek-chat');
  const [customAIModelSlug, setCustomAIModelSlug] = useState<string>('');
  const [aiApiKey, setAIApiKey] = useState<string>('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `👋 **Hi ${mockUsers[0].name.split(' ')[0]}!** I am **BMU Pulse AI**, your real-time campus assistant powered by OpenRouter AnyModel.\n\nAsk me about **HackBMU 7.0**, **Sports Arena Court Bookings**, **Student Circles**, **Peer Skill Swaps**, **CoE Exam Circulars**, or anything related to **BML Munjal University**!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'DeepSeek V3',
    },
  ]);
  
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('today');
  const [searchQuery, setSearchQuery] = useState('');

  // Personal Schedule & Google Calendar list state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [customScheduleItems, setCustomScheduleItems] = useState<UserScheduleItem[]>([
    {
      id: 'task-1',
      title: 'Submit DBMS Lab Assignment & Project Schema',
      category: 'Task',
      date: '2026-08-21',
      startTime: '11:59 PM',
      endTime: '11:59 PM',
      venue: 'Academic Block 2 (SOET Labs)',
      description: 'Submit normalized schema diagrams, E-R model and SQL query scripts to LMS portal.',
      completed: false,
    },
    {
      id: 'task-2',
      title: 'Pick Up IEEE Student Chapter Kit & Pass from SAC',
      category: 'Task',
      date: '2026-08-23',
      startTime: '04:00 PM',
      endTime: '05:00 PM',
      venue: 'Student Activity Centre (SAC)',
      description: 'Collect official IEEE BMU Student Chapter ID card, hackathon stickers and lanyard.',
      completed: false,
    },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('campuspulse_user');
      const savedUsersList = localStorage.getItem('campuspulse_users_list');
      const savedTheme = localStorage.getItem('campuspulse_theme');
      const savedEvents = localStorage.getItem('campuspulse_events');
      const savedEventBookmarks = localStorage.getItem('campuspulse_event_bm');
      const savedCircles = localStorage.getItem('campuspulse_circles');
      const savedItems = localStorage.getItem('campuspulse_items');
      const savedNotices = localStorage.getItem('campuspulse_notices');
      const savedNoticeBookmarks = localStorage.getItem('campuspulse_notice_bm');
      const savedFacilities = localStorage.getItem('campuspulse_facilities');
      const savedMatches = localStorage.getItem('campuspulse_matches');
      const savedChallenges = localStorage.getItem('campuspulse_challenges');
      const savedAIModel = localStorage.getItem('campuspulse_ai_model');
      const savedAICustomSlug = localStorage.getItem('campuspulse_ai_custom');
      const savedAIKey = localStorage.getItem('campuspulse_ai_key');
      const savedAIMessages = localStorage.getItem('campuspulse_ai_messages');
      const savedScheduleItems = localStorage.getItem('campuspulse_schedule_items');

      if (savedUsersList) setUsers(JSON.parse(savedUsersList));
      if (savedUser) setCurrentUserState(JSON.parse(savedUser));
      if (savedTheme) setThemeAccentState(savedTheme as ThemeAccent);
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedEventBookmarks) setBookmarkedEvents(JSON.parse(savedEventBookmarks));
      if (savedCircles) setStudentCircles(JSON.parse(savedCircles));
      if (savedItems) setMarketplaceItems(JSON.parse(savedItems));
      if (savedNotices) setNotices(JSON.parse(savedNotices));
      if (savedNoticeBookmarks) setBookmarkedNotices(JSON.parse(savedNoticeBookmarks));
      if (savedFacilities) setSportsFacilities(JSON.parse(savedFacilities));
      if (savedMatches) setSportsMatches(JSON.parse(savedMatches));
      if (savedChallenges) setSportsSquadChallenges(JSON.parse(savedChallenges));
      if (savedAIModel) setSelectedAIModel(savedAIModel);
      if (savedAICustomSlug) setCustomAIModelSlug(savedAICustomSlug);
      if (savedAIKey) setAIApiKey(savedAIKey);
      if (savedAIMessages) setAiMessages(JSON.parse(savedAIMessages));
      if (savedScheduleItems) setCustomScheduleItems(JSON.parse(savedScheduleItems));
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
      if (type === 'SYNC_STUDENT_CIRCLES') setStudentCircles(payload);
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

  // --- ROLE MANAGEMENT & PRIVILEGES ---
  const isAdmin = Boolean(
    currentUser.role === 'admin' ||
    currentUser.role === 'faculty' ||
    currentUser.role === 'club_lead'
  );

  const setUserRole = useCallback((role: UserRole) => {
    setCurrentUserState((prev) => {
      const updated = { ...prev, role };
      try {
        localStorage.setItem('campuspulse_user', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === currentUser.id ? { ...u, role } : u));
      try {
        localStorage.setItem('campuspulse_users_list', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, [currentUser.id]);


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

  const deleteEvent = useCallback((eventId: string) => {
    setEvents((prev) => {
      const updated = prev.filter((ev) => ev.id !== eventId);
      try {
        localStorage.setItem('campuspulse_events', JSON.stringify(updated));
      } catch (e) {}
      broadcast('SYNC_EVENTS', updated);
      return updated;
    });
  }, [broadcast]);

  // --- STUDENT CIRCLES ACTIONS (COMMUNITY SMALL EVENTS, GAMES, HANGOUTS) ---
  const addStudentCircle = useCallback(
    (circleData: Omit<StudentCircle, 'id' | 'createdAt' | 'joinedMembers' | 'status'>) => {
      const newCircle: StudentCircle = {
        ...circleData,
        id: `circle-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'Open',
        joinedMembers: [
          {
            id: currentUser.id,
            name: currentUser.name,
            rollNo: currentUser.rollNo,
            avatar: currentUser.avatar,
            hostel: currentUser.hostel,
          },
        ],
      };
      setStudentCircles((prev) => {
        const updated = [newCircle, ...prev];
        try {
          localStorage.setItem('campuspulse_circles', JSON.stringify(updated));
        } catch (e) {}
        broadcast('SYNC_STUDENT_CIRCLES', updated);
        return updated;
      });
    },
    [currentUser, broadcast]
  );

  const joinStudentCircle = useCallback(
    (circleId: string) => {
      setStudentCircles((prev) => {
        const updated = prev.map((circle) => {
          if (circle.id !== circleId) return circle;
          const alreadyJoined = circle.joinedMembers.some((m) => m.id === currentUser.id);
          if (alreadyJoined) return circle;
          const updatedMembers = [
            ...circle.joinedMembers,
            {
              id: currentUser.id,
              name: currentUser.name,
              rollNo: currentUser.rollNo,
              avatar: currentUser.avatar,
              hostel: currentUser.hostel,
            },
          ];
          const status = updatedMembers.length >= circle.maxMembers ? ('Full' as const) : ('Open' as const);
          return { ...circle, joinedMembers: updatedMembers, status };
        });
        try {
          localStorage.setItem('campuspulse_circles', JSON.stringify(updated));
        } catch (e) {}
        broadcast('SYNC_STUDENT_CIRCLES', updated);
        return updated;
      });
    },
    [currentUser, broadcast]
  );

  const leaveStudentCircle = useCallback(
    (circleId: string) => {
      setStudentCircles((prev) => {
        const updated = prev.map((circle) => {
          if (circle.id !== circleId) return circle;
          const updatedMembers = circle.joinedMembers.filter((m) => m.id !== currentUser.id);
          const status = updatedMembers.length < circle.maxMembers ? ('Open' as const) : circle.status;
          return { ...circle, joinedMembers: updatedMembers, status };
        });
        try {
          localStorage.setItem('campuspulse_circles', JSON.stringify(updated));
        } catch (e) {}
        broadcast('SYNC_STUDENT_CIRCLES', updated);
        return updated;
      });
    },
    [currentUser.id, broadcast]
  );

  const deleteStudentCircle = useCallback(
    (circleId: string) => {
      setStudentCircles((prev) => {
        const updated = prev.filter((c) => c.id !== circleId);
        try {
          localStorage.setItem('campuspulse_circles', JSON.stringify(updated));
        } catch (e) {}
        broadcast('SYNC_STUDENT_CIRCLES', updated);
        return updated;
      });
    },
    [broadcast]
  );

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

  const deleteNotice = useCallback((noticeId: string) => {
    setNotices((prev) => {
      const updated = prev.filter((not) => not.id !== noticeId);
      try {
        localStorage.setItem('campuspulse_notices', JSON.stringify(updated));
      } catch (e) {}
      broadcast('SYNC_NOTICES', updated);
      return updated;
    });
  }, [broadcast]);

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

  // --- AI ASSISTANT ACTIONS (OPENROUTER ANYMODEL) ---
  const clearAIChat = useCallback(() => {
    const freshMessages: AIChatMessage[] = [
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `👋 **Chat cleared!** How can I assist you with your campus life at **BML Munjal University** today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: selectedAIModel === 'custom' ? customAIModelSlug || 'Custom Model' : selectedAIModel.split('/')[1] || selectedAIModel,
      },
    ];
    setAiMessages(freshMessages);
    try {
      localStorage.setItem('campuspulse_ai_messages', JSON.stringify(freshMessages));
    } catch (e) {}
  }, [selectedAIModel, customAIModelSlug]);

  const sendAIMessage = useCallback(async (userText: string) => {
    if (!userText.trim()) return;

    const activeModelSlug = selectedAIModel === 'custom'
      ? (customAIModelSlug.trim() || 'deepseek/deepseek-chat')
      : selectedAIModel;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: userText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...aiMessages, userMsg];
    setAiMessages(updatedMessages);
    setIsAILoading(true);

    try {
      localStorage.setItem('campuspulse_ai_messages', JSON.stringify(updatedMessages));
    } catch (e) {}

    // Construct BMU Live Campus System Prompt
    const bmuSystemPrompt = `You are "BMU Pulse AI", an intelligent, friendly, and highly capable campus AI assistant for students of BML Munjal University (BMU), located in Sidhrawali, Gurugram (NH-48), Haryana.

CURRENT USER CONTEXT:
- Student Name: ${currentUser.name} (Roll No: ${currentUser.rollNo})
- Department: ${currentUser.department}, Year: ${currentUser.year}
- Residence: ${currentUser.hostel}, Room: ${currentUser.roomNo}
- Karma Points: ${currentUser.karmaPoints || 1500}
- Skills: ${(currentUser.skills || ['Fullstack Dev', 'Python', 'React']).join(', ')}

LIVE CAMPUS REAL-TIME CONTEXT:
- Flagship Event: HackBMU 7.0 (₹3,00,000 prize pool, 36-hour hackathon, starting Aug 22, 2026 at 9:00 AM at Academic Block 2 Auditorium).
- Sports Facilities: Badminton (Courts 1-3 open), Football Turf & Athletics Arena (Floodlit, matches ongoing), Basketball Complex, Fitness Hub Gym, Lawn Tennis, Astroturf Cricket Nets.
- Marketplace: Zero-commission peer trade active (Textbooks, Arduino/ESP32 kits, Lab gear, dorm items) with Skill Swap Matchmaker.
- Official Circulars: Controller of Examinations (CoE) End-Sem registration open, CDC Placement Drive (Google, Deloitte, Hero Group), Warden late-night gate protocol.
- Campus Safety SOS: 24/7 Gate 1 & 2 Security, Campus Ambulance (+91 88000 00001), Warden Desk.

GUIDELINES:
- Provide helpful, accurate, well-formatted answers with markdown (bullet points, bold text, code blocks when applicable).
- Keep a supportive, energetic campus vibe.
- Be concise when answering quick questions, and thorough when asked for explanations or code.
- If asked about booking sports, mention the Sports & Arena tab on CampusPulse.
- If asked about hackathons or events, highlight HackBMU 7.0.`;

    const apiMessages = [
      { role: 'system', content: bmuSystemPrompt },
      ...updatedMessages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    try {
      // First attempt: Local Server Proxy (/api/ai/chat)
      let response: Response | null = null;
      try {
        response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: activeModelSlug,
            messages: apiMessages,
            apiKey: aiApiKey || DEFAULT_API_KEY,
          }),
        });
      } catch (proxyErr) {
        console.warn('Proxy route unavailable, falling back to direct OpenRouter fetch:', proxyErr);
      }

      // Fallback: Direct OpenRouter fetch if proxy is unavailable
      if (!response || !response.ok) {
        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${aiApiKey || DEFAULT_API_KEY}`,
            'HTTP-Referer': window.location.origin || 'http://localhost:4040',
            'X-Title': 'CampusPulse BMU',
          },
          body: JSON.stringify({
            model: activeModelSlug,
            messages: apiMessages,
          }),
        });
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson?.error?.message || `API Error HTTP ${response.status}`);
      }

      const data = await response.json();
      const assistantReply =
        data?.choices?.[0]?.message?.content ||
        'I received your message but could not generate text. Please try again.';

      const assistantMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: activeModelSlug.split('/')[1] || activeModelSlug,
      };

      const finalMessages = [...updatedMessages, assistantMsg];
      setAiMessages(finalMessages);
      try {
        localStorage.setItem('campuspulse_ai_messages', JSON.stringify(finalMessages));
      } catch (e) {}
    } catch (error: any) {
      console.error('AI Request Error:', error);
      const errorMsg: AIChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ **AI Service Notice:** ${error?.message || 'Could not connect to model.'}\n\n*Tip:* Check if the selected OpenRouter model slug \`${activeModelSlug}\` is active, or switch to **DeepSeek V3** or **GPT-4o Mini** in the model selector.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
        modelUsed: activeModelSlug,
      };
      const finalMessages = [...updatedMessages, errorMsg];
      setAiMessages(finalMessages);
    } finally {
      setIsAILoading(false);
    }
  }, [selectedAIModel, customAIModelSlug, aiMessages, currentUser, aiApiKey]);

  // --- USER SCHEDULE & GOOGLE CALENDAR LIST ACTIONS ---
  const addCustomScheduleItem = useCallback((item: Omit<UserScheduleItem, 'id'>) => {
    const newItem: UserScheduleItem = {
      ...item,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setCustomScheduleItems((prev) => {
      const updated = [newItem, ...prev];
      try {
        localStorage.setItem('campuspulse_schedule_items', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const removeCustomScheduleItem = useCallback((id: string) => {
    setCustomScheduleItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('campuspulse_schedule_items', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const toggleCompleteScheduleItem = useCallback((id: string) => {
    setCustomScheduleItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );
      try {
        localStorage.setItem('campuspulse_schedule_items', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  }, []);

  const getUserScheduleList = useCallback((): UserScheduleItem[] => {
    const list: UserScheduleItem[] = [];

    // 1. RSVP'd & Bookmarked Events
    events.forEach((ev) => {
      const isRsvpd = ev.rsvpUsers.includes(currentUser.id);
      const isBm = bookmarkedEvents.includes(ev.id);
      if (isRsvpd || isBm) {
        list.push({
          id: `sched-evt-${ev.id}`,
          title: ev.title,
          category: 'Event',
          date: ev.date,
          startTime: ev.startTime,
          endTime: ev.endTime,
          venue: ev.venue,
          description: ev.description,
          sourceId: ev.id,
          completed: false,
        });
      }
    });

    // 2. Booked Sports Court Slots
    sportsFacilities.forEach((fac) => {
      fac.slots.forEach((slot, idx) => {
        if (
          slot.status === 'booked' &&
          (slot.bookedBy === currentUser.name ||
            slot.bookedBy === 'You' ||
            slot.bookedBy?.toLowerCase().includes(currentUser.name.split(' ')[0].toLowerCase()))
        ) {
          list.push({
            id: `sched-sport-${fac.id}-${idx}`,
            title: `${fac.name} (${slot.time})`,
            category: 'Sports',
            date: '2026-08-20',
            startTime: slot.time.split(' - ')[0] || slot.time,
            endTime: slot.time.split(' - ')[1] || '08:00 PM',
            venue: `${fac.name}, ${fac.location}`,
            description: `Reserved sports court slot at ${fac.name} (${fac.location}) for ${currentUser.name}.`,
            sourceId: fac.id,
            completed: false,
          });
        }
      });
    });

    // 3. Bookmarked Notices & Academic Deadlines
    notices.forEach((not) => {
      if (bookmarkedNotices.includes(not.id)) {
        list.push({
          id: `sched-not-${not.id}`,
          title: `Circular: ${not.title}`,
          category: 'Deadline',
          date: '2026-08-24',
          startTime: '11:59 PM',
          endTime: '11:59 PM',
          venue: `${not.issuer} (${not.issuerDesignation})`,
          description: not.content,
          sourceId: not.id,
          completed: false,
        });
      }
    });

    // 4. Custom User Tasks & Agenda Items
    customScheduleItems.forEach((task) => {
      list.push(task);
    });

    // Sort by date ascending
    return list.sort((a, b) => (a.date > b.date ? 1 : -1));
  }, [events, bookmarkedEvents, sportsFacilities, notices, bookmarkedNotices, customScheduleItems, currentUser]);

  return (
    <CampusPulseContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        createCustomProfile,
        updateCurrentUserProfile,
        isAuthenticated: isAuthenticatedState,
        setIsAuthenticated,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isAdmin,
        setUserRole,
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
        deleteEvent,
        bookmarkedEvents,
        toggleBookmarkEvent,
        studentCircles,
        addStudentCircle,
        joinStudentCircle,
        leaveStudentCircle,
        deleteStudentCircle,
        marketplaceItems,
        addMarketplaceItem,
        toggleSaveItem,
        updateItemStatus,
        notices,
        acknowledgeNotice,
        addNotice,
        deleteNotice,
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
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        aiMessages,
        selectedAIModel,
        setSelectedAIModel,
        customAIModelSlug,
        setCustomAIModelSlug,
        aiApiKey,
        setAIApiKey,
        isAILoading,
        sendAIMessage,
        clearAIChat,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        isScheduleModalOpen,
        setIsScheduleModalOpen,
        customScheduleItems,
        addCustomScheduleItem,
        removeCustomScheduleItem,
        toggleCompleteScheduleItem,
        getUserScheduleList,
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
