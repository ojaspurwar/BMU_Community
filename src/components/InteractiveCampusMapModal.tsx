'use client';

import React, { useState } from 'react';
import { useCampusPulse } from '@/lib/store';
import { CampusZone } from '@/types';
import {
  X,
  MapPin,
  Compass,
  Volume2,
  Plug,
  Wifi,
  Users,
  Building,
  Sparkles,
  Layers,
  Flame,
  Radio,
} from 'lucide-react';

export function InteractiveCampusMapModal() {
  const { isMapOpen, setIsMapOpen, campusZones, studyPods, setSelectedPodId, setActiveTab } =
    useCampusPulse();

  const [selectedZone, setSelectedZone] = useState<CampusZone | null>(campusZones[0] || null);

  if (!isMapOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-sky-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-100">BMU Interactive Campus Radar & Hotspots</h3>
              <p className="text-xs text-slate-400">
                Click any zone pin to check crowdsourced noise, charging outlets, and active study pods
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMapOpen(false)}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Map Body & Side Detail Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Map Graphic (Left 8 cols) */}
          <div className="lg:col-span-8 p-6 bg-slate-950 relative flex items-center justify-center overflow-auto min-h-[360px]">
            {/* Styled Campus Blueprint Canvas */}
            <div className="relative w-full aspect-[4/3] max-w-[640px] bg-slate-900/90 rounded-3xl border border-slate-800 p-4 shadow-inner overflow-hidden">
              {/* Campus Roads & Walkways */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-10 bg-slate-950/80 rounded-2xl border border-slate-800/60" />
              <div className="absolute inset-y-8 left-1/3 w-10 bg-slate-950/80 rounded-2xl border border-slate-800/60" />
              <div className="absolute inset-y-8 right-1/3 w-10 bg-slate-950/80 rounded-2xl border border-slate-800/60" />

              {/* Landmark Buildings */}
              <div className="absolute top-4 left-6 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 text-[10px] text-sky-400 font-bold">
                Main Gate 1 & Security
              </div>

              <div className="absolute bottom-4 right-6 px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 text-[10px] text-emerald-400 font-bold">
                Sports Arena & Floodlit Ground
              </div>

              {/* Interactive Zone Pins */}
              {campusZones.map((zone) => {
                const isSelected = selectedZone?.id === zone.id;
                const zonePods = studyPods.filter((p) => p.zoneId === zone.id);

                return (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    style={{ left: `${zone.coordinates.x}%`, top: `${zone.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 ${
                      isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110'
                    }`}
                  >
                    <div
                      className={`relative flex items-center justify-center p-2.5 rounded-2xl shadow-xl transition-colors ${
                        isSelected
                          ? 'bg-blue-600 text-white ring-4 ring-blue-500/30'
                          : zonePods.length > 0
                          ? 'bg-emerald-600 text-white animate-bounce'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      {zonePods.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
                      )}
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md bg-black/90 text-[9px] font-bold text-slate-200 whitespace-nowrap shadow border border-white/10 opacity-80 group-hover:opacity-100">
                      {zone.name.split('(')[0]}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Zone Detail Panel (Right 4 cols) */}
          <div className="lg:col-span-4 p-5 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col justify-between overflow-y-auto">
            {selectedZone ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400 bg-blue-500/10 px-2 py-0.5 rounded-md">
                    {selectedZone.building}
                  </span>
                  <h4 className="text-base font-bold text-slate-100 mt-1.5 leading-snug">
                    {selectedZone.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedZone.location}</p>
                </div>

                {/* Telemetry Status Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Noise</div>
                    <div className="font-bold text-slate-200 mt-0.5">{selectedZone.noise}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Outlets</div>
                    <div className="font-bold text-emerald-400 mt-0.5">{selectedZone.outlets}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Wi-Fi</div>
                    <div className="font-bold text-sky-400 mt-0.5">{selectedZone.wifiSpeedMbps} Mbps</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Occupancy</div>
                    <div className="font-bold text-slate-200 mt-0.5">{selectedZone.occupancyPercent}%</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-1">
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                    Zone Features
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedZone.features.map((f) => (
                      <span
                        key={f}
                        className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Active Pods in this zone */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                    <span>Active Pods Here</span>
                    <span className="text-emerald-400 font-mono">
                      {studyPods.filter((p) => p.zoneId === selectedZone.id).length} Active
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {studyPods.filter((p) => p.zoneId === selectedZone.id).length === 0 ? (
                      <div className="text-xs text-slate-500 py-2 italic text-center">
                        No active pods right now. Start one!
                      </div>
                    ) : (
                      studyPods
                        .filter((p) => p.zoneId === selectedZone.id)
                        .map((pod) => (
                          <div
                            key={pod.id}
                            onClick={() => {
                              setSelectedPodId(pod.id);
                              setIsMapOpen(false);
                            }}
                            className="p-2 bg-slate-950 rounded-xl border border-slate-800 hover:border-blue-500 cursor-pointer flex items-center justify-between text-xs"
                          >
                            <span className="font-semibold text-slate-200 truncate mr-2">
                              {pod.title}
                            </span>
                            <span className="text-[10px] bg-blue-500/10 text-sky-400 px-1.5 py-0.2 rounded shrink-0">
                              {pod.members.length}/{pod.maxMembers}
                            </span>
                          </div>
                        ))
                    )}
                  </div>
                </div>

                {/* Switch to Radar Button */}
                <button
                  onClick={() => {
                    setActiveTab('radar');
                    setIsMapOpen(false);
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl text-xs shadow-md shadow-blue-600/20 transition-all"
                >
                  Open in Study Radar
                </button>
              </div>
            ) : (
              <div className="text-center text-xs text-slate-400 my-auto">
                Select a zone from the campus blueprint
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
