'use client';

import React, { useState } from 'react';
import { useCampusPulse } from '@/lib/store';
import { MarketplaceItem, MarketplaceCategory, ListingType } from '@/types';
import { formatTimeAgo } from '@/lib/utils';
import { popularSkills } from '@/data/mockData';
import { MarketplaceChatDrawer } from './MarketplaceChatDrawer';
import {
  ShoppingBag,
  Repeat,
  Cpu,
  BookOpen,
  Wrench,
  Home,
  Plus,
  Search,
  Bookmark,
  MessageSquare,
  Sparkles,
  ArrowRightLeft,
  CheckCircle2,
  Tag,
  X,
  Filter,
  Layers,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CATEGORIES: ('All' | MarketplaceCategory)[] = [
  'All',
  'Skill Swap',
  'Hardware & Components',
  'Textbooks & Notes',
  'Lab Gear',
  'Dorm & Electronics',
];

export function MarketplaceModule() {
  const {
    marketplaceItems,
    addMarketplaceItem,
    toggleSaveItem,
    updateItemStatus,
    currentUser,
  } = useCampusPulse();

  const [selectedCategory, setSelectedCategory] = useState<'All' | MarketplaceCategory>('All');
  const [selectedType, setSelectedType] = useState<'All' | ListingType>('All');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeChatListing, setActiveChatListing] = useState<MarketplaceItem | null>(null);
  const [isPostOpen, setIsPostOpen] = useState(false);
  const [showMatchmaker, setShowMatchmaker] = useState(false);

  // Skill Matchmaker State
  const [matchmakerOffer, setMatchmakerOffer] = useState('');
  const [matchmakerSeek, setMatchmakerSeek] = useState('');

  // New Listing Form State
  const [postMode, setPostMode] = useState<'Item' | 'SkillSwap'>('Item');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState<MarketplaceCategory>('Hardware & Components');
  const [price, setPrice] = useState<number>(0);
  const [condition, setCondition] = useState<'Brand New' | 'Like New' | 'Good' | 'Fair'>('Like New');
  const [skillOffer, setSkillOffer] = useState('');
  const [skillRequest, setSkillRequest] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const filteredItems = marketplaceItems.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesType = selectedType === 'All' || item.type === selectedType;
    
    // Skill Matchmaker filter
    let matchesMatchmaker = true;
    if (showMatchmaker) {
      if (matchmakerOffer && item.skillRequest) {
        matchesMatchmaker =
          matchesMatchmaker &&
          item.skillRequest.toLowerCase().includes(matchmakerOffer.toLowerCase().slice(0, 5));
      }
      if (matchmakerSeek && item.skillOffer) {
        matchesMatchmaker =
          matchesMatchmaker &&
          item.skillOffer.toLowerCase().includes(matchmakerSeek.toLowerCase().slice(0, 5));
      }
    }

    const matchesSearch =
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (item.skillOffer && item.skillOffer.toLowerCase().includes(searchFilter.toLowerCase())) ||
      (item.skillRequest && item.skillRequest.toLowerCase().includes(searchFilter.toLowerCase())) ||
      item.tags.some((t) => t.toLowerCase().includes(searchFilter.toLowerCase()));

    return matchesCategory && matchesType && matchesMatchmaker && matchesSearch;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !desc.trim()) return;

    if (postMode === 'SkillSwap') {
      addMarketplaceItem({
        title,
        description: desc,
        category: 'Skill Swap',
        price: 0,
        type: 'Swap',
        skillOffer: skillOffer || 'Tutoring / Technical Mentorship',
        skillRequest: skillRequest || 'Open to proposals',
        condition: 'Brand New',
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        sellerAvatar: currentUser.avatar,
        sellerHostel: currentUser.hostel,
        sellerContact: currentUser.email,
        images: [
          imageUrl ||
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        ],
        tags: ['SkillSwap', 'BMUPeer', 'Collaboration'],
      });
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#10b981', '#34d399', '#2563eb'],
        });
      } catch (e) {}
    } else {
      addMarketplaceItem({
        title,
        description: desc,
        category,
        price: Number(price) || 0,
        type: Number(price) === 0 ? 'Free' : 'Sale',
        condition,
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        sellerAvatar: currentUser.avatar,
        sellerHostel: currentUser.hostel,
        sellerContact: currentUser.email,
        images: [
          imageUrl ||
            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
        ],
        tags: [category.split(' ')[0], condition],
      });
    }

    setIsPostOpen(false);
    setTitle('');
    setDesc('');
    setSkillOffer('');
    setSkillRequest('');
    setImageUrl('');
    setPrice(0);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Marketplace & Skill Trade Header Banner */}
      <div className="glass-panel-luxury border-emerald-500/30 p-7 sm:p-9 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center space-x-1.5 bg-emerald-500/15 text-emerald-300 font-extrabold text-xs px-3.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/30">
                <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                <span>Zero-Commission Peer Trade</span>
              </span>
              <span className="text-xs bg-slate-800/80 text-sky-400 font-bold px-3 py-1 rounded-full border border-white/[0.08]">
                BMU Internal Swaps
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              Campus Marketplace & Skill Exchange
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Trade your coding/math expertise for UI design, pass down lab kits (ESP32/Arduino), or find dorm essentials directly inside BMU hostels without retail markups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowMatchmaker(!showMatchmaker)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-2xl text-xs font-bold border transition-all ${
                showMatchmaker
                  ? 'bg-blue-600/30 text-sky-300 border-blue-500/50'
                  : 'bg-white/[0.04] text-slate-200 border-white/[0.09] hover:bg-white/[0.08]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Skill Matchmaker</span>
            </button>

            <button
              onClick={() => {
                setPostMode('SkillSwap');
                setIsPostOpen(true);
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-5 py-3 rounded-2xl text-xs shadow-lg shadow-emerald-600/25 transition-all hover:scale-105"
            >
              <Repeat className="w-4 h-4" />
              <span>Offer a Skill Swap</span>
            </button>

            <button
              onClick={() => {
                setPostMode('Item');
                setIsPostOpen(true);
              }}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-5 py-3 rounded-2xl text-xs shadow-lg shadow-blue-600/25 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Sell / Give Gear</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Skill Matchmaker Engine Drawer Bar */}
      {showMatchmaker && (
        <div className="glass-panel-luxury border-emerald-500/40 p-6 sm:p-7 space-y-4 animate-smooth-in shadow-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Instant Peer Skill Matchmaker Engine
              </h3>
            </div>
            <button
              onClick={() => {
                setMatchmakerOffer('');
                setMatchmakerSeek('');
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors glass-pill px-3 py-1 rounded-lg"
            >
              Reset Match Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1.5">
                What skill can you offer/teach?
              </label>
              <input
                type="text"
                placeholder="e.g. DSA, React, Python, Math, CAD..."
                value={matchmakerOffer}
                onChange={(e) => setMatchmakerOffer(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-sky-400 mb-1.5">
                What skill do you want to learn?
              </label>
              <input
                type="text"
                placeholder="e.g. Figma, Machine Learning, Calculus, Video Editing..."
                value={matchmakerSeek}
                onChange={(e) => setMatchmakerSeek(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 glass-panel-luxury p-5 sm:p-6">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/25 scale-105'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
              }`}
            >
              {cat === 'Skill Swap' && <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />}
              {cat === 'Hardware & Components' && <Cpu className="w-3.5 h-3.5 text-blue-400" />}
              {cat === 'Textbooks & Notes' && <BookOpen className="w-3.5 h-3.5 text-amber-400" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Search & Listing Type Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search gear, book, skill..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as 'All' | ListingType)}
            className="px-3.5 py-2 bg-slate-950/80 border border-white/[0.09] rounded-xl text-xs text-slate-300 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            <option value="All">All Types</option>
            <option value="Swap">🔄 Skill Swaps</option>
            <option value="Sale">🏷️ For Sale</option>
            <option value="Free">🎁 Free / Giveaways</option>
          </select>
        </div>
      </div>

      {/* Marketplace Grid - Spacious 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredItems.map((item) => {
          const isSaved = item.saves.includes(currentUser.id);
          const isSwap = item.type === 'Swap';
          const isFree = item.price === 0 && !isSwap;

          return (
            <div
              key={item.id}
              className={`group flex flex-col justify-between glass-card-luxury p-6 sm:p-7 transition-all duration-300 shadow-xl ${
                isSwap
                  ? 'border-emerald-500/40 hover:border-emerald-500/70 bg-gradient-to-b from-slate-900/90 via-slate-900/80 to-emerald-950/20'
                  : 'hover:border-blue-500/50'
              }`}
            >
              <div className="space-y-4">
                {/* Header Tag & Price / Swap Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-lg border ${
                        isSwap
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800/80 text-sky-400 border-slate-700'
                      }`}
                    >
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-white/[0.08] font-mono">
                      {item.condition}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleSaveItem(item.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      isSaved
                        ? 'text-rose-400 bg-rose-500/15 border border-rose-500/30'
                        : 'text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.08]'
                    }`}
                    title="Bookmark Listing"
                  >
                    <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg text-slate-100 group-hover:text-emerald-400 transition-colors leading-snug">
                  {item.title}
                </h3>

                {/* SKILL SWAP HIGHLIGHT BOX */}
                {isSwap && item.skillOffer && item.skillRequest && (
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-3 space-y-2 text-xs">
                    <div className="flex items-start space-x-2">
                      <span className="text-[10px] uppercase font-black bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded shrink-0">
                        Offers
                      </span>
                      <span className="text-slate-200 font-semibold">{item.skillOffer}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    </div>
                    <div className="flex items-start space-x-2">
                      <span className="text-[10px] uppercase font-black bg-sky-500 text-slate-950 px-1.5 py-0.2 rounded shrink-0">
                        Seeks
                      </span>
                      <span className="text-slate-200 font-semibold">{item.skillRequest}</span>
                    </div>
                  </div>
                )}

                {/* Regular Image Preview if Not Swap */}
                {!isSwap && item.images.length > 0 && (
                  <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white font-black text-sm px-2.5 py-1 rounded-xl border border-white/10">
                      {isFree ? 'FREE' : `₹${item.price}`}
                    </div>
                  </div>
                )}

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Seller Mini Card */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <img
                      src={item.sellerAvatar}
                      alt={item.sellerName}
                      className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-700"
                    />
                    <div>
                      <div className="font-semibold text-slate-200 leading-tight">
                        {item.sellerName}
                      </div>
                      <div className="text-[10px] text-slate-400">{item.sellerHostel}</div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500">{formatTimeAgo(item.createdAt)}</span>
                </div>
              </div>

              {/* Bottom Action: Connect / Chat Drawer */}
              <div className="pt-4 mt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="text-xs font-bold">
                  {isSwap ? (
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Skill Swap (Zero Fee)</span>
                    </span>
                  ) : (
                    <span className="text-sky-400 text-sm font-black">
                      {isFree ? '100% Free' : `₹${item.price}`}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setActiveChatListing(item)}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSwap
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md shadow-emerald-600/25'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/25'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isSwap ? 'Propose Swap' : 'Chat & Claim'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Post New Listing / Skill Swap Modal */}
      {isPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div
            className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-slate-100">
                  {postMode === 'SkillSwap' ? 'Post a Skill Trade / Peer Tutoring' : 'List Gear, Books or Dorm Supplies'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Direct peer exchange within BML Munjal University
                </p>
              </div>
              <button
                onClick={() => setIsPostOpen(false)}
                className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 mt-4 mb-4">
              <button
                type="button"
                onClick={() => setPostMode('Item')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  postMode === 'Item' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400'
                }`}
              >
                Gear / Textbook / Item
              </button>
              <button
                type="button"
                onClick={() => setPostMode('SkillSwap')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  postMode === 'SkillSwap' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400'
                }`}
              >
                🔄 Peer Skill Swap
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Listing Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder={
                    postMode === 'SkillSwap'
                      ? 'e.g. Offering React/NextJS mentorship in exchange for Calculus prep'
                      : 'e.g. ESP32 Sensor Kit + Jumper Wires for IoT Lab'
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {postMode === 'SkillSwap' ? (
                <div className="grid grid-cols-2 gap-3 p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl">
                  <div>
                    <label className="block text-xs font-semibold text-emerald-400 mb-1">
                      Skill You Offer *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Advanced DSA & Graph Theory"
                      value={skillOffer}
                      onChange={(e) => setSkillOffer(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-sky-400 mb-1">
                      Skill You Seek *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Figma UI/UX Design for Web App"
                      value={skillRequest}
                      onChange={(e) => setSkillRequest(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as MarketplaceCategory)}
                      className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Hardware & Components">Hardware & IoT</option>
                      <option value="Textbooks & Notes">Textbooks & Notes</option>
                      <option value="Lab Gear">Lab Gear & Tools</option>
                      <option value="Dorm & Electronics">Dorm & Electronics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Price (₹) (0 for Free) *
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Condition *
                    </label>
                    <select
                      value={condition}
                      onChange={(e) =>
                        setCondition(e.target.value as 'Brand New' | 'Like New' | 'Good' | 'Fair')
                      }
                      className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    >
                      <option value="Brand New">Brand New</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description & Details *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Mention availability, what courses this was used in, pickup location in BMU..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Photo URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPostOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/25"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chat & Negotiation Drawer */}
      <MarketplaceChatDrawer
        item={activeChatListing}
        currentUser={currentUser}
        onClose={() => setActiveChatListing(null)}
        onMarkStatus={updateItemStatus}
      />
    </div>
  );
}

