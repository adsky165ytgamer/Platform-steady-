import React, { useState } from 'react';
import { ViewMode, Lesson } from '../types';
import { SystemDiagram } from './SystemDiagram';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Layers,
  BookOpen,
  Info,
  Compass,
} from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
  onNavigate: (view: ViewMode) => void;
  isCompleted: boolean;
  onToggleComplete: (lessonId: string) => void;
  prevLessonId?: ViewMode;
  nextLessonId?: ViewMode;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  onNavigate,
  isCompleted,
  onToggleComplete,
  prevLessonId,
  nextLessonId,
}) => {
  const [showDiagram, setShowDiagram] = useState(false);

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-10">
      
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#A0A0A0] flex-wrap">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="hover:text-[#F5F5F5] transition-colors"
        >
          Platform Steady
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => onNavigate('welcome')}
          className="hover:text-[#F5F5F5] transition-colors"
        >
          Android
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => onNavigate('layer-1')}
          className="hover:text-[#F5F5F5] transition-colors"
        >
          Layer 1
        </button>
        <span>/</span>
        <span className="text-[#F5F5F5] font-semibold truncate">
          Lesson {lesson.number}
        </span>
      </nav>

      {/* Lesson Header */}
      <header className="space-y-4 border-b border-[#2A2A2A] pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#C0C0C0] bg-[#121212] px-3 py-1 rounded border border-[#2A2A2A]">
            <BookOpen className="w-3.5 h-3.5 text-[#C0C0C0]" />
            <span>Layer 1 · Lesson {lesson.number}</span>
          </div>

          {/* Mark Complete Real Toggle */}
          <button
            type="button"
            onClick={() => onToggleComplete(lesson.id)}
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono transition-colors border cursor-pointer ${
              isCompleted
                ? 'bg-[#181818] text-[#F5F5F5] border-[#C0C0C0]'
                : 'bg-[#0E0E0E] text-[#A0A0A0] border-[#2A2A2A] hover:border-[#444444]'
            }`}
            aria-pressed={isCompleted}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#F5F5F5]" />
                <span>Marked Complete</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4 text-[#666666]" />
                <span>Mark as Complete</span>
              </>
            )}
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F5] text-balance">
          {lesson.title}
        </h1>

        <p className="text-sm sm:text-base text-[#A0A0A0]">
          {lesson.subtitle}
        </p>
      </header>

      {/* Core Educational Content */}
      <section className="space-y-6 text-base sm:text-lg leading-relaxed text-[#F5F5F5]">
        {lesson.content.map((paragraph, idx) => (
          <p key={idx} className="text-[#C0C0C0] leading-relaxed">
            {paragraph}
          </p>
        ))}
      </section>

      {/* Key Takeaway Highlight Box */}
      <aside aria-label="Key Takeaway" className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 space-y-2">
        <div className="text-xs font-mono uppercase tracking-wider text-[#C0C0C0] flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-[#C0C0C0]" />
          <span>Core Principle</span>
        </div>
        <p className="text-sm sm:text-base font-medium text-[#F5F5F5] leading-relaxed">
          {lesson.keyTakeaway}
        </p>
      </aside>

      {/* Focused Conceptual Breakdown */}
      <section aria-labelledby="focus-concepts-heading" className="space-y-4">
        <h2 id="focus-concepts-heading" className="text-sm font-mono uppercase tracking-wider text-[#C0C0C0]">
          In-Depth Breakdown
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {lesson.focusConcepts.map((concept, index) => (
            <div
              key={index}
              className="bg-[#0E0E0E] border border-[#242424] rounded-lg p-5 space-y-1.5"
            >
              <div className="text-sm font-semibold text-[#F5F5F5]">
                {concept.term}
              </div>
              <p className="text-xs sm:text-sm text-[#A0A0A0] leading-relaxed">
                {concept.explanation}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Diagram Toggle Feature */}
      <section className="border border-[#2A2A2A] bg-[#0E0E0E] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="text-xs font-mono text-[#C0C0C0] uppercase tracking-wider">
              Visual Reference
            </div>
            <h3 className="text-sm font-semibold text-[#F5F5F5]">
              System Architecture Diagram
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowDiagram(!showDiagram)}
            className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono bg-[#181818] hover:bg-[#202020] text-[#F5F5F5] border border-[#2A2A2A] transition-colors self-start sm:self-auto"
          >
            <Layers className="w-3.5 h-3.5 text-[#C0C0C0]" />
            <span>{showDiagram ? 'Hide Architecture Diagram' : 'View Architecture Diagram'}</span>
          </button>
        </div>

        {showDiagram && (
          <div className="pt-4 border-t border-[#222222]">
            <SystemDiagram interactive={true} />
          </div>
        )}
      </section>

      {/* Footer Navigation Between Lessons */}
      <footer className="pt-8 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          {prevLessonId ? (
            <button
              type="button"
              onClick={() => onNavigate(prevLessonId)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-[#C0C0C0] hover:text-[#F5F5F5] bg-[#121212] hover:bg-[#181818] border border-[#2A2A2A] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous: Lesson 1.1</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('layer-1')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium text-[#C0C0C0] hover:text-[#F5F5F5] bg-[#121212] hover:bg-[#181818] border border-[#2A2A2A] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Layer 1</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {nextLessonId ? (
            <button
              type="button"
              onClick={() => onNavigate(nextLessonId)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-[#080808] bg-[#F5F5F5] hover:bg-[#C0C0C0] transition-colors"
            >
              <span>Next: Lesson 1.2</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onNavigate('layer-1')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-[#080808] bg-[#F5F5F5] hover:bg-[#C0C0C0] transition-colors"
            >
              <span>Return to Layer 1 Overview</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </footer>

    </article>
  );
};
