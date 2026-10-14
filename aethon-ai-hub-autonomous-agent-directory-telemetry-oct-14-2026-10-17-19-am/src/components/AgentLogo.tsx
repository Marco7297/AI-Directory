import React, { useState } from 'react';
import { AGENT_LOGOS_MAP } from '../data/mockAgents';
import { AIAgent } from '../types';
import { Bot, Cpu, Shield, Search, Eye, Clock, Terminal, MessageSquare, Sparkles, Code2, Globe } from 'lucide-react';

export type AgentLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AgentLogoProps {
  agent?: AIAgent | {
    id?: string;
    codeName?: string;
    name?: string;
    logoUrl?: string;
    themeColor?: string;
    status?: 'operational' | 'busy' | 'syncing';
    category?: string;
  };
  agentId?: string;
  agentCode?: string;
  size?: AgentLogoSize;
  showStatusDot?: boolean;
  showGlow?: boolean;
  className?: string;
  rounded?: 'rounded' | 'rounded-lg' | 'rounded-xl' | 'rounded-full';
}

const SIZE_CONFIGS: Record<AgentLogoSize, {
  container: string;
  imgSize: string;
  iconSize: string;
  dotSize: string;
  borderWidth: string;
}> = {
  xs: {
    container: 'w-6 h-6',
    imgSize: 'w-6 h-6',
    iconSize: 'w-3 h-3',
    dotSize: 'w-1.5 h-1.5',
    borderWidth: 'border',
  },
  sm: {
    container: 'w-8 h-8',
    imgSize: 'w-8 h-8',
    iconSize: 'w-4 h-4',
    dotSize: 'w-2 h-2',
    borderWidth: 'border',
  },
  md: {
    container: 'w-11 h-11',
    imgSize: 'w-11 h-11',
    iconSize: 'w-5 h-5',
    dotSize: 'w-2.5 h-2.5',
    borderWidth: 'border-1.5',
  },
  lg: {
    container: 'w-14 h-14',
    imgSize: 'w-14 h-14',
    iconSize: 'w-7 h-7',
    dotSize: 'w-3 h-3',
    borderWidth: 'border-2',
  },
  xl: {
    container: 'w-18 h-18 sm:w-20 sm:h-20',
    imgSize: 'w-18 h-18 sm:w-20 sm:h-20',
    iconSize: 'w-9 h-9 sm:w-10 sm:h-10',
    dotSize: 'w-3.5 h-3.5',
    borderWidth: 'border-2',
  },
  '2xl': {
    container: 'w-24 h-24 sm:w-28 sm:h-28',
    imgSize: 'w-24 h-24 sm:w-28 sm:h-28',
    iconSize: 'w-12 h-12 sm:w-14 sm:h-14',
    dotSize: 'w-4 h-4',
    borderWidth: 'border-2',
  },
};

