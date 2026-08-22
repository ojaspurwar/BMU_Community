'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useCampusPulse, AI_MODEL_PRESETS } from '@/lib/store';
import {
  Bot,
  Sparkles,
  Send,
  X,
  Trash2,
  Settings2,
  ChevronDown,
  ChevronUp,
  Key,
  Cpu,
  Copy,
  Check,
  Zap,
  HelpCircle,
  Flame,
  Trophy,
  ShoppingBag,
  Bell,
  Radio,
  RefreshCw,
} from 'lucide-react';

export function AIAssistantModal() {
  const {
    isAIAssistantOpen,
    setIsAIAssistantOpen,
    aiMessages,
    selectedAIModel,
    setSelectedAIModel,
    customAIModelSlug,
    setCustomAIModelSlug,
    aiApiKey,
    setAIApiKey,
    isAILoading,
    sendAIMessage,
    clearAIChat,
    currentUser,
  } = useCampusPulse();

  const [inputVal, setInputVal] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isAIAssistantOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [aiMessages, isAILoading, isAIAssistantOpen]);

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAIAssistantOpen) {
        setIsAIAssistantOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAIAssistantOpen, setIsAIAssistantOpen]);

  if (!isAIAssistantOpen) return null;

  const currentPreset =
    AI_MODEL_PRESETS.find((p) => p.id === selectedAIModel) || AI_MODEL_PRESETS[0];

  const handleSend = () => {
    if (!inputVal.trim() || isAILoading) return;
    const text = inputVal;
    setInputVal('');
    sendAIMessage(text);
  };

  const handlePromptChipClick = (promptText: string) => {
    sendAIMessage(promptText);
  };

  const handleCopy = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {}
  };

  // Helper to render basic markdown (bold, lists, code)
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-1.5 text-xs leading-relaxed">
        {lines.map((line, idx) => {
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }

          // Bullet points
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-1">
                <span className="text-sky-400 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
              </div>
            );
          }

          // Numbered lists
          const numMatch = line.match(/^(\d+)\.\s+(.*)/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start space-x-2 pl-1">
                <span className="text-emerald-400 font-bold font-mono text-[11px]">
                  {numMatch[1]}.
                </span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(numMatch[2]) }} />
              </div>
            );
          }

          // Code blocks
          if (line.startsWith('```')) {
            return (
              <div
                key={idx}
                className="font-mono text-[11px] bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-sky-300"
              >
                {line.replace(/```[a-z]*/g, '')}
              </div>
            );
          }

          return <div key={idx} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />;
        })}
      </div>
    );
  };

  function formatInline(str: string) {
    let out = str;
    // Bold
    out = out.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
    // Inline code
    out = out.replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded bg-slate-950 text-sky-300 font-mono text-[11px] border border-slate-800">$1</code>'
    );
    return out;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl sm:h-[82vh] h-[92vh] bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP HEADER */}
        <div className="p-4 bg-slate-950/95 border-b border-slate-800/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-3 truncate">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-emerald-500 to-rose-500 p-0.5 shadow-lg shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-sky-400 animate-pulse" />
              </div>
            </div>
            <div className="truncate">
              <div className="flex items-center space-x-2">
                <span className="font-black text-sm text-white">BMU Pulse AI</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-600/30 to-emerald-600/30 text-sky-300 border border-sky-400/30">
                  AnyModel
                </span>
              </div>
              <div className="text-[10px] text-slate-400 truncate flex items-center space-x-1.5">
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Connected: {selectedAIModel === 'custom' ? (customAIModelSlug || 'Custom Model') : currentPreset.name}</span>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center space-x-1.5 shrink-0">
            {/* Model & Config Accordion Toggle */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl text-xs font-bold flex items-center space-x-1 transition-all ${
                showSettings
                  ? 'bg-blue-600/30 text-sky-300 border border-blue-500/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
              title="Configure AnyModel & API Key"
            >
              <Cpu className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline text-[11px] font-bold">Model</span>
              {showSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {/* Clear Chat */}
            <button
              onClick={clearAIChat}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
              title="Clear Chat History"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={() => setIsAIAssistantOpen(false)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODEL SELECTOR & OPENROUTER CONFIG ACCORDION */}
        {showSettings && (
          <div className="p-4 bg-slate-950 border-b border-slate-800 space-y-3 animate-fade-in shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs font-extrabold text-white">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Select AnyModel (OpenRouter Hub)</span>
              </div>
              <button
                onClick={() => setShowKeyInput(!showKeyInput)}
                className="text-[10px] text-sky-400 hover:text-sky-300 font-bold flex items-center space-x-1"
              >
                <Key className="w-3 h-3" />
                <span>{showKeyInput ? 'Hide API Key' : 'Edit API Key'}</span>
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AI_MODEL_PRESETS.map((preset) => {
                const isSelected = selectedAIModel === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedAIModel(preset.id);
                      localStorage.setItem('campuspulse_ai_model', preset.id);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-blue-950/70 to-slate-900 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-slate-900/80 hover:bg-slate-800/90 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-white truncate">
                        {preset.name}
                      </span>
                      <span className="text-[9px] font-bold uppercase bg-black/40 text-sky-300 px-1.5 py-0.2 rounded border border-sky-400/20">
                        {preset.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                      {preset.provider}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Model Input if "custom" is selected */}
            {selectedAIModel === 'custom' && (
              <div className="pt-2 border-t border-slate-800 space-y-1.5 animate-fade-in">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Custom OpenRouter Model Slug:
                </label>
                <input
                  type="text"
                  placeholder="e.g. qwen/qwen-2.5-72b-instruct or mistralai/mistral-large-2411"
                  value={customAIModelSlug}
                  onChange={(e) => {
                    setCustomAIModelSlug(e.target.value);
                    localStorage.setItem('campuspulse_ai_custom', e.target.value);
                  }}
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                />
              </div>
            )}

            {/* OpenRouter API Key Input */}
            {showKeyInput && (
              <div className="pt-2 border-t border-slate-800 space-y-1.5 animate-fade-in">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  OpenRouter API Key:
                </label>
                <input
                  type="password"
                  value={aiApiKey}
                  onChange={(e) => {
                    setAIApiKey(e.target.value);
                    localStorage.setItem('campuspulse_ai_key', e.target.value);
                  }}
                  placeholder="sk-or-v1-..."
                  className="w-full bg-slate-900 border border-slate-800 focus:border-blue-500 px-3 py-2 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                />
              </div>
            )}
          </div>
        )}

        {/* CHAT MESSAGES LOG */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {aiMessages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-emerald-500 to-rose-500 p-0.5 shrink-0 mt-0.5">
                    <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                      <Bot className="w-4 h-4 text-sky-400" />
                    </div>
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 text-xs ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-md shadow-blue-600/20'
                      : msg.isError
                      ? 'bg-red-950/40 border border-red-500/40 text-red-200 rounded-tl-sm'
                      : 'bg-slate-950/90 border border-slate-800/90 text-slate-200 rounded-tl-sm shadow-inner'
                  }`}
                >
                  {/* Message Content */}
                  <div>{renderFormattedContent(msg.content)}</div>

                  {/* Message Footer */}
                  <div
                    className={`mt-2 pt-1 flex items-center justify-between text-[10px] ${
                      isUser ? 'text-blue-200 border-t border-white/10' : 'text-slate-500 border-t border-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>{msg.timestamp}</span>
                      {msg.modelUsed && !isUser && (
                        <span className="font-mono text-[9px] bg-slate-900 text-slate-400 px-1.5 py-0.2 rounded border border-slate-800">
                          {msg.modelUsed}
                        </span>
                      )}
                    </div>

                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="hover:text-sky-400 transition-colors flex items-center space-x-1"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-blue-500/40 shrink-0 mt-0.5"
                  />
                )}
              </div>
            );
          })}

          {/* AI Thinking Animation */}
          {isAILoading && (
            <div className="flex items-start space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-emerald-500 to-rose-500 p-0.5 shrink-0">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-sky-400 animate-spin" />
                </div>
              </div>
              <div className="bg-slate-950/90 border border-slate-800 p-3.5 rounded-2xl rounded-tl-sm flex items-center space-x-2 text-xs text-slate-400">
                <span className="flex h-2 w-2 rounded-full bg-sky-400 animate-ping" />
                <span className="font-semibold text-slate-300">
                  {selectedAIModel === 'custom' ? customAIModelSlug || 'AI' : currentPreset.name} is thinking...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK SUGGESTION PROMPT CHIPS */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800/60 overflow-x-auto no-scrollbar flex items-center space-x-2 shrink-0">
          <button
            onClick={() => handlePromptChipClick('Tell me about HackBMU 7.0 schedule and ₹3L prize pool')}
            className="px-2.5 py-1 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-rose-300 text-[11px] font-bold whitespace-nowrap transition-colors flex items-center space-x-1 shrink-0"
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span>HackBMU 7.0 Info</span>
          </button>

          <button
            onClick={() => handlePromptChipClick('How do I book a Badminton court or join an HPL match?')}
            className="px-2.5 py-1 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-500/30 text-amber-300 text-[11px] font-bold whitespace-nowrap transition-colors flex items-center space-x-1 shrink-0"
          >
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Sports & Courts</span>
          </button>

          <button
            onClick={() => handlePromptChipClick('What are the latest CoE end-sem and placement notices?')}
            className="px-2.5 py-1 rounded-xl bg-sky-950/40 hover:bg-sky-900/50 border border-sky-500/30 text-sky-300 text-[11px] font-bold whitespace-nowrap transition-colors flex items-center space-x-1 shrink-0"
          >
            <Bell className="w-3 h-3 text-sky-400" />
            <span>CoE Circulars</span>
          </button>

          <button
            onClick={() => handlePromptChipClick('Where can I swap tech skills or trade dorm gear?')}
            className="px-2.5 py-1 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold whitespace-nowrap transition-colors flex items-center space-x-1 shrink-0"
          >
            <ShoppingBag className="w-3 h-3 text-emerald-400" />
            <span>Peer Skill Swap</span>
          </button>
        </div>

        {/* INPUT BAR */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder={`Ask BMU Pulse AI (${currentPreset.name})...`}
              disabled={isAILoading}
              className="flex-1 bg-slate-900 border border-slate-800 focus:border-blue-500 px-4 py-2.5 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!inputVal.trim() || isAILoading}
              className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white rounded-2xl shadow-md shadow-blue-600/20 transition-all shrink-0 flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 px-1">
            <span>Press <kbd className="font-mono bg-slate-900 px-1 rounded text-slate-400">Enter</kbd> to send</span>
            <span>OpenRouter AnyModel Engine • BML Munjal University</span>
          </div>
        </div>
      </div>
    </div>
  );
}
