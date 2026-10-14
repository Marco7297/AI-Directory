import { AIAgent, AgentReview, LiveTelemetryEvent } from '../types';

export const FEATURED_HERO_AGENTS: {
  id: string;
  name: string;
  codeName: string;
  subtitle: string;
  image: string;
  role: string;
  specs: {
    engine: string;
    latency: string;
    uptime: string;
    consensus: string;
    reviews: string;
  };
  callouts: {
    head: { title: string; line1: string; line2: string };
    chest: { title: string; line1: string; line2: string };
    base: { title: string; line1: string; line2: string };
  };
}[] = [
  {
    id: 'synergy-prime',
    name: 'SYNERGY PRIME',
    codeName: 'AETHON-IX',
    subtitle: 'Autonomous Cognitive & Multimodal Reasoning Swarm',
    image: '/src/assets/images/ai_agent_scout_1791549678032.jpg',
    role: 'Autonomous Reasoning Core',
    specs: {
      engine: 'Neural Swarm v4.2 Hybrid',
      latency: '6.8ms avg',
      uptime: '99.98%',
      consensus: '99.94%',
      reviews: '14,892 reviews'
    },
    callouts: {
      head: {
        title: 'ARTIFICIAL INTELLIGENCE',
        line1: 'Neural Reasoning Core v4.2',
        line2: 'Cross-model semantic routing'
      },
      chest: {
        title: 'NO EMOTION // PURE LOGIC',
        line1: 'Autonomous Action Loop',
        line2: 'Deterministic verification sandbox'
      },
      base: {
        title: 'PRODUCTION TELEMETRY',
        line1: '6.8ms sub-network ping',
        line2: '14.8k verified cluster runs'
      }
    }
  },
  {
    id: 'titan-carbon',
    name: 'TITAN CARBON',
    codeName: 'CHRONOS-VII',
    subtitle: 'High-Throughput Autonomous Systems & Compiler Orchestration',
    image: '/src/assets/images/ai_agent_bust_1791549653261.jpg',
    role: 'Enterprise Systems Orchestrator',
    specs: {
      engine: 'Graph-Parallel Actor Mesh',
      latency: '4.2ms avg',
      uptime: '99.99%',
      consensus: '100.00%',
      reviews: '9,410 reviews'
    },
    callouts: {
      head: {
        title: 'HIGH-DENSITY COMPUTE',
        line1: 'Multi-GPU Kernel Execution',
        line2: '1.2M token context active'
      },
      chest: {
        title: 'HARDENED SECURITY MESH',
        line1: 'Zero-trust runtime isolation',
        line2: 'Real-time invariant checking'
      },
      base: {
        title: 'ENTERPRISE SLA',
        line1: '99.99% continuous availability',
        line2: 'Sub-5ms multi-region dispatch'
      }
    }
  }
];

