import React, { useEffect, useState, useRef, useCallback } from 'react';
import { BookOpen, Check, ArrowUp, Clock } from 'lucide-react';
import { getLenis, smoothScrollTo } from '../utils/scrollManager';

interface ReadingProgressBarProps {
  /**
   * Whether the reading progress tracker is active
   */
  isActive?: boolean;
  /**
   * Optional title of the long-form article being read
   */
  articleTitle?: string | null;
  /**
   * Optional category or tag of the article
   */
  category?: string | null;
  /**
   * Estimated read time string, e.g. "7 min read"
   */
  readTime?: string | null;
  /**
   * Optional CSS selector for the target article element (defaults to 'article' or document body)
   */
  targetSelector?: string;
  /**
   * Whether to display the optional floating reading status pill when scrolled down
   */
  showFloatingPill?: boolean;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  isActive = true,
  articleTitle,
  category,
  readTime,
  targetSelector = 'article',
  showFloatingPill = true
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [pillDismissed, setPillDismissed] = useState<boolean>(false);
  const rafId = useRef<number | null>(null);

  // Reset pill dismissed state whenever article changes
  useEffect(() => {
    setPillDismissed(false);
  }, [articleTitle]);

  const calculateProgress = useCallback(() => {
    if (!isActive) {
      setProgress(0);
      return;
    }

    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;

    // Check if there is an article element to track specifically
    const articleEl = targetSelector ? document.querySelector(targetSelector) as HTMLElement : null;

    let calculatedPercentage = 0;

    if (articleEl && articleEl.offsetHeight > windowHeight) {
      const rect = articleEl.getBoundingClientRect();
      const articleTop = rect.top + scrollY;
      const articleHeight = articleEl.offsetHeight;

      // Track progress as user scrolls through the article container
      const scrollRelativeToArticle = scrollY - articleTop;
      const maxScrollableInArticle = articleHeight - windowHeight;

      if (maxScrollableInArticle <= 0) {
        calculatedPercentage = scrollY > 50 ? 100 : 0;
      } else {
        calculatedPercentage = (scrollRelativeToArticle / maxScrollableInArticle) * 100;
      }
    } else {
      // Fallback: Calculate based on full document scroll
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight
      );
      const maxScroll = docHeight - windowHeight;

      if (maxScroll <= 0) {
        calculatedPercentage = 0;
      } else {
        calculatedPercentage = (scrollY / maxScroll) * 100;
      }
    }

    const clamped = Math.min(100, Math.max(0, calculatedPercentage));
    setProgress(clamped);
    setIsScrolled(scrollY > 140);
    setIsCompleted(clamped >= 99);
  }, [isActive, targetSelector]);

  useEffect(() => {
    if (!isActive) return;

    const onScrollOrResize = () => {
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
      rafId.current = requestAnimationFrame(calculateProgress);
    };

    // Calculate initial progress
    calculateProgress();

    // Listen to native scroll & resize events
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    // Connect to Lenis smooth scroll updates if active
    const lenis = getLenis();
    if (lenis) {
      lenis.on('scroll', onScrollOrResize);
    }

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      if (lenis) {
        lenis.off('scroll', onScrollOrResize);
      }
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [isActive, calculateProgress]);

  if (!isActive) return null;

  // Calculate estimated reading time remaining
  let estimatedTimeLeft: string | null = null;
  if (readTime) {
    const minutesMatch = readTime.match(/(\d+)/);
    if (minutesMatch) {
      const totalMinutes = parseInt(minutesMatch[1], 10);
      const remaining = Math.max(1, Math.ceil(totalMinutes * (1 - progress / 100)));
      estimatedTimeLeft = isCompleted ? 'Completed' : `~${remaining}m left`;
    }
  }

  return (
    <>
      {/* Thin Animated Reading Progress Bar Container */}
      <div 
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Article reading progress"
        className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-white/[0.04] pointer-events-none select-none backdrop-blur-[0.5px]"
      >
        {/* Animated Progress Fill */}
        <div
          className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 via-cyan-400 to-emerald-400 relative transition-[width] duration-100 ease-out will-change-[width]"
          style={{ width: `${progress}%` }}
        >
          {/* Scanning Shimmer Light Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-reading-shimmer opacity-75" />

          {/* Glowing Animated Head (Tip of the bar) */}
          {progress > 0 && progress < 100 && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 flex items-center justify-center pointer-events-none">
              {/* Outer halo */}
              <div className="w-3.5 h-3.5 rounded-full bg-cyan-400/40 blur-[3px] animate-pulse-glow" />
              {/* Core bright spark */}
              <div className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#38bdf8,0_0_4px_#ffffff]" />
            </div>
          )}

          {/* Celebration glow when reading is completed */}
          {isCompleted && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-emerald-400 blur-[4px] shadow-[0_0_12px_#34d399]" />
          )}
        </div>
      </div>

      {/* Optional Floating Reading Status Pill for Long-Form Articles */}
      {showFloatingPill && articleTitle && isScrolled && !pillDismissed && (
        <aside 
          aria-label="Reading progress indicator"
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 max-w-[calc(100vw-3rem)] sm:max-w-md bg-[#0b0e17]/95 border border-white/10 hover:border-blue-500/40 backdrop-blur-md rounded-full shadow-2xl p-1.5 pr-3 pl-3.5 flex items-center gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
        >
          {/* Mini Circular Progress or Complete Icon */}
          <div className="relative w-7 h-7 shrink-0 flex items-center justify-center">
            {isCompleted ? (
              <div className="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="relative w-7 h-7 flex items-center justify-center">
                <svg className="w-7 h-7 -rotate-90" viewBox="0 0 32 32">
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    className="stroke-white/10"
                    strokeWidth="3"
                    fill="none"
                  />
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    className="stroke-blue-400 transition-all duration-150"
                    strokeWidth="3"
                    strokeDasharray={2 * Math.PI * 13}
                    strokeDashoffset={2 * Math.PI * 13 * (1 - progress / 100)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <span className="absolute text-[9px] font-mono font-bold text-white">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
          </div>

          {/* Article Info Truncated */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-400 leading-none mb-0.5">
              {category && <span className="text-blue-400 font-semibold">{category}</span>}
              {category && estimatedTimeLeft && <span>•</span>}
              {estimatedTimeLeft && (
                <span className="flex items-center gap-1 text-neutral-300">
                  <Clock className="w-2.5 h-2.5 text-neutral-500" />
                  {estimatedTimeLeft}
                </span>
              )}
            </div>
            <div className="text-xs font-medium text-white truncate max-w-[200px] sm:max-w-[260px]">
              {articleTitle}
            </div>
          </div>

          {/* Action: Scroll To Top */}
          <button
            onClick={() => smoothScrollTo(0, { duration: 0.8 })}
            title="Scroll to top"
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>

          {/* Action: Dismiss Pill */}
          <button
            onClick={() => setPillDismissed(true)}
            title="Hide indicator"
            className="text-[10px] text-neutral-500 hover:text-neutral-300 px-1 py-0.5"
          >
            ✕
          </button>
        </aside>
      )}
    </>
  );
};
