/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { ViewMode } from './types';
import { LAYER_1 } from './data/curriculum';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { WelcomeView } from './components/WelcomeView';
import { LayerOverview } from './components/LayerOverview';
import { LessonView } from './components/LessonView';
import { SplashScreen } from './components/SplashScreen';
import { AuthView } from './components/AuthView';
import { WorkbenchDeck } from './components/workbench/WorkbenchDeck';
import {
  auth,
  onAuthStateChanged,
  syncUserProgress,
  saveUserCompletedLessons,
  getUserProfile,
} from './firebase';

const STORAGE_KEY = 'platformsteady_completed_lessons';
const SPLASH_SEEN_KEY = 'platformsteady_splash_seen_session';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string>('');
  const [authLoading, setAuthLoading] = useState(true);
  const [showSplash, setShowSplash] = useState<boolean>(() => {
    // Show splash on initial launch unless dismissed in current session
    return sessionStorage.getItem(SPLASH_SEEN_KEY) !== 'true';
  });

  // Persisted progress stored in localStorage
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

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Fetch existing user profile to retrieve custom username
          const profile = await getUserProfile(currentUser.uid);
          if (profile?.username) {
            setUsername(profile.username);
          } else if (currentUser.displayName) {
            setUsername(currentUser.displayName);
          }

          // Sync local progress with user profile in Firestore
          const { mergedCompleted, profile: syncedProfile } = await syncUserProgress(
            currentUser,
            completedLessons,
            profile?.username
          );

          if (syncedProfile.username) {
            setUsername(syncedProfile.username);
          }
          setCompletedLessons(mergedCompleted);

          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedCompleted));
          } catch (e) {
            // Ignore storage err
          }
        } catch (err) {
          console.error('Failed to sync user profile/progress on auth:', err);
        }
      } else {
        setUsername('');
      }

      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Save completion state to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completedLessons));
    } catch (e) {
      // Ignore storage error
    }
  }, [completedLessons]);

  // Handle escape key to close sidebar or splash
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showSplash) {
          handleDismissSplash();
        } else if (sidebarOpen) {
          setSidebarOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, showSplash]);

  // Long-press and context menu safety: blocks native popups on interactive cards and buttons
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.closest('button, a, .interactive-card, [role="button"]')) {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const handleDismissSplash = () => {
    setShowSplash(false);
    sessionStorage.setItem(SPLASH_SEEN_KEY, 'true');
  };

  // Toggle completion of a lesson
  const handleToggleComplete = async (lessonId: string) => {
    const newCompleted = completedLessons.includes(lessonId)
      ? completedLessons.filter((id) => id !== lessonId)
      : [...completedLessons, lessonId];

    setCompletedLessons(newCompleted);

    // If user is signed in, persist to Firestore
    if (user) {
      try {
        await saveUserCompletedLessons(user, newCompleted, username);
      } catch (err) {
        console.error('Error saving progress to Firestore:', err);
      }
    }
  };

  const handleNavigate = (view: ViewMode) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle user authentication success
  const handleAuthSuccess = async (authUser: User) => {
    setUser(authUser);
    try {
      const profile = await getUserProfile(authUser.uid);
      if (profile?.username) {
        setUsername(profile.username);
      } else if (authUser.displayName) {
        setUsername(authUser.displayName);
      }
    } catch (e) {
      // Ignore
    }
  };

  // Render Opening Splash Screen if active
  if (showSplash) {
    return <SplashScreen onComplete={handleDismissSplash} />;
  }

  // Render Loading state while verifying authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#F5F5F5] flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 bg-[#F5F5F5] rotate-45 animate-spin" />
          <p className="font-mono text-xs text-[#888888] tracking-widest uppercase">
            Initializing Platform Steady...
          </p>
        </div>
      </div>
    );
  }

  // ENFORCED AUTHENTICATION GATE:
  // Unauthenticated users MUST sign in or register before accessing curriculum or workbench
  if (!user) {
    return (
      <div className="min-h-screen bg-[#080808] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#2A2A2A] selection:text-[#F5F5F5]">
        <Header
          currentView="home"
          onNavigate={() => {}}
          completedLessons={[]}
          totalLessons={LAYER_1.lessons.length}
          onToggleSidebar={() => {}}
          user={null}
          username=""
          authLoading={false}
          onOpenSplash={() => setShowSplash(true)}
        />
        <main className="flex-1 flex items-center justify-center">
          <AuthView onSuccess={handleAuthSuccess} />
        </main>
        <footer className="border-t border-[#2A2A2A] bg-[#0A0A0A] py-4 text-center text-xs font-mono text-[#666666]">
          Platform Steady // Core Authentication Gateway
        </footer>
      </div>
    );
  }

  const lesson1 = LAYER_1.lessons.find((l) => l.id === 'lesson-1-1');
  const lesson2 = LAYER_1.lessons.find((l) => l.id === 'lesson-1-2');
  const lesson3 = LAYER_1.lessons.find((l) => l.id === 'lesson-1-3');
  const lesson4 = LAYER_1.lessons.find((l) => l.id === 'lesson-1-4');
  const lesson5 = LAYER_1.lessons.find((l) => l.id === 'lesson-1-5');

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] flex flex-col font-sans selection:bg-[#2A2A2A] selection:text-[#F5F5F5]">
      {/* Top Bar Header with Dual-Engine switcher & Profile */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        completedLessons={completedLessons}
        totalLessons={LAYER_1.lessons.length}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        user={user}
        username={username}
        authLoading={authLoading}
        onOpenSplash={() => setShowSplash(true)}
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
          user={user}
          username={username}
          authLoading={authLoading}
        />

        {/* Viewport Content Area */}
        <main className="flex-1 min-w-0 pb-16 overflow-x-hidden">
          {currentView === 'home' && (
            <HomeView
              onNavigate={handleNavigate}
              completedLessonsCount={completedLessons.length}
              totalLessonsCount={LAYER_1.lessons.length}
              user={user}
              username={username}
              authLoading={authLoading}
            />
          )}

          {/* WORKBENCH SUBSYSTEM VIEWS */}
          {currentView === 'workbench-overview' && (
            <WorkbenchDeck
              initialTab="overview"
              onSwitchToAcademy={() => handleNavigate('welcome')}
            />
          )}

          {currentView === 'workbench-assets' && (
            <WorkbenchDeck
              initialTab="assets"
              onSwitchToAcademy={() => handleNavigate('welcome')}
            />
          )}

          {currentView === 'workbench-network' && (
            <WorkbenchDeck
              initialTab="network"
              onSwitchToAcademy={() => handleNavigate('welcome')}
            />
          )}

          {currentView === 'workbench-plugins' && (
            <WorkbenchDeck
              initialTab="plugins"
              onSwitchToAcademy={() => handleNavigate('welcome')}
            />
          )}

          {currentView === 'workbench-process' && (
            <WorkbenchDeck
              initialTab="process"
              onSwitchToAcademy={() => handleNavigate('welcome')}
            />
          )}

          {currentView === 'workbench-sandbox' && (
            <WorkbenchDeck
              initialTab="sandbox"
              onSwitchToAcademy={() => handleNavigate('welcome')}
            />
          )}

          {currentView === 'workbench-ipc' && (
            <WorkbenchDeck
              initialTab="ipc"
              onSwitchToAcademy={() => handleNavigate('welcome')}
            />
          )}

          {currentView === 'workbench-terminal' && (
            <WorkbenchDeck
              initialTab="terminal"
              onSwitchToAcademy={() => handleNavigate('welcome')}
            />
          )}

          {currentView === 'workbench-storage' && (
            <WorkbenchDeck
              initialTab="storage"
              onSwitchToAcademy={() => handleNavigate('welcome')}
            />
          )}

          {/* ACADEMY CURRICULUM VIEWS */}
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
              nextLessonId={'lesson-1-3'}
            />
          )}

          {currentView === 'lesson-1-3' && lesson3 && (
            <LessonView
              lesson={lesson3}
              onNavigate={handleNavigate}
              isCompleted={completedLessons.includes(lesson3.id)}
              onToggleComplete={handleToggleComplete}
              prevLessonId={'lesson-1-2'}
              nextLessonId={'lesson-1-4'}
            />
          )}

          {currentView === 'lesson-1-4' && lesson4 && (
            <LessonView
              lesson={lesson4}
              onNavigate={handleNavigate}
              isCompleted={completedLessons.includes(lesson4.id)}
              onToggleComplete={handleToggleComplete}
              prevLessonId={'lesson-1-3'}
              nextLessonId={'lesson-1-5'}
            />
          )}

          {currentView === 'lesson-1-5' && lesson5 && (
            <LessonView
              lesson={lesson5}
              onNavigate={handleNavigate}
              isCompleted={completedLessons.includes(lesson5.id)}
              onToggleComplete={handleToggleComplete}
              prevLessonId={'lesson-1-4'}
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
            <span>Universal Operating System &amp; Architecture Platform</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-[#666666]">
            <span>Dual-Engine Architecture</span>
            <span>·</span>
            <span>OS Workbench + Systems Academy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
