import React, { useState } from 'react';
import { 
  Send, 
  Upload, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  AlertCircle,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ToolCategory, ToolPricing } from '../../types';

interface SubmitToolPageProps {
  onNavigateHome: () => void;
  onNavigateAllTools: () => void;
}

export const SubmitToolPage: React.FC<SubmitToolPageProps> = ({
  onNavigateHome,
  onNavigateAllTools
}) => {
  const [formData, setFormData] = useState({
    toolName: '',
    websiteUrl: '',
    category: 'Coding' as ToolCategory,
    pricingModel: 'Freemium' as ToolPricing | 'Open Source',
    tagline: '',
    description: '',
    logoUrl: '',
    contactEmail: '',
    founderName: '',
    requestSponsored: false
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Logo file must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result as string);
        setFormData({ ...formData, logoUrl: reader.result as string });
        setErrorMsg('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.toolName || !formData.websiteUrl || !formData.description || !formData.contactEmail) {
      setErrorMsg('Please complete all required fields.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    // Simulate submission to review queue
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-4">
            <Upload className="w-3.5 h-3.5" />
            <span>Developer Directory Submissions & Editorial Review</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Submit Your AI Tool
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 leading-relaxed">
            Get your AI software or autonomous agent indexed in front of 120,000+ monthly software engineers, technical founders, and enterprise technology buyers. Every submitted tool undergoes hands-on editorial verification.
          </p>
        </div>

        {isSubmitted ? (
          /* Confirmation Success State */
          <div className="bg-[#0b0e17] border border-emerald-500/40 rounded-2xl p-10 text-center shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 border border-emerald-500/40">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Submission Received for Review!
            </h2>
            <p className="text-neutral-300 max-w-lg mx-auto mb-6 text-sm leading-relaxed">
              Thank you for submitting <strong>{formData.toolName}</strong>. Our editorial team will review your tool, test your API or web application, and notify you at <strong>{formData.contactEmail}</strong>.
            </p>

            {formData.requestSponsored ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 max-w-md mx-auto mb-8 text-xs text-amber-200">
                <strong>Featured Sponsorship Ingested:</strong> An editorial account executive will reach out within 24 hours with fast-track placement details.
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30 max-w-md mx-auto mb-8 text-xs text-blue-300">
                Standard editorial review turnaround is approximately 3 to 5 business days.
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    toolName: '',
                    websiteUrl: '',
                    category: 'Coding',
                    pricingModel: 'Freemium',
                    tagline: '',
                    description: '',
                    logoUrl: '',
                    contactEmail: '',
                    founderName: '',
                    requestSponsored: false
                  });
                  setLogoPreview(null);
                }}
                className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-200 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Submit Another Tool
              </button>
              <button
                onClick={onNavigateAllTools}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Explore Directory
              </button>
            </div>
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Basic Tool Information */}
            <div className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <Layers className="w-5 h-5 text-blue-400" />
                <span>1. Core Tool Details</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                    Tool Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Synthetix AI, PromptLayer"
                    value={formData.toolName}
                    onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
                    className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                    Official Website URL <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://yourtool.com"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                    Primary Category <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ToolCategory })}
                    className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Coding">Coding & Developer Tools</option>
                    <option value="Writing">Writing & Copywriting</option>
                    <option value="Design & Video">Design & Generative Video</option>
                    <option value="Research & Data">Research, Citations & Data</option>
                    <option value="Productivity">Productivity & Task Automation</option>
                    <option value="Audio & Voice">Audio, Voice & Music</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                    Pricing Model <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.pricingModel}
                    onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as any })}
                    className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Free">100% Free / Non-Commercial</option>
                    <option value="Freemium">Freemium (Free tier + Paid plans)</option>
                    <option value="Paid">Paid Only (Paid subscription or usage tokens)</option>
                    <option value="Open Source">Open Source (Self-hostable)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                  Short Tagline (One sentence summary)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autonomous multi-file code editor built on frontier reasoning models"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                  Comprehensive Description & Primary Capabilities <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe what problem your tool solves, who its ideal users are, what models or algorithms power it, and what sets it apart from alternatives..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>
            </div>

            {/* Logo Upload Section */}
            <div className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <Upload className="w-5 h-5 text-blue-400" />
                <span>2. Brand Assets & Logo</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                    Upload Logo Icon (Square PNG, SVG, or WebP)
                  </label>
                  <label className="border-2 border-dashed border-white/20 hover:border-blue-500/60 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-white/[0.01] hover:bg-blue-500/5">
                    <Upload className="w-6 h-6 text-neutral-400 mb-2" />
                    <span className="text-xs text-neutral-300 font-medium">Click to upload file</span>
                    <span className="text-[11px] text-neutral-500 mt-1">Recommended size: 512x512px (Max 2MB)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-[#121622] border border-white/10">
                  <span className="text-xs font-mono uppercase text-neutral-400 mb-3">Logo Preview</span>
                  {logoPreview ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/20 shadow-lg flex items-center justify-center bg-black/40">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/15">
                      {formData.toolName ? formData.toolName.slice(0, 2).toUpperCase() : 'AI'}
                    </div>
                  )}
                  <span className="text-[11px] text-neutral-500 mt-3 font-mono">
                    {formData.toolName || 'Tool Name Placeholder'}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact & Submitter Information */}
            <div className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 shadow-xl space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <span>3. Contact & Ownership Verification</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                    Founder / Submitter Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Mercer"
                    value={formData.founderName}
                    onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                    className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-neutral-300 mb-2">
                    Official Contact Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="founder@yourcompany.com"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                    className="w-full bg-[#121622] border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Note About Featured / Sponsored Listings (Mandatory brief requirement) */}
            <div className="bg-gradient-to-br from-[#12172a] to-[#0d101d] border border-amber-500/30 rounded-2xl p-8 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    Note on Featured & Sponsored Listings
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-4">
                    All tools are eligible for standard, free editorial review (3-5 days turnaround). If you would like to expedite your listing or unlock high-visibility promotional placement, check the box below:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                      <div className="text-amber-300 font-bold mb-1">⚡ 24h Review</div>
                      <div className="text-neutral-400 text-[11px]">Guaranteed technical review turnaround within 24 hours.</div>
                    </div>
                    <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                      <div className="text-blue-300 font-bold mb-1">🏆 Top Placement</div>
                      <div className="text-neutral-400 text-[11px]">Pinned featured position on Category and All Tools search.</div>
                    </div>
                    <div className="p-3 rounded-lg bg-black/30 border border-white/10">
                      <div className="text-emerald-300 font-bold mb-1">📬 Newsletter</div>
                      <div className="text-neutral-400 text-[11px]">Dedicated feature slot sent to 48,000+ AI practitioners.</div>
                    </div>
                  </div>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/15 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.requestSponsored}
                      onChange={(e) => setFormData({ ...formData, requestSponsored: e.target.checked })}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-700"
                    />
                    <span className="text-xs font-semibold text-white">
                      Yes, contact me with details for Featured / Sponsored listing packages.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="text-xs text-neutral-400 font-mono">
                By submitting, you agree to our editorial review terms and guidelines.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Submitting Tool to Review Queue...</span>
                ) : (
                  <>
                    <span>Submit Tool for Verification</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
