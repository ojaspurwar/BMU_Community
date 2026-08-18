'use client';

import React, { useState } from 'react';
import { useCampusPulse } from '@/lib/store';
import { CampusZone, NoiseLevel, OutletStatus, ACStatus } from '@/types';
import { StudyPodDrawer } from './StudyPodDrawer';
import {
  Compass,
  Volume2,
  VolumeX,
  Plug,
  Wifi,
  Users,
  Plus,
  Radio,
  MapPin,
  Sparkles,
  Check,
  X,
  Clock,
  Layers,
  Thermometer,
  Zap,
  Target,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function StudyRadarModule() {
  const {
    campusZones,
    updateZoneTelemetry,
    studyPods,
    createStudyPod,
    joinStudyPod,
    leaveStudyPod,
    sendPodMessage,
    addPodTask,
    togglePodTask,
    selectedPodId,
    setSelectedPodId,
    currentUser,
    setIsMapOpen,
  } = useCampusPulse();

  const [isSpinUpOpen, setIsSpinUpOpen] = useState(false);
  const [activeTelemetryZone, setActiveTelemetryZone] = useState<CampusZone | null>(null);
  const [zoneFilter, setZoneFilter] = useState<'All' | 'Quiet' | 'AC' | 'FastWifi'>('All');

  // New Pod State
  const [podTitle, setPodTitle] = useState('');
  const [podTopic, setPodTopic] = useState('');
  const [podZoneId, setPodZoneId] = useState(campusZones[0]?.id || 'zone-1');
  const [podMaxMembers, setPodMaxMembers] = useState(4);
  const [podDuration, setPodDuration] = useState(60);
  const [podNotes, setPodNotes] = useState('');

  // Telemetry Feedback State
  const [reportedNoise, setReportedNoise] = useState<NoiseLevel>('Low');
  const [reportedOutlets, setReportedOutlets] = useState<OutletStatus>('Plentiful');
  const [reportedOccupancy, setReportedOccupancy] = useState<number>(50);

  const activePod = studyPods.find((p) => p.id === selectedPodId) || null;

  const filteredZones = campusZones.filter((zone) => {
    if (zoneFilter === 'Quiet') return zone.noise === 'Silent' || zone.noise === 'Low';
    if (zoneFilter === 'AC') return zone.acStatus === 'Chill' || zone.acStatus === 'Optimal';
    if (zoneFilter === 'FastWifi') return zone.wifiSpeedMbps >= 100;
    return true;
  });

  const handleSpinUpPod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!podTitle.trim() || !podTopic.trim()) return;

    createStudyPod({
      title: podTitle,
      topic: podTopic,
      zoneId: podZoneId,
      maxMembers: Number(podMaxMembers) || 4,
      durationMinutes: Number(podDuration) || 60,
      notes: podNotes || undefined,
      isPrivate: false,
    });

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#3b82f6', '#10b981', '#38bdf8'],
      });
    } catch (e) {}

    setIsSpinUpOpen(false);
    setPodTitle('');
    setPodTopic('');
    setPodNotes('');
  };

  const handleSaveTelemetry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTelemetryZone) return;

    updateZoneTelemetry(activeTelemetryZone.id, {
      noise: reportedNoise,
      outlets: reportedOutlets,
      occupancyPercent: reportedOccupancy,
    });

    setActiveTelemetryZone(null);
  };

  const getNoiseBadge = (noise: NoiseLevel) => {
    switch (noise) {
      case 'Silent':
        return {
          bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
          icon: <VolumeX className="w-3.5 h-3.5" />,
          label: 'Silent Sanctum',
        };
      case 'Low':
        return {
          bg: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
          icon: (
            <div className="flex items-center space-x-0.5 h-3 mr-0.5">
              <span className="w-0.5 bg-blue-400 rounded-full wave-bar-1" />
              <span className="w-0.5 bg-blue-400 rounded-full wave-bar-2" />
              <span className="w-0.5 bg-blue-400 rounded-full wave-bar-3" />
            </div>
          ),
          label: 'Low Whisper',
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
          icon: (
            <div className="flex items-center space-x-0.5 h-3 mr-0.5">
              <span className="w-0.5 bg-amber-400 rounded-full wave-bar-1" />
              <span className="w-0.5 bg-amber-400 rounded-full wave-bar-2" />
              <span className="w-0.5 bg-amber-400 rounded-full wave-bar-3" />
              <span className="w-0.5 bg-amber-400 rounded-full wave-bar-4" />
            </div>
          ),
          label: 'Moderate Chat',
        };
      case 'Lively':
        return {
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
          icon: <Volume2 className="w-3.5 h-3.5" />,
          label: 'Lively Hub',
        };
    }
  };

  const getOutletBadge = (outlets: OutletStatus) => {
    switch (outlets) {
      case 'Plentiful':
        return { text: 'text-emerald-400', label: 'Plenty Available (>80%)' };
      case 'Moderate':
        return { text: 'text-blue-400', label: 'Some Outlets Free' };
      case 'Scarce':
        return { text: 'text-amber-400', label: 'Almost Full (<20%)' };
      case 'None':
        return { text: 'text-rose-400', label: 'No Outlets Free' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner - Electric Sapphire Blue & Emerald */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/40 p-6 sm:p-7 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1.5 bg-blue-500/15 border border-blue-500/30 text-sky-400 text-[11px] font-black uppercase px-3 py-0.5 rounded-full shadow-sm">
                <Radio className="w-3.5 h-3.5 animate-pulse text-sky-400" />
                <span>Live Crowd & Outlet Telemetry</span>
              </span>
              <span className="text-xs text-slate-400">BMU Campus Sensor Grid</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Study Spot Radar & Collaborative Pod Launcher
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Find quiet study zones with verified AC, high-speed Wi-Fi, and open charging outlets. Launch synchronized study pods to complete assignments with hostel peers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsMapOpen(true)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-3.5 py-2.5 rounded-2xl text-xs transition-colors"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Campus Map View</span>
            </button>

            <button
              onClick={() => setIsSpinUpOpen(true)}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Spin Up Study Pod</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Study Pods Ticker */}
      {studyPods.length > 0 && (
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-950/20 via-slate-900/90 to-emerald-950/20 border border-blue-500/30 rounded-3xl space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                Active Peer Study Pods Happening Right Now
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {studyPods.length} {studyPods.length === 1 ? 'Pod' : 'Pods'} Active
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {studyPods.map((pod) => {
              const isMember = pod.members.some((m) => m.id === currentUser.id);
              const isFull = pod.members.length >= (pod.maxMembers || 6);

              return (
                <div
                  key={pod.id}
                  onClick={() => setSelectedPodId(pod.id)}
                  className="p-3.5 bg-slate-950/90 border border-slate-800 hover:border-blue-500/40 rounded-2xl transition-all cursor-pointer space-y-2 group shadow"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/15 text-sky-400 border border-blue-500/30 px-2 py-0.5 rounded-md">
                      {pod.topic}
                    </span>
                    <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                      <Users className="w-3 h-3 text-emerald-400" />
                      <span className="font-semibold text-slate-200">
                        {pod.members.length}/{pod.maxMembers}
                      </span>
                    </div>
                  </div>

                  <div className="font-bold text-xs text-slate-100 group-hover:text-sky-400 transition-colors line-clamp-1">
                    {pod.title}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-900">
                    <span className="truncate max-w-[140px] text-slate-300">📍 {pod.zoneName}</span>
                    <span className={isMember ? 'text-emerald-400 font-bold' : 'text-sky-400'}>
                      {isMember ? 'Joined (Open)' : isFull ? 'Full' : 'Join Pod →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Zone Filters Control Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none w-full sm:w-auto">
          <button
            onClick={() => setZoneFilter('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              zoneFilter === 'All'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All 6 Zones
          </button>
          <button
            onClick={() => setZoneFilter('Quiet')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              zoneFilter === 'Quiet'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            🔇 Silent / Whisper Only
          </button>
          <button
            onClick={() => setZoneFilter('AC')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              zoneFilter === 'AC'
                ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/25'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            ❄️ Optimal AC Chill
          </button>
          <button
            onClick={() => setZoneFilter('FastWifi')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              zoneFilter === 'FastWifi'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            ⚡ Fast Wi-Fi (&gt;100 Mbps)
          </button>
        </div>

        <span className="text-[11px] text-slate-400 shrink-0">
          Showing <strong className="text-slate-200">{filteredZones.length}</strong> monitored spots
        </span>
      </div>

      {/* Campus Zones Telemetry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredZones.map((zone) => {
          const noiseBadge = getNoiseBadge(zone.noise);
          const outletBadge = getOutletBadge(zone.outlets);

          // Occupancy bar color
          let occColor = 'bg-emerald-500';
          if (zone.occupancyPercent > 45) occColor = 'bg-blue-500';
          if (zone.occupancyPercent > 75) occColor = 'bg-rose-500';

          return (
            <div
              key={zone.id}
              className="flex flex-col justify-between rounded-3xl bg-slate-900/80 border border-slate-800/90 hover:border-blue-500/40 p-5 transition-all duration-200 shadow-lg space-y-4"
            >
              <div className="space-y-3.5">
                {/* Zone Name & Noise Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-100 leading-snug">{zone.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{zone.location}</p>
                  </div>
                  <div
                    className={`flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-xl border shrink-0 ${noiseBadge.bg}`}
                  >
                    {noiseBadge.icon}
                    <span>{noiseBadge.label}</span>
                  </div>
                </div>

                {/* Live Occupancy Gauge Meter */}
                <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Live Occupancy</span>
                    <span className="font-mono font-bold text-slate-200">{zone.occupancyPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${occColor} transition-all duration-500 rounded-full`}
                      style={{ width: `${zone.occupancyPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>{zone.occupancyPercent < 50 ? 'Spacious Seating' : 'High Traffic'}</span>
                    <span>Updated {zone.lastUpdated}</span>
                  </div>
                </div>

                {/* Telemetry Sensor Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center space-x-2">
                    <Plug className={`w-4 h-4 ${outletBadge.text} shrink-0`} />
                    <div className="truncate">
                      <div className="text-[10px] text-slate-400 font-medium leading-none">
                        Power Outlets
                      </div>
                      <div className={`text-xs font-bold mt-1 ${outletBadge.text} truncate`}>
                        {zone.outlets}
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center space-x-2">
                    <Wifi className="w-4 h-4 text-sky-400 shrink-0" />
                    <div className="truncate">
                      <div className="text-[10px] text-slate-400 font-medium leading-none">
                        Campus Wi-Fi
                      </div>
                      <div className="text-xs font-bold text-slate-200 mt-1 truncate">
                        {zone.wifiSpeedMbps} Mbps
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features & AC Status */}
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] bg-blue-500/10 text-sky-400 border border-blue-500/20 px-2 py-0.5 rounded-md font-medium">
                    ❄️ AC {zone.acStatus}
                  </span>
                  {zone.features.slice(0, 2).map((f) => (
                    <span
                      key={f}
                      className="text-[10px] bg-slate-950 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-md"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions: Update Telemetry & Spin Up Pod in this Zone */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setActiveTelemetryZone(zone);
                    setReportedNoise(zone.noise);
                    setReportedOutlets(zone.outlets);
                    setReportedOccupancy(zone.occupancyPercent);
                  }}
                  className="text-xs font-semibold text-slate-400 hover:text-slate-200 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
                  title="Contribute crowd telemetry data"
                >
                  Report Status
                </button>

                <button
                  onClick={() => {
                    setPodZoneId(zone.id);
                    setIsSpinUpOpen(true);
                  }}
                  className="flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs shadow-md shadow-blue-600/20 transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Start Pod Here</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spin Up Study Pod Modal */}
      {isSpinUpOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Launch Synchronized Study Pod</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Host an exam sprint or project squad at BMU
                </p>
              </div>
              <button
                onClick={() => setIsSpinUpOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSpinUpPod} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Study Pod Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Operating Systems Lab 4 Prep & Review"
                  value={podTitle}
                  onChange={(e) => setPodTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Subject / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OS / LeetCode / CAD"
                    value={podTopic}
                    onChange={(e) => setPodTopic(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Select Campus Zone *
                  </label>
                  <select
                    value={podZoneId}
                    onChange={(e) => setPodZoneId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    {campusZones.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Capacity (Peers) *
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={12}
                    value={podMaxMembers}
                    onChange={(e) => setPodMaxMembers(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duration (Minutes) *
                  </label>
                  <select
                    value={podDuration}
                    onChange={(e) => setPodDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value={45}>45 Minutes (Sprint)</option>
                    <option value={60}>60 Minutes (Standard)</option>
                    <option value={90}>90 Minutes (Deep Dive)</option>
                    <option value={120}>120 Minutes (Exam Marathon)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Specific Objectives or Goals (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. We will solve 4 scheduling algorithm problems and test mutual code..."
                  value={podNotes}
                  onChange={(e) => setPodNotes(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSpinUpOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25"
                >
                  Broadcast & Start Pod
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Telemetry Modal */}
      {activeTelemetryZone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  Update Sensor Telemetry for {activeTelemetryZone.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Help fellow students know live noise and outlet availability
                </p>
              </div>
              <button
                onClick={() => setActiveTelemetryZone(null)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTelemetry} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Noise Level
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Silent', 'Low', 'Moderate', 'Lively'] as NoiseLevel[]).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setReportedNoise(lvl)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                        reportedNoise === lvl
                          ? 'bg-blue-600/20 border-blue-500 text-sky-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Outlet Availability
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Plentiful', 'Moderate', 'Scarce', 'None'] as OutletStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setReportedOutlets(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                        reportedOutlets === st
                          ? 'bg-emerald-600/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Occupancy Estimate</span>
                  <span className="font-mono text-sky-400">{reportedOccupancy}%</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={reportedOccupancy}
                  onChange={(e) => setReportedOccupancy(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveTelemetryZone(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/25"
                >
                  Submit Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Study Pod Live Collab Drawer */}
      <StudyPodDrawer
        pod={activePod}
        currentUser={currentUser}
        onClose={() => setSelectedPodId(null)}
        onJoin={joinStudyPod}
        onLeave={leaveStudyPod}
        onSendMessage={sendPodMessage}
        onAddTask={addPodTask}
        onToggleTask={togglePodTask}
      />
    </div>
  );
}
