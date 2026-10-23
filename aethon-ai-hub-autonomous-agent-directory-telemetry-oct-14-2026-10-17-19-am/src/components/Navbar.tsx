import React, { useState, useEffect, useRef } from 'react';
import { 
  Command, 
  Menu, 
  X, 
  Sparkles, 
  ArrowLeftRight, 
  Layers, 
  BookOpen, 
  Upload, 
  Info, 
  Home,
  Activity,
  Pin,
  PinOff,
  ChevronDown
} from 'lucide-react';
import { PageRoute } from '../types';
import BrandLogo from './BrandLogo';

interface NavbarProps {
  currentPage?: PageRoute;
  onNavigate: (route: PageRoute) => void;
  onOpenDirectory?: () => void;
  onOpenTelemetry?: () => void;
  onOpenReviews?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenNoomoLabs?: () => void;
  isDirectoryOpen?: boolean;
  isTelemetryOpen?: boolean;
  isReviewsOpen?: boolean;
  isCommandPaletteOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage = 'home',
  onNavigate,
  onOpenDirectory,
  onOpenTelemetry,
  onOpenReviews,
  onOpenCommandPalette,
  onOpenNoomoLabs,
  isDirectoryOpen = false,
  isTelemetryOpen = false,
  isReviewsOpen = false,
  isCommandPaletteOpen = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(true); // Start visible briefly on initial load
  const [isPinned, setIsPinned] = useState(false);
  const isHoveredRef = useRef(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollYRef = useRef(0);

  // Exact header navigation menu requested by the user:
  // (Home, All Tools, Best AI Tools, Compare, Submit Your Tool, About)
  const navItems: { label: string; route: PageRoute; icon: React.ReactNode }[] = [
    { label: 'Home', route: 'home', icon: <Home className="w-3.5 h-3.5" /> },
    { label: 'All Tools', route: 'all-tools', icon: <Layers className="w-3.5 h-3.5" /> },
    { label: 'Best AI Tools', route: 'best-ai-tools', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { label: 'Compare', route: 'compare', icon: <ArrowLeftRight className="w-3.5 h-3.5" /> },
    { label: 'Submit Your Tool', route: 'submit-tool', icon: <Upload className="w-3.5 h-3.5" /> },
    { label: 'About', route: 'about', icon: <Info className="w-3.5 h-3.5" /> },
  ];

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  // Helper to schedule automatic hiding
  const scheduleHide = (delayMs = 350) => {
    if (isPinned || mobileMenuOpen || isCommandPaletteOpen) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      if (!isHoveredRef.current && !isPinned && !mobileMenuOpen) {
        setIsRevealed(false);
      }
      hideTimerRef.current = null;
    }, delayMs);
  };

