'use client';

import React, { useState } from 'react';
import { useCampusPulse } from '@/lib/store';
import { SportsFacility, SportsMatch, SportsSquadChallenge, SportsCategory } from '@/types';
import { openGoogleCalendar } from '@/lib/utils';
import {
  Trophy,
  Activity,
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Flame,
  Check,
  Search,
  Filter,
  Sparkles,
  ShieldCheck,
  Dumbbell,
  Heart,
  Zap,
  Radio,
  ChevronRight,
  X,
  Award,
  Sun,
  Moon,
  CalendarPlus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES: ('All' | SportsCategory)[] = [
  'All',
  'Indoor Complex',
  'Turf & Ground',
  'Courts',
  'Fitness & Gym',
];

export function SportsModule() {
  const {
    sportsFacilities,
    sportsMatches,
    sportsSquadChallenges,
    bookCourtSlot,
    cheerMatchTeam,
    createSquadChallenge,
    joinSquadChallenge,
    currentUser,
  } = useCampusPulse();

  const [activeSubTab, setActiveSubTab] = useState<'facilities' | 'matches' | 'squads'>('facilities');
  const [selectedCategory, setSelectedCategory] = useState<'All' | SportsCategory>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [bookingSuccessModal, setBookingSuccessModal] = useState<{ facilityName: string; time: string } | null>(null);
  
  // Challenge Modal State
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [challengeSport, setChallengeSport] = useState('Football');
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeVenue, setChallengeVenue] = useState('Main Floodlit Football Turf');
  const [challengeTime, setChallengeTime] = useState('Tonight 08:30 PM');
  const [challengePlayersNeeded, setChallengePlayersNeeded] = useState(3);
  const [challengeSkill, setChallengeSkill] = useState<'All Levels Welcome' | 'Competitive' | 'Casual Knockabout'>('Competitive');
  const [challengeNotes, setChallengeNotes] = useState('');

  const filteredFacilities = React.useMemo(() => {
    return sportsFacilities.filter((fac) => {
      const matchesCat = selectedCategory === 'All' || fac.category === selectedCategory;
      const matchesSearch =
        fac.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        fac.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
        fac.equipmentAvailable.some((e) => e.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [sportsFacilities, selectedCategory, searchFilter]);

  const handleBookSlot = (facilityId: string, facilityName: string, slotTime: string) => {
    const success = bookCourtSlot(facilityId, slotTime);
    if (success) {
      setBookingSuccessModal({ facilityName, time: slotTime });
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.8 },
          colors: ['#10b981', '#3b82f6', '#ef4444', '#38bdf8'],
        });
      } catch (e) {}
    }
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeTitle.trim()) return;

    createSquadChallenge({
      sport: challengeSport,
      title: challengeTitle.trim(),
      venue: challengeVenue,
      time: challengeTime,
      playersNeeded: Number(challengePlayersNeeded) || 2,
      skillLevel: challengeSkill,
      notes: challengeNotes || undefined,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ef4444', '#10b981', '#3b82f6'],
      });
    } catch (e) {}

    setIsChallengeModalOpen(false);
    setChallengeTitle('');
    setChallengeNotes('');
  };

  const liveMatches = sportsMatches.filter((m) => m.status === 'LIVE');

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Sports & Arena Flagship Hero Banner - Emerald & Crimson Red Cyber */}
      <div className="glass-panel-luxury border-emerald-500/30 p-7 sm:p-9 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center space-x-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md shadow-emerald-600/30">
                <Trophy className="w-4 h-4" />
                <span>BMU Sports Arena Hub</span>
              </span>
              <span className="text-xs text-slate-300 font-semibold">Hostel Premier League & Sangram 2026</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Live Court Booking, Squad Matchups & Tournament League
            </h2>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Reserve indoor badminton courts, book the floodlit football turf, join spontaneous 3v3 basketball pickup games, and cheer for your hostel in real-time.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2 text-xs text-slate-300">
              <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60 font-semibold text-slate-200">
                <Dumbbell className="w-4 h-4 text-sky-400" />
                <span>Gym: <strong className="text-white">38/50 Active</strong></span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700/60 font-semibold text-slate-200">
                <Moon className="w-4 h-4 text-amber-400" />
                <span>Floodlights: <strong className="text-emerald-400">Active until 11 PM</strong></span>
              </div>
              <div className="flex items-center space-x-2 bg-rose-500/15 px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-300 font-bold">
                <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>{liveMatches.length} Live Tournaments</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3 justify-center">
            <button
              onClick={() => setIsChallengeModalOpen(true)}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02]"
            >
              <Zap className="w-4 h-4" />
              <span>Broadcast Squad Challenge</span>
            </button>

            <button
              onClick={() => setActiveSubTab('matches')}
              className="w-full flex items-center justify-center space-x-2 bg-slate-800/90 hover:bg-slate-700 text-sky-300 border border-blue-500/30 font-bold py-3 px-4 rounded-2xl text-xs transition-colors"
            >
              <Activity className="w-4 h-4 text-sky-400" />
              <span>View Live Match Scoreboard ({sportsMatches.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-navigation Tabs: Facilities, Matches, Squad Finder */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel-luxury p-4 sm:p-5">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveSubTab('facilities')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeSubTab === 'facilities'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/25 scale-105'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Court & Arena Booking</span>
            <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-mono font-bold">
              {sportsFacilities.length}
            </span>
          </button>

          <button
            onClick={() => setActiveSubTab('matches')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeSubTab === 'matches'
                ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/25 scale-105'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Live Matches & HPL</span>
            {liveMatches.length > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('squads')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeSubTab === 'squads'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 scale-105'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Squad Finder & Pickups</span>
            <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-mono font-bold">
              {sportsSquadChallenges.length}
            </span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search courts, matches, squad..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50"
          />
        </div>
      </div>

      {/* VIEW 1: FACILITIES & COURT BOOKING */}
      {activeSubTab === 'facilities' && (
        <div className="space-y-8">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 scale-105'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Facilities Cards Grid - Spacious 3 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredFacilities.map((fac) => {
              const occPercent = Math.round((fac.currentOccupancy / fac.maxCapacity) * 100);
              let occColor = 'bg-emerald-500 text-emerald-400';
              if (occPercent > 50) occColor = 'bg-blue-500 text-sky-400';
              if (occPercent > 80) occColor = 'bg-rose-500 text-rose-400';

              return (
                <div
                  key={fac.id}
                  className="flex flex-col justify-between rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-emerald-500/40 p-5 transition-all duration-200 shadow-xl space-y-4 group"
                >
                  <div className="space-y-3.5">
                    {/* Facility Image & Live Status */}
                    <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img
                        src={fac.image}
                        alt={fac.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-xl border border-white/10 text-[10px] font-black uppercase text-emerald-400 flex items-center space-x-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{fac.category}</span>
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-xl border border-white/10 text-[10px] font-bold text-white">
                        {fac.timing.split('(')[0]}
                      </div>
                    </div>

                    {/* Facility Info */}
                    <div>
                      <h3 className="font-extrabold text-base text-slate-100 group-hover:text-emerald-400 transition-colors leading-snug">
                        {fac.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{fac.location}</span>
                      </p>
                    </div>

                    {/* Occupancy Bar */}
                    <div className="bg-slate-950/70 p-2.5 rounded-2xl border border-slate-800 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-semibold">Live Headcount</span>
                        <span className="font-bold text-slate-200">
                          {fac.currentOccupancy} / {fac.maxCapacity} players ({occPercent}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${occColor.split(' ')[0]} rounded-full transition-all duration-500`}
                          style={{ width: `${occPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Equipment Lending Desk */}
                    <div className="space-y-1 text-xs">
                      <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                        Available at Lending Desk
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {fac.equipmentAvailable.map((eq) => (
                          <span
                            key={eq}
                            className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800 font-medium"
                          >
                            ✓ {eq}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Slots Selector */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                        <span>Today's Court Slots</span>
                        <span className="text-emerald-400 font-mono text-[10px]">Instant 1-Click Book</span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5">
                        {fac.slots.slice(0, 4).map((slot, idx) => (
                          <button
                            key={idx}
                            disabled={slot.status === 'booked'}
                            onClick={() => handleBookSlot(fac.id, fac.name, slot.time)}
                            className={`p-2 rounded-xl text-[11px] font-bold text-left transition-all border ${
                              slot.status === 'booked'
                                ? 'bg-slate-950 text-slate-500 border-slate-800 cursor-not-allowed opacity-60'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/25 border-emerald-500/30 text-emerald-300 hover:text-white shadow-sm'
                            }`}
                          >
                            <div className="truncate">{slot.time.split(' ')[0]} - {slot.time.split(' ')[2]}</div>
                            <div className="text-[9px] mt-0.5 truncate font-normal">
                              {slot.status === 'booked' ? `Booked (${slot.bookedBy?.split(' ')[0]})` : '🟢 Open for booking'}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: LIVE MATCHES & HPL LEAGUE */}
      {activeSubTab === 'matches' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sportsMatches.map((match) => {
              const isLive = match.status === 'LIVE';

              return (
                <div
                  key={match.id}
                  className={`rounded-3xl border p-5 space-y-4 shadow-xl ${
                    isLive
                      ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-rose-950/20 border-rose-500/40'
                      : 'bg-slate-900/80 border-slate-800'
                  }`}
                >
                  {/* Status & Tournament */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-sky-400 px-2.5 py-0.5 rounded-lg border border-slate-700">
                      {match.sport}
                    </span>

                    {isLive ? (
                      <span className="flex items-center space-x-1 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md animate-pulse shadow">
                        <Radio className="w-3 h-3 text-white" />
                        <span>LIVE MATCH</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
                        {match.time}
                      </span>
                    )}
                  </div>

                  <div className="text-xs font-bold text-slate-400">{match.tournament}</div>

                  {/* Versus Teams & Scores */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    {/* Team A */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${match.teamA.color}`} />
                        <div>
                          <div className="font-extrabold text-sm text-slate-100">{match.teamA.name}</div>
                          <div className="text-[10px] text-slate-400">{match.teamA.hostel}</div>
                        </div>
                      </div>
                      <div className="text-xl font-black text-white font-mono">{match.teamA.score || '—'}</div>
                    </div>

                    <div className="h-px bg-slate-800/80" />

                    {/* Team B */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${match.teamB.color}`} />
                        <div>
                          <div className="font-extrabold text-sm text-slate-100">{match.teamB.name}</div>
                          <div className="text-[10px] text-slate-400">{match.teamB.hostel}</div>
                        </div>
                      </div>
                      <div className="text-xl font-black text-white font-mono">{match.teamB.score || '—'}</div>
                    </div>
                  </div>

                  {/* Live Commentary / Match Details */}
                  <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
                    "{match.liveDetails}"
                  </p>

                  <div className="text-xs text-slate-400 flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span className="truncate">{match.venue}</span>
                  </div>

                  {/* Cheer Team Buttons */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => cheerMatchTeam(match.id, 'A')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 border ${
                        match.userCheeredTeam === 'A'
                          ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${match.userCheeredTeam === 'A' ? 'fill-current' : ''}`} />
                      <span>Cheer {match.teamA.hostel.split(' ')[0]} ({match.cheersA})</span>
                    </button>

                    <button
                      onClick={() => cheerMatchTeam(match.id, 'B')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 border ${
                        match.userCheeredTeam === 'B'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${match.userCheeredTeam === 'B' ? 'fill-current' : ''}`} />
                      <span>Cheer {match.teamB.hostel.split(' ')[0]} ({match.cheersB})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 3: SQUAD FINDER & PICKUPS */}
      {activeSubTab === 'squads' && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sportsSquadChallenges.map((sq) => {
              const isJoined = sq.joinedPlayers.some((p) => p.id === currentUser.id);
              const isFull = sq.playersNeeded <= 0;

              return (
                <div
                  key={sq.id}
                  className="flex flex-col justify-between rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 p-5 transition-all shadow-xl space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-blue-500/15 text-sky-400 border border-blue-500/30 px-2.5 py-0.5 rounded-lg">
                        {sq.sport}
                      </span>
                      <span className="text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-bold">
                        {sq.skillLevel}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-100 leading-snug">{sq.title}</h3>

                    {sq.notes && (
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {sq.notes}
                      </p>
                    )}

                    <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs text-slate-300">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-slate-200">{sq.venue}</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-slate-200">{sq.time}</span>
                      </div>
                    </div>

                    {/* Joined Players Avatars */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Squad Members</span>
                        <span className="font-bold text-emerald-400">
                          {sq.playersNeeded > 0 ? `Need ${sq.playersNeeded} more` : 'Squad Ready!'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        {sq.joinedPlayers.map((p) => (
                          <img
                            key={p.id}
                            src={p.avatar}
                            alt={p.name}
                            className="w-7 h-7 rounded-xl object-cover ring-2 ring-blue-500/40"
                            title={`${p.name} (${p.rollNo})`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    disabled={isJoined || isFull}
                    onClick={() => joinSquadChallenge(sq.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 ${
                      isJoined
                        ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : isFull
                        ? 'bg-slate-950 text-slate-500 border border-slate-800 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/20'
                    }`}
                  >
                    {isJoined ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>You're in this Squad</span>
                      </>
                    ) : isFull ? (
                      <span>Squad Full</span>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Join Squad (1 Tap)</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Broadcast Squad Challenge Modal */}
      {isChallengeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-black text-slate-100">Broadcast Sports Squad Challenge</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Find players across hostels for spontaneous or tournament games
                </p>
              </div>
              <button
                onClick={() => setIsChallengeModalOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateChallenge} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Need 3 players for 8v8 football turf match tonight!"
                  value={challengeTitle}
                  onChange={(e) => setChallengeTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sport *</label>
                  <select
                    value={challengeSport}
                    onChange={(e) => setChallengeSport(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    <option value="Football">Football / Turf</option>
                    <option value="Badminton">Badminton</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Cricket">Cricket Nets / Box</option>
                    <option value="Lawn Tennis">Lawn Tennis</option>
                    <option value="Table Tennis">Table Tennis</option>
                    <option value="Volleyball">Volleyball</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Players Needed *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={challengePlayersNeeded}
                    onChange={(e) => setChallengePlayersNeeded(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Football Turf"
                    value={challengeVenue}
                    onChange={(e) => setChallengeVenue(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Match Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tonight 08:30 PM"
                    value={challengeTime}
                    onChange={(e) => setChallengeTime(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Skill Level *</label>
                <select
                  value={challengeSkill}
                  onChange={(e) => setChallengeSkill(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                >
                  <option value="All Levels Welcome">All Levels Welcome (Casual)</option>
                  <option value="Competitive">Competitive / Inter-Hostel Level</option>
                  <option value="Casual Knockabout">Casual Knockabout & Fun</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Extra Notes / Gear to bring (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bring cleats and hydration bottle. We have match balls and bibs."
                  value={challengeNotes}
                  onChange={(e) => setChallengeNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsChallengeModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-black shadow-md shadow-red-600/25"
                >
                  Broadcast Challenge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Confirmation Dialog */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-sm bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <Check className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Court Slot Reserved!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Your booking for <strong className="text-emerald-400">{bookingSuccessModal.facilityName}</strong> at{' '}
                <strong className="text-sky-400">{bookingSuccessModal.time}</strong> is confirmed under{' '}
                <strong>{currentUser.name}</strong>.
              </p>
            </div>
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  openGoogleCalendar({
                    title: `${bookingSuccessModal.facilityName} Court Booking`,
                    description: `Reserved sports court slot at BMU Sports Arena for ${currentUser.name} (${currentUser.rollNo}). Venue: ${bookingSuccessModal.facilityName}`,
                    venue: `${bookingSuccessModal.facilityName}, Sports Complex, BML Munjal University, NH-48, Sidhrawali`,
                    date: '2026-08-20',
                    startTime: bookingSuccessModal.time.split(' - ')[0] || bookingSuccessModal.time,
                    endTime: bookingSuccessModal.time.split(' - ')[1] || '08:00 PM',
                  });
                }}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-1.5 transition-all"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Add Slot to Google Calendar</span>
              </button>

              <button
                onClick={() => setBookingSuccessModal(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
              >
                Close / Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
