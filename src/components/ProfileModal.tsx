'use client';

import React, { useState } from 'react';
import { useCampusPulse } from '@/lib/store';
import { avatarPresets } from '@/data/mockData';
import {
  X,
  User,
  ShieldCheck,
  Award,
  Sparkles,
  Camera,
  Check,
  Building,
  GraduationCap,
  Home,
  Tag,
  Send,
  Plus,
  Trash2,
  QrCode,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication Engineering',
  'Mechanical Engineering',
  'School of Management (MBA / BBA)',
  'School of Law (BA LLB / BBA LLB)',
  'School of Liberal Studies (Economics / Psychology)',
];

const HOSTELS = [
  'Hostel 1 (Boys)',
  'Hostel 2 (Girls)',
  'Hostel 3 (Boys)',
  'Hostel 4 (Boys)',
  'Hostel 5 (Boys)',
  'Hostel 6 (Girls)',
  'Day Scholar (Gurugram / Delhi NCR)',
];

const YEARS = ['1st Year (2025-2029)', '2nd Year (2024-2028)', '3rd Year (2023-2027)', '4th Year (2022-2026)', 'PG / MBA / Masters'];

export function ProfileModal() {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    currentUser,
    createCustomProfile,
    updateCurrentUserProfile,
  } = useCampusPulse();

  const [name, setName] = useState(currentUser.name);
  const [rollNo, setRollNo] = useState(currentUser.rollNo);
  const [department, setDepartment] = useState(currentUser.department);
  const [year, setYear] = useState(currentUser.year);
  const [hostel, setHostel] = useState(currentUser.hostel);
  const [roomNo, setRoomNo] = useState(currentUser.roomNo);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [bio, setBio] = useState(currentUser.bio || 'BMU Student • Tech enthusiast & campus explorer');
  const [telegram, setTelegram] = useState(currentUser.telegramOrContact || '@' + currentUser.name.toLowerCase().replace(/\s+/g, '_'));
  
  const [skills, setSkills] = useState<string[]>(
    currentUser.skills || ['React / Next.js', 'Data Structures', 'UI/UX Design', 'Football']
  );
  const [newSkillInput, setNewSkillInput] = useState('');

  if (!isProfileModalOpen) return null;

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim() || skills.includes(newSkillInput.trim())) return;
    setSkills((prev) => [...prev, newSkillInput.trim()]);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rollNo.trim()) return;

    createCustomProfile({
      name: name.trim(),
      email: `${rollNo.toLowerCase()}@bmu.edu.in`,
      rollNo: rollNo.trim(),
      department,
      year,
      avatar,
      hostel,
      roomNo,
      badges: ['Verified BMU Student', 'CampusPulse Pioneer', 'Tricolor Member'],
      bio: bio.trim(),
      skills,
      telegramOrContact: telegram.trim(),
      karmaPoints: 1500,
      studyHoursThisWeek: 18,
    });

    try {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#10b981', '#ef4444', '#3b82f6'],
      });
    } catch (e) {}

    setIsProfileModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-sky-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Create & Customize Student Profile</h3>
              <p className="text-xs text-slate-400">
                Setup your official BMU digital student identity & skills showcase
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
          {/* LEFT: Live Holographic Student ID Preview (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="text-xs font-black uppercase tracking-wider text-slate-400">
              Live BMU ID Card Preview
            </div>

            {/* Styled ID Card with Tricolor Border Accent */}
            <div className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-2 border-slate-800 p-5 shadow-2xl space-y-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* ID Card Top Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-emerald-500 flex items-center justify-center font-black text-white text-xs">
                    B
                  </div>
                  <div>
                    <div className="text-[10px] font-black tracking-wider text-white">BML MUNJAL</div>
                    <div className="text-[8px] text-slate-400 uppercase tracking-tight">University ID</div>
                  </div>
                </div>

                <span className="flex items-center space-x-1 text-[9px] font-black uppercase text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  <span>Verified</span>
                </span>
              </div>

              {/* Avatar + Main Details */}
              <div className="flex items-center space-x-3.5">
                <div className="relative">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-blue-500/50 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                </div>
                <div className="truncate">
                  <div className="font-black text-base text-white truncate">{name || 'Your Name'}</div>
                  <div className="text-xs font-mono font-bold text-sky-400 mt-0.5">{rollNo || '230101089'}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate">{department.split('(')[0]}</div>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 text-[10px]">
                <div>
                  <div className="text-slate-400 font-semibold">Hostel & Room</div>
                  <div className="font-bold text-slate-200 truncate">{hostel.split('(')[0]} • {roomNo}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-semibold">Reputation</div>
                  <div className="font-bold text-emerald-400 flex items-center space-x-1">
                    <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                    <span>98% • 1,500 Karma</span>
                  </div>
                </div>
              </div>

              {/* Bio & Skills preview */}
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <p className="line-clamp-2 italic text-slate-400">"{bio}"</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {skills.slice(0, 3).map((s) => (
                    <span
                      key={s}
                      className="text-[9px] bg-blue-500/10 text-sky-300 border border-blue-500/20 px-1.5 py-0.2 rounded"
                    >
                      {s}
                    </span>
                  ))}
                  {skills.length > 3 && (
                    <span className="text-[9px] text-slate-500 font-bold">+{skills.length - 3}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Preset Avatar Selector */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">
                Select Photo Preset or Paste URL
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {avatarPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setAvatar(preset)}
                    className={`relative rounded-xl overflow-hidden shrink-0 transition-transform ${
                      avatar === preset ? 'ring-2 ring-emerald-500 scale-105' : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={preset} alt="Preset" className="w-10 h-10 object-cover" />
                  </button>
                ))}
              </div>
              <input
                type="url"
                placeholder="Or paste custom image URL..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* RIGHT: Profile Form Fields (7 cols) */}
          <form onSubmit={handleSaveProfile} className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Roll Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 230101089"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">School & Department *</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Graduation Cohort *</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Campus Residence *</label>
                <select
                  value={hostel}
                  onChange={(e) => setHostel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  {HOSTELS.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Room / Flat Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Room 214"
                  value={roomNo}
                  onChange={(e) => setRoomNo(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Bio / Tagline (Displayed on Peer Swaps & Pods)
              </label>
              <textarea
                rows={2}
                placeholder="Share your interests, active clubs, or academic focus..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Skills & Knowledge Exchange Chips */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Skills & Talents You Can Teach / Trade
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Flutter, LeetCode Hard, Badminton 4.0..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="flex items-center space-x-1.5 text-xs bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-xl"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Telegram / Campus Handle (For Peer Chat)
              </label>
              <input
                type="text"
                placeholder="@username or phone"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-xl text-xs font-black shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
              >
                Save & Update Student Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
