import React from 'react';
import { User } from 'firebase/auth';
import {
  AndroidIcon,
  ArrowRightIcon,
  CompassIcon,
  LayersIcon,
  CheckCircleIcon,
  CpuIcon,
  ShieldIcon,
  TerminalIcon,
  FolderIcon,
  ActivityIcon,
  DownloadIcon,
  RadioIcon,
  CodeIcon,
} from './Icons';
import { GoogleAuthButton } from './GoogleAuthButton';
import { ViewMode } from '../types';

interface HomeViewProps {
  onNavigate: (view: ViewMode) => void;
  completedLessonsCount: number;
  totalLessonsCount: number;
  user: User | null;
  username?: string;
  authLoading: boolean;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  completedLessonsCount,
  totalLessonsCount,
  user,
  username,
  authLoading,
}) => {
  const displayTitle = username ? `@${username}` : user?.displayName || user?.email?.split('@')[0] || 'Architect';

  return (
    <div className="max-w-[1020px] mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12 animate-view-enter">
      
      {/* Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#C0C0C0] uppercase tracking-widest border border-[#2A2A2A] bg-[#121212] px-3 py-1 rounded">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Universal Engineering Interface // Dual-Engine Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F5F5] text-balance">
          Platform Steady
        </h1>
        <p className="text-base sm:text-lg text-[#C0C0C0] max-w-2xl leading-relaxed">
          The comprehensive operating systems platform: an interactive live runtime workbench paired with deep foundational architecture specifications.
        </p>

        {/* User Account Banner / Status */}
        <div className="pt-2">
          {user ? (
            <div className="contain-card flex items-center justify-between p-4 rounded-xl border border-[#2A2A2A] bg-[#121212] text-xs">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayTitle}
                    className="w-9 h-9 rounded-full object-cover border border-[#3E3E3E]"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#2A2A2A] text-[#F5F5F5] flex items-center justify-center font-bold font-mono">
                    {displayTitle.replace('@', '').charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#F5F5F5] font-mono">
                      {displayTitle}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                      <CheckCircleIcon className="w-3 h-3 text-emerald-400" />
                      Cloud Synced
                    </span>
                  </div>
                  <span className="font-mono text-[#888888] text-[11px]">{user.email}</span>
                </div>
              </div>

              <div className="text-right font-mono text-[#A0A0A0] text-[11px]">
                <span className="text-[#F5F5F5] font-semibold">{completedLessonsCount}</span> / {totalLessonsCount} Lessons Completed
              </div>
            </div>
          ) : (
            <div className="contain-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-[#2A2A2A] bg-[#121212]">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-[#F5F5F5]">
                  Sync Your Platform State Across Devices
                </p>
                <p className="text-[11px] text-[#A0A0A0] max-w-md">
                  Sign in with your Google account to automatically store completed lessons and workbench telemetry in your secure cloud profile.
                </p>
              </div>
              <div className="shrink-0 w-full sm:w-auto">
                <GoogleAuthButton user={user} loading={authLoading} compact={false} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ENGINE 1: OS RUNTIME WORKBENCH */}
      <section aria-labelledby="workbench-heading" className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <ActivityIcon className="w-4 h-4 text-[#C0C0C0]" />
            <h2 id="workbench-heading" className="text-sm font-mono uppercase tracking-wider text-[#F5F5F5] font-bold">
              Engine 1: OS Engineering Workbench
            </h2>
          </div>
          <button
            onClick={() => onNavigate('workbench-overview')}
            className="text-xs font-mono text-[#C0C0C0] hover:text-[#F5F5F5] flex items-center gap-1 transition-colors"
          >
            <span>Open Control Deck</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6-Box Grid of Subsystem Labs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('workbench-assets')}
            className="text-left bg-[#121212] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#C0C0C0] rounded-xl p-5 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] group-hover:scale-105 transition-transform">
                  <DownloadIcon className="w-4 h-4 text-[#C0C0C0]" />
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1C1C1C] text-[#888888] border border-[#2A2A2A]">
                  Zero-Server IDB
                </span>
              </div>
              <h3 className="text-xs font-mono font-bold text-[#F5F5F5]">
                Zero-Server Asset Manager
              </h3>
              <p className="text-[11px] text-[#888888] leading-relaxed">
                Stream remote static asset packages (kernel images, maps, bundles) via chunked fetch directly into IndexedDB Blobs. Client-side export with zero server costs.
              </p>
            </div>
            <div className="pt-3 border-t border-[#1F1F1F] text-[10px] font-mono text-[#C0C0C0] flex items-center justify-between">
              <span>Open Asset Manager</span>
              <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('workbench-network')}
            className="text-left bg-[#121212] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#C0C0C0] rounded-xl p-5 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] group-hover:scale-105 transition-transform">
                  <RadioIcon className="w-4 h-4 text-[#C0C0C0]" />
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1C1C1C] text-[#888888] border border-[#2A2A2A]">
                  Live Stream
                </span>
              </div>
              <h3 className="text-xs font-mono font-bold text-[#F5F5F5]">
                Network &amp; Payload Inspector
              </h3>
              <p className="text-[11px] text-[#888888] leading-relaxed">
                Observe local IndexedDB transactions and outbound Remote Gateway dispatches in real-time. View millisecond latency, payload bytes, and cURL commands.
              </p>
            </div>
            <div className="pt-3 border-t border-[#1F1F1F] text-[10px] font-mono text-[#C0C0C0] flex items-center justify-between">
              <span>Open Inspector</span>
              <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('workbench-plugins')}
            className="text-left bg-[#121212] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#C0C0C0] rounded-xl p-5 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] group-hover:scale-105 transition-transform">
                  <CodeIcon className="w-4 h-4 text-[#C0C0C0]" />
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1C1C1C] text-[#888888] border border-[#2A2A2A]">
                  BaseMicroTool SDK
                </span>
              </div>
              <h3 className="text-xs font-mono font-bold text-[#F5F5F5]">
                Dynamic Module Loader
              </h3>
              <p className="text-[11px] text-[#888888] leading-relaxed">
                Inject and execute external micro-tool JS scripts via URL at runtime. Sandboxed evaluation and hot-registration into navigation without page refreshes.
              </p>
            </div>
            <div className="pt-3 border-t border-[#1F1F1F] text-[10px] font-mono text-[#C0C0C0] flex items-center justify-between">
              <span>Open Module Loader</span>
              <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('workbench-process')}
            className="text-left bg-[#121212] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#C0C0C0] rounded-xl p-5 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] group-hover:scale-105 transition-transform">
                  <CpuIcon className="w-4 h-4 text-[#C0C0C0]" />
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1C1C1C] text-[#888888] border border-[#2A2A2A]">
                  cgroups &amp; lmkd
                </span>
              </div>
              <h3 className="text-xs font-mono font-bold text-[#F5F5F5]">
                Process &amp; LMK Lab
              </h3>
              <p className="text-[11px] text-[#888888] leading-relaxed">
                Trigger Low Memory Killer pressure, inject memory spikes, and observe task eviction by OOM score (-1000 to +1000).
              </p>
            </div>
            <div className="pt-3 border-t border-[#1F1F1F] text-[10px] font-mono text-[#C0C0C0] flex items-center justify-between">
              <span>Launch Lab</span>
              <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('workbench-sandbox')}
            className="text-left bg-[#121212] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#C0C0C0] rounded-xl p-5 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] group-hover:scale-105 transition-transform">
                  <ShieldIcon className="w-4 h-4 text-[#C0C0C0]" />
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1C1C1C] text-[#888888] border border-[#2A2A2A]">
                  UID &amp; SELinux
                </span>
              </div>
              <h3 className="text-xs font-mono font-bold text-[#F5F5F5]">
                Security Sandbox Wall
              </h3>
              <p className="text-[11px] text-[#888888] leading-relaxed">
                Test cross-tenant file theft, raw device node sniffing, and Content URI temporary permission delivery under DAC 0700.
              </p>
            </div>
            <div className="pt-3 border-t border-[#1F1F1F] text-[10px] font-mono text-[#C0C0C0] flex items-center justify-between">
              <span>Launch Lab</span>
              <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('workbench-ipc')}
            className="text-left bg-[#121212] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#C0C0C0] rounded-xl p-5 transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] group-hover:scale-105 transition-transform">
                  <LayersIcon className="w-4 h-4 text-[#C0C0C0]" />
                </div>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#1C1C1C] text-[#888888] border border-[#2A2A2A]">
                  /dev/binder
                </span>
              </div>
              <h3 className="text-xs font-mono font-bold text-[#F5F5F5]">
                Binder IPC Simulator
              </h3>
              <p className="text-[11px] text-[#888888] leading-relaxed">
                Step through 5 stages of an Android IPC call with Parcel marshaling, ioctl syscalls, and thread replies.
              </p>
            </div>
            <div className="pt-3 border-t border-[#1F1F1F] text-[10px] font-mono text-[#C0C0C0] flex items-center justify-between">
              <span>Launch Lab</span>
              <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* ENGINE 2: SYSTEMS ARCHITECTURE ACADEMY */}
      <section aria-labelledby="curriculums-heading" className="space-y-5">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <div className="flex items-center gap-2">
            <LayersIcon className="w-4 h-4 text-[#C0C0C0]" />
            <h2 id="curriculums-heading" className="text-sm font-mono uppercase tracking-wider text-[#F5F5F5] font-bold">
              Engine 2: Systems Architecture Academy
            </h2>
          </div>
          <span className="text-xs text-[#888888] font-mono">Layer 1 Ready</span>
        </div>

        {/* Android Card (Full-Featured Hero Card) */}
        <button
          type="button"
          onClick={() => onNavigate('welcome')}
          className="contain-card interactive-card w-full group text-left bg-[#121212] hover:bg-[#161616] active:bg-[#1a1a1a] border border-[#2A2A2A] hover:border-[#C0C0C0] focus-visible:border-[#C0C0C0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C0C0C0] rounded-xl p-6 sm:p-8 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          aria-label="Open Android curriculum"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              {/* Android Symbol */}
              <div className="w-14 h-14 rounded-xl bg-[#181818] border border-[#2E2E2E] flex items-center justify-center text-[#F5F5F5] group-hover:border-[#C0C0C0] transition-colors">
                <AndroidIcon className="w-8 h-8 text-[#F5F5F5]" />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#F5F5F5] bg-[#1E1E1E] border border-[#2E2E2E] px-3 py-1 rounded">
                  Core Curriculum
                </span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-[#F5F5F5] mb-2">Android Architecture</h3>
            <p className="text-xs font-mono text-[#A0A0A0] mb-4">
              Linux kernel foundation, HAL, Sandbox walls, Content URIs, and Recents menu reality
            </p>
            <p className="text-sm sm:text-base text-[#C0C0C0] leading-relaxed mb-6 max-w-2xl">
              Understand how Android connects applications to hardware through multiple architectural layers. Explores the 5 core lessons with high-fidelity system diagrams and conceptual models.
            </p>
          </div>

          <div className="pt-6 border-t border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 font-mono text-[#A0A0A0]">
              <span className="flex items-center gap-1.5">
                <LayersIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
                Layer 1: OS &amp; Android
              </span>
              <span>·</span>
              <span>
                {completedLessonsCount > 0
                  ? `${completedLessonsCount}/${totalLessonsCount} Completed`
                  : `${totalLessonsCount} Lessons Available`}
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 font-semibold text-[#F5F5F5] group-hover:translate-x-1 transition-transform min-h-[36px]">
              Explore Curriculum <ArrowRightIcon className="w-4 h-4" />
            </span>
          </div>
        </button>
      </section>

      {/* Educational Philosophy */}
      <section className="contain-card interactive-card bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[#C0C0C0] uppercase tracking-wider">
          <CompassIcon className="w-4 h-4 text-[#C0C0C0]" />
          <span>Educational Philosophy</span>
        </div>
        <h3 className="text-lg font-semibold text-[#F5F5F5]">
          Pure Platform Architecture — No OEM Bias
        </h3>
        <p className="text-sm text-[#C0C0C0] leading-relaxed">
          Platform Steady teaches the software engineering of operating systems themselves. Android is explored as an independent platform stack, free from individual manufacturer skins, OEM retail modifications, or device-specific branding.
        </p>
      </section>

    </div>
  );
};
