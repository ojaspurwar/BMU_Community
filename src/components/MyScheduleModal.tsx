'use client';

import React, { useState } from 'react';
import { useCampusPulse } from '@/lib/store';
import { UserScheduleItem } from '@/types';
import { openGoogleCalendar, generateICS, generateBatchICS, formatEventDate } from '@/lib/utils';
import {
  Calendar,
  Clock,
  MapPin,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Download,
  ExternalLink,
  Sparkles,
  Trophy,
  Bell,
  Check,
  Filter,
  CalendarPlus,
  BookOpen,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function MyScheduleModal() {
  const {
    isScheduleModalOpen,
    setIsScheduleModalOpen,
    getUserScheduleList,
    addCustomScheduleItem,
    removeCustomScheduleItem,
    toggleCompleteScheduleItem,
    currentUser,
  } = useCampusPulse();

  const [activeTab, setActiveTab] = useState<'All' | 'Event' | 'Sports' | 'Deadline' | 'Task'>('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Item Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Task' | 'Event' | 'Sports' | 'Deadline'>('Task');
  const [newDate, setNewDate] = useState('2026-08-22');
  const [newStartTime, setNewStartTime] = useState('10:00 AM');
  const [newEndTime, setNewEndTime] = useState('11:30 AM');
  const [newVenue, setNewVenue] = useState('Academic Block 2 (BMU)');
  const [newDesc, setNewDesc] = useState('');

  if (!isScheduleModalOpen) return null;

  const scheduleList = getUserScheduleList();

  const filteredList = scheduleList.filter((item) => {
    if (activeTab === 'All') return true;
    return item.category === activeTab;
  });

  const handleAddNewItem = (e: React.FormEvent, directToGCal = false) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const itemData = {
      title: newTitle.trim(),
      category: newCategory,
      date: newDate,
      startTime: newStartTime,
      endTime: newEndTime,
      venue: newVenue.trim() || 'BML Munjal University, Sidhrawali',
      description: newDesc.trim() || `BMU student schedule item for ${currentUser.name}`,
    };

    addCustomScheduleItem(itemData);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'],
      });
    } catch (e) {}

    if (directToGCal) {
      openGoogleCalendar(itemData);
    }

    setNewTitle('');
    setNewDesc('');
    setShowAddForm(false);
  };

  const handleExportAllICS = () => {
    if (scheduleList.length === 0) return;
    generateBatchICS(scheduleList, `BMU_${currentUser.name.replace(/\s+/g, '_')}_Schedule.ics`);
  };

  const getCategoryBadge = (category: UserScheduleItem['category']) => {
    switch (category) {
      case 'Event':
        return {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          icon: <Calendar className="w-3 h-3 text-rose-400" />,
          label: 'RSVP Event',
        };
      case 'Sports':
        return {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: <Trophy className="w-3 h-3 text-amber-400" />,
          label: 'Court Booking',
        };
      case 'Deadline':
        return {
          bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
          icon: <Bell className="w-3 h-3 text-sky-400" />,
          label: 'Circular Deadline',
        };
      case 'Task':
      default:
        return {
          bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          icon: <BookOpen className="w-3 h-3 text-purple-400" />,
          label: 'My Task / Agenda',
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-sky-400 p-0.5 shadow-lg shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <CalendarPlus className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-black text-white">My Schedule & Google Calendar</h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-500/20 text-sky-300 border border-blue-400/30">
                  {scheduleList.length} Items
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                Directly add any campus event, court booking, circular deadline or task to Google Calendar
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Direct Link to Google Calendar Web */}
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-sky-300 border border-blue-500/40 text-xs font-bold transition-all shadow-sm"
              title="Open Google Calendar in Web Browser"
            >
              <span>Open Google Calendar</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Close Button */}
            <button
              onClick={() => setIsScheduleModalOpen(false)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Action Bar & Filter Tabs */}
        <div className="p-3 sm:px-5 bg-slate-950/60 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
          {/* Category Tabs */}
          <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {(['All', 'Event', 'Sports', 'Deadline', 'Task'] as const).map((cat) => {
              const count =
                cat === 'All' ? scheduleList.length : scheduleList.filter((i) => i.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                    activeTab === cat
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>
                    {cat === 'All'
                      ? 'All Items'
                      : cat === 'Event'
                      ? 'Events'
                      : cat === 'Sports'
                      ? 'Sports Courts'
                      : cat === 'Deadline'
                      ? 'Deadlines'
                      : 'My Tasks'}
                  </span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeTab === cat ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Action Buttons: Add Task & Export .ICS */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                showAddForm
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Close Form' : 'Add Custom Task'}</span>
            </button>

            {scheduleList.length > 0 && (
              <button
                onClick={handleExportAllICS}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center space-x-1.5"
                title="Download complete semester calendar file (.ICS)"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Export All .ICS</span>
              </button>
            )}
          </div>
        </div>

        {/* INLINE ADD CUSTOM ITEM FORM */}
        {showAddForm && (
          <form
            onSubmit={(e) => handleAddNewItem(e, false)}
            className="p-4 bg-slate-950 border-b border-slate-800 space-y-3 animate-fade-in shrink-0"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Create Campus Task / Study Agenda</span>
              </span>
              <span className="text-[10px] text-slate-400">Added to your local list & syncable to Google Calendar</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                placeholder="Title (e.g. Lab Viva, Capstone Submission, Prof Meeting)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
              />

              <input
                type="text"
                placeholder="Venue / Location (e.g. Academic Block 2 Lab 304)"
                value={newVenue}
                onChange={(e) => setNewVenue(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 px-2.5 py-1.5 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">Start Time</label>
                <input
                  type="text"
                  placeholder="e.g. 10:00 AM"
                  value={newStartTime}
                  onChange={(e) => setNewStartTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 px-2.5 py-1.5 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-semibold mb-1">End Time</label>
                <input
                  type="text"
                  placeholder="e.g. 11:30 AM"
                  value={newEndTime}
                  onChange={(e) => setNewEndTime(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 px-2.5 py-1.5 rounded-xl text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <textarea
              rows={2}
              placeholder="Notes or agenda details (optional)..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-purple-500 px-3 py-1.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none"
            />

            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Add to My List
              </button>
              <button
                type="button"
                onClick={(e) => handleAddNewItem(e, true)}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-md shadow-blue-600/25 flex items-center space-x-1.5 transition-all"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
                <span>Save & Add to Google Calendar</span>
              </button>
            </div>
          </form>
        )}

        {/* LIST OF SCHEDULE ITEMS */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {filteredList.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white">No items found in this view</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  RSVP to campus events, book sports court slots, bookmark circular deadlines, or create custom tasks to build your calendar schedule.
                </p>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Schedule Item</span>
              </button>
            </div>
          ) : (
            filteredList.map((item) => {
              const badge = getCategoryBadge(item.category);
              const isTask = item.category === 'Task';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    item.completed
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : 'bg-slate-950/90 hover:bg-slate-950 border-slate-800 hover:border-slate-700 shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: Checkbox (for tasks), Details */}
                    <div className="flex items-start space-x-3 flex-1">
                      {isTask ? (
                        <button
                          onClick={() => toggleCompleteScheduleItem(item.id)}
                          className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                        >
                          {item.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <Circle className="w-5 h-5" />
                          )}
                        </button>
                      ) : (
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                          {badge.icon}
                        </div>
                      )}

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center space-x-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${badge.bg}`}
                          >
                            <span>{badge.label}</span>
                          </span>

                          <span className="text-xs font-bold text-slate-300 flex items-center space-x-1">
                            <Clock className="w-3 h-3 text-sky-400" />
                            <span>{formatEventDate(item.date)}</span>
                            <span>•</span>
                            <span>{item.startTime}{item.endTime ? ` - ${item.endTime}` : ''}</span>
                          </span>
                        </div>

                        <h4
                          className={`text-sm font-bold leading-snug truncate ${
                            item.completed ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {item.title}
                        </h4>

                        {item.venue && (
                          <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                            <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <span className="truncate">{item.venue}</span>
                          </div>
                        )}

                        {item.description && (
                          <p className="text-xs text-slate-400 line-clamp-2 pt-0.5">{item.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Right: Direct 1-Click Google Calendar & Actions */}
                    <div className="flex items-center sm:flex-col sm:items-end justify-between sm:justify-start gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      {/* Direct 1-Click Add to Google Calendar button */}
                      <button
                        onClick={() => openGoogleCalendar(item)}
                        className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs px-3 py-2 rounded-xl shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
                        title="Add directly to Google Calendar in new tab"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                        <span>Add to Google Calendar</span>
                      </button>

                      <div className="flex items-center space-x-1.5">
                        {/* Download .ICS for Apple/Outlook */}
                        <button
                          onClick={() => generateICS(item)}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                          title="Download .ICS file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>

                        {/* Remove button if custom task */}
                        {isTask && (
                          <button
                            onClick={() => removeCustomScheduleItem(item.id)}
                            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                            title="Delete custom task"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <div className="flex items-center space-x-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>Google Calendar Web Integration Active • Timezone Asia/Kolkata (IST)</span>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="https://calendar.google.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-300 text-sky-400 font-bold flex items-center space-x-1"
            >
              <span>calendar.google.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
