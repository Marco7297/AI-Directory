import React, { useState, useMemo } from 'react';
import { Search, X, Star, ArrowUpRight, Cpu, Activity, ShieldCheck, Check, HardDrive, Bookmark } from 'lucide-react';
import { AIAgent } from '../types';
import { MOCK_AGENTS } from '../data/mockAgents';
import { Sparkline } from './Sparkline';
import { AgentLogo } from './AgentLogo';
import { useFavoriteAgents } from '../utils/favoritesManager';

interface SearchDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgent?: (agent: AIAgent) => void;
  onToast?: (message: string) => void;
}

export const SearchDirectoryModal: React.FC<SearchDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectAgent,
  onToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { isFavorite, toggleFavorite } = useFavoriteAgents();

  const handleToggleFavorite = (agent: AIAgent, e: React.MouseEvent) => {
    e.stopPropagation();
    const isNowFav = toggleFavorite(agent.id);
    if (isNowFav) {
      onToast?.(`★ Pinned ${agent.name} to Favorites (Ctrl+K)`);
    } else {
      onToast?.(`Removed ${agent.name} from Favorites`);
    }
  };

  const categories = ['All', 'Coding', 'Research', 'Orchestration', 'Multimodal'];

  const filteredAgents = useMemo(() => {
    return MOCK_AGENTS.filter((agent) => {
      const matchesCategory =
        selectedCategory === 'All' || agent.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.primaryCapability.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopyInstall = (agentId: string) => {
    setCopiedId(agentId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0d14] border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden text-neutral-200"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0e1018]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <div>
              <h2 
                className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white"
                style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
              >
                AI HUB // SEARCHABLE DIRECTORY
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                Search, benchmark, and deploy verified autonomous agents across 1,420+ production models
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-6 border-b border-white/10 space-y-4 bg-[#0a0b10]">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model name, capability, or stack (e.g. Claude, GPT-4o, Gemini, Cursor)..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono text-xs"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive Category Tabs with Telemetry indicator */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
            <div className="flex items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-mono transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.08] border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Live Telemetry Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 bg-white/[0.02] px-2.5 py-1 rounded border border-white/5 whitespace-nowrap shrink-0">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>LIVE CPU & MEM SPARKLINE TRENDS</span>
            </div>
          </div>
        </div>

        {/* Agent Cards List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-white/[0.06]">
          {filteredAgents.length === 0 ? (
            <div className="py-16 text-center text-neutral-500 font-mono text-xs">
              No autonomous agents found matching "{searchQuery}".
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="pt-4 first:pt-0 group flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-3.5 hover:bg-white/[0.03] transition-colors rounded border border-transparent hover:border-white/10"
              >
                <div className="flex items-start gap-3.5 max-w-xl">
                  <AgentLogo agent={agent} size="lg" showStatusDot={true} className="mt-0.5" />
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-white font-semibold text-base tracking-wide font-mono group-hover:text-blue-300 transition-colors">
                        {agent.name}
                      </span>
                      <span className="text-neutral-500 text-xs font-mono">v{agent.version}</span>
                      <span className="text-[11px] font-mono text-blue-400 bg-transparent px-2 py-0.5 border border-blue-500/40 rounded">
                        {agent.category}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {agent.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {agent.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 font-mono pt-1">
                      <span className="flex items-center gap-1 text-amber-300">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        {agent.rating}
                        <span className="text-neutral-500">({agent.reviewCount})</span>
                      </span>
                      <span className="text-neutral-500">·</span>
                      <span>Latency: {agent.latencyMs}ms</span>
                      <span className="text-neutral-500">·</span>
                      <span>Uptime: {agent.uptimePercent}%</span>
                      <span className="text-neutral-500">·</span>
                      <span className="text-neutral-400">{agent.verifiedDeveloper}</span>
                    </div>
                  </div>
                </div>

                {/* Right Area: Tiny Inline Sparkline Charts (CPU & Memory) & Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0 pt-2 xl:pt-0">
                  {/* Inline Sparklines Container */}
                  <div 
                    className="flex items-center gap-3 py-1.5 px-3 rounded bg-[#07080d] border border-white/10 group-hover:border-blue-500/30 transition-colors shadow-inner"
                    title="Recent 15-minute resource utilization trends. Hover to scrub exact values."
                  >
                    {/* CPU Sparkline */}
                    <div className="flex items-center gap-1.5">
                      <Cpu className="w-3 h-3 text-sky-400 shrink-0" />
                      <Sparkline
                        data={agent.metrics?.cpuTrend || [32, 40, 48, 55, 62, 58, 50, 54, 52, 56]}
                        width={68}
                        height={20}
                        label="CPU"
                        unit="%"
                        variant="cpu"
                        showCurrentValue={true}
                        showTrendDelta={true}
                      />
                    </div>

                    <div className="w-px h-6 bg-white/10" />

                    {/* Memory Sparkline */}
                    <div className="flex items-center gap-1.5">
                      <HardDrive className="w-3 h-3 text-purple-400 shrink-0" />
                      <Sparkline
                        data={agent.metrics?.memoryTrend || [1.8, 2.0, 2.2, 2.4, 2.8, 3.0, 2.9, 3.1, 3.0, 3.2]}
                        width={68}
                        height={20}
                        label="MEM"
                        unit="GB"
                        variant="memory"
                        showCurrentValue={true}
                        showTrendDelta={true}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {/* Quick Add / Pinned Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFavorite(agent, e)}
                      className={`px-2.5 py-1.5 text-xs font-mono rounded flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                        isFavorite(agent.id)
                          ? 'border border-amber-400/80 bg-amber-500/20 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.35)] ring-1 ring-amber-400/30'
                          : 'border border-white/10 hover:border-amber-400/60 bg-white/[0.03] hover:bg-amber-500/10 text-neutral-400 hover:text-amber-300'
                      }`}
                      title={isFavorite(agent.id) ? "Pinned in Favorites (Ctrl+K)" : "Quick Add to Favorites (Ctrl+K)"}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFavorite(agent.id) ? 'fill-amber-400 text-amber-400' : 'text-neutral-400'}`} />
                      <span>{isFavorite(agent.id) ? 'Pinned' : '+ Quick Add'}</span>
                    </button>

                    <button
                      onClick={() => handleCopyInstall(agent.id)}
                      className="px-3 py-1.5 text-xs font-mono text-neutral-300 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-colors flex items-center gap-1.5 rounded cursor-pointer"
                      title="Copy Agent Endpoint URI"
                    >
                      {copiedId === agent.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Cpu className="w-3.5 h-3.5 text-blue-400" />
                          <span>Deploy</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        if (onSelectAgent) onSelectAgent(agent);
                        onClose();
                      }}
                      className="px-3.5 py-1.5 text-xs font-mono text-blue-300 hover:text-white border border-blue-500 bg-transparent hover:bg-blue-600/20 transition-colors flex items-center gap-1 rounded cursor-pointer"
                    >
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#0a0b10] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono text-neutral-500">
          <div>Showing {filteredAgents.length} of {MOCK_AGENTS.length} production agents · Hover sparklines for exact readings</div>
          <div className="flex items-center gap-2 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Continuous invariant monitoring with real-time SVG trends</span>
          </div>
        </div>
      </div>
    </div>
  );
};
