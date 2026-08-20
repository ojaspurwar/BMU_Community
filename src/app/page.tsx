'use client';

import React, { useState, useEffect } from 'react';
import { useCampusPulse } from '@/lib/store';
import { Navbar } from '@/components/Navbar';
import { EventModule } from '@/components/EventModule';
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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusNotice } from '@/types';

export default function HomePage() {
  const {
    activeTab,
    setActiveTab,
    events,
    toggleRSVP,
    marketplaceItems,
    notices,
    sportsMatches,
    sportsFacilities,
    currentUser,
    setIsProfileModalOpen,
    setIsAIAssistantOpen,
    setIsScheduleModalOpen,
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

  return (
    <div className="min-h-screen flex flex-col bg-[#080c14] text-slate-100 selection:bg-teal-500 selection:text-slate-950">
      {/* Global Compact Header */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenTestModal={() => setIsTestModalOpen(true)}
      />

      {/* Main Container - Full Screen Width */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 py-5 animate-in-quick">
        
        {/* ======================================================== */}
        {/* TAB 1: TODAY (COMPACT STYLISH OVERVIEW) */}
        {/* ======================================================== */}
        {activeTab === 'today' && (
          <div className="space-y-5 animate-smooth-in">
            {/* Compact Hero Banner */}
            <div className="hero-compact p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[11px] font-mono-bmu font-bold uppercase tracking-wider text-teal-400">
                  <span className="size-1.5 rounded-full bg-teal-400 animate-ping" />
                  <span>Wednesday · 19 August 2026</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">Sidhrawali Campus</span>
                </div>
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Good morning, {currentUser.name.split(' ')[0]}<span className="text-teal-400">.</span>
                </h1>
                <p className="text-xs text-slate-400 max-w-md">
                  BMU OS is active. HackBMU 7.0 countdown & live turf matches underway.
                </p>
              </div>

              {/* 4 Compact Telemetry Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full md:w-auto">
                <div className="glass-card px-3 py-2 text-center min-w-[100px]">
                  <div className="text-[10px] font-mono-bmu uppercase font-bold text-teal-400">Pulse</div>
                  <div className="font-mono-bmu text-base font-bold text-white">84%</div>
                </div>

                <div className="glass-card px-3 py-2 text-center min-w-[100px]">
                  <div className="text-[10px] font-mono-bmu uppercase font-bold text-orange-400">HackBMU</div>
                  <div className="font-mono-bmu text-base font-bold text-white">4d 11h</div>
                </div>

                <div className="glass-card px-3 py-2 text-center min-w-[100px]">
                  <div className="text-[10px] font-mono-bmu uppercase font-bold text-sky-400">Events</div>
                  <div className="font-mono-bmu text-base font-bold text-white">{events.length} Live</div>
                </div>

                <div className="glass-card px-3 py-2 text-center min-w-[100px]">
                  <div className="text-[10px] font-mono-bmu uppercase font-bold text-rose-400">Notices</div>
                  <div className="font-mono-bmu text-base font-bold text-white">{unreadNotices} New</div>
                </div>
              </div>
            </div>

            {/* Compact 3-Column Grid */}
            <div className="grid gap-4.5 lg:grid-cols-[1.15fr_1fr_0.85fr] xl:grid-cols-[1.25fr_1.05fr_0.85fr]">
              
              {/* Column 1: Upcoming Events */}
              <section className="space-y-3 animate-smooth-in stagger-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-4 text-teal-400" />
                    <h2 className="font-display text-sm font-bold text-white">Campus Events</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('events')}
                    className="text-[11px] font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-0.5"
                  >
                    <span>View all</span>
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {events.slice(0, 3).map((event) => {
                    const isRegistered = event.rsvpUsers.includes(currentUser.id);
                    return (
                      <div
                        key={event.id}
                        onClick={() => setActiveTab('events')}
                        className="glass-card glass-card-teal p-3.5 flex flex-col justify-between cursor-pointer group"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono-bmu font-bold uppercase tracking-wider text-slate-400">
                            <span className="text-teal-400">{event.category}</span>
                            <span>{event.date}</span>
                          </div>

                          <h3 className="font-display font-bold text-sm text-white mt-1 group-hover:text-teal-300 transition-colors line-clamp-1">
                            {event.title}
                          </h3>

                          <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                            <span className="flex items-center gap-1">
                              <Clock className="size-3 text-slate-500" />
                              {event.startTime}
                            </span>
                            <span className="flex items-center gap-1 truncate max-w-[120px]">
                              <MapPin className="size-3 text-slate-500 shrink-0" />
                              <span className="truncate">{event.venue.split('(')[0]}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="size-3 text-slate-500" />
                              {event.rsvpCount}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                          <span className="text-[10px] text-slate-500 truncate max-w-[140px]">
                            {event.organizer}
                          </span>
                          <button
                            onClick={(e) => handleHomeRSVP(e, event.id)}
                            className={`btn-compact ${
                              isRegistered
                                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 text-[11px]'
                                : 'btn-teal text-[11px]'
                            }`}
                          >
                            {isRegistered ? <><Check className="size-3" /> Going</> : 'RSVP'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Column 2: Live Sports & Turf Radar */}
              <section className="space-y-3 animate-smooth-in stagger-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="size-4 text-orange-400" />
                    <h2 className="font-display text-sm font-bold text-white">Live Sports & Turf</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('sports')}
                    className="text-[11px] font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-0.5"
                  >
                    <span>Courts</span>
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {/* Live Match Card */}
                  <div className="glass-card p-3.5 space-y-3">
                    <div className="flex items-center justify-between text-[10px] font-mono-bmu font-bold uppercase tracking-wider pb-2 border-b border-white/[0.06]">
                      <span className="flex items-center gap-1.5 text-rose-400">
                        <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />
                        Live on Turf 1
                      </span>
                      <Radio className="size-3.5 text-rose-400" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="grid size-6 place-items-center rounded-md bg-teal-500/20 text-teal-300 font-display text-[10px] font-bold">
                            {liveMatch && liveMatch.teamA?.name ? liveMatch.teamA.name.slice(0, 2).toUpperCase() : 'H2'}
                          </span>
                          <span className="font-semibold text-xs text-white">
                            {liveMatch?.teamA?.name || 'Radhakrishnan H2'}
                          </span>
                        </div>
                        <span className="font-mono-bmu text-sm font-bold text-teal-400">
                          {liveMatch?.teamA?.score || '142 / 3'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="grid size-6 place-items-center rounded-md bg-slate-800 text-slate-400 font-display text-[10px] font-bold">
                            {liveMatch && liveMatch.teamB?.name ? liveMatch.teamB.name.slice(0, 2).toUpperCase() : 'H1'}
                          </span>
                          <span className="font-semibold text-xs text-slate-300">
                            {liveMatch?.teamB?.name || 'Ramanujan H1'}
                          </span>
                        </div>
                        <span className="font-mono-bmu text-sm font-bold text-slate-400">
                          {liveMatch?.teamB?.score || 'Yet to Bat'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Open Facility Turf Slots */}
                  <div className="glass-card p-3.5 space-y-2">
                    <div className="text-[10px] font-mono-bmu font-bold uppercase tracking-wider text-slate-400">
                      Court Availability
                    </div>

                    <div className="space-y-1.5">
                      {sportsFacilities.slice(0, 2).map((fac) => {
                        const availableSlot = fac.slots?.find((s) => s.status === 'available')?.time || 'Open';
                        return (
                          <div
                            key={fac.id}
                            onClick={() => setActiveTab('sports')}
                            className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] transition-colors cursor-pointer text-xs"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <Dumbbell className="size-3.5 text-teal-400 shrink-0" />
                              <span className="font-semibold text-slate-200 truncate">{fac.name}</span>
                            </div>
                            <span className="text-teal-400 font-mono-bmu font-bold shrink-0 ml-2">
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
              <section className="space-y-3 animate-smooth-in stagger-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Bell className="size-4 text-sky-400" />
                    <h2 className="font-display text-sm font-bold text-white">Notices & Actions</h2>
                  </div>
                  <button
                    onClick={() => setActiveTab('notices')}
                    className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-0.5"
                  >
                    <span>All</span>
                    <ChevronRight className="size-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {/* Official Notices */}
                  <div className="space-y-1.5">
                    {notices.slice(0, 3).map((notice) => {
                      const hasPdf = notice.attachments?.some((a) => a.type === 'PDF');
                      return (
                        <div
                          key={notice.id}
                          onClick={() => setSelectedNotice(notice)}
                          className="glass-card p-3 flex items-center justify-between gap-3 cursor-pointer group"
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 text-[9px] font-mono-bmu uppercase font-bold text-slate-500">
                              <span className="text-teal-400">{notice.category.split('&')[0]}</span>
                              <span>•</span>
                              <span className="truncate">{notice.issuer}</span>
                            </div>
                            <div className="font-display text-xs font-bold text-white truncate mt-0.5 group-hover:text-teal-300">
                              {notice.title}
                            </div>
                          </div>
                          {hasPdf && (
                            <span className="text-[9px] font-mono bg-blue-500/20 text-sky-300 px-1.5 py-0.5 rounded border border-blue-500/30 shrink-0">
                              PDF
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Compact Quick Shortcuts */}
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      onClick={() => setActiveTab('marketplace')}
                      className="glass-card p-2.5 flex flex-col justify-between cursor-pointer group hover:border-emerald-500/40"
                    >
                      <ShoppingBag className="size-4 text-emerald-400 mb-1.5" />
                      <div>
                        <div className="font-bold text-xs text-white">Marketplace</div>
                        <div className="text-[10px] text-slate-500">Peer swaps</div>
                      </div>
                    </div>

                    <div
                      onClick={() => setIsAIAssistantOpen(true)}
                      className="glass-card p-2.5 flex flex-col justify-between cursor-pointer group hover:border-teal-500/40"
                    >
                      <Sparkles className="size-4 text-teal-400 mb-1.5" />
                      <div>
                        <div className="font-bold text-xs text-white">Ask Pulse AI</div>
                        <div className="text-[10px] text-slate-500">DeepSeek / GPT</div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: EVENTS & FESTS */}
        {/* ======================================================== */}
        {activeTab === 'events' && (
          <div className="animate-smooth-in">
            <EventModule />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: MARKETPLACE & SKILLS */}
        {/* ======================================================== */}
        {activeTab === 'marketplace' && (
          <div className="animate-smooth-in">
            <MarketplaceModule />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: SPORTS & ARENA */}
        {/* ======================================================== */}
        {activeTab === 'sports' && (
          <div className="animate-smooth-in">
            <SportsModule />
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: CIRCULARS & NOTICES */}
        {/* ======================================================== */}
        {activeTab === 'notices' && (
          <div className="animate-smooth-in">
            <NoticeStreamModule />
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

      {/* Compact Footer */}
      <footer className="mt-auto border-t border-white/[0.06] bg-[#080c14] py-4 text-xs text-slate-500">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300 font-display">CampusPulse • BMU OS</span>
            <span>•</span>
            <span>BML Munjal University, Sidhrawali</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <button onClick={() => setIsAIAssistantOpen(true)} className="hover:text-teal-300 transition-colors">
              Pulse AI
            </button>
            <button onClick={() => setIsScheduleModalOpen(true)} className="hover:text-teal-300 transition-colors">
              Schedule
            </button>
            <button onClick={() => setIsProfileModalOpen(true)} className="hover:text-teal-300 transition-colors">
              ID Card
            </button>
            <button onClick={() => setIsEmergencyOpen(true)} className="hover:text-rose-400 transition-colors">
              SOS
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
