import React, { useState, useEffect } from 'react';
import { 
  ArrowLeftRight, 
  Star, 
  Check, 
  X, 
  ExternalLink, 
  ChevronDown, 
  Sparkles, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { AITool } from '../../types';
import { MOCK_TOOLS } from '../../data/mockTools';
import { ToolLogo } from '../ToolLogo';

interface CompareToolsPageProps {
  initialToolAId?: string;
  initialToolBId?: string;
  onSelectTool: (toolId: string) => void;
  onNavigateAllTools: () => void;
}

export const CompareToolsPage: React.FC<CompareToolsPageProps> = ({
  initialToolAId = 'cursor-ai',
  initialToolBId = 'github-copilot',
  onSelectTool,
  onNavigateAllTools
}) => {
  const [toolAId, setToolAId] = useState<string>(initialToolAId);
  const [toolBId, setToolBId] = useState<string>(initialToolBId);

  useEffect(() => {
    if (initialToolAId) {
      setToolAId(initialToolAId);
      if (initialToolBId && initialToolBId !== initialToolAId) {
        setToolBId(initialToolBId);
      } else {
        const found = MOCK_TOOLS.find((t) => t.id === initialToolAId);
        const alt = found?.similarToolIds?.find((id) => id !== initialToolAId)
          || MOCK_TOOLS.find((t) => t.id !== initialToolAId)?.id
          || 'github-copilot';
        setToolBId(alt);
      }
    }
  }, [initialToolAId, initialToolBId]);

  const toolA = MOCK_TOOLS.find((t) => t.id === toolAId) || MOCK_TOOLS[0];
  const toolB = MOCK_TOOLS.find((t) => t.id === toolBId) || MOCK_TOOLS[1];

  const handleSwap = () => {
    const temp = toolAId;
    setToolAId(toolBId);
    setToolBId(temp);
  };

  const PRESETS = [
    { label: 'Cursor vs GitHub Copilot', a: 'cursor-ai', b: 'github-copilot' },
    { label: 'Claude 3.5 vs ChatGPT Plus', a: 'claude-ai', b: 'chatgpt-plus' },
    { label: 'Perplexity vs Claude', a: 'perplexity-ai', b: 'claude-ai' },
    { label: 'ElevenLabs vs Descript', a: 'elevenlabs', b: 'descript-ai' }
  ];

  return (
    <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 py-12">
      {/* Title & Introduction */}
      <div className="mb-10 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-4">
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>Head-to-Head Specification & Value Matrix</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Compare AI Tools Side-by-Side
        </h1>
        <p className="text-base sm:text-lg text-neutral-400 max-w-3xl leading-relaxed">
          Select any two artificial intelligence tools to evaluate feature coverage, pricing differences, free plan provisions, and real-world advantages directly against each other.
        </p>
      </div>

      {/* Preset Comparison Buttons */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs font-mono uppercase text-neutral-400 mr-1">Popular Comparisons:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setToolAId(preset.a);
              setToolBId(preset.b);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              toolAId === preset.a && toolBId === preset.b
                ? 'bg-blue-600 text-white border border-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                : 'bg-white/5 text-neutral-300 hover:text-white border border-white/10 hover:border-white/20'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Selector Controls Bar */}
      <div className="bg-[#0b0e17] border border-white/10 rounded-2xl p-6 mb-8 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          {/* Tool A Selector */}
          <div className="md:col-span-5">
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              Primary Selection (Tool A)
            </label>
            <div className="relative">
              <select
                value={toolAId}
                onChange={(e) => setToolAId(e.target.value)}
                className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                {MOCK_TOOLS.map((t) => (
                  <option key={t.id} value={t.id} disabled={t.id === toolBId}>
                    {t.name} — {t.category} ({t.pricing})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center py-2 md:py-0">
            <button
              onClick={handleSwap}
              title="Swap tool positions"
              className="p-3 rounded-full bg-white/5 hover:bg-blue-600 border border-white/10 hover:border-blue-400 text-neutral-300 hover:text-white transition-all shadow-md cursor-pointer"
            >
              <ArrowLeftRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tool B Selector */}
          <div className="md:col-span-5">
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              Comparison Target (Tool B)
            </label>
            <div className="relative">
              <select
                value={toolBId}
                onChange={(e) => setToolBId(e.target.value)}
                className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white font-medium focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
              >
                {MOCK_TOOLS.map((t) => (
                  <option key={t.id} value={t.id} disabled={t.id === toolAId}>
                    {t.name} — {t.category} ({t.pricing})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Table Layout */}
      <div className="overflow-hidden border border-white/10 rounded-2xl bg-[#0b0e17] shadow-2xl mb-12">
        {/* Table Header: Identity & Overviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-[#0e1220]/80">
          {/* Column A Header */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <ToolLogo tool={toolA} size="lg" />
                  <div>
                    <h2 className="text-2xl font-black text-white">{toolA.name}</h2>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">{toolA.category}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-blue-500/20 text-blue-300 border border-blue-400/40 uppercase">
                  {toolA.pricing}
                </span>
              </div>
              <p className="text-sm text-neutral-300 mb-4 font-medium leading-relaxed">{toolA.tagline}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => onSelectTool(toolA.id)}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-mono cursor-pointer"
              >
                Read Full In-Depth Review →
              </button>
            </div>
          </div>

          {/* Column B Header */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <ToolLogo tool={toolB} size="lg" />
                  <div>
                    <h2 className="text-2xl font-black text-white">{toolB.name}</h2>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">{toolB.category}</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/40 uppercase">
                  {toolB.pricing}
                </span>
              </div>
              <p className="text-sm text-neutral-300 mb-4 font-medium leading-relaxed">{toolB.tagline}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => onSelectTool(toolB.id)}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-mono cursor-pointer"
              >
                Read Full In-Depth Review →
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Rows */}
        <div className="divide-y divide-white/10 text-sm">
          {/* Row: Rating */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-white/[0.01]">
            <div className="md:col-span-12 p-3 bg-neutral-900/60 text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold px-8">
              Overall Editorial Rating
            </div>
            <div className="md:col-span-6 p-6">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-lg mb-1">
                <Star className="w-5 h-5 fill-amber-400" />
                <span>{toolA.rating.toFixed(1)} / 5.0</span>
              </div>
              <div className="text-xs text-neutral-400 font-mono">
                Based on {toolA.reviewCount.toLocaleString()} verified practitioner evaluations
              </div>
            </div>
            <div className="md:col-span-6 p-6">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-lg mb-1">
                <Star className="w-5 h-5 fill-amber-400" />
                <span>{toolB.rating.toFixed(1)} / 5.0</span>
              </div>
              <div className="text-xs text-neutral-400 font-mono">
                Based on {toolB.reviewCount.toLocaleString()} verified practitioner evaluations
              </div>
            </div>
          </div>

          {/* Row: Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="md:col-span-12 p-3 bg-neutral-900/60 text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold px-8">
              Pricing & Subscription Details
            </div>
            <div className="md:col-span-6 p-6">
              <div className="font-semibold text-white mb-1.5">{toolA.pricing} Model</div>
              <p className="text-neutral-300 leading-relaxed text-xs">{toolA.pricingDetails}</p>
            </div>
            <div className="md:col-span-6 p-6">
              <div className="font-semibold text-white mb-1.5">{toolB.pricing} Model</div>
              <p className="text-neutral-300 leading-relaxed text-xs">{toolB.pricingDetails}</p>
            </div>
          </div>

          {/* Row: Free Plan */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-white/[0.01]">
            <div className="md:col-span-12 p-3 bg-neutral-900/60 text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold px-8">
              Free Plan Availability & Inclusions
            </div>
            <div className="md:col-span-6 p-6">
              <div className="flex items-start gap-2">
                <span className={`inline-block w-2 h-2 rounded-full mt-1.5 ${toolA.freePlan.startsWith('Yes') ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <p className="text-neutral-200 leading-relaxed text-xs font-mono">{toolA.freePlan}</p>
              </div>
            </div>
            <div className="md:col-span-6 p-6">
              <div className="flex items-start gap-2">
                <span className={`inline-block w-2 h-2 rounded-full mt-1.5 ${toolB.freePlan.startsWith('Yes') ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <p className="text-neutral-200 leading-relaxed text-xs font-mono">{toolB.freePlan}</p>
              </div>
            </div>
          </div>

          {/* Row: Best For */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="md:col-span-12 p-3 bg-neutral-900/60 text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-semibold px-8">
              Ideal Target Audience & Best For
            </div>
            <div className="md:col-span-6 p-6">
              <p className="text-neutral-200 leading-relaxed font-medium">{toolA.bestFor}</p>
            </div>
            <div className="md:col-span-6 p-6">
              <p className="text-neutral-200 leading-relaxed font-medium">{toolB.bestFor}</p>
            </div>
          </div>

          {/* Row: Pros */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-white/[0.01]">
            <div className="md:col-span-12 p-3 bg-neutral-900/60 text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold px-8">
              Key Advantages & Pros
            </div>
            <div className="md:col-span-6 p-6 space-y-2">
              {toolA.pros.map((pro, idx) => (
                <div key={idx} className="flex items-start gap-2 text-neutral-300 text-xs">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </div>
              ))}
            </div>
            <div className="md:col-span-6 p-6 space-y-2">
              {toolB.pros.map((pro, idx) => (
                <div key={idx} className="flex items-start gap-2 text-neutral-300 text-xs">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row: Cons */}
          <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="md:col-span-12 p-3 bg-neutral-900/60 text-[11px] font-mono uppercase tracking-wider text-rose-400 font-semibold px-8">
              Limitations & Cons
            </div>
            <div className="md:col-span-6 p-6 space-y-2">
              {toolA.cons.map((con, idx) => (
                <div key={idx} className="flex items-start gap-2 text-neutral-400 text-xs">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{con}</span>
                </div>
              ))}
            </div>
            <div className="md:col-span-6 p-6 space-y-2">
              {toolB.cons.map((con, idx) => (
                <div key={idx} className="flex items-start gap-2 text-neutral-400 text-xs">
                  <X className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{con}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Row: Visit Site Action Buttons (Under Each Column) */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-[#0e1220] p-8">
            <div className="p-4 flex flex-col items-center justify-center">
              <a
                href={toolA.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-sm py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all cursor-pointer"
              >
                <span>Visit {toolA.name} Official Site</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className="text-[11px] text-neutral-500 mt-2 font-mono">Direct outbound destination</span>
            </div>

            <div className="p-4 flex flex-col items-center justify-center">
              <a
                href={toolB.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full max-w-sm py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all cursor-pointer"
              >
                <span>Visit {toolB.name} Official Site</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <span className="text-[11px] text-neutral-500 mt-2 font-mono">Direct outbound destination</span>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Back CTA */}
      <div className="text-center">
        <button
          onClick={onNavigateAllTools}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase text-neutral-400 hover:text-white transition-colors"
        >
          <span>Need to compare more tools? Return to All Directory Tools</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
