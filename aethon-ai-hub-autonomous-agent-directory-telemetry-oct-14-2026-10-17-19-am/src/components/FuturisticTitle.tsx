import React from 'react';

interface FuturisticTitleProps {
  primaryWord?: string;
  badgeText?: string;
  className?: string;
}

export const FuturisticTitle: React.FC<FuturisticTitleProps> = ({
  primaryWord = 'FUTURE',
  badgeText = 'HERE AND NOW',
  className = ''
}) => {
  return (
    <div className={`relative select-none ${className}`}>
      {/* Blue accent block and kicker matching the reference image layout */}
      <div className="flex items-center gap-3 mb-1">
        <span className="inline-block px-2.5 py-1 text-[11px] font-semibold tracking-[0.2em] text-white bg-blue-600 uppercase font-mono">
          {badgeText}
        </span>
      </div>

      {/* Futuristic Geometric Display Typography */}
      <div className="relative flex items-center">
        {/* Solid blue vertical anchor bracket hugging the 'F' / start of word */}
        <div className="absolute -left-3 top-1 bottom-1 w-1.5 bg-blue-600" />

        <h1 
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.16em] sm:tracking-[0.22em] text-white uppercase"
          style={{
            fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
            letterSpacing: '0.22em',
            textShadow: '0 0 35px rgba(255, 255, 255, 0.12)'
          }}
        >
          {primaryWord}
        </h1>
      </div>
    </div>
  );
};
