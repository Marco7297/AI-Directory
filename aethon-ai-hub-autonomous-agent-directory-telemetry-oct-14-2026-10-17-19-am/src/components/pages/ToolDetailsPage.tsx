import React, { useState } from 'react';
import { 
  Star, 
  Check, 
  X, 
  ExternalLink, 
  ChevronLeft, 
  ArrowRight, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  Layers,
  ArrowLeftRight,
  Info,
  Calendar,
  Award
} from 'lucide-react';
import { AITool } from '../../types';
import { MOCK_TOOLS } from '../../data/mockTools';
import { ToolLogo } from '../ToolLogo';

interface ToolDetailsPageProps {
  toolId?: string;
  onSelectTool: (id: string) => void;
  onCompareWith: (toolAId: string, toolBId?: string) => void;
  onNavigateAllTools: () => void;
  onNavigateCategory: (category: string) => void;
}

export const ToolDetailsPage: React.FC<ToolDetailsPageProps> = ({
  toolId = 'cursor-ai',
  onSelectTool,
  onCompareWith,
  onNavigateAllTools,
  onNavigateCategory
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  // Find active tool or fallback to first
  const tool = MOCK_TOOLS.find((t) => t.id === toolId) || MOCK_TOOLS[0];

  // Find 3 similar tools based on similarToolIds or same category
  const similarTools: AITool[] = MOCK_TOOLS.filter(
    (t) => t.id !== tool.id && (tool.similarToolIds.includes(t.id) || t.category === tool.category)
  ).slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const getPricingBadgeStyle = (pricing: string) => {
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
    <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 py-10">
      {/* Top Breadcrumb & Return Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <button
          onClick={onNavigateAllTools}
          className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Tools</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onCompareWith(tool.id)}
            className="px-3.5 py-1.5 text-xs font-mono font-medium text-white bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/40 hover:border-blue-400 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title={`Compare ${tool.name} with other tools`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
            <span>Compare</span>
          </button>
          <button
            onClick={handleShare}
            className="px-3 py-1.5 text-xs font-mono text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Copied URL!' : 'Share Review'}</span>
          </button>
        </div>
      </div>

      {/* Main Hero Header Card */}
      <div className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl mb-12">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Identity: Logo, Name, Badges, Tagline */}
          <div className="flex items-start sm:items-center gap-6">
            {/* Authentic Brand Logo */}
            <ToolLogo tool={tool} size="xl" />

            <div>
              {/* Badge row */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  onClick={() => onNavigateCategory(tool.category)}
                  className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 cursor-pointer"
                >
                  {tool.category}
                </span>

                {/* Pricing Badge */}
                <span className={`text-[11px] font-mono uppercase font-bold px-2.5 py-0.5 rounded border ${getPricingBadgeStyle(tool.pricing)}`}>
                  {tool.pricing}
                </span>

                {/* Featured Badge */}
                {tool.featured && (
                  <span className="text-[11px] font-mono uppercase font-bold px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/50 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>Featured</span>
                  </span>
                )}

                {/* Sponsored Badge */}
                {tool.sponsored && (
                  <span className="text-[11px] font-mono uppercase font-bold px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/50 flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-400" />
                    <span>Sponsored Review</span>
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">
                {tool.name}
              </h1>

              {/* Tagline */}
              <p className="text-base text-neutral-300 max-w-2xl leading-relaxed mb-3 font-medium">
                {tool.tagline}
              </p>

              {/* Rating and review stats */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{tool.rating.toFixed(1)}</span>
                </div>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-400">
                  {tool.reviewCount.toLocaleString()} Verified Technical Reviews
                </span>
                <span className="text-neutral-500">•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Independently Benchmarked</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Box: Direct Compare Button & Visit Official Site */}
          <div className="w-full lg:w-auto shrink-0 flex flex-col items-stretch sm:items-end gap-3">
            <div className="flex flex-col sm:flex-row items-stretch gap-3 w-full sm:w-auto">
              {/* Primary Direct Compare Button */}
              <button
                onClick={() => onCompareWith(tool.id)}
                className="px-6 py-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/20 hover:from-blue-600/35 hover:to-indigo-600/35 border border-blue-400/40 hover:border-blue-400 text-white font-bold text-sm tracking-wide flex items-center justify-center gap-2.5 transition-all shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_28px_rgba(59,130,246,0.4)] cursor-pointer group"
                title={`Compare ${tool.name} with other tools`}
              >
                <ArrowLeftRight className="w-4 h-4 text-blue-400 group-hover:rotate-180 transition-transform duration-300" />
                <span>Compare</span>
              </button>

              {/* Prominent Visit Official Site Button */}
              <a
                href={tool.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm uppercase tracking-wider text-center flex items-center justify-center gap-3 shadow-[0_0_28px_rgba(59,130,246,0.5)] hover:shadow-[0_0_36px_rgba(59,130,246,0.7)] transition-all cursor-pointer"
              >
                <span>Visit Official Site</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <span className="text-[11px] font-mono text-neutral-500 text-center sm:text-right">
              Verified destination: {tool.websiteUrl.replace('https://', '')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Description & Pros/Cons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Left Column: Description & Key Features */}
        <div className="lg:col-span-7 space-y-8">
          {/* Detailed Description */}
          <div className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              <span>Comprehensive Editorial Assessment</span>
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6 font-normal">
              {tool.description}
            </p>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-500 uppercase">Primary Target Audience</span>
                <span className="text-neutral-200 font-sans font-medium text-right">{tool.bestFor}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-white/5">
                <span className="text-neutral-500 uppercase">Permanent Free Tier</span>
                <span className="text-emerald-400 text-right">{tool.freePlan}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500 uppercase">Pricing Breakdown</span>
                <span className="text-neutral-200 text-right">{tool.pricingDetails}</span>
              </div>
            </div>
          </div>

          {/* Key Features List */}
          <div className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4">Core Architectural Features</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tool.keyFeatures.map((feat, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#121622] border border-white/10 text-xs text-neutral-200 flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-[10px] shrink-0 font-bold">
                    {idx + 1}
                  </div>
                  <span className="font-medium leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Pros and Cons Columns */}
        <div className="lg:col-span-5 space-y-6">
          {/* Pros Column */}
          <div className="bg-[#0b0e17] border border-emerald-500/30 rounded-2xl p-8 shadow-xl">
            <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
              <Check className="w-5 h-5 text-emerald-400" />
              <span>Verified Strengths & Pros</span>
            </h3>
            <div className="space-y-3">
              {tool.pros.map((pro, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-200">
                  <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="leading-relaxed">{pro}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cons Column */}
          <div className="bg-[#0b0e17] border border-rose-500/30 rounded-2xl p-8 shadow-xl">
            <h3 className="text-lg font-bold text-rose-400 mb-4 flex items-center gap-2">
              <X className="w-5 h-5 text-rose-400" />
              <span>Limitations & Things to Consider</span>
            </h3>
            <div className="space-y-3">
              {tool.cons.map((con, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-300">
                  <div className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </div>
                  <span className="leading-relaxed">{con}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Feature Banner */}
      <div className="mb-14 bg-gradient-to-r from-blue-950/40 via-[#0e1424] to-indigo-950/30 border border-blue-500/30 rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            <ArrowLeftRight className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
              Direct Benchmark Matrix
            </div>
            <h3 className="text-xl font-bold text-white mb-1.5">
              Compare {tool.name} Side-by-Side
            </h3>
            <p className="text-sm text-neutral-300 max-w-xl leading-relaxed">
              Open the interactive side-by-side comparison tool with {tool.name} preloaded as the primary entry to evaluate pricing, feature specifications, and alternative platforms.
            </p>
          </div>
        </div>
        <button
          onClick={() => onCompareWith(tool.id)}
          className="shrink-0 w-full md:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-[0_0_24px_rgba(59,130,246,0.4)] hover:shadow-[0_0_32px_rgba(59,130,246,0.6)] transition-all cursor-pointer group"
        >
          <ArrowLeftRight className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          <span>Launch Comparison Matrix</span>
        </button>
      </div>

      {/* Similar Tools Row with 3 Cards (Explicit User Brief Requirement) */}
      <div className="mt-6 pt-12 border-t border-white/10">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider mb-1">
              Alternative Discoveries
            </div>
            <h2 className="text-2xl font-bold text-white">
              Similar AI Tools & Direct Competitors
            </h2>
          </div>
          <button
            onClick={onNavigateAllTools}
            className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>View All Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Similar Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {similarTools.map((simTool) => (
            <div
              key={simTool.id}
              className="bg-[#0b0e17] border border-white/10 hover:border-blue-500/50 rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <ToolLogo tool={simTool} size="md" />
                    <div>
                      <h4 
                        onClick={() => onSelectTool(simTool.id)}
                        className="text-base font-bold text-white hover:text-blue-400 transition-colors cursor-pointer"
                      >
                        {simTool.name}
                      </h4>
                      <span className="text-[11px] font-mono text-neutral-400">{simTool.category}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono uppercase font-semibold px-2 py-0.5 rounded border ${getPricingBadgeStyle(simTool.pricing)}`}>
                    {simTool.pricing}
                  </span>
                </div>

                <p className="text-xs text-neutral-300 line-clamp-2 mb-4 leading-relaxed font-normal">
                  {simTool.tagline}
                </p>

                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono mb-4">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span className="font-bold">{simTool.rating.toFixed(1)}</span>
                  <span className="text-neutral-500 text-[10px]">({simTool.reviewCount.toLocaleString()} reviews)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectTool(simTool.id)}
                  className="text-xs text-neutral-300 hover:text-blue-400 font-medium transition-colors cursor-pointer"
                >
                  Details →
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onCompareWith(tool.id, simTool.id)}
                    className="px-2.5 py-1.5 text-xs font-mono text-blue-300 hover:text-white bg-blue-500/15 hover:bg-blue-500/30 border border-blue-500/30 hover:border-blue-400 rounded flex items-center gap-1 transition-all cursor-pointer"
                    title={`Compare ${tool.name} vs ${simTool.name}`}
                  >
                    <ArrowLeftRight className="w-3 h-3 text-blue-400" />
                    <span>Compare</span>
                  </button>
                  <a
                    href={simTool.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded border border-blue-400/40 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
