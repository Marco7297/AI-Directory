/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { ExploreDirectorySection } from './components/ExploreDirectorySection';
import { SearchDirectoryModal } from './components/SearchDirectoryModal';
import { TelemetryDrawer } from './components/TelemetryDrawer';
import { CommunityReviewsModal } from './components/CommunityReviewsModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { AgentLogo } from './components/AgentLogo';
import { NoomoLabsModal } from './components/NoomoLabsModal';
import { ArrowUp, Command } from 'lucide-react';

// Newly Created Dedicated Pages
import { AllToolsPage } from './components/pages/AllToolsPage';
import { BestAIToolsPage } from './components/pages/BestAIToolsPage';
import { CompareToolsPage } from './components/pages/CompareToolsPage';
import { SubmitToolPage } from './components/pages/SubmitToolPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { AffiliateDisclosurePage } from './components/pages/AffiliateDisclosurePage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { TermsOfUsePage } from './components/pages/TermsOfUsePage';
import { ToolDetailsPage } from './components/pages/ToolDetailsPage';
import { CategoryPage } from './components/pages/CategoryPage';
import { ReadingProgressBar } from './components/ReadingProgressBar';

import { AIAgent, PageRoute, ToolCategory, GuideArticle } from './types';
import { MOCK_TOOLS } from './data/mockTools';
import { initLenis, destroyLenis, smoothScrollTo, getLenis } from './utils/scrollManager';

