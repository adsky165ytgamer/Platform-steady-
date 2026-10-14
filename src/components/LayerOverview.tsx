import React from 'react';
import { ViewMode } from '../types';
import { LAYER_1 } from '../data/curriculum';
import { SystemDiagram } from './SystemDiagram';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Layers,
  Compass,
  FileText,
} from 'lucide-react';

interface LayerOverviewProps {
  onNavigate: (view: ViewMode) => void;
  completedLessons: string[];
}

export const LayerOverview: React.FC<LayerOverviewProps> = ({
  onNavigate,
  completedLessons,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-[#A0A0A0]">
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
        <span className="text-[#F5F5F5] font-semibold">Layer 1</span>
      </nav>

      {/* Header Section */}
      <div className="space-y-4 border-b border-[#2A2A2A] pb-8">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#C0C0C0] uppercase tracking-wider bg-[#121212] px-3 py-1 rounded border border-[#2A2A2A]">
          <Layers className="w-3.5 h-3.5 text-[#C0C0C0]" />
          <span>Foundational Layer</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#F5F5F5]">
          {LAYER_1.title}
        </h1>

        <p className="text-base text-[#C0C0C0] leading-relaxed max-w-2xl">
          {LAYER_1.description}
        </p>

        {/* Layer stats */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#A0A0A0] pt-2">
          <span>2 Lessons Available</span>
          <span>·</span>
          <span>
            {completedLessons.length} of {LAYER_1.lessons.length} Completed
          </span>
          <span>·</span>
          <span>Self-Paced Learning</span>
        </div>
      </div>

      {/* Section: What You'll Learn in This Layer (Exact 6 items) */}
      <section aria-labelledby="learning-objectives-heading" className="bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
          <h2 id="learning-objectives-heading" className="text-lg font-bold text-[#F5F5F5] flex items-center gap-2.5">
            <Compass className="w-5 h-5 text-[#C0C0C0]" />
            <span>What You&apos;ll Learn in This Layer</span>
          </h2>
          <span className="text-xs font-mono text-[#888888]">6 Core Topics</span>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 gap-4 list-decimal list-inside text-sm text-[#C0C0C0]">
          {LAYER_1.learningPoints.map((point, index) => (
            <li
              key={index}
              className="bg-[#0A0A0A] p-4 rounded-lg border border-[#222222] leading-relaxed"
            >
              <span className="font-medium text-[#F5F5F5]">{point}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Lessons Selection Cards */}
      <section aria-labelledby="lessons-heading" className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3">
          <h2 id="lessons-heading" className="text-sm font-mono uppercase tracking-wider text-[#C0C0C0]">
            Lessons in Layer 1
          </h2>
          <span className="text-xs text-[#888888] font-mono">Read individually & in sequence</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {LAYER_1.lessons.map((lesson) => {
            const isCompleted = completedLessons.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="bg-[#121212] border border-[#2A2A2A] hover:border-[#C0C0C0] transition-colors rounded-xl p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono text-[#A0A0A0] bg-[#1A1A1A] px-2.5 py-1 rounded border border-[#282828]">
                      Lesson {lesson.number}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#F5F5F5]">
                        <CheckCircle2 className="w-4 h-4 text-[#F5F5F5]" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-[#666666]">
                        <Circle className="w-4 h-4 text-[#444444]" />
                        <span>Not Started</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#F5F5F5] mb-2 group-hover:text-[#F5F5F5]">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-[#A0A0A0] line-clamp-3 mb-6 leading-relaxed">
                    {lesson.content[0]}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#222222]">
                  <button
                    type="button"
                    onClick={() => onNavigate(lesson.id as ViewMode)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold text-[#080808] bg-[#F5F5F5] hover:bg-[#C0C0C0] transition-colors"
                  >
                    <span>Read Lesson {lesson.number}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Educational Diagram Section (Applications - OS - Hardware) */}
      <section aria-labelledby="diagram-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 id="diagram-heading" className="text-sm font-mono uppercase tracking-wider text-[#C0C0C0]">
            System Architecture Diagram
          </h2>
          <span className="text-xs text-[#888888] font-mono">Conceptual Flow</span>
        </div>
        <SystemDiagram interactive={true} />
      </section>

      {/* Bottom Navigation */}
      <div className="pt-8 border-t border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => onNavigate('welcome')}
          className="inline-flex items-center gap-2 text-xs font-mono text-[#C0C0C0] hover:text-[#F5F5F5] py-2 px-3 rounded hover:bg-[#141414] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Welcome Screen</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('lesson-1-1')}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#080808] bg-[#F5F5F5] hover:bg-[#C0C0C0] rounded-lg transition-colors"
        >
          <span>Begin Lesson 1.1</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
