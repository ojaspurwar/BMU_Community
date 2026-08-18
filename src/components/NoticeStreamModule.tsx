'use client';

import React, { useState } from 'react';
import { useCampusPulse } from '@/lib/store';
import { CampusNotice, NoticeCategory, NoticePriority } from '@/types';
import { formatEventDate, formatTimeAgo } from '@/lib/utils';
import { NoticeDetailModal } from './NoticeDetailModal';
import {
  Bell,
  ShieldCheck,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Download,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Pin,
  Building,
  GraduationCap,
  Briefcase,
  Users,
  Home,
  Bus,
  X,
  Bookmark,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES: ('All' | NoticeCategory)[] = [
  'All',
  'Exams & Academic',
  'Placement & Internships',
  'Club Recruitment',
  'Hostel & Mess',
  'Administrative',
];

export function NoticeStreamModule() {
  const {
    notices,
    acknowledgeNotice,
    addNotice,
    currentUser,
    bookmarkedNotices,
    toggleBookmarkNotice,
  } = useCampusPulse();

  const [selectedCategory, setSelectedCategory] = useState<'All' | NoticeCategory>('All');
  const [selectedPriority, setSelectedPriority] = useState<'All' | NoticePriority>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeDetailNotice, setActiveDetailNotice] = useState<CampusNotice | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Notice Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<NoticeCategory>('Exams & Academic');
  const [newIssuer, setNewIssuer] = useState('Academic Registrar');
  const [newDesignation, setNewDesignation] = useState('Office of the Controller of Examinations');
  const [newPriority, setNewPriority] = useState<NoticePriority>('Important');
  const [newBatch, setNewBatch] = useState('All Batches (UG & PG)');
  const [newActionLabel, setNewActionLabel] = useState('');
  const [newActionUrl, setNewActionUrl] = useState('');

  const filteredNotices = notices.filter((not) => {
    const matchesCategory = selectedCategory === 'All' || not.category === selectedCategory;
    const matchesPriority = selectedPriority === 'All' || not.priority === selectedPriority;
    const matchesSearch =
      not.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      not.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
      not.issuer.toLowerCase().includes(searchFilter.toLowerCase()) ||
      not.targetBatches.some((b) => b.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesPriority && matchesSearch;
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    addNotice({
      title: newTitle,
      content: newContent,
      category: newCategory,
      issuer: newIssuer,
      issuerDesignation: newDesignation,
      isVerified: true,
      priority: newPriority,
      targetBatches: [newBatch],
      pinned: newPriority === 'Urgent',
      attachments: [
        {
          name: `${newTitle.slice(0, 20).replace(/\s+/g, '_')}_Circular.pdf`,
          type: 'PDF',
          size: '1.2 MB',
        },
      ],
      actionLink: newActionLabel ? { label: newActionLabel, url: newActionUrl || '#' } : undefined,
    });

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#ef4444', '#3b82f6', '#10b981'],
      });
    } catch (e) {}

    setIsCreateOpen(false);
    setNewTitle('');
    setNewContent('');
    setNewActionLabel('');
    setNewActionUrl('');
  };

  const getCategoryIcon = (category: NoticeCategory) => {
    switch (category) {
      case 'Exams & Academic':
        return <GraduationCap className="w-3.5 h-3.5 text-sky-400" />;
      case 'Placement & Internships':
        return <Briefcase className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Club Recruitment':
        return <Users className="w-3.5 h-3.5 text-rose-400" />;
      case 'Hostel & Mess':
        return <Home className="w-3.5 h-3.5 text-amber-400" />;
      case 'Administrative':
        return <Bus className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Verified Notice Stream Header - Crimson & Electric Blue Theme */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/40 border border-rose-500/30 p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase px-3 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Digitally Authenticated Circulars</span>
              </span>
              <span className="text-xs text-slate-400">BMU University Administration</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Verified University Circulars & Important Deadlines
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Official circulars from the Controller of Examinations, CDC Placement Cell, Chief Warden, and Clubs. Filter by batch and download authenticated PDFs directly.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-lg shadow-red-600/25 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Publish Circular (Faculty/Council)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat !== 'All' && getCategoryIcon(cat as NoticeCategory)}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Priority & Search Filter */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars, CoE, exams..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50"
            />
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as 'All' | NoticePriority)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500/50"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">🚨 Urgent</option>
            <option value="Important">⚠️ Important</option>
            <option value="Standard">📋 Standard</option>
          </select>
        </div>
      </div>

      {/* Notice Stream List */}
      <div className="space-y-3.5">
        {filteredNotices.map((notice) => {
          const isAcked = notice.acknowledgements.includes(currentUser.id);
          const isBookmarked = bookmarkedNotices.includes(notice.id);
          const isUrgent = notice.priority === 'Urgent';

          return (
            <div
              key={notice.id}
              onClick={() => setActiveDetailNotice(notice)}
              className={`group p-5 rounded-3xl border transition-all duration-200 cursor-pointer shadow-lg ${
                isUrgent
                  ? 'bg-gradient-to-r from-red-950/30 via-slate-900/90 to-slate-900/90 border-red-500/40 hover:border-red-500'
                  : 'bg-slate-900/80 border-slate-800/90 hover:border-blue-500/40'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-2 flex-1">
                  {/* Category, Authority Badge, Target Batches */}
                  <div className="flex flex-wrap items-center gap-2">
                    {notice.pinned && (
                      <span className="flex items-center space-x-1 text-[10px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded-md shadow-sm">
                        <Pin className="w-3 h-3" />
                        <span>Pinned</span>
                      </span>
                    )}

                    <span className="flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-sky-400 px-2.5 py-0.5 rounded-lg border border-slate-700">
                      {getCategoryIcon(notice.category)}
                      <span>{notice.category}</span>
                    </span>

                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                        isUrgent
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : notice.priority === 'Important'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {notice.priority}
                    </span>

                    {notice.isVerified && (
                      <span className="flex items-center space-x-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-base text-slate-100 group-hover:text-sky-400 transition-colors leading-snug">
                    {notice.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>

                  {/* Issuer & Metadata */}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="text-slate-300 font-semibold">
                      🏛️ {notice.issuer} ({notice.issuerDesignation})
                    </span>
                    <span>•</span>
                    <span className="text-sky-400 font-medium">
                      🎯 {notice.targetBatches.join(', ')}
                    </span>
                    <span>•</span>
                    <span className="text-slate-500">{formatTimeAgo(notice.publishedAt)}</span>
                  </div>
                </div>

                {/* Right Action Stack: Read / Acknowledge & Bookmark */}
                <div
                  className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleBookmarkNotice(notice.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isBookmarked
                          ? 'text-sky-400 bg-blue-500/20 border border-blue-500/40'
                          : 'text-slate-400 hover:text-slate-200 bg-slate-800 border border-slate-700'
                      }`}
                      title="Bookmark Notice"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => acknowledgeNotice(notice.id)}
                      className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                        isAcked
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isAcked ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span>{isAcked ? 'Acknowledged' : 'Mark Read'}</span>
                    </button>
                  </div>

                  <span className="text-[10px] text-slate-500 font-mono">
                    {notice.acknowledgements.length} student reads
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Publish Notice Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Publish Verified Campus Notice</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Authorized for Faculty, Council Members & Administrative Offices
                </p>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNotice} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Circular Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule of End-Term Practical Examinations (Fall 2026)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as NoticeCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    <option value="Exams & Academic">Exams & Academic</option>
                    <option value="Placement & Internships">Placement & Internships</option>
                    <option value="Club Recruitment">Club Recruitment</option>
                    <option value="Hostel & Mess">Hostel & Mess</option>
                    <option value="Administrative">Administrative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Priority *
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as NoticePriority)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  >
                    <option value="Standard">Standard Circular</option>
                    <option value="Important">Important Update</option>
                    <option value="Urgent">🚨 Urgent Deadline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Issuing Authority *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Controller of Examinations"
                    value={newIssuer}
                    onChange={(e) => setNewIssuer(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Batches *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech 2023-2027, MBA, LLB"
                    value={newBatch}
                    onChange={(e) => setNewBatch(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Circular Content & Instructions *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide comprehensive details, dates, submission portal links, venue requirements..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/25"
                >
                  Broadcast Verified Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notice Detail Modal */}
      <NoticeDetailModal
        notice={activeDetailNotice}
        onClose={() => setActiveDetailNotice(null)}
        onAcknowledge={acknowledgeNotice}
        currentUser={currentUser}
      />
    </div>
  );
}
