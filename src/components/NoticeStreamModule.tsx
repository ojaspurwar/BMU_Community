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
    <div className="space-y-8 sm:space-y-10">
      {/* Verified Notice Stream Header - Crimson & Electric Blue Theme */}
      <div className="glass-panel-luxury border-rose-500/30 p-7 sm:p-9 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center space-x-1.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase px-3.5 py-1 rounded-full">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Digitally Authenticated Circulars</span>
              </span>
              <span className="text-xs text-slate-300 font-semibold">BMU University Administration</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Verified University Circulars & Important Deadlines
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Official circulars from the Controller of Examinations, CDC Placement Cell, Chief Warden, and Clubs. Filter by batch and download authenticated PDFs directly.
            </p>
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
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25 scale-105'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat !== 'All' && getCategoryIcon(cat as NoticeCategory)}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Priority & Search Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search circulars, CoE, exams..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-red-500/50"
            />
          </div>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value as 'All' | NoticePriority)}
            className="px-3.5 py-2 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-red-500/50 cursor-pointer"
          >
            <option value="All">All Priorities</option>
            <option value="Urgent">🚨 Urgent</option>
            <option value="Important">⚠️ Important</option>
            <option value="Standard">📋 Standard</option>
          </select>
        </div>
      </div>

      {/* Notice Stream List - Spacious Frosted Cards */}
      <div className="space-y-4 sm:space-y-5">
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