const THEME_STYLES: Record<string, {
  border: string;
  borderHover: string;
  glow: string;
  accent: string;
  bgGradient: string;
  Icon: React.ElementType;
}> = {
  cyan: {
    border: 'border-cyan-500/50',
    borderHover: 'group-hover:border-cyan-400',
    glow: 'shadow-[0_0_15px_rgba(6,182,212,0.35)]',
    accent: 'text-cyan-400',
    bgGradient: 'from-cyan-950/80 via-black to-blue-950/60',
    Icon: Cpu,
  },
  emerald: {
    border: 'border-emerald-500/50',
    borderHover: 'group-hover:border-emerald-400',
    glow: 'shadow-[0_0_15px_rgba(16,185,129,0.35)]',
    accent: 'text-emerald-400',
    bgGradient: 'from-emerald-950/80 via-black to-teal-950/60',
    Icon: Terminal,
  },
  violet: {
    border: 'border-violet-500/50',
    borderHover: 'group-hover:border-violet-400',
    glow: 'shadow-[0_0_15px_rgba(139,92,246,0.35)]',
    accent: 'text-violet-400',
    bgGradient: 'from-purple-950/80 via-black to-indigo-950/60',
    Icon: Search,
  },
  amber: {
    border: 'border-amber-500/50',
    borderHover: 'group-hover:border-amber-400',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.35)]',
    accent: 'text-amber-400',
    bgGradient: 'from-amber-950/80 via-black to-orange-950/60',
    Icon: Eye,
  },
  rose: {
    border: 'border-rose-500/50',
    borderHover: 'group-hover:border-rose-400',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.35)]',
    accent: 'text-rose-400',
    bgGradient: 'from-rose-950/80 via-black to-red-950/60',
    Icon: Shield,
  },
  gold: {
    border: 'border-yellow-500/50',
    borderHover: 'group-hover:border-yellow-400',
    glow: 'shadow-[0_0_15px_rgba(234,179,8,0.35)]',
    accent: 'text-yellow-400',
    bgGradient: 'from-yellow-950/80 via-black to-amber-950/60',
    Icon: Clock,
  },
  orange: {
    border: 'border-orange-500/50',
    borderHover: 'group-hover:border-orange-400',
    glow: 'shadow-[0_0_15px_rgba(249,115,22,0.35)]',
    accent: 'text-orange-400',
    bgGradient: 'from-orange-950/80 via-black to-amber-950/60',
    Icon: MessageSquare,
  },
  teal: {
    border: 'border-teal-500/50',
    borderHover: 'group-hover:border-teal-400',
    glow: 'shadow-[0_0_15px_rgba(20,184,166,0.35)]',
    accent: 'text-teal-400',
    bgGradient: 'from-teal-950/80 via-black to-emerald-950/60',
    Icon: Sparkles,
  },
  blue: {
    border: 'border-blue-500/50',
    borderHover: 'group-hover:border-blue-400',
    glow: 'shadow-[0_0_15px_rgba(59,130,246,0.35)]',
    accent: 'text-blue-400',
    bgGradient: 'from-blue-950/80 via-black to-indigo-950/60',
    Icon: Code2,
  },
  indigo: {
    border: 'border-indigo-500/50',
    borderHover: 'group-hover:border-indigo-400',
    glow: 'shadow-[0_0_15px_rgba(99,102,241,0.35)]',
    accent: 'text-indigo-400',
    bgGradient: 'from-indigo-950/80 via-black to-violet-950/60',
    Icon: Globe,
  },
};

