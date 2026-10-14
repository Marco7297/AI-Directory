import React, { useState, useId, useMemo } from 'react';
import { calculateSparkline, Point } from '../utils/svgSparkline';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  label?: string;
  unit?: string;
  variant?: 'cpu' | 'memory' | 'latency' | 'custom';
  strokeColor?: string;
  fillColor?: string;
  showCurrentValue?: boolean;
  showTrendDelta?: boolean;
  className?: string;
  formatValue?: (val: number) => string;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  width = 76,
  height = 22,
  label,
  unit = '%',
  variant = 'cpu',
  strokeColor,
  fillColor,
  showCurrentValue = true,
  showTrendDelta = true,
  className = '',
  formatValue,
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<Point | null>(null);
  const gradientId = useId();

  // Color profiles based on variant
  const colors = useMemo(() => {
    switch (variant) {
      case 'memory':
        return {
          stroke: strokeColor || '#c084fc', // purple-400
          glow: 'rgba(192, 132, 252, 0.45)',
          fillTop: fillColor || 'rgba(192, 132, 252, 0.28)',
          fillBottom: 'rgba(192, 132, 252, 0.0)',
          badgeText: 'text-purple-300',
          dot: '#e879f9',
        };
      case 'latency':
        return {
          stroke: strokeColor || '#fbbf24', // amber-400
          glow: 'rgba(251, 191, 36, 0.45)',
          fillTop: fillColor || 'rgba(251, 191, 36, 0.25)',
          fillBottom: 'rgba(251, 191, 36, 0.0)',
          badgeText: 'text-amber-300',
          dot: '#f59e0b',
        };
      case 'cpu':
      default:
        return {
          stroke: strokeColor || '#38bdf8', // sky-400
          glow: 'rgba(56, 189, 248, 0.45)',
          fillTop: fillColor || 'rgba(56, 189, 248, 0.28)',
          fillBottom: 'rgba(56, 189, 248, 0.0)',
          badgeText: 'text-sky-300',
          dot: '#60a5fa',
        };
    }
  }, [variant, strokeColor, fillColor]);

  const geometry = useMemo(() => {
    return calculateSparkline(data, width, height, 3);
  }, [data, width, height]);

  if (!data || data.length === 0) return null;

  const currentVal = geometry.current;
  const delta = geometry.delta;
  const isPositiveDelta = delta >= 0;

  const displayVal = (val: number) => {
    if (formatValue) return formatValue(val);
    if (unit === '%') return `${Math.round(val)}%`;
    if (unit === 'GB') return `${val.toFixed(1)} GB`;
    return `${val.toFixed(1)}${unit}`;
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Find closest point
    let closest: Point | null = null;
    let minDist = Infinity;
    
    for (const p of geometry.points) {
      const dist = Math.abs(p.x - mouseX);
      if (dist < minDist) {
        minDist = dist;
        closest = p;
      }
    }
    
    setHoveredPoint(closest);
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  const activePoint = hoveredPoint || geometry.points[geometry.points.length - 1];

  return (
    <div className={`inline-flex items-center gap-2 group select-none ${className}`}>
      {/* Label and Current Value text */}
      {(label || showCurrentValue) && (
        <div className="flex flex-col text-[10px] font-mono leading-tight">
          <div className="flex items-center gap-1">
            {label && <span className="text-neutral-400 uppercase tracking-wider text-[9px]">{label}</span>}
            {showCurrentValue && (
              <span className={`font-semibold ${colors.badgeText}`}>
                {hoveredPoint ? displayVal(hoveredPoint.value) : displayVal(currentVal)}
              </span>
            )}
          </div>
          
          {showTrendDelta && (
            <div className="flex items-center gap-0.5 text-[8px]">
              <span className={isPositiveDelta ? 'text-amber-400' : 'text-emerald-400'}>
                {isPositiveDelta ? '▲' : '▼'} {Math.abs(delta).toFixed(1)}{unit}
              </span>
            </div>
          )}
        </div>
      )}

      {/* SVG Canvas Sparkline */}
      <div className="relative">
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="overflow-visible cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Linear gradient for sparkline area fill */}
            <linearGradient id={`sparkline-grad-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.fillTop} />
              <stop offset="100%" stopColor={colors.fillBottom} />
            </linearGradient>

            {/* Subtle glow filter */}
            <filter id={`sparkline-glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor={colors.glow} />
            </filter>
          </defs>

          {/* Area fill path */}
          {geometry.areaPath && (
            <path
              d={geometry.areaPath}
              fill={`url(#sparkline-grad-${gradientId})`}
              className="transition-opacity duration-200"
            />
          )}

          {/* Base sparkline curve stroke */}
          {geometry.linePath && (
            <path
              d={geometry.linePath}
              fill="none"
              stroke={colors.stroke}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#sparkline-glow-${gradientId})`}
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* Vertical cursor guideline when hovering */}
          {hoveredPoint && (
            <line
              x1={hoveredPoint.x}
              y1={0}
              x2={hoveredPoint.x}
              y2={height}
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          )}

          {/* Active / Last point indicator dot */}
          {activePoint && (
            <g>
              {!hoveredPoint && (
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="3.5"
                  fill="none"
                  stroke={colors.dot}
                  strokeWidth="1"
                  className="animate-ping opacity-75"
                />
              )}
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="2.2"
                fill={colors.dot}
                stroke="#0c0d14"
                strokeWidth="1"
              />
            </g>
          )}
        </svg>

        {/* Micro Tooltip on Hover */}
        {hoveredPoint && (
          <div
            className="absolute -top-7 transform -translate-x-1/2 pointer-events-none z-30 px-1.5 py-0.5 rounded bg-black/90 border border-white/20 text-[9px] font-mono text-white shadow-lg whitespace-nowrap"
            style={{ left: `${hoveredPoint.x}px` }}
          >
            {displayVal(hoveredPoint.value)}
          </div>
        )}
      </div>
    </div>
  );
};
