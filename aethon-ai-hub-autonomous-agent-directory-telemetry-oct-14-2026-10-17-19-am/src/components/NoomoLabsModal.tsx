import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Zap, 
  Layers, 
  Terminal, 
  Volume2, 
  VolumeX, 
  RotateCcw,
  ExternalLink,
  Compass
} from 'lucide-react';
import { NoomoLabs3D, CreatureColorTheme } from './NoomoLabs3D';

interface NoomoLabsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NoomoLabsModal: React.FC<NoomoLabsModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTheme, setActiveTheme] = useState<CreatureColorTheme>('bioluminescent');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-xl animate-fadeIn">
      {/* Container Frame */}
      <div className="relative w-full h-full max-w-7xl max-h-[92vh] bg-[#05060b] border border-white/20 rounded-none sm:rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Top Header Bar */}
        <div className="relative z-30 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/10 bg-[#070912]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 font-mono text-xs">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span className="font-bold tracking-wider">NOOMO LABS 3D</span>
            </div>
            <span className="text-neutral-400 text-xs hidden md:inline">·</span>
            <span className="text-xs font-mono text-neutral-300 hidden md:inline">
              Interactive WebGL Creature & Organic Fluid Engine
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
              Inspired by <strong className="text-white">labs.noomoagency.com</strong>
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-neutral-400 hover:text-white transition-colors cursor-pointer bg-white/5"
              title="Close 3D Lab"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 3D WebGL Interactive Viewport */}
        <div className="relative flex-1 w-full h-full bg-gradient-to-b from-[#05060b] via-[#070914] to-[#04050a] overflow-hidden">
          <NoomoLabs3D 
            interactive={true} 
            showControls={true} 
            initialTheme={activeTheme}
            className="w-full h-full"
          />

          {/* Top Left Floating Spec Card */}
          <div className="absolute top-4 left-4 z-20 pointer-events-none hidden sm:block max-w-xs">
            <div className="p-3 bg-[#070913]/70 backdrop-blur-md border border-white/10 rounded-xl space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between text-neutral-400">
                <span>SIMULATION</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  60 FPS ACTIVE
                </span>
              </div>
              <div className="text-neutral-200 text-xs font-sans font-medium">
                Autonomous Organism & Cursor Kinetics
              </div>
              <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                Move cursor to guide the creature through 3D fluid currents. Click to release shockwave impulses and bioluminescent dust.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