export const AgentLogo: React.FC<AgentLogoProps> = ({
  agent,
  agentId,
  agentCode,
  size = 'md',
  showStatusDot = false,
  showGlow = true,
  className = '',
  rounded = 'rounded-lg',
}) => {
  const [imgError, setImgError] = useState(false);

  // Resolve metadata through AGENT_LOGOS_MAP
  const resolvedKey = agentId || agentCode || agent?.id || agent?.codeName || '';
  const meta = AGENT_LOGOS_MAP[resolvedKey] || AGENT_LOGOS_MAP[agent?.id || ''] || AGENT_LOGOS_MAP[agent?.codeName || ''];

  const logoSrc = agent?.logoUrl || meta?.logoUrl;
  const theme = agent?.themeColor || meta?.themeColor || 'cyan';
  const themeStyle = THEME_STYLES[theme] || THEME_STYLES.cyan;
  const FallbackIcon = themeStyle.Icon || Bot;
  const status = agent?.status || 'operational';

  const cfg = SIZE_CONFIGS[size] || SIZE_CONFIGS.md;

  // Render authentic brand vector graphics for frontier AI models
  const renderBrandVector = () => {
    const key = (resolvedKey || agent?.name || '').toLowerCase();

    // Anthropic Claude: Authentic 8-point Sunburst Asterisk
    if (key.includes('claude')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#D97757] text-[#FAF8F5]">
          <svg viewBox="0 0 24 24" fill="currentColor" className={cfg.iconSize}>
            <path d="M12 2C12.5523 2 13 2.44772 13 3V7.58579L16.2426 4.34315C16.6332 3.95262 17.2663 3.95262 17.6569 4.34315C18.0474 4.73367 18.0474 5.36683 17.6569 5.75736L14.4142 9H19C19.5523 9 20 9.44772 20 10C20 10.5523 19.5523 11 19 11H14.4142L17.6569 14.2426C18.0474 14.6332 18.0474 15.2663 17.6569 15.6569C17.2663 16.0474 16.6332 16.0474 16.2426 15.6569L13 12.4142V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V12.4142L7.75736 15.6569C7.36683 16.0474 6.73367 16.0474 6.34315 15.6569C5.95262 15.2663 5.95262 14.6332 6.34315 14.2426L9.58579 11H5C4.44772 11 4 10.5523 4 10C4 9.44772 4.44772 9 5 9H9.58579L6.34315 5.75736C5.95262 5.36683 5.95262 4.73367 6.34315 4.34315C6.73367 3.95262 7.36683 3.95262 7.75736 4.34315L11 7.58579V3C11 2.44772 11.4477 2 12 2Z" />
            <circle cx="12" cy="10" r="1.5" fill="#FAF8F5" />
          </svg>
        </div>
      );
    }

    // OpenAI ChatGPT: Authentic Spiral Rosette
    if (key.includes('chatgpt') || key.includes('gpt') || key.includes('openai')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#10A37F] text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cfg.iconSize}>
            <path d="M19.5 10.5C19.8 9.9 20 9.2 20 8.5C20 6 18 4 15.5 4C14.7 4 13.9 4.2 13.3 4.6C12.7 3.6 11.4 3 10 3C7.8 3 6 4.8 6 7C6 7.4 6.1 7.7 6.2 8C5.2 8.3 4.5 9.1 4.2 10.1C3.5 11 3 12.2 3 13.5C3 16 5 18 7.5 18C7.9 18 8.3 17.9 8.7 17.8C9.3 19.1 10.5 20 12 20C13.8 20 15.3 18.8 15.8 17.2C16.8 17.7 18 17.5 18.9 16.8C20.2 15.8 21 14.2 21 12.5C21 11.8 20.8 11.1 20.5 10.5" />
            <path d="M12 8L15 10V14L12 16L9 14V10L12 8Z" fill="currentColor" fillOpacity="0.25" />
            <path d="M12 8V16M9 10L15 14M15 10L9 14" strokeWidth="1.2" />
          </svg>
        </div>
      );
    }

    // Google Gemini: Authentic 4-point Sparkle Star
    if (key.includes('gemini') || key.includes('google')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#0B0F19] text-white">
          <svg viewBox="0 0 24 24" fill="none" className={cfg.iconSize}>
            <path 
              d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4772 12 22C12 16.4772 16.4772 12 22 12C16.4772 12 12 7.52285 12 2Z" 
              fill="url(#agent-gemini-grad)" 
            />
            <defs>
              <linearGradient id="agent-gemini-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38BDF8" />
                <stop offset="0.5" stopColor="#818CF8" />
                <stop offset="1" stopColor="#C084FC" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
    }

    // Cursor: Authentic 3D Isometric Shaded Cube
    if (key.includes('cursor')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black text-white">
          <svg viewBox="0 0 24 24" fill="none" className={cfg.iconSize}>
            <path d="M12 2.5L20 7.2V16.8L12 21.5L4 16.8V7.2L12 2.5Z" fill="#18181B" stroke="#A1A1AA" strokeWidth="1.2" />
            <path d="M12 2.5V12L20 7.2M12 12L4 7.2M12 12V21.5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 9.5L14.5 13L12 14.5L11 16.5L10 12L11 9.5Z" fill="#38BDF8" />
          </svg>
        </div>
      );
    }

    // Perplexity AI: Authentic Interwoven Turquoise Infinity Asterisk
    if (key.includes('perplexity')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#0d1c1c] text-[#22D3EE]">
          <svg viewBox="0 0 24 24" fill="none" stroke="#22D3EE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cfg.iconSize}>
            <rect x="5" y="5" width="14" height="14" rx="2" stroke="#14B8A6" strokeWidth="1.2" />
            <path d="M12 3V21M3 12H21" stroke="#22D3EE" strokeWidth="2" />
            <circle cx="12" cy="12" r="3" fill="#0D9488" stroke="#5EEAD4" strokeWidth="1.2" />
          </svg>
        </div>
      );
    }

    // GitHub Copilot: Authentic Visor Emblem
    if (key.includes('copilot') || key.includes('github')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#181B2A] text-white">
          <svg viewBox="0 0 24 24" fill="none" className={cfg.iconSize}>
            <rect x="4" y="6" width="16" height="12" rx="6" fill="#6E40C9" />
            <path d="M8 11.5C8 10.1 9.1 9 10.5 9H13.5C14.9 9 16 10.1 16 11.5C16 12.9 14.9 14 13.5 14H10.5C9.1 14 8 12.9 8 11.5Z" fill="#0D1117" />
            <circle cx="10.5" cy="11.5" r="1.5" fill="#38BDF8" />
            <circle cx="13.5" cy="11.5" r="1.5" fill="#38BDF8" />
            <path d="M3 12H4M20 12H21" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    // Midjourney: Authentic Origami Sailboat
    if (key.includes('midjourney')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#070D1E] text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className={cfg.iconSize}>
            <path d="M12 3L18 14H6L12 3Z" fill="#38BDF8" fillOpacity="0.2" stroke="#E0F2FE" strokeWidth="1.4" strokeLinejoin="round" />
            <path d="M12 3V14" stroke="#FFFFFF" strokeWidth="1.4" />
            <path d="M4 17C7 15.5 10 15.5 12 17C14 18.5 17 18.5 20 17" stroke="#38BDF8" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M3 20C6.5 19 9.5 19 12 20C14.5 21 17.5 21 21 20" stroke="#0284C7" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    // ElevenLabs: Authentic Double Bars
    if (key.includes('elevenlabs') || key.includes('eleven')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black text-white">
          <svg viewBox="0 0 24 24" fill="currentColor" className={cfg.iconSize}>
            <rect x="7" y="5" width="3.5" height="14" rx="1.75" fill="#FFFFFF" />
            <rect x="13.5" y="5" width="3.5" height="14" rx="1.75" fill="#FFFFFF" />
          </svg>
        </div>
      );
    }

    // v0 by Vercel: Authentic Delta Polygon
    if (key.includes('v0') || key.includes('vercel')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black text-white">
          <svg viewBox="0 0 24 24" fill="currentColor" className={cfg.iconSize}>
            <polygon points="12 3 22 20 2 20" fill="#FFFFFF" />
          </svg>
        </div>
      );
    }

    // DeepSeek: Authentic Dolphin Leaping Wave
    if (key.includes('deepseek')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#0B1530] text-[#1E6FFF]">
          <svg viewBox="0 0 24 24" fill="none" className={cfg.iconSize}>
            <path 
              d="M20.5 8C19 6.5 16.5 6 14.5 6.8C12.5 7.6 11 9.5 9.5 11C8 12.5 6 13.5 3.5 13.8C4.5 14.8 6 15.5 7.5 15.5C9.5 15.5 11.2 14.3 12.8 13C14.4 11.7 16.2 10.5 18.2 10.8C19.5 11 20.8 12 21.5 13.2C21.8 12 21.5 9.5 20.5 8Z" 
              fill="#1E6FFF" 
            />
            <path 
              d="M3.5 16C5.5 16.2 7.5 17.5 9.5 17.5C11.5 17.5 13.5 16 15.5 16C17.5 16 19.5 17.2 21.5 17.2" 
              stroke="#60A5FA" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
            />
            <circle cx="17.5" cy="8.5" r="1" fill="#FFFFFF" />
          </svg>
        </div>
      );
    }

    // Meta Llama: Authentic Meta Infinity Loop
    if (key.includes('llama') || key.includes('meta')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#061B3B] text-[#0081FB]">
          <svg viewBox="0 0 24 24" fill="none" className={cfg.iconSize}>
            <path 
              d="M7.5 7.5C5 7.5 3 9.5 3 12C3 14.5 5 16.5 7.5 16.5C10 16.5 11.5 14.5 12 13.5C12.5 14.5 14 16.5 16.5 16.5C19 16.5 21 14.5 21 12C21 9.5 19 7.5 16.5 7.5C14 7.5 12.5 9.5 12 10.5C11.5 9.5 10 7.5 7.5 7.5Z" 
              stroke="#0081FB" 
              strokeWidth="2.4" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            <path 
              d="M7.5 9C6 9 5 10.2 5 12C5 13.8 6 15 7.5 15C9.2 15 10.5 13.5 12 12C10.5 10.5 9.2 9 7.5 9Z" 
              fill="#38BDF8" 
              fillOpacity="0.3" 
            />
          </svg>
        </div>
      );
    }

    // Mistral AI: Authentic Stepped Pixel Bricks
    if (key.includes('mistral') || key.includes('codestral')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#1A0E05] text-[#FF7000]">
          <svg viewBox="0 0 24 24" fill="currentColor" className={cfg.iconSize}>
            <rect x="3" y="4" width="4" height="4" rx="0.5" fill="#FF7000" />
            <rect x="17" y="4" width="4" height="4" rx="0.5" fill="#FF7000" />
            <rect x="7" y="8" width="4" height="4" rx="0.5" fill="#FFA000" />
            <rect x="13" y="8" width="4" height="4" rx="0.5" fill="#FFA000" />
            <rect x="7" y="12" width="10" height="4" rx="0.5" fill="#FFC107" />
            <rect x="3" y="16" width="4" height="4" rx="0.5" fill="#FF7000" />
            <rect x="17" y="16" width="4" height="4" rx="0.5" fill="#FF7000" />
          </svg>
        </div>
      );
    }

    // xAI Grok: Minimalist Slash-X
    if (key.includes('grok') || key.includes('xai')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-black text-white">
          <svg viewBox="0 0 24 24" fill="currentColor" className={cfg.iconSize}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
      );
    }

    // Cohere: Coral Cell Cluster
    if (key.includes('cohere') || key.includes('command')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#150F18] text-white">
          <svg viewBox="0 0 24 24" fill="none" className={cfg.iconSize}>
            <circle cx="8" cy="14" r="5" fill="#E26D5C" />
            <circle cx="15" cy="9" r="4.5" fill="#38B2AC" />
            <circle cx="16" cy="16" r="3.5" fill="#D4AF37" />
          </svg>
        </div>
      );
    }

    // Hugging Face: Warm Smiling Face
    if (key.includes('huggingface') || key.includes('hf')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#2B2308] text-[#FFD21E]">
          <svg viewBox="0 0 24 24" fill="none" className={cfg.iconSize}>
            <circle cx="12" cy="12" r="9" fill="#FFD21E" />
            <circle cx="9" cy="10" r="1.5" fill="#1F2937" />
            <circle cx="15" cy="10" r="1.5" fill="#1F2937" />
            <path d="M8.5 14C9.5 15.5 11 16 12 16C13 16 14.5 15.5 15.5 14" stroke="#1F2937" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M4 14C3.5 15.5 4.5 17 6 17" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M20 14C20.5 15.5 19.5 17 18 17" stroke="#F59E0B" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    // FLUX: Geometric Hex Prism
    if (key.includes('flux') || key.includes('blackforest')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-[#111116] text-[#F59E0B]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cfg.iconSize}>
            <polygon points="12 2 21 7 21 17 12 22 3 17 3 7" stroke="#F59E0B" fill="#F59E0B" fillOpacity="0.2" />
            <line x1="12" y1="2" x2="12" y2="12" stroke="#FBBF24" />
            <line x1="12" y1="12" x2="21" y2="17" stroke="#FBBF24" />
            <line x1="12" y1="12" x2="3" y2="17" stroke="#FBBF24" />
          </svg>
        </div>
      );
    }

    return null;
  };

  const brandVector = renderBrandVector();

  return (
    <div 
      className={`relative shrink-0 flex items-center justify-center ${cfg.container} ${className}`}
      title={agent?.name || meta?.name || 'Autonomous AI Agent'}
    >
      {/* Outer ambient glow */}
      {showGlow && (
        <div 
          className={`absolute -inset-0.5 ${rounded} opacity-60 group-hover:opacity-100 transition-opacity blur-[6px] pointer-events-none ${themeStyle.glow}`} 
        />
      )}

      {/* Main Container */}
      <div 
        className={`relative w-full h-full ${rounded} overflow-hidden border ${themeStyle.border} ${themeStyle.borderHover} bg-gradient-to-b ${themeStyle.bgGradient} transition-all duration-300 flex items-center justify-center shadow-lg`}
      >
        {brandVector ? (
          brandVector
        ) : logoSrc && !imgError ? (
          <img
            src={logoSrc}
            alt={agent?.name || meta?.name || 'Agent Logo'}
            onError={() => setImgError(true)}
            className={`w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <FallbackIcon className={`${cfg.iconSize} ${themeStyle.accent}`} />
          </div>
        )}

        {/* Tech scanline overlay for cyber aesthetic */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:100%_3px] pointer-events-none opacity-40" />
      </div>

      {/* Optional Live Status Dot */}
      {showStatusDot && (
        <span 
          className={`absolute -bottom-0.5 -right-0.5 ${cfg.dotSize} rounded-full ring-2 ring-[#07080c] ${
            status === 'operational'
              ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
              : status === 'busy'
              ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
              : 'bg-blue-400 shadow-[0_0_8px_#3b82f6]'
          }`}
        />
      )}
    </div>
  );
};
