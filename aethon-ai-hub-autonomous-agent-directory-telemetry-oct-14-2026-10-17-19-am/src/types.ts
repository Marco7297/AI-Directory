export interface AIAgent {
  id: string;
  name: string;
  codeName: string;
  category: 'Coding' | 'Research' | 'Orchestration' | 'Multimodal' | 'Security';
  description: string;
  version: string;
  status: 'operational' | 'busy' | 'syncing';
  latencyMs: number;
  uptimePercent: number;
  rating: number;
  reviewCount: number;
  verifiedDeveloper: string;
  primaryCapability: string;
  specs: {
    contextWindow: string;
    throughput: string;
    architecture: string;
  };
  tags: string[];
  logoUrl?: string;
  themeColor?: string;
  metrics?: {
    cpuTrend: number[];
    memoryTrend: number[];
    currentCpu: number;
    currentMemory: string;
    cpuDelta: number;
    memoryDelta: number;
  };
}

export type ToolCategory = 'Coding' | 'Writing' | 'Design & Video' | 'Research & Data' | 'Productivity' | 'Audio & Voice';
export type ToolPricing = 'Free' | 'Freemium' | 'Paid';

export interface AITool {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: ToolCategory;
  pricing: ToolPricing;
  pricingDetails: string;
  freePlan: string;
  rating: number;
  reviewCount: number;
  logo: string;
  logoColor: string;
  websiteUrl: string;
  featured?: boolean;
  sponsored?: boolean;
  bestFor: string;
  pros: string[];
  cons: string[];
  keyFeatures: string[];
  similarToolIds: string[];
  launchYear?: string;
  benchmarkScore?: number;
}

export interface GuideArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
  };
  summary: string;
  intro: string;
  topPicks: {
    name: string;
    toolId: string;
    badge: string;
    rating: number;
    whyItWon: string;
    bestFor: string;
    pricing: string;
    pros: string[];
    cons: string[];
  }[];
  buyerAdvice: string[];
  conclusion: string;
}

export type PageRoute = 
  | 'home'
  | 'all-tools'
  | 'best-ai-tools'
  | 'compare'
  | 'submit-tool'
  | 'about'
  | 'contact'
  | 'affiliate-disclosure'
  | 'privacy-policy'
  | 'terms-of-use'
  | 'tool-details'
  | 'category';

export interface AgentReview {
  id: string;
  agentId: string;
  agentName: string;
  author: string;
  role: string;
  company: string;
  avatarUrl?: string;
  rating: number;
  headline: string;
  content: string;
  date: string;
  verifiedDeployment: boolean;
  upvotes: number;
}

export interface LiveTelemetryEvent {
  id: string;
  timestamp: string;
  agentName: string;
  eventType: 'DISPATCH' | 'CONSENSUS' | 'CHECKPOINT' | 'EXECUTION';
  latency: number;
  status: 'success' | 'warning' | 'info';
  details: string;
}

