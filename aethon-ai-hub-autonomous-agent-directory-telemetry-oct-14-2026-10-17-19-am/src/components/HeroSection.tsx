import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Search, 
  ArrowRight, 
  ArrowUp,
  ArrowDown,
  Activity, 
  Star, 
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Compass, 
  ShieldCheck, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Film, 
  Image as ImageIcon,
  Cpu,
  Zap,
  Radio,
  Sliders,
  CheckCircle2,
  Layers,
  Sparkles,
  ArrowLeftRight,
  Flame,
  Trophy,
  ExternalLink,
  TrendingUp,
  Check
} from 'lucide-react';
import { getLenis, smoothScrollTo } from '../utils/scrollManager';
import { MOCK_AGENTS } from '../data/mockAgents';
import { MOCK_TOOLS } from '../data/mockTools';
import { PageRoute } from '../types';
import { AgentLogo } from './AgentLogo';
import { ToolLogo } from './ToolLogo';
import BrandLogo from './BrandLogo';
import { reportAppError } from '../utils/errorReporting';
import suitImageUrl from '../assets/images/ai_agent_bust_1791549653261.jpg';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  onOpenDirectory: () => void;
  onOpenTelemetry: () => void;
  onOpenReviews: () => void;
  onOpenNoomoLabs?: () => void;
  onExploreClick?: () => void;
  onSelectTool?: (toolId: string) => void;
  onCompareTools?: (toolAId?: string, toolBId?: string) => void;
  onNavigate?: (route: PageRoute) => void;
  isDirectoryOpen?: boolean;
  isTelemetryOpen?: boolean;
  isReviewsOpen?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDirectory,
  onOpenTelemetry,
  onOpenReviews,
  onOpenNoomoLabs,
  onExploreClick,
  onSelectTool,
  onCompareTools,
  onNavigate,
  isDirectoryOpen = false,
  isTelemetryOpen = false,
  isReviewsOpen = false,
}) => {
  const [displayWord, setDisplayWord] = useState<'AI HUB' | 'FUTURE'>('AI HUB');
  const [heroSearchInput, setHeroSearchInput] = useState<string>('');
  const [bgMode, setBgMode] = useState<'video' | 'suit-render'>('video');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const pinViewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Original uncompressed Cloudinary video URL (Native 100% video stream)
  const videoUrl = "https://res.cloudinary.com/nujogfxk/video/upload/v1791521083/Robot_wearing_suit_adjusts_position_20261009100234.mp4";
  
  // High-fidelity background render of the uploaded Cyberpunk Android in a Tailored Suit

  // Safe initial autoplay initialization
  useEffect(() => {
    if (videoRef.current && bgMode === 'video') {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      videoRef.current.play().then(() => setIsPlaying(true)).catch((error: unknown) => {
        setIsPlaying(false);
        if (!(error instanceof DOMException && error.name === 'NotAllowedError')) {
          reportAppError('Hero video playback', error);
        }
      });
    }
  }, [bgMode]);

  // GSAP + Lenis Up-To-Down Vertical Scroll Pin & Scrub Timeline
  useEffect(() => {
    if (!containerRef.current || !trackRef.current || !pinViewportRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          id: 'hero-vertical-scroll',
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.2}`,
          pin: pinViewportRef.current,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.33) {
              setActiveSlideIndex(0);
            } else if (p < 0.68) {
              setActiveSlideIndex(1);
            } else {
              setActiveSlideIndex(2);
            }
          },
        },
      });

      // Up-to-down vertical scroll animation: translates vertical track smoothly up as user scrolls down
      tl.to(trackRef.current, {
        y: () => {
          if (!trackRef.current) return 0;
          return -(trackRef.current.scrollHeight - window.innerHeight);
        },
        ease: 'none',
      });

      // Subtle vertical cinematic parallax on the background video / render
      if (videoRef.current) {
        tl.to(videoRef.current, {
          scale: 1.08,
          yPercent: -5,
          ease: 'none',
        }, 0);
      }
    }, containerRef);

    // Refresh ScrollTrigger after font & layout render
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 200);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch((error: unknown) => {
          setIsPlaying(false);
          if (!(error instanceof DOMException && error.name === 'NotAllowedError')) {
            reportAppError('Hero video playback', error);
          }
        });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  // Smooth jump to any slide vertically via Lenis / GSAP ScrollTrigger
  const goToSlide = (slideIndex: number) => {
    const trigger = ScrollTrigger.getById('hero-vertical-scroll');
    if (trigger) {
      const start = trigger.start;
      const end = trigger.end;
      const targetScroll = start + (slideIndex / 2) * (end - start);
      smoothScrollTo(targetScroll, { duration: 1.1 });
    } else if (containerRef.current) {
      const start = containerRef.current.offsetTop;
      const targetScroll = start + (slideIndex / 2) * (window.innerHeight * 2.2);
      smoothScrollTo(targetScroll, { duration: 1.1 });
    }
  };

  const handleExplore = () => {
    onExploreClick?.();
    const exploreEl = document.getElementById('explore-section');
    if (exploreEl) {
      smoothScrollTo(exploreEl, { offset: -20, duration: 1.4 });
    }
  };

  return (
    <div 
      id="hero-section"
      ref={containerRef}
      className="relative w-full bg-[#050608] select-none"
      style={{ height: '320vh' }}
    >
      {/* Pinned Viewport Container (Locked to screen during GSAP up-to-down vertical scroll) */}
      <div 
        ref={pinViewportRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between"
      >
        {/* 
          1. BACKGROUND MEDIA LAYER:
          Plays continuously, smoothly, and in full background without cursor distortion.
          Supports both Native HD Video and the 8K Android Suit Render!
        */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {bgMode === 'video' ? (
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              onError={() => reportAppError(
                'External hero video',
                new Error(videoRef.current?.error?.message || 'The hero video could not be loaded.')
              )}
              className="w-full h-full object-cover object-center will-change-transform"
            />
          ) : (
            <img
              src={suitImageUrl}
              alt="Cyberpunk Android in a Tailored Suit"
              className="w-full h-full object-cover object-center transition-opacity duration-500"
              onError={() => reportAppError('Hero background image', new Error('The hero background image could not be loaded.'))}
            />
          )}

          {/* Lightweight translucent contrast scrim: preserves original video clarity while ensuring text legibility */}
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          
          {/* Subtle radial cinematic gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(5,6,8,0.75)_100%)] pointer-events-none" />
        </div>

        {/* 2. Architectural Vertical Hairline Grid Guides */}
        <div className="absolute inset-0 pointer-events-none z-10 flex justify-between max-w-[1520px] mx-auto px-6 sm:px-10">
          <div className="w-px h-full bg-white/[0.04]" />
          <div className="w-px h-full bg-white/[0.04] hidden md:block" />
          <div className="w-px h-full bg-white/[0.04]" />
          <div className="w-px h-full bg-white/[0.04] hidden lg:block" />
          <div className="w-px h-full bg-white/[0.04]" />
        </div>

        {/* 3. Left Edge Vertical Index Rail: Border only, transparent background with active glowing dot */}
        <div className="hidden xl:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col items-center gap-4 z-30">
          <div className="w-1 h-8 border border-blue-500 bg-transparent rounded-full shadow-[0_0_12px_rgba(59,130,246,0.6)]" />
          <button 
            onClick={() => goToSlide(0)}
            className={`w-1.5 h-3 border rounded-full transition-all cursor-pointer ${
              activeSlideIndex === 0 
                ? 'border-blue-400 bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.9)] h-5' 
                : 'border-white/30 hover:border-white/60'
            }`} 
            title="Slide 01: Overview"
          />
          <button 
            onClick={() => goToSlide(1)}
            className={`w-1.5 h-3 border rounded-full transition-all cursor-pointer ${
              activeSlideIndex === 1 
                ? 'border-blue-400 bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.9)] h-5' 
                : 'border-white/30 hover:border-white/60'
            }`} 
            title="Slide 02: Neural Specs"
          />
          <button 
            onClick={() => goToSlide(2)}
            className={`w-1.5 h-3 border rounded-full transition-all cursor-pointer ${
              activeSlideIndex === 2 
                ? 'border-blue-400 bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.9)] h-5' 
                : 'border-white/30 hover:border-white/60'
            }`} 
            title="Slide 03: Swarm Lab"
          />
          <span className="text-[9px] font-mono tracking-widest text-neutral-300 uppercase [writing-mode:vertical-rl] mt-4">
            STAGE // 0{activeSlideIndex + 1}
          </span>
        </div>

        {/* 4. Right Edge Channel Index Rail: Border only, transparent background with active glow */}
        <div className="hidden xl:flex absolute right-6 top-1/2 -translate-y-1/2 flex-col items-center gap-7 z-30 text-[10px] font-mono tracking-[0.25em]">
          <button
            onClick={onOpenDirectory}
            className={`uppercase cursor-pointer transition-all duration-300 ${
              isDirectoryOpen
                ? 'text-blue-400 font-bold drop-shadow-[0_0_10px_rgba(59,130,246,0.9)] scale-110'
                : 'text-neutral-300 hover:text-blue-400'
            }`}
            title="Toggle Directory"
          >
            DIR
          </button>
          <button
            onClick={onOpenTelemetry}
            className={`uppercase cursor-pointer transition-all duration-300 ${
              isTelemetryOpen
                ? 'text-blue-400 font-bold drop-shadow-[0_0_10px_rgba(59,130,246,0.9)] scale-110'
                : 'text-neutral-300 hover:text-blue-400'
            }`}
            title="Toggle Telemetry HUD"
          >
            HUD
          </button>
          <button
            onClick={onOpenReviews}
            className={`uppercase cursor-pointer transition-all duration-300 ${
              isReviewsOpen
                ? 'text-amber-400 font-bold drop-shadow-[0_0_10px_rgba(245,158,11,0.9)] scale-110'
                : 'text-neutral-300 hover:text-blue-400'
            }`}
            title="Toggle Community Reviews"
          >
            REV
          </button>
          <button
            onClick={handleExplore}
            className="text-neutral-300 hover:text-blue-400 transition-colors uppercase cursor-pointer"
          >
            CAT
          </button>
          <div className="w-px h-8 bg-white/20 mt-2" />
          <span className="text-[9px] text-neutral-400 font-mono tracking-widest [writing-mode:vertical-rl]">
            v4.2.0
          </span>
        </div>

        {/* 
          VERTICAL UP-TO-DOWN SCROLL TRACK:
          3 Full-Height Panels translating vertically up/down with GSAP ScrollTrigger & Lenis
        */}
        <div 
          ref={trackRef}
          className="relative z-20 flex flex-col w-full h-[300vh] will-change-transform"
        >
          {/* ========================================================= */}
          {/* SLIDE 1: PRIMARY OVERVIEW (Signature Wordmark & HUD)       */}
          {/* ========================================================= */}
          <div className="w-full h-screen shrink-0 flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-16 sm:pt-20 pb-24 overflow-y-auto lg:overflow-y-visible">
            
            {/* Top Split: Left Content Lockup vs Right Floating Live Spotlight */}
            <div className="grid grid-cols-1 gap-8 lg:gap-8 items-center flex-1 max-w-[1520px] w-full mx-auto">
              
              {/* Left Column: Clean border-only text, magnetic copy, fast search */}
              <div className="flex flex-col justify-center space-y-5 pt-2 lg:pt-0">
                
                {/* System Status: Clean border only, NO background */}
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1.5 border border-white/25 bg-white/[0.03] text-[10px] font-mono tracking-[0.2em] text-white uppercase rounded-full">
                    <BrandLogo size="xs" withGlow={false} withRing={false} />
                    <span>AI DIRECTORY // ZMPTO TOOL · BENCHMARK PORTAL</span>
                  </div>
                  <span className="text-neutral-400 text-xs font-mono">·</span>
                  <span className="text-[10px] font-mono tracking-widest text-emerald-400 flex items-center gap-1 border border-emerald-500/40 px-3 py-1 rounded-full bg-emerald-500/10">
                    VERIFIED INDEX (2026)
                  </span>
                </div>

                {/* Signature Accent: NO BACKGROUND ON TEXT, ONLY BORDER */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span 
                      className="px-3.5 py-1 text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-blue-400 border border-blue-500 bg-blue-500/10 uppercase font-mono rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)] flex items-center gap-1.5"
                    >
                      <Flame className="w-3 h-3 text-amber-400" />
                      <span>#1 AI DIRECTORY & BENCHMARK ARENA</span>
                    </span>
                  </div>

                  {/* MASSIVE TITANIUM TYPOGRAPHY */}
                  <h1 
                    className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-[0.08em] uppercase leading-[1.05] text-white drop-shadow-md select-text"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    THE BEST AGENTS <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
                      FOR EVERY WORK
                    </span>
                  </h1>
                </div>

                {/* Subtitle Paragraph */}
                <p className="text-sm sm:text-base text-neutral-200 font-sans leading-relaxed max-w-lg font-normal">
                  Stop guessing which AI tool is worth your subscription. Compare verified benchmarks, real latency telemetry, and 12,400+ independent developer reviews across 500+ top tools.
                </p>

                {/* Fast Search & Hot Prompts Box */}
                <div className="space-y-2 max-w-lg">
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      onOpenDirectory();
                    }}
                    className="relative flex items-center group"
                  >
                    <Search className="absolute left-4 w-4 h-4 text-neutral-400 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="text"
                      value={heroSearchInput}
                      onChange={(e) => setHeroSearchInput(e.target.value)}
                      placeholder="Search Claude, Cursor, o1, Midjourney, Perplexity..."
                      className="w-full pl-11 pr-28 py-3 bg-black/60 hover:bg-black/70 focus:bg-black/90 border border-white/20 focus:border-blue-400 rounded-2xl text-xs sm:text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-400 font-mono transition-all backdrop-blur-md"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(59,130,246,0.5)] cursor-pointer"
                    >
                      SEARCH →
                    </button>
                  </form>

                  {/* Hot Query Suggestions */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                    <span className="text-neutral-400 uppercase tracking-wider">TRENDING:</span>
                    <button
                      type="button"
                      onClick={() => onSelectTool ? onSelectTool('claude-ai') : onOpenDirectory()}
                      className="px-2.5 py-1 rounded-full border border-white/15 hover:border-amber-400 bg-white/[0.03] text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ToolLogo toolId="claude-ai" size="xs" />
                      <span>Claude 3.5</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectTool ? onSelectTool('chatgpt-plus') : onOpenDirectory()}
                      className="px-2.5 py-1 rounded-full border border-white/15 hover:border-emerald-400 bg-white/[0.03] text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ToolLogo toolId="chatgpt-plus" size="xs" />
                      <span>ChatGPT / o1</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectTool ? onSelectTool('deepseek-r1') : onOpenDirectory()}
                      className="px-2.5 py-1 rounded-full border border-white/15 hover:border-blue-400 bg-white/[0.03] text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ToolLogo toolId="deepseek-r1" size="xs" />
                      <span>DeepSeek-R1</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectTool ? onSelectTool('gemini-advanced') : onOpenDirectory()}
                      className="px-2.5 py-1 rounded-full border border-white/15 hover:border-blue-400 bg-white/[0.03] text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ToolLogo toolId="gemini-advanced" size="xs" />
                      <span>Gemini Pro</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectTool ? onSelectTool('meta-llama-3') : onOpenDirectory()}
                      className="px-2.5 py-1 rounded-full border border-white/15 hover:border-blue-500 bg-white/[0.03] text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ToolLogo toolId="meta-llama-3" size="xs" />
                      <span>Llama 3.3</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectTool ? onSelectTool('cursor-ai') : onOpenDirectory()}
                      className="px-2.5 py-1 rounded-full border border-white/15 hover:border-blue-400 bg-white/[0.03] text-neutral-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <ToolLogo toolId="cursor-ai" size="xs" />
                      <span>Cursor</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Action Hub Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  {/* Explore Directory Trigger with glowing border on active */}
                  <button
                    onClick={onOpenDirectory}
                    className={`group relative px-5 py-3 border font-mono text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer rounded-2xl ${
                      isDirectoryOpen
                        ? 'border-blue-400 bg-blue-500/20 shadow-[0_0_25px_rgba(59,130,246,0.6),inset_0_0_15px_rgba(59,130,246,0.2)] text-white ring-1 ring-blue-400/60 font-semibold'
                        : 'border-white/30 hover:border-blue-400 bg-transparent text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]'
                    }`}
                  >
                    <Search className={`w-3.5 h-3.5 transition-colors ${isDirectoryOpen ? 'text-blue-300' : 'text-blue-400 group-hover:scale-110'}`} />
                    <span>LAUNCH DIRECTORY</span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isDirectoryOpen ? 'translate-x-1 text-blue-300' : 'group-hover:translate-x-1'}`} />
                  </button>

                  {/* Compare Models Trigger */}
                  <button
                    onClick={() => onNavigate ? onNavigate('compare') : onCompareTools?.('cursor-ai', 'github-copilot')}
                    className="group px-4 py-3 border border-white/25 hover:border-blue-400 bg-transparent text-neutral-200 hover:text-white font-mono text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer rounded-2xl"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-180 transition-transform duration-500" />
                    <span>COMPARE MODELS</span>
                  </button>

                  {/* Scroll Down Next Slide Hint */}
                  <button
                    onClick={() => goToSlide(1)}
                    className="group px-4 py-3 border border-white/20 hover:border-blue-400 bg-transparent text-neutral-300 hover:text-white font-mono text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 cursor-pointer rounded-2xl"
                  >
                    <ChevronDown className="w-3.5 h-3.5 text-blue-400 group-hover:translate-y-0.5 transition-transform" />
                    <span>SPECS</span>
                  </button>
                </div>

                {/* Quick telemetry chip preview */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1 text-[10px] font-mono text-neutral-300">
                  <span className="flex items-center gap-1.5 border border-white/15 px-3 py-1 rounded-full bg-white/[0.03]">
                    <Layers className="w-3 h-3 text-blue-400" />
                    <span>500+ CURATED TOOLS</span>
                  </span>
                  <span className="flex items-center gap-1.5 border border-white/15 px-3 py-1 rounded-full bg-white/[0.03]">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>12.4K INDEPENDENT RATINGS</span>
                  </span>
                  <span className="flex items-center gap-1.5 border border-white/15 px-3 py-1 rounded-full bg-white/[0.03]">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>ZERO SPONSORED BIAS</span>
                  </span>
                </div>

                {/* Featured AI Tools // Original Brand Logos Strip */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-400 flex items-center gap-1.5 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                      OFFICIAL AI MODEL DIRECTORY:
                    </span>
                    <button
                      onClick={onOpenDirectory}
                      className="text-blue-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Browse All →
                    </button>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {['claude-ai', 'chatgpt-plus', 'gemini-advanced', 'deepseek-r1', 'meta-llama-3', 'mistral-large', 'cursor-ai', 'midjourney', 'perplexity-ai'].map((id) => {
                      const t = MOCK_TOOLS.find(item => item.id === id) || { id, name: id, pricing: 'Freemium', category: 'Frontier AI' };
                      return (
                        <button
                          key={t.id}
                          onClick={() => onSelectTool ? onSelectTool(t.id) : onOpenDirectory()}
                          className="group/tool relative px-3 py-1.5 rounded-xl border border-white/10 hover:border-blue-400/80 bg-black/60 hover:bg-blue-950/40 transition-all duration-300 flex items-center gap-2 shrink-0 cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                          title={`${t.name} - ${t.category}`}
                        >
                          <ToolLogo tool={t} size="xs" />
                          <span className="text-[11px] font-mono font-medium text-neutral-200 group-hover/tool:text-white">
                            {t.name.split(' ')[0]}
                          </span>
                          <span className="text-[9px] font-mono text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full bg-emerald-500/10">
                            {t.pricing?.split(' ')[0] || 'Free'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom scroll cue */}
            <div className="flex justify-center items-center pb-2">
              <button 
                onClick={() => goToSlide(1)}
                className="group flex flex-col items-center gap-1.5 text-neutral-400 hover:text-blue-400 cursor-pointer transition-colors"
              >
                <span className="text-[10px] font-mono tracking-widest uppercase">SCROLL DOWN TO EXPLORE SPECS</span>
                <ChevronDown className="w-4 h-4 text-blue-400 group-hover:translate-y-1 transition-transform animate-bounce" />
              </button>
            </div>

          </div>

          {/* ========================================================= */}
          {/* SLIDE 2: NEURAL CORES & HARDWARE SPECS (Vertical Scroll 02) */}
          {/* ========================================================= */}
          <div className="w-full h-screen shrink-0 flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-16 sm:pt-20 pb-24 overflow-y-auto lg:overflow-y-visible">
            <div className="max-w-[1520px] w-full mx-auto flex-1 flex flex-col justify-center space-y-6">
              
              {/* Slide 2 Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.12] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3.5 py-1 text-[10px] font-mono tracking-[0.25em] text-blue-400 border border-blue-500 bg-blue-500/10 uppercase rounded-full">
                      STAGE 02 // AI FOUNDATIONS & BENCHMARK MATRIX
                    </span>
                    <span className="text-neutral-400 text-xs font-mono">·</span>
                    <span className="text-[10px] font-mono tracking-widest text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full bg-emerald-500/10">
                      VERIFIED SOTA BENCHMARKS (2026)
                    </span>
                  </div>
                  <h2 
                    className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-[0.14em]"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    FRONTIER AI MODELS & ARCHITECTURES
                  </h2>
                </div>
                <p className="text-xs text-neutral-300 font-mono max-w-md">
                  Independent benchmark matrix, context windows, reasoning latency, and verified pricing tiers for industry-leading foundation architectures.
                </p>
              </div>

              {/* 4 Architecture Spec Cards (Smooth Rounded-3XL Corners, Glassmorphic Glow, Complete AI Details) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                
                {/* Node 01: Multimodal Foundation & Frontier Reasoning */}
                <div className="group relative rounded-3xl border border-white/20 hover:border-blue-400 bg-transparent hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300">
                  <div className="h-full rounded-[22px] bg-transparent p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-colors duration-300">
                    <div>
                      {/* Header plate */}
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-2 border-b border-white/10">
                        <span className="text-blue-400 font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                          <span>CORE // 01</span>
                        </span>
                        <span className="flex items-center gap-1 text-[9px] text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full bg-transparent">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          MMLU 92.4%
                        </span>
                      </div>

                      {/* Model Logos Strip */}
                      <div className="flex items-center gap-2 my-3">
                        <div className="flex items-center -space-x-1.5">
                          <ToolLogo toolId="claude-ai" size="xs" />
                          <ToolLogo toolId="chatgpt-plus" size="xs" />
                          <ToolLogo toolId="gemini-advanced" size="xs" />
                          <ToolLogo toolId="deepseek-r1" size="xs" />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-300 truncate">Claude · OpenAI · Gemini · DeepSeek</span>
                      </div>

                      <h3 className="text-base font-bold uppercase tracking-wider text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        MULTIMODAL REASONING
                      </h3>
                      <p className="mt-2 text-xs text-neutral-200 font-sans leading-relaxed">
                        Extended chain-of-thought logic, deep mathematical proofs, multi-turn coding reasoning, and artifact compilation.
                      </p>

                      {/* AI Benchmark Specs Grid (Pure Transparent, Crisp Hairline Borders) */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-[10px] font-mono">
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">CONTEXT</div>
                          <div className="text-white font-semibold">200K - 2M TOKENS</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">SWE-BENCH</div>
                          <div className="text-emerald-400 font-semibold">49.2% SOTA</div>
                        </div>
                      </div>

                      {/* Capabilities Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="px-2 py-0.5 rounded-full border border-white/15 text-[9px] font-mono text-neutral-300">
                          Chain-of-Thought
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-white/15 text-[9px] font-mono text-neutral-300">
                          Live Artifacts
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-blue-500/40 text-[9px] font-mono text-blue-300">
                          RFC Tools
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-neutral-300">LATENCY: <strong className="text-white">380ms</strong></span>
                      <button
                        onClick={() => onSelectTool ? onSelectTool('claude-ai') : onOpenDirectory()}
                        className="text-blue-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-blue-500/30 hover:border-blue-400 px-2.5 py-1 rounded-full"
                      >
                        <span>Inspect Spec</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Node 02: Autonomous Dev Agents & IDEs */}
                <div className="group relative rounded-3xl border border-white/20 hover:border-blue-400 bg-transparent hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300">
                  <div className="h-full rounded-[22px] bg-transparent p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-colors duration-300">
                    <div>
                      {/* Header plate */}
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-2 border-b border-white/10">
                        <span className="text-blue-400 font-bold flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-blue-400" />
                          <span>CORE // 02</span>
                        </span>
                        <span className="flex items-center gap-1 text-[9px] text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full bg-transparent">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          RESOLVE 89.2%
                        </span>
                      </div>

                      {/* Model Logos Strip */}
                      <div className="flex items-center gap-2 my-3">
                        <div className="flex items-center -space-x-1.5">
                          <ToolLogo toolId="cursor-ai" size="xs" />
                          <ToolLogo toolId="github-copilot" size="xs" />
                          <ToolLogo toolId="mistral-large" size="xs" />
                          <ToolLogo toolId="v0-dev" size="xs" />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-300 truncate">Cursor · Copilot · Mistral · v0</span>
                      </div>

                      <h3 className="text-base font-bold uppercase tracking-wider text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        AUTONOMOUS DEV AGENTS
                      </h3>
                      <p className="mt-2 text-xs text-neutral-200 font-sans leading-relaxed">
                        Full repository semantic AST indexing, Model Context Protocol (MCP) tool execution, multi-file atomic diffs, and sandboxed terminal fix.
                      </p>

                      {/* AI Benchmark Specs Grid (Pure Transparent) */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-[10px] font-mono">
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">INDEXING</div>
                          <div className="text-white font-semibold">FULL REPO AST</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">MCP TOOLS</div>
                          <div className="text-emerald-400 font-semibold">NATIVE RFC</div>
                        </div>
                      </div>

                      {/* Capabilities Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="px-2 py-0.5 rounded-full border border-white/15 text-[9px] font-mono text-neutral-300">
                          Semantic Diff
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-white/15 text-[9px] font-mono text-neutral-300">
                          Terminal CLI
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-blue-500/40 text-[9px] font-mono text-blue-300">
                          Git Composer
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-neutral-300">SYNTAX: <strong className="text-white">99.4% OK</strong></span>
                      <button
                        onClick={() => onSelectTool ? onSelectTool('cursor-ai') : onOpenDirectory()}
                        className="text-blue-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-blue-500/30 hover:border-blue-400 px-2.5 py-1 rounded-full"
                      >
                        <span>Inspect Spec</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Node 03: Generative Multimodal & Creative Synthesis */}
                <div className="group relative rounded-3xl border border-white/20 hover:border-blue-400 bg-transparent hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300">
                  <div className="h-full rounded-[22px] bg-transparent p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-colors duration-300">
                    <div>
                      {/* Header plate */}
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-2 border-b border-white/10">
                        <span className="text-blue-400 font-bold flex items-center gap-1.5">
                          <Film className="w-3.5 h-3.5 text-blue-400" />
                          <span>CORE // 03</span>
                        </span>
                        <span className="flex items-center gap-1 text-[9px] text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full bg-transparent">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          4K CINEMATIC
                        </span>
                      </div>

                      {/* Model Logos Strip */}
                      <div className="flex items-center gap-2 my-3">
                        <div className="flex items-center -space-x-1.5">
                          <ToolLogo toolId="midjourney" size="xs" />
                          <ToolLogo toolId="runway-ml" size="xs" />
                          <ToolLogo toolId="flux-ai" size="xs" />
                          <ToolLogo toolId="elevenlabs" size="xs" />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-300 truncate">Midjourney · Runway · FLUX · 11Labs</span>
                      </div>

                      <h3 className="text-base font-bold uppercase tracking-wider text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        CREATIVE SYNTHESIS
                      </h3>
                      <p className="mt-2 text-xs text-neutral-200 font-sans leading-relaxed">
                        Diffusion flow-matching, camera trajectory control, 48kHz neural voice cloning (&lt;180ms), and 60 FPS temporal video interpolation.
                      </p>

                      {/* AI Benchmark Specs Grid (Pure Transparent) */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-[10px] font-mono">
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">RESOLUTION</div>
                          <div className="text-white font-semibold">4096×4096 4K</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">VOICE LATENCY</div>
                          <div className="text-emerald-400 font-semibold">&lt;180MS LOSSLESS</div>
                        </div>
                      </div>

                      {/* Capabilities Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="px-2 py-0.5 rounded-full border border-white/15 text-[9px] font-mono text-neutral-300">
                          Camera Paths
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-white/15 text-[9px] font-mono text-neutral-300">
                          Neural Voice
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-blue-500/40 text-[9px] font-mono text-blue-300">
                          Style Locks
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-neutral-300">AUDIO: <strong className="text-white">48kHz FLAC</strong></span>
                      <button
                        onClick={() => onSelectTool ? onSelectTool('midjourney') : onOpenDirectory()}
                        className="text-blue-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-blue-500/30 hover:border-blue-400 px-2.5 py-1 rounded-full"
                      >
                        <span>Inspect Spec</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Node 04: Deep Research & Synthetic Search */}
                <div className="group relative rounded-3xl border border-white/20 hover:border-blue-400 bg-transparent hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all duration-300">
                  <div className="h-full rounded-[22px] bg-transparent p-5 sm:p-6 flex flex-col justify-between space-y-4 transition-colors duration-300">
                    <div>
                      {/* Header plate */}
                      <div className="flex items-center justify-between text-xs font-mono text-neutral-400 pb-2 border-b border-white/10">
                        <span className="text-blue-400 font-bold flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5 text-blue-400" />
                          <span>CORE // 04</span>
                        </span>
                        <span className="flex items-center gap-1 text-[9px] text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 rounded-full bg-transparent">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          100% SOURCED
                        </span>
                      </div>

                      {/* Model Logos Strip */}
                      <div className="flex items-center gap-2 my-3">
                        <div className="flex items-center -space-x-1.5">
                          <ToolLogo toolId="perplexity-ai" size="xs" />
                          <ToolLogo toolId="deepseek-r1" size="xs" />
                          <ToolLogo toolId="grok-ai" size="xs" />
                          <ToolLogo toolId="meta-llama-3" size="xs" />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-300 truncate">Perplexity · DeepSeek · Grok · Llama</span>
                      </div>

                      <h3 className="text-base font-bold uppercase tracking-wider text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
                        DEEP RESEARCH ENGINES
                      </h3>
                      <p className="mt-2 text-xs text-neutral-200 font-sans leading-relaxed">
                        Multi-source web crawls, peer-reviewed academic citation validation, chain-of-search query synthesis, and hallucination elimination.
                      </p>

                      {/* AI Benchmark Specs Grid (Pure Transparent) */}
                      <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-[10px] font-mono">
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">CITATIONS</div>
                          <div className="text-white font-semibold">100% VERIFIED</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">MATH 500</div>
                          <div className="text-emerald-400 font-semibold">93.8% SOTA</div>
                        </div>
                      </div>

                      {/* Capabilities Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-3">
                        <span className="px-2 py-0.5 rounded-full border border-white/15 text-[9px] font-mono text-neutral-300">
                          Live Web Index
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-white/15 text-[9px] font-mono text-neutral-300">
                          PubMed / Arxiv
                        </span>
                        <span className="px-2 py-0.5 rounded-full border border-blue-500/40 text-[9px] font-mono text-blue-300">
                          Grounded Citations
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-neutral-300">RETRIEVAL: <strong className="text-white">REAL-TIME WEB</strong></span>
                      <button
                        onClick={() => onSelectTool ? onSelectTool('perplexity-ai') : onOpenDirectory()}
                        className="text-blue-400 hover:text-white font-semibold flex items-center gap-1 cursor-pointer transition-colors border border-blue-500/30 hover:border-blue-400 px-2.5 py-1 rounded-full"
                      >
                        <span>Inspect Spec</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action row for Slide 2 */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={onOpenTelemetry}
                    className={`px-5 py-2.5 text-xs font-mono tracking-wider rounded-2xl border transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                      isTelemetryOpen
                        ? 'border-blue-400 bg-blue-500/25 shadow-[0_0_20px_rgba(59,130,246,0.6)] text-white'
                        : 'border-white/30 hover:border-blue-400 text-white hover:bg-blue-600/15'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span>LAUNCH NODE TELEMETRY</span>
                  </button>
                  <button
                    onClick={() => goToSlide(2)}
                    className="px-5 py-2.5 text-xs font-mono tracking-wider rounded-2xl border border-white/20 hover:border-blue-400 text-neutral-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>NEXT: SWARM LAB</span>
                    <ChevronDown className="w-3.5 h-3.5 text-blue-400" />
                  </button>
                </div>
                <div className="text-[11px] font-mono text-neutral-400 flex items-center gap-2">
                  <span className="text-white">Vertical Scrub Engine</span>
                  <span>·</span>
                  <span>Scroll up / down to navigate</span>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================================= */}
          {/* SLIDE 3: SWARM BENCHMARKS & VERIFICATION (Vertical Scroll 03) */}
          {/* ========================================================= */}
          <div className="w-full h-screen shrink-0 flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-16 sm:pt-20 pb-24 overflow-y-auto lg:overflow-y-visible">
            <div className="max-w-[1520px] w-full mx-auto flex-1 flex flex-col justify-center space-y-6">
              
              {/* Slide 3 Header */}
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.12] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3.5 py-1 text-[10px] font-mono tracking-[0.25em] text-amber-400 border border-amber-500 bg-amber-500/10 uppercase rounded-full">
                      STAGE 03 // BENCHMARK LAB & REVIEWS
                    </span>
                    <span className="text-neutral-400 text-xs font-mono">·</span>
                    <span className="text-[10px] font-mono tracking-widest text-white border border-white/20 px-2.5 py-0.5 rounded-full bg-white/[0.04]">
                      12,400+ VERIFIED RUNS
                    </span>
                  </div>
                  <h2 
                    className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-[0.14em]"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    AI BENCHMARK LAB & VERIFICATION
                  </h2>
                </div>
                <p className="text-xs text-neutral-300 font-mono max-w-md">
                  Community-evaluated autonomous workloads, deterministic audits, drift monitoring, and verified peer benchmark reviews.
                </p>
              </div>

              {/* The Two Bottom Spec Cards (Smooth Rounded-3XL Corners, Glassmorphic Glow, Rich AI Details) */}
              <div id="architecture-specs" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                
                {/* Card 1: Real-Time Model Telemetry & Benchmarks */}
                <div 
                  onClick={onOpenTelemetry}
                  className={`group relative rounded-3xl border transition-all duration-300 cursor-pointer bg-transparent ${
                    isTelemetryOpen
                      ? 'border-blue-400 shadow-[0_0_35px_rgba(59,130,246,0.55)] ring-1 ring-blue-400/60'
                      : 'border-white/20 hover:border-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'
                  }`}
                >
                  <div className="h-full rounded-[22px] p-6 sm:p-7 transition-all duration-300 relative overflow-hidden bg-transparent flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span 
                          className="text-sm font-bold tracking-[0.18em] uppercase text-white flex items-center gap-2"
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          <Activity className="w-4 h-4 text-blue-400" />
                          REAL-TIME MODEL TELEMETRY
                        </span>
                        <span className={`text-[10px] font-mono flex items-center gap-1.5 border px-2.5 py-1 rounded-full bg-transparent ${
                          isTelemetryOpen
                            ? 'text-emerald-300 border-emerald-400/80 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                            : 'text-emerald-400 border-emerald-500/50'
                        }`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          99.98% CLUSTER SLA
                        </span>
                      </div>

                      <p className="mt-3 text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">
                        Live sub-network telemetry, API response latencies (Anthropic 380ms, OpenAI 420ms, Gemini 310ms), and autonomous execution verification across 14,892 active model evaluations.
                      </p>

                      {/* AI Metric Badges (Pure Transparent, Crisp Hairline Borders) */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-[10px] font-mono">
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">LATENCY MESH</div>
                          <div className="text-white font-semibold">SUB-7MS PING</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">UPTIME AUDIT</div>
                          <div className="text-emerald-400 font-semibold">99.98% VERIFIED</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">THROUGHPUT</div>
                          <div className="text-blue-400 font-semibold">1.4M TOKENS/S</div>
                        </div>
                      </div>

                      {/* Capabilities Chips */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-mono text-neutral-300">
                          Live Latency Stream
                        </span>
                        <span className="px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-mono text-neutral-300">
                          API Outage Monitor
                        </span>
                        <span className="px-2.5 py-1 rounded-full border border-blue-500/40 text-[10px] font-mono text-blue-300">
                          Multi-Region Mesh
                        </span>
                      </div>

                      {/* Monitored Model Endpoints Strip */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center -space-x-1.5">
                          <ToolLogo toolId="claude-ai" size="xs" />
                          <ToolLogo toolId="chatgpt-plus" size="xs" />
                          <ToolLogo toolId="gemini-advanced" size="xs" />
                          <ToolLogo toolId="deepseek-r1" size="xs" />
                          <ToolLogo toolId="meta-llama-3" size="xs" />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400">Live monitored frontier endpoints</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-300">
                      <span className="text-white font-medium font-mono">14,892 Active Swarms</span>
                      <span className={`transition-all flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
                        isTelemetryOpen 
                          ? 'text-blue-300 border-blue-400/80 shadow-[0_0_12px_rgba(59,130,246,0.6)]' 
                          : 'text-blue-400 border-blue-500/30 group-hover:border-blue-400 group-hover:text-white'
                      }`}>
                        Open Live HUD <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Community Reviews & Benchmarks */}
                <div 
                  onClick={onOpenReviews}
                  className={`group relative rounded-3xl border transition-all duration-300 cursor-pointer bg-transparent ${
                    isReviewsOpen
                      ? 'border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.55)] ring-1 ring-amber-400/60'
                      : 'border-white/20 hover:border-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]'
                  }`}
                >
                  <div className="h-full rounded-[22px] p-6 sm:p-7 transition-all duration-300 relative overflow-hidden bg-transparent flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span 
                          className="text-sm font-bold tracking-[0.18em] uppercase text-white flex items-center gap-2"
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          COMMUNITY AI REVIEWS
                        </span>
                        <span className={`text-[10px] font-mono border px-2.5 py-1 rounded-full bg-transparent ${
                          isReviewsOpen
                            ? 'text-amber-200 border-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                            : 'text-amber-300 border-amber-500/50'
                        }`}>
                          ★ 4.92 / 5.0 (500+ Tools)
                        </span>
                      </div>

                      <p className="mt-3 text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans">
                        Peer-reviewed benchmark results, real developer pros and cons, cost calculations, and deployment evaluations submitted by verified AI staff engineers and autonomous lab leads.
                      </p>

                      {/* AI Metric Badges (Pure Transparent) */}
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/10 text-[10px] font-mono">
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">VERIFIED RUNS</div>
                          <div className="text-white font-semibold">12,400+ AUDITS</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">COMMUNITY RATING</div>
                          <div className="text-amber-300 font-semibold">4.92 / 5.0</div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-white/15 bg-transparent">
                          <div className="text-neutral-400">DRIFT TRACKING</div>
                          <div className="text-emerald-400 font-semibold">ACTIVE 2026</div>
                        </div>
                      </div>

                      {/* Capabilities Chips */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        <span className="px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-mono text-neutral-300">
                          Cost vs Quality Radar
                        </span>
                        <span className="px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-mono text-neutral-300">
                          Drift Benchmarks
                        </span>
                        <span className="px-2.5 py-1 rounded-full border border-amber-500/40 text-[10px] font-mono text-amber-300">
                          Verified Dev Reviews
                        </span>
                      </div>

                      {/* Audited Frontier Models Strip */}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center -space-x-1.5">
                          <ToolLogo toolId="cursor-ai" size="xs" />
                          <ToolLogo toolId="perplexity-ai" size="xs" />
                          <ToolLogo toolId="midjourney" size="xs" />
                          <ToolLogo toolId="mistral-large" size="xs" />
                          <ToolLogo toolId="grok-ai" size="xs" />
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400">Audited across 500+ frontier builds</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-300">
                      <span className="text-white font-medium font-mono">12.4k Verified Runs</span>
                      <span className={`transition-all flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
                        isReviewsOpen 
                          ? 'text-amber-200 border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.6)]' 
                          : 'text-amber-400 border-amber-500/30 group-hover:border-amber-400 group-hover:text-white'
                      }`}>
                        Read Reviews <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Scroll Affordance into Shared Directory Section */}
              <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.08]">
                <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  <span className="text-neutral-300">APPROACHING AGENT DIRECTORY</span>
                  <span className="text-neutral-600 hidden sm:inline">|</span>
                  <span className="hidden sm:inline text-neutral-400">Continue scrolling down to explore the shared catalog</span>
                </div>

                <button
                  onClick={handleExplore}
                  className="group px-7 py-3 rounded-full border border-blue-500/70 hover:border-blue-400 bg-blue-600/15 hover:bg-blue-600/30 text-white font-mono text-xs tracking-wider uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] animate-pulse hover:animate-none"
                >
                  <Compass className="w-4 h-4 text-blue-400 group-hover:rotate-45 transition-transform" />
                  <span>EXPLORE AGENT HUB</span>
                  <ChevronDown className="w-4 h-4 text-blue-300 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
