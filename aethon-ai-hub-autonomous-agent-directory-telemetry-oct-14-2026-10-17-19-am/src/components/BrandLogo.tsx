import React from 'react';
import logoUrl from '../assets/images/ai_directory_logo_1791950948453.jpg';
import { reportAppError } from '../utils/errorReporting';

export interface BrandLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  withGlow?: boolean;
  withRing?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  className = '',
  withGlow = true,
  withRing = true,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 rounded-lg',
    sm: 'w-8 h-8 rounded-xl',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-2xl',
  };

  const glowClasses = withGlow
    ? 'shadow-[0_0_15px_rgba(56,189,248,0.35)] group-hover:shadow-[0_0_25px_rgba(147,51,234,0.5)]'
    : '';

  const ringClasses = withRing
    ? 'border border-cyan-400/40 group-hover:border-purple-400/60 ring-1 ring-white/10'
    : '';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden bg-neutral-950 transition-all duration-300 ${sizeClasses[size]} ${glowClasses} ${ringClasses} ${className}`}
    >
      <img
        src={logoUrl}
        alt="AI Directory Zmpto Tool Logo"
        onError={() => reportAppError('Brand logo image', new Error('The brand logo could not be loaded.'))}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Subtle glossy sheen highlight */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-white/10 pointer-events-none" />
    </div>
  );
};

export default BrandLogo;
