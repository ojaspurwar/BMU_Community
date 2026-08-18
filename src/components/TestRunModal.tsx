'use client';

import React, { useState, useEffect } from 'react';
import { useCampusPulse } from '@/lib/store';
import {
  FlaskConical,
  Sparkles,
  CheckCircle2,
  X,
  User,
  ShieldCheck,
  Radio,
  ExternalLink,
  Layers,
  Zap,
  ArrowRight,
  RotateCcw,
  Info
} from 'lucide-react';

interface TestRunModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TestRunModal({ isOpen, onClose }: TestRunModalProps) {
  const { currentUser, users, setCurrentUser } = useCampusPulse();
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  if (!isOpen) return null;

  const handleResetData = () => {
    try {
      localStorage.removeItem('campuspulse_events');
      localStorage.removeItem('campuspulse_items');
      localStorage.removeItem('campuspulse_notices');
      localStorage.removeItem('campuspulse_facilities');
      localStorage.removeItem('campuspulse_matches');
      localStorage.removeItem('campuspulse_challenges');
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-2xl bg-[#0b111e] border border-amber-500/40 rounded-3xl overflow-hidden shadow-2xl my-auto text-slate-100 ring-1 ring-amber-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glowing Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-950/60 via-slate-900 to-blue-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 to-red-500 text-white shadow-lg shadow-amber-500/20 shrink-0">
              <FlaskConical className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  BMU_Community • Test Run Mode
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-1">
                Demo & Evaluation Test Website
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Close test notice"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Welcome Alert */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed space-y-1">
            <div className="font-bold flex items-center space-x-1.5 text-amber-300">
              <Info className="w-4 h-4 shrink-0" />
              <span>Notice for Evaluators & Reviewers</span>
            </div>
            <p className="text-slate-300 text-xs">
              This platform is actively running in <strong className="text-white">Test Run / Prototype Mode</strong> for{' '}
              <span className="text-amber-400 font-semibold">BMU_Community (CampusPulse)</span>. Pre-populated mock data for BML Munjal University is active for live testing.
            </p>
          </div>

          {/* Current Logged-in Profile Badge */}
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold uppercase tracking-wider text-[10px] text-sky-400">
                Currently Logged In Profile
              </span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded border border-emerald-500/20 flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Active Session</span>
              </span>
            </div>

            <div className="flex items-center space-x-3.5">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/40 shrink-0"
              />
              <div className="truncate">
                <div className="text-sm font-black text-white flex items-center space-x-2">
                  <span>{currentUser.name}</span>
                  <span className="text-[10px] bg-blue-500/20 text-sky-300 px-1.5 py-0.2 rounded font-mono font-normal">
                    {currentUser.rollNo}
                  </span>
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5">
                  {currentUser.department} • {currentUser.hostel}
                </div>
              </div>
            </div>

            {/* Quick Switch Persona Buttons */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[11px] font-semibold text-slate-400 mb-2">
                Quick-Switch Test Persona:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {users.slice(0, 4).map((u) => (
                  <button
                    key={u.id}
                    onClick={() => setCurrentUser(u)}
                    className={`p-2 rounded-xl text-left text-xs transition-all flex items-center space-x-2 ${
                      u.id === currentUser.id
                        ? 'bg-blue-600/30 border border-blue-500/50 text-white font-bold'
                        : 'bg-slate-950/60 border border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-lg object-cover shrink-0" />
                    <span className="truncate text-[11px]">{u.name.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Test Run Highlights */}
          <div className="space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400">
              What You Can Test in this Build:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-bold block">1-Click RSVPs & Passes</strong>
                  RSVP for HackBMU 7.0 & generate verified digital QR gate passes.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-bold block">Sports Turf Booking</strong>
                  Live slot reservation for Badminton, Football, and Cricket arena.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-bold block">Peer Skill & Gear Swap</strong>
                  Post new listings, trade hardware/notes, and test real-time chat drawer.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start space-x-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white font-bold block">Multi-Tab Telemetry Sync</strong>
                  Open two browser tabs side-by-side to see instant live state propagation.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleResetData}
            className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-rose-400 transition-colors"
            title="Clear local modifications and reload default sample data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Test Data to Default</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center space-x-2"
          >
            <span>Enter Test Website</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
