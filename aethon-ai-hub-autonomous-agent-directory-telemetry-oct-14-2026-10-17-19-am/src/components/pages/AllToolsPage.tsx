import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  Star, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ArrowUpDown, 
  Layers,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { AITool, ToolCategory, ToolPricing } from '../../types';
import { MOCK_TOOLS } from '../../data/mockTools';
import { ToolLogo } from '../ToolLogo';

interface AllToolsPageProps {
  onSelectTool: (toolId: string) => void;
  onNavigateCategory: (category: ToolCategory) => void;
  onCompareTools: (toolAId?: string, toolBId?: string) => void;
}

const CATEGORIES: ('All' | ToolCategory)[] = [
  'All',
  'Coding',
  'Writing',
  'Design & Video',
  'Research & Data',
  'Productivity',
  'Audio & Voice'
];

const PRICING_OPTIONS: ('All' | ToolPricing)[] = ['All', 'Free', 'Freemium', 'Paid'];

const RATING_OPTIONS: { label: string; value: number }[] = [
  { label: 'All Ratings', value: 0 },
  { label: '4.8 ★ & above', value: 4.8 },
  { label: '4.7 ★ & above', value: 4.7 },
  { label: '4.5 ★ & above', value: 4.5 }
];

export const AllToolsPage: React.FC<AllToolsPageProps> = ({
  onSelectTool,
  onNavigateCategory,
  onCompareTools
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | ToolCategory>('All');
  const [selectedPricing, setSelectedPricing] = useState<'All' | ToolPricing>('All');
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating');

  // Filter and sort the 9+ placeholder tool cards (CMS ready)
  const filteredTools = useMemo(() => {
    return MOCK_TOOLS.filter((tool) => {
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesPricing = selectedPricing === 'All' || tool.pricing === selectedPricing;
      const matchesRating = tool.rating >= selectedRating;

      return matchesSearch && matchesCategory && matchesPricing && matchesRating;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [searchQuery, selectedCategory, selectedPricing, selectedRating, sortBy]);

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
      {/* Page Title & Mission Subtitle */}
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>Curated Index & Independent Review Database</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          All AI Tools Directory
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 max-w-3xl leading-relaxed">
          Explore our vetted directory of top-tier artificial intelligence software, development engines, and productivity tools. Every tool is benchmarked against real-world reliability, pricing transparency, and practical output quality.
        </p>
      </div>

      {/* Control Bar: Search Bar + Multi-Filters */}
      <div className="bg-[#0b0d14] border border-white/10 rounded-xl p-5 mb-8 shadow-xl backdrop-blur-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Main Search Bar */}
          <div className="lg:col-span-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by tool name, capability, keyword (e.g. Cursor, video, coding, Claude)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121520] border border-white/10 rounded-lg pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/70 focus:ring-1 focus:ring-blue-500/50 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-800"
              >
                Clear
              </button>
            )}
          </div>

          {/* Pricing Model Filter Buttons */}
          <div className="lg:col-span-3 flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-[11px] font-mono uppercase text-neutral-400 mr-1 shrink-0">Pricing:</span>
            {PRICING_OPTIONS.map((pricing) => (
              <button
                key={pricing}
                onClick={() => setSelectedPricing(pricing)}
                className={`px-3 py-1.5 rounded text-xs font-medium tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                  selectedPricing === pricing
                    ? 'bg-blue-600 text-white font-semibold shadow-[0_0_12px_rgba(59,130,246,0.5)] border border-blue-400'
                    : 'bg-[#151926] text-neutral-400 hover:text-white border border-white/5 hover:border-white/20'
                }`}
              >
                {pricing}
              </button>
            ))}
          </div>

          {/* Rating Dropdown & Sort */}
          <div className="lg:col-span-3 flex items-center gap-3 justify-start lg:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase text-neutral-400 shrink-0">Rating:</span>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className="bg-[#151926] border border-white/10 text-neutral-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
              >
                {RATING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#151926] border border-white/10 text-neutral-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="rating">Sort: Highest Rated</option>
                <option value="reviews">Sort: Most Reviews</option>
                <option value="name">Sort: Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-mono uppercase text-neutral-400 mr-2 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3 text-blue-400" /> Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap text-xs ${
                selectedCategory === cat
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/60 shadow-[0_0_10px_rgba(59,130,246,0.3)] font-medium'
                  : 'bg-white/[0.03] text-neutral-400 hover:text-white border border-white/5 hover:border-white/15'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Meta Info */}
      <div className="flex items-center justify-between text-xs text-neutral-400 mb-6 font-mono">
        <div>
          Showing <span className="text-white font-semibold">{filteredTools.length}</span> curated AI tools
          {selectedCategory !== 'All' && <span> in <span className="text-blue-400">{selectedCategory}</span></span>}
          {selectedPricing !== 'All' && <span> with <span className="text-emerald-400">{selectedPricing}</span> model</span>}
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>All listings independently benchmarked</span>
        </div>
      </div>

      {/* Grid of Tool Cards (Placeholder grid ready for CMS connection) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            className="group relative transition-all duration-300 hover:-translate-y-1.5"
          >
            {/* Outer Sleek Rounded Cyber Beveled Border Shell */}
            <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-white/20 via-blue-500/25 to-white/10 group-hover:from-cyan-400 group-hover:via-blue-400 group-hover:to-indigo-500 shadow-xl group-hover:shadow-[0_15px_35px_rgba(59,130,246,0.35)] transition-all duration-300">
              <div className="rounded-[22px] bg-[#0b0e17]/95 hover:bg-[#0e1322]/95 backdrop-blur-md p-6 flex flex-col justify-between min-h-[360px] relative transition-colors duration-300">
                {/* Top row: Logo, Name, Tagline & Pricing Badge */}
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      {/* Authentic Brand Logo */}
                      <ToolLogo tool={tool} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 
                            onClick={() => onSelectTool(tool.id)}
                            className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer"
                          >
                            {tool.name}
                          </h3>
                          {tool.featured && (
                            <span className="text-[9px] font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-400/40 px-2 py-0.5 rounded-full">
                              Featured
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => onNavigateCategory(tool.category)}
                          className="text-[11px] font-mono text-neutral-400 hover:text-blue-300 transition-colors text-left"
                        >
                          {tool.category}
                        </button>
                      </div>
                    </div>

                    {/* Pricing Badge */}
                    <div className="shrink-0">
                      <span className={`text-[10px] font-mono uppercase font-semibold px-3 py-1 rounded-full border ${getPricingBadgeStyle(tool.pricing)}`}>
                        {tool.pricing}
                      </span>
                    </div>
                  </div>

                  {/* Tagline */}
                  <p className="text-sm font-medium text-neutral-200 line-clamp-2 mb-3 leading-snug">
                    {tool.tagline}
                  </p>

                  {/* Description preview */}
                  <p className="text-xs text-neutral-400 line-clamp-3 mb-4 leading-relaxed font-normal">
                    {tool.description}
                  </p>

                  {/* Quick Specs / Ratings */}
                  <div className="flex items-center gap-4 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5 mb-4 text-xs font-mono">
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold">{tool.rating.toFixed(1)}</span>
                      <span className="text-neutral-500 text-[10px]">({tool.reviewCount.toLocaleString()})</span>
                    </div>
                    <div className="h-3 w-px bg-white/10" />
                    <div className="text-neutral-400 text-[11px] truncate">
                      <span className="text-neutral-500">Free: </span>
                      <span className="text-neutral-300">{tool.freePlan.startsWith('Yes') ? 'Available' : 'Trial Only'}</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions: Visit Site + View Details + Compare */}
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
                      title="Compare with another tool"
                      className="px-2.5 py-1.5 text-[11px] font-mono text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded transition-all cursor-pointer"
                    >
                      Compare
                    </button>
                    <a
                      href={tool.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 rounded border border-blue-400/50 shadow-[0_0_12px_rgba(59,130,246,0.3)] hover:shadow-[0_0_16px_rgba(59,130,246,0.6)] flex items-center gap-1.5 transition-all cursor-pointer"
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

      {/* Empty State */}
      {filteredTools.length === 0 && (
        <div className="text-center py-20 bg-[#0d0f18] border border-white/10 rounded-2xl p-8">
          <p className="text-lg text-neutral-300 mb-2 font-semibold">No AI tools matched your filters</p>
          <p className="text-sm text-neutral-400 mb-6">Try resetting search keywords or expanding category criteria.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedPricing('All');
              setSelectedRating(0);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold uppercase tracking-wider hover:bg-blue-500 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* CMS Connection Notice / Footer Note */}
      <div className="mt-12 p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-neutral-300">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong>CMS Ready Architecture:</strong> This layout is wired with structured data fields for easy headless CMS ingestion (Strapi, Sanity, or Ghost).
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onCompareTools()}
            className="text-blue-400 hover:text-blue-300 underline font-mono text-[11px]"
          >
            Launch Comparison Table →
          </button>
        </div>
      </div>
    </div>
  );
};
