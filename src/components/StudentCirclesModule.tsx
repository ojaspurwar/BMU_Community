'use client';

import React, { useState } from 'react';
import { useCampusPulse } from '@/lib/store';
import { StudentCircle, StudentCircleCategory } from '@/types';
import {
  Gamepad2,
  BookOpen,
  Sparkles,
  Users,
  Coffee,
  Plus,
  Search,
  MapPin,
  Clock,
  Calendar,
  MessageCircle,
  Check,
  Flame,
  ShieldCheck,
  Tag,
  X,
  Share2,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES: ('All' | StudentCircleCategory)[] = [
  'All',
  'Gaming',
  'Study Jam',
  'Mini-Event',
  'Hangout',
  'Club Group',
];

export function StudentCirclesModule() {
  const {
    studentCircles,
    addStudentCircle,
    joinStudentCircle,
    leaveStudentCircle,
    deleteStudentCircle,
    currentUser,
  } = useCampusPulse();

  const [selectedCategory, setSelectedCategory] = useState<'All' | StudentCircleCategory>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);

  // Host Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<StudentCircleCategory>('Gaming');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('2026-08-22');
  const [time, setTime] = useState('Tonight, 09:30 PM');
  const [maxMembers, setMaxMembers] = useState(10);
  const [contactInfo, setContactInfo] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const filteredCircles = React.useMemo(() => {
    return studentCircles.filter((circle) => {
      const matchesCategory = selectedCategory === 'All' || circle.category === selectedCategory;
      const matchesSearch =
        circle.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        circle.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        circle.location.toLowerCase().includes(searchFilter.toLowerCase()) ||
        circle.hostName.toLowerCase().includes(searchFilter.toLowerCase()) ||
        circle.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [studentCircles, selectedCategory, searchFilter]);

  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    addStudentCircle({
      title: title.trim(),
      description: description.trim() || 'Join our student group meetup on campus!',
      category,
      hostId: currentUser.id,
      hostName: currentUser.name,
      hostRoll: currentUser.rollNo,
      hostAvatar: currentUser.avatar,
      hostHostel: `${currentUser.hostel} (${currentUser.roomNo})`,
      location: location.trim(),
      date,
      time,
      maxMembers: Number(maxMembers) || 8,
      contactInfo: contactInfo.trim() || `Hostel: ${currentUser.hostel}`,
      tags: parsedTags.length > 0 ? parsedTags : [category, 'BMUStudent'],
    });

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#14b8a6', '#f59e0b'],
      });
    } catch (err) {}

    setIsHostModalOpen(false);
    setTitle('');
    setDescription('');
    setLocation('');
    setContactInfo('');
    setTagsInput('');
  };

  const getCategoryIcon = (cat: StudentCircleCategory) => {
    switch (cat) {
      case 'Gaming':
        return <Gamepad2 className="size-4 text-sky-400" />;
      case 'Study Jam':
        return <BookOpen className="size-4 text-emerald-400" />;
      case 'Mini-Event':
        return <Sparkles className="size-4 text-amber-400" />;
      case 'Hangout':
        return <Coffee className="size-4 text-rose-400" />;
      case 'Club Group':
        return <Users className="size-4 text-teal-400" />;
    }
  };

  const getCategoryColor = (cat: StudentCircleCategory) => {
    switch (cat) {
      case 'Gaming':
        return 'bg-sky-500/10 text-sky-300 border-sky-500/25';
      case 'Study Jam':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
      case 'Mini-Event':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
      case 'Hangout':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/25';
      case 'Club Group':
        return 'bg-teal-500/10 text-teal-300 border-teal-500/25';
    }
  };

  return (
    <div className="space-y-8 sm:space-y-10 animate-smooth-in">
      {/* Student Hub Header Banner */}
      <div className="glass-panel-luxury border-sky-500/30 p-7 sm:p-9 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center space-x-1.5 bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-extrabold uppercase px-3.5 py-1 rounded-full">
                <Gamepad2 className="w-4 h-4 text-sky-400 animate-pulse" />
                <span>Student Community Circles</span>
              </span>
              <span className="text-xs text-slate-300 font-semibold">Casual Games • Study Jams • Dorm Hangouts</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Student Meetups, Games & Peer Groups
            </h2>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Organize 5v5 Valorant/BGMI lobbies, start midnight study jams in the library, form acoustic music circles at the amphitheatre, or find players for hostel common room games without administrative gatekeeping!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsHostModalOpen(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 font-black px-6 py-3.5 rounded-2xl text-xs shadow-xl shadow-sky-500/25 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Host a Game / Study Jam / Group</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 glass-panel-luxury p-5 sm:p-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-sky-500 to-teal-500 text-slate-950 font-black shadow-md shadow-sky-500/25 scale-105'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat !== 'All' && getCategoryIcon(cat as StudentCircleCategory)}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search games, study jams, dorms..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500/50"
          />
        </div>
      </div>

      {/* Circles Grid - Spacious 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredCircles.map((circle) => {
          const isMember = circle.joinedMembers.some((m) => m.id === currentUser.id);
          const isHost = circle.hostId === currentUser.id;
          const slotsLeft = circle.maxMembers - circle.joinedMembers.length;
          const percentFilled = Math.min(100, Math.round((circle.joinedMembers.length / circle.maxMembers) * 100));

          return (
            <div
              key={circle.id}
              className="group flex flex-col justify-between glass-card-luxury p-6 sm:p-7 hover:border-sky-500/50 transition-all duration-300 shadow-xl"
            >
              <div className="space-y-4">
                {/* Category & Status Bar */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border flex items-center space-x-1.5 ${getCategoryColor(circle.category)}`}>
                      {getCategoryIcon(circle.category)}
                      <span>{circle.category}</span>
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-white/[0.08] font-mono">
                      {slotsLeft <= 0 ? 'Full' : `${slotsLeft} spots left`}
                    </span>
                  </div>

                  {isHost && (
                    <button
                      onClick={() => deleteStudentCircle(circle.id)}
                      className="text-xs text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Delete your circle listing"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg text-white group-hover:text-sky-300 transition-colors leading-snug">
                  {circle.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {circle.description}
                </p>

                {/* Time & Venue */}
                <div className="space-y-2 pt-1 border-t border-white/[0.08] text-xs text-slate-300">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    <span className="font-semibold text-slate-200">{circle.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{circle.location}</span>
                  </div>
                </div>

                {/* Joined Participants & Progress Bar */}
                <div className="space-y-2 pt-1 bg-slate-950/60 p-3.5 rounded-2xl border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Joined Squad</span>
                    <span className="font-mono font-bold text-slate-200">
                      {circle.joinedMembers.length} / {circle.maxMembers}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percentFilled >= 100
                          ? 'bg-rose-500'
                          : percentFilled > 60
                          ? 'bg-amber-400'
                          : 'bg-sky-400'
                      }`}
                      style={{ width: `${percentFilled}%` }}
                    />
                  </div>

                  {/* Member Avatars */}
                  <div className="flex items-center space-x-1.5 pt-1 overflow-hidden">
                    {circle.joinedMembers.slice(0, 5).map((mem) => (
                      <img
                        key={mem.id}
                        src={mem.avatar}
                        alt={mem.name}
                        title={`${mem.name} (${mem.rollNo})`}
                        className="size-6 rounded-full object-cover border border-white/20"
                      />
                    ))}
                    {circle.joinedMembers.length > 5 && (
                      <span className="text-[10px] font-mono text-slate-400 bg-white/10 px-1.5 py-0.5 rounded-full">
                        +{circle.joinedMembers.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Host Info & Contact */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <div className="flex items-center space-x-2 truncate">
                    <img
                      src={circle.hostAvatar}
                      alt={circle.hostName}
                      className="size-5 rounded-full object-cover shrink-0"
                    />
                    <span className="truncate text-slate-300">
                      Host: <strong className="text-white">{circle.hostName.split(' ')[0]}</strong> ({circle.hostHostel.split('(')[0]})
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                {circle.contactInfo && (
                  <span className="text-[11px] text-slate-400 truncate max-w-[130px] font-mono">
                    {circle.contactInfo}
                  </span>
                )}

                {isMember ? (
                  <button
                    onClick={() => leaveStudentCircle(circle.id)}
                    className="ml-auto btn-spacious text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 transition-colors"
                  >
                    <Check className="size-3.5" />
                    <span>Joined (Leave)</span>
                  </button>
                ) : slotsLeft <= 0 ? (
                  <button
                    disabled
                    className="ml-auto btn-spacious text-xs bg-slate-800 text-slate-500 cursor-not-allowed"
                  >
                    Squad Full
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      joinStudentCircle(circle.id);
                      try {
                        confetti({
                          particleCount: 35,
                          spread: 60,
                          origin: { y: 0.8 },
                          colors: ['#38bdf8', '#14b8a6'],
                        });
                      } catch (e) {}
                    }}
                    className="ml-auto btn-spacious text-xs bg-gradient-to-r from-sky-500 to-teal-500 text-slate-950 font-black shadow-md shadow-sky-500/25 hover:scale-105 transition-all"
                  >
                    <span>Join Squad</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Host Student Circle Modal */}
      {isHostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl modal-animate-backdrop">
          <div
            className="w-full max-w-xl glass-panel-luxury border-sky-500/30 p-6 sm:p-8 modal-animate-content relative overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  <Gamepad2 className="size-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-white">Host a Student Circle</h3>
                  <p className="text-xs text-slate-400">Post games, study jams, or hostel hangouts</p>
                </div>
              </div>
              <button
                onClick={() => setIsHostModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08]"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleHostSubmit} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Meetup / Game Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Valorant 5v5 Custom Lobby / Midterm DSA Prep"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as StudentCircleCategory)}
                    className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-sky-500 cursor-pointer"
                  >
                    <option value="Gaming">🎮 Gaming & Custom Matches</option>
                    <option value="Study Jam">📚 Study Jam & Exam Prep</option>
                    <option value="Mini-Event">🎉 Mini-Event & Jamming</option>
                    <option value="Hangout">☕ Dorm Hangout & Movies</option>
                    <option value="Club Group">🚀 Hobby / Project Squad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Location / Spot *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. H2 Common Room / Library 2nd Floor"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Date & Time *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tonight, 10:00 PM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Max Player / Member Slots
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={100}
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Description & Rules
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your meetup, game format, or study goals..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Contact Link / WhatsApp / Discord (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Discord: @user / WhatsApp group link"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Valorant, H1vsH2, Competitive, NightOwl"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsHostModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-white bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-spacious bg-gradient-to-r from-sky-500 via-teal-500 to-emerald-500 text-slate-950 font-black shadow-lg shadow-sky-500/25"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Circle</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
