import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Command,
  ArrowRight,
  CornerDownLeft,
  Activity,
  Compass,
  Star,
  Layers,
  Terminal,
  Copy,
  Check,
  X,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Cpu,
  Monitor,
  Volume2,
  VolumeX,
  FileText
} from 'lucide-react';
import { MOCK_AGENTS } from '../data/mockAgents';
import { MOCK_TOOLS } from '../data/mockTools';
import { AIAgent } from '../types';
import { AgentLogo } from './AgentLogo';
import { ToolLogo } from './ToolLogo';
import { useFavoriteAgents } from '../utils/favoritesManager';

export interface CommandItem {
  id: string;
  title: string;
  description: string;
  category: 'Navigation' | 'Actions' | 'Agents' | 'Tools' | 'Utilities' | 'Favorites';
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  shortcut?: string;
  action: () => void;
  keywords?: string[];
  toolId?: string;
  agentId?: string;
  isFavorite?: boolean;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateSection: (sectionId: string) => void;
  onOpenDirectory: () => void;
  onOpenTelemetry: () => void;
  onOpenReviews: () => void;
  onSelectAgent?: (agent: AIAgent) => void;
  onSelectTool?: (toolId: string) => void;
  onToast?: (message: string) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  onNavigateSection,
  onOpenDirectory,
  onOpenTelemetry,
  onOpenReviews,
  onSelectAgent,
  onSelectTool,
  onToast,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Favorites' | 'Tools' | 'Agents' | 'Navigation' | 'Actions'>('All');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  const { favoriteIds, isFavorite, toggleFavorite, removeFavorite } = useFavoriteAgents();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input whenever opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Core Commands
  const staticCommands: CommandItem[] = useMemo(() => [
    // Navigation
    {
      id: 'nav-hero',
      title: 'Hero Overview & Robot Visual',
      description: 'Jump to top hero section and interactive cinematic robot suit display',
      category: 'Navigation',
      icon: Compass,
      badge: 'TOP',
      shortcut: 'G H',
      keywords: ['hero', 'top', 'robot', 'suit', 'video', 'home'],
      action: () => {
        onNavigateSection('hero-section');
        onClose();
      },
    },
    {
      id: 'nav-explore',
      title: 'Explore Directory & Shared Search',
      description: 'Jump to the agent search directory section with live category filters',
      category: 'Navigation',
      icon: Search,
      badge: 'EXPLORE',
      shortcut: 'G E',
      keywords: ['explore', 'search', 'directory', 'catalog', 'agents', 'shared'],
      action: () => {
        onNavigateSection('explore-section');
        onClose();
      },
    },
    {
      id: 'nav-specs',
      title: 'System Architecture & Spec Cards',
      description: 'Inspect cluster specifications, node topologies, and hardware specs',
      category: 'Navigation',
      icon: Cpu,
      badge: 'SPECS',
      shortcut: 'G S',
      keywords: ['specs', 'architecture', 'hardware', 'nodes', 'swarms'],
      action: () => {
        onNavigateSection('architecture-specs');
        onClose();
      },
    },
    // Actions
    {
      id: 'act-directory-modal',
      title: 'Search Agent Directory Modal',
      description: 'Open full-screen searchable modal index with category filters & CLI commands',
      category: 'Actions',
      icon: Layers,
      badge: 'MODAL',
      shortcut: 'Ctrl + D',
      keywords: ['directory', 'modal', 'search', 'agents', 'find'],
      action: () => {
        onClose();
        setTimeout(onOpenDirectory, 100);
      },
    },
    {
      id: 'act-telemetry',
      title: 'Open Live Swarm Telemetry & 30-Day Heatmap',
      description: 'D3.js 30-day uptime/latency activity heatmap matrix & real-time execution telemetry',
      category: 'Actions',
      icon: Activity,
      badge: 'D3.JS',
      shortcut: 'Ctrl + T',
      keywords: ['telemetry', 'monitoring', 'latency', 'cluster', 'events', 'live', 'heatmap', 'uptime', 'd3', 'operations'],
      action: () => {
        onClose();
        setTimeout(onOpenTelemetry, 100);
      },
    },
    {
      id: 'act-reviews',
      title: 'Community Reviews & Benchmarks',
      description: 'Read verified production reviews, accuracy ratings, and developer feedback',
      category: 'Actions',
      icon: Star,
      badge: '4.98★',
      shortcut: 'Ctrl + R',
      keywords: ['reviews', 'ratings', 'feedback', 'community', 'stars', 'benchmarks'],
      action: () => {
        onClose();
        setTimeout(onOpenReviews, 100);
      },
    },
    // Utilities
    {
      id: 'util-cli-quickstart',
      title: 'Copy CLI Quickstart Command',
      description: 'Run npx @ai-hub/cli connect --all in terminal to bootstrap swarm',
      category: 'Utilities',
      icon: Terminal,
      badge: 'CLI',
      shortcut: 'COPY',
      keywords: ['cli', 'terminal', 'npx', 'command', 'install', 'quickstart'],
      action: () => {
        navigator.clipboard?.writeText('npx @ai-hub/cli connect --all');
        setCopiedCmd('quickstart');
        onToast?.('Copied CLI Quickstart command to clipboard!');
        setTimeout(() => setCopiedCmd(null), 2000);
        onClose();
      },
    },
    {
      id: 'util-inspect-video',
      title: 'Trigger Native HD Audio / Scrim Toggle',
      description: 'Mute/unmute background video sound or trigger visual clarity test',
      category: 'Utilities',
      icon: Volume2,
      badge: 'AUDIO',
      keywords: ['audio', 'sound', 'mute', 'volume', 'video'],
      action: () => {
        const video = document.querySelector('video');
        if (video) {
          video.muted = !video.muted;
          onToast?.(`Hero background audio is now ${video.muted ? 'MUTED' : 'UNMUTED'}.`);
        }
        onClose();
      },
    },
  ], [onNavigateSection, onClose, onOpenDirectory, onOpenTelemetry, onOpenReviews, onToast]);

