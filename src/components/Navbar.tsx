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
  Trophy,
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
    notices,
    sportsMatches,
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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#080c14]/85 backdrop-blur-xl">
      {/* SOS Alert Banner */}
      {activeSOSAlert && (
        <div className="bg-rose-600 text-white text-xs py-1.5 px-4 animate-pulse">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
              <span className="font-bold text-[10px] uppercase bg-black/30 px-1.5 py-0.5 rounded">SOS</span>
              <span className="truncate">{activeSOSAlert.senderName} ({activeSOSAlert.senderHostel}): {activeSOSAlert.location} — {activeSOSAlert.details}</span>
            </div>
            <button onClick={dismissSOSBeacon} className="bg-black/30 hover:bg-black/50 px-2 py-0.5 rounded text-[10px] font-bold ml-2">Dismiss</button>
          </div>
        </div>
      )}

      {/* Main Bar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-14 gap-2 sm:gap-4">
          
          {/* Brand */}
          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={() => setHamburgerOpen(!hamburgerOpen)}
              className="grid size-8 place-items-center rounded-lg border border-white/10 bg-white/[0.03] lg:hidden text-slate-300 hover:text-white"
            >
              {hamburgerOpen ? <X className="size-4 text-rose-400" /> : <Menu className="size-4" />}
            </button>

            <div
              className="flex items-center space-x-2.5 cursor-pointer group"
              onClick={() => handleNavClick('today')}
            >
              <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-teal-400 to-emerald-600 font-display text-xs font-black text-slate-950 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                CP
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display text-sm font-bold tracking-tight text-white">
                  CampusPulse
                </span>
                <span className="text-[9px] font-mono-bmu font-bold uppercase tracking-wider text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20">
                  BMU
                </span>
              </div>
            </div>
          </div>

          {/* Segmented Center Navigation Tabs */}
          <nav className="hidden lg:flex items-center space-x-0.5 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] shadow-inner">
            <button
              onClick={() => handleNavClick('today')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'today'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <LayoutDashboard className="size-3.5" />
              <span>Today</span>
            </button>

            <button
              onClick={() => handleNavClick('events')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'events'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Calendar className="size-3.5" />
              <span>Events</span>
              <span className="text-[9px] bg-slate-900/60 px-1 py-0.2 rounded font-mono">
                {events.length}
              </span>
            </button>

            <button
              onClick={() => handleNavClick('marketplace')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <ShoppingBag className="size-3.5" />
              <span>Market</span>
            </button>

            <button
              onClick={() => handleNavClick('sports')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'sports'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Trophy className="size-3.5" />
              <span>Sports</span>
              {liveMatchesCount > 0 && (
                <span className="size-1.5 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            <button
              onClick={() => handleNavClick('notices')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'notices'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Bell className="size-3.5" />
              <span>Notices</span>
              {unreadNoticesCount > 0 && (
                <span className="text-[9px] bg-rose-500 text-white px-1 py-0.2 rounded-full font-mono font-bold">
                  {unreadNoticesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Search Input Trigger */}
            <button
              onClick={onOpenSearch}
              className="flex items-center space-x-2 h-8 px-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:border-white/20 text-xs transition-colors"
            >
              <Search className="size-3.5 text-slate-400" />
              <span className="hidden sm:inline text-[11px]">Search...</span>
              <kbd className="hidden sm:inline text-[9px] bg-white/10 px-1 py-0.2 rounded font-mono text-slate-400">⌘K</kbd>
            </button>

            {/* Ask AI Pill */}
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="flex items-center space-x-1.5 h-8 px-2.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-xs font-bold transition-colors"
            >
              <Sparkles className="size-3.5 text-teal-400" />
              <span className="hidden xs:inline">Ask AI</span>
            </button>

            {/* Calendar */}
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="grid size-8 place-items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-300 hover:text-teal-400 hover:border-teal-500/30 transition-colors"
              title="My Calendar"
            >
              <CalendarPlus className="size-3.5" />
            </button>

            {/* Soundscape */}
            <div className="relative">
              <button
                onClick={() => setAudioMenuOpen(!audioMenuOpen)}
                className={`grid size-8 place-items-center rounded-lg border transition-colors ${
                  isPlayingAudio
                    ? 'border-teal-500/50 bg-teal-500/15 text-teal-300'
                    : 'border-white/[0.08] bg-white/[0.03] text-slate-300 hover:text-white'
                }`}
                title="Focus Soundscape"
              >
                <Headphones className={`size-3.5 ${isPlayingAudio ? 'animate-pulse text-teal-400' : ''}`} />
              </button>

              {audioMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-[#0e1422] border border-white/10 rounded-xl p-3 shadow-2xl z-50 animate-in-quick space-y-2.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-white font-display">Focus Soundscape</span>
                    <button
                      onClick={togglePlayAudio}
                      className="p-1 rounded-md text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center space-x-1"
                    >
                      {isPlayingAudio ? <Pause className="size-3" /> : <Play className="size-3" />}
                      <span>{isPlayingAudio ? 'Pause' : 'Play'}</span>
                    </button>
                  </div>

                  <div className="space-y-1">
                    {focusAudioTracks.map((track) => (
                      <button
                        key={track.id}
                        onClick={() => {
                          setActiveAudioTrack(track.id);
                          if (!isPlayingAudio) togglePlayAudio();
                        }}
                        className={`w-full p-1.5 rounded-lg text-xs flex items-center justify-between text-left ${
                          activeAudioTrack === track.id
                            ? 'bg-teal-500/20 text-teal-200 font-bold border border-teal-500/30'
                            : 'text-slate-400 hover:bg-white/[0.04]'
                        }`}
                      >
                        <span className="truncate">{track.name}</span>
                        <span className="text-[9px] text-slate-500">{track.category}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Vol</span>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(Number(e.target.value))}
                      className="w-36 accent-teal-500"
                    />
                    <span>{audioVolume}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* SOS */}
            <button
              onClick={onOpenEmergency}
              className="grid size-8 place-items-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 transition-colors"
              title="Emergency SOS"
            >
              <Phone className="size-3.5" />
            </button>

            {/* Student Avatar */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 font-display text-xs font-black text-slate-950 hover:scale-105 transition-transform"
                title={`Logged in as ${currentUser.name}`}
              >
                {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-[#0e1422] border border-white/10 rounded-xl p-3 shadow-2xl z-50 animate-in-quick space-y-2.5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-2.5 pb-2 border-b border-white/10">
                    <img src={currentUser.avatar} alt={currentUser.name} className="size-8 rounded-lg object-cover" />
                    <div className="truncate">
                      <div className="font-bold text-xs text-white truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-teal-400 font-mono">{currentUser.rollNo}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setProfileMenuOpen(false);
                    }}
                    className="w-full py-1.5 bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 text-xs font-bold rounded-lg transition-colors text-center"
                  >
                    View Student ID & Profile
                  </button>

                  <div className="space-y-1">
                    <div className="text-[9px] font-bold uppercase text-slate-500 font-mono tracking-wider">
                      Switch Profile
                    </div>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setProfileMenuOpen(false);
                        }}
                        className={`w-full p-1.5 rounded-lg text-xs flex items-center space-x-2 text-left ${
                          u.id === currentUser.id
                            ? 'bg-teal-500/20 text-teal-300 font-bold'
                            : 'hover:bg-white/[0.04] text-slate-300'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="size-5 rounded object-cover" />
                        <span className="truncate text-xs">{u.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {hamburgerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in-quick"
          onClick={() => setHamburgerOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-[#0e1422] border border-white/10 rounded-2xl p-5 space-y-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="font-display font-bold text-sm text-white">CampusPulse Navigation</span>
              <button onClick={() => setHamburgerOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-1">
              {[
                { id: 'today', label: 'Today (Dashboard)', icon: LayoutDashboard },
                { id: 'events', label: 'Events & Fests', icon: Calendar },
                { id: 'marketplace', label: 'Peer Marketplace', icon: ShoppingBag },
                { id: 'sports', label: 'Sports & Turf Booking', icon: Trophy },
                { id: 'notices', label: 'Official Notices', icon: Bell },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id as ActiveNavTab)}
                    className={`flex items-center space-x-2.5 p-2.5 rounded-lg text-xs font-semibold ${
                      activeTab === item.id ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-white/[0.04]'
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