export default function App() {
  // Navigation Routing State
  const [currentPage, setCurrentPage] = useState<PageRoute>('home');
  const [selectedToolId, setSelectedToolId] = useState<string>('cursor-ai');
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('Coding');
  const [compareToolAId, setCompareToolAId] = useState<string>('cursor-ai');
  const [compareToolBId, setCompareToolBId] = useState<string>('github-copilot');
  const [readingArticle, setReadingArticle] = useState<GuideArticle | null>(null);

  // Modals & Drawers State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isNoomoLabsOpen, setIsNoomoLabsOpen] = useState(false);
  const [isExploreVisible, setIsExploreVisible] = useState(false);
  const [selectedAgentToast, setSelectedAgentToast] = useState<{ message: string; agent?: AIAgent } | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Initialize Lenis smooth scroll engine
  useEffect(() => {
    initLenis();
    return () => {
      destroyLenis();
    };
  }, []);

  // Track window scroll for floating Return to Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 450) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pause Lenis when modal overlays are active to allow independent modal scrolling
  useEffect(() => {
    const lenis = getLenis();
    if (!lenis) return;
    const isAnyModalOpen = isCommandPaletteOpen || isDirectoryOpen || isReviewsOpen || isNoomoLabsOpen;
    if (isAnyModalOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [isCommandPaletteOpen, isDirectoryOpen, isReviewsOpen, isNoomoLabsOpen]);

  // Global Keyboard Shortcuts (Cmd+K / Ctrl+K for Command Palette, Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsDirectoryOpen(false);
        setIsTelemetryOpen(false);
        setIsReviewsOpen(false);
        setIsNoomoLabsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Router handler
  const handleNavigate = (route: PageRoute, extraParam?: string) => {
    if (route === 'tool-details' && extraParam) {
      setSelectedToolId(extraParam);
    } else if (route === 'category' && extraParam) {
      setSelectedCategory(extraParam as ToolCategory);
    } else if (route === 'compare') {
      if (extraParam) {
        setCompareToolAId(extraParam);
        const targetTool = MOCK_TOOLS.find((t) => t.id === extraParam);
        const competitor = targetTool?.similarToolIds?.find((id) => id !== extraParam)
          || (compareToolBId !== extraParam ? compareToolBId : null)
          || MOCK_TOOLS.find((t) => t.id !== extraParam)?.id
          || 'github-copilot';
        setCompareToolBId(competitor);
      }
    }

    setCurrentPage(route);
    smoothScrollTo(0);
  };

  const handleSelectTool = (toolId: string) => {
    setSelectedToolId(toolId);
    setCurrentPage('tool-details');
    smoothScrollTo(0);
  };

  const handleNavigateCategory = (cat: string) => {
    setSelectedCategory(cat as ToolCategory);
    setCurrentPage('category');
    smoothScrollTo(0);
  };

  const handleCompareTools = (toolAId?: string, toolBId?: string) => {
    if (toolAId) {
      setCompareToolAId(toolAId);
      if (toolBId) {
        setCompareToolBId(toolBId);
      } else {
        const targetTool = MOCK_TOOLS.find((t) => t.id === toolAId);
        const competitor = targetTool?.similarToolIds?.find((id) => id !== toolAId)
          || (compareToolBId !== toolAId ? compareToolBId : null)
          || MOCK_TOOLS.find((t) => t.id !== toolAId)?.id
          || 'github-copilot';
        setCompareToolBId(competitor);
      }
    } else if (toolBId) {
      setCompareToolBId(toolBId);
    }
    setCurrentPage('compare');
    smoothScrollTo(0);
  };

  const handleSelectAgent = (agent: AIAgent) => {
    setSelectedAgentToast({
      message: `Loaded ${agent.name} (v${agent.version}) into local execution context.`,
      agent
    });
    setTimeout(() => setSelectedAgentToast(null), 4000);
  };

  const toggleCommandPalette = () => setIsCommandPaletteOpen((prev) => !prev);
  const toggleDirectory = () => setIsDirectoryOpen((prev) => !prev);
  const toggleTelemetry = () => setIsTelemetryOpen((prev) => !prev);
  const toggleReviews = () => setIsReviewsOpen((prev) => !prev);

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === 'explore-section') {
      setIsExploreVisible(true);
    }
    if (currentPage !== 'home') {
      setCurrentPage('home');
    }
    setTimeout(() => {
      smoothScrollTo('#' + sectionId, { offset: -20, duration: 1.2 });
    }, 60);
  };

  const handleExploreClick = () => {
    setIsExploreVisible(true);
    setTimeout(() => {
      smoothScrollTo('#explore-section', { offset: -20, duration: 1.4 });
    }, 50);
  };

  // Reset reading article when navigating away from best-ai-tools
  useEffect(() => {
    if (currentPage !== 'best-ai-tools') {
      setReadingArticle(null);
    }
  }, [currentPage]);

  // Determine whether current view is a long-form article or reading page
  const isLongFormPage = [
    'best-ai-tools',
    'tool-details',
    'about',
    'privacy-policy',
    'terms-of-use',
    'affiliate-disclosure'
  ].includes(currentPage);

  const getReadingMeta = () => {
    if (currentPage === 'best-ai-tools') {
      if (readingArticle) {
        return {
          title: readingArticle.title,
          category: readingArticle.category,
          readTime: readingArticle.readTime,
          targetSelector: 'article'
        };
      }
      return {
        title: 'Best AI Tools — In-Depth Buyer Guides & Rankings',
        category: 'Editorial Studies',
        readTime: '12 min overview',
        targetSelector: 'main'
      };
    }
    if (currentPage === 'tool-details') {
      return {
        title: 'Full In-Depth Architecture Review & Performance Telemetry',
        category: 'Tool Analysis',
        readTime: '6 min read',
        targetSelector: 'main'
      };
    }
    if (currentPage === 'about') {
      return {
        title: 'Editorial Standards, Testing Protocols & Independence Charter',
        category: 'About & Standards',
        readTime: '5 min read',
        targetSelector: 'main'
      };
    }
    if (currentPage === 'affiliate-disclosure') {
      return {
        title: 'Affiliate Transparency & Ethical Rating Safeguards',
        category: 'Ethics & Compliance',
        readTime: '4 min read',
        targetSelector: 'main'
      };
    }
    if (currentPage === 'privacy-policy') {
      return {
        title: 'Privacy Policy & Data Security Governance',
        category: 'Legal Notice',
        readTime: '6 min read',
        targetSelector: 'main'
      };
    }
    if (currentPage === 'terms-of-use') {
      return {
        title: 'Terms of Use & API Directory Licensing',
        category: 'Legal Agreement',
        readTime: '7 min read',
        targetSelector: 'main'
      };
    }
    return null;
  };

  const readingMeta = getReadingMeta();

  return (
    <div className="min-h-screen bg-[#07080c] text-neutral-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Thin Animated Reading Progress Bar at the top of the screen */}
      <ReadingProgressBar
        isActive={isLongFormPage}
        articleTitle={readingMeta?.title}
        category={readingMeta?.category}
        readTime={readingMeta?.readTime}
        targetSelector={readingMeta?.targetSelector}
        showFloatingPill={true}
      />

      {/* Header Menu with Requested Pages: (Home, All Tools, Best AI Tools, Compare, Submit Your Tool, About) */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenDirectory={toggleDirectory}
        onOpenTelemetry={toggleTelemetry}
        onOpenReviews={toggleReviews}
        onOpenCommandPalette={toggleCommandPalette}
        onOpenNoomoLabs={() => setIsNoomoLabsOpen(true)}
        isDirectoryOpen={isDirectoryOpen}
        isTelemetryOpen={isTelemetryOpen}
        isReviewsOpen={isReviewsOpen}
        isCommandPaletteOpen={isCommandPaletteOpen}
      />

      {/* Main Page Content Router */}
      <main className={`flex-1 flex flex-col ${currentPage !== 'home' ? 'pt-16 sm:pt-20' : ''}`}>
        {currentPage === 'home' && (
          <>
            <HeroSection
              onOpenDirectory={toggleDirectory}
              onOpenTelemetry={toggleTelemetry}
              onOpenReviews={toggleReviews}
              onOpenNoomoLabs={() => setIsNoomoLabsOpen(true)}
              onExploreClick={handleExploreClick}
              onSelectTool={handleSelectTool}
              onCompareTools={handleCompareTools}
              onNavigate={handleNavigate}
              isDirectoryOpen={isDirectoryOpen}
              isTelemetryOpen={isTelemetryOpen}
              isReviewsOpen={isReviewsOpen}
            />

            {/* Explore Section with Shared Search Bar & Text */}
            <div className={`transition-all duration-700 ${isExploreVisible ? 'opacity-100 block' : 'opacity-90 block'}`}>
              <ExploreDirectorySection 
                onSelectAgent={handleSelectAgent}
                onOpenTelemetry={toggleTelemetry}
                onOpenReviews={toggleReviews}
                onSelectTool={handleSelectTool}
                onCompareTools={handleCompareTools}
                onNavigate={handleNavigate}
                onToast={(msg) => {
                  setSelectedAgentToast({ message: msg });
                  setTimeout(() => setSelectedAgentToast(null), 3500);
                }}
              />
            </div>
          </>
        )}

        {currentPage === 'all-tools' && (
          <AllToolsPage
            onSelectTool={handleSelectTool}
            onNavigateCategory={handleNavigateCategory}
            onCompareTools={handleCompareTools}
          />
        )}

        {currentPage === 'best-ai-tools' && (
          <BestAIToolsPage
            onSelectTool={handleSelectTool}
            onNavigateAllTools={() => handleNavigate('all-tools')}
            onArticleReadingChange={setReadingArticle}
          />
        )}

        {currentPage === 'compare' && (
          <CompareToolsPage
            initialToolAId={compareToolAId}
            initialToolBId={compareToolBId}
            onSelectTool={handleSelectTool}
            onNavigateAllTools={() => handleNavigate('all-tools')}
          />
        )}

        {currentPage === 'submit-tool' && (
          <SubmitToolPage
            onNavigateHome={() => handleNavigate('home')}
            onNavigateAllTools={() => handleNavigate('all-tools')}
          />
        )}

        {currentPage === 'about' && (
          <AboutPage
            onNavigateAllTools={() => handleNavigate('all-tools')}
            onNavigateContact={() => handleNavigate('contact')}
          />
        )}

        {currentPage === 'contact' && (
          <ContactPage
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'affiliate-disclosure' && (
          <AffiliateDisclosurePage
            onNavigateAllTools={() => handleNavigate('all-tools')}
            onNavigateAbout={() => handleNavigate('about')}
          />
        )}

        {currentPage === 'privacy-policy' && (
          <PrivacyPolicyPage
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'terms-of-use' && (
          <TermsOfUsePage
            onNavigateHome={() => handleNavigate('home')}
          />
        )}

        {currentPage === 'tool-details' && (
          <ToolDetailsPage
            toolId={selectedToolId}
            onSelectTool={handleSelectTool}
            onCompareWith={(tA, tB) => handleCompareTools(tA, tB)}
            onNavigateAllTools={() => handleNavigate('all-tools')}
            onNavigateCategory={handleNavigateCategory}
          />
        )}

        {currentPage === 'category' && (
          <CategoryPage
            initialCategory={selectedCategory}
            onSelectTool={handleSelectTool}
            onNavigateAllTools={() => handleNavigate('all-tools')}
            onCompareTools={handleCompareTools}
          />
        )}
      </main>

      {/* Global Footer (All legal pages, Contact, newsletter signup, categories, mobile friendly) */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Command Palette Triggered by Ctrl+K / Cmd+K */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigateSection={handleNavigateSection}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenReviews={() => setIsReviewsOpen(true)}
        onSelectAgent={handleSelectAgent}
        onSelectTool={handleSelectTool}
        onToast={(msg) => {
          setSelectedAgentToast({ message: msg });
          setTimeout(() => setSelectedAgentToast(null), 4000);
        }}
      />

      {/* Interactive Searchable Agent Directory Modal */}
      <SearchDirectoryModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        onSelectAgent={handleSelectAgent}
        onToast={(msg) => {
          setSelectedAgentToast({ message: msg });
          setTimeout(() => setSelectedAgentToast(null), 3500);
        }}
      />

      {/* Interactive Real-Time Telemetry & Monitoring Drawer */}
      <TelemetryDrawer
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
      />

      {/* Interactive Community Reviews & Ratings Modal */}
      <CommunityReviewsModal
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
      />

      {/* Interactive 3D WebGL Noomo Labs Simulation Modal */}
      <NoomoLabsModal
        isOpen={isNoomoLabsOpen}
        onClose={() => setIsNoomoLabsOpen(false)}
      />

      {/* Notification Toast */}
      {selectedAgentToast && (
        <div className="fixed bottom-6 right-6 z-50 p-3 sm:p-4 bg-[#0e1018]/95 border border-blue-500/50 rounded-xl shadow-2xl text-xs font-mono text-neutral-200 flex items-center gap-3 backdrop-blur-md animate-fadeIn">
          {selectedAgentToast.agent ? (
            <AgentLogo agent={selectedAgentToast.agent} size="sm" showStatusDot={true} />
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          )}
          <span>{selectedAgentToast.message}</span>
        </div>
      )}

      {/* Floating Bottom-Left Return to Top & Quick Find Controls */}
      {showBackToTop && (
        <div className="fixed bottom-6 left-6 z-40 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <button
            onClick={() => smoothScrollTo(0)}
            className="flex items-center gap-2 px-3 py-2 bg-[#0b0d14]/90 hover:bg-[#131726] border border-white/15 hover:border-blue-400/60 rounded-xl backdrop-blur-md text-[11px] font-mono uppercase tracking-wider text-neutral-300 hover:text-white shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all cursor-pointer group"
            title="Scroll to Top"
          >
            <ArrowUp className="w-3.5 h-3.5 text-blue-400 group-hover:-translate-y-0.5 transition-transform" />
            <span className="hidden sm:inline">Top</span>
          </button>
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-[#0b0d14]/90 hover:bg-[#131726] border border-white/15 hover:border-blue-400/60 rounded-xl backdrop-blur-md text-[11px] font-mono uppercase tracking-wider text-neutral-400 hover:text-blue-300 shadow-[0_8px_24px_rgba(0,0,0,0.6)] transition-all cursor-pointer"
            title="Open Quick Search (Ctrl+K)"
          >
            <Command className="w-3 h-3 text-blue-400" />
            <span>Find</span>
          </button>
        </div>
      )}
    </div>
  );
}
