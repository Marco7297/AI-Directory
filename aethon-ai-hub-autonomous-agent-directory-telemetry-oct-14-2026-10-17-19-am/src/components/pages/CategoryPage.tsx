import React, { useState } from 'react';
import { 
  FolderGit2, 
  Search, 
  ExternalLink, 
  Star, 
  Check, 
  Filter, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  Layers
} from 'lucide-react';
import { ToolCategory, ToolPricing, AITool } from '../../types';
import { MOCK_TOOLS } from '../../data/mockTools';
import { ToolLogo } from '../ToolLogo';

interface CategoryPageProps {
  initialCategory?: ToolCategory;
  onSelectTool: (toolId: string) => void;
  onNavigateAllTools: () => void;
  onCompareTools: (toolAId?: string) => void;
}

const CATEGORY_METADATA: Record<ToolCategory, { heading: string; intro: string; icon: string }> = {
  Coding: {
    heading: 'AI Coding & Software Engineering Tools',
    intro: 'Next-generation IDEs, speculative autocompletion engines, and multi-file agentic composers. These tools ingest entire software repositories, auto-repair compiler diagnostics, and accelerate feature shipping.',
    icon: '💻'
  },
  Writing: {
    heading: 'AI Writing & Long-Form Copywriting Engines',
    intro: 'Frontier natural language processors engineered for deep reasoning, non-repetitive prose, structured technical reporting, and creative narrative development across technical whitepapers, marketing campaigns, and fiction.',
    icon: '✍️'
  },
  'Design & Video': {
    heading: 'Generative Design, Vector & Video AI Software',
    intro: 'Diffusion models, scalable SVG vector generators, and cinematic text-to-video engines. These tools empower digital artists, product designers, and video directors with granular camera and style control.',
    icon: '🎨'
  },
  'Research & Data': {
    heading: 'AI Research, Citation & Live Data Answer Engines',
    intro: 'Grounded reasoning engines that bridge generative models with live web indices, academic DOI databases, and proprietary corporate document stores with verified hyperlinked footnotes.',
    icon: '🔍'
  },
  Productivity: {
    heading: 'Connected Workplace & Autonomous Task Automation',
    intro: 'Knowledge assistants and workplace databases that summarize team meeting transcripts, synthesize project roadmaps, and automate repetitive administrative workflows.',
    icon: '⚡'
  },
  'Audio & Voice': {
    heading: 'Synthetic Speech, Voice Cloning & Audio Production',
    intro: 'Emotional voice synthesizers, real-time conversational voice APIs, sound effect generators, and text-based multi-track audio editors that eliminate room noise in one click.',
    icon: '🎙️'
  }
};

const CATEGORIES: ToolCategory[] = [
  'Coding',
  'Writing',
  'Design & Video',
  'Research & Data',
  'Productivity',
  'Audio & Voice'
];

