'use client';

import React, { useState, useEffect } from 'react';
import { useCampusPulse } from '@/lib/store';
import { ThemeAccent, ActiveNavTab } from '@/types';
import { focusAudioTracks } from '@/data/mockData';
import {
  Calendar,
  ShoppingBag,
  Bell,
  Search,
  PhoneCall,
  Sparkles,
  ChevronDown,
  User,
  CheckCircle2,
  Activity,
  Headphones,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ShieldAlert,
  Flame,
  Award,
  Trophy,
  Menu,
  X,
  UserPlus,
  Radio,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  FlaskConical,
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
    campusWeather,
    setIsProfileModalOpen,
  } = useCampusPulse();

  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [audioMenuOpen, setAudioMenuOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  // ESC key listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && hamburgerOpen) {
        setHamburgerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    if (hamburgerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [hamburgerOpen]);

  // Compute live activity badges
  const unreadNoticesCount = notices.filter((n) => !n.acknowledgements.includes(currentUser.id)).length;
  const liveMatchesCount = sportsMatches.filter((m) => m.status === 'LIVE').length;

  const currentTrack = focusAudioTracks.find((t) => t.id === activeAudioTrack) || focusAudioTracks[0];

  const handleNavClick = (tab: ActiveNavTab) => {
    setActiveTab(tab);
    setHamburgerOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#06090e]/95 backdrop-blur-2xl">
      {/* Active SOS Broadcast Alert if triggered */}
      {activeSOSAlert && (
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs py-2 px-4 sm:px-8 animate-pulse">
          <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <ShieldAlert className="w-4 h-4 shrink-0 text-white animate-bounce" />
              <span className="font-extrabold uppercase tracking-wider text-[11px] bg-black/30 px-2 py-0.5 rounded">
                CAMPUS SOS ALERT
              </span>
              <span className="font-semibold truncate">
                {activeSOSAlert.senderName} ({activeSOSAlert.senderHostel}): {activeSOSAlert.location} — {activeSOSAlert.details}
              </span>
            </div>
            <button
              onClick={dismissSOSBeacon}
              className="bg-black/30 hover:bg-black/50 text-white px-2.5 py-0.5 rounded text-[11px] font-bold shrink-0 ml-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Top Tricolor Micro-Announcement & Campus Ticker for BMU (Full-width) */}
      <div className="bg-gradient-to-r from-blue-900/90 via-emerald-950/80 to-rose-950/90 text-white text-xs py-1.5 px-3 sm:px-8 xl:px-12 border-b border-white/5">
        <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            {/* Tricolor live dots */}
            <div className="flex items-center space-x-1 shrink-0">
              <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="h-2 w-2 rounded-full bg-red-400" />
            </div>
            <span className="font-black uppercase tracking-wider text-[10px] bg-black/40 text-sky-300 px-2 py-0.5 rounded border border-sky-400/20 shrink-0">
              BMU Live
            </span>
            <span className="truncate text-slate-200 text-[11px]">
              HackBMU 7.0 (₹3L Prize Pool) Active • Sports: {liveMatchesCount} Match Live • Temp {campusWeather.tempCelsius}°C (AQI {campusWeather.aqi})
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0 ml-2">
            {/* Test Run Mode Badge / Pop-up Trigger */}
            <button
              onClick={onOpenTestModal}
              className="flex items-center space-x-1 font-extrabold bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/50 text-amber-300 hover:text-amber-100 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] transition-all shadow-sm shadow-amber-500/10"
              title="View Test Run Information & Instructions"
            >
              <FlaskConical className="w-3 h-3 text-amber-400 animate-pulse shrink-0" />
              <span>Test Run</span>
            </button>

            {/* Create Profile button (Desktop) */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hidden md:flex items-center space-x-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-sky-200 border border-blue-500/40 px-2.5 py-0.5 rounded-lg text-[11px] font-bold transition-all"
            >
              <UserPlus className="w-3 h-3 text-sky-400" />
              <span>My Profile</span>
            </button>

            {/* Campus SOS Helpdesk button */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center space-x-1 font-black bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 hover:text-white px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] transition-all"
            >
              <PhoneCall className="w-3 h-3 text-rose-400 animate-pulse shrink-0" />
              <span>SOS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* LEFT: Hamburger Button (Mobile Only) + Brand Logo */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 shrink-0">
            {/* Hamburger Button (Mobile / Tablet Only) */}
            <button
              onClick={() => setHamburgerOpen(!hamburgerOpen)}
              className="flex lg:hidden p-2 sm:p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white transition-all items-center justify-center shadow"
              aria-label="Toggle Mobile Navigation Drawer"
            >
              {hamburgerOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-slate-200" />}
            </button>

            {/* Brand Logo */}
            <div
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
              onClick={() => handleNavClick('events')}
            >
              <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-emerald-500 to-rose-500 text-white font-bold shadow-lg shadow-blue-500/20 p-0.5 shrink-0">
                <div className="w-full h-full bg-[#06090e] rounded-[14px] flex items-center justify-center">
                  <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-sky-400 via-emerald-400 to-rose-400 bg-clip-text text-transparent">
                    BMU
                  </span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-base sm:text-lg text-slate-100 tracking-tight">
                    CampusPulse
                  </span>
                  <span className="hidden xs:inline-block text-[9px] font-black uppercase px-1.5 py-0.2 rounded-full bg-gradient-to-r from-blue-600/30 to-emerald-600/30 text-sky-300 border border-sky-400/30">
                    OS
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onOpenTestModal) onOpenTestModal();
                    }}
                    className="hidden sm:inline-flex items-center space-x-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-all shadow-sm shadow-amber-500/10 cursor-pointer"
                    title="Click for Test Run details"
                  >
                    <FlaskConical className="w-2.5 h-2.5 text-amber-400 animate-pulse" />
                    <span>Test Run</span>
                  </button>
                </div>
                <div className="hidden sm:block text-[10px] text-slate-400 tracking-wide font-medium">
                  BML Munjal University
                </div>
              </div>
            </div>
          </div>

          {/* CENTER: Desktop Navigation Tabs (Events, Marketplace, Sports, Circulars) */}
          <nav className="hidden lg:flex items-center space-x-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/90 shadow-inner">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'events'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Events & Fests</span>
              <span className="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full">
                {events.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Skill & Gear Swap</span>
            </button>

            <button
              onClick={() => setActiveTab('sports')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'sports'
                  ? 'bg-gradient-to-r from-amber-600 via-red-600 to-rose-600 text-white shadow-lg shadow-red-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Sports & Arena</span>
              {liveMatchesCount > 0 && (
                <span className="text-[9px] bg-red-600 text-white font-mono px-1.5 py-0.2 rounded-full animate-pulse">
                  LIVE
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('notices')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'notices'
                  ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-600/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Circulars</span>
              {unreadNoticesCount > 0 && (
                <span className="text-[10px] bg-red-500 text-white font-mono px-1.5 py-0.2 rounded-full">
                  {unreadNoticesCount}
                </span>
              )}
            </button>
          </nav>

          {/* RIGHT: Quick Utility Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5">
            {/* Focus Audio Ambience Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => setAudioMenuOpen(!audioMenuOpen)}
                className={`flex items-center space-x-1.5 p-2 sm:px-3 sm:py-2 rounded-2xl border transition-all text-xs font-bold ${
                  isPlayingAudio
                    ? 'bg-blue-600/20 border-blue-500 text-sky-300 shadow-md shadow-blue-500/20'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title="Focus Audio Ambience"
              >
                <Headphones className={`w-4 h-4 shrink-0 ${isPlayingAudio ? 'text-sky-400 animate-pulse' : ''}`} />
                <span className="hidden xl:inline max-w-[100px] truncate">
                  {isPlayingAudio ? currentTrack.name.split(' ')[0] : 'Audio'}
                </span>
                {isPlayingAudio && (
                  <div className="hidden sm:flex items-end space-x-0.5 h-3">
                    <span className="w-0.5 bg-sky-400 rounded-full wave-bar-1" />
                    <span className="w-0.5 bg-sky-400 rounded-full wave-bar-2" />
                    <span className="w-0.5 bg-sky-400 rounded-full wave-bar-3" />
                  </div>
                )}
              </button>

              {/* Audio Controls Popover */}
              {audioMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl z-50 animate-fade-in space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Headphones className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-extrabold text-white">Focus Soundscape</span>
                    </div>
                    <button
                      onClick={togglePlayAudio}
                      className={`p-1.5 rounded-xl text-xs font-bold flex items-center space-x-1 ${
                        isPlayingAudio
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
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
                        className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between text-left transition-all ${
                          activeAudioTrack === track.id
                            ? 'bg-blue-600/20 border border-blue-500/40 text-sky-300'
                            : 'bg-slate-950/60 hover:bg-slate-800 text-slate-400'
                        }`}
                      >
                        <div className="truncate">
                          <div className="text-slate-200 font-bold truncate">{track.name}</div>
                          <div className="text-[10px] text-slate-500">{track.category}</div>
                        </div>
                        {activeAudioTrack === track.id && isPlayingAudio && (
                          <div className="flex items-end space-x-0.5 h-3 shrink-0">
                            <span className="w-0.5 bg-sky-400 rounded-full wave-bar-1" />
                            <span className="w-0.5 bg-sky-400 rounded-full wave-bar-2" />
                            <span className="w-0.5 bg-sky-400 rounded-full wave-bar-3" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Volume Slider */}
                  <div className="pt-2 border-t border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold">
                      <span>Volume</span>
                      <span>{audioVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Global Search shortcut */}
            <button
              onClick={onOpenSearch}
              className="p-2 sm:px-3 sm:py-2 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors text-xs font-semibold flex items-center space-x-1.5"
              title="Search BMU Campus (⌘K)"
            >
              <Search className="w-4 h-4 text-sky-400 shrink-0" />
              <span className="hidden md:inline">Search</span>
              <kbd className="hidden md:inline-block text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Student Profile Switcher & Creator Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-1.5 p-1 sm:p-1.5 sm:pr-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-xl object-cover ring-1 ring-blue-500/50 shrink-0"
                />
                <span className="hidden xl:inline text-xs font-black text-slate-200 truncate max-w-[90px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
              </button>

              {/* Profile Menu Dropdown */}
              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl z-50 animate-fade-in space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-3 pb-3 border-b border-slate-800">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-blue-500/40"
                    />
                    <div className="truncate">
                      <div className="text-xs font-black text-white truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-sky-400 font-mono font-bold">{currentUser.rollNo}</div>
                      <div className="text-[10px] text-slate-400 truncate">{currentUser.hostel}</div>
                    </div>
                  </div>

                  {/* Create / Edit Custom Profile Action */}
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setProfileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-md shadow-blue-600/20 flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create / Edit My Profile</span>
                  </button>

                  <div className="space-y-1">
                    <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Switch Student Profile
                    </div>
                    {users.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setProfileMenuOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl text-xs flex items-center space-x-2 text-left transition-colors ${
                          u.id === currentUser.id
                            ? 'bg-blue-600/20 text-sky-300 font-bold border border-blue-500/30'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <img src={u.avatar} alt={u.name} className="w-6 h-6 rounded-lg object-cover" />
                        <div className="truncate">
                          <div className="truncate text-xs">{u.name}</div>
                          <div className="text-[9px] text-slate-500 truncate">{u.rollNo}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE HAMBURGER OVERLAY */}
      {hamburgerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto"
          onClick={() => setHamburgerOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 space-y-4 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-emerald-500 to-rose-500 p-0.5 shadow-lg shadow-blue-500/20 shrink-0">
                  <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-black text-xs text-white">
                    BMU
                  </div>
                </div>
                <div>
                  <div className="font-black text-sm text-white">Campus Command Menu</div>
                  <div className="text-[11px] text-slate-400">BMU Mobile Quick Navigation</div>
                </div>
              </div>

              <button
                onClick={() => setHamburgerOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Core Modules in Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* 1. Events */}
              <button
                onClick={() => handleNavClick('events')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 group ${
                  activeTab === 'events'
                    ? 'bg-gradient-to-br from-red-950/60 to-slate-900 border-red-500'
                    : 'bg-slate-950/80 border-slate-800 hover:border-red-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-red-500/20 text-rose-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase bg-red-500/20 text-rose-300 px-2 py-0.5 rounded">
                    {events.length}
                  </span>
                </div>
                <div>
                  <div className="font-extrabold text-xs text-white">Events & Fests</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">HackBMU 7.0</div>
                </div>
              </button>

              {/* 2. Marketplace */}
              <button
                onClick={() => handleNavClick('marketplace')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 group ${
                  activeTab === 'marketplace'
                    ? 'bg-gradient-to-br from-emerald-950/60 to-slate-900 border-emerald-500'
                    : 'bg-slate-950/80 border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                    Free
                  </span>
                </div>
                <div>
                  <div className="font-extrabold text-xs text-white">Skill & Gear</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">Peer Swaps</div>
                </div>
              </button>

              {/* 3. Sports */}
              <button
                onClick={() => handleNavClick('sports')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 group ${
                  activeTab === 'sports'
                    ? 'bg-gradient-to-br from-amber-950/60 to-slate-900 border-amber-500'
                    : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded font-mono">
                    {liveMatchesCount > 0 ? 'LIVE' : 'Courts'}
                  </span>
                </div>
                <div>
                  <div className="font-extrabold text-xs text-white">Sports & Arena</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">Turf & HPL</div>
                </div>
              </button>

              {/* 4. Circulars */}
              <button
                onClick={() => handleNavClick('notices')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 group ${
                  activeTab === 'notices'
                    ? 'bg-gradient-to-br from-sky-950/60 to-slate-900 border-sky-500'
                    : 'bg-slate-950/80 border-slate-800 hover:border-sky-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                    <Bell className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-black uppercase bg-sky-500/20 text-sky-300 px-2 py-0.5 rounded">
                    {unreadNoticesCount}
                  </span>
                </div>
                <div>
                  <div className="font-extrabold text-xs text-white">Circulars</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">CoE & Placement</div>
                </div>
              </button>
            </div>

            {/* Profile Quick Card & SOS */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-3 truncate">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-2xl object-cover ring-2 ring-blue-500/40 shrink-0"
                />
                <div className="truncate">
                  <div className="font-black text-xs text-white truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-sky-400 font-mono font-bold">{currentUser.rollNo}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsProfileModalOpen(true);
                  setHamburgerOpen(false);
                }}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs rounded-xl shrink-0 flex items-center space-x-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (onOpenTestModal) onOpenTestModal();
                setHamburgerOpen(false);
              }}
              className="w-full p-3 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center justify-center space-x-2"
            >
              <FlaskConical className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Test Website Mode & Instructions</span>
            </button>

            <button
              onClick={() => {
                onOpenEmergency();
                setHamburgerOpen(false);
              }}
              className="w-full p-3 rounded-2xl bg-red-950/40 border border-red-500/40 text-rose-200 font-bold text-xs flex items-center justify-center space-x-2"
            >
              <PhoneCall className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Campus 24/7 Safety SOS Helpline</span>
            </button>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM NAVIGATION BAR (Events, Market, Sports, Circulars) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#06090e]/95 border-t border-slate-800 backdrop-blur-xl px-4 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex flex-col items-center p-1 rounded-xl transition-colors ${
            activeTab === 'events' ? 'text-red-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Events</span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`flex flex-col items-center p-1 rounded-xl transition-colors ${
            activeTab === 'marketplace' ? 'text-emerald-400 font-bold' : 'text-slate-400'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Market</span>
        </button>

        <button
          onClick={() => setActiveTab('sports')}
          className={`flex flex-col items-center p-1 rounded-xl transition-colors ${
            activeTab === 'sports' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Sports</span>
        </button>

        <button
          onClick={() => setActiveTab('notices')}
          className={`flex flex-col items-center p-1 rounded-xl transition-colors ${
            activeTab === 'notices' ? 'text-blue-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Circulars</span>
        </button>
      </div>
    </header>
  );
}
