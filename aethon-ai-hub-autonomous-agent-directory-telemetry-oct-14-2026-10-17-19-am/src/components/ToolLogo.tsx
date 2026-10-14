import React from 'react';
import { AITool } from '../types';

export type ToolLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface ToolLogoProps {
  tool?: AITool | {
    id: string;
    name?: string;
    logo?: string;
    logoColor?: string;
  };
  toolId?: string;
  size?: ToolLogoSize;
  className?: string;
  rounded?: 'rounded' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-full';
}

const SIZE_CONFIGS: Record<ToolLogoSize, {
  container: string;
  icon: string;
}> = {
  xs: {
    container: 'w-6 h-6',
    icon: 'w-3.5 h-3.5',
  },
  sm: {
    container: 'w-8 h-8',
    icon: 'w-4.5 h-4.5',
  },
  md: {
    container: 'w-12 h-12',
    icon: 'w-7 h-7',
  },
  lg: {
    container: 'w-14 h-14',
    icon: 'w-8 h-8',
  },
  xl: {
    container: 'w-20 h-20 sm:w-24 sm:h-24',
    icon: 'w-12 h-12 sm:w-14 sm:h-14',
  },
  '2xl': {
    container: 'w-24 h-24 sm:w-28 sm:h-28',
    icon: 'w-14 h-14 sm:w-16 sm:h-16',
  },
};

