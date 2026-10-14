import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Activity, 
  Clock, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  Info, 
  Calendar, 
  Filter, 
  Layers,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { AgentLogo } from './AgentLogo';

export interface DayActivityRecord {
  date: string;
  dayIndex: number;
  dayLabel: string;
  agentId: string;
  agentCode: string;
  agentName: string;
  uptime: number; // percentage e.g. 99.98
  latency: number; // ms e.g. 5.8
  p99Latency: number; // ms
  totalRequests: number;
  status: 'operational' | 'degraded' | 'maintenance' | 'spike';
  incidentNote?: string;
}

export interface AgentMeta {
  id: string;
  code: string;
  name: string;
  category: string;
  baseLatency: number;
  baseUptime: number;
}

export const HEATMAP_AGENTS: AgentMeta[] = [
  { id: 'claude-3-5', code: 'CLAUDE-3.5', name: 'Claude 3.5 Sonnet', category: 'Reasoning & Coding', baseLatency: 5.2, baseUptime: 99.98 },
  { id: 'chatgpt-4o', code: 'GPT-4O-OMNI', name: 'ChatGPT Plus (GPT-4o)', category: 'Omni-Modal Swarm', baseLatency: 4.8, baseUptime: 99.99 },
  { id: 'gemini-1-5-pro', code: 'GEMINI-PRO', name: 'Google Gemini 1.5 Pro', category: 'Multimodal 2M Context', baseLatency: 6.1, baseUptime: 99.96 },
  { id: 'cursor-composer', code: 'CURSOR-AI', name: 'Cursor AI Composer', category: 'Repository Synthesis', baseLatency: 7.2, baseUptime: 99.95 },
  { id: 'perplexity-pro', code: 'PERPLEXITY', name: 'Perplexity Pro', category: 'Real-time Grounding', baseLatency: 8.4, baseUptime: 99.93 },
  { id: 'copilot-workspace', code: 'COPILOT', name: 'GitHub Copilot Workspace', category: 'Issue-to-PR Engine', baseLatency: 6.8, baseUptime: 99.97 }
];

// Generate deterministic 30-day historical data
export function generate30DayHistoricalData(): DayActivityRecord[] {
  const records: DayActivityRecord[] = [];
  const today = new Date();

  // Pseudo-random seed function for consistent repeatable realism
  const pseudoRand = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  HEATMAP_AGENTS.forEach((agent, agentIdx) => {
    for (let dayOffset = 29; dayOffset >= 0; dayOffset--) {
      const d = new Date(today);
      d.setDate(today.getDate() - dayOffset);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayIndex = 30 - dayOffset; // 1 to 30

      const seed = agentIdx * 100 + dayOffset * 7;
      const r1 = pseudoRand(seed);
      const r2 = pseudoRand(seed + 1);
      const r3 = pseudoRand(seed + 2);

      // Create realistic occasional anomalies
      let uptime = agent.baseUptime;
      let latency = agent.baseLatency + (r1 - 0.5) * 1.6;
      let status: DayActivityRecord['status'] = 'operational';
      let incidentNote: string | undefined = undefined;

      // Deterministic slight incidents on particular days
      if (agent.id === 'cursor-composer' && dayIndex === 14) {
        uptime = 98.65;
        latency = 19.4;
        status = 'degraded';
        incidentNote = 'Codebase AST indexing surge across heavy monorepos; auto-balanced at 04:12 UTC.';
      } else if (agent.id === 'gemini-1-5-pro' && dayIndex === 8) {
        uptime = 99.12;
        latency = 22.8;
        status = 'spike';
        incidentNote = 'High sensory video concurrency surge (12.4k parallel streams).';
      } else if (agent.id === 'chatgpt-4o' && dayIndex === 21) {
        uptime = 99.40;
        latency = 12.1;
        status = 'maintenance';
        incidentNote = 'Scheduled cluster-wide distributed token optimizer upgrade.';
      } else if (agent.id === 'claude-3-5' && dayIndex === 27) {
        uptime = 99.82;
        latency = 9.8;
        status = 'operational';
        incidentNote = 'Upstream API quota balancing; resolved seamlessly via adaptive fallback.';
      } else if (r2 > 0.94) {
        uptime = Number((agent.baseUptime - r3 * 0.18).toFixed(2));
        latency = Number((agent.baseLatency + r3 * 3.5).toFixed(1));
        status = 'operational';
      } else {
        uptime = Number((agent.baseUptime - (r3 > 0.8 ? 0.04 : 0.01)).toFixed(2));
        latency = Number(Math.max(2.1, latency).toFixed(1));
      }

      const p99Latency = Number((latency * (1.35 + r1 * 0.4)).toFixed(1));
      const totalRequests = Math.round(28000 + r2 * 54000);

      records.push({
        date: dateStr,
        dayIndex,
        dayLabel,
        agentId: agent.id,
        agentCode: agent.code,
        agentName: agent.name,
        uptime,
        latency,
        p99Latency,
        totalRequests,
        status,
        incidentNote
      });
    }
  });

  return records;
}

