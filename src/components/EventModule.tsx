'use client';

import React, { useState } from 'react';
import { useCampusPulse } from '@/lib/store';
import { CampusEvent, EventCategory } from '@/types';
import { generateICS, formatEventDate, openGoogleCalendar } from '@/lib/utils';
import { EventPassModal } from './EventPassModal';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  QrCode,
  CalendarPlus,
  Sparkles,
  Check,
  Search,
  Filter,
  Flame,
  Award,
  X,
  Bookmark,
  Ticket,
  ExternalLink,
  Download,
  Gamepad2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES: ('All' | EventCategory)[] = [
  'All',
  'Coding',
  'Cultural',
  'Workshops',
  'Sports',
  'Academic',
  'Fest',
];

export function EventModule() {
  const {
    events,
    toggleRSVP,
    addEvent,
    currentUser,
    isAdmin,
    setActiveTab,
    bookmarkedEvents,
    toggleBookmarkEvent,
    setIsScheduleModalOpen,
  } = useCampusPulse();

  const [selectedCategory, setSelectedCategory] = useState<'All' | EventCategory>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedPassEvent, setSelectedPassEvent] = useState<CampusEvent | null>(null);

  const filteredEvents = React.useMemo(() => {
    return events.filter((ev) => {
      const matchesCategory = selectedCategory === 'All' || ev.category === selectedCategory;
      const matchesSearch =
        ev.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        ev.organizer.toLowerCase().includes(searchFilter.toLowerCase()) ||
        ev.venue.toLowerCase().includes(searchFilter.toLowerCase()) ||
        ev.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [events, selectedCategory, searchFilter]);

  const featuredEvent = events.find((e) => e.isFeatured) || events[0];

  const handleRSVP = (eventId: string, alreadyRSVP: boolean) => {
    toggleRSVP(eventId);
    if (!alreadyRSVP) {
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#ef4444', '#10b981', '#2563eb', '#38bdf8', '#34d399'],
        });
      } catch (e) {}
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Spotlight Flagship Hero Banner - Crimson Red & Electric Blue theme */}
      {featuredEvent && (
        <div className="relative overflow-hidden glass-panel-luxury border-rose-500/30 p-7 sm:p-9 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md shadow-red-600/30">
                  <Flame className="w-4 h-4 fill-current animate-bounce" />
                  <span>Campus Flagship Spotlight</span>
                </span>
                <span className="text-xs bg-slate-800/90 text-sky-400 font-bold px-3 py-1 rounded-full border border-slate-700">
                  {featuredEvent.category}
                </span>
                <span className="text-xs text-slate-300">
                  Organized by <strong className="text-white font-bold">{featuredEvent.organizer}</strong>
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
                {featuredEvent.title}
              </h2>

              <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed max-w-2xl">
                {featuredEvent.description}
              </p>

              {/* Badges and logistics */}
              <div className="flex flex-wrap items-center gap-3.5 text-xs text-slate-300 pt-1">
                <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60 font-semibold text-slate-200">
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <span>{formatEventDate(featuredEvent.date)}</span>
                </div>

                <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60 font-semibold text-slate-200">
                  <Clock className="w-4 h-4 text-sky-400" />
                  <span>{featuredEvent.startTime}</span>
                </div>

                <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60 font-semibold text-slate-200">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="truncate max-w-[220px]">{featuredEvent.venue}</span>
                </div>

                <div className="flex items-center space-x-2 bg-red-500/15 px-3.5 py-2 rounded-xl border border-red-500/30 text-rose-300 font-bold">
                  <Users className="w-4 h-4 text-rose-400" />
                  <span>{featuredEvent.rsvpCount} Attending</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-4 flex flex-col gap-3.5 justify-center">
              {featuredEvent.rsvpUsers.includes(currentUser.id) ? (
                <div className="space-y-2.5 w-full">
                  <button
                    onClick={() => handleRSVP(featuredEvent.id, true)}
                    className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-2xl shadow-lg transition-all"
                  >
                    <Check className="w-4 h-4" />
                    <span>You're Attending (Cancel)</span>
                  </button>
                  <button
                    onClick={() => setSelectedPassEvent(featuredEvent)}
                    className="w-full flex items-center justify-center space-x-2 bg-slate-800/90 hover:bg-slate-700 text-sky-300 border border-blue-500/30 font-semibold py-3 px-4 rounded-2xl text-xs transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-sky-400" />
                    <span>View Digital QR Entry Pass</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleRSVP(featuredEvent.id, false)}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Instant 1-Click RSVP</span>
                </button>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
                <button
                  onClick={() =>
                    openGoogleCalendar({
                      title: featuredEvent.title,
                      description: featuredEvent.description,
                      venue: featuredEvent.venue,
                      date: featuredEvent.date,
                      startTime: featuredEvent.startTime,
                      endTime: featuredEvent.endTime,
                    })
                  }
                  className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-3 px-3.5 rounded-2xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
                  title="Add directly to Google Calendar in 1-click"
                >
                  <CalendarPlus className="w-4 h-4" />
                  <span>Google Calendar</span>
                </button>

                <button
                  onClick={() =>
                    generateICS({
                      title: featuredEvent.title,
                      description: featuredEvent.description,
                      venue: featuredEvent.venue,
                      date: featuredEvent.date,
                      startTime: featuredEvent.startTime,
                      endTime: featuredEvent.endTime,
                    })
                  }
                  className="w-full flex items-center justify-center space-x-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-300 py-3 px-3.5 rounded-2xl text-xs font-semibold border border-slate-700/60 transition-colors"
                  title="Download offline .ICS calendar file"
                >
                  <Download className="w-4 h-4 text-slate-400" />
                  <span>Download .ICS</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Community Hub Banner vs Admin Mode Notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-transparent border border-sky-500/20 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
            <Gamepad2 className="size-4 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">Student Games, Jams & Informal Meetups</div>
            <div className="text-[11px] text-slate-300">
              Students can host 5v5 Valorant/BGMI games, library study sessions, and dorm meetups in Student Circles.
            </div>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('circles')}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-all shrink-0 hover:scale-105 shadow-md shadow-sky-500/20"
        >
          <span>Open Student Circles</span>
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      {/* Control Bar: Filters, Search, Host Event Button & Schedule List Sync */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 glass-panel-luxury p-5 sm:p-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/25 scale-105'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Action Controls */}
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-sky-300 border border-blue-500/40 text-xs font-bold transition-all shadow-sm"
            title="Open My Campus Schedule & Google Calendar List"
          >
            <CalendarPlus className="w-4 h-4 text-sky-400" />
            <span>My Schedule</span>
          </button>

          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search event, club, speaker..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50"
            />
          </div>


        </div>
      </div>

      {/* Events Grid - Spacious 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredEvents.map((event) => {
          const isRSVPed = event.rsvpUsers.includes(currentUser.id);
          const isBookmarked = bookmarkedEvents.includes(event.id);
          const spotsLeft = event.capacity - event.rsvpCount;

          return (
            <div
              key={event.id}
              className="group flex flex-col justify-between glass-card-luxury p-6 sm:p-7 hover:border-rose-500/50 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Category & Status Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-rose-500/10 text-rose-400 px-3 py-1 rounded-lg border border-rose-500/25">
                      {event.category}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-white/[0.08] font-mono">
                      {event.capacity} cap
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleBookmarkEvent(event.id)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isBookmarked
                          ? 'text-rose-400 bg-rose-500/10'
                          : 'text-slate-500 hover:text-slate-300 bg-slate-800/60'
                      }`}
                      title="Bookmark Event"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    
                    <div className="flex items-center space-x-1 text-[11px] text-slate-400 font-medium">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{spotsLeft > 0 ? `${spotsLeft} left` : 'Housefull'}</span>
                    </div>
                  </div>
                </div>

                {/* Title & Organizer */}
                <div>
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-rose-400 transition-colors leading-snug">
                    {event.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    By <span className="text-slate-300 font-semibold">{event.organizer}</span>
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>

                {/* Speaker if any */}
                {event.speaker && (
                  <div className="text-[11px] bg-slate-950/60 p-2 rounded-xl border border-slate-800 text-slate-300 flex items-start space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{event.speaker}</span>
                  </div>
                )}

                {/* Venue & Schedule */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="font-medium text-slate-200">{formatEventDate(event.date)}</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{event.startTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="text-slate-300 truncate">{event.venue}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {event.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded-md border border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions: RSVP, Pass, Calendar */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleRSVP(event.id, isRSVPed)}
                    className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isRSVPed
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-md shadow-red-600/20'
                    }`}
                  >
                    {isRSVPed ? <Check className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                    <span>{isRSVPed ? 'Attending' : 'RSVP'}</span>
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">
                      {event.rsvpCount}
                    </span>
                  </button>

                  {isRSVPed && (
                    <button
                      onClick={() => setSelectedPassEvent(event)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 transition-colors"
                      title="View Digital QR Entry Pass"
                    >
                      <QrCode className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() =>
                      openGoogleCalendar({
                        title: event.title,
                        description: event.description,
                        venue: event.venue,
                        date: event.date,
                        startTime: event.startTime,
                        endTime: event.endTime,
                      })
                    }
                    className="p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-sky-300 hover:text-white border border-blue-500/30 transition-all flex items-center space-x-1"
                    title="Add directly to Google Calendar (1-Click)"
                  >
                    <CalendarPlus className="w-4 h-4 text-sky-400" />
                  </button>

                  <button
                    onClick={() =>
                      generateICS({
                        title: event.title,
                        description: event.description,
                        venue: event.venue,
                        date: event.date,
                        startTime: event.startTime,
                        endTime: event.endTime,
                      })
                    }
                    className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                    title="Download .ICS file"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>



      {/* QR Event Pass Modal */}
      <EventPassModal
        event={selectedPassEvent}
        user={currentUser}
        onClose={() => setSelectedPassEvent(null)}
      />
    </div>
  );
}

