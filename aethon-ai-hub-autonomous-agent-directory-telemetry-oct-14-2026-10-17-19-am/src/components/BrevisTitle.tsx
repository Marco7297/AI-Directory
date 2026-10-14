import React from 'react';

interface BrevisTitleProps {
  text?: string;
  badgeText?: string;
  className?: string;
}

export const BrevisTitle: React.FC<BrevisTitleProps> = ({
  text = 'AI HUB',
  badgeText = 'HERE AND NOW',
  className = ''
}) => {
  return (
    <div className={`relative select-none ${className}`}>
      {/* Blue accent block from reference */}
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-block px-3 py-1 text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-white bg-blue-600 uppercase font-mono shadow-[0_0_20px_rgba(37,99,235,0.45)]">
          {badgeText}
        </span>
      </div>

      {/* Brevis Stencil Typography Lockup */}
      <div className="relative flex items-center">
        {/* Solid blue vertical anchor bracket hugging the first letter matching reference image */}
        <div className="absolute -left-3 sm:-left-4 top-2 bottom-2 w-1.5 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.7)]" />

        {/* 
          Brevis display font using Zen Dots / Saira Stencil One / Oxanium styling 
          with authentic letter spacing and crisp drop shadow 
        */}
        <div className="flex flex-col">
          <h1 
            className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase leading-none tracking-[0.16em] sm:tracking-[0.22em]"
            style={{
              fontFamily: "'Zen Dots', 'Saira Stencil One', 'Oxanium', sans-serif",
              letterSpacing: '0.2em',
              textShadow: '0 0 45px rgba(255, 255, 255, 0.15), 0 0 15px rgba(59, 130, 246, 0.25)'
            }}
          >
            {text}
          </h1>

          <div className="mt-2.5 flex items-center gap-3">
            <span 
              className="text-xs sm:text-sm font-semibold tracking-[0.32em] text-blue-400 uppercase"
              style={{ fontFamily: "'Oxanium', 'Space Grotesk', sans-serif" }}
            >
              AUTONOMOUS AGENT ECOSYSTEM
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
