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
import {
  Calendar,
  ShoppingBag,
  Bell,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
  CloudSun,
  Activity,
  Trophy,
} from 'lucide-react';

export default function HomePage() {
  const {
    activeTab,
    setActiveTab,
    events,
    marketplaceItems,
    notices,
    sportsMatches,
    sportsFacilities,
    currentUser,
    campusWeather,
    setIsProfileModalOpen,
  } = useCampusPulse();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);

  // Live countdown to HackBMU 7.0 (Aug 22, 2026 09:00 AM)
  const [timeLeft, setTimeLeft] = useState({ days: 4, hours: 11, mins: 30, secs: 25 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, mins: 59, secs: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, mins: 59, secs: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Stats calculation
  const totalRSVPs = events.reduce((acc, ev) => acc + ev.rsvpCount, 0);
  const totalSwaps = marketplaceItems.filter((i) => i.type === 'Swap').length;
  const unreadNotices = notices.filter((n) => !n.acknowledgements.includes(currentUser.id)).length;
  const liveMatches = sportsMatches.filter((m) => m.status === 'LIVE');

  return (
    <div className="min-h-screen flex flex-col bg-[#06090e] text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Global Navigation Header */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* Main Content Area - Fullscreen Desktop width */}
      <main className="flex-1 w-full max-w-[1700px] mx-auto px-3 sm:px-6 xl:px-12 py-5 sm:py-6 space-y-6 pb-24 lg:pb-12">
        
        {/* Live Campus Telemetry & Event Countdown Banner */}
        <section className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900/90 to-rose-950/40 border border-slate-800/80 shadow-2xl backdrop-blur-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-white shadow-lg shadow-blue-500/20 shrink-0">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
                  BMU Live Telemetry Grid
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-medium">Sidhrawali Campus</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                CampusPulse <span className="bg-gradient-to-r from-sky-400 via-emerald-400 to-rose-400 bg-clip-text text-transparent">BMU Operating System</span>
              </h1>
            </div>
          </div>

          {/* Countdown to HackBMU 7.0 & Telemetry */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
            <div className="bg-slate-950/80 border border-red-500/30 px-3.5 py-2 rounded-2xl flex items-center space-x-3 shadow-inner">
              <div className="flex items-center space-x-1.5 text-xs text-rose-400 font-bold">
                <Flame className="w-4 h-4 fill-rose-500/30 text-rose-400 animate-bounce" />
                <span className="hidden sm:inline">HackBMU 7.0 in:</span>
              </div>
              <div className="flex items-center space-x-1.5 font-mono text-xs font-black text-white">
                <div className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-sky-400">
                  {timeLeft.days}d
                </div>
                <span>:</span>
                <div className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-emerald-400">
                  {timeLeft.hours.toString().padStart(2, '0')}h
                </div>
                <span>:</span>
                <div className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-amber-400">
                  {timeLeft.mins.toString().padStart(2, '0')}m
                </div>
                <span>:</span>
                <div className="bg-slate-900 px-2 py-1 rounded-lg border border-slate-800 text-rose-400">
                  {timeLeft.secs.toString().padStart(2, '0')}s
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-2 rounded-2xl flex items-center space-x-2 text-xs">
              <CloudSun className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold text-slate-200">{campusWeather.tempCelsius}°C</span>
                <span className="text-[10px] text-emerald-400 ml-1.5 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  AQI {campusWeather.aqi} Good
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Real-time 4-Pillar Metric Strip (Events, Market, Sports, Circulars) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* 1. Events (Crimson Red) */}
          <div
            onClick={() => setActiveTab('events')}
            className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 cursor-pointer shadow-lg group ${
              activeTab === 'events'
                ? 'bg-gradient-to-br from-red-950/50 to-slate-900 border-red-500 ring-2 ring-red-500/20'
                : 'bg-slate-900/80 border-slate-800/90 hover:border-red-500/40 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-red-500/15 border border-red-500/30 text-rose-400 group-hover:scale-110 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-rose-400 font-mono">{events.length}</span>
            </div>
            <div className="mt-3.5">
              <div className="text-sm font-black text-slate-100 flex items-center space-x-1">
                <span>Events & Fests</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-rose-400" />
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">
                {totalRSVPs} Confirmed RSVPs
              </div>
            </div>
          </div>

          {/* 2. Marketplace & Skills (Emerald Green) */}
          <div
            onClick={() => setActiveTab('marketplace')}
            className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 cursor-pointer shadow-lg group ${
              activeTab === 'marketplace'
                ? 'bg-gradient-to-br from-emerald-950/50 to-slate-900 border-emerald-500 ring-2 ring-emerald-500/20'
                : 'bg-slate-900/80 border-slate-800/90 hover:border-emerald-500/40 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {marketplaceItems.length}
              </span>
            </div>
            <div className="mt-3.5">
              <div className="text-sm font-black text-slate-100 flex items-center space-x-1">
                <span>Skill & Gear Swap</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400" />
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">
                {totalSwaps} Skill Swaps Active
              </div>
            </div>
          </div>

          {/* 3. Sports & Arena (Amber / Crimson) */}
          <div
            onClick={() => setActiveTab('sports')}
            className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 cursor-pointer shadow-lg group ${
              activeTab === 'sports'
                ? 'bg-gradient-to-br from-amber-950/50 to-slate-900 border-amber-500 ring-2 ring-amber-500/20'
                : 'bg-slate-900/80 border-slate-800/90 hover:border-amber-500/40 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {sportsFacilities.length}
              </span>
            </div>
            <div className="mt-3.5">
              <div className="text-sm font-black text-slate-100 flex items-center space-x-1">
                <span>Sports & Arena Grid</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">
                {liveMatches.length} Live Matches • Courts Open
              </div>
            </div>
          </div>

          {/* 4. Verified Circulars (Cyan & Blue) */}
          <div
            onClick={() => setActiveTab('notices')}
            className={`p-4 sm:p-5 rounded-3xl border transition-all duration-200 cursor-pointer shadow-lg group ${
              activeTab === 'notices'
                ? 'bg-gradient-to-br from-sky-950/50 to-slate-900 border-sky-500 ring-2 ring-sky-500/20'
                : 'bg-slate-900/80 border-slate-800/90 hover:border-sky-500/40 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-2xl bg-sky-500/15 border border-sky-500/30 text-sky-400 group-hover:scale-110 transition-transform">
                <Bell className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-sky-400 font-mono">{notices.length}</span>
            </div>
            <div className="mt-3.5">
              <div className="text-sm font-black text-slate-100 flex items-center space-x-1">
                <span>Verified Circulars</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-sky-400" />
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">
                {unreadNotices} Unread Notices
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Pillar Views (Events, Marketplace, Sports, Circulars) */}
        <section className="animate-fade-in">
          {activeTab === 'events' && <EventModule />}
          {activeTab === 'marketplace' && <MarketplaceModule />}
          {activeTab === 'sports' && <SportsModule />}
          {activeTab === 'notices' && <NoticeStreamModule />}
        </section>
      </main>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <EmergencyQuickDial isOpen={isEmergencyOpen} onClose={() => setIsEmergencyOpen(false)} />
      <ProfileModal />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-8 text-center text-xs text-slate-500">
        <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 xl:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="h-2 w-2 rounded-full bg-rose-500" />
            </div>
            <span className="font-bold text-slate-400">CampusPulse BMU OS</span>
            <span>•</span>
            <span>BML Munjal University, Sidhrawali, NH-48</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <button onClick={() => setIsProfileModalOpen(true)} className="hover:text-sky-400 transition-colors">
              Student ID Card
            </button>
            <button onClick={() => setIsEmergencyOpen(true)} className="hover:text-rose-400 transition-colors">
              SOS Emergency Helpline
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
