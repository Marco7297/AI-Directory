import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw, Star, ExternalLink, Zap } from 'lucide-react';
import { MOCK_TOOLS } from '../data/mockTools';
import { ToolLogo } from './ToolLogo';
import { AITool } from '../types';

interface AIMatchmakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
  onCompareTools: (toolAId: string, toolBId: string) => void;
}

type Goal = 'coding' | 'reasoning' | 'creative' | 'writing' | 'research';
type Budget = 'free' | 'under20' | 'any';

export const AIMatchmakerModal: React.FC<AIMatchmakerModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  onCompareTools,
}) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<Budget>('any');
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  if (!isOpen) return null;

  const goalOptions: { id: Goal; title: string; desc: string; icon: string }[] = [
    {
      id: 'coding',
      title: 'Code Generation & IDE',
      desc: 'Autonomous bug fixing, full-repo index, and rapid prototyping',
      icon: '⚡'
    },
    {
      id: 'reasoning',
      title: 'Frontier Reasoning & Math',
      desc: 'Extended chain-of-thought, complex logic, and document synthesis',
      icon: '🧠'
    },
    {
      id: 'creative',
      title: 'Creative Media & Video',
      desc: 'Photorealistic 4K image diffusion, cinematic video, and neural voice',
      icon: '🎨'
    },
    {
      id: 'writing',
      title: 'Technical Writing & Copy',
      desc: 'Nuanced long-form essays, documentation, and editing',
      icon: '✍️'
    },
    {
      id: 'research',
      title: 'Deep Research & Search',
      desc: 'Live web scraping, academic citations, and fact verification',
      icon: '🔍'
    }
  ];

  const budgetOptions: { id: Budget; title: string; desc: string }[] = [
    { id: 'free', title: 'Permanent Free Tier', desc: 'No credit card required' },
    { id: 'under20', title: 'Under $20 / Month', desc: 'Affordable Pro access' },
    { id: 'any', title: 'Any Budget / Enterprise', desc: 'Best performance regardless of cost' }
  ];

  const getRecommendations = (): AITool[] => {
    if (!selectedGoal) return [];

    let pool = [...MOCK_TOOLS];

    if (selectedGoal === 'coding') {
      pool = pool.filter((t) => t.category === 'Coding' || t.id === 'cursor-ai' || t.id === 'claude-ai');
    } else if (selectedGoal === 'reasoning') {
      pool = pool.filter((t) => t.id === 'claude-ai' || t.id === 'chatgpt' || t.category === 'Writing');
    } else if (selectedGoal === 'creative') {
      pool = pool.filter((t) => t.category === 'Design & Video' || t.id === 'midjourney' || t.id === 'runway-ml');
    } else if (selectedGoal === 'writing') {
      pool = pool.filter((t) => t.category === 'Writing' || t.id === 'claude-ai');
    } else if (selectedGoal === 'research') {
      pool = pool.filter((t) => t.category === 'Productivity' || t.id === 'perplexity-ai');
    }

    if (selectedBudget === 'free') {
      const freeTools = pool.filter((t) => t.freePlan && !t.freePlan.toLowerCase().includes('trial'));
      if (freeTools.length > 0) pool = freeTools;
    }

    return pool.slice(0, 2);
  };

  const recommendations = getRecommendations();

  const handleReset = () => {
    setSelectedGoal(null);
    setSelectedBudget('any');
    setHasSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl rounded-3xl border border-white/20 bg-[#090b14]/95 p-6 sm:p-8 shadow-2xl text-white overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow ambient background element */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl border border-blue-400/40 bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase">
                  AI RECOMMENDATION ENGINE
                </span>
                <span className="text-neutral-500 text-xs">·</span>
                <span className="text-[10px] font-mono text-emerald-400">INSTANT 30-SEC MATCH</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                AI Tool Matchmaker
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close matchmaker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6 relative z-10 pr-1">
          {!hasSubmitted ? (
            <>
              {/* Step 1: Goal */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                  <span className="font-semibold text-white">STEP 1: What is your primary objective?</span>
                  <span className="text-neutral-500">Select one</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {goalOptions.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGoal(g.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                        selectedGoal === g.id
                          ? 'border-blue-400 bg-blue-600/15 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-400/50'
                          : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="text-xl shrink-0 mt-0.5">{g.icon}</span>
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white truncate">{g.title}</div>
                        <div className="text-xs text-neutral-400 line-clamp-2 mt-0.5">{g.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Budget */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-300">
                  <span className="font-semibold text-white">STEP 2: What is your budget preference?</span>
                  <span className="text-neutral-500">Select tier</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {budgetOptions.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setSelectedBudget(b.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedBudget === b.id
                          ? 'border-blue-400 bg-blue-600/15 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-400/50'
                          : 'border-white/15 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="text-xs font-semibold text-white">{b.title}</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">{b.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Results Screen */
            <div className="space-y-5 animate-fadeIn">
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-300">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Curated Match: <strong>{recommendations.length} Frontier Tools</strong> matched to your workflow</span>
                </div>
                <button
                  onClick={handleReset}
                  className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refine</span>
                </button>
              </div>

              <div className="space-y-4">
                {recommendations.map((tool, idx) => (
                  <div
                    key={tool.id}
                    className="p-5 rounded-3xl border border-white/20 bg-white/[0.02] hover:border-blue-400 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <ToolLogo tool={tool} size="md" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-white">{tool.name}</h3>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-300">
                              {idx === 0 ? 'Top Match (99%)' : 'Runner Up (96%)'}
                            </span>
                          </div>
                          <span className="text-xs text-neutral-400 font-mono">{tool.category} · {tool.pricing}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-mono text-amber-300">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{tool.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                      {tool.description}
                    </p>

                    <div className="p-3 rounded-xl border border-white/10 bg-white/[0.02] text-xs font-mono text-neutral-300">
                      <strong className="text-white">Why it wins for you: </strong>
                      {tool.bestFor || tool.tagline}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs font-mono text-emerald-400">
                        {tool.freePlan ? `✓ ${tool.freePlan.slice(0, 36)}...` : 'Paid Plan'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectTool(tool.id);
                          }}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>Full Review</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {recommendations.length >= 2 && (
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => {
                      onClose();
                      onCompareTools(recommendations[0].id, recommendations[1].id);
                    }}
                    className="px-5 py-2.5 rounded-2xl border border-white/20 hover:border-blue-400 text-neutral-300 hover:text-white font-mono text-xs tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <span>Compare {recommendations[0].name} vs {recommendations[1].name} Head-to-Head</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {!hasSubmitted && (
          <div className="pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
            <button
              onClick={onClose}
              className="text-xs font-mono text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              disabled={!selectedGoal}
              onClick={() => setHasSubmitted(true)}
              className={`px-6 py-2.5 rounded-2xl font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                selectedGoal
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                  : 'bg-white/10 text-neutral-500 cursor-not-allowed'
              }`}
            >
              <span>Show My Matches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
