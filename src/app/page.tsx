'use client';

import React, { useState, useEffect } from 'react';
import { useCampusPulse } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
const EventModule = React.lazy(() => import('/src/components/EventModule.tsx').then(m => ({ default: m.EventModule })));
const StudentCirclesModule = React.lazy(() => import('/src/components/StudentCirclesModule.tsx').then(m => ({ default: m.StudentCirclesModule })));
const AdminPortalModule = React.lazy(() => import('/src/components/AdminPortalModule.tsx').then(m => ({ default: m.AdminPortalModule })));
const SportsModule = React.lazy(() => import('/src/components/SportsModule.tsx').then(m => ({ default: m.SportsModule })));
const NoticeStreamModule = React.lazy(() => import('/src/components/NoticeStreamModule.tsx').then(m => ({ default: m.NoticeStreamModule })));
import { ProfileModal } from '@/components/ProfileModal';
import { EmergencyQuickDial } from '@/components/EmergencyQuickDial';
import { GlobalSearchModal } from '@/components/GlobalSearchModal';
import { TestRunModal } from '@/components/TestRunModal';
import { AIAssistantModal } from '@/components/AIAssistantModal';
import { MyScheduleModal } from '@/components/MyScheduleModal';
import { NoticeDetailModal } from '@/components/NoticeDetailModal';
import { AuthPage } from '@/components/AuthPage';
import {
  Calendar,
  ShoppingBag,
  Bell,
  Sparkles,
  ArrowUpRight,
  Clock,
  MapPin,
  Users,
  Trophy,
  Dumbbell,
  Radio,
  Check,
  Megaphone,
  ChevronRight,
  Flame,
  Activity,
  Gamepad2,
  ShieldCheck,
  User,
  GraduationCap,
  Home,
  Shield,
  Fingerprint,
  BookOpen,
  Coffee,
  MessageSquare,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusNotice } from '@/types';

