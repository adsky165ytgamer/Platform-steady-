import React from 'react';
import { ViewMode } from '../types';
import { Menu, BookOpen, Layers } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  completedLessons: string[];
  totalLessons: number;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  completedLessons,
  totalLessons,
  onToggleSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#080808]/95 backdrop-blur-sm border-b border-[#2A2A2A]">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 lg:px-8 h-16">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation drawer"
            className="md:hidden p-2 -ml-2 rounded-lg text-[#C0C0C0] hover:text-[#F5F5F5] hover:bg-[#121212] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C0C0C0]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-lg font-bold tracking-tight text-[#F5F5F5] hover:text-[#C0C0C0] transition-colors whitespace-nowrap shrink-0 flex items-center gap-2.5"
          >
            <span className="w-2.5 h-2.5 bg-[#F5F5F5] rounded-none inline-block transform rotate-45" />
            <span>Platform Steady</span>
          </button>
        </div>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#C0C0C0]">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`hover:text-[#F5F5F5] transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentView === 'home' ? 'text-[#F5F5F5] border-b-2 border-[#F5F5F5]' : ''
            }`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate('welcome')}
            className={`hover:text-[#F5F5F5] transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentView === 'welcome' ? 'text-[#F5F5F5] border-b-2 border-[#F5F5F5]' : ''
            }`}
          >
            Android Intro
          </button>
          <button
            type="button"
            onClick={() => onNavigate('layer-1')}
            className={`hover:text-[#F5F5F5] transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentView === 'layer-1' ? 'text-[#F5F5F5] border-b-2 border-[#F5F5F5]' : ''
            }`}
          >
            Layer 1
          </button>
          <button
            type="button"
            onClick={() => onNavigate('lesson-1-1')}
            className={`hover:text-[#F5F5F5] transition-colors whitespace-nowrap shrink-0 py-1 ${
              currentView.startsWith('lesson-') ? 'text-[#F5F5F5] border-b-2 border-[#F5F5F5]' : ''
            }`}
          >
            Lessons
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (currentView === 'home') {
                onNavigate('welcome');
              } else if (currentView === 'welcome') {
                onNavigate('layer-1');
              } else if (currentView === 'layer-1') {
                onNavigate('lesson-1-1');
              } else {
                onNavigate('layer-1');
              }
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium text-[#080808] bg-[#F5F5F5] hover:bg-[#C0C0C0] transition-colors rounded-md whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F5F5F5] focus-visible:ring-offset-[#080808]"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              {completedLessons.length === totalLessons
                ? 'Review Lessons'
                : currentView === 'home'
                ? 'Start Android'
                : 'Current Layer'}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
};
