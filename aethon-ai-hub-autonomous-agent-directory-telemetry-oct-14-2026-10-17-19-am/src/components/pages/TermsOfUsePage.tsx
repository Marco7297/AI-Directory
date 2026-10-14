import React from 'react';
import { FileText, Scale, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TermsOfUsePageProps {
  onNavigateHome: () => void;
}

export const TermsOfUsePage: React.FC<TermsOfUsePageProps> = ({ onNavigateHome }) => {
  return (
    <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-left border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Service Terms & Operating Governance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Terms of Use
          </h1>
          <p className="text-sm font-mono text-neutral-400">
            Last Updated: October 2026 • Governs all interactions on AI Directory (Zmpto Tool)
          </p>
        </div>

        {/* Introduction */}
        <section className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>
            Please read these Terms of Use ("Terms") thoroughly before accessing or utilizing <strong>AI Directory (Zmpto Tool)</strong> (the "Site", "Platform", or "Services"). By accessing any page, comparison table, review guide, or directory listing on this site, you agree to be bound by these Terms.
          </p>
        </section>

        {/* Section 1: Directory Informational Nature & Disclaimers */}
        <section className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>1. Informational & Benchmark Disclaimer</span>
          </h2>
          <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
            <p>
              The reviews, performance scores, latency metrics, and comparative analyses published on AI Directory (Zmpto Tool) are provided solely for educational, informational, and software discovery purposes.
            </p>
            <p>
              While we undertake meticulous technical testing, generative AI models evolve rapidly. Pricing, token limits, context windows, and model behavior may be modified by respective third-party vendors without notice. We make no warranty that listed pricing or specifications are error-free or perpetually current. Users are encouraged to verify terms directly on vendors' official websites.
            </p>
          </div>
        </section>

        {/* Section 2: Intellectual Property & Third-Party Trademarks */}
        <section className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>2. Intellectual Property & Trademarks</span>
          </h2>
          <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
            <p>
              All proprietary editorial reviews, benchmark methodologies, bespoke charts, and directory taxonomy on AI Directory (Zmpto Tool) are the copyrighted intellectual property of AI Directory (Zmpto Tool). You may not scrape, republish, or syndicate our written reviews in bulk without prior written authorization.
            </p>
            <p>
              All third-party product names, logos, registered trademarks, and brand identifiers (such as Anthropic Claude, OpenAI ChatGPT, Cursor, Midjourney, etc.) referenced on this site belong exclusively to their respective owners. Their inclusion does not imply official endorsement, sponsorship, or affiliation with AI Directory (Zmpto Tool) unless expressly designated.
            </p>
          </div>
        </section>

        {/* Section 3: User Submissions & Developer Obligations */}
        <section className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-purple-400" />
            <span>3. Tool Submissions & Review Rights</span>
          </h2>
          <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
            <p>
              When developers or founders submit software products to our review desk:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-neutral-400">
              <li>You warrant that you hold the legal authority or authorization to submit the product and upload its brand assets.</li>
              <li>You grant AI Directory (Zmpto Tool) a perpetual, worldwide, non-exclusive license to display the product name, logo, screenshots, and technical specs within our directory.</li>
              <li>You understand and accept that submitting a tool does not guarantee an endorsement. Our editorial review team retains sole discretion over star ratings, commentary, pros, and cons.</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Limitation of Liability */}
        <section className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span>4. Limitation of Liability</span>
          </h2>
          <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
            <p>
              To the fullest extent permitted under applicable law, AI Directory (Zmpto Tool) and its operators shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your reliance on reviews, software outages of third-party tools, subscription purchases made through external sites, or implementation decisions.
            </p>
          </div>
        </section>

        {/* Section 5: Governing Law & Updates */}
        <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-neutral-400 font-mono">
          <div className="text-white font-bold mb-1">Governing Law & Inquiries:</div>
          <div>These terms are governed by applicable federal and corporate law. Questions regarding these Terms may be directed to <strong className="text-white">legal@aidirectory.tool</strong>.</div>
        </section>
      </div>
    </div>
  );
};
