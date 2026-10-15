import React, { useState, useMemo } from 'react';
import { User } from 'firebase/auth';
import { ViewMode } from '../types';
import { LAYER_1 } from '../data/curriculum';
import { GoogleAuthButton } from './GoogleAuthButton';
import {
  CloseIcon,
  HomeIcon,
  CheckCircleIcon,
  CircleIcon,
  SearchIcon,
  AndroidIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  LayersIcon,
  CpuIcon,
  ShieldIcon,
  TerminalIcon,
  FolderIcon,
  ActivityIcon,
  DownloadIcon,
  RadioIcon,
  CodeIcon,
} from './Icons';

interface SidebarProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  completedLessons: string[];
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  username?: string;
  authLoading: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  completedLessons,
  isOpen,
  onClose,
  user,
  username,
  authLoading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAndroidExpanded, setIsAndroidExpanded] = useState(true);
  const [isWorkbenchExpanded, setIsWorkbenchExpanded] = useState(true);

  // Live real search across workbench and curriculum
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();

    const matches: { id: ViewMode; title: string; matchReason: string }[] = [];

    // Search in Workbench tools
    const workbenchItems: { id: ViewMode; title: string; desc: string }[] = [
      { id: 'workbench-overview', title: 'OS Control Deck', desc: 'System vitals, memory gauge, kernel logs' },
      { id: 'workbench-assets', title: 'Zero-Server Asset Manager', desc: 'Chunked fetch, IndexedDB Blobs, zero egress fees' },
      { id: 'workbench-network', title: 'Network & Payload Inspector', desc: 'Telemetry, latency ms, IDB and gateway traces' },
      { id: 'workbench-plugins', title: 'Dynamic Module Loader', desc: 'Runtime script injection, BaseMicroTool sandbox' },
      { id: 'workbench-process', title: 'Process & LMK Lab', desc: 'Low Memory Killer, cgroups, OOM scores, SIGKILL' },
      { id: 'workbench-sandbox', title: 'Security & Sandbox Wall', desc: 'UID isolation, permissions, SELinux policies' },
      { id: 'workbench-ipc', title: 'Binder IPC Engine', desc: 'Android IPC, ioctl, Parcel marshaling, zero-copy' },
      { id: 'workbench-terminal', title: 'Virtual Terminal (/bin/sh)', desc: 'Shell commands, ps, dumpsys, cat /proc' },
      { id: 'workbench-storage', title: 'Storage & Inode Explorer', desc: 'Filesystem hierarchy, 0700 permissions, scoped storage' },
    ];

    workbenchItems.forEach((wb) => {
      if (wb.title.toLowerCase().includes(query) || wb.desc.toLowerCase().includes(query)) {
        matches.push({
          id: wb.id,
          title: wb.title,
          matchReason: 'Workbench Tool',
        });
      }
    });

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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 md:z-20 h-screen w-72 sm:w-80 bg-[#0E0E0E] border-r border-[#2A2A2A] flex flex-col will-change-transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        aria-label="Sidebar Navigation"
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-[#2A2A2A] shrink-0">
          <button
            type="button"
            onClick={() => handleSelect('home')}
            className="flex items-center gap-2.5 text-left group min-h-[44px]"
          >
            <div className="w-2.5 h-2.5 bg-[#F5F5F5] rotate-45 group-hover:bg-[#C0C0C0] transition-colors" />
            <span className="text-sm font-semibold tracking-tight text-[#F5F5F5]">Platform Steady</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md text-[#C0C0C0] hover:text-[#F5F5F5] hover:bg-[#1A1A1A] transition-colors"
            aria-label="Close sidebar navigation"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Live Search */}
        <div className="p-3.5 border-b border-[#2A2A2A] shrink-0">
          <div className="relative">
            <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#888888] pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools & curriculum..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#080808] border border-[#2A2A2A] rounded-md text-xs text-[#F5F5F5] placeholder-[#666666] focus:outline-none focus:border-[#C0C0C0] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#888888] hover:text-[#F5F5F5] min-h-[30px] flex items-center"
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
                    className="w-full text-left p-2 rounded hover:bg-[#202020] text-xs transition-colors flex flex-col gap-0.5 min-h-[40px] justify-center"
                  >
                    <span className="text-[#F5F5F5] font-medium truncate">{result.title}</span>
                    <span className="text-[10px] font-mono text-[#C0C0C0]">{result.matchReason}</span>
                  </button>
                ))
              ) : (
                <div className="p-2 text-center text-xs text-[#888888]">
                  No matching tools or lessons found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Content Area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          
          {/* 1. HOMEPAGE AT VERY TOP */}
          <div>
            <button
              type="button"
              onClick={() => handleSelect('home')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors min-h-[40px] ${
                currentView === 'home'
                  ? 'bg-[#1C1C1C] text-[#F5F5F5] border border-[#2A2A2A]'
                  : 'text-[#C0C0C0] hover:text-[#F5F5F5] hover:bg-[#141414]'
              }`}
            >
              <HomeIcon className="w-4 h-4 text-[#C0C0C0] shrink-0" />
              <span className="font-semibold text-xs">Home Overview</span>
            </button>
          </div>

          {/* 2. ENGINE 1: OS WORKBENCH */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 pb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] font-bold">
                OS Workbench
              </span>
              <button
                type="button"
                onClick={() => setIsWorkbenchExpanded((prev) => !prev)}
                className="text-[#666666] hover:text-[#C0C0C0]"
              >
                {isWorkbenchExpanded ? (
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {isWorkbenchExpanded && (
              <div className="space-y-0.5 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleSelect('workbench-overview')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                    currentView === 'workbench-overview'
                      ? 'bg-[#1F1F1F] text-[#F5F5F5] font-semibold border border-[#333333]'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#141414]'
                  }`}
                >
                  <ActivityIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
                  <span>Control Deck</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('workbench-assets')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                    currentView === 'workbench-assets'
                      ? 'bg-[#1F1F1F] text-[#F5F5F5] font-semibold border border-[#333333]'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#141414]'
                  }`}
                >
                  <DownloadIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
                  <span>Zero-Server Assets</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('workbench-network')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                    currentView === 'workbench-network'
                      ? 'bg-[#1F1F1F] text-[#F5F5F5] font-semibold border border-[#333333]'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#141414]'
                  }`}
                >
                  <RadioIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
                  <span>Network Inspector</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('workbench-plugins')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                    currentView === 'workbench-plugins'
                      ? 'bg-[#1F1F1F] text-[#F5F5F5] font-semibold border border-[#333333]'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#141414]'
                  }`}
                >
                  <CodeIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
                  <span>Dynamic Plugins</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('workbench-process')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                    currentView === 'workbench-process'
                      ? 'bg-[#1F1F1F] text-[#F5F5F5] font-semibold border border-[#333333]'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#141414]'
                  }`}
                >
                  <CpuIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
                  <span>Process &amp; LMK Lab</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('workbench-sandbox')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                    currentView === 'workbench-sandbox'
                      ? 'bg-[#1F1F1F] text-[#F5F5F5] font-semibold border border-[#333333]'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#141414]'
                  }`}
                >
                  <ShieldIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
                  <span>Sandbox &amp; Permissions</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('workbench-ipc')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                    currentView === 'workbench-ipc'
                      ? 'bg-[#1F1F1F] text-[#F5F5F5] font-semibold border border-[#333333]'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#141414]'
                  }`}
                >
                  <LayersIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
                  <span>Binder IPC Engine</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('workbench-terminal')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                    currentView === 'workbench-terminal'
                      ? 'bg-[#1F1F1F] text-[#F5F5F5] font-semibold border border-[#333333]'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#141414]'
                  }`}
                >
                  <TerminalIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
                  <span>Terminal Shell (/bin/sh)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('workbench-storage')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors text-left ${
                    currentView === 'workbench-storage'
                      ? 'bg-[#1F1F1F] text-[#F5F5F5] font-semibold border border-[#333333]'
                      : 'text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#141414]'
                  }`}
                >
                  <FolderIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
                  <span>Storage &amp; Inodes</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. ENGINE 2: ARCHITECTURE ACADEMY */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 pb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#777777] font-bold">
                Architecture Academy
              </span>
              <button
                type="button"
                onClick={() => setIsAndroidExpanded((prev) => !prev)}
                className="text-[#666666] hover:text-[#C0C0C0]"
              >
                {isAndroidExpanded ? (
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRightIcon className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Android Curriculum Sub-Items */}
            {isAndroidExpanded && (
              <div className="space-y-1 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handleSelect('welcome')}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-left ${
                    currentView === 'welcome'
                      ? 'bg-[#1F1F1F] text-[#F5F5F5] font-semibold'
                      : 'text-[#888888] hover:text-[#F5F5F5] hover:bg-[#141414]'
                  }`}
                >
                  <AndroidIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
                  <span>Android Platform Intro</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect('layer-1')}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md transition-colors ${
                    currentView === 'layer-1'
                      ? 'bg-[#1F1F1F] text-[#F5F5F5] font-semibold'
                      : 'text-[#888888] hover:text-[#F5F5F5] hover:bg-[#141414]'
                  }`}
                >
                  <span>Layer 1: OS &amp; Android</span>
                </button>

                {/* Individual Lessons */}
                <div className="ml-3 pl-2.5 border-l border-[#222222] space-y-0.5 pt-0.5">
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
                            ? 'bg-[#252525] text-[#F5F5F5] font-semibold'
                            : 'text-[#777777] hover:text-[#F5F5F5] hover:bg-[#161616]'
                        }`}
                      >
                        <span className="truncate">Lesson {lesson.number}</span>
                        {isCompleted ? (
                          <CheckCircleIcon className="w-3 h-3 text-[#F5F5F5] shrink-0 ml-1.5" />
                        ) : (
                          <CircleIcon className="w-3 h-3 text-[#444444] shrink-0 ml-1.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* User Account / Google Sign-In & Real Progress Indicator Footer */}
        <div className="p-3.5 border-t border-[#2A2A2A] bg-[#0A0A0A] shrink-0 space-y-3">
          <GoogleAuthButton user={user} username={username} loading={authLoading} />

          <div>
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
        </div>

      </aside>
    </>
  );
};