  // Dynamic favorite agent commands
  const favoriteCommands: CommandItem[] = useMemo(() => {
    return favoriteIds
      .map((favId) => MOCK_AGENTS.find((a) => a.id === favId))
      .filter((a): a is AIAgent => Boolean(a))
      .map((agent) => ({
        id: `fav-agent-${agent.id}`,
        agentId: agent.id,
        title: `${agent.name} [${agent.codeName}]`,
        description: `★ Pinned Favorite · ${agent.primaryCapability} · ${agent.specs.throughput} · ${agent.latencyMs}ms latency`,
        category: 'Favorites' as const,
        icon: Star,
        badge: 'FAVORITE',
        isFavorite: true,
        keywords: [
          'favorite',
          'favorites',
          'pinned',
          'star',
          'bookmark',
          agent.name,
          agent.codeName,
          agent.category,
          agent.description,
          agent.primaryCapability,
          ...agent.tags,
        ],
        action: () => {
          if (onSelectAgent) {
            onSelectAgent(agent);
          }
          onToast?.(`Loaded favorite agent: ${agent.name} (${agent.codeName})`);
          onClose();
        },
      }));
  }, [favoriteIds, onSelectAgent, onToast, onClose]);

  // Dynamic agent commands based on query or general list
  const agentCommands: CommandItem[] = useMemo(() => {
    return MOCK_AGENTS.map((agent) => ({
      id: `agent-${agent.id}`,
      agentId: agent.id,
      title: `${agent.name} [${agent.codeName}]`,
      description: `${agent.primaryCapability} · ${agent.specs.throughput} · ${agent.latencyMs}ms latency`,
      category: 'Agents' as const,
      icon: Sparkles,
      badge: `${agent.category.toUpperCase()}`,
      isFavorite: isFavorite(agent.id),
      keywords: [
        agent.name,
        agent.codeName,
        agent.category,
        agent.description,
        agent.primaryCapability,
        ...agent.tags,
      ],
      action: () => {
        if (onSelectAgent) {
          onSelectAgent(agent);
        }
        onToast?.(`Activated agent: ${agent.name} (${agent.codeName})`);
        onClose();
      },
    }));
  }, [isFavorite, onSelectAgent, onToast, onClose]);

