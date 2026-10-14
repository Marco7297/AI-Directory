import React from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  DollarSign, 
  Lock, 
  Scale, 
  HelpCircle,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

interface AffiliateDisclosurePageProps {
  onNavigateAllTools: () => void;
  onNavigateAbout: () => void;
}

export const AffiliateDisclosurePage: React.FC<AffiliateDisclosurePageProps> = ({
  onNavigateAllTools,
  onNavigateAbout
}) => {
  return (
    <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-mono tracking-wider uppercase bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Radical Transparency & Regulatory Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
            Affiliate & Commercial Disclosure
          </h1>
          <p className="text-lg text-neutral-300 leading-relaxed font-normal">
            Trust is the single most valuable currency in technology journalism. Here is our plain-English policy regarding outbound partner links, how we sustain our testing infrastructure, and why commercial relationships will never influence our editorial ratings.
          </p>
        </div>

        {/* 3 Core Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0b0e17] border border-white/10 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-2">Zero Extra Cost to You</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Clicking an affiliate link does not increase your subscription fee by even one cent. In many instances, our partner links unlock discounted promotional pricing or extended token credits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0e17] border border-white/10 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-2">Strict Editorial Firewall</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Our review writers and benchmark engineers do not receive commission bonuses and have zero visibility into affiliate conversion figures. Our ratings are completely decoupled from revenue.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b0e17] border border-white/10 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-white mb-2">Unbiased Scrutiny</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              If an AI tool is unstable, charges hidden recurring fees, or hallucinates egregiously, we say so plainly—even if that tool offers a generous referral bounty.
            </p>
          </div>
        </div>

        {/* Section: How Commissions Work */}
        <section className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-white">
            How Affiliate Links Function on This Site
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
            <p>
              Throughout AI Directory (Zmpto Tool), you will notice outbound "Visit Site" buttons and review referral links. When you click on one of these buttons and subsequently register an account or purchase a paid subscription, the respective AI software vendor may pay us an affiliate commission.
            </p>
            <p>
              This compensation enables us to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-neutral-300">
              <li>Purchase paid developer tier subscriptions for every tool we benchmark, ensuring our tests are conducted on real customer tiers without preferential vendor treatment.</li>
              <li>Fund cloud GPU compute and dedicated server clusters required to execute thousands of synthetic latency and prompt evaluations.</li>
              <li>Employ professional technical writers and security auditors at competitive wages.</li>
              <li>Keep all directory rankings, guides, and comparison tables 100% free and un-paywalled for the entire community.</li>
            </ul>
          </div>
        </section>

        {/* Section: Does this ever change our ratings? */}
        <section className="bg-gradient-to-br from-[#121626] to-[#0a0d17] border border-blue-500/30 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-blue-400" />
            <span>Does This Ever Change Our Ratings?</span>
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
            <p className="text-lg font-semibold text-white">
              No. Not now, and not ever.
            </p>
            <p>
              Our testing methodology is standardized and reproducible. We routinely recommend free and open-source models (such as Llama 3, DeepSeek, and Ollama) that generate exactly zero revenue for us because they happen to be the superior choice for a given engineering challenge.
            </p>
            <p>
              Conversely, we regularly give mediocre ratings or highlight critical bugs in tools that offer lucrative affiliate programs. If a software company threatens to pull an affiliate partnership because of a critical review, we let them pull it. Our allegiance is exclusively to our readers.
            </p>
          </div>
        </section>

        {/* FTC Compliance Notice */}
        <section className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-xs text-neutral-400 leading-relaxed font-mono">
          <h3 className="text-neutral-300 font-bold uppercase text-[11px] mb-2">FTC 16 CFR § 255 Compliance Notice</h3>
          <p>
            In accordance with the Federal Trade Commission (FTC) guidelines concerning the use of endorsements and testimonials in advertising, please assume that any link directing users outside AI Directory (Zmpto Tool) may be an affiliate link for which we may receive financial compensation. All opinions expressed herein are the genuine, authentic assessments of our technical editorial staff.
          </p>
        </section>

        {/* Back Link */}
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={onNavigateAbout}
            className="text-xs text-blue-400 hover:text-blue-300 font-mono underline"
          >
            ← Read Our 5-Pillar Review Charter
          </button>
          <button
            onClick={onNavigateAllTools}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          >
            Explore All AI Tools
          </button>
        </div>
      </div>
    </div>
  );
};