export default function HomePage() {
  const {
    activeTab,
    setActiveTab,
    events,
    toggleRSVP,
    studentCircles,
    marketplaceItems,
    notices,
    sportsMatches,
    sportsFacilities,
    currentUser,
    isAdmin,
    setIsProfileModalOpen,
    setIsAIAssistantOpen,
    setIsScheduleModalOpen,
    isAuthenticated,
  } = useCampusPulse();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<CampusNotice | null>(null);

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem('bmu_test_notice_seen');
      if (!seen) setIsTestModalOpen(true);
    } catch (e) {}
  }, []);

  const totalRSVPs = events.reduce((acc, ev) => acc + ev.rsvpCount, 0);
  const unreadNotices = notices.filter((n) => !n.acknowledgements.includes(currentUser.id)).length;
  const liveMatch = sportsMatches.find((m) => m.status === 'LIVE') || sportsMatches[0];

  const handleHomeRSVP = (e: React.MouseEvent, eventId: string) => {
    e.stopPropagation();
    toggleRSVP(eventId);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#14b8a6', '#38bdf8', '#f97316'],
    });
  };

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="relative min-h-[100dvh] flex flex-col bg-[#060911] text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Ambient Animated Light Orbs for Deep Transparent Atmosphere */}
      <div className="ambient-orb ambient-orb-teal w-[500px] h-[500px] top-[-100px] left-[10%] opacity-40" />
      <div className="ambient-orb ambient-orb-cyan w-[600px] h-[600px] top-[25%] right-[-100px] opacity-35" />
      <div className="ambient-orb ambient-orb-rose w-[450px] h-[450px] bottom-[15%] left-[-50px] opacity-30" />

      {/* Global Header */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenTestModal={() => setIsTestModalOpen(true)}
      />

      <main className="relative z-10 flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 py-7 sm:py-9">
        <React.Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-8 h-8 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div></div>}>
        {/* ======================================================== */}
        {/* TAB 1: TODAY (SPACIOUS & LUXURIOUS OVERVIEW) */}
        {/* ======================================================== */}
        {activeTab === 'today' && (
          <div className="space-y-8 sm:space-y-10 animate-smooth-in">
            {/* Spacious Glass Hero Banner */}
            <div className="glass-panel-luxury p-6 sm:p-9 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 sm:gap-8 relative overflow-hidden">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono-bmu font-bold uppercase tracking-wider text-teal-400">
                  <span className="flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/20 px-3 py-1 rounded-full">
                    <span className="size-2 rounded-full bg-teal-400 animate-ping" />
                    <span>Live Campus Pulse</span>
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-300">Wednesday · 19 August 2026</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">BML Munjal University</span>
                </div>

                <h1 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-snug">
                  Welcome back, <span className="shimmer-text">{currentUser.name}</span>
                </h1>

                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  Your unified real-time campus telemetry is active. Live event radar, active sports matches, and verified academic circulars are syncing.
                </p>

                {/* Secure Cyber-Identity Tags */}
                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs font-bold text-slate-300 shadow-sm">
                    <Fingerprint className="size-3.5 text-teal-400" />
                    <span>ID: {currentUser.rollNo}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs font-bold text-slate-300 shadow-sm">
                    <GraduationCap className="size-3.5 text-sky-400" />
                    <span>{currentUser.department} • {currentUser.year}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs font-bold text-slate-300 shadow-sm">
                    <Home className="size-3.5 text-rose-400" />
                    <span>{currentUser.hostel} • Rm {currentUser.roomNo}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50 text-xs font-bold text-slate-300 shadow-sm capitalize">
                    <Shield className="size-3.5 text-emerald-400" />
                    <span>{currentUser.role?.replace('_', ' ') || 'Student'}</span>
                  </div>
                </div>
              </div>

              {/* 4 Spacious Floating Telemetry Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full lg:w-auto">
                <div className="glass-card-luxury px-3 sm:px-4 py-3.5 text-center sm:min-w-[125px] hover:border-teal-500/40">
                  <div className="text-[11px] font-mono-bmu uppercase font-bold text-teal-400">Campus Pulse</div>
                  <div className="font-mono-bmu text-xl font-black text-white mt-1">84%</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">High Activity</div>
                </div>

                <div className="glass-card-luxury px-3 sm:px-4 py-3.5 text-center sm:min-w-[125px] hover:border-orange-500/40">
                  <div className="text-[11px] font-mono-bmu uppercase font-bold text-orange-400">HackBMU 7.0</div>
                  <div className="font-mono-bmu text-xl font-black text-white mt-1">4d 11h</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">₹3L Prize Pool</div>
                </div>

                <div className="glass-card-luxury px-3 sm:px-4 py-3.5 text-center sm:min-w-[125px] hover:border-sky-500/40">
                  <div className="text-[11px] font-mono-bmu uppercase font-bold text-sky-400">Live Events</div>
                  <div className="font-mono-bmu text-xl font-black text-white mt-1">{events.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{totalRSVPs} RSVPs</div>
                </div>

                <div className="glass-card-luxury px-3 sm:px-4 py-3.5 text-center sm:min-w-[125px] hover:border-rose-500/40">
                  <div className="text-[11px] font-mono-bmu uppercase font-bold text-rose-400">Circulars</div>
                  <div className="font-mono-bmu text-xl font-black text-white mt-1">{unreadNotices}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Unread Notice</div>
                </div>
              </div>
            </div>

            {/* NEW: Minimal "Today at a Glance" detailing below the banner */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-smooth-in" style={{ animationDelay: '0.1s' }}>
              <div className="glass-panel p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <GraduationCap className="size-20" />
                </div>
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <div className="size-2 bg-teal-400 rounded-full" />
                  Your Classes
                </h3>
                <p className="text-sm text-slate-400 mt-1 mb-4">Upcoming schedule for today.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                    <div>
                      <div className="text-sm font-bold text-white">Data Structures</div>
                      <div className="text-xs text-slate-400">Prof. Sharma • Gateway Room 12</div>
                    </div>
                    <div className="text-xs font-mono-bmu text-teal-400 bg-teal-400/10 px-2 py-1 rounded">10:00 AM</div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
                    <div>
                      <div className="text-sm font-bold text-white">OS Internals</div>
                      <div className="text-xs text-slate-400">Dr. Verma • Lab 3</div>
                    </div>
                    <div className="text-xs font-mono-bmu text-slate-400 bg-slate-400/10 px-2 py-1 rounded">01:30 PM</div>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Activity className="size-20" />
                </div>
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <div className="size-2 bg-sky-400 rounded-full" />
                  Quick Tools
                </h3>
                <p className="text-sm text-slate-400 mt-1 mb-4">Fast access to campus resources.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:bg-slate-700/50 hover:border-sky-500/30 transition-all text-slate-300 hover:text-white">
                    <BookOpen className="size-5 text-sky-400" />
                    <span className="text-xs font-semibold">Library</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:bg-slate-700/50 hover:border-sky-500/30 transition-all text-slate-300 hover:text-white">
                    <Coffee className="size-5 text-amber-400" />
                    <span className="text-xs font-semibold">Cafeteria Menu</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:bg-slate-700/50 hover:border-sky-500/30 transition-all text-slate-300 hover:text-white">
                    <Calendar className="size-5 text-purple-400" />
                    <span className="text-xs font-semibold">Academic Cal</span>
                  </button>
                  <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:bg-slate-700/50 hover:border-sky-500/30 transition-all text-slate-300 hover:text-white">
                    <MessageSquare className="size-5 text-rose-400" />
                    <span className="text-xs font-semibold">IT Helpdesk</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: EVENTS & FLAGSHIP FESTS */}
        {/* ======================================================== */}
        {activeTab === 'events' && (
          <div className="animate-smooth-in">
            <EventModule />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: STUDENT CIRCLES & COMMUNITY MEETUPS */}
        {/* ======================================================== */}
        {activeTab === 'circles' && (
          <div className="animate-smooth-in">
            <StudentCirclesModule />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: SPORTS & ARENA */}
        {/* ======================================================== */}
        {activeTab === 'sports' && (
          <div className="animate-smooth-in">
            <SportsModule />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: CIRCULARS & NOTICES */}
        {/* ======================================================== */}
        {activeTab === 'notices' && (
          <div className="animate-smooth-in">
            <NoticeStreamModule />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: ADMIN & MODERATION PORTAL */}
        {/* ======================================================== */}
        {activeTab === 'admin' && (
          <div className="animate-smooth-in">
            <AdminPortalModule />
          </div>
        )}
        </React.Suspense>
      </main>

      {/* Global Modals & Drawers */}
      <AIAssistantModal />
      <MyScheduleModal />
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <EmergencyQuickDial isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
      <ProfileModal />
      {selectedNotice && (
        <NoticeDetailModal notice={selectedNotice} onClose={() => setSelectedNotice(null)} />
      )}
      <TestRunModal
        isOpen={isTestModalOpen}
        onClose={() => {
          setIsTestModalOpen(false);
          try {
            sessionStorage.setItem('bmu_test_notice_seen', 'true');
          } catch (e) {}
        }}
      />

      {/* Spacious Frosted Glass Footer */}
      <footer className="relative z-10 mt-auto border-t border-white/[0.08] bg-[#060911]/80 backdrop-blur-2xl py-8 text-xs text-slate-400">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center space-x-3 text-xs">
            <div className="size-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="font-extrabold text-slate-200 font-display text-sm tracking-tight">CampusPulse • BMU OS</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">BML Munjal University, Sidhrawali, NH-48</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-semibold">
            <button onClick={() => setIsScheduleModalOpen(true)} className="hover:text-teal-300 transition-colors flex items-center gap-1.5">
              <span>Google Calendar Sync</span>
            </button>
            <button onClick={() => setIsAIAssistantOpen(true)} className="hover:text-teal-300 transition-colors flex items-center gap-1.5">
              <span>BMU Pulse AI</span>
            </button>
            <button onClick={() => setIsProfileModalOpen(true)} className="hover:text-teal-300 transition-colors flex items-center gap-1.5">
              <span>Digital ID Card</span>
            </button>
            <button onClick={() => setIsEmergencyOpen(true)} className="hover:text-rose-400 transition-colors flex items-center gap-1.5 font-bold text-rose-400/90">
              <span>SOS Helpdesk</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