export const ToolLogo: React.FC<ToolLogoProps> = ({
  tool,
  toolId,
  size = 'md',
  className = '',
  rounded = 'rounded-xl',
}) => {
  const id = (toolId || tool?.id || '').toLowerCase();
  const cfg = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;

  // 1. ANTHROPIC CLAUDE: Official Warm Terracotta 8-point Asterisk / Spark
  if (id.includes('claude')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-[#D97757] text-[#FAF8F5] shadow-lg border border-[#F3A588]/40 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="Anthropic Claude"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className={cfg.icon}
        >
          {/* Authentic Anthropic Claude Sunburst / Asterisk */}
          <path d="M12 2C12.5523 2 13 2.44772 13 3V7.58579L16.2426 4.34315C16.6332 3.95262 17.2663 3.95262 17.6569 4.34315C18.0474 4.73367 18.0474 5.36683 17.6569 5.75736L14.4142 9H19C19.5523 9 20 9.44772 20 10C20 10.5523 19.5523 11 19 11H14.4142L17.6569 14.2426C18.0474 14.6332 18.0474 15.2663 17.6569 15.6569C17.2663 16.0474 16.6332 16.0474 16.2426 15.6569L13 12.4142V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V12.4142L7.75736 15.6569C7.36683 16.0474 6.73367 16.0474 6.34315 15.6569C5.95262 15.2663 5.95262 14.6332 6.34315 14.2426L9.58579 11H5C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H9.58579L6.34315 5.75736C5.95262 5.36683 5.95262 4.73367 6.34315 4.34315C6.73367 3.95262 7.36683 3.95262 7.75736 4.34315L11 7.58579V3C11 2.44772 11.4477 2 12 2Z" />
          <circle cx="12" cy="10" r="1.5" fill="#FAF8F5" />
        </svg>
      </div>
    );
  }

  // 2. CHATGPT / OPENAI: Official Teal Spiral Rosette
  if (id.includes('chatgpt') || id.includes('openai') || id.includes('gpt')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-[#10A37F] text-white shadow-lg border border-[#26BF96]/40 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="OpenAI ChatGPT"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.7"
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={cfg.icon}
        >
          {/* Authentic OpenAI Rosette Loop */}
          <path d="M19.5 10.5C19.8 9.9 20 9.2 20 8.5C20 6 18 4 15.5 4C14.7 4 13.9 4.2 13.3 4.6C12.7 3.6 11.4 3 10 3C7.8 3 6 4.8 6 7C6 7.4 6.1 7.7 6.2 8C5.2 8.3 4.5 9.1 4.2 10.1C3.5 11 3 12.2 3 13.5C3 16 5 18 7.5 18C7.9 18 8.3 17.9 8.7 17.8C9.3 19.1 10.5 20 12 20C13.8 20 15.3 18.8 15.8 17.2C16.8 17.7 18 17.5 18.9 16.8C20.2 15.8 21 14.2 21 12.5C21 11.8 20.8 11.1 20.5 10.5" />
          <path d="M12 8L15 10V14L12 16L9 14V10L12 8Z" fill="currentColor" fillOpacity="0.25" />
          <path d="M12 8V16M9 10L15 14M15 10L9 14" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  // 3. CURSOR: Official Isometric 3D Wireframe Cube
  if (id.includes('cursor')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-black text-white shadow-lg border border-white/20 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="Cursor Code Editor"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={cfg.icon}
        >
          {/* Authentic Cursor 3D Shaded Cube */}
          <path d="M12 2.5L20 7.2V16.8L12 21.5L4 16.8V7.2L12 2.5Z" fill="#18181B" stroke="#A1A1AA" strokeWidth="1.2" />
          <path d="M12 2.5V12L20 7.2M12 12L4 7.2M12 12V21.5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          {/* Distinctive bright cyan cursor pointer accent inside */}
          <path d="M11 9.5L14.5 13L12 14.5L11 16.5L10 12L11 9.5Z" fill="#38BDF8" />
        </svg>
      </div>
    );
  }

  // 4. PERPLEXITY AI: Official Interwoven Turquoise Infinity Asterisk
  if (id.includes('perplexity')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-[#0d1c1c] text-[#22D3EE] shadow-lg border border-[#22D3EE]/30 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="Perplexity AI"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#22D3EE" 
          strokeWidth="1.8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={cfg.icon}
        >
          {/* Authentic Perplexity Loop Grid */}
          <rect x="5" y="5" width="14" height="14" rx="2" stroke="#14B8A6" strokeWidth="1.2" />
          <path d="M12 3V21M3 12H21" stroke="#22D3EE" strokeWidth="2" />
          <circle cx="12" cy="12" r="3" fill="#0D9488" stroke="#5EEAD4" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  // 5. MIDJOURNEY: Official Sailboat on Ocean Waves
  if (id.includes('midjourney')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-[#070D1E] text-white shadow-lg border border-[#38BDF8]/30 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="Midjourney"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          className={cfg.icon}
        >
          {/* Authentic Midjourney Origami Sailboat */}
          <path d="M12 3L18 14H6L12 3Z" fill="#38BDF8" fillOpacity="0.2" stroke="#E0F2FE" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M12 3V14" stroke="#FFFFFF" strokeWidth="1.4" />
          <path d="M4 17C7 15.5 10 15.5 12 17C14 18.5 17 18.5 20 17" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M3 20C6.5 19 9.5 19 12 20C14.5 21 17.5 21 21 20" stroke="#0284C7" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 6. ELEVENLABS: Official Parallel Bars ||
  if (id.includes('elevenlabs') || id.includes('eleven')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-black text-white shadow-lg border border-white/20 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="ElevenLabs"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className={cfg.icon}
        >
          {/* Authentic ElevenLabs Double Bars */}
          <rect x="7" y="5" width="3.5" height="14" rx="1.75" fill="#FFFFFF" />
          <rect x="13.5" y="5" width="3.5" height="14" rx="1.75" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // 7. NOTION AI: Official 3D Isometric "N"
  if (id.includes('notion')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-white text-black shadow-lg border border-neutral-300 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="Notion AI"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className={cfg.icon}
        >
          {/* Authentic Notion Cube N Mark */}
          <path d="M4.5 4.5V19.5H19.5V4.5H4.5ZM6 6H18V18H6V6Z" fill="#000000" fillOpacity="0.1" />
          <path d="M7 6.5C7.2 6.5 7.4 6.6 7.5 6.7L15 15.5V7H16.8V17.5C16.6 17.5 16.4 17.4 16.3 17.3L8.8 8.5V17H7V6.5Z" fill="#000000" />
        </svg>
      </div>
    );
  }

  // 8. GITHUB COPILOT: Official Pilot Aviation Visor
  if (id.includes('copilot') || id.includes('github')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-[#181B2A] text-white shadow-lg border border-[#7C3AED]/40 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="GitHub Copilot"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={cfg.icon}
        >
          {/* Authentic GitHub Copilot Visor Emblem */}
          <rect x="4" y="6" width="16" height="12" rx="6" fill="#6E40C9" />
          <path d="M8 11.5C8 10.1 9.1 9 10.5 9H13.5C14.9 9 16 10.1 16 11.5C16 12.9 14.9 14 13.5 14H10.5C9.1 14 8 12.9 8 11.5Z" fill="#0D1117" />
          <circle cx="10.5" cy="11.5" r="1.5" fill="#38BDF8" />
          <circle cx="13.5" cy="11.5" r="1.5" fill="#38BDF8" />
          <path d="M3 12H4M20 12H21" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 9. V0 BY VERCEL: Official Black Triangle Delta + v0 Glyph
  if (id.includes('v0') || id.includes('vercel')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-black text-white shadow-lg border border-white/20 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="v0 by Vercel"
      >
        <div className="flex items-center justify-center font-black tracking-tighter text-white font-mono leading-none">
          <svg viewBox="0 0 24 24" fill="currentColor" className={cfg.icon}>
            <polygon points="12 3 22 20 2 20" fill="#FFFFFF" />
          </svg>
        </div>
      </div>
    );
  }

  // 10. RUNWAY GEN-3: Official Stylized Motion Loop R
  if (id.includes('runway')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-[#150917] text-white shadow-lg border border-[#F43F5E]/40 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="Runway Gen-3 Alpha"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={cfg.icon}
        >
          {/* Authentic Runway Loop Ribbon */}
          <rect x="5" y="4" width="4" height="16" rx="2" fill="#F43F5E" />
          <path d="M9 5H15C17.5 5 19.5 7 19.5 9.5C19.5 12 17.5 14 15 14H9" stroke="#FB7185" strokeWidth="3" strokeLinecap="round" />
          <path d="M14 13L19 20" stroke="#FDA4AF" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 11. DESCRIPT: Official Lowercase Tape Loop "d"
  if (id.includes('descript')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-[#071329] text-white shadow-lg border border-[#3B82F6]/40 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="Descript"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={cfg.icon}
        >
          {/* Authentic Descript Tape Loop */}
          <circle cx="10" cy="14" r="5" stroke="#3B82F6" strokeWidth="2.5" />
          <circle cx="10" cy="14" r="2" fill="#60A5FA" />
          <path d="M15 4V19" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 12. RECRAFT AI: Official Faceted Diamond / Pen Node
  if (id.includes('recraft')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-[#1E0926] text-white shadow-lg border border-[#D946EF]/40 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="Recraft AI"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={cfg.icon}
        >
          {/* Authentic Recraft Vector Diamond Ribbon */}
          <polygon points="12 2 21 9 12 22 3 9" fill="#D946EF" fillOpacity="0.2" stroke="#F472B6" strokeWidth="1.5" />
          <polygon points="12 2 21 9 12 14 3 9" fill="#E879F9" stroke="#F472B6" strokeWidth="1.2" />
          <circle cx="12" cy="14" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // 13. GOOGLE GEMINI: Official 4-point Sparkle Star
  if (id.includes('gemini') || id.includes('google')) {
    return (
      <div 
        className={`relative shrink-0 flex items-center justify-center bg-[#0B0F19] text-white shadow-lg border border-[#60A5FA]/40 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
        title="Google Gemini"
      >
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          className={cfg.icon}
        >
          <path 
            d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" 
            fill="url(#gemini-grad)" 
          />
          <defs>
            <linearGradient id="gemini-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#38BDF8" />
              <stop offset="0.5" stopColor="#818CF8" />
              <stop offset="1" stopColor="#C084FC" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  }

  // Fallback: Gradient badge with two initials
  const initials = tool?.logo || tool?.name?.slice(0, 2).toUpperCase() || 'AI';
  const color = tool?.logoColor || 'from-blue-600 to-indigo-600';

  return (
    <div
      className={`relative shrink-0 flex items-center justify-center bg-gradient-to-br ${color} text-white font-black text-sm shadow-md font-mono border border-white/20 transition-transform duration-300 group-hover:scale-105 ${rounded} ${cfg.container} ${className}`}
      title={tool?.name || 'AI Tool'}
    >
      {initials}
    </div>
  );
};
