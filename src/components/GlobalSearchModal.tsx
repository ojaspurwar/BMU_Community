'use client';

import React, { useState, useEffect } from 'react';
import { useCampusPulse } from '@/lib/store';
import {
  Search,
  X,
  Calendar,
  ShoppingBag,
  Trophy,
  Bell,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const {
    events,
    marketplaceItems,
    sportsFacilities,
    sportsMatches,
    notices,
    setActiveTab,
  } = useCampusPulse();

  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const matchedEvents = query.trim()
    ? events.filter(
        (e) =>
          e.title.toLowerCase().includes(query.toLowerCase()) ||
          e.organizer.toLowerCase().includes(query.toLowerCase()) ||
          e.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const matchedItems = query.trim()
    ? marketplaceItems.filter(
        (i) =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.category.toLowerCase().includes(query.toLowerCase()) ||
          (i.skillOffer && i.skillOffer.toLowerCase().includes(query.toLowerCase())) ||
          (i.skillRequest && i.skillRequest.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const matchedSports = query.trim()
    ? [
        ...sportsFacilities.filter(
          (f) =>
            f.name.toLowerCase().includes(query.toLowerCase()) ||
            f.category.toLowerCase().includes(query.toLowerCase())
        ),
        ...sportsMatches.filter(
          (m) =>
            m.title.toLowerCase().includes(query.toLowerCase()) ||
            m.sport.toLowerCase().includes(query.toLowerCase()) ||
            m.teamA.name.toLowerCase().includes(query.toLowerCase()) ||
            m.teamB.name.toLowerCase().includes(query.toLowerCase())
        ),
      ]
    : [];

  const matchedNotices = query.trim()
    ? notices.filter(
        (n) =>
          n.title.toLowerCase().includes(query.toLowerCase()) ||
          n.issuer.toLowerCase().includes(query.toLowerCase()) ||
          n.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const hasMatches =
    matchedEvents.length > 0 ||
    matchedItems.length > 0 ||
    matchedSports.length > 0 ||
    matchedNotices.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center space-x-3">
          <Search className="w-5 h-5 text-sky-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search BMU events, peer gear, skill swaps, sports courts, circulars..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {!query.trim() && (
            <div className="py-8 text-center text-xs text-slate-500">
              Type keywords like <span className="text-rose-400 font-bold">"HackBMU"</span>,{' '}
              <span className="text-emerald-400 font-bold">"Skill Swap"</span>,{' '}
              <span className="text-amber-400 font-bold">"Badminton"</span>, or{' '}
              <span className="text-sky-400 font-bold">"Exam Schedule"</span>.
            </div>
          )}

          {query.trim() && !hasMatches && (
            <div className="py-8 text-center text-xs text-slate-500">
              No results found across BMU events, marketplace, sports, or circulars for "{query}".
            </div>
          )}

          {/* Events Match */}
          {matchedEvents.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-rose-400 flex items-center space-x-1.5 px-2">
                <Calendar className="w-3 h-3" />
                <span>Events & Fests ({matchedEvents.length})</span>
              </div>
              {matchedEvents.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => {
                    setActiveTab('events');
                    onClose();
                  }}
                  className="p-3 bg-slate-950/80 hover:bg-slate-900 rounded-2xl border border-slate-800/80 hover:border-red-500/40 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{ev.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {ev.category} • {ev.organizer} • {ev.venue}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          )}

          {/* Marketplace Matches */}
          {matchedItems.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5 px-2">
                <ShoppingBag className="w-3 h-3" />
                <span>Skill Swaps & Gear ({matchedItems.length})</span>
              </div>
              {matchedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveTab('marketplace');
                    onClose();
                  }}
                  className="p-3 bg-slate-950/80 hover:bg-slate-900 rounded-2xl border border-slate-800/80 hover:border-emerald-500/40 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{item.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {item.category} • {item.type === 'Swap' ? 'Skill Trade' : `₹${item.price}`} • {item.sellerHostel}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          )}

          {/* Sports Matches */}
          {matchedSports.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center space-x-1.5 px-2">
                <Trophy className="w-3 h-3" />
                <span>Sports & Arena ({matchedSports.length})</span>
              </div>
              {matchedSports.map((sp: any) => (
                <div
                  key={sp.id}
                  onClick={() => {
                    setActiveTab('sports');
                    onClose();
                  }}
                  className="p-3 bg-slate-950/80 hover:bg-slate-900 rounded-2xl border border-slate-800/80 hover:border-amber-500/40 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{sp.name || sp.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {sp.category || sp.sport} • {sp.location || sp.venue}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          )}

          {/* Notices Match */}
          {matchedNotices.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-black uppercase tracking-wider text-sky-400 flex items-center space-x-1.5 px-2">
                <Bell className="w-3 h-3" />
                <span>Verified Circulars ({matchedNotices.length})</span>
              </div>
              {matchedNotices.map((not) => (
                <div
                  key={not.id}
                  onClick={() => {
                    setActiveTab('notices');
                    onClose();
                  }}
                  className="p-3 bg-slate-950/80 hover:bg-slate-900 rounded-2xl border border-slate-800/80 hover:border-sky-500/40 cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-200">{not.title}</div>
                    <div className="text-[11px] text-slate-400">
                      {not.issuer} • {not.category}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
