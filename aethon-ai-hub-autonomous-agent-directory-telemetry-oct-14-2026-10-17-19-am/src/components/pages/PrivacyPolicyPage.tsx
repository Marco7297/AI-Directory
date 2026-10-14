import React from 'react';
import { Lock, Shield, Eye, Database, FileText, CheckCircle } from 'lucide-react';

interface PrivacyPolicyPageProps {
  onNavigateHome: () => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigateHome }) => {
  return (
    <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-left border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-4">
            <Lock className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy Standards</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-sm font-mono text-neutral-400">
            Last Updated & Reviewed: October 2026 • Effective Date: January 1, 2025
          </p>
        </div>

        {/* Introduction */}
        <section className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
          <p>
            At <strong>AI Directory (Zmpto Tool)</strong> ("we", "our", "us"), your privacy is fundamental to our engineering ethics. This Privacy Policy details the types of information we collect when you browse our directory, submit AI tools for review, subscribe to our technical newsletter, or interact with our telemetry dashboards, as well as how that data is protected.
          </p>
          <p>
            We do not sell, rent, or trade your personal data to data brokers or advertising exchanges.
          </p>
        </section>

        {/* Section 1: Information We Collect */}
        <section className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Database className="w-5 h-5 text-blue-400" />
            <span>1. Information We Collect</span>
          </h2>
          <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
            <div>
              <strong className="text-white">A. Information You Voluntarily Provide:</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-neutral-400">
                <li><strong>Newsletter Subscriptions:</strong> Your email address when you sign up for our weekly benchmark briefs.</li>
                <li><strong>Tool Submissions:</strong> Submitter name, corporate contact email, tool details, and website URLs.</li>
                <li><strong>Contact Inquiries:</strong> Your name, email address, and correspondence content submitted via our contact desk.</li>
              </ul>
            </div>

            <div>
              <strong className="text-white">B. Automatically Collected Technical Telemetry:</strong>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-neutral-400">
                <li>Browser type, operating system version, preferred language, and screen resolution.</li>
                <li>Anonymized IP addresses (truncated at ingestion) used solely for regional latency benchmarking and bot defense.</li>
                <li>Page interaction events (such as tool comparisons made or search filters applied) aggregated without persistent identifiers.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: How We Use Your Data */}
        <section className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Eye className="w-5 h-5 text-emerald-400" />
            <span>2. How We Utilize Your Data</span>
          </h2>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>We process collected data exclusively for legitimate operational objectives, including:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-neutral-400">
              <li>Delivering requested editorial newsletters and benchmark updates.</li>
              <li>Communicating with tool founders regarding listing status, review notes, and verification updates.</li>
              <li>Maintaining site security, diagnosing API server latency, and mitigating DDoS attacks.</li>
              <li>Analyzing anonymized directory trends to understand which AI categories need deeper comparative guides.</li>
            </ul>
          </div>
        </section>

        {/* Section 3: Cookies & Tracking Technologies */}
        <section className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-purple-400" />
            <span>3. Cookies & Session Storage</span>
          </h2>
          <div className="space-y-4 text-sm text-neutral-300 leading-relaxed">
            <p>
              We utilize minimal cookies strictly for necessary site functions, such as remembering your local search filter preferences, theme settings, and comparison table selections.
            </p>
            <p>
              When clicking external partner links, third-party affiliate networks may deposit a standard referral tracking cookie on your browser to attribute commissions. These cookies are governed by the respective partner privacy policies.
            </p>
          </div>
        </section>

        {/* Section 4: Your Rights (GDPR & CCPA) */}
        <section className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <CheckCircle className="w-5 h-5 text-amber-400" />
            <span>4. User Rights (GDPR / CCPA / Global)</span>
          </h2>
          <div className="space-y-3 text-sm text-neutral-300 leading-relaxed">
            <p>Regardless of your geographic jurisdiction, you hold the right to:</p>
            <ul className="list-disc pl-6 space-y-1 text-neutral-400">
              <li>Request a copy of any personal data we hold associated with your email address.</li>
              <li>Request immediate deletion or erasure ("Right to be Forgotten") of your records.</li>
              <li>Unsubscribe from all email correspondence with a single click at any time.</li>
            </ul>
            <p className="mt-4">
              To exercise these rights, simply email our data protection officer at <strong className="text-white font-mono">privacy@aidirectory.tool</strong>.
            </p>
          </div>
        </section>

        {/* Section 5: Contact */}
        <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-neutral-400 font-mono">
          <div className="text-white font-bold mb-1">Privacy Officer Contact Information:</div>
          <div>AI Directory (Zmpto Tool) Intelligence Desk • Data Protection & Security Team</div>
          <div>Email: privacy@aidirectory.tool • Response SLA: Within 48 hours</div>
        </section>
      </div>
    </div>
  );
};
