import React, { useEffect, useState } from 'react';
import { ArrowRightIcon } from './Icons';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'init' | 'reveal-title' | 'reveal-slogan' | 'ready'>('init');

  useEffect(() => {
    // Stage 1: Initializing
    const timer1 = setTimeout(() => setPhase('reveal-title'), 300);
    // Stage 2: Slogan reveal
    const timer2 = setTimeout(() => setPhase('reveal-slogan'), 1200);
    // Stage 3: Ready state
    const timer3 = setTimeout(() => setPhase('ready'), 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#080808] text-[#F5F5F5] flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none">
      {/* Top Technical Metadata */}
      <div className="flex items-center justify-between text-xs font-mono text-[#666666] border-b border-[#1A1A1A] pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#C0C0C0] animate-pulse" />
          <span className="text-[#A0A0A0]">PLATFORM_STEADY // CORE_SYS_v1.0</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <span>ARCH: KMP_UNIFIED</span>
          <span>·</span>
          <span>TARGET: ANDROID_WEB</span>
        </div>
        <button
          type="button"
          onClick={onComplete}
          className="text-xs font-mono text-[#888888] hover:text-[#F5F5F5] transition-colors uppercase tracking-wider px-2 py-1 border border-transparent hover:border-[#2A2A2A] rounded"
        >
          Skip intro [ESC]
        </button>
      </div>

      {/* Main Animated Centerpiece */}
      <div className="max-w-3xl mx-auto w-full my-auto text-center space-y-8">
        {/* Geometric Diamond Emblem */}
        <div className="relative inline-flex items-center justify-center mb-2">
          {/* Outer Rotating Slate Reticle */}
          <div
            className={`w-20 h-20 border border-[#2A2A2A] rotate-45 transition-all duration-1000 ease-out ${
              phase !== 'init' ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          />
          {/* Inner Solid Diamond Core */}
          <div
            className={`absolute w-7 h-7 bg-[#F5F5F5] rotate-45 shadow-[0_0_30px_rgba(245,245,245,0.25)] transition-all duration-700 delay-200 ease-out ${
              phase !== 'init' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
          />
          {/* Brushed Accent Dots */}
          <div className="absolute w-1.5 h-1.5 bg-[#080808] rotate-45 z-10" />
        </div>

        {/* Title Reveal */}
        <div className="space-y-3">
          <div className="overflow-hidden">
            <h1
              className={`text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F5F5F5] transition-all duration-1000 ease-out ${
                phase !== 'init'
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-12 opacity-0'
              }`}
            >
              Platform Steady
            </h1>
          </div>

          {/* Slogan Reveal */}
          <div className="overflow-hidden">
            <p
              className={`text-base sm:text-xl font-medium text-[#C0C0C0] tracking-wide max-w-xl mx-auto transition-all duration-1000 delay-150 ease-out ${
                phase === 'reveal-slogan' || phase === 'ready'
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              Master Systems Architecture from First Principles
            </p>
          </div>
        </div>

        {/* Technical Sub-spec & Action */}
        <div
          className={`space-y-6 pt-4 transition-all duration-700 ease-out ${
            phase === 'ready' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#121212] border border-[#2A2A2A] text-xs font-mono text-[#888888]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>OPERATING SYSTEMS CURRICULUM READY</span>
          </div>

          <div>
            <button
              type="button"
              onClick={onComplete}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#F5F5F5] text-[#080808] hover:bg-[#C0C0C0] font-semibold text-sm transition-all duration-200 active:scale-95 shadow-lg group cursor-pointer"
            >
              <span>Initialize Workspace</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Technical Status Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#555555] border-t border-[#1A1A1A] pt-4 gap-2">
        <div className="flex items-center gap-3">
          <span>ZERO_OEM_BIAS: TRUE</span>
          <span>·</span>
          <span>LINUX_KERNEL_LAYER: ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#888888]">STATUS:</span>
          <span className="text-[#C0C0C0]">
            {phase === 'ready' ? 'SYNCHRONIZED_READY' : 'BOOTSTRAPPING_SUBSYSTEMS...'}
          </span>
        </div>
      </div>
    </div>
  );
};