interface AgentActivityHeatmapProps {
  onSelectAgent?: (agentCode: string) => void;
  className?: string;
}

export const AgentActivityHeatmap: React.FC<AgentActivityHeatmapProps> = ({
  onSelectAgent,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // View Controls
  const [metric, setMetric] = useState<'uptime' | 'latency'>('uptime');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState<string>('ALL');
  const [hoveredCell, setHoveredCell] = useState<DayActivityRecord | null>(null);
  const [pinnedCell, setPinnedCell] = useState<DayActivityRecord | null>(null);
  const [timeWindow, setTimeWindow] = useState<'30' | '14' | '7'>('30');

  // Master historical dataset
  const dataset = useMemo(() => generate30DayHistoricalData(), []);

  // Filtered dataset based on time window and agent selection
  const windowDays = parseInt(timeWindow, 10);
  const minDayIndex = 30 - windowDays + 1;

  const filteredData = useMemo(() => {
    return dataset.filter(d => {
      const matchesTime = d.dayIndex >= minDayIndex;
      const matchesAgent = selectedAgentFilter === 'ALL' || d.agentId === selectedAgentFilter;
      return matchesTime && matchesAgent;
    });
  }, [dataset, minDayIndex, selectedAgentFilter]);

  // Aggregate Metrics for Header
  const summaryMetrics = useMemo(() => {
    if (filteredData.length === 0) return { avgUptime: 100, avgLatency: 5, zeroIncidentDays: 30, totalReqs: 0 };
    const avgUptime = filteredData.reduce((acc, c) => acc + c.uptime, 0) / filteredData.length;
    const avgLatency = filteredData.reduce((acc, c) => acc + c.latency, 0) / filteredData.length;
    const degradedCount = filteredData.filter(c => c.status !== 'operational').length;
    const totalReqs = filteredData.reduce((acc, c) => acc + c.totalRequests, 0);

    return {
      avgUptime: Number(avgUptime.toFixed(3)),
      avgLatency: Number(avgLatency.toFixed(1)),
      incidentsCount: degradedCount,
      totalReqs
    };
  }, [filteredData]);

  // D3 Rendering
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const containerWidth = containerRef.current.clientWidth || 640;
    const isSingleAgent = selectedAgentFilter !== 'ALL';

    const agentsInScope = isSingleAgent
      ? HEATMAP_AGENTS.filter(a => a.id === selectedAgentFilter)
      : HEATMAP_AGENTS;

    // Distinct days in window
    const days = Array.from(new Set(filteredData.map(d => d.dayIndex))).sort((a, b) => a - b);

    // Margins
    const margin = {
      top: 32,
      right: 20,
      bottom: 40,
      left: isSingleAgent ? 110 : 95
    };

    const rowHeight = isSingleAgent ? 64 : 32;
    const innerHeight = agentsInScope.length * rowHeight;
    const innerWidth = containerWidth - margin.left - margin.right;
    const totalHeight = innerHeight + margin.top + margin.bottom;

    svg
      .attr('width', containerWidth)
      .attr('height', totalHeight)
      .attr('viewBox', `0 0 ${containerWidth} ${totalHeight}`);

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // D3 Scales
    const xScale = d3
      .scaleBand<number>()
      .domain(days)
      .range([0, innerWidth])
      .padding(0.12);

    const yScale = d3
      .scaleBand<string>()
      .domain(agentsInScope.map(a => a.code))
      .range([0, innerHeight])
      .padding(0.18);

    // Color Scales
    // Uptime: 98.5% (red/amber) -> 99.5% (teal) -> 100% (bright emerald)
    const uptimeColorScale = d3
      .scaleLinear<string>()
      .domain([98.5, 99.2, 99.7, 99.95, 100])
      .range(['#ef4444', '#f59e0b', '#06b6d4', '#10b981', '#34d399'])
      .clamp(true);

    // Latency: 3ms (bright cyan) -> 8ms (blue) -> 14ms (amber) -> 24ms+ (rose red)
    const latencyColorScale = d3
      .scaleLinear<string>()
      .domain([3.0, 7.0, 12.0, 20.0])
      .range(['#06b6d4', '#3b82f6', '#f59e0b', '#f43f5e'])
      .clamp(true);

    // Defs for gradients & filters
    const defs = svg.append('defs');
    
    // Cell drop glow filter
    const filter = defs.append('filter')
      .attr('id', 'cell-glow')
      .attr('x', '-20%')
      .attr('y', '-20%')
      .attr('width', '140%')
      .attr('height', '140%');
    filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'blur');
    filter.append('feComposite').attr('in', 'SourceGraphic').attr('in2', 'blur').attr('operator', 'over');

    // Grid lines / Background slots
    g.selectAll('.slot-bg')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'slot-bg')
      .attr('x', d => xScale(d.dayIndex) || 0)
      .attr('y', d => yScale(d.agentCode) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', 2.5)
      .attr('fill', '#11131c');

    // Heatmap Active Rects
    const cells = g.selectAll('.heatmap-cell')
      .data(filteredData)
      .enter()
      .append('rect')
      .attr('class', 'heatmap-cell transition-all cursor-pointer')
      .attr('x', d => xScale(d.dayIndex) || 0)
      .attr('y', d => yScale(d.agentCode) || 0)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('rx', 2.5)
      .attr('fill', d => {
        if (metric === 'uptime') {
          return uptimeColorScale(d.uptime);
        } else {
          return latencyColorScale(d.latency);
        }
      })
      .attr('opacity', 0.88)
      .attr('stroke', d => {
        if (pinnedCell && pinnedCell.agentCode === d.agentCode && pinnedCell.dayIndex === d.dayIndex) {
          return '#ffffff';
        }
        if (d.status !== 'operational') {
          return '#f59e0b';
        }
        return 'transparent';
      })
      .attr('stroke-width', d => {
        if (pinnedCell && pinnedCell.agentCode === d.agentCode && pinnedCell.dayIndex === d.dayIndex) {
          return 2;
        }
        return d.status !== 'operational' ? 1.5 : 0;
      });

    // Animate cells in with a subtle stagger
    cells
      .attr('transform', 'scale(0.92)')
      .attr('transform-origin', d => `${(xScale(d.dayIndex) || 0) + xScale.bandwidth() / 2}px ${(yScale(d.agentCode) || 0) + yScale.bandwidth() / 2}px`)
      .transition()
      .duration(350)
      .delay((_, i) => (i % days.length) * 12)
      .attr('transform', 'scale(1)');

    // Cell interactions
    cells
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .attr('opacity', 1)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2);
        setHoveredCell(d);
      })
      .on('mouseleave', function (event, d) {
        const isPinned = pinnedCell && pinnedCell.agentCode === d.agentCode && pinnedCell.dayIndex === d.dayIndex;
        d3.select(this)
          .attr('opacity', 0.88)
          .attr('stroke', isPinned ? '#ffffff' : d.status !== 'operational' ? '#f59e0b' : 'transparent')
          .attr('stroke-width', isPinned ? 2 : d.status !== 'operational' ? 1.5 : 0);
        setHoveredCell(null);
      })
      .on('click', function (event, d) {
        setPinnedCell(prev => (prev?.agentCode === d.agentCode && prev?.dayIndex === d.dayIndex ? null : d));
        if (onSelectAgent) {
          onSelectAgent(d.agentCode);
        }
      });

    // Special Incident Markers (Small warning dots on top of degraded cells)
    const incidents = filteredData.filter(d => d.status !== 'operational');
    g.selectAll('.incident-marker')
      .data(incidents)
      .enter()
      .append('circle')
      .attr('class', 'incident-marker pointer-events-none')
      .attr('cx', d => (xScale(d.dayIndex) || 0) + xScale.bandwidth() - 4)
      .attr('cy', d => (yScale(d.agentCode) || 0) + 4)
      .attr('r', 2)
      .attr('fill', '#f59e0b');

    // Y Axis: Agent Code Labels
    const yAxisGroup = g.append('g').attr('class', 'y-axis');

    agentsInScope.forEach(agent => {
      const yPos = (yScale(agent.code) || 0) + yScale.bandwidth() / 2;
      const textGroup = yAxisGroup
        .append('g')
        .attr('transform', `translate(-12, ${yPos})`)
        .attr('class', 'cursor-pointer group')
        .on('click', () => {
          setSelectedAgentFilter(prev => prev === agent.id ? 'ALL' : agent.id);
        });

      textGroup
        .append('text')
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .attr('class', 'font-mono text-[11px] font-semibold fill-neutral-300 hover:fill-blue-400 transition-colors')
        .text(agent.code);

      if (isSingleAgent) {
        textGroup
          .append('text')
          .attr('y', 14)
          .attr('text-anchor', 'end')
          .attr('dominant-baseline', 'middle')
          .attr('class', 'font-mono text-[9px] fill-neutral-500')
          .text(agent.category);
      }
    });

    // X Axis: Day Labels (Show every 5 days or first/mid/last to avoid clutter)
    const xAxisGroup = g
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${innerHeight + 10})`);

    const dayLabelsToShow = days.filter((d, idx) => {
      if (days.length <= 7) return true;
      if (days.length <= 14) return idx % 2 === 0 || idx === days.length - 1;
      return idx === 0 || idx % 5 === 0 || idx === days.length - 1;
    });

    dayLabelsToShow.forEach(dayIdx => {
      const rec = filteredData.find(d => d.dayIndex === dayIdx);
      if (!rec) return;

      const xPos = (xScale(dayIdx) || 0) + xScale.bandwidth() / 2;
      const textGroup = xAxisGroup.append('g').attr('transform', `translate(${xPos}, 0)`);

      textGroup
        .append('line')
        .attr('x1', 0)
        .attr('x2', 0)
        .attr('y1', -6)
        .attr('y2', 0)
        .attr('stroke', 'rgba(255,255,255,0.15)');

      textGroup
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('y', 14)
        .attr('class', 'font-mono text-[9px] fill-neutral-500')
        .text(rec.dayLabel);
    });

    // Top Header Axis Label
    g.append('text')
      .attr('x', 0)
      .attr('y', -14)
      .attr('class', 'font-mono text-[9px] uppercase tracking-wider fill-neutral-500')
      .text(`T-30D Historical Matrix · Mode: ${metric.toUpperCase()}`);

    g.append('text')
      .attr('x', innerWidth)
      .attr('y', -14)
      .attr('text-anchor', 'end')
      .attr('class', 'font-mono text-[9px] uppercase tracking-wider fill-emerald-400')
      .text(`Today (Latest Synchronized)`);

  }, [filteredData, metric, selectedAgentFilter, pinnedCell, windowDays]);

  const activeInspectRecord = hoveredCell || pinnedCell;

  return (
    <div className={`p-4 bg-[#0a0b12] border border-white/10 rounded-lg text-neutral-200 ${className}`}>
      {/* Heatmap Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-xs font-bold tracking-[0.18em] uppercase text-white font-mono">
              30-DAY OPERATIONAL HEATMAP
            </h3>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40">
              D3.JS POWERED
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-0.5">
            Agent uptime matrix & latency distribution over the past 30 days
          </p>
        </div>

        {/* Metric & Time Range Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metric Toggle */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setMetric('uptime')}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                metric === 'uptime'
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Show uptime percentage across days"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Uptime (%)</span>
            </button>
            <button
              onClick={() => setMetric('latency')}
              className={`px-2 py-1 rounded transition-colors flex items-center gap-1 ${
                metric === 'latency'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
              title="Show latency trends across days"
            >
              <Zap className="w-3 h-3" />
              <span>Latency (ms)</span>
            </button>
          </div>

          {/* Time Window Selector */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded p-0.5 text-[11px] font-mono">
            {(['30', '14', '7'] as const).map(w => (
              <button
                key={w}
                onClick={() => setTimeWindow(w)}
                className={`px-2 py-1 rounded transition-colors ${
                  timeWindow === w
                    ? 'bg-white/15 text-white font-bold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {w}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3 text-xs font-mono">
        <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded">
          <div className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            30D Mean Uptime
          </div>
          <div className="text-base font-bold text-emerald-400 mt-0.5">
            {summaryMetrics.avgUptime}%
          </div>
        </div>

        <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded">
          <div className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
            <Clock className="w-3 h-3 text-blue-400" />
            30D Mean Latency
          </div>
          <div className="text-base font-bold text-blue-300 mt-0.5">
            {summaryMetrics.avgLatency}ms
          </div>
        </div>

        <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded">
          <div className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            Anomalies
          </div>
          <div className="text-base font-bold text-neutral-200 mt-0.5">
            {summaryMetrics.incidentsCount} flagged
          </div>
        </div>

        <div className="p-2.5 bg-white/[0.02] border border-white/5 rounded">
          <div className="text-[10px] text-neutral-500 uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 text-purple-400" />
            Total Dispatches
          </div>
          <div className="text-base font-bold text-neutral-200 mt-0.5">
            {(summaryMetrics.totalReqs / 1000).toFixed(0)}k calls
          </div>
        </div>
      </div>

      {/* Filter by Agent Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-[10px] font-mono scrollbar-none">
        <span className="text-neutral-500 uppercase tracking-wider flex items-center gap-1 shrink-0">
          <Filter className="w-2.5 h-2.5" /> Agent:
        </span>
        <button
          onClick={() => setSelectedAgentFilter('ALL')}
          className={`px-2 py-0.5 rounded transition-colors shrink-0 ${
            selectedAgentFilter === 'ALL'
              ? 'bg-blue-600 text-white font-semibold'
              : 'bg-white/5 text-neutral-400 hover:text-white'
          }`}
        >
          All (Matrix)
        </button>
        {HEATMAP_AGENTS.map(agent => (
          <button
            key={agent.id}
            onClick={() => setSelectedAgentFilter(prev => prev === agent.id ? 'ALL' : agent.id)}
            className={`px-2 py-0.5 rounded transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedAgentFilter === agent.id
                ? 'bg-blue-600 text-white font-semibold'
                : 'bg-white/5 text-neutral-400 hover:text-white'
            }`}
          >
            <AgentLogo agentCode={agent.code} size="xs" showGlow={false} />
            <span>{agent.code}</span>
          </button>
        ))}
      </div>

      {/* D3 Heatmap Canvas */}
      <div ref={containerRef} className="relative w-full overflow-x-auto py-2">
        <svg ref={svgRef} className="w-full overflow-visible" />
      </div>

      {/* D3 Color Ramp Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5 text-[10px] font-mono text-neutral-400">
        <div className="flex items-center gap-2">
          <span>Scale ({metric === 'uptime' ? 'Uptime %' : 'Latency ms'}):</span>
          {metric === 'uptime' ? (
            <div className="flex items-center gap-1.5">
              <span className="text-red-400">&lt;98.5%</span>
              <div className="w-24 h-2 rounded bg-gradient-to-r from-red-500 via-amber-500 via-cyan-400 to-emerald-400" />
              <span className="text-emerald-400">100.0%</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="text-cyan-400">&lt;3ms (Fast)</span>
              <div className="w-24 h-2 rounded bg-gradient-to-r from-cyan-400 via-blue-500 via-amber-500 to-rose-500" />
              <span className="text-rose-400">&gt;20ms (Spike)</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-neutral-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Incident Flag
          </span>
          <span className="flex items-center gap-1">
            <span>Hover/Click for Day Audit</span>
          </span>
        </div>
      </div>

      {/* Interactive Detail Card for Hovered or Pinned Day */}
      {activeInspectRecord ? (
        <div className="mt-3 p-3 bg-gradient-to-r from-blue-950/30 to-purple-950/20 border border-blue-500/30 rounded-lg text-xs font-mono animate-fadeIn">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <AgentLogo agentCode={activeInspectRecord.agentCode} size="sm" showStatusDot={true} className="mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">{activeInspectRecord.agentCode}</span>
                  <span className="text-neutral-400">·</span>
                  <span className="text-white font-semibold">{activeInspectRecord.dayLabel}</span>
                  <span className="text-neutral-500 text-[10px]">({activeInspectRecord.date})</span>
                  {activeInspectRecord.status !== 'operational' && (
                    <span className="text-[10px] uppercase px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-700/50 rounded">
                      {activeInspectRecord.status}
                    </span>
                  )}
                </div>
                <div className="text-neutral-400 text-[11px] mt-0.5">
                  {activeInspectRecord.agentName}
                </div>
              </div>
            </div>

            {pinnedCell && (
              <button
                onClick={() => setPinnedCell(null)}
                className="text-[10px] text-neutral-400 hover:text-white px-1.5 py-0.5 bg-white/5 rounded"
              >
                Clear Pin
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-white/10 text-[11px]">
            <div>
              <span className="text-neutral-500 block text-[10px]">Uptime:</span>
              <span className={`font-semibold ${activeInspectRecord.uptime >= 99.8 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {activeInspectRecord.uptime}%
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Avg Latency:</span>
              <span className="text-blue-300 font-semibold">
                {activeInspectRecord.latency}ms
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">P99 Latency:</span>
              <span className="text-purple-300 font-semibold">
                {activeInspectRecord.p99Latency}ms
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Processed:</span>
              <span className="text-neutral-200 font-semibold">
                {activeInspectRecord.totalRequests.toLocaleString()} reqs
              </span>
            </div>
          </div>

          {activeInspectRecord.incidentNote && (
            <div className="mt-2 text-[11px] text-amber-300/90 bg-amber-950/30 p-2 rounded border border-amber-800/30 flex items-start gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>{activeInspectRecord.incidentNote}</span>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 p-2.5 bg-white/[0.015] border border-white/5 rounded text-[11px] font-mono text-neutral-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-neutral-400" />
            <span>Hover or tap any cell in the 30-day matrix to inspect sub-network metrics and trace history.</span>
          </div>
          <span className="text-[10px] text-neutral-400">Click to pin</span>
        </div>
      )}
    </div>
  );
};
