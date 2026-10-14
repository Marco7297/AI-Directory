import React, { useState, useEffect } from 'react';
import { X, Activity, Radio, Cpu, RefreshCw, Zap, Server, Shield, Grid, ListFilter } from 'lucide-react';
import { LiveTelemetryEvent } from '../types';
import { INITIAL_TELEMETRY_LOGS } from '../data/mockAgents';
import { AgentActivityHeatmap } from './AgentActivityHeatmap';
import { AgentLogo } from './AgentLogo';

interface TelemetryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TelemetryDrawer: React.FC<TelemetryDrawerProps> = ({ isOpen, onClose }) => {
  const [logs, setLogs] = useState<LiveTelemetryEvent[]>(INITIAL_TELEMETRY_LOGS);
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CONSENSUS' | 'EXECUTION' | 'DISPATCH'>('ALL');
  const [activeTab, setActiveTab] = useState<'HEATMAP' | 'LOGS' | 'SPLIT'>('HEATMAP');
  const [selectedAgentQuery, setSelectedAgentQuery] = useState<string | null>(null);

  useEffect(() => {
    if (!isLiveStreaming || !isOpen) return;

    const interval = setInterval(() => {
      const sampleAgents = ['CLAUDE-3.5', 'GPT-4O-OMNI', 'GEMINI-PRO', 'CURSOR-AI', 'PERPLEXITY', 'COPILOT'];
      const sampleTypes: ('DISPATCH' | 'CONSENSUS' | 'CHECKPOINT' | 'EXECUTION')[] = [
        'DISPATCH', 'CONSENSUS', 'CHECKPOINT', 'EXECUTION'
      ];
      const randomAgent = sampleAgents[Math.floor(Math.random() * sampleAgents.length)];
      const randomType = sampleTypes[Math.floor(Math.random() * sampleTypes.length)];
      const randomLatency = Number((Math.random() * 8 + 3.2).toFixed(1));
      
      const newEvent: LiveTelemetryEvent = {
        id: `tel-${Date.now()}`,
        timestamp: new Date().toISOString().split('T')[1].slice(0, 12),
        agentName: randomAgent,
        eventType: randomType,
        latency: randomLatency,
        status: randomLatency > 9 ? 'warning' : 'success',
        details: randomType === 'CONSENSUS'
          ? `Quorum reached with ${(99 + Math.random()).toFixed(2)}% Byzantine agreement`
          : randomType === 'EXECUTION'
          ? `Executed isolated kernel AST pass on node #${Math.floor(Math.random() * 80 + 10)}`
          : randomType === 'DISPATCH'
          ? `Sub-agent batch dispatched across 64 virtual worker lanes`
          : `State checkpoint snapshot synchronized to distributed ledger`
      };

      setLogs((prev) => [newEvent, ...prev.slice(0, 40)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveStreaming, isOpen]);

  if (!isOpen) return null;

  const filteredLogs = logs.filter((l) => {
    const matchesFilter = activeFilter === 'ALL' || l.eventType === activeFilter;
    const matchesAgent = !selectedAgentQuery || l.agentName === selectedAgentQuery;
    return matchesFilter && matchesAgent;
  });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm">
      <div 
        className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl h-full bg-[#090a10] border-l border-white/10 flex flex-col shadow-2xl text-neutral-200"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        {/* Drawer Header */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#0c0d15]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <h2 
                  className="text-xs sm:text-sm font-bold tracking-[0.2em] uppercase text-white"
                  style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                >
                  AI HUB // TELEMETRY & OPERATIONS
                </h2>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 px-2 py-0.5">
                  STREAMING
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-time sub-network latency, 30-day uptime trends, and execution traces
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/10 transition-colors rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="px-5 sm:px-6 py-2.5 bg-[#090a12] border-b border-white/10 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setActiveTab('HEATMAP')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'HEATMAP'
                  ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>30-Day Heatmap</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-blue-950 text-blue-200 border border-blue-700/40">D3</span>
            </button>

            <button
              onClick={() => setActiveTab('LOGS')}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'LOGS'
                  ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Logs</span>
              <span className="text-[10px] text-neutral-400 font-normal">({logs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('SPLIT')}
              className={`hidden sm:flex px-3 py-1.5 rounded transition-all items-center gap-1.5 cursor-pointer ${
                activeTab === 'SPLIT'
                  ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-500/20'
                  : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Combined View</span>
            </button>
          </div>

          {selectedAgentQuery && (
            <div className="flex items-center gap-2 bg-blue-950/60 border border-blue-700/50 px-2.5 py-1 rounded text-[11px] text-blue-300">
              <AgentLogo agentCode={selectedAgentQuery} size="xs" showGlow={false} />
              <span>Agent: <strong>{selectedAgentQuery}</strong></span>
              <button
                onClick={() => setSelectedAgentQuery(null)}
                className="hover:text-white ml-1 text-neutral-400 cursor-pointer"
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* Real-Time Cluster KPI Strip */}
        <div className="grid grid-cols-3 p-4 gap-3 border-b border-white/10 bg-[#08090e]">
          <div className="p-3 bg-white/[0.02] border border-white/5 rounded">
            <div className="text-[11px] text-neutral-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-blue-400" />
              Active Swarms
            </div>
            <div className="text-lg font-bold text-white font-mono mt-1">14,892</div>
            <div className="text-[10px] text-emerald-400 font-mono">99.98% cluster availability</div>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/5 rounded">
            <div className="text-[11px] text-neutral-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Global Latency
            </div>
            <div className="text-lg font-bold text-white font-mono mt-1">6.4ms</div>
            <div className="text-[10px] text-neutral-400 font-mono">p99 = 11.2ms</div>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/5 rounded">
            <div className="text-[11px] text-neutral-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              Consensus
            </div>
            <div className="text-lg font-bold text-white font-mono mt-1">99.94%</div>
            <div className="text-[10px] text-emerald-400 font-mono">0 corrupt state locks</div>
          </div>
        </div>

        {/* Scrollable Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          {/* TAB 1: 30-Day Activity Heatmap */}
          {(activeTab === 'HEATMAP' || activeTab === 'SPLIT') && (
            <div className="p-4 sm:p-6 border-b border-white/10">
              <AgentActivityHeatmap
                onSelectAgent={(agentCode) => {
                  setSelectedAgentQuery(agentCode);
                }}
              />
            </div>
          )}

          {/* TAB 2: Live Logs & Telemetry Events */}
          {(activeTab === 'LOGS' || activeTab === 'SPLIT') && (
            <div>
              {/* Filter Controls */}
              <div className="px-6 py-3 border-b border-white/10 bg-[#07080d] flex items-center justify-between text-xs font-mono sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  {(['ALL', 'CONSENSUS', 'EXECUTION', 'DISPATCH'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setActiveFilter(type)}
                      className={`px-2.5 py-1 text-[11px] transition-colors cursor-pointer ${
                        activeFilter === type
                          ? 'bg-blue-600 text-white font-medium'
                          : 'bg-white/[0.03] text-neutral-400 hover:text-white hover:bg-white/[0.07]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsLiveStreaming(!isLiveStreaming)}
                  className="flex items-center gap-1.5 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'text-emerald-400 animate-pulse' : 'text-neutral-500'}`} />
                  <span>{isLiveStreaming ? 'Pause Feed' : 'Resume Feed'}</span>
                </button>
              </div>

              {/* Event Logs Stream */}
              <div className="p-6 space-y-3 font-mono text-xs divide-y divide-white/[0.04]">
                {filteredLogs.length === 0 ? (
                  <div className="text-center py-8 text-neutral-500">
                    No live events matching filter criteria.
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div key={log.id} className="pt-3 first:pt-0 flex items-start justify-between gap-3 group">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-neutral-500 text-[11px]">{log.timestamp}</span>
                          <div className="flex items-center gap-1.5">
                            <AgentLogo agentCode={log.agentName} size="xs" showGlow={false} />
                            <button
                              onClick={() => setSelectedAgentQuery(log.agentName)}
                              className="font-semibold text-blue-400 text-xs tracking-wider hover:underline cursor-pointer"
                            >
                              {log.agentName}
                            </button>
                          </div>
                          <span className={`text-[10px] px-1.5 py-0.2 border ${
                            log.eventType === 'CONSENSUS'
                              ? 'bg-purple-950/40 text-purple-300 border-purple-800/40'
                              : log.eventType === 'EXECUTION'
                              ? 'bg-blue-950/40 text-blue-300 border-blue-800/40'
                              : log.eventType === 'DISPATCH'
                              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-700/40'
                          }`}>
                            {log.eventType}
                          </span>
                        </div>
                        <div className="text-neutral-300 text-xs pl-0.5">
                          {log.details}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className={`text-[11px] font-semibold ${
                          log.latency < 7 ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          {log.latency}ms
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-[#07080c] flex items-center justify-between text-xs font-mono text-neutral-500">
          <span>Encrypted RPC Transport · TLS 1.3</span>
          <button
            onClick={() => setLogs(INITIAL_TELEMETRY_LOGS)}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset History</span>
          </button>
        </div>
      </div>
    </div>
  );
};