  // Helper to show the navbar
  const showNavbar = () => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    setIsRevealed(true);
  };

  // Initial mount: show menu bar for 2.2s so user sees navigation, then automatically hide
  useEffect(() => {
    scheduleHide(2200);
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [isPinned]);

  // Automatic hideable behavior: cursor proximity and scroll direction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPinned) return;
      // If cursor is within 85px of the top edge, reveal menu bar
      if (e.clientY <= 85) {
        showNavbar();
      } else if (!isHoveredRef.current && !mobileMenuOpen && !isCommandPaletteOpen) {
        // When cursor moves down into page content, automatically hide
        scheduleHide(320);
      }
    };

    const handleScroll = () => {
      if (isPinned) return;
      const currentScrollY = window.scrollY;
      // When scrolling down, automatically hide immediately to clear view
      if (currentScrollY > lastScrollYRef.current && currentScrollY > 70 && !isHoveredRef.current) {
        setIsRevealed(false);
      } else if (currentScrollY < lastScrollYRef.current - 15) {
        // When scrolling up, reveal and schedule auto-hide
        showNavbar();
        scheduleHide(2800);
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isPinned, mobileMenuOpen, isCommandPaletteOpen]);

  const shouldBeVisible = isPinned || isRevealed || mobileMenuOpen || isCommandPaletteOpen;

  return (
    <>
      {/* Top Edge Proximity Sensor Zone: detects cursor approaching the top of the screen */}
      <div 
        onMouseEnter={() => {
          showNavbar();
        }}
        className="fixed top-0 left-0 right-0 h-8 sm:h-10 z-50 pointer-events-auto"
        aria-hidden="true"
      />

      {/* Automatic Laptop Menu Bar: completely transparent background, automatically hideable */}
      <header 
        onMouseEnter={() => {
          isHoveredRef.current = true;
          showNavbar();
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
          scheduleHide(350);
        }}
        className={`fixed top-0 inset-x-0 z-50 bg-transparent transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          shouldBeVisible 
            ? 'translate-y-0 opacity-100 pointer-events-auto' 
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="max-w-[1520px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4 bg-transparent transition-all duration-300">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
            >
              <BrandLogo size="sm" />
              <div className="flex flex-col">
                <span
                  className="text-base sm:text-lg font-black tracking-[0.16em] text-white uppercase group-hover:text-blue-400 transition-colors whitespace-nowrap font-mono leading-tight"
                >
                AI DIRECTORY
              </span>
              <span className="text-[9px] font-mono tracking-[0.18em] text-blue-400 uppercase font-semibold leading-tight">
                ZMPTO TOOL
              </span>
            </div>
          </button>
          <span className="hidden sm:inline-block text-[9px] font-mono tracking-[0.2em] text-neutral-400 uppercase px-2 py-0.5 border border-white/10 rounded-full">
            INDEX 2026
          </span>
        </div>

        {/* Desktop Navigation Menu (Home, All Tools, Best AI Tools, Compare, Submit Your Tool, About) */}
        <nav className="hidden xl:flex items-center gap-1.5 text-xs font-semibold tracking-wider text-neutral-300 uppercase">
          {navItems.map((item) => {
            const isActive = currentPage === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                className={`transition-all duration-300 cursor-pointer px-3.5 py-2 rounded-lg whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white border border-blue-400/80 bg-blue-500/20 shadow-[0_0_16px_rgba(59,130,246,0.5),inset_0_0_8px_rgba(59,130,246,0.2)] font-bold'
                    : 'text-neutral-400 hover:text-white border border-transparent hover:border-white/15 hover:bg-white/[0.03]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Medium Screen Nav (More compact) */}
        <nav className="hidden md:flex xl:hidden items-center gap-1 text-[11px] font-semibold tracking-wider text-neutral-300 uppercase">
          {navItems.slice(0, 4).map((item) => {
            const isActive = currentPage === item.route;
            return (
              <button
                key={item.route}
                onClick={() => handleNavClick(item.route)}
                className={`transition-all duration-200 cursor-pointer px-2.5 py-1.5 rounded-lg whitespace-nowrap ${
                  isActive
                    ? 'text-white border border-blue-400/80 bg-blue-500/20 shadow-[0_0_14px_rgba(59,130,246,0.4)]'
                    : 'text-neutral-400 hover:text-white border border-transparent hover:border-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Affordances */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg transition-all duration-300 cursor-pointer ${
              isCommandPaletteOpen
                ? 'text-white border border-blue-400/80 bg-blue-500/25 shadow-[0_0_18px_rgba(59,130,246,0.5)]'
                : 'text-neutral-300 border border-white/15 hover:border-blue-400/50 bg-white/[0.04] hover:bg-blue-500/10'
            }`}
            title="Open Command Palette (Ctrl+K)"
          >
            <Command className={`w-3.5 h-3.5 ${isCommandPaletteOpen ? 'text-blue-300 animate-pulse' : 'text-blue-400'}`} />
            <span className="font-mono text-[11px] tracking-wider hidden lg:inline">Quick Find</span>
            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-mono border border-white/10">Ctrl+K</kbd>
          </button>

          {/* Primary CTA (All Tools / Explore) */}
          <button
            onClick={() => handleNavClick('all-tools')}
            className={`px-4 py-2 text-xs font-bold tracking-wider uppercase whitespace-nowrap transition-all duration-300 rounded-lg cursor-pointer ${
              currentPage === 'all-tools'
                ? 'text-white border border-blue-400 bg-blue-500/25 shadow-[0_0_20px_rgba(59,130,246,0.6),inset_0_0_12px_rgba(59,130,246,0.3)] ring-1 ring-blue-400/60'
                : 'text-white border border-blue-500/80 bg-blue-600/10 hover:bg-blue-600/25 hover:border-blue-400 shadow-[0_0_14px_rgba(59,130,246,0.25)]'
            }`}
          >
            Explore Tools
          </button>

          {/* Telemetry quick toggle */}
          {onOpenTelemetry && (
            <button
              onClick={onOpenTelemetry}
              className={`p-2 transition-all duration-300 rounded-lg ${
                isTelemetryOpen
                  ? 'text-blue-300 border border-blue-400/80 bg-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                  : 'text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 bg-white/[0.02]'
              }`}
              title="Toggle Live Telemetry Drawer"
            >
              <Activity className="w-4 h-4" />
            </button>
          )}

          {/* Laptop Auto-Hide / Pin Mode Toggle */}
          <button
            onClick={() => setIsPinned(!isPinned)}
            className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono transition-all duration-300 rounded-lg cursor-pointer ${
              isPinned
                ? 'text-blue-300 border border-blue-400/80 bg-blue-500/20 shadow-[0_0_14px_rgba(59,130,246,0.4)]'
                : 'text-neutral-400 hover:text-white border border-white/10 hover:border-white/25 bg-white/[0.02]'
            }`}
            title={isPinned ? 'Menu bar is pinned (Click to enable laptop auto-hide)' : 'Laptop auto-hide active (Cursor near top reveals • Click to pin)'}
          >
            {isPinned ? <PinOff className="w-3.5 h-3.5 text-blue-400" /> : <Pin className="w-3.5 h-3.5" />}
            <span className="text-[10px] tracking-wider uppercase">
              {isPinned ? 'PINNED' : 'AUTO-HIDE'}
            </span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 text-neutral-400 hover:text-white border border-white/10 rounded-lg bg-white/[0.02]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Responsive Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="glass-panel xl:hidden px-6 py-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-2">
            Navigation Menu
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNavClick(item.route)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold tracking-wider uppercase flex items-center gap-3 transition-all ${
                    isActive
                      ? 'text-white border border-blue-400/80 bg-blue-500/20 shadow-[0_0_16px_rgba(59,130,246,0.4)]'
                      : 'text-neutral-300 hover:text-white bg-white/[0.03] border border-white/5'
                  }`}
                >
                  <span className={isActive ? 'text-blue-400' : 'text-neutral-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenCommandPalette) onOpenCommandPalette();
              }}
              className="flex items-center gap-2 text-blue-400"
            >
              <Command className="w-3.5 h-3.5" />
              <span>Command Palette (Ctrl+K)</span>
            </button>
            <button
              onClick={() => setIsPinned(!isPinned)}
              className="flex items-center gap-1.5 text-neutral-300"
            >
              {isPinned ? <PinOff className="w-3.5 h-3.5 text-blue-400" /> : <Pin className="w-3.5 h-3.5" />}
              <span>{isPinned ? 'Unpin' : 'Pin Bar'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
    </>
  );
};
