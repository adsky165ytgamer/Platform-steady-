import React from 'react';
import { User } from 'firebase/auth';
import { ViewMode } from '../types';
import {
  MenuIcon,
  BookOpenIcon,
  ActivityIcon,
  TerminalIcon,
  CpuIcon,
  ShieldIcon,
  LayersIcon,
} from './Icons';
import { GoogleAuthButton } from './GoogleAuthButton';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  completedLessons: string[];
  totalLessons: number;
  onToggleSidebar: () => void;
  user: User | null;
  username?: string;
  authLoading: boolean;
  onOpenSplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  completedLessons,
  totalLessons,
  onToggleSidebar,
  user,
  username,
  authLoading,
  onOpenSplash,
}) => {
  const isWorkbenchView = currentView.startsWith('workbench-');

  return (
    <header className="sticky top-0 z-30 bg-[#080808]/95 backdrop-blur-sm border-b border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 h-16">
        
        {/* Zone 1: Wordmark & Mobile Drawer Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation drawer"
            className="md:hidden w-11 h-11 flex items-center justify-center -ml-2 rounded-lg text-[#C0C0C0] hover:text-[#F5F5F5] hover:bg-[#121212] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C0C0C0] transition-colors"
          >
            <MenuIcon className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-lg font-bold tracking-tight text-[#F5F5F5] hover:text-[#C0C0C0] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5 min-h-[44px]"
          >
            <span className="w-2.5 h-2.5 bg-[#F5F5F5] inline-block transform rotate-45" />
            <span>Platform Steady</span>
          </button>

          {/* Quick Dual-Engine Badge in Header */}
          <div className="hidden lg:flex items-center ml-2 p-0.5 rounded-lg bg-[#141414] border border-[#2A2A2A] text-xs font-mono">
            <button
              onClick={() => onNavigate('workbench-overview')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                isWorkbenchView
                  ? 'bg-[#F5F5F5] text-[#080808] font-bold shadow'
                  : 'text-[#888888] hover:text-[#F5F5F5]'
              }`}
            >
              <ActivityIcon className="w-3 h-3" />
              <span>Workbench</span>
            </button>
            <button
              onClick={() => onNavigate('welcome')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                !isWorkbenchView && currentView !== 'home'
                  ? 'bg-[#F5F5F5] text-[#080808] font-bold shadow'
                  : 'text-[#888888] hover:text-[#F5F5F5]'
              }`}
            >
              <BookOpenIcon className="w-3 h-3" />
              <span>Academy</span>
            </button>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-4 text-xs font-mono text-[#A0A0A0]">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`hover:text-[#F5F5F5] transition-colors whitespace-nowrap py-1.5 ${
              currentView === 'home' ? 'text-[#F5F5F5] border-b-2 border-[#F5F5F5]' : ''
            }`}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => onNavigate('workbench-overview')}
            className={`hover:text-[#F5F5F5] transition-colors whitespace-nowrap py-1.5 ${
              currentView === 'workbench-overview' ? 'text-[#F5F5F5] border-b-2 border-[#F5F5F5]' : ''
            }`}
          >
            Control Deck
          </button>

          <button
            type="button"
            onClick={() => onNavigate('workbench-assets')}
            className={`hover:text-[#F5F5F5] transition-colors whitespace-nowrap py-1.5 ${
              currentView === 'workbench-assets' ? 'text-[#F5F5F5] border-b-2 border-[#F5F5F5]' : ''
            }`}
          >
            Assets (IDB)
          </button>

          <button
            type="button"
            onClick={() => onNavigate('workbench-network')}
            className={`hover:text-[#F5F5F5] transition-colors whitespace-nowrap py-1.5 ${
              currentView === 'workbench-network' ? 'text-[#F5F5F5] border-b-2 border-[#F5F5F5]' : ''
            }`}
          >
            Network
          </button>

          <button
            type="button"
            onClick={() => onNavigate('workbench-plugins')}
            className={`hover:text-[#F5F5F5] transition-colors whitespace-nowrap py-1.5 ${
              currentView === 'workbench-plugins' ? 'text-[#F5F5F5] border-b-2 border-[#F5F5F5]' : ''
            }`}
          >
            Plugins
          </button>

          <button
            type="button"
            onClick={() => onNavigate('layer-1')}
            className={`hover:text-[#F5F5F5] transition-colors whitespace-nowrap py-1.5 ${
              currentView === 'layer-1' || currentView.startsWith('lesson-') ? 'text-[#F5F5F5] border-b-2 border-[#F5F5F5]' : ''
            }`}
          >
            Academy (1-5)
          </button>
        </nav>

        {/* Zone 3: Actions - Intro replay, Google Auth & Profile, Quick Terminal/Start */}
        <div className="flex items-center gap-2.5 shrink-0">
          {onOpenSplash && (
            <button
              type="button"
              onClick={onOpenSplash}
              title="Replay Brand Intro"
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono text-[#777777] hover:text-[#C0C0C0] border border-[#222222] hover:border-[#333333] transition-colors"
            >
              <span>Intro</span>
            </button>
          )}

          <GoogleAuthButton
            user={user}
            username={username}
            loading={authLoading}
            compact
          />

          <button
            type="button"
            onClick={() => {
              if (isWorkbenchView) {
                onNavigate('welcome');
              } else {
                onNavigate('workbench-overview');
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium text-[#080808] bg-[#F5F5F5] hover:bg-[#C0C0C0] transition-colors rounded-md whitespace-nowrap shrink-0 min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5F5F5]"
          >
            {isWorkbenchView ? (
              <>
                <BookOpenIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Academy</span>
              </>
            ) : (
              <>
                <ActivityIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">OS Workbench</span>
              </>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
