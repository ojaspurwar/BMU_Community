'use client';

import React, { useState } from 'react';
import { MarketplaceItem, UserProfile } from '@/types';
import { X, Send, MapPin, Sparkles, ShieldAlert, CheckCircle2, ShieldCheck } from 'lucide-react';

interface MarketplaceChatDrawerProps {
  item: MarketplaceItem | null;
  currentUser: UserProfile;
  onClose: () => void;
  onMarkStatus: (itemId: string, status: 'Available' | 'Reserved' | 'Completed') => void;
}

export function MarketplaceChatDrawer({
  item,
  currentUser,
  onClose,
  onMarkStatus,
}: MarketplaceChatDrawerProps) {
  if (!item) return null;

  const isOwner = item.sellerId === currentUser.id;

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      senderId: item.sellerId,
      senderName: item.sellerName.split(' ')[0],
      text:
        item.type === 'Swap'
          ? `Hey! I'm offering "${item.skillOffer}". Looking for "${item.skillRequest}". Let me know your preferred time!`
          : `Hey! The "${item.title}" is currently available. Can meet at ${item.sellerHostel} or Library Ground Floor.`,
      time: '10:30 AM',
    },
  ]);

  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name.split(' ')[0],
      text: inputMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');

    // Simulate auto-response if chatting with someone else
    if (!isOwner) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `m-reply-${Date.now()}`,
            senderId: item.sellerId,
            senderName: item.sellerName.split(' ')[0],
            text: `Sounds awesome! I am available near ${item.sellerHostel} after 4:30 PM. Let's connect then!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 1200);
    }
  };

  const quickPrompts = [
    item.type === 'Swap' ? 'When are you free for a study sprint?' : 'Is this still available?',
    'Can we meet at Central Library Ground Floor?',
    'Are you available after 5:00 PM today?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 flex flex-col h-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={item.sellerAvatar}
              alt={item.sellerName}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-500/40"
            />
            <div>
              <div className="text-sm font-bold text-slate-100 flex items-center space-x-1.5">
                <span>{item.sellerName}</span>
                {isOwner && (
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded">
                    You
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{item.sellerHostel}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Summary Bar */}
        <div className="p-3 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 truncate mr-2">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
            />
            <div className="truncate">
              <div className="text-xs font-bold text-slate-200 truncate">{item.title}</div>
              <div className="text-[11px] text-emerald-400 font-bold">
                {item.type === 'Swap' ? '🔄 Skill Swap' : `₹${item.price}`}
              </div>
            </div>
          </div>

          {isOwner ? (
            <select
              value={item.status}
              onChange={(e) =>
                onMarkStatus(item.id, e.target.value as 'Available' | 'Reserved' | 'Completed')
              }
              className="px-2 py-1 bg-slate-950 border border-slate-700 rounded-lg text-[10px] text-slate-300 shrink-0 focus:outline-none"
            >
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
              <option value="Completed">Completed</option>
            </select>
          ) : (
            <span className="text-[10px] bg-slate-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md font-bold shrink-0">
              {item.status}
            </span>
          )}
        </div>

        {/* Safety Note */}
        <div className="px-4 py-2 bg-blue-950/20 border-b border-blue-500/20 flex items-center space-x-2 text-[11px] text-sky-300">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Campus Safety: Meet at public points (SAC Lounge / Library) for exchanges.</span>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg) => {
            const isMe = msg.senderId === currentUser.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="text-[10px] text-slate-400 mb-0.5 px-1 font-semibold">
                  {msg.senderName} • {msg.time}
                </div>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    isMe
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none shadow'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2 border-t border-slate-800 bg-slate-950/80 flex gap-1.5 overflow-x-auto scrollbar-none">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setInputMsg(p)}
              className="text-[10px] bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 whitespace-nowrap transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
          <input
            type="text"
            placeholder="Type message to peer..."
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            disabled={!inputMsg.trim()}
            className="p-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white rounded-xl transition-all shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