export const AGENT_LOGOS_MAP: Record<string, {
  name: string;
  codeName: string;
  logoUrl: string;
  themeColor: string;
  accentHex: string;
  glowColor: string;
  category: string;
}> = {
  'claude-3-5': {
    name: 'Claude 3.5 Sonnet',
    codeName: 'CLAUDE-3.5',
    logoUrl: '',
    themeColor: 'orange',
    accentHex: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    category: 'Research'
  },
  'CLAUDE-3.5': {
    name: 'Claude 3.5 Sonnet',
    codeName: 'CLAUDE-3.5',
    logoUrl: '',
    themeColor: 'orange',
    accentHex: '#f97316',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    category: 'Research'
  },
  'chatgpt-4o': {
    name: 'ChatGPT Plus (GPT-4o)',
    codeName: 'GPT-4O-OMNI',
    logoUrl: '',
    themeColor: 'teal',
    accentHex: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    category: 'Orchestration'
  },
  'GPT-4O-OMNI': {
    name: 'ChatGPT Plus (GPT-4o)',
    codeName: 'GPT-4O-OMNI',
    logoUrl: '',
    themeColor: 'teal',
    accentHex: '#14b8a6',
    glowColor: 'rgba(20, 184, 166, 0.4)',
    category: 'Orchestration'
  },
  'gemini-1-5-pro': {
    name: 'Google Gemini 1.5 Pro',
    codeName: 'GEMINI-PRO',
    logoUrl: '',
    themeColor: 'indigo',
    accentHex: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    category: 'Multimodal'
  },
  'GEMINI-PRO': {
    name: 'Google Gemini 1.5 Pro',
    codeName: 'GEMINI-PRO',
    logoUrl: '',
    themeColor: 'indigo',
    accentHex: '#6366f1',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    category: 'Multimodal'
  },
  'cursor-composer': {
    name: 'Cursor AI Composer',
    codeName: 'CURSOR-AI',
    logoUrl: '',
    themeColor: 'blue',
    accentHex: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    category: 'Coding'
  },
  'CURSOR-AI': {
    name: 'Cursor AI Composer',
    codeName: 'CURSOR-AI',
    logoUrl: '',
    themeColor: 'blue',
    accentHex: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    category: 'Coding'
  },
  'perplexity-pro': {
    name: 'Perplexity Pro',
    codeName: 'PERPLEXITY',
    logoUrl: '',
    themeColor: 'cyan',
    accentHex: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    category: 'Research'
  },
  'PERPLEXITY': {
    name: 'Perplexity Pro',
    codeName: 'PERPLEXITY',
    logoUrl: '',
    themeColor: 'cyan',
    accentHex: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    category: 'Research'
  },
  'copilot-workspace': {
    name: 'GitHub Copilot Workspace',
    codeName: 'COPILOT',
    logoUrl: '',
    themeColor: 'violet',
    accentHex: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    category: 'Coding'
  },
  'COPILOT': {
    name: 'GitHub Copilot Workspace',
    codeName: 'COPILOT',
    logoUrl: '',
    themeColor: 'violet',
    accentHex: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    category: 'Coding'
  },
  'deepseek-r1': {
    name: 'DeepSeek-R1',
    codeName: 'DEEPSEEK-R1',
    logoUrl: '',
    themeColor: 'blue',
    accentHex: '#1e6fff',
    glowColor: 'rgba(30, 111, 255, 0.4)',
    category: 'Research'
  },
  'DEEPSEEK-R1': {
    name: 'DeepSeek-R1',
    codeName: 'DEEPSEEK-R1',
    logoUrl: '',
    themeColor: 'blue',
    accentHex: '#1e6fff',
    glowColor: 'rgba(30, 111, 255, 0.4)',
    category: 'Research'
  },
  'meta-llama-3': {
    name: 'Meta Llama 3.3 70B',
    codeName: 'LLAMA-3.3',
    logoUrl: '',
    themeColor: 'blue',
    accentHex: '#0081fb',
    glowColor: 'rgba(0, 129, 251, 0.4)',
    category: 'Orchestration'
  },
  'LLAMA-3.3': {
    name: 'Meta Llama 3.3 70B',
    codeName: 'LLAMA-3.3',
    logoUrl: '',
    themeColor: 'blue',
    accentHex: '#0081fb',
    glowColor: 'rgba(0, 129, 251, 0.4)',
    category: 'Orchestration'
  },
  'mistral-large': {
    name: 'Mistral Large 2',
    codeName: 'MISTRAL-LG',
    logoUrl: '',
    themeColor: 'orange',
    accentHex: '#ff7000',
    glowColor: 'rgba(255, 112, 0, 0.4)',
    category: 'Coding'
  },
  'MISTRAL-LG': {
    name: 'Mistral Large 2',
    codeName: 'MISTRAL-LG',
    logoUrl: '',
    themeColor: 'orange',
    accentHex: '#ff7000',
    glowColor: 'rgba(255, 112, 0, 0.4)',
    category: 'Coding'
  },
  'grok-ai': {
    name: 'xAI Grok 2',
    codeName: 'GROK-2',
    logoUrl: '',
    themeColor: 'cyan',
    accentHex: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.3)',
    category: 'Research'
  },
  'GROK-2': {
    name: 'xAI Grok 2',
    codeName: 'GROK-2',
    logoUrl: '',
    themeColor: 'cyan',
    accentHex: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.3)',
    category: 'Research'
  },
  'cohere-command': {
    name: 'Cohere Command R+',
    codeName: 'COMMAND-R+',
    logoUrl: '',
    themeColor: 'rose',
    accentHex: '#e26d5c',
    glowColor: 'rgba(226, 109, 92, 0.4)',
    category: 'Orchestration'
  },
  'COMMAND-R+': {
    name: 'Cohere Command R+',
    codeName: 'COMMAND-R+',
    logoUrl: '',
    themeColor: 'rose',
    accentHex: '#e26d5c',
    glowColor: 'rgba(226, 109, 92, 0.4)',
    category: 'Orchestration'
  }
};