  // Dynamic tool commands (Claude, ChatGPT, Cursor, Perplexity, Gemini, etc.)
  const toolCommands: CommandItem[] = useMemo(() => {
    return MOCK_TOOLS.map((tool) => ({
      id: `tool-${tool.id}`,
      toolId: tool.id,
      title: `${tool.name}`,
      description: `${tool.tagline} · ${tool.pricing} · ★ ${tool.rating.toFixed(1)}`,
      category: 'Tools' as const,
      icon: Sparkles,
      badge: `${tool.category.toUpperCase()}`,
      keywords: [
        tool.name,
        tool.tagline,
        tool.category,
        tool.pricing,
        tool.description,
        ...tool.keyFeatures,
      ],
      action: () => {
        if (onSelectTool) {
          onSelectTool(tool.id);
        }
        onClose();
      },
    }));
  }, [onSelectTool, onClose]);

  // Combined and filtered commands
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    let combined: CommandItem[] = [];

    if (activeFilter === 'All') {
      combined = [...favoriteCommands, ...staticCommands, ...toolCommands, ...agentCommands];
    } else if (activeFilter === 'Favorites') {
      combined = favoriteCommands;
    } else if (activeFilter === 'Navigation') {
      combined = staticCommands.filter((c) => c.category === 'Navigation');
    } else if (activeFilter === 'Actions') {
      combined = staticCommands.filter((c) => c.category === 'Actions' || c.category === 'Utilities');
    } else if (activeFilter === 'Tools') {
      combined = toolCommands;
    } else if (activeFilter === 'Agents') {
      combined = agentCommands;
    }

    if (!q) {
      if (activeFilter === 'All') {
        // Prioritize pinned favorites first, followed by top navigation and tools
        return [
          ...favoriteCommands,
          ...staticCommands.slice(0, 3),
          ...toolCommands.slice(0, 3),
          ...agentCommands.filter((a) => !favoriteIds.includes(a.agentId || '')).slice(0, 3)
        ];
      }
      return combined;
    }

