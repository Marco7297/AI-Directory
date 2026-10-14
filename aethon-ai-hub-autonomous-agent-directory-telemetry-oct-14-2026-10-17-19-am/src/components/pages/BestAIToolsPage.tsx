import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  Star, 
  Check, 
  X, 
  Sparkles, 
  ExternalLink, 
  Share2, 
  Bookmark,
  Calendar,
  User,
  ChevronLeft
} from 'lucide-react';
import { GuideArticle } from '../../types';
import { MOCK_GUIDES } from '../../data/mockGuides';
import { ToolLogo } from '../ToolLogo';

interface BestAIToolsPageProps {
  onSelectTool: (toolId: string) => void;
  onNavigateAllTools: () => void;
  onArticleReadingChange?: (article: GuideArticle | null) => void;
}

export const BestAIToolsPage: React.FC<BestAIToolsPageProps> = ({
  onSelectTool,
  onNavigateAllTools,
  onArticleReadingChange
}) => {
  const [selectedArticle, setSelectedArticle] = useState<GuideArticle | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleOpenArticle = (article: GuideArticle) => {
    setSelectedArticle(article);
    onArticleReadingChange?.(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseArticle = () => {
    setSelectedArticle(null);
    onArticleReadingChange?.(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  return (
    <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 py-12">
      {/* If an article is selected, display the full rich article view (Blog App Reader) */}
      {selectedArticle ? (
        <article className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={handleCloseArticle}
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white mb-8 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to All Guides</span>
          </button>

          {/* Article Header */}
          <header className="mb-10 pb-8 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-400 mb-4">
              <span className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold uppercase">
                {selectedArticle.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                {selectedArticle.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                {selectedArticle.publishedDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-6 leading-tight">
              {selectedArticle.title}
            </h1>

            <p className="text-lg text-neutral-300 leading-relaxed font-normal mb-6">
              {selectedArticle.summary}
            </p>

            {/* Author Badge & Utility */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#0e111a] border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  {selectedArticle.author.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{selectedArticle.author.name}</div>
                  <div className="text-xs text-neutral-400">{selectedArticle.author.role}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="px-3 py-1.5 text-xs text-neutral-300 hover:text-white bg-white/5 border border-white/10 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedShare ? 'Link Copied!' : 'Share Guide'}</span>
                </button>
              </div>
            </div>
          </header>

          {/* Intro Section */}
          <section className="prose prose-invert max-w-none text-neutral-300 leading-relaxed text-base mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Editorial Overview & Testing Methodology</h2>
            <p className="mb-6">{selectedArticle.intro}</p>
          </section>

          {/* Top Picks Showcase Cards */}
          <section className="mb-14">
            <h2 className="text-2xl font-extrabold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>Our Verified Top Picks & Winners</span>
            </h2>

            <div className="space-y-6">
              {selectedArticle.topPicks.map((pick, idx) => (
                <div
                  key={pick.name}
                  className="group relative transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-white/20 via-amber-500/25 to-blue-500/20 group-hover:from-amber-400 group-hover:via-cyan-400 group-hover:to-blue-500 shadow-xl group-hover:shadow-[0_15px_35px_rgba(245,158,11,0.25)] transition-all duration-300">
                    <div className="rounded-[22px] bg-[#0b0e17]/95 hover:bg-[#0e1322]/95 backdrop-blur-md p-6 sm:p-7 relative transition-colors duration-300">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-4">
                      <ToolLogo toolId={pick.toolId} size="md" className="mt-1" />
                      <div>
                        <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 mb-2 font-bold">
                          {pick.badge}
                        </div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          <span>{idx + 1}. {pick.name}</span>
                          <div className="flex items-center gap-1 text-xs text-amber-400 font-mono">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{pick.rating.toFixed(1)}</span>
                          </div>
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectTool(pick.toolId)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/30 rounded-lg transition-colors cursor-pointer"
                      >
                        Detailed Review
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-200 mb-4 leading-relaxed font-normal">
                    <strong>Why It Won: </strong>{pick.whyItWon}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3 px-4 rounded-lg bg-white/[0.02] border border-white/5 mb-4 text-xs font-mono">
                    <div>
                      <span className="text-neutral-500 uppercase">Best For: </span>
                      <span className="text-neutral-300">{pick.bestFor}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 uppercase">Pricing: </span>
                      <span className="text-emerald-400 font-medium">{pick.pricing}</span>
                    </div>
                  </div>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <div className="font-mono text-emerald-400 font-semibold uppercase text-[10px]">Key Strengths</div>
                      {pick.pros.map((p, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <div className="font-mono text-rose-400 font-semibold uppercase text-[10px]">Things to Consider</div>
                      {pick.cons.map((c, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-neutral-400">
                          <X className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
              ))}
            </div>
          </section>

          {/* Buyer Advice / How to Choose */}
          <section className="mb-12 p-6 rounded-xl bg-blue-950/20 border border-blue-500/30">
            <h3 className="text-lg font-bold text-white mb-4">Crucial Buying & Implementation Advice</h3>
            <ul className="space-y-3 text-sm text-neutral-300">
              {selectedArticle.buyerAdvice.map((advice, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Conclusion */}
          <section className="mb-14 p-6 rounded-xl bg-[#0e111a] border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2">Final Verdict</h3>
            <p className="text-sm text-neutral-300 leading-relaxed mb-6">
              {selectedArticle.conclusion}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onNavigateAllTools}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Browse All Directory Tools
              </button>
              <button
                onClick={handleCloseArticle}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-lg text-xs font-medium transition-all"
              >
                View More Guides
              </button>
            </div>
          </section>
        </article>
      ) : (
        /* Guides Hub Overview */
        <div>
          {/* Header */}
          <div className="mb-12 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono tracking-wider uppercase bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Editorial Benchmarks & Comparative Studies</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
              Best AI Tools — In-Depth Buyer Guides
            </h1>
            <p className="text-base sm:text-lg text-neutral-400 max-w-3xl leading-relaxed">
              Cut through marketing hyperbole. Our engineers and research fellows conduct exhaustive multi-week tests to deliver clear, definitive rankings for students, freelancers, coders, and writers.
            </p>
          </div>

          {/* Featured Guides Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {MOCK_GUIDES.map((guide) => (
              <div
                key={guide.id}
                onClick={() => handleOpenArticle(guide)}
                className="group cursor-pointer bg-[#0b0e17] border border-white/10 hover:border-blue-500/50 rounded-2xl p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 text-xs font-mono text-neutral-400 mb-4">
                    <span className="px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold uppercase">
                      {guide.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {guide.readTime}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3 leading-snug">
                    {guide.title}
                  </h3>

                  <p className="text-sm text-neutral-400 line-clamp-3 mb-6 leading-relaxed">
                    {guide.summary}
                  </p>

                  {/* Highlights list preview */}
                  <div className="space-y-2 mb-6">
                    {guide.topPicks.map((pick, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1.5 px-3 rounded bg-white/[0.02] border border-white/5">
                        <span className="text-neutral-300 font-medium">#{i + 1} {pick.name}</span>
                        <span className="text-amber-400 font-mono text-[11px]">{pick.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-neutral-400 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center text-[10px] font-bold">
                      {guide.author.name.charAt(0)}
                    </div>
                    <span>{guide.author.name}</span>
                  </div>

                  <span className="text-xs font-semibold text-blue-400 group-hover:text-blue-300 flex items-center gap-1 group-hover:translate-x-1 transition-all">
                    <span>Read Full Guide</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Category Jump Banner */}
          <div className="p-8 rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0e1220] to-purple-950/30 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Looking for a specific comparison?</h3>
              <p className="text-sm text-neutral-400 max-w-xl">
                Use our side-by-side interactive comparison matrix to benchmark any two AI models or tools on pricing, free tiers, and capabilities.
              </p>
            </div>
            <button
              onClick={onNavigateAllTools}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-blue-500/30 transition-all shrink-0 cursor-pointer"
            >
              Browse 50+ Tools in Directory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
