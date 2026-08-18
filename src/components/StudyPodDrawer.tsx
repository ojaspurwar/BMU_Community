'use client';

import React, { useState, useEffect } from 'react';
import { StudyPod, UserProfile, PodTask } from '@/types';
import {
  X,
  Send,
  Users,
  Clock,
  MapPin,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Share2,
  Check,
  Volume2,
  BookOpen,
  CheckSquare,
  Square,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface StudyPodDrawerProps {
  pod: StudyPod | null;
  currentUser: UserProfile;
  onClose: () => void;
  onSendMessage: (podId: string, text: string) => void;
  onLeave: (podId: string) => void;
  onJoin: (podId: string) => void;
  onAddTask?: (podId: string, text: string) => void;
  onToggleTask?: (podId: string, taskId: string) => void;
}

export function StudyPodDrawer({
  pod,
  currentUser,
  onClose,
  onSendMessage,
  onLeave,
  onJoin,
  onAddTask,
  onToggleTask,
}: StudyPodDrawerProps) {
  if (!pod) return null;

  const isMember = pod.members.some((m) => m.id === currentUser.id);
  const [chatInput, setChatInput] = useState('');
  const [taskInput, setTaskInput] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // 25-minute Pomodoro Timer state
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && pomodoroSeconds > 0) {
      interval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(pod.id, chatInput);
    setChatInput('');
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim() || !onAddTask) return;
    onAddTask(pod.id, taskInput);
    setTaskInput('');
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(
      `Join my BMU Study Pod for "${pod.title}" at ${pod.zoneName} on CampusPulse!`
    );
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Live Study Pod
              </span>
              <span className="text-xs text-slate-400">
                {pod.members.length}/{pod.maxMembers} Joined
              </span>
            </div>
            <h3 className="text-base font-black text-slate-100 leading-snug">{pod.title}</h3>
            <div className="flex items-center space-x-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{pod.zoneName}</span>
              <span>•</span>
              <span className="text-sky-400">Host: {pod.hostName}</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleCopyShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Share Pod Link"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Pomodoro Focus Timer Bar */}
        <div className="p-3 bg-gradient-to-r from-blue-950/40 via-slate-950 to-emerald-950/40 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="font-mono text-xl font-black text-sky-400 bg-slate-900 px-3 py-1 rounded-xl border border-slate-800">
              {formatTimer(pomodoroSeconds)}
            </div>
            <div className="text-[10px] text-slate-400">
              <div className="font-bold text-slate-300">Synchronized Sprint</div>
              <div>{isTimerRunning ? 'Deep Focus Active' : 'Timer Paused'}</div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1 shadow ${
                isTimerRunning
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isTimerRunning ? 'Pause' : 'Start'}</span>
            </button>

            <button
              onClick={() => {
                setIsTimerRunning(false);
                setPomodoroSeconds(25 * 60);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              title="Reset Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Member Strip */}
        <div className="p-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {pod.members.map((m) => (
              <div key={m.id} className="relative group shrink-0" title={`${m.name} (${m.rollNo})`}>
                <img
                  src={m.avatar}
                  alt={m.name}
                  className="w-7 h-7 rounded-xl object-cover ring-2 ring-blue-500/50"
                />
              </div>
            ))}
          </div>

          {isMember ? (
            <button
              onClick={() => onLeave(pod.id)}
              className="text-[11px] text-rose-400 hover:text-rose-300 font-bold px-2 py-1 rounded-lg bg-rose-500/10 border border-rose-500/20 shrink-0 ml-2"
            >
              Leave Pod
            </button>
          ) : (
            <button
              onClick={() => onJoin(pod.id)}
              className="text-[11px] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold px-3 py-1 rounded-lg shadow-md shadow-blue-600/20 shrink-0 ml-2"
            >
              Join Pod
            </button>
          )}
        </div>

        {/* Pod Task Sprint Checklist */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Sprint Goal Checklist</span>
            <span className="text-emerald-400 font-mono">
              {(pod.tasks || []).filter((t) => t.completed).length}/{(pod.tasks || []).length} done
            </span>
          </div>

          <div className="space-y-1 max-h-28 overflow-y-auto">
            {(pod.tasks || []).map((t) => (
              <div
                key={t.id}
                onClick={() => onToggleTask && onToggleTask(pod.id, t.id)}
                className="flex items-center space-x-2 text-xs p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
              >
                {t.completed ? (
                  <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                )}
                <span
                  className={`truncate flex-1 ${
                    t.completed ? 'line-through text-slate-500' : 'text-slate-200'
                  }`}
                >
                  {t.text}
                </span>
                <span className="text-[9px] text-slate-500 shrink-0">{t.addedBy}</span>
              </div>
            ))}
          </div>

          {/* Add task mini form */}
          {isMember && onAddTask && (
            <form onSubmit={handleAddTask} className="flex gap-1.5 pt-1">
              <input
                type="text"
                placeholder="Add sprint objective..."
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className="flex-1 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-1 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Live Chat Messages Feed */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {pod.messages.length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-8">
              No messages yet. Send a note to your study peers!
            </div>
          ) : (
            pod.messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              const isSystem = msg.senderId === 'system';

              if (isSystem) {
                return (
                  <div key={msg.id} className="text-center text-[10px] text-slate-500 italic py-1">
                    {msg.text}
                  </div>
                );
              }

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="text-[10px] text-slate-400 mb-0.5 px-1 font-semibold">
                    {msg.senderName} • {msg.timestamp}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      isMe
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow'
                        : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
          <input
            type="text"
            placeholder={
              isMember
                ? 'Type message to pod squad...'
                : 'Join this pod to chat & collaborate...'
            }
            disabled={!isMember}
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!isMember || !chatInput.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-xl transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
