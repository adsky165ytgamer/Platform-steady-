import React, { useState, useMemo } from 'react';
import { ViewMode } from '../types';
import { LAYER_1 } from '../data/curriculum';
import {
  X,
  Home,
  Layers,
  CheckCircle2,
  Circle,
  Search,
  Smartphone,
  ChevronDown,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  completedLessons: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  completedLessons,
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAndroidExpanded, setIsAndroidExpanded] = useState(true);

  // Live real search across current Layer 1 lessons and concepts
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();

    const matches: { id: ViewMode; title: string; matchReason: string }[] = [];

    // Search in Layer 1
    if (LAYER_1.title.toLowerCase().includes(query) || LAYER_1.description.toLowerCase().includes(query)) {
      matches.push({
        id: 'layer-1',
        title: LAYER_1.title,
        matchReason: 'Layer 1 Overview',
      });
    }

    // Search in lessons
    LAYER_1.lessons.forEach((l) => {
      const inTitle = l.title.toLowerCase().includes(query);
      const inContent = l.content.some((c) => c.toLowerCase().includes(query));
      const inConcepts = l.focusConcepts.some(
        (fc) => fc.term.toLowerCase().includes(query) || fc.explanation.toLowerCase().includes(query)
      );

      if (inTitle || inContent || inConcepts) {
        matches.push({
          id: l.id as ViewMode,
          title: l.title,
          matchReason: inTitle ? 'Lesson Title' : inConcepts ? 'Key Concept' : 'Content Match',
        });
      }
    });

    return matches;
  }, [searchQuery]);

  const handleSelect = (view: ViewMode) => {
    onNavigate(view);
    onClose();
  };

  const percentComplete = Math.round((completedLessons.length / LAYER_1.lessons.length) * 100);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-72 sm:w-80 bg-[#0E0E0E] border-r border-[#2A2A2A] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        aria-label="Sidebar Navigation"
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#2A2A2A] shrink-0">
          <button
            type="button"
            onClick={() => handleSelect('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="w-2 h-2 bg-[#F5F5F5] rotate-45 group-hover:bg-[#C0C0C0] transition-colors" />
            <span className="text-sm font-semibold tracking-tight text-[#F5F5F5]">Platform Steady</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-md text-[#C0C0C0] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Curriculum Search */}
        <div className="p-3.5 border-b border-[#2A2A2A] shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lessons & concepts..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#080808] border border-[#2A2A2A] rounded-md text-xs text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:border-[#C0C0C0] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#888888] hover:text-[#F5F5F5]"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Result Dropdown */}
          {searchQuery && (
            <div className="mt-2 p-2 bg-[#141414] border border-[#2A2A2A] rounded-md max-h-48 overflow-y-auto space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <button
                    key={result.id}
                    type="button"
                    onClick={() => {
                      handleSelect(result.id);
                      setSearchQuery('');
                    }}
                    className="w-full text-left p-2 rounded hover:bg-[#202020] text-xs transition-colors flex flex-col gap-0.5"
                  >
                    <span className="text-[#F5F5F5] font-medium truncate">{result.title}</span>
                    <span className="text-[10px] font-mono text-[#C0C0C0]">{result.matchReason}</span>
                  </button>
                ))
              ) : (
                <div className="p-2 text-center text-xs text-[#888888]">
                  No matching lessons or concepts found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Content Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          
          {/* 1. HOMEPAGE AT VERY TOP */}
          <div>
            <button
              type="button"
              onClick={() => handleSelect('home')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                currentView === 'home'
                  ? 'bg-[#1C1C1C] text-[#F5F5F5] border border-[#2A2A2A]'
                  : 'text-[#C0C0C0] hover:text-[#F5F5F5] hover:bg-[#141414]'
              }`}
            >
              <Home className="w-4 h-4 text-[#C0C0C0]" />
              <span className="font-semibold">Home</span>
            </button>
          </div>

          {/* 2. CURRICULUMS SECTION */}
          <div className="space-y-1">
            <div className="text-[10px] font-mono uppercase tracking-wider text-[#666666] px-3 pb-1">
              Curriculums
            </div>

            {/* Android Curriculum Row with Direct Navigation + Expansion Arrow */}
            <div className="rounded-lg overflow-hidden">
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  currentView === 'welcome' || currentView === 'layer-1' || currentView.startsWith('lesson-')
                    ? 'bg-[#181818] text-[#F5F5F5]'
                    : 'text-[#C0C0C0] hover:bg-[#141414] hover:text-[#F5F5F5]'
                }`}
              >
                {/* Curriculum Title button - Directly takes user to Android section */}
                <button
                  type="button"
                  onClick={() => handleSelect('welcome')}
                  className="flex items-center gap-2.5 font-medium flex-1 text-left truncate mr-1"
                >
                  <Smartphone className="w-4 h-4 text-[#C0C0C0] shrink-0" />
                  <span className="truncate">Android</span>
                </button>

                {/* Small expansion arrow next to the title to toggle individual lessons */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAndroidExpanded((prev) => !prev);
                  }}
                  aria-expanded={isAndroidExpanded}
                  aria-label={isAndroidExpanded ? 'Collapse Android lessons' : 'Expand Android lessons'}
                  className="p-1 rounded hover:bg-[#242424] text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors shrink-0"
                >
                  {isAndroidExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Collapsible Sub-Items: Welcome, Layer 1, Lessons */}
              {isAndroidExpanded && (
                <div className="mt-1 ml-4 pl-3 border-l border-[#242424] space-y-1">
                  
                  {/* Android Welcome Experience */}
                  <button
                    type="button"
                    onClick={() => handleSelect('welcome')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] transition-colors truncate block ${
                      currentView === 'welcome'
                        ? 'bg-[#222222] text-[#F5F5F5] font-semibold'
                        : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#141414]'
                    }`}
                  >
                    Welcome to Android
                  </button>

                  {/* Layer 1 Overview */}
                  <button
                    type="button"
                    onClick={() => handleSelect('layer-1')}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[11px] transition-colors ${
                      currentView === 'layer-1'
                        ? 'bg-[#222222] text-[#F5F5F5] font-semibold'
                        : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#141414]'
                    }`}
                  >
                    <span className="truncate">Layer 1: OS & Android</span>
                  </button>

                  {/* Individual Lessons */}
                  <div className="ml-2 pl-2 border-l border-[#2A2A2A] space-y-0.5 pt-0.5">
                    {LAYER_1.lessons.map((lesson) => {
                      const isCompleted = completedLessons.includes(lesson.id);
                      const isCurrent = currentView === lesson.id;

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => handleSelect(lesson.id as ViewMode)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-[11px] transition-colors ${
                            isCurrent
                              ? 'bg-[#2A2A2A] text-[#F5F5F5] font-semibold'
                              : 'text-[#888888] hover:text-[#F5F5F5] hover:bg-[#161616]'
                          }`}
                        >
                          <span className="truncate">Lesson {lesson.number}</span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#F5F5F5] shrink-0 ml-1.5" />
                          ) : (
                            <Circle className="w-3.5 h-3.5 text-[#444444] shrink-0 ml-1.5" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>

        {/* Real Progress Indicator Footer */}
        <div className="p-3.5 border-t border-[#2A2A2A] bg-[#0A0A0A] shrink-0">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-mono text-[#888888] text-[11px]">Layer 1 Progress</span>
            <span className="font-mono text-[#F5F5F5] text-[11px] tabular-nums">
              {completedLessons.length}/{LAYER_1.lessons.length} ({percentComplete}%)
            </span>
          </div>
          <div className="w-full h-1 bg-[#1E1E1E] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#F5F5F5] transition-all duration-300 ease-out"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>

      </aside>
    </>
  );
};
