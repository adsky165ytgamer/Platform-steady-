import React from 'react';
import { ArrowRight, Compass, Layers, BookOpen } from 'lucide-react';

interface HomeViewProps {
  onSelectPlatform: (platformId: string) => void;
  completedLessonsCount: number;
  totalLessonsCount: number;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectPlatform,
  completedLessonsCount,
  totalLessonsCount,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      
      {/* Hero Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#C0C0C0] uppercase tracking-widest border border-[#2A2A2A] bg-[#121212] px-3 py-1 rounded">
          <span>Systems Architecture Education</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F5F5F5] text-balance">
          Platform Steady
        </h1>
        <p className="text-base sm:text-lg text-[#C0C0C0] max-w-2xl leading-relaxed">
          Master the structure, mechanics, and system layers of modern computing platforms.
          Starting from fundamental first principles and progressing deep into system internals.
        </p>
      </div>

      {/* Featured Curriculum Area */}
      <section aria-labelledby="curriculums-heading" className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <h2 id="curriculums-heading" className="text-sm font-mono uppercase tracking-wider text-[#C0C0C0]">
            Available Curriculum
          </h2>
          <span className="text-xs text-[#888888] font-mono">Layer 1 Ready</span>
        </div>

        {/* Android Card (Full-Featured Hero Card) */}
        <button
          type="button"
          onClick={() => onSelectPlatform('android')}
          className="w-full group text-left bg-[#121212] hover:bg-[#161616] active:bg-[#1a1a1a] border border-[#2A2A2A] hover:border-[#C0C0C0] focus-visible:border-[#C0C0C0] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C0C0C0] rounded-xl p-6 sm:p-8 transition-all duration-200 cursor-pointer flex flex-col justify-between"
          aria-label="Open Android curriculum"
        >
          <div>
            <div className="flex items-center justify-between mb-6">
              {/* Android Symbol */}
              <div className="w-14 h-14 rounded-xl bg-[#181818] border border-[#2E2E2E] flex items-center justify-center text-[#F5F5F5] group-hover:border-[#C0C0C0] transition-colors">
                <svg
                  className="w-8 h-8 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h4v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v6c0 .83.67 1.5 1.5 1.5S5 16.33 5 15.5v-6C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-6c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.68 3.23 12.87 3 12 3s-1.68.23-2.64.63L7.88 2.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3C6.73 5.17 5.5 7.15 5.5 9.5h13c0-2.35-1.23-4.33-2.97-5.34zM9 7.5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75zm6 0c-.41 0-.75-.34-.75-.75s.34-.75.75-.75.75.34.75.75-.34.75-.75.75z" />
                </svg>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#F5F5F5] bg-[#1E1E1E] border border-[#2E2E2E] px-3 py-1 rounded">
                  Active Curriculum
                </span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-[#F5F5F5] mb-2">Android</h3>
            <p className="text-xs font-mono text-[#A0A0A0] mb-4">
              Linux-based open-source platform stack
            </p>
            <p className="text-sm sm:text-base text-[#C0C0C0] leading-relaxed mb-6 max-w-2xl">
              Learn how Android connects applications to hardware through multiple architectural layers. Starts with fundamental operating system concepts and the Linux kernel foundation.
            </p>
          </div>

          <div className="pt-6 border-t border-[#222222] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3 font-mono text-[#A0A0A0]">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#C0C0C0]" />
                Layer 1: OS & Android
              </span>
              <span>·</span>
              <span>
                {completedLessonsCount > 0
                  ? `${completedLessonsCount}/${totalLessonsCount} Completed`
                  : `${totalLessonsCount} Lessons Available`}
              </span>
            </div>

            <span className="inline-flex items-center gap-1.5 font-semibold text-[#F5F5F5] group-hover:translate-x-1 transition-transform">
              Explore Curriculum <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </button>
      </section>

      {/* Educational Philosophy */}
      <section className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono text-[#C0C0C0] uppercase tracking-wider">
          <Compass className="w-4 h-4 text-[#C0C0C0]" />
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
