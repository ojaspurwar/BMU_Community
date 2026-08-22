'use client';

import React, { useState, useEffect } from 'react';
import { useCampusPulse } from '@/lib/store';
import { ActiveNavTab } from '@/types';
import { focusAudioTracks } from '@/data/mockData';
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Bell,
  Search,
  Phone,
  Sparkles,
  User,
  Headphones,
  Play,
  Pause,
  ShieldAlert,
  ShieldCheck,
  Trophy,
  Gamepad2,
  Menu,
  X,
  CalendarPlus,
  ArrowUpRight,
  Bot,
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenEmergency: () => void;
  onOpenTestModal?: () => void;
}

export function Navbar({ onOpenSearch, onOpenEmergency, onOpenTestModal }: NavbarProps) {
  const {
    currentUser,
    setCurrentUser,
    users,
    activeTab,
    setActiveTab,
    events,
    studentCircles,
    notices,
    sportsMatches,
    isAdmin,
    activeAudioTrack,
    setActiveAudioTrack,
    isPlayingAudio,
    togglePlayAudio,
    audioVolume,
    setAudioVolume,
    activeSOSAlert,
    dismissSOSBeacon,
    setIsProfileModalOpen,
    setIsAIAssistantOpen,
    setIsScheduleModalOpen,
    getUserScheduleList,
  } = useCampusPulse();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && hamburgerOpen) setHamburgerOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hamburgerOpen]);

  const unreadNoticesCount = notices.filter((n) => !n.acknowledgements.includes(currentUser.id)).length;
  const liveMatchesCount = sportsMatches.filter((m) => m.status === 'LIVE').length;
  const currentTrack = focusAudioTracks.find((t) => t.id === activeAudioTrack) || focusAudioTracks[0];

  const handleNavClick = (tab: ActiveNavTab) => {
    setActiveTab(tab);
    setHamburgerOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#060911]/75 backdrop-blur-2xl shadow-xl shadow-black/25">
      {/* SOS Alert Banner */}
      {activeSOSAlert && (
        <div className="bg-rose-600 text-white text-xs py-2 px-4 animate-pulse">
          <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span className="font-bold text-[10px] uppercase bg-black/30 px-2 py-0.5 rounded">SOS</span>
              <span className="truncate">{activeSOSAlert.senderName} ({activeSOSAlert.senderHostel}): {activeSOSAlert.location} — {activeSOSAlert.details}</span>
            </div>
            <button onClick={dismissSOSBeacon} className="bg-black/30 hover:bg-black/50 px-2.5 py-1 rounded text-xs font-bold ml-2">Dismiss</button>
          </div>
        </div>
      )}

      {/* Main Bar - Spacious */}
      <div className="w-full max-w-[1700px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-14">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Brand */}
          <div className="flex items-center space-x-3.5 shrink-0">
            <button
              onClick={() => setHamburgerOpen(!hamburgerOpen)}
              className="grid size-9 place-items-center rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] lg:hidden text-slate-300 hover:text-white transition-colors"
            >
              {hamburgerOpen ? <X className="size-4 text-rose-400" /> : <Menu className="size-4" />}
            </button>

            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleNavClick('today')}
            >
              <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-teal-400 via-emerald-500 to-teal-600 font-display text-sm font-black text-slate-950 shadow-lg shadow-teal-500/25 group-hover:scale-105 group-hover:shadow-teal-500/40 transition-all">
                CP
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-display text-base font-extrabold tracking-tight text-white group-hover:text-teal-300 transition-colors">
                  CampusPulse
                </span>
                <span className="text-[10px] font-mono-bmu font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/25 shadow-sm">
                  BMU OS
                </span>
              </div>
            </div>
          </div>

          {/* Segmented Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-1 bg-white/[0.04] p-1.5 rounded-2xl border border-white/[0.08] backdrop-blur-xl shadow-inner">
            <button
              onClick={() => handleNavClick('today')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'today'
                  ? 'bg-teal-500 text-slate-950 font-extrabold shadow-md shadow-teal-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>Today</span>
            </button>

            <button
              onClick={() => handleNavClick('events')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'events'
                  ? 'bg-teal-500 text-slate-950 font-extrabold shadow-md shadow-teal-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
              }`}
            >
              <Calendar className="size-4" />
              <span>Events</span>
              <span className="text-[10px] bg-slate-900/60 px-1.5 py-0.2 rounded-md font-mono">
                {events.length}
              </span>
            </button>

            {/* Student Circles Tab (Games, Jams, Hangouts) */}
            <button
              onClick={() => handleNavClick('circles')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'circles'
                  ? 'bg-sky-500 text-slate-950 font-extrabold shadow-md shadow-sky-500/20 scale-[1.02]'
                  : 'text-sky-400 hover:text-sky-300 hover:bg-white/[0.06]'
              }`}
            >
              <Gamepad2 className="size-4 text-sky-400 group-hover:animate-pulse" />
              <span>Circles</span>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded-md font-mono font-bold">
                {studentCircles.length}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('marketplace')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-teal-500 text-slate-950 font-extrabold shadow-md shadow-teal-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
              }`}
            >
              <ShoppingBag className="size-4" />
              <span>Market</span>
            </button>

            <button
              onClick={() => handleNavClick('sports')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sports'
                  ? 'bg-teal-500 text-slate-950 font-extrabold shadow-md shadow-teal-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
              }`}
            >
              <Trophy className="size-4" />
              <span>Sports</span>
              {liveMatchesCount > 0 && (
                <span className="size-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('notices')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'notices'
                  ? 'bg-teal-500 text-slate-950 font-extrabold shadow-md shadow-teal-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
              }`}
            >
              <Bell className="size-4" />
              <span>Notices</span>
              {unreadNoticesCount > 0 && (
                <span className="text-[10px] bg-rose-500 text-white px-1.5 py-0.2 rounded-full font-mono font-black">
                  {unreadNoticesCount}
                </span>
              )}
            </button>

            {/* Admin Section Tab */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-500 text-white font-extrabold shadow-md shadow-rose-500/30 scale-[1.02]'
                  : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
              }`}
            >
              <ShieldCheck className="size-4" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Quick Actions & Utilities */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {/* Search Input Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2.5 h-8 w-8 sm:w-auto sm:h-9 px-0 sm:px-3 justify-center sm:justify-start rounded-xl border border-white/[0.09] bg-white/[0.04] text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/[0.08] text-xs transition-all shrink-0"
            >
              <Search className="size-3.5 text-teal-400" />
              <span className="hidden sm:inline text-xs font-medium">Search...</span>
              <kbd className="hidden sm:inline text-[9px] bg-white/10 px-1.5 py-0.5 rounded font-mono text-slate-400">⌘K</kbd>
            </button>

            {/* Ask AI Pill */}
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="flex items-center space-x-1.5 h-8 w-8 sm:w-auto sm:h-9 px-0 sm:px-3 justify-center sm:justify-start rounded-xl bg-gradient-to-r from-teal-500/20 to-sky-500/20 hover:from-teal-500/30 hover:to-sky-500/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition-all shadow-sm shadow-teal-500/10 hover:scale-105 shrink-0"
            >
              <Sparkles className="size-3.5 text-teal-400 animate-pulse" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>

            {/* Calendar */}
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="grid size-8 sm:size-9 shrink-0 place-items-center rounded-xl border border-white/[0.09] bg-white/[0.04] text-slate-300 hover:text-teal-300 hover:border-teal-500/40 hover:bg-white/[0.08] transition-all relative"
              title="My Campus Schedule & Calendar"
            >
              <CalendarPlus className="size-3.5 sm:size-4" />
              {getUserScheduleList().length > 0 && (
                <span className="absolute -top-1 -right-1 size-3.5 sm:size-4 bg-teal-500 text-slate-950 font-mono text-[8px] sm:text-[9px] font-black rounded-full flex items-center justify-center">
                  {getUserScheduleList().length}
                </span>
              )}
            </button>

            {/* Soundscape */}
            <div className="relative shrink-0">
              <button
                onClick={() => setAudioMenuOpen(!audioMenuOpen)}
                className={`grid size-8 sm:size-9 place-items-center rounded-xl border transition-all ${
                  isPlayingAudio
                    ? 'border-teal-500/50 bg-teal-500/20 text-teal-300 shadow-md shadow-teal-500/20'
                    : 'border-white/[0.09] bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
                }`}
                title="Focus Soundscape"
              >
                <Headphones className={`size-3.5 sm:size-4 ${isPlayingAudio ? 'animate-pulse text-teal-400' : ''}`} />
              </button>

              {audioMenuOpen && (
                <div
                  className="absolute right-0 mt-3 w-72 bg-[#0e1628]/95 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50 animate-smooth-in space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-white font-display">Focus Soundscape</span>
                    <button
                      onClick={togglePlayAudio}
                      className="px-2 py-1 rounded-lg text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center space-x-1.5 transition-colors"
                    >
                      {isPlayingAudio ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                      <span>{isPlayingAudio ? 'Pause' : 'Play'}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {focusAudioTracks.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => {
                          setActiveAudioTrack(track.id);
                          if (!isPlayingAudio) togglePlayAudio();
                        }}
                        className={`w-full p-2 rounded-xl text-xs flex items-center justify-between text-left transition-colors ${
                          activeAudioTrack === track.id
                            ? 'bg-teal-500/20 text-teal-200 font-bold border border-teal-500/30'
                            : 'text-slate-400 hover:bg-white/[0.05]'
                        }`}
                      >
                        <span className="truncate">{track.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{track.category}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>Vol</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(Number(e.target.value))}
                      className="w-40 accent-teal-500 cursor-pointer"
                    />
                    <span>{audioVolume}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* SOS */}
            <button
              onClick={onOpenEmergency}
              className="grid size-8 sm:size-9 shrink-0 place-items-center rounded-xl border border-rose-500/40 bg-rose-500/15 text-rose-300 hover:bg-rose-500/30 transition-all font-bold"
              title="Emergency SOS"
            >
              <Phone className="size-3.5 sm:size-4" />
            </button>

            {/* Student Avatar */}
            <div className="relative shrink-0">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="relative grid size-8 sm:size-10 place-items-center rounded-full border-2 border-teal-500/80 bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 font-display text-[10px] sm:text-xs font-black text-slate-950 overflow-hidden hover:scale-105 hover:shadow-[0_0_12px_rgba(20,184,166,0.6)] transition-all"
                title={`CYBER_ID: ${currentUser.rollNo}`}
              >
                {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-[#0e1422] border border-white/10 rounded-xl p-3 shadow-2xl z-50 animate-fade-in space-y-2.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col items-center pb-3 border-b border-white/10 relative">
                    <div className="absolute top-0 right-0 p-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse block"></span>
                    </div>
                    <div className="w-16 h-16 rounded-full border-2 border-teal-500 overflow-hidden mb-2 shadow-[0_0_15px_rgba(20,184,166,0.3)] bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 flex items-center justify-center font-display text-xl font-black text-slate-950">
                      {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="font-mono text-teal-400 text-xs font-bold tracking-widest text-center uppercase">CYBER_ID: {currentUser.rollNo || '808'}</div>
                    <div className="text-[10px] text-slate-400 font-bold tracking-widest text-center mt-0.5 uppercase">STATUS: ENCRYPTED</div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setProfileMenuOpen(false);
                    }}
                    className="w-full py-2 bg-slate-800 border border-teal-500/30 hover:bg-teal-500/20 text-teal-300 text-[11px] uppercase tracking-wider font-bold rounded-lg transition-colors text-center shadow-inner font-mono"
                  >
                    ACCESS PROFILE DIRECTIVE
                  </button>


                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {hamburgerOpen && (
        <div
          className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setHamburgerOpen(false)}
        >
          <div
            className="w-[280px] h-full bg-[#0b1329]/95 border-r border-white/10 p-5 space-y-6 shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-display font-extrabold text-sm text-white flex items-center gap-2">
                <div className="size-6 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center text-[10px]">CP</div>
                CampusPulse
              </span>
              <button onClick={() => setHamburgerOpen(false)} className="p-1 text-slate-400 hover:text-white bg-white/5 rounded-lg">
                <X className="size-4" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              {[
                { id: 'today', label: 'Dashboard', icon: LayoutDashboard },
                { id: 'events', label: 'Events & Fests', icon: Calendar },
                { id: 'circles', label: 'Student Circles', icon: Gamepad2 },
                { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
                { id: 'sports', label: 'Sports Hub', icon: Trophy },
                { id: 'notices', label: 'Circulars', icon: Bell },
                { id: 'admin', label: 'Admin Portal', icon: ShieldCheck },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as ActiveNavTab)}
                    className={`flex items-center space-x-3 p-3 rounded-xl text-sm font-bold transition-all ${
                      activeTab === item.id ? 'bg-teal-500 text-slate-950 shadow-md' : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