export const CategoryPage: React.FC<CategoryPageProps> = ({
  initialCategory = 'Coding',
  onSelectTool,
  onNavigateAllTools,
  onCompareTools
}) => {
  const [activeCategory, setActiveCategory] = useState<ToolCategory>(initialCategory);
  const [pricingFilter, setPricingFilter] = useState<'All' | ToolPricing>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const meta = CATEGORY_METADATA[activeCategory] || CATEGORY_METADATA.Coding;

  const categoryTools = MOCK_TOOLS.filter((tool) => {
    const matchesCat = tool.category === activeCategory;
    const matchesPricing = pricingFilter === 'All' || tool.pricing === pricingFilter;
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesPricing && matchesSearch;
  });

  const getPricingBadgeStyle = (pricing: ToolPricing) => {
    switch (pricing) {
      case 'Free':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Freemium':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'Paid':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-neutral-800 text-neutral-300 border-neutral-700';
    }
  };

  return (
    <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 py-12">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onNavigateAllTools}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Directory Tools</span>
        </button>
      </div>

      {/* Category Tabs Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-mono">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeCategory === cat
                ? 'bg-blue-600 text-white font-bold shadow-[0_0_16px_rgba(59,130,246,0.4)] border border-blue-400'
                : 'bg-[#0f121d] text-neutral-400 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            <span>{CATEGORY_METADATA[cat].icon}</span>
            <span>{cat}</span>
          </button>
        ))}
      </div>

      {/* Heading & Intro Text (Requested Category Layout Components) */}
      <div className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 mb-10 shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>Category Deep Dive // {activeCategory}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
          {meta.heading}
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 max-w-4xl leading-relaxed font-normal">
          {meta.intro}
        </p>

        {/* In-category mini-filter bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-neutral-400 mr-2">Filter Pricing:</span>
            {(['All', 'Free', 'Freemium', 'Paid'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPricingFilter(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  pricingFilter === p
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50 font-bold'
                    : 'bg-white/5 text-neutral-400 hover:text-white border border-white/5'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder={`Search within ${activeCategory}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#121622] border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Grid of Category Tool Cards (Non-rectangular Cyber Chamfered Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {categoryTools.map((tool) => (
          <div
            key={tool.id}
            className="group relative transition-all duration-300 hover:-translate-y-1.5"
          >
            {/* Outer Sleek Rounded Cyber Beveled Border Shell */}
            <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-white/20 via-blue-500/25 to-white/10 group-hover:from-cyan-400 group-hover:via-blue-400 group-hover:to-indigo-500 shadow-xl group-hover:shadow-[0_15px_35px_rgba(59,130,246,0.35)] transition-all duration-300">
              <div className="rounded-[22px] bg-[#0b0e17]/95 hover:bg-[#0e1322]/95 backdrop-blur-md p-6 flex flex-col justify-between min-h-[360px] relative transition-colors duration-300">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <ToolLogo tool={tool} size="md" />
                      <div>
                        <h3 
                          onClick={() => onSelectTool(tool.id)}
                          className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer"
                        >
                          {tool.name}
                        </h3>
                        <div className="text-[11px] font-mono text-neutral-400">
                          {tool.category}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-mono uppercase font-semibold px-3 py-1 rounded-full border ${getPricingBadgeStyle(tool.pricing)}`}>
                      {tool.pricing}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-neutral-200 line-clamp-2 mb-3 leading-snug">
                    {tool.tagline}
                  </p>

                  <p className="text-xs text-neutral-400 line-clamp-3 mb-4 leading-relaxed font-normal">
                    {tool.description}
                  </p>

                  <div className="flex items-center gap-4 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5 mb-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{tool.rating.toFixed(1)}</span>
                      <span className="text-neutral-500 text-[10px]">({tool.reviewCount.toLocaleString()})</span>
                    </div>
                    <div className="h-3 w-px bg-white/10" />
                    <div className="text-neutral-400 text-[11px] truncate">
                      <span className="text-neutral-500">Free Tier: </span>
                      <span className="text-neutral-300">{tool.freePlan.startsWith('Yes') ? 'Active' : 'Trial'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectTool(tool.id)}
                    className="text-xs font-medium text-neutral-300 hover:text-blue-400 transition-colors flex items-center gap-1 py-1.5 cursor-pointer"
                  >
                    <span>Read Review</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onCompareTools(tool.id)}
                      className="px-2.5 py-1.5 text-[11px] font-mono text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-all cursor-pointer"
                    >
                      Compare
                    </button>
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded border border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.3)] flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categoryTools.length === 0 && (
        <div className="text-center py-16 bg-[#0b0e17] border border-white/10 rounded-2xl p-8 mb-12">
          <p className="text-base text-neutral-300 mb-2 font-semibold">No tools match this filter combination in {activeCategory}.</p>
          <button
            onClick={() => {
              setPricingFilter('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider"
          >
            Reset Category Filters
          </button>
        </div>
      )}
    </div>
  );
};
