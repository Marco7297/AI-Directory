import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowUpRight, 
  Star, 
  Activity, 
  ShieldCheck, 
  Copy, 
  Check, 
  SlidersHorizontal,
  ChevronDown,
  Bookmark,
  Pin,
  ArrowLeftRight,
  Flame,
  Trophy,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { MOCK_AGENTS } from '../data/mockAgents';
import { AIAgent, PageRoute } from '../types';
import { Sparkline } from './Sparkline';
import { AgentLogo } from './AgentLogo';
import { useFavoriteAgents } from '../utils/favoritesManager';

interface ExploreDirectorySectionProps {
  onSelectAgent?: (agent: AIAgent) => void;
  onOpenTelemetry?: () => void;
  onOpenReviews?: () => void;
  onToast?: (message: string) => void;
  onSelectTool?: (toolId: string) => void;
  onCompareTools?: (toolAId?: string, toolBId?: string) => void;
  onNavigate?: (route: PageRoute) => void;
}

export const ExploreDirectorySection: React.FC<ExploreDirectorySectionProps> = ({
  onSelectAgent,
  onOpenTelemetry,
  onOpenReviews,
  onToast,
  onSelectTool,
  onCompareTools,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'latency' | 'reviews'>('rating');
  const [templateShape, setTemplateShape] = useState<'rounded-3xl' | 'rounded-2xl' | 'squircle'>('rounded-3xl');
  const [matchGoal, setMatchGoal] = useState<string | null>(null);
  const [matchPriority, setMatchPriority] = useState<string | null>(null);

  const { isFavorite, toggleFavorite } = useFavoriteAgents();

  const getShapeConfig = (shape: 'rounded-3xl' | 'rounded-2xl' | 'squircle') => {
    if (shape === 'rounded-2xl') {
      return {
        outer: 'rounded-2xl',
        inner: 'rounded-[14px]',
        name: 'ROUNDED 2XL'
      };
    }
    if (shape === 'squircle') {
      return {
        outer: 'rounded-[32px]',
        inner: 'rounded-[30px]',
        name: 'SQUIRCLE 32PX'
      };
    }
    return {
      outer: 'rounded-3xl',
      inner: 'rounded-[22px]',
      name: 'ROUNDED 3XL'
    };
  };

  const handleToggleFavorite = (agent: AIAgent, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowFav = toggleFavorite(agent.id);
    if (isNowFav) {
      onToast?.(`★ Pinned ${agent.name} to Favorites (press Ctrl+K to access)`);
    } else {
      onToast?.(`Removed ${agent.name} from Favorites`);
    }
  };

  const categories = ['All', 'Coding', 'Research', 'Orchestration', 'Multimodal'];

  const filteredAgents = useMemo(() => {
    let list = MOCK_AGENTS.filter((agent) => {
      const matchesCategory =
        selectedCategory === 'All' || agent.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.codeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.primaryCapability.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });

    return list.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'latency') return a.latencyMs - b.latencyMs;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy]);

  const handleCopyInstall = (agentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(`npx @ai-hub/cli deploy ${agentId}`);
    setCopiedId(agentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section 
      id="explore-section"
      className="relative z-20 w-full bg-[#07080c] border-t border-white/15 pt-16 pb-24 px-6 sm:px-10 lg:px-16"
    >
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-between max-w-[1520px] mx-auto px-6 sm:px-10">
        <div className="w-px h-full bg-white/[0.04]" />
        <div className="w-px h-full bg-white/[0.04] hidden md:block" />
        <div className="w-px h-full bg-white/[0.04]" />
        <div className="w-px h-full bg-white/[0.04] hidden lg:block" />
        <div className="w-px h-full bg-white/[0.04]" />
      </div>

      <div className="relative z-10 max-w-[1520px] mx-auto space-y-10">
        
        {/* Live Community Activity & Benchmark Ticker Bar */}
        <div className="glass-panel flex items-center gap-3 overflow-x-auto py-2.5 px-4 rounded-2xl text-[11px] font-mono text-neutral-300 scrollbar-none">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-300 font-bold shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            <span>LIVE INTELLIGENCE STREAM</span>
          </div>
          <span className="text-neutral-600">|</span>
          <span className="shrink-0 flex items-center gap-1 text-white">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <strong className="text-blue-300">Cursor AI</strong> +3,400 developer audits today
          </span>
          <span className="text-neutral-600">·</span>
          <span className="shrink-0 flex items-center gap-1 text-white">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <strong className="text-cyan-300">Gemini 2.0 Flash</strong> verified sub-180ms latency
          </span>
          <span className="text-neutral-600">·</span>
          <span className="shrink-0 flex items-center gap-1 text-white">
            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
            <strong className="text-amber-300">Claude 3.5 Sonnet</strong> #1 on SWE-bench (93.7%)
          </span>
          <span className="text-neutral-600">·</span>
          <span className="shrink-0 flex items-center gap-1 text-white">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <strong>142 AI Tools</strong> with verified permanent free tier
          </span>
        </div>

        {/* Section Header: Text and Badges */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 text-[10px] font-mono tracking-[0.25em] text-blue-400 border border-blue-500/60 uppercase rounded">
              AI HUB DIRECTORY // BENCHMARK INDEX v4.5
            </span>
            <span className="text-neutral-500 text-xs font-mono">·</span>
            <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              CLAUDE · CHATGPT · GEMINI · VERIFIED HUBS
            </span>
          </div>

          <h2 
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-[0.08em] uppercase"
            style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
          >
            DISCOVER & BENCHMARK AI TOOLS & AUTONOMOUS AGENTS
          </h2>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-2xl font-sans">
            Explore verified frontier AI models, task engines, and autonomous swarms including Claude 3.5 Sonnet, ChatGPT-4o, Google Gemini, and Cursor. Compare reasoning latencies, context windows, and real-time community benchmarks.
          </p>

          {/* Interactive 2-Click AI Matchmaker / Goal Finder */}
          <div className="pt-2">
            <div className="glass-panel p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-blue-400 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI MATCHMAKER // FIND YOUR IDEAL SOLUTION:
                </span>
                {(matchGoal || matchPriority) && (
                  <button
                    type="button"
                    onClick={() => {
                      setMatchGoal(null);
                      setMatchPriority(null);
                      setSelectedCategory('All');
                      setSortBy('rating');
                    }}
                    className="text-neutral-400 hover:text-white text-[11px] font-mono cursor-pointer transition-colors"
                  >
                    Reset Filter ✕
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">I want to:</span>
                <button
                  type="button"
                  onClick={() => {
                    setMatchGoal('Coding');
                    setSelectedCategory('Coding');
                    onToast?.('Filtered to top AI Coding & Engineering tools');
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                    matchGoal === 'Coding'
                      ? 'border-blue-400 bg-blue-600/30 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                      : 'border-white/10 hover:border-blue-400/50 bg-black/40 text-neutral-300 hover:text-white'
                  }`}
                >
                  💻 Code & Build
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMatchGoal('Research');
                    setSelectedCategory('Research');
                    onToast?.('Filtered to Grounded Research & Deep Search engines');
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                    matchGoal === 'Research'
                      ? 'border-emerald-400 bg-emerald-600/30 text-white font-bold shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                      : 'border-white/10 hover:border-emerald-400/50 bg-black/40 text-neutral-300 hover:text-white'
                  }`}
                >
                  🔍 Research & Synthesis
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMatchGoal('Orchestration');
                    setSelectedCategory('Orchestration');
                    onToast?.('Filtered to Autonomous Swarms & Multi-Agent systems');
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                    matchGoal === 'Orchestration'
                      ? 'border-purple-400 bg-purple-600/30 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.5)]'
                      : 'border-white/10 hover:border-purple-400/50 bg-black/40 text-neutral-300 hover:text-white'
                  }`}
                >
                  🤖 Autonomous Agents
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMatchGoal('Multimodal');
                    setSelectedCategory('Multimodal');
                    onToast?.('Filtered to Multimodal Vision & Generation models');
                  }}
                  className={`px-3 py-1.5 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                    matchGoal === 'Multimodal'
                      ? 'border-cyan-400 bg-cyan-600/30 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                      : 'border-white/10 hover:border-cyan-400/50 bg-black/40 text-neutral-300 hover:text-white'
                  }`}
                >
                  🎨 Multimodal & Vision
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-mono text-neutral-400 uppercase">Priority:</span>
                <button
                  type="button"
                  onClick={() => {
                    setMatchPriority('latency');
                    setSortBy('latency');
                    onToast?.('Sorted by Lowest Latency (Fastest Response)');
                  }}
                  className={`px-3 py-1 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                    matchPriority === 'latency'
                      ? 'border-cyan-400 bg-cyan-600/30 text-white font-bold shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                      : 'border-white/10 hover:border-cyan-400/50 bg-black/40 text-neutral-300 hover:text-white'
                  }`}
                >
                  ⚡ Lowest Latency (&lt;200ms)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMatchPriority('rating');
                    setSortBy('rating');
                    onToast?.('Sorted by Top Developer Ratings');
                  }}
                  className={`px-3 py-1 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                    matchPriority === 'rating'
                      ? 'border-amber-400 bg-amber-600/30 text-white font-bold shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                      : 'border-white/10 hover:border-amber-400/50 bg-black/40 text-neutral-300 hover:text-white'
                  }`}
                >
                  ⭐ Top Rated (4.9★+)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMatchPriority('reviews');
                    setSortBy('reviews');
                    onToast?.('Sorted by Most Community Verified Audits');
                  }}
                  className={`px-3 py-1 text-xs font-mono rounded-xl border transition-all cursor-pointer ${
                    matchPriority === 'reviews'
                      ? 'border-blue-400 bg-blue-600/30 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                      : 'border-white/10 hover:border-blue-400/50 bg-black/40 text-neutral-300 hover:text-white'
                  }`}
                >
                  💬 Most Reviewed
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Shared Type Search Bar & Controls Bar (Sleek Rounded Cyber Frame) */}
        <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-r from-blue-500/40 via-white/20 to-blue-500/40 shadow-2xl">
          <div className="glass-panel p-5 sm:p-6 rounded-[22px] space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AI Hub (e.g. Claude, ChatGPT, Gemini, Cursor, Perplexity)..."
                className="w-full pl-11 pr-24 py-3 bg-white/[0.03] hover:bg-white/[0.05] border border-white/20 focus:border-blue-400 rounded-xl text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono transition-all"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  CLEAR
                </button>
              ) : (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 border border-white/10 px-2 py-0.5 rounded-md">
                  <span>⌘</span>
                  <span>K</span>
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-mono text-neutral-400 hidden sm:inline">SORT BY:</span>
              <div className="flex items-center gap-1 p-1 border border-white/15 rounded-xl bg-white/[0.02]">
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                    sortBy === 'rating'
                      ? 'bg-blue-600 text-white font-medium shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Top Rated
                </button>
                <button
                  onClick={() => setSortBy('latency')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                    sortBy === 'latency'
                      ? 'bg-blue-600 text-white font-medium shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Lowest Latency
                </button>
                <button
                  onClick={() => setSortBy('reviews')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all cursor-pointer ${
                    sortBy === 'reviews'
                      ? 'bg-blue-600 text-white font-medium shadow-[0_0_12px_rgba(59,130,246,0.5)]'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Reviews
                </button>
              </div>
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-white/10 text-xs font-mono">
            <span className="text-neutral-500 text-[11px] pr-2 shrink-0 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" />
              CATEGORY:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'border border-blue-400 text-white bg-blue-500/25 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                    : 'border border-white/10 hover:border-white/30 text-neutral-400 hover:text-neutral-200 bg-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* AI AGENT & FRONTIER MODEL ROSTER STRIP */}
          <div className="pt-2 border-t border-white/10">
            <div className="flex items-center justify-between mb-2.5 text-[11px] font-mono">
              <span className="text-neutral-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                VERIFIED AI HUB ROSTER (CLAUDE · CHATGPT · GEMINI · CUSTOM SWARMS):
              </span>
              <span className="text-[10px] text-neutral-500 hidden sm:inline">
                Click any model insignia to filter and inspect
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5">
              {MOCK_AGENTS.map((ag) => (
                <button
                  key={ag.id}
                  onClick={() => {
                    setSearchQuery(ag.name);
                    onSelectAgent?.(ag);
                  }}
                  className={`group/logo p-2 rounded-2xl border transition-all duration-300 flex items-center gap-2.5 text-left cursor-pointer ${
                    searchQuery === ag.name
                      ? 'border-blue-400 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'border-white/10 hover:border-blue-400/60 bg-white/[0.02] hover:bg-white/[0.06]'
                  }`}
                  title={`${ag.name} (${ag.codeName}) - ${ag.category}`}
                >
                  <AgentLogo agent={ag} size="sm" showStatusDot={true} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-bold text-white font-mono truncate group-hover/logo:text-blue-300 transition-colors">
                      {ag.name}
                    </div>
                    <div className="text-[9px] font-mono text-neutral-400 truncate">
                      {ag.codeName}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
        </div>

        {/* Results Counter & Fast Stats Bar + Template Shape Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-neutral-400 px-1">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{filteredAgents.length}</span>
            <span>AI Hub Models & Agents matched</span>
            {searchQuery && (
              <span className="text-blue-400">for "{searchQuery}"</span>
            )}
          </div>

          {/* Template Shape Switcher (Rounded Corners Selector) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider hidden md:inline">
              Rounded Corner:
            </span>
            <div className="flex items-center gap-1 p-1 border border-white/20 rounded-2xl bg-black/60 shadow-inner">
              <button
                type="button"
                onClick={() => setTemplateShape('rounded-3xl')}
                className={`px-3 py-1.5 text-[11px] font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  templateShape === 'rounded-3xl'
                    ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                title="Rounded 3XL (Smooth 24px Radius)"
              >
                <span>◯</span>
                <span>Rounded 3XL</span>
              </button>

              <button
                type="button"
                onClick={() => setTemplateShape('rounded-2xl')}
                className={`px-3 py-1.5 text-[11px] font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  templateShape === 'rounded-2xl'
                    ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                title="Rounded 2XL (Medium 16px Radius)"
              >
                <span>▢</span>
                <span>Rounded 2XL</span>
              </button>

              <button
                type="button"
                onClick={() => setTemplateShape('squircle')}
                className={`px-3 py-1.5 text-[11px] font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                  templateShape === 'squircle'
                    ? 'bg-blue-600 text-white font-bold shadow-[0_0_12px_rgba(59,130,246,0.6)]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/[0.04]'
                }`}
                title="Squircle Deep Curvature (32px Radius)"
              >
                <span>⬭</span>
                <span>Squircle</span>
              </button>
            </div>
          </div>
        </div>

        {/* Grid of Agent Cards with Smooth Rounded Corners */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredAgents.map((agent) => {
            const shapeCfg = getShapeConfig(templateShape);
            return (
              <div
                key={agent.id}
                onClick={() => onSelectAgent?.(agent)}
                className="group relative transition-all duration-300 cursor-pointer hover:-translate-y-1.5"
              >
                {/* Outer Sleek Rounded Cyber Beveled Border Shell */}
                <div className={`relative p-[1.5px] ${shapeCfg.outer} bg-gradient-to-br from-blue-400/60 via-white/20 to-blue-600/60 group-hover:from-cyan-400 group-hover:via-blue-400 group-hover:to-indigo-500 shadow-xl group-hover:shadow-[0_15px_35px_rgba(59,130,246,0.35)] transition-all duration-300`}>
                  {/* Inner Card Container with matching smooth rounded corners */}
                  <div className={`${shapeCfg.inner} glass-panel hover:bg-[#0c1022]/90 p-6 sm:p-7 flex flex-col justify-between min-h-[380px] relative transition-colors duration-300`}>
                    
                    {/* Top Sci-Fi HUD Header Plate Bar */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 uppercase tracking-widest pb-3 mb-3 border-b border-white/[0.08]">
                      <span className="flex items-center gap-1.5 text-blue-400 font-semibold">
                        <span className="w-2 h-2 bg-blue-400 rounded-full inline-block shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                        AI HUB // TEMPLATE
                      </span>
                      <span className="text-[9px] px-2.5 py-0.5 border border-white/10 rounded-full font-mono text-neutral-400 bg-white/[0.02]">
                        {shapeCfg.name}
                      </span>
                    </div>

                    {/* Top Row: Logo, Name, Category, Status */}
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3">
                          <AgentLogo agent={agent} size="md" showStatusDot={true} />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 
                                className="text-base font-bold text-white tracking-wide font-mono group-hover:text-blue-300 transition-colors"
                              >
                                {agent.name}
                              </h3>
                              <span className="text-[10px] text-neutral-500 font-mono">v{agent.version}</span>
                            </div>
                            <span className="text-[10px] font-mono text-blue-400 tracking-wider">
                              {agent.codeName}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Quick Add / Pinned Button */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleFavorite(agent, e)}
                            className={`px-3 py-1 text-[10px] font-mono rounded-full flex items-center gap-1 transition-all duration-200 cursor-pointer ${
                              isFavorite(agent.id)
                                ? 'border border-amber-400/80 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/30 font-medium'
                                : 'border border-white/20 hover:border-amber-400/70 bg-white/[0.04] hover:bg-amber-500/10 text-neutral-400 hover:text-amber-300'
                            }`}
                            title={isFavorite(agent.id) ? "Pinned in Favorites (Open via Ctrl+K)" : "Quick Add to Favorites (Accessible via Ctrl+K Command Palette)"}
                          >
                            <Star className={`w-3 h-3 transition-transform ${isFavorite(agent.id) ? 'fill-amber-400 text-amber-400 scale-105' : 'text-neutral-400'}`} />
                            <span>{isFavorite(agent.id) ? 'PINNED' : '+ Quick Add'}</span>
                          </button>

                          <span className="text-[10px] font-mono text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full bg-emerald-500/10 flex items-center gap-1 shrink-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            {agent.status}
                          </span>
                        </div>
                      </div>

                      {/* Primary Capability Pill */}
                      <div className="mb-3">
                        <span className="text-[10px] font-mono text-neutral-300 border border-white/15 px-3 py-0.5 rounded-full bg-white/[0.03]">
                          {agent.primaryCapability}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-neutral-300 leading-relaxed font-sans line-clamp-2 mb-4">
                        {agent.description}
                      </p>

                      {/* Specs Pill Matrix */}
                      <div className="grid grid-cols-3 gap-2 py-2.5 px-3 border border-white/10 rounded-2xl bg-white/[0.02] mb-4 text-[10px] font-mono">
                        <div>
                          <div className="text-neutral-500">LATENCY</div>
                          <div className="text-white font-medium">{agent.latencyMs}ms</div>
                        </div>
                        <div>
                          <div className="text-neutral-500">UPTIME</div>
                          <div className="text-emerald-400 font-medium">{agent.uptimePercent}%</div>
                        </div>
                        <div>
                          <div className="text-neutral-500">CONTEXT</div>
                          <div className="text-white font-medium">{agent.specs.contextWindow}</div>
                        </div>
                      </div>

                      {/* Inline Sparkline Resource Usage Trends */}
                      <div 
                        className="flex items-center justify-between py-1.5 px-3 border border-white/10 rounded-2xl bg-[#07080d]/80 mb-4 text-[10px] font-mono group-hover:border-blue-500/30 transition-colors"
                        title="Live 15-minute resource usage trends"
                      >
                        <Sparkline
                          data={agent.metrics?.cpuTrend || [30, 42, 38, 55, 60, 52, 48, 56]}
                          width={58}
                          height={18}
                          label="CPU"
                          unit="%"
                          variant="cpu"
                          showCurrentValue={true}
                          showTrendDelta={false}
                        />
                        <div className="w-px h-5 bg-white/10" />
                        <Sparkline
                          data={agent.metrics?.memoryTrend || [1.8, 2.0, 2.1, 2.5, 2.7, 2.6, 2.8, 2.7]}
                          width={58}
                          height={18}
                          label="MEM"
                          unit="GB"
                          variant="memory"
                          showCurrentValue={true}
                          showTrendDelta={false}
                        />
                      </div>
                    </div>

                    {/* Bottom Row: Rating, Tags, and Fast Action */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-amber-300 font-mono">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {agent.rating}
                        </span>
                        <span className="text-[11px] text-neutral-500 font-mono">
                          ({agent.reviewCount})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Bookmark quick toggle button */}
                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(agent, e)}
                          className={`p-1.5 border rounded-xl transition-all text-xs font-mono flex items-center gap-1 cursor-pointer ${
                            isFavorite(agent.id)
                              ? 'border-amber-400/80 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                              : 'border-white/15 hover:border-amber-400/60 text-neutral-400 hover:text-amber-300 hover:bg-amber-500/10'
                          }`}
                          title={isFavorite(agent.id) ? "Remove from Favorites" : "Quick Add to Favorites (Ctrl+K)"}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isFavorite(agent.id) ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>

                        {/* Quick Compare against competitor */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onCompareTools) {
                              onCompareTools(agent.id);
                            } else {
                              onNavigate?.('compare');
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-white border border-white/15 hover:border-blue-400 rounded-xl transition-colors text-xs font-mono flex items-center gap-1 cursor-pointer"
                          title="Compare side-by-side with competitors"
                        >
                          <ArrowLeftRight className="w-3 h-3 text-blue-400" />
                          <span className="text-[10px] hidden sm:inline">VS</span>
                        </button>

                        <button
                          onClick={(e) => handleCopyInstall(agent.id, e)}
                          className="p-1.5 text-neutral-400 hover:text-white border border-white/15 hover:border-blue-400 rounded-xl transition-colors text-xs font-mono flex items-center gap-1"
                          title="Copy deploy command"
                        >
                          {copiedId === agent.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-[10px] text-emerald-400">COPIED</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span className="text-[10px]">CLI</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => onSelectAgent?.(agent)}
                          className="px-3 py-1.5 text-[11px] font-mono border border-blue-500/40 group-hover:border-blue-400 text-white rounded-xl transition-colors hover:bg-blue-600/20 flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ArrowUpRight className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
