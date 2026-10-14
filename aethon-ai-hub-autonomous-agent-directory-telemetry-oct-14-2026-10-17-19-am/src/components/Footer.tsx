import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle, 
  ShieldCheck, 
  Scale, 
  Mail, 
  Terminal, 
  Layers, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PageRoute, ToolCategory } from '../types';
import BrandLogo from './BrandLogo';

interface FooterProps {
  onNavigate: (route: PageRoute, categoryOrId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setSubscribed(true);
  };

  return (
    <footer className="w-full bg-[#05060a] border-t border-white/10 text-neutral-300 relative z-20">
      {/* Newsletter Signup Banner (Explicit User Brief Requirement) */}
      <div className="border-b border-white/10 bg-gradient-to-b from-[#090b12] to-[#05060a]">
        <div className="max-w-[1520px] mx-auto px-6 sm:px-10 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded text-[11px] font-mono tracking-wider uppercase bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Weekly Intelligence Briefing</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Join 48,000+ Engineers & Technical Leaders
              </h3>
              <p className="text-sm text-neutral-400 max-w-xl leading-relaxed">
                Receive our weekly verified AI benchmark reports, hidden prompt techniques, token latency breakdowns, and early access to newly indexed autonomous tools. Zero marketing fluff.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Transmission Confirmed!</div>
                    <div>Check your inbox for this week’s frontier model benchmark report.</div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      placeholder="Enter work or developer email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 bg-[#101420] border border-white/15 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-[0_0_16px_rgba(59,130,246,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
                    >
                      <span>Subscribe Free</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {errorMsg && <p className="text-[11px] text-rose-400 font-mono">{errorMsg}</p>}
                  <p className="text-[11px] font-mono text-neutral-500">
                    No spam ever. Unsubscribe with 1 click anytime. Strictly technical telemetry.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links Columns */}
      <div className="max-w-[1520px] mx-auto px-6 sm:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {/* Brand & Wordmark Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo size="sm" />
              <div className="flex flex-col">
                <span
                  onClick={() => onNavigate('home')}
                  className="text-lg font-black tracking-[0.16em] text-white uppercase cursor-pointer hover:text-blue-400 transition-colors font-mono leading-tight"
                >
                  AI DIRECTORY
                </span>
                <span className="text-[9px] font-mono tracking-[0.18em] text-blue-400 uppercase font-semibold leading-tight">
                  ZMPTO TOOL
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase px-2 py-0.5 border border-white/10 rounded-full">
                VERIFIED
              </span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              The premier intelligence platform and directory for evaluating generative artificial intelligence, foundation models, and autonomous swarms with reproducible benchmarks.
            </p>

            <div className="pt-2 text-[11px] font-mono text-neutral-400 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Telemetry Nodes Active • 100% Independent</span>
            </div>
          </div>

          {/* Column 1: Navigation & Hub */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Directory & Hub
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Home (Telemetry Hero)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('all-tools')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  All Tools Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('best-ai-tools')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Best AI Tools Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('compare')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Compare Tools Side-by-Side
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('submit-tool')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Submit Your Tool
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Popular Categories */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Categories
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              {(['Coding', 'Writing', 'Design & Video', 'Research & Data', 'Productivity', 'Audio & Voice'] as ToolCategory[]).map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => onNavigate('category', cat)}
                    className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                  >
                    {cat} Tools
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Trust, Contact & Legal Pages (All legal pages in footer) */}
          <div className="space-y-3">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Trust & Legal
            </div>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  About & Review Process
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left text-blue-400 font-medium"
                >
                  Contact Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('affiliate-disclosure')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy-policy')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms-of-use')}
                  className="hover:text-blue-400 transition-colors cursor-pointer text-left"
                >
                  Terms of Use
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Summary Banner */}
        <div className="mt-12 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-neutral-400 leading-relaxed font-mono">
          <strong className="text-neutral-300">Affiliate Notice: </strong>
          Some outbound links on AI Directory (Zmpto Tool) are affiliate links. If you click through and purchase a paid plan, we may earn an affiliate commission at zero extra cost to you. This commercial relationship never influences our editorial ratings, benchmark scores, or pros and cons.
        </div>

        {/* Copyright Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-400">
          <div>
            © {new Date().getFullYear()} AI Directory (Zmpto Tool). Autonomous Agent & AI Tools Hub. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('affiliate-disclosure')}
              className="hover:text-white transition-colors"
            >
              Affiliate Policy
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('privacy-policy')}
              className="hover:text-white transition-colors"
            >
              Privacy
            </button>
            <span>•</span>
            <button
              onClick={() => onNavigate('terms-of-use')}
              className="hover:text-white transition-colors"
            >
              Terms
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
