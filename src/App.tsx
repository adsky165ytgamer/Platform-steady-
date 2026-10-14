/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ViewMode } from './types';
import { LAYER_1 } from './data/curriculum';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { WelcomeView } from './components/WelcomeView';
import { LayerOverview } from './components/LayerOverview';
import { LessonView } from './components/LessonView';

const STORAGE_KEY = 'platformsteady_completed_lessons';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Real persisted progress stored in localStorage
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      // Local storage fallback
    }
    return [];
  });

  // Save completion state whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLessons));
    } catch (e) {
      // Ignore storage error
    }
  }, [completedLessons]);

  // Handle escape key to close sidebar on mobile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Toggle completion of a lesson
  const handleToggleComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) {
        return prev.filter((id) => id !== lessonId);
      } else {
        return [...prev, lessonId];
      }
    });
  };

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const lesson1 = LAYER_1.lessons.find((l) => l.id === 'lesson-1-1');
  const lesson2 = LAYER_1.lessons.find((l) => l.id === 'lesson-1-2');

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#2A2A2A] selection:text-[#F5F5F5]">
      {/* Top Bar Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        completedLessons={completedLessons}
        totalLessons={LAYER_1.lessons.length}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Main Layout Area: Responsive Sidebar + Content */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          completedLessons={completedLessons}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 min-w-0 pb-16 overflow-x-hidden">
          {currentView === 'home' && (
            <HomeView
              onSelectPlatform={(platformId) => {
                if (platformId === 'android') {
                  handleNavigate('welcome');
                }
              }}
              completedLessonsCount={completedLessons.length}
              totalLessonsCount={LAYER_1.lessons.length}
            />
          )}

          {currentView === 'welcome' && (
            <WelcomeView
              onStart={() => handleNavigate('layer-1')}
              onBack={() => handleNavigate('home')}
            />
          )}

          {currentView === 'layer-1' && (
            <LayerOverview
              onNavigate={handleNavigate}
              completedLessons={completedLessons}
            />
          )}

          {currentView === 'lesson-1-1' && lesson1 && (
            <LessonView
              lesson={lesson1}
              onNavigate={handleNavigate}
              isCompleted={completedLessons.includes(lesson1.id)}
              onToggleComplete={handleToggleComplete}
              prevLessonId={undefined}
              nextLessonId={'lesson-1-2'}
            />
          )}

          {currentView === 'lesson-1-2' && lesson2 && (
            <LessonView
              lesson={lesson2}
              onNavigate={handleNavigate}
              isCompleted={completedLessons.includes(lesson2.id)}
              onToggleComplete={handleToggleComplete}
              prevLessonId={'lesson-1-1'}
              nextLessonId={undefined}
            />
          )}
        </main>
      </div>

      {/* Industrial Monochrome Footer */}
      <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A] py-6 text-xs text-[#888888] shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#F5F5F5]">Platform Steady</span>
            <span>·</span>
            <span>Educational platform for systems architecture</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-[#666666]">
            <span>Initial Release</span>
            <span>·</span>
            <span>Android Layer 1</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
