'use client';

import React, { useState } from 'react';
import { useCampusPulse } from '@/lib/store';
import { ShieldCheck, Mail, Lock, User, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';

export function AuthPage() {
  const { setIsAuthenticated, setCurrentUser, users } = useCampusPulse();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (!email.endsWith('@bmu.edu.in')) {
      setError('Access Denied. Only official @bmu.edu.in emails are authorized.');
      return;
    }

    if (isLogin) {
      const adminUser = users[0];
      if (email === adminUser.email && password === 'admin123') {
        setCurrentUser(adminUser);
        setIsAuthenticated(true);
      } else if (email === adminUser.email) {
        setError('Incorrect password for admin profile. (Hint: admin123)');
      } else {
        setError('Profile not found. Please Request Clearance (Sign Up).');
      }
    } else {
      // Sign up flow
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      // Create a temporary profile for them
      setCurrentUser({
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        rollNo: 'NEW-808',
        department: 'BML Munjal University',
        year: '1st Year',
        role: 'student',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        hostel: 'TBD',
        roomNo: 'TBD',
        reputation: 100,
        badges: ['New Recruit'],
        karmaPoints: 100,
        studyHoursThisWeek: 0,
      });
      setIsAuthenticated(true);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#060911] text-white flex items-center justify-center p-4 relative overflow-x-hidden overflow-y-auto">
      {/* Cyber Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-teal-500/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border border-teal-500/30 bg-teal-500/10 shadow-[0_0_30px_rgba(20,184,166,0.15)] mb-6">
            <Cpu className="w-10 h-10 text-teal-400" />
          </div>
          <h1 className="font-display text-4xl font-black tracking-tight text-white mb-2">
            CampusPulse <span className="text-teal-400">OS</span>
          </h1>
          <p className="text-slate-400 text-sm font-mono tracking-widest uppercase">
            BMU Central Nexus Directory
          </p>
        </div>

        <div className="glass-panel-luxury p-6 sm:p-8 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-500 to-transparent opacity-50" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-3">
            <h2 className="text-xl font-bold">
              {isLogin ? 'Authentication Required' : 'Request Clearance'}
            </h2>
            <div className="flex items-center space-x-2 text-xs font-mono text-teal-400">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>SECURE</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-500/50 flex items-start space-x-3 text-red-200 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0a0f1c] border border-white/10 rounded-xl text-base focus:outline-none focus:border-teal-500/50 focus:bg-teal-950/10 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Official BMU Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  placeholder="name.23cse@bmu.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0f1c] border border-white/10 rounded-xl text-base focus:outline-none focus:border-teal-500/50 focus:bg-teal-950/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Passphrase
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0f1c] border border-white/10 rounded-xl text-base focus:outline-none focus:border-teal-500/50 focus:bg-teal-950/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white font-bold rounded-xl flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all hover:scale-[1.02]"
            >
              <span>{isLogin ? 'INITIALIZE LOGIN' : 'SUBMIT DIRECTIVE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-xs text-slate-400 hover:text-teal-300 font-medium transition-colors"
            >
              {isLogin
                ? "Don't have clearance? Request Access"
                : 'Already have an ID? Initialize Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