export const MOCK_AGENTS: AIAgent[] = [
  {
    id: 'claude-3-5',
    name: 'Claude 3.5 Sonnet',
    codeName: 'CLAUDE-3.5',
    category: 'Research',
    description: 'Frontier reasoning and autonomous coding engine by Anthropic. Excels in complex architectural design, multi-file code synthesis, and interactive Artifacts.',
    version: '3.5.0',
    status: 'operational',
    latencyMs: 5.2,
    uptimePercent: 99.98,
    rating: 4.97,
    reviewCount: 5410,
    verifiedDeveloper: 'Anthropic PBC',
    primaryCapability: 'Frontier Nuance, Artifacts & Code Architecture',
    specs: {
      contextWindow: '200,000 Tokens',
      throughput: '160 tokens/sec',
      architecture: 'Anthropic Frontier MoE'
    },
    tags: ['Claude', 'Anthropic', 'Artifacts', 'Frontier AI', 'Coding'],
    logoUrl: '',
    themeColor: 'orange',
    metrics: {
      cpuTrend: [30, 35, 42, 58, 64, 60, 55, 62, 59, 64, 61, 58],
      memoryTrend: [2.0, 2.2, 2.4, 2.9, 3.2, 3.1, 3.3, 3.4, 3.5, 3.3, 3.4, 3.2],
      currentCpu: 58,
      currentMemory: '3.2 GB',
      cpuDelta: 28.0,
      memoryDelta: 1.2,
    },
  },
  {
    id: 'chatgpt-4o',
    name: 'ChatGPT Plus (GPT-4o)',
    codeName: 'GPT-4O-OMNI',
    category: 'Orchestration',
    description: 'OpenAI omni-modal frontier model uniting real-time audio, vision, advanced chain-of-thought o1 reasoning, and autonomous custom GPT workflows.',
    version: '4.0.0',
    status: 'operational',
    latencyMs: 4.9,
    uptimePercent: 99.99,
    rating: 4.94,
    reviewCount: 9200,
    verifiedDeveloper: 'OpenAI Research',
    primaryCapability: 'Omni-Modal Reasoning, Voice & Python Sandbox',
    specs: {
      contextWindow: '128,000 Tokens',
      throughput: '175 tokens/sec',
      architecture: 'Omni-modal Transformer + o1 reasoning'
    },
    tags: ['ChatGPT', 'OpenAI', 'GPT-4o', 'Voice', 'Python Sandbox'],
    logoUrl: '',
    themeColor: 'teal',
    metrics: {
      cpuTrend: [40, 48, 55, 68, 74, 70, 65, 72, 69, 75, 71, 67],
      memoryTrend: [2.5, 2.8, 3.0, 3.5, 3.8, 3.7, 3.9, 4.0, 4.2, 4.1, 4.0, 3.9],
      currentCpu: 67,
      currentMemory: '3.9 GB',
      cpuDelta: 27.0,
      memoryDelta: 1.4,
    },
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Google Gemini 1.5 Pro',
    codeName: 'GEMINI-PRO',
    category: 'Multimodal',
    description: 'Google DeepMind flagship multimodal model with groundbreaking 2-million token context window, native video/audio understanding, and Google Workspace integration.',
    version: '1.5.0',
    status: 'operational',
    latencyMs: 6.1,
    uptimePercent: 99.96,
    rating: 4.93,
    reviewCount: 5120,
    verifiedDeveloper: 'Google DeepMind',
    primaryCapability: '2M Token Long-Context & Native Audio/Video',
    specs: {
      contextWindow: '2,000,000 Tokens',
      throughput: '155 tokens/sec',
      architecture: 'Multimodal Sparse Mixture-of-Experts'
    },
    tags: ['Gemini', 'Google DeepMind', '2M Context', 'Multimodal', 'Video'],
    logoUrl: '',
    themeColor: 'indigo',
    metrics: {
      cpuTrend: [35, 41, 49, 58, 65, 62, 58, 66, 63, 68, 65, 61],
      memoryTrend: [2.2, 2.4, 2.7, 3.1, 3.4, 3.3, 3.5, 3.6, 3.8, 3.7, 3.6, 3.5],
      currentCpu: 61,
      currentMemory: '3.5 GB',
      cpuDelta: 26.0,
      memoryDelta: 1.3,
    },
  },
  {
    id: 'cursor-composer',
    name: 'Cursor AI Composer',
    codeName: 'CURSOR-AI',
    category: 'Coding',
    description: 'Autonomous multi-file repository synthesizer and AI code editor. Powers instant speculative editing, whole-codebase semantic indexing, and bug diagnostics.',
    version: '0.42.0',
    status: 'operational',
    latencyMs: 7.2,
    uptimePercent: 99.95,
    rating: 4.95,
    reviewCount: 3820,
    verifiedDeveloper: 'Anysphere',
    primaryCapability: 'Multi-File Agentic Composer & Semantic Indexing',
    specs: {
      contextWindow: '200,000 Tokens',
      throughput: '190 tokens/sec',
      architecture: 'Speculative Tree Decoding + Sonnet 3.5'
    },
    tags: ['Cursor', 'Coding', 'Multi-File', 'VS Code', 'TypeScript'],
    logoUrl: '',
    themeColor: 'blue',
    metrics: {
      cpuTrend: [38, 44, 52, 60, 68, 62, 58, 64, 61, 66, 63, 59],
      memoryTrend: [2.1, 2.3, 2.5, 2.8, 3.2, 3.0, 3.1, 3.3, 3.4, 3.2, 3.3, 3.1],
      currentCpu: 59,
      currentMemory: '3.1 GB',
      cpuDelta: 21.0,
      memoryDelta: 1.0,
    },
  },
  {
    id: 'perplexity-pro',
    name: 'Perplexity Pro',
    codeName: 'PERPLEXITY',
    category: 'Research',
    description: 'Conversational answer engine with verified live web and academic citations. Synthesizes cross-web research with dynamic Claude and GPT model routing.',
    version: '2.4.0',
    status: 'operational',
    latencyMs: 8.4,
    uptimePercent: 99.93,
    rating: 4.88,
    reviewCount: 4120,
    verifiedDeveloper: 'Perplexity AI Inc.',
    primaryCapability: 'Inline Verified Citations & Guided Pro Search',
    specs: {
      contextWindow: '128,000 Tokens',
      throughput: '140 tokens/sec',
      architecture: 'Search-Augmented Retrieval Engine'
    },
    tags: ['Perplexity', 'Research', 'Citations', 'Search', 'Fact-Checked'],
    logoUrl: '',
    themeColor: 'cyan',
    metrics: {
      cpuTrend: [25, 30, 38, 45, 52, 48, 44, 50, 47, 53, 49, 46],
      memoryTrend: [1.8, 1.9, 2.1, 2.4, 2.7, 2.6, 2.7, 2.8, 2.9, 2.8, 2.9, 2.7],
      currentCpu: 46,
      currentMemory: '2.7 GB',
      cpuDelta: 21.0,
      memoryDelta: 0.9,
    },
  },
  {
    id: 'copilot-workspace',
    name: 'GitHub Copilot Workspace',
    codeName: 'COPILOT',
    category: 'Coding',
    description: 'Task-centric developer environment by GitHub & Microsoft that plans, builds, and tests full pull requests from issue descriptions with verified safety guardrails.',
    version: '2.0.0',
    status: 'operational',
    latencyMs: 6.8,
    uptimePercent: 99.97,
    rating: 4.86,
    reviewCount: 7890,
    verifiedDeveloper: 'GitHub / Microsoft',
    primaryCapability: 'Issue-to-PR Task Plan Generation & Code Review',
    specs: {
      contextWindow: '128,000 Tokens',
      throughput: '165 tokens/sec',
      architecture: 'Fine-tuned GPT-4o Copilot Agent'
    },
    tags: ['Copilot', 'GitHub', 'CI/CD', 'Pull Request', 'Pair Programming'],
    logoUrl: '',
    themeColor: 'violet',
    metrics: {
      cpuTrend: [28, 34, 40, 48, 55, 51, 47, 53, 50, 56, 52, 49],
      memoryTrend: [1.9, 2.0, 2.2, 2.5, 2.8, 2.7, 2.8, 2.9, 3.0, 2.9, 3.0, 2.8],
      currentCpu: 49,
      currentMemory: '2.8 GB',
      cpuDelta: 21.0,
      memoryDelta: 0.9,
    },
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    codeName: 'DEEPSEEK-R1',
    category: 'Research',
    description: 'Breakthrough open-weights frontier reasoning engine by DeepSeek. Matches OpenAI o1 on mathematical proofs, complex coding, and multi-step reasoning at 90% lower compute cost.',
    version: '1.0.0',
    status: 'operational',
    latencyMs: 5.6,
    uptimePercent: 99.94,
    rating: 4.96,
    reviewCount: 6840,
    verifiedDeveloper: 'DeepSeek AI',
    primaryCapability: 'Reinforcement Learning CoT & Advanced Math',
    specs: {
      contextWindow: '128,000 Tokens',
      throughput: '180 tokens/sec',
      architecture: 'Multi-head Latent Attention MoE (671B)'
    },
    tags: ['DeepSeek', 'Open Weights', 'Reasoning', 'Math', 'CoT'],
    logoUrl: '',
    themeColor: 'blue',
    metrics: {
      cpuTrend: [35, 42, 50, 62, 70, 65, 60, 68, 64, 71, 67, 63],
      memoryTrend: [2.1, 2.3, 2.6, 3.0, 3.4, 3.2, 3.3, 3.5, 3.6, 3.4, 3.5, 3.3],
      currentCpu: 63,
      currentMemory: '3.3 GB',
      cpuDelta: 24.0,
      memoryDelta: 1.1,
    },
  },
  {
    id: 'meta-llama-3',
    name: 'Meta Llama 3.3 70B',
    codeName: 'LLAMA-3.3',
    category: 'Orchestration',
    description: 'Industry-standard open foundation model by Meta AI. Delivers 405B-class benchmark performance at a fraction of compute cost across 128k context with full open developer weights.',
    version: '3.3.0',
    status: 'operational',
    latencyMs: 4.6,
    uptimePercent: 99.99,
    rating: 4.92,
    reviewCount: 8900,
    verifiedDeveloper: 'Meta AI Research',
    primaryCapability: 'Open-Weights High-Throughput Orchestration',
    specs: {
      contextWindow: '128,000 Tokens',
      throughput: '220 tokens/sec',
      architecture: 'Dense Transformer with Grouped Query Attention'
    },
    tags: ['Llama', 'Meta AI', 'Open Weights', 'Enterprise', 'Fast Inference'],
    logoUrl: '',
    themeColor: 'blue',
    metrics: {
      cpuTrend: [30, 36, 44, 52, 60, 56, 52, 58, 55, 61, 57, 54],
      memoryTrend: [1.9, 2.1, 2.3, 2.6, 2.9, 2.8, 2.9, 3.1, 3.2, 3.0, 3.1, 2.9],
      currentCpu: 54,
      currentMemory: '2.9 GB',
      cpuDelta: 20.0,
      memoryDelta: 0.9,
    },
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large 2',
    codeName: 'MISTRAL-LG',
    category: 'Coding',
    description: 'Flagship multilingual reasoning and code synthesis model by Mistral AI. Built for multi-lingual fluency, precise tool calling, and strict JSON output schema conformity.',
    version: '2.0.0',
    status: 'operational',
    latencyMs: 5.1,
    uptimePercent: 99.97,
    rating: 4.89,
    reviewCount: 3740,
    verifiedDeveloper: 'Mistral AI',
    primaryCapability: 'Multilingual Code & Complex Tool Calling',
    specs: {
      contextWindow: '128,000 Tokens',
      throughput: '195 tokens/sec',
      architecture: '123B Parameter Dense Architecture'
    },
    tags: ['Mistral', 'Europe', 'Multilingual', 'Code', 'Function Calling'],
    logoUrl: '',
    themeColor: 'orange',
    metrics: {
      cpuTrend: [28, 33, 41, 49, 56, 52, 48, 54, 51, 57, 53, 50],
      memoryTrend: [1.8, 2.0, 2.2, 2.5, 2.8, 2.7, 2.8, 3.0, 3.1, 2.9, 3.0, 2.8],
      currentCpu: 50,
      currentMemory: '2.8 GB',
      cpuDelta: 19.0,
      memoryDelta: 0.8,
    },
  }
];

