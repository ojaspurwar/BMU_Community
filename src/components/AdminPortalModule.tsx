'use client';

import React, { useState } from 'react';
import { useCampusPulse } from '@/lib/store';
import {
  EventCategory,
  NoticeCategory,
  NoticePriority,
  UserRole,
} from '@/types';
import {
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Bell,
  Trophy,
  Plus,
  Trash2,
  CheckCircle,
  AlertTriangle,
  FileText,
  Users,
  Sparkles,
  Lock,
  Flame,
  Radio,
  Clock,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function AdminPortalModule() {
  const {
    currentUser,
    setUserRole,
    isAdmin,
    events,
    addEvent,
    deleteEvent,
    notices,
    addNotice,
    deleteNotice,
    studentCircles,
    deleteStudentCircle,
    triggerSOSBeacon,
  } = useCampusPulse();

  const [activeAdminSection, setActiveAdminSection] = useState<'events' | 'notices' | 'moderation' | 'broadcast'>('events');

  // Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventCategory, setEventCategory] = useState<EventCategory>('Fest');
  const [eventOrganizer, setEventOrganizer] = useState(currentUser.name);
  const [eventVenue, setEventVenue] = useState('Academic Block 2 Auditorium');
  const [eventDate, setEventDate] = useState('2026-08-25');
  const [eventTime, setEventTime] = useState('10:00 AM');
  const [eventCapacity, setEventCapacity] = useState(500);
  const [eventSpeaker, setEventSpeaker] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);
  const [eventPassword, setEventPassword] = useState('');
  // Notice Form State
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticeCategory, setNoticeCategory] = useState<NoticeCategory>('Exams & Academic');
  const [noticeIssuer, setNoticeIssuer] = useState('Office of the Controller of Examinations (CoE)');
  const [noticeDesignation, setNoticeDesignation] = useState('Academic Registrar');
  const [noticePriority, setNoticePriority] = useState<NoticePriority>('Important');
  const [noticeBatch, setNoticeBatch] = useState('All Batches (UG & PG)');
  const [noticeActionLabel, setNoticeActionLabel] = useState('Register on Portal');
  const [noticeActionUrl, setNoticeActionUrl] = useState('https://erp.bmu.edu.in');

  // SOS Broadcast State
  const [sosLocation, setSosLocation] = useState('Main Gate & Campus Perimeter');
  const [sosDetails, setSosDetails] = useState('Advisory: Heavy monsoon rainfall in Sidhrawali. Shuttle bus departure delayed by 15 mins.');

  const handleCreateOfficialEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    if (eventPassword !== 'admin123') {
      alert('Incorrect authorization password to host an official event.');
      return;
    }

    addEvent({
      title: eventTitle.trim(),
      description: eventDesc.trim() || 'Official university campus fest / workshop.',
      category: eventCategory,
      organizer: eventOrganizer.trim(),
      organizerRole: 'University Admin / Council',
      venue: eventVenue.trim(),
      date: eventDate,
      startTime: eventTime,
      endTime: '08:00 PM',
      bannerGradient: 'from-red-600 via-rose-700 to-amber-600',
      tags: [eventCategory, 'OfficialBMU', 'Verified', 'Flagship'],
      capacity: Number(eventCapacity) || 300,
      speaker: eventSpeaker.trim() || undefined,
      registrationOpen: true,
      isFeatured,
    });

    try {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#ef4444', '#3b82f6', '#10b981'],
      });
    } catch (err) {}

    setEventTitle('');
    setEventDesc('');
    setEventSpeaker('');
  };

  const handleCreateOfficialNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;

    addNotice({
      title: noticeTitle.trim(),
      content: noticeContent.trim(),
      category: noticeCategory,
      issuer: noticeIssuer.trim(),
      issuerDesignation: noticeDesignation.trim(),
      isVerified: true,
      priority: noticePriority,
      targetBatches: [noticeBatch],
      pinned: noticePriority === 'Urgent',
      attachments: [
        {
          name: `${noticeTitle.slice(0, 20).replace(/\s+/g, '_')}_Official_Circular.pdf`,
          type: 'PDF',
          size: '1.4 MB',
        },
      ],
      actionLink: noticeActionLabel ? { label: noticeActionLabel, url: noticeActionUrl || '#' } : undefined,
    });

    try {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#ef4444', '#38bdf8', '#10b981'],
      });
    } catch (err) {}

    setNoticeTitle('');
    setNoticeContent('');
  };

  const handleBroadcastSOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sosLocation.trim() || !sosDetails.trim()) return;
    triggerSOSBeacon(sosLocation, sosDetails);
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-smooth-in">
        <ShieldAlert className="w-16 h-16 text-rose-500 mb-6 opacity-80" />
        <h2 className="text-3xl font-extrabold text-white mb-3">Access Restricted</h2>
        <p className="text-slate-400 max-w-md text-sm leading-relaxed mb-8">
          This portal is strictly for University Authorities, Deans, and Verified Club Leads to publish official events, notices, and moderate the community.
        </p>
        <button
          onClick={() => setUserRole('admin')}
          className="px-6 py-2.5 bg-rose-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all text-sm"
        >
          Request Admin Privileges (Test Mode)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 animate-smooth-in">
      {/* Admin Portal Header Banner */}
      <div className="glass-panel-luxury border-rose-500/40 p-7 sm:p-9 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center space-x-1.5 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-extrabold uppercase px-3.5 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>BMU Central Administration & Council Portal</span>
              </span>
              <span className="text-xs text-slate-300 font-semibold">Restricted Access Control</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Official Campus Administration & Moderation
            </h2>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Authorized portal for university authorities, deans, and verified student council leads to publish official flagship fests, issue authenticated CoE circulars, and moderate student submissions to prevent spam.
            </p>
          </div>

          {/* Quick Role Switcher */}
          <div className="glass-card-luxury p-4 space-y-2 shrink-0 border-white/[0.12]">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Current Role:</span>
              <span className="font-bold text-teal-400 uppercase font-mono">{currentUser.role || 'student'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setUserRole('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentUser.role === 'admin'
                    ? 'bg-rose-500 text-white font-extrabold shadow-sm'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                Admin (Dean)
              </button>
              <button
                onClick={() => setUserRole('club_lead')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentUser.role === 'club_lead'
                    ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                Club Lead
              </button>
              <button
                onClick={() => setUserRole('student')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  currentUser.role === 'student'
                    ? 'bg-teal-500 text-slate-950 font-extrabold shadow-sm'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                Student
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Section Tabs */}
      <div className="flex flex-wrap items-center gap-2.5 glass-panel-luxury p-3">
        <button
          onClick={() => setActiveAdminSection('events')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeAdminSection === 'events'
              ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/25 scale-105'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <Calendar className="size-4" />
          <span>Host Official Event</span>
        </button>

        <button
          onClick={() => setActiveAdminSection('notices')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeAdminSection === 'notices'
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 scale-105'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <Bell className="size-4" />
          <span>Issue Verified Circular</span>
        </button>

        <button
          onClick={() => setActiveAdminSection('moderation')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeAdminSection === 'moderation'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 scale-105'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <ShieldCheck className="size-4" />
          <span>Moderation & Spam Control</span>
        </button>

        <button
          onClick={() => setActiveAdminSection('broadcast')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeAdminSection === 'broadcast'
              ? 'bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md shadow-rose-600/25 scale-105'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
          }`}
        >
          <Radio className="size-4" />
          <span>Emergency Broadcast SOS</span>
        </button>
      </div>

      {/* SECTION 1: HOST OFFICIAL EVENT */}
      {activeAdminSection === 'events' && (
        <div className="glass-panel-luxury p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div>
              <h3 className="text-lg font-bold text-white">Publish Official Campus Flagship Event</h3>
              <p className="text-xs text-slate-400">Restricted to University Admins & Verified Club Chapters</p>
            </div>
            <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-full font-bold">
              Admin Exclusive
            </span>
          </div>

          <form onSubmit={handleCreateOfficialEvent} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Official Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sangram 2026: North India Inter-College Fest"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as EventCategory)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                >
                  <option value="Fest">🎉 Flagship Fest</option>
                  <option value="Coding">💻 Technical / Hackathon</option>
                  <option value="Cultural">🎭 Cultural & Pro-Nite</option>
                  <option value="Workshops">⚡ Masterclass / Workshop</option>
                  <option value="Sports">🏆 Sports Championship</option>
                  <option value="Academic">🎓 Academic Conference</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Event Description & Highlights *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Detailed event itinerary, prize pool, chief guests, rules..."
                value={eventDesc}
                onChange={(e) => setEventDesc(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Organizing Body / Club
                </label>
                <input
                  type="text"
                  value={eventOrganizer}
                  onChange={(e) => setEventOrganizer(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Venue / Location
                </label>
                <input
                  type="text"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Keynote Speaker / Chief Guest
                </label>
                <input
                  type="text"
                  placeholder="e.g. CTO of Unicorn Startup"
                  value={eventSpeaker}
                  onChange={(e) => setEventSpeaker(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Start Time
                </label>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Max Seating Capacity
                </label>
                <input
                  type="number"
                  value={eventCapacity}
                  onChange={(e) => setEventCapacity(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="size-4 rounded accent-red-600"
              />
              <label htmlFor="isFeatured" className="text-xs text-slate-300 font-semibold cursor-pointer">
                Promote as Campus Flagship Spotlight Hero Banner
              </label>
            </div>

            <div className="pt-3 flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="password"
                placeholder="Authorization Password (admin123)"
                value={eventPassword}
                onChange={(e) => setEventPassword(e.target.value)}
                required
                className="w-full sm:w-64 px-4 py-2.5 bg-slate-950/80 border border-red-500/50 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="btn-spacious bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-black shadow-lg shadow-red-600/30 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Official Campus Event</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 2: ISSUE VERIFIED CIRCULAR */}
      {activeAdminSection === 'notices' && (
        <div className="glass-panel-luxury p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div>
              <h3 className="text-lg font-bold text-white">Issue Authenticated University Circular</h3>
              <p className="text-xs text-slate-400">CoE, Placement Cell, Chief Warden, Academic Registrars</p>
            </div>
            <span className="text-xs bg-blue-500/10 text-sky-400 border border-blue-500/30 px-3 py-1 rounded-full font-bold">
              Digitally Signed
            </span>
          </div>

          <form onSubmit={handleCreateOfficialNotice} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Notice / Circular Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for Fall 2026 End-Semester Examinations"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Category *
                </label>
                <select
                  value={noticeCategory}
                  onChange={(e) => setNoticeCategory(e.target.value as NoticeCategory)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Exams & Academic">🎓 Exams & Academic (CoE)</option>
                  <option value="Placement & Internships">💼 Placement Cell (CDC)</option>
                  <option value="Hostel & Mess">🏠 Hostel & Mess Affairs</option>
                  <option value="Club Recruitment">🚀 Club & Council Council</option>
                  <option value="Administrative">🏛️ Central Administration</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Notice Circular Body *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Full administrative circular content, deadlines, guidelines..."
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Issuing Department
                </label>
                <input
                  type="text"
                  value={noticeIssuer}
                  onChange={(e) => setNoticeIssuer(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Signatory Designation
                </label>
                <input
                  type="text"
                  value={noticeDesignation}
                  onChange={(e) => setNoticeDesignation(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Priority
                </label>
                <select
                  value={noticePriority}
                  onChange={(e) => setNoticePriority(e.target.value as NoticePriority)}
                  className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Urgent">🚨 Urgent (Pinned Red)</option>
                  <option value="Important">⚠️ Important</option>
                  <option value="General">📋 General Information</option>
                </select>
              </div>
            </div>

            <div className="pt-3">
              <button
                type="submit"
                className="btn-spacious bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white font-black shadow-lg shadow-blue-600/30 hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Issue Verified University Circular</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 3: MODERATION & SPAM CONTROL */}
      {activeAdminSection === 'moderation' && (
        <div className="glass-panel-luxury p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-white/[0.08]">
            <h3 className="text-lg font-bold text-white">Active Listings Moderation Hub</h3>
            <p className="text-xs text-slate-400">Review, manage, or delete flagged spam content</p>
          </div>

          <div className="space-y-6">
            {/* Events Moderation */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold text-rose-400">
                Official Campus Events ({events.length})
              </h4>
              <div className="space-y-2">
                {events.map((ev) => (
                  <div
                    key={ev.id}
                    className="glass-card-luxury p-3.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{ev.title}</div>
                      <div className="text-slate-400 text-[11px]">{ev.organizer} • {ev.date}</div>
                    </div>
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                      title="Remove Event"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Circles Moderation */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold text-sky-400">
                Student Circles & Game Lobbies ({studentCircles.length})
              </h4>
              <div className="space-y-2">
                {studentCircles.map((circle) => (
                  <div
                    key={circle.id}
                    className="glass-card-luxury p-3.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{circle.title}</div>
                      <div className="text-slate-400 text-[11px]">Host: {circle.hostName} ({circle.hostHostel}) • {circle.category}</div>
                    </div>
                    <button
                      onClick={() => deleteStudentCircle(circle.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                      title="Remove Circle"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notices Moderation */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase font-bold text-teal-400">
                Circulars & Notices ({notices.length})
              </h4>
              <div className="space-y-2">
                {notices.map((not) => (
                  <div
                    key={not.id}
                    className="glass-card-luxury p-3.5 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{not.title}</div>
                      <div className="text-slate-400 text-[11px]">{not.issuer} • Priority: {not.priority}</div>
                    </div>
                    <button
                      onClick={() => deleteNotice(not.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                      title="Remove Notice"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: EMERGENCY SOS BROADCAST */}
      {activeAdminSection === 'broadcast' && (
        <div className="glass-panel-luxury border-rose-500/40 p-6 sm:p-8 space-y-6">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-white/[0.08]">
            <Radio className="size-5 text-rose-400 animate-pulse" />
            <div>
              <h3 className="text-lg font-bold text-white">Broadcast Campus-Wide Emergency SOS Banner</h3>
              <p className="text-xs text-slate-400">Instantly appears across all active student browsers and tabs in real-time</p>
            </div>
          </div>

          <form onSubmit={handleBroadcastSOS} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location Affected *
              </label>
              <input
                type="text"
                required
                value={sosLocation}
                onChange={(e) => setSosLocation(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Emergency Alert / Weather Advisory Details *
              </label>
              <textarea
                rows={3}
                required
                value={sosDetails}
                onChange={(e) => setSosDetails(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="btn-spacious bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 text-white font-black shadow-lg shadow-rose-600/30 hover:scale-105"
              >
                <Radio className="w-4 h-4" />
                <span>Broadcast Live Campus Alert</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
