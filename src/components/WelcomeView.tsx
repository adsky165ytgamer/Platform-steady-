import React from 'react';
import { ANDROID_WELCOME } from '../data/curriculum';
import { ArrowRight, ArrowLeft, Smartphone, Compass } from 'lucide-react';

interface WelcomeViewProps {
  onStart: () => void;
  onBack: () => void;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-10">
      
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#C0C0C0] hover:text-[#F5F5F5] transition-colors py-1 group"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Platforms</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-[#121212] border border-[#2A2A2A] rounded-2xl p-6 sm:p-10 space-y-8 shadow-xl">
        
        {/* Badge & Graphic */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-[#1A1A1A] border border-[#333333] flex items-center justify-center text-[#F5F5F5] shrink-0">
            <Smartphone className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[#C0C0C0]">
              Android Learning Journey
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#F5F5F5] tracking-tight mt-0.5">
              {ANDROID_WELCOME.title}
            </h1>
          </div>
        </div>

        {/* Conversational Text */}
        <div className="space-y-5 text-base sm:text-lg text-[#F5F5F5] leading-relaxed">
          <p className="font-semibold text-lg sm:text-xl text-[#F5F5F5]">
            {ANDROID_WELCOME.greeting}
          </p>

          {ANDROID_WELCOME.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-[#C0C0C0] leading-relaxed">
              {paragraph}
            </p>
          ))}

          <p className="font-medium text-[#F5F5F5] pt-2 text-lg">
            {ANDROID_WELCOME.callToActionQuestion}
          </p>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="text-xs font-mono text-[#888888]">
            Next Up: Layer 1 — OS & Android Foundations
          </div>

          <button
            type="button"
            onClick={onStart}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-[#080808] bg-[#F5F5F5] hover:bg-[#C0C0C0] active:bg-[#B0B0B0] transition-colors rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F5F5F5] focus-visible:ring-offset-[#121212] group cursor-pointer"
          >
            <span>{ANDROID_WELCOME.buttonText}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

      {/* Friendly reassurance note */}
      <div className="bg-[#0A0A0A] border border-[#202020] rounded-xl p-5 flex items-start gap-3 text-xs text-[#A0A0A0]">
        <Compass className="w-4 h-4 text-[#C0C0C0] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Platform Steady explores Android as a unified platform. You don't need any prior coding background or a specific phone model—we build concepts step by step from fundamental principles.
        </p>
      </div>

    </div>
  );
};
