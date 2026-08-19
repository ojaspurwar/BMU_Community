'use client';

import React from 'react';
import { CampusNotice, UserProfile } from '@/types';
import {
  X,
  ShieldCheck,
  Calendar,
  Download,
  ExternalLink,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Building,
  CalendarPlus,
} from 'lucide-react';
import { formatEventDate, openGoogleCalendar } from '@/lib/utils';

interface NoticeDetailModalProps {
  notice: CampusNotice | null;
  currentUser: UserProfile;
  onClose: () => void;
  onAcknowledge: (id: string) => void;
}

export function NoticeDetailModal({
  notice,
  currentUser,
  onClose,
  onAcknowledge,
}: NoticeDetailModalProps) {
  if (!notice) return null;

  const isAcked = notice.acknowledgements.includes(currentUser.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950 flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center space-x-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>BMU Verified Circular</span>
              </span>

              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                  notice.priority === 'Urgent'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : notice.priority === 'Important'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                }`}
              >
                {notice.priority} Priority
              </span>

              <span className="text-xs bg-slate-800 text-sky-400 font-semibold px-2.5 py-0.5 rounded-full border border-slate-700">
                {notice.category}
              </span>
            </div>

            <h2 className="text-xl font-bold text-slate-100 leading-snug">{notice.title}</h2>

            <div className="flex items-center space-x-2 text-xs text-slate-400">
              <Building className="w-3.5 h-3.5 text-sky-400" />
              <span className="font-semibold text-slate-200">{notice.issuer}</span>
              <span>•</span>
              <span>{notice.issuerDesignation}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors shrink-0 ml-4"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Target Batches */}
          <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Applicable Student Cohorts
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {notice.targetBatches.map((b) => (
                <span
                  key={b}
                  className="bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 font-medium text-[11px]"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Full Text Content */}
          <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line space-y-4">
            <p>{notice.content}</p>
          </div>

          {/* Attachments Section */}
          {notice.attachments && notice.attachments.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Attachments & Guidelines
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {notice.attachments.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-950 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-2.5 truncate mr-2">
                      <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-200 truncate">{att.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {att.type} • {att.size}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading official authenticated document: ${att.name}`)}
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-sky-400 transition-colors shrink-0"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Link CTA if any */}
          {notice.actionLink && (
            <div className="pt-2">
              <a
                href={notice.actionLink.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 px-6 rounded-2xl text-xs shadow-lg shadow-blue-600/20 transition-all"
              >
                <span>{notice.actionLink.label}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* Footer with Acknowledgment Action & Calendar Sync */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            <strong className="text-slate-200">{notice.acknowledgements.length}</strong> BMU students
            have read and acknowledged this circular.
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() =>
                openGoogleCalendar({
                  title: `BMU Circular: ${notice.title}`,
                  description: `${notice.issuer} (${notice.issuerDesignation}):\n\n${notice.content}`,
                  venue: `${notice.issuer}, BML Munjal University, NH-48, Sidhrawali`,
                  date: '2026-08-24',
                  startTime: '11:59 PM',
                  endTime: '11:59 PM',
                })
              }
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-blue-600/20 hover:bg-blue-600/30 text-sky-300 border border-blue-500/30 transition-all shadow-sm"
              title="Add this circular deadline to Google Calendar"
            >
              <CalendarPlus className="w-3.5 h-3.5 text-sky-400" />
              <span>Add to Google Calendar</span>
            </button>

            <button
              onClick={() => onAcknowledge(notice.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isAcked
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAcked ? 'Acknowledged & Saved' : 'Mark as Read'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
