import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Terminal, 
  Cpu, 
  CheckCircle, 
  Users, 
  Lock, 
  Scale, 
  Zap,
  ArrowRight
} from 'lucide-react';
import BrandLogo from '../BrandLogo';

interface AboutPageProps {
  onNavigateAllTools: () => void;
  onNavigateContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateAllTools,
  onNavigateContact
}) => {
  return (
    <div className="w-full max-w-[1520px] mx-auto px-6 sm:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Hero Section */}
        <div className="text-left">
          <div className="flex items-center gap-4 mb-4">
            <BrandLogo size="lg" />
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Independent Verification & Review Charter</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
                About AI Directory (Zmpto Tool)
              </h1>
            </div>
          </div>
          <p className="text-lg text-neutral-300 leading-relaxed font-normal">
            AI Directory (Zmpto Tool) is an independent engineering testing laboratory and review directory dedicated to demystifying generative AI software, foundation models, and autonomous agent swarms. We provide unfiltered technical evaluations, side-by-side performance benchmarks, and transparent buyer guides for over 120,000 monthly engineers, founders, and creative directors.
          </p>
        </div>

        {/* Section 1: Who We Are */}
        <section className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="flex items-center gap-3 text-blue-400 font-mono text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Pillar 01 // Foundation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Who We Are
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
            <p>
              Founded in late 2024 by a cohort of former machine learning researchers, systems architects, and technical editors, AI Directory (Zmpto Tool) was born out of frustration with superficial "top 10 AI tools" listicles flooded with affiliate spam and rehashed press releases.
            </p>
            <p>
              We run our own benchmarking sandboxes. When an AI company announces a breakthrough in coding latency, image generation, or context recall, we do not copy their marketing copy—we spin up test clusters, feed in standardized edge-case prompts, measure token latency down to the millisecond, and test whether their free tier is actually usable for everyday work.
            </p>
            <p>
              Today, our global distributed team operates across San Francisco, London, Berlin, and Tokyo, continuously updating reviews as tools ship new model weights and API versions.
            </p>
          </div>
        </section>

        {/* Section 2: How We Review Tools (5-Pillar Framework) */}
        <section className="bg-[#0b0e17] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl space-y-8">
          <div className="flex items-center gap-3 text-amber-400 font-mono text-xs uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Pillar 02 // Methodology</span>
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              How We Review Tools: The 5-Pillar Framework
            </h2>
            <p className="text-neutral-400 text-sm">
              Every software product and autonomous model indexed in our directory is scored against five rigorous criteria:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-[#121622] border border-white/10">
              <div className="text-blue-400 font-mono text-xs font-bold mb-2">01 // Empirical Output Quality</div>
              <h3 className="text-base font-bold text-white mb-2">Real-World Accuracy & Hallucination Resistance</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We test reasoning capabilities, code syntax validity, and factual citation fidelity under complex multi-step prompts.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#121622] border border-white/10">
              <div className="text-emerald-400 font-mono text-xs font-bold mb-2">02 // Pricing Fairness</div>
              <h3 className="text-base font-bold text-white mb-2">Transparent Plans & Genuine Free Tiers</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We inspect hidden credit drain, token rate limits, and determine whether free tiers offer permanent practical utility or merely bait-and-switch trials.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#121622] border border-white/10">
              <div className="text-purple-400 font-mono text-xs font-bold mb-2">03 // Infrastructure & Speed</div>
              <h3 className="text-base font-bold text-white mb-2">Latency, Throughput & Uptime</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We measure time-to-first-token (TTFT), streaming smoothness, context retention across 100k+ tokens, and uptime reliability during peak global hours.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[#121622] border border-white/10">
              <div className="text-rose-400 font-mono text-xs font-bold mb-2">04 // Data Privacy & IP Safety</div>
              <h3 className="text-base font-bold text-white mb-2">Training Opt-Outs & Enterprise Security</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We audit terms of service to confirm whether customer prompts train foundation models, reviewing SOC 2, HIPAA, and GDPR compliance policies.
              </p>
            </div>

            <div className="md:col-span-2 p-6 rounded-xl bg-[#121622] border border-white/10">
              <div className="text-amber-400 font-mono text-xs font-bold mb-2">05 // Ergonomics & Learning Curve</div>
              <h3 className="text-base font-bold text-white mb-2">Developer Experience & Workflow Integration</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We assess keyboard shortcuts, IDE compatibility, API ergonomics, export formats, and the steepness of onboarding for new teams.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Why People Can Trust Us */}
        <section className="bg-gradient-to-br from-[#0c0f1c] to-[#080a12] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-xl space-y-6">
          <div className="flex items-center gap-3 text-emerald-400 font-mono text-xs uppercase tracking-wider">
            <Scale className="w-4 h-4" />
            <span>Pillar 03 // Integrity</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Why People Can Trust Us
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-neutral-300 leading-relaxed">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
              <div>
                <strong className="text-white">Strict Editorial Firewall: </strong>
                Our commercial partnerships and affiliate relationships are strictly segregated from our review teams. No tool can pay for a higher star rating, a positive editorial quote, or an unearned badge.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
              <div>
                <strong className="text-white">Zero Sponsored Cloaking: </strong>
                If a software maker purchases a sponsored directory placement, it is labeled with a clear "Sponsored" or "Featured" tag. Sponsored tools receive the exact same rigorous pros/cons scrutiny as any other tool.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
              <div>
                <strong className="text-white">Quarterly Dynamic Re-Testing: </strong>
                Because AI software changes rapidly, we conduct quarterly audit passes. When a tool degrades due to model quantization or price increases, we promptly downgrade its score.
              </div>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-[#0e1220] border border-white/10">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Have questions or want to request a benchmark?</h3>
            <p className="text-xs text-neutral-400">Our editorial review desk welcomes community feedback and test submissions.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateContact}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
            >
              Contact Our Reviewers
            </button>
            <button
              onClick={onNavigateAllTools}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
            >
              Browse Directory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
