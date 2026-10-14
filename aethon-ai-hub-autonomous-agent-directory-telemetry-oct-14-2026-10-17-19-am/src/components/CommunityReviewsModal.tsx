import React, { useState } from 'react';
import { X, Star, ThumbsUp, CheckCircle, MessageSquarePlus, ShieldCheck } from 'lucide-react';
import { AgentReview } from '../types';
import { MOCK_REVIEWS, MOCK_AGENTS } from '../data/mockAgents';
import { AgentLogo } from './AgentLogo';

interface CommunityReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityReviewsModal: React.FC<CommunityReviewsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [reviews, setReviews] = useState<AgentReview[]>(MOCK_REVIEWS);
  const [upvotedIds, setUpvotedIds] = useState<Set<string>>(new Set());
  const [showSubmitForm, setShowSubmitForm] = useState(false);

  // Form State
  const [selectedAgentId, setSelectedAgentId] = useState(MOCK_AGENTS[0].id);
  const [rating, setRating] = useState(5);
  const [authorName, setAuthorName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpvote = (id: string) => {
    if (upvotedIds.has(id)) {
      setUpvotedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes - 1 } : r))
      );
    } else {
      setUpvotedIds((prev) => new Set(prev).add(id));
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
      );
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !headline.trim() || !content.trim()) return;

    const targetAgent = MOCK_AGENTS.find((a) => a.id === selectedAgentId) || MOCK_AGENTS[0];

    const newReview: AgentReview = {
      id: `rev-${Date.now()}`,
      agentId: targetAgent.id,
      agentName: targetAgent.name,
      author: authorName,
      role: role || 'Software Engineer',
      company: company || 'Autonomous Labs',
      rating,
      headline,
      content,
      date: 'Just now',
      verifiedDeployment: true,
      upvotes: 1,
    };

    setReviews([newReview, ...reviews]);
    setShowSubmitForm(false);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 4000);

    // Reset form
    setAuthorName('');
    setRole('');
    setCompany('');
    setHeadline('');
    setContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0d14] border border-white/10 rounded-lg shadow-2xl flex flex-col overflow-hidden text-neutral-200"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-[#0e1018]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <div>
              <h2 
                className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white"
                style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
              >
                AI HUB // COMMUNITY REVIEWS
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 font-mono">
                Peer-reviewed benchmark results and production evaluations from senior AI engineers
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

        {/* Aggregate Ratings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 p-6 gap-4 border-b border-white/10 bg-[#090a10]">
          <div className="space-y-1">
            <div className="text-3xl font-extrabold text-white font-mono flex items-center gap-2">
              <span>4.92</span>
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <div className="text-xs text-neutral-400 font-mono">
              Consensus Score (12,410+ reviews)
            </div>
          </div>

          <div className="space-y-1 text-xs font-mono">
            <div className="text-neutral-400 flex justify-between">
              <span>Execution Reliability</span>
              <span className="text-white font-semibold">99.8%</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[99.8%]" />
            </div>
          </div>

          <div className="space-y-1 text-xs font-mono">
            <div className="text-neutral-400 flex justify-between">
              <span>Zero-Hallucination Rigor</span>
              <span className="text-white font-semibold">98.4%</span>
            </div>
            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full w-[98.4%]" />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => setShowSubmitForm(!showSubmitForm)}
              className="w-full md:w-auto px-4 py-2 text-xs font-mono font-medium text-blue-300 hover:text-white border border-blue-500 bg-transparent hover:bg-blue-600/20 transition-colors flex items-center justify-center gap-1.5 rounded cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{showSubmitForm ? 'Hide Form' : 'Write Review'}</span>
            </button>
          </div>
        </div>

        {submitSuccess && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/40 border border-emerald-700/50 rounded flex items-center gap-2 text-xs text-emerald-300 font-mono">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Thank you! Your production evaluation has been verified and added to the consensus ledger.</span>
          </div>
        )}

        {/* Submit Review Collapsible Form */}
        {showSubmitForm && (
          <form onSubmit={handleSubmitReview} className="p-6 border-b border-white/10 bg-[#08090f] space-y-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-white font-mono">
              Submit Production Evaluation
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
              <div>
                <label className="block text-neutral-400 mb-1">Target Agent</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full p-2 bg-white/[0.04] border border-white/10 text-white rounded focus:outline-none focus:border-blue-500"
                >
                  {MOCK_AGENTS.map((a) => (
                    <option key={a.id} value={a.id} className="bg-neutral-900">
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full p-2 bg-white/[0.04] border border-white/10 text-white rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1">Role & Organization</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Staff Engineer @ Synthetix"
                  className="w-full p-2 bg-white/[0.04] border border-white/10 text-white rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-neutral-400">Score:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-neutral-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Headline summary (e.g., Flawless multi-repo refactoring across 300 modules)"
                className="w-full p-2 bg-white/[0.04] border border-white/10 text-white rounded focus:outline-none focus:border-blue-500"
              />
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Describe your production deployment findings, token economics, latency stability, and multi-step accuracy..."
                className="w-full p-2 bg-white/[0.04] border border-white/10 text-white rounded focus:outline-none focus:border-blue-500 resize-none font-sans text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 text-xs font-mono">
              <button
                type="button"
                onClick={() => setShowSubmitForm(false)}
                className="px-3 py-1.5 text-neutral-400 hover:text-white border border-white/10"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium"
              >
                Publish Review
              </button>
            </div>
          </form>
        )}

        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-white/[0.06]">
          {reviews.map((rev) => (
            <div key={rev.id} className="pt-6 first:pt-0 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <AgentLogo agentId={rev.agentId} size="sm" showStatusDot={false} className="mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white font-semibold text-sm">
                        {rev.headline}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mt-1">
                      <span className="text-blue-400 font-medium">[{rev.agentName}]</span>
                      <span>·</span>
                      <span className="text-neutral-300">{rev.author}</span>
                      <span>·</span>
                      <span>{rev.role} {rev.company && `at ${rev.company}`}</span>
                      {rev.verifiedDeployment && (
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 border border-emerald-800/40">
                          <ShieldCheck className="w-3 h-3" />
                          Verified Production
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleUpvote(rev.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono border rounded transition-colors ${
                    upvotedIds.has(rev.id)
                      ? 'border-blue-500 text-blue-400 bg-blue-950/30'
                      : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                  }`}
                  title="Upvote verified review"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>{rev.upvotes}</span>
                </button>
              </div>

              <p className="text-xs text-neutral-300 leading-relaxed pl-0.5">
                {rev.content}
              </p>

              <div className="text-[11px] text-neutral-500 font-mono">
                Evaluated {rev.date}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#0a0b10] flex items-center justify-between text-xs font-mono text-neutral-500">
          <div>Community reviews verified through cryptographic deployment proofs</div>
          <div className="text-neutral-400">Total verified reviews: {reviews.length}</div>
        </div>
      </div>
    </div>
  );
};
