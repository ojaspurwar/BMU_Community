export type ThemeAccent = 'tricolor' | 'emerald' | 'crimson' | 'sapphire';

export type UserRole = 'student' | 'club_lead' | 'faculty' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  department: string;
  year: string;
  avatar: string;
  hostel: string;
  roomNo: string;
  role?: UserRole;
  reputation: number;
  badges: string[];
  bio?: string;
  skills?: string[];
  telegramOrContact?: string;
  karmaPoints?: number;
  studyHoursThisWeek?: number;
  sportsPlayed?: string[];
}

export type ActiveNavTab = 'today' | 'events' | 'circles' | 'sports' | 'notices' | 'admin';

// --- STUDENT CIRCLES & COMMUNITY MEETUPS (SMALL EVENTS, GAMES, STUDY GROUPS) ---
export type StudentCircleCategory = 'Gaming' | 'Study Jam' | 'Mini-Event' | 'Hangout' | 'Club Group';

export interface StudentCircleMember {
  id: string;
  name: string;
  rollNo: string;
  avatar: string;
  hostel: string;
}

export interface StudentCircle {
  id: string;
  title: string;
  description: string;
  category: StudentCircleCategory;
  hostId: string;
  hostName: string;
  hostRoll: string;
  hostAvatar: string;
  hostHostel: string;
  location: string;
  date: string;
  time: string;
  maxMembers: number;
  joinedMembers: StudentCircleMember[];
  contactInfo?: string;
  tags: string[];
  status: 'Open' | 'Full' | 'Completed';
  createdAt: string;
}

export type EventCategory = 'Coding' | 'Cultural' | 'Sports' | 'Workshops' | 'Academic' | 'Fest';

export interface EventTicketTier {
  id: string;
  name: string;
  price: number;
  perks: string[];
  available: number;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  category: EventCategory;
  organizer: string;
  organizerRole?: string;
  venue: string;
  date: string;
  startTime: string;
  endTime: string;
  bannerGradient: string;
  rsvpCount: number;
  isFeatured?: boolean;
  rsvpUsers: string[];
  tags: string[];
  capacity: number;
  speaker?: string;
  registrationOpen: boolean;
  ticketTiers?: EventTicketTier[];
  discussionCount?: number;
}

export type MarketplaceCategory =
  | 'Textbooks & Notes'
  | 'Hardware & Components'
  | 'Dorm & Electronics'
  | 'Lab Gear'
  | 'Skill Swap';

export type ListingType = 'Sale' | 'Free' | 'Swap' | 'Borrow';

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  category: MarketplaceCategory;
  price: number;
  type: ListingType;
  skillOffer?: string;
  skillRequest?: string;
  condition: 'Brand New' | 'Like New' | 'Good' | 'Fair';
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerHostel: string;
  sellerContact: string;
  images: string[];
  createdAt: string;
  status: 'Available' | 'Reserved' | 'Completed';
  tags: string[];
  saves: string[];
}

export type NoticeCategory =
  | 'Exams & Academic'
  | 'Club Recruitment'
  | 'Placement & Internships'
  | 'Hostel & Mess'
  | 'Administrative'
  | 'Sports';

export type NoticePriority = 'Urgent' | 'Important' | 'General';

export interface NoticeAttachment {
  name: string;
  type: 'PDF' | 'DOC' | 'IMG' | 'LINK';
  size: string;
}

export interface CampusNotice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  issuer: string;
  issuerDesignation: string;
  isVerified: boolean;
  priority: NoticePriority;
  targetBatches: string[];
  publishedAt: string;
  pinned: boolean;
  attachments?: NoticeAttachment[];
  actionLink?: {
    label: string;
    url: string;
  };
  acknowledgements: string[];
  savedBy?: string[];
}

export interface CampusWeather {
  tempCelsius: number;
  condition: string;
  aqi: number;
  aqiStatus: string;
  humidity: number;
  location: string;
}

export interface AudioTrack {
  id: string;
  name: string;
  category: string;
  icon: string;
}

// --- SPORTS MODULE TYPES ---
export type SportsCategory = 'Indoor Complex' | 'Turf & Ground' | 'Courts' | 'Fitness & Gym';

export interface CourtSlot {
  time: string;
  status: 'available' | 'booked' | 'held';
  bookedBy?: string;
  bookedHostel?: string;
}

export interface SportsFacility {
  id: string;
  name: string;
  category: SportsCategory;
  location: string;
  status: 'Open' | 'Booked' | 'Crowded' | 'Maintenance';
  currentOccupancy: number;
  maxCapacity: number;
  timing: string;
  equipmentAvailable: string[];
  slots: CourtSlot[];
  image: string;
  floodlights: boolean;
  rules: string[];
}

export interface SportsMatch {
  id: string;
  title: string;
  tournament: string;
  sport: string;
  teamA: {
    name: string;
    hostel: string;
    score?: string;
    color: string;
  };
  teamB: {
    name: string;
    hostel: string;
    score?: string;
    color: string;
  };
  status: 'LIVE' | 'UPCOMING' | 'COMPLETED';
  venue: string;
  time: string;
  liveDetails: string;
  cheersA: number;
  cheersB: number;
  userCheeredTeam?: 'A' | 'B';
}

export interface SportsSquadChallenge {
  id: string;
  sport: string;
  title: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorHostel: string;
  venue: string;
  time: string;
  playersNeeded: number;
  joinedPlayers: {
    id: string;
    name: string;
    avatar: string;
    rollNo: string;
  }[];
  skillLevel: 'All Levels Welcome' | 'Competitive' | 'Casual Knockabout';
  notes?: string;
}

// --- AI ASSISTANT (OPENROUTER ANYMODEL) TYPES ---
export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  modelUsed?: string;
  isError?: boolean;
}

export interface AIModelPreset {
  id: string;
  name: string;
  provider: string;
  badge: string;
  description: string;
  isCustom?: boolean;
}

// --- USER SCHEDULE & CALENDAR LIST TYPES ---
export interface UserScheduleItem {
  id: string;
  title: string;
  category: 'Event' | 'Sports' | 'Deadline' | 'Task';
  date: string;
  startTime: string;
  endTime?: string;
  venue?: string;
  description?: string;
  sourceId?: string;
  completed?: boolean;
}

