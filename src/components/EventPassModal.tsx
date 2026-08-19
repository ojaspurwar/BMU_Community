'use client';

import React from 'react';
import { CampusEvent, UserProfile } from '@/types';
import { openGoogleCalendar } from '@/lib/utils';
import { QrCode, X, Calendar, MapPin, Clock, ShieldCheck, Download, Sparkles, CalendarPlus } from 'lucide-react';

interface EventPassModalProps {
  event: CampusEvent | null;
  user: UserProfile;
  onClose: () => void;
}

export function EventPassModal({ event, user, onClose }: EventPassModalProps) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pass Header - Crimson Red & Electric Blue Theme */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 transition-colors text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-md backdrop-blur-sm">
              BMU Verified Entry Pass
            </span>
            <span className="text-[11px] text-rose-100 font-mono font-bold">#{event.id.toUpperCase()}</span>
          </div>
          <h3 className="text-lg font-black text-white mt-2 leading-snug">{event.title}</h3>
          <p className="text-xs text-rose-100 mt-0.5">{event.organizer}</p>
        </div>

        {/* Pass Content */}
        <div className="p-6 space-y-5">
          {/* User Details */}
          <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500/50"
              />
              <div>
                <div className="text-sm font-bold text-slate-100">{user.name}</div>
                <div className="text-xs text-slate-400">
                  {user.rollNo} • {user.department.split(' ')[0]}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Seat / Tier</div>
              <div className="text-xs font-black text-emerald-400">CONFIRMED</div>
            </div>
          </div>

          {/* Logistics */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-800">
              <div className="flex items-center text-slate-400 mb-1">
                <Calendar className="w-3.5 h-3.5 mr-1.5 text-rose-400" />
                <span>Date & Time</span>
              </div>
              <div className="font-semibold text-slate-200">{event.date}</div>
              <div className="text-[11px] text-slate-400">{event.startTime}</div>
            </div>

            <div className="p-3 bg-slate-800/40 rounded-2xl border border-slate-800">
              <div className="flex items-center text-slate-400 mb-1">
                <MapPin className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
                <span>Venue</span>
              </div>
              <div className="font-semibold text-slate-200 line-clamp-1">{event.venue.split('-')[0]}</div>
              <div className="text-[11px] text-slate-400 line-clamp-1">{event.venue.split('-')[1] || 'Main Campus'}</div>
            </div>
          </div>

          {/* QR Code Graphic */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner text-slate-900">
            <div className="w-36 h-36 bg-slate-100 p-2 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
              {/* Simulated QR Code SVG pattern */}
              <svg className="w-32 h-32 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                <rect x="18" y="18" width="9" height="9" fill="#0f172a" />
                <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                <rect x="73" y="18" width="9" height="9" fill="#0f172a" />
                <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                <rect x="18" y="73" width="9" height="9" fill="#0f172a" />
                <rect x="40" y="15" width="15" height="10" />
                <rect x="45" y="30" width="20" height="8" />
                <rect x="40" y="45" width="20" height="20" />
                <rect x="65" y="45" width="10" height="15" />
                <rect x="75" y="70" width="15" height="15" />
                <rect x="40" y="75" width="15" height="10" />
              </svg>
            </div>
            <div className="flex items-center space-x-1 text-[11px] text-slate-700 font-bold mt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Scan at Venue Turnstile / Gate Check-In</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={() =>
              openGoogleCalendar({
                title: event.title,
                description: `BMU Entry Pass #${event.id.toUpperCase()}: ${event.description}`,
                venue: event.venue,
                date: event.date,
                startTime: event.startTime,
                endTime: event.endTime,
              })
            }
            className="flex items-center space-x-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-sky-200 border border-blue-500/40 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
            title="Add event to Google Calendar"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-sky-400" />
            <span>Google Calendar</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Save / Print</span>
          </button>
        </div>
      </div>
    </div>
  );
}