    return combined.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchCategory || matchKeywords;
    });
  }, [query, activeFilter, favoriteCommands, favoriteIds, staticCommands, toolCommands, agentCommands]);

  // Keep selected index within bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeFilter]);

  // Keyboard navigation inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredItems.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredItems.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  // Auto-scroll to selected element
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector(`[data-command-index="${selectedIndex}"]`) as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Command Palette Card */}
      <div
        className="w-full max-w-2xl bg-[#090b10] border border-blue-500/40 rounded-xl shadow-[0_0_50px_rgba(30,58,138,0.35),0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[80vh] relative z-10"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Subtle decorative glowing perimeter line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />

        {/* Input Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-white/[0.02]">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/40 flex items-center justify-center shrink-0">
            <Command className="w-4 h-4 text-blue-400" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, jump to section, or search agents..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none font-sans"
          />

          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-neutral-500 hover:text-white p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-white/20 bg-white/5 text-neutral-400">
              ESC to exit
            </span>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 py-2 border-b border-white/[0.06] bg-black/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(['All', 'Favorites', 'Tools', 'Agents', 'Navigation', 'Actions'] as const).map((filter) => {
            const count = filter === 'Favorites' ? favoriteIds.length : undefined;
            const isFavFilter = filter === 'Favorites';
            const isActive = activeFilter === filter;

            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? isFavFilter
                      ? 'text-amber-300 border border-amber-400/80 bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.4)] font-medium'
                      : 'text-white border border-blue-400/80 bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.4)] font-medium'
                    : isFavFilter && count && count > 0
                    ? 'text-amber-400/90 border border-amber-500/30 hover:border-amber-400/60 bg-amber-500/5'
                    : 'text-neutral-400 border border-transparent hover:text-neutral-200 hover:border-white/10'
                }`}
              >
                {isFavFilter && (
                  <Star className={`w-3 h-3 ${isActive || (count && count > 0) ? 'fill-amber-400 text-amber-400' : ''}`} />
                )}
                <span>{filter}</span>
                {isFavFilter && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-amber-400/25 text-amber-200' : 'bg-white/10 text-neutral-400'
                  }`}>
                    {favoriteIds.length}
                  </span>
                )}
              </button>
            );
          })}
          <span className="ml-auto text-[10px] font-mono text-neutral-500 hidden sm:inline">
            {filteredItems.length} available
          </span>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[380px] divide-y divide-white/[0.03]"
        >
          {filteredItems.length === 0 ? (
            activeFilter === 'Favorites' ? (
              <div className="py-12 text-center space-y-3 px-6">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  <Star className="w-6 h-6 fill-amber-400/30 text-amber-400" />
                </div>
                <div className="text-sm font-mono text-white font-semibold">No Pinned Agents in Favorites</div>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto font-sans leading-relaxed">
                  Click the <span className="text-amber-300 font-mono font-medium">+ Quick Add</span> button on any agent card in the Directory to pin it here for instantaneous command palette access.
                </p>
                <button
                  onClick={() => {
                    onOpenDirectory();
                    onClose();
                  }}
                  className="mt-2 px-3 py-1.5 rounded-lg border border-blue-500/50 hover:border-blue-400 bg-blue-600/15 hover:bg-blue-600/30 text-xs font-mono text-blue-200 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5 text-blue-400" />
                  <span>Explore Agent Directory</span>
                </button>
              </div>
            ) : (
              <div className="py-12 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-white/5 mx-auto flex items-center justify-center text-neutral-500">
                  <Search className="w-5 h-5" />
                </div>
                <div className="text-sm font-mono text-neutral-300">No matching commands or tools found</div>
                <div className="text-xs text-neutral-500">
                  Try searching for &quot;Claude&quot;, &quot;ChatGPT&quot;, &quot;Cursor&quot;, or &quot;Perplexity&quot;
                </div>
              </div>
            )
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              const Icon = item.icon;
              const isItemFav = item.agentId ? isFavorite(item.agentId) : false;

              return (
                <div
                  key={item.id}
                  data-command-index={index}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group px-3.5 py-3 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isSelected
                      ? item.category === 'Favorites'
                        ? 'bg-amber-600/15 border border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                        : 'bg-blue-600/20 border border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'border border-transparent hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.category === 'Tools' ? (
                      <ToolLogo toolId={item.toolId} size="xs" />
                    ) : item.category === 'Agents' || item.category === 'Favorites' ? (
                      <AgentLogo 
                        agentId={item.agentId || item.id.replace('agent-', '').replace('fav-agent-', '')} 
                        size="xs" 
                        showGlow={isSelected} 
                      />
                    ) : (
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                            : 'bg-white/5 text-neutral-400 border border-white/10'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs sm:text-sm font-medium tracking-wide truncate ${
                          isSelected ? 'text-white font-semibold' : 'text-neutral-200'
                        }`}>
                          {item.title}
                        </span>

                        {item.badge && (
                          <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase tracking-wider shrink-0 ${
                            item.category === 'Favorites'
                              ? 'text-amber-300 border-amber-500/40 bg-amber-500/15 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                              : item.category === 'Agents'
                              ? 'text-cyan-300 border-cyan-500/30 bg-cyan-500/10'
                              : item.category === 'Navigation'
                              ? 'text-amber-300 border-amber-500/30 bg-amber-500/10'
                              : 'text-blue-300 border-blue-500/30 bg-blue-500/10'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-400 truncate mt-0.5 font-sans">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Right shortcut / enter affordance & quick unpin */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Quick pin / unpin star toggle button */}
                    {item.agentId && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const nextState = toggleFavorite(item.agentId!);
                          if (nextState) {
                            onToast?.(`★ Pinned agent to Favorites`);
                          } else {
                            onToast?.(`Removed agent from Favorites`);
                          }
                        }}
                        className={`p-1 rounded transition-colors cursor-pointer ${
                          isItemFav
                            ? 'text-amber-400 hover:text-amber-300'
                            : 'text-neutral-500 hover:text-amber-300'
                        }`}
                        title={isItemFav ? "Unpin from Favorites" : "Pin to Favorites"}
                      >
                        <Star className={`w-3.5 h-3.5 ${isItemFav ? 'fill-amber-400' : ''}`} />
                      </button>
                    )}

                    {item.shortcut && (
                      <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">
                        {item.shortcut}
                      </kbd>
                    )}

                    <div
                      className={`w-5 h-5 rounded flex items-center justify-center transition-all ${
                        isSelected
                          ? 'text-blue-300 opacity-100'
                          : 'text-neutral-600 opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <CornerDownLeft className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-3 border-t border-white/10 bg-black/60 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-neutral-300">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-neutral-300">↓</kbd>
              <span className="text-neutral-500 text-[10px]">Navigate</span>
            </span>

            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-neutral-300">↵</kbd>
              <span className="text-neutral-500 text-[10px]">Execute</span>
            </span>

            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[10px] text-neutral-300">ESC</kbd>
              <span className="text-neutral-500 text-[10px]">Dismiss</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-neutral-500 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>PALETTE READY (CTRL+K)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
