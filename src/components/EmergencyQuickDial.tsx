'use client';

import React, { useState } from 'react';
import { emergencyContacts } from '@/data/mockData';
import { useCampusPulse } from '@/lib/store';
import {
  PhoneCall,
  X,
  ShieldAlert,
  Ambulance,
  Home,
  Wifi,
  HeartHandshake,
  Copy,
  Check,
  Radio,
  Send,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmergencyQuickDialProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmergencyQuickDial({ isOpen, onClose }: EmergencyQuickDialProps) {
  const { triggerSOSBeacon, currentUser } = useCampusPulse();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [showSOSTrigger, setShowSOSTrigger] = useState(false);
  const [sosLocation, setSosLocation] = useState('Hostel Tower H3 / Ground Floor');
  const [sosDetails, setSosDetails] = useState('Immediate medical / security assistance requested');
  const [sosSent, setSosSent] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (num: string, idx: number) => {
    navigator.clipboard.writeText(num);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleTriggerSOS = (e: React.FormEvent) => {
    e.preventDefault();
    triggerSOSBeacon(sosLocation, sosDetails);
    setSosSent(true);
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#ef4444', '#dc2626', '#f87171'],
      });
    } catch (e) {}
    setTimeout(() => {
      setSosSent(false);
      setShowSOSTrigger(false);
      onClose();
    }, 2000);
  };

  const getContactIcon = (icon: string) => {
    switch (icon) {
      case 'Ambulance':
        return <Ambulance className="w-5 h-5 text-rose-400" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-amber-400" />;
      case 'Home':
        return <Home className="w-5 h-5 text-emerald-400" />;
      case 'Wifi':
        return <Wifi className="w-5 h-5 text-sky-400" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-teal-400" />;
      default:
        return <PhoneCall className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-slate-900 border border-rose-500/40 rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-900/90 via-slate-900 to-rose-950/90 p-5 border-b border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-bounce text-rose-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">BMU 24/7 Safety & SOS Helpline</h3>
              <p className="text-xs text-rose-200">Emergency Quick Dial & Broadcast Beacon</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SOS Broadcast Banner CTA */}
        <div className="p-4 bg-red-950/30 border-b border-red-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-red-400 animate-ping" />
            <span className="text-xs font-bold text-red-200">Need immediate help on campus?</span>
          </div>
          <button
            onClick={() => setShowSOSTrigger(!showSOSTrigger)}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold px-3 py-1.5 rounded-xl text-xs shadow-md shadow-red-600/30 transition-all"
          >
            {showSOSTrigger ? 'Hide Form' : '🚨 Trigger SOS Beacon'}
          </button>
        </div>

        {/* SOS Beacon Form */}
        {showSOSTrigger && (
          <form onSubmit={handleTriggerSOS} className="p-5 bg-slate-950 border-b border-rose-500/30 space-y-3 animate-fade-in">
            <div className="text-xs font-bold text-slate-200">Broadcast Campus SOS Beacon as {currentUser.name}</div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Your Exact Location</label>
              <input
                type="text"
                required
                value={sosLocation}
                onChange={(e) => setSosLocation(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Emergency Nature</label>
              <input
                type="text"
                required
                value={sosDetails}
                onChange={(e) => setSosDetails(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              disabled={sosSent}
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center space-x-2"
            >
              {sosSent ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>SOS Broadcasted Across BMU Grid!</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  <span>Send Real-Time SOS Broadcast to Campus Network</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Contacts List */}
        <div className="p-5 space-y-3 max-h-[55vh] overflow-y-auto">
          {emergencyContacts.map((contact, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-start space-x-3 truncate">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                  {getContactIcon(contact.icon)}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-slate-100 truncate">{contact.name}</div>
                  <div className="text-[11px] text-slate-400">{contact.role}</div>
                  <div className="text-xs font-mono font-bold text-rose-400 mt-1">
                    {contact.number}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleCopy(contact.number, idx)}
                  className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-800"
                  title="Copy Contact Number"
                >
                  {copiedIndex === idx ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <a
                  href={`tel:${contact.number.replace(/\s+/g, '')}`}
                  className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-md shadow-rose-600/20 transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Main Gate 1 & 2 Security desk operates 24/7. In life-threatening emergencies, dial campus ambulance directly.
        </div>
      </div>
    </div>
  );
}
