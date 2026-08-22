'use client';

import React, { useState, useEffect } from 'react';
import { useCampusPulse } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { EventModule } from '@/components/EventModule';
import { StudentCirclesModule } from '@/components/StudentCirclesModule';
import { AdminPortalModule } from '@/components/AdminPortalModule';
import { MarketplaceModule } from '@/components/MarketplaceModule';
import { SportsModule } from '@/components/SportsModule';
import { NoticeStreamModule } from '@/components/NoticeStreamModule';
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

      {/* Main Container - Spacious & Organized */}
      <main className="relative z-10 flex-1 w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14 py-7 sm:py-9">
        
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
                  Your unified real-time campus telemetry is active. HackBMU 7.0 flagship sprint, live arena matches, and verified CoE circulars are running live.
                </p>
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

            {/* Spacious 3-Column Organized Grid */}
            <div className="grid gap-6 lg:gap-8 lg:grid-cols-3 items-start">
              
              {/* Column 1: Upcoming Events & Hackathons */}
              <section className="space-y-4 animate-smooth-in stagger-1">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      <Calendar className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-bold text-white">Campus Events</h2>
                      <p className="text-xs text-slate-400">Upcoming fests & workshops</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 glass-pill px-3 py-1.5 rounded-xl transition-all"
                  >
                    <span>View all ({events.length})</span>
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>

                <div className="space-y-3.5">
                  {events.slice(0, 3).map((event) => {
                    const isRegistered = event.rsvpUsers.includes(currentUser.id);
                    return (
                      <div
                        key={event.id}
                        onClick={() => setActiveTab('events')}
                        className="glass-card-luxury p-5 flex flex-col justify-between cursor-pointer group hover:border-teal-500/50"
                      >
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between text-xs font-mono-bmu font-bold uppercase tracking-wider text-slate-400">
                            <span className="text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-lg border border-teal-500/20">
                              {event.category}
                            </span>
                            <span className="text-slate-400">{event.date}</span>
                          </div>

                          <h3 className="font-display font-bold text-base text-white group-hover:text-teal-300 transition-colors line-clamp-1">
                            {event.title}
                          </h3>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-0.5">
                            <span className="flex items-center gap-1.5">
                              <Clock className="size-3.5 text-sky-400" />
                              {event.startTime}
                            </span>
                            <span className="flex items-center gap-1.5 truncate max-w-[150px]">
                              <MapPin className="size-3.5 text-rose-400 shrink-0" />
                              <span className="truncate">{event.venue.split('(')[0]}</span>
                            </span>
                            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                              <Users className="size-3.5" />
                              {event.rsvpCount} Going
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex items-center justify-between gap-3">
                          <span className="text-xs text-slate-400 truncate max-w-[160px]">
                            {event.organizer}
                          </span>
                          <button
                            onClick={(e) => handleHomeRSVP(e, event.id)}
                            className={`btn-spacious text-xs ${
                              isRegistered
                                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                                : 'btn-teal'
                            }`}
                          >
                            {isRegistered ? <><Check className="size-3.5" /> Attending</> : 'RSVP'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Column 2: Live Sports & Turf Radar */}
              <section className="space-y-4 animate-smooth-in stagger-2">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      <Trophy className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-bold text-white">Sports & Arena</h2>
                      <p className="text-xs text-slate-400">Live matches & court booking</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('sports')}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 glass-pill px-3 py-1.5 rounded-xl transition-all"
                  >
                    <span>Courts</span>
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>

                <div className="space-y-3.5">
                  {/* Live Match Card */}
                  <div className="glass-card-luxury p-5 space-y-4 hover:border-orange-500/50">
                    <div className="flex items-center justify-between text-xs font-mono-bmu font-bold uppercase tracking-wider pb-2.5 border-b border-white/[0.08]">
                      <span className="flex items-center gap-2 text-rose-400">
                        <span className="size-2 rounded-full bg-rose-500 animate-ping" />
                        Live on Turf 1
                      </span>
                      <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-md flex items-center gap-1 font-mono">
                        <Radio className="size-3.5 animate-pulse" />
                        LIVE
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03]">
                        <div className="flex items-center gap-2.5">
                          <span className="grid size-7 place-items-center rounded-lg bg-teal-500/20 text-teal-300 font-display text-xs font-bold">
                            {liveMatch && liveMatch.teamA?.name ? liveMatch.teamA.name.slice(0, 2).toUpperCase() : 'H2'}
                          </span>
                          <div>
                            <div className="font-bold text-sm text-white">
                              {liveMatch?.teamA?.name || 'Radhakrishnan H2'}
                            </div>
                            <div className="text-[10px] text-slate-400">{liveMatch?.teamA?.hostel}</div>
                          </div>
                        </div>
                        <span className="font-mono-bmu text-base font-black text-teal-400">
                          {liveMatch?.teamA?.score || '142 / 3'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03]">
                        <div className="flex items-center gap-2.5">
                          <span className="grid size-7 place-items-center rounded-lg bg-slate-800 text-slate-400 font-display text-xs font-bold">
                            {liveMatch && liveMatch.teamB?.name ? liveMatch.teamB.name.slice(0, 2).toUpperCase() : 'H1'}
                          </span>
                          <div>
                            <div className="font-bold text-sm text-slate-200">
                              {liveMatch?.teamB?.name || 'Ramanujan H1'}
                            </div>
                            <div className="text-[10px] text-slate-400">{liveMatch?.teamB?.hostel}</div>
                          </div>
                        </div>
                        <span className="font-mono-bmu text-base font-black text-slate-400">
                          {liveMatch?.teamB?.score || 'Yet to Bat'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Open Facility Turf Slots */}
                  <div className="glass-card-luxury p-5 space-y-3">
                    <div className="text-xs font-mono-bmu font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Available Arena Courts</span>
                      <span className="text-teal-400">Instant Booking</span>
                    </div>

                    <div className="space-y-2">
                      {sportsFacilities.slice(0, 3).map((fac) => {
                        const availableSlot = fac.slots?.find((s) => s.status === 'available')?.time || '07:00 PM';
                        return (
                          <div
                            key={fac.id}
                            onClick={() => setActiveTab('sports')}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] transition-all cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <Dumbbell className="size-4 text-teal-400 shrink-0" />
                              <div>
                                <div className="font-bold text-slate-200 truncate">{fac.name}</div>
                                <div className="text-[10px] text-slate-400 truncate">{fac.location}</div>
                              </div>
                            </div>
                            <span className="text-teal-400 font-mono-bmu font-bold shrink-0 ml-2 bg-teal-500/10 px-2 py-1 rounded-lg border border-teal-500/20">
                              Slot: {availableSlot}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* Column 3: Circulars & Quick Shortcuts */}
              <section className="space-y-4 animate-smooth-in stagger-3">
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Bell className="size-4" />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-bold text-white">Notices & Actions</h2>
                      <p className="text-xs text-slate-400">Official circulars & shortcuts</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 glass-pill px-3 py-1.5 rounded-xl transition-all"
                  >
                    <span>All ({notices.length})</span>
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>

                <div className="space-y-3.5">
                  {/* Official Notices */}
                  <div className="space-y-2.5">
                    {notices.slice(0, 3).map((notice) => {
                      const hasPdf = notice.attachments?.some((a) => a.type === 'PDF');
                      return (
                        <div
                          key={notice.id}
                          onClick={() => setSelectedNotice(notice)}
                          className="glass-card-luxury p-4 flex items-center justify-between gap-3 cursor-pointer group hover:border-sky-500/50"
                        >
                          <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-mono-bmu uppercase font-bold text-slate-400">
                              <span className="text-sky-400">{notice.category.split('&')[0]}</span>
                              <span>•</span>
                              <span className="truncate">{notice.issuer}</span>
                            </div>
                            <div className="font-display text-sm font-bold text-white truncate group-hover:text-sky-300 transition-colors">
                              {notice.title}
                            </div>
                          </div>
                          {hasPdf && (
                            <span className="text-[10px] font-mono bg-blue-500/20 text-sky-300 px-2 py-1 rounded-lg border border-blue-500/30 shrink-0 font-bold">
                              PDF
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Spacious Quick Shortcuts */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div
                      onClick={() => setActiveTab('circles')}
                      className="glass-card-luxury p-3.5 flex flex-col justify-between cursor-pointer group hover:border-sky-500/50"
                    >
                      <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 w-fit border border-sky-500/20 mb-2">
                        <Gamepad2 className="size-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white group-hover:text-sky-300 transition-colors">Student Circles</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Games, jams & groups</div>
                      </div>
                    </div>

                    <div
                      onClick={() => setActiveTab('marketplace')}
                      className="glass-card-luxury p-3.5 flex flex-col justify-between cursor-pointer group hover:border-emerald-500/50"
                    >
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit border border-emerald-500/20 mb-2">
                        <ShoppingBag className="size-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">Marketplace</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">Peer trade & swaps</div>
                      </div>
                    </div>

                    <div
                      onClick={() => setIsAIAssistantOpen(true)}
                      className="glass-card-luxury p-3.5 flex flex-col justify-between cursor-pointer group hover:border-teal-500/50"
                    >
                      <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 w-fit border border-teal-500/20 mb-2">
                        <Sparkles className="size-4" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white group-hover:text-teal-300 transition-colors">Ask Pulse AI</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">AnyModel AI Agent</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
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
        {/* TAB 4: MARKETPLACE & SKILLS */}
        {/* ======================================================== */}
        {activeTab === 'marketplace' && (
          <div className="animate-smooth-in">
            <MarketplaceModule />
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