export const MOCK_REVIEWS: AgentReview[] = [
  {
    id: 'rev-1',
    agentId: 'claude-3-5',
    agentName: 'Claude 3.5 Sonnet',
    author: 'Dr. Elena Rostova',
    role: 'Principal AI Architect',
    company: 'Vanguard Systems',
    rating: 5,
    headline: 'State-of-the-art coding and architectural reasoning',
    content: 'We integrated Claude 3.5 Sonnet across our engineering platform. The reasoning nuance, Artifacts code previews, and 200k token context recall are completely unmatched.',
    date: 'March 2026',
    verifiedDeployment: true,
    upvotes: 342
  },
  {
    id: 'rev-2',
    agentId: 'chatgpt-4o',
    agentName: 'ChatGPT Plus (GPT-4o)',
    author: 'Marcus Vance',
    role: 'VP of Engineering',
    company: 'Hyperion FinTech',
    rating: 5,
    headline: 'Native multimodal voice, python sandbox, and deep o1 logic',
    content: 'GPT-4o alongside o1 reasoning models solved our data pipeline verification issues in minutes. Real-time audio and vision analysis have transformed our internal workflow.',
    date: 'April 2026',
    verifiedDeployment: true,
    upvotes: 289
  },
  {
    id: 'rev-3',
    agentId: 'cursor-composer',
    agentName: 'Cursor AI Composer',
    author: 'Sarah Chen',
    role: 'Lead Full-Stack Developer',
    company: 'Apex Cloud Systems',
    rating: 5,
    headline: 'Speculative decoding tab completions feel instantaneous',
    content: 'Composer handles multi-file refactoring across large repos flawlessly. Cmd+K inline transforms and automated terminal fixes save our engineers 2+ hours daily.',
    date: 'May 2026',
    verifiedDeployment: true,
    upvotes: 245
  },
  {
    id: 'rev-4',
    agentId: 'gemini-1-5-pro',
    agentName: 'Google Gemini 1.5 Pro',
    author: 'Julian Thorne',
    role: 'Director of Quantitative Research',
    company: 'Axiom Capital',
    rating: 5,
    headline: '2 Million token context window ingests entire technical libraries',
    content: 'We fed hours of recorded audio and 40,000 lines of code in one turn. Needle-in-a-haystack recall was 100% accurate. Truly revolutionary.',
    date: 'May 2026',
    verifiedDeployment: true,
    upvotes: 198
  }
];

export const INITIAL_TELEMETRY_LOGS: LiveTelemetryEvent[] = [
  {
    id: 'tel-1',
    timestamp: '05:42:01.124',
    agentName: 'CLAUDE-3.5',
    eventType: 'CONSENSUS',
    latency: 5.2,
    status: 'success',
    details: 'Artifact execution stream compiled (Anthropic API)'
  },
  {
    id: 'tel-2',
    timestamp: '05:42:02.840',
    agentName: 'GPT-4O-OMNI',
    eventType: 'EXECUTION',
    latency: 4.8,
    status: 'success',
    details: 'Python sandbox compute turn executed successfully'
  },
  {
    id: 'tel-3',
    timestamp: '05:42:03.415',
    agentName: 'GEMINI-PRO',
    eventType: 'DISPATCH',
    latency: 6.1,
    status: 'success',
    details: '2M token multimodal retrieval verified (Google DeepMind)'
  },
  {
    id: 'tel-4',
    timestamp: '05:42:04.992',
    agentName: 'CURSOR-AI',
    eventType: 'CHECKPOINT',
    latency: 7.2,
    status: 'info',
    details: 'Multi-file AST index commit synchronized'
  }
];
