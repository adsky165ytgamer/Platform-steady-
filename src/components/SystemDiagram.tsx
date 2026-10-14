import React, { useState } from 'react';
import { Layers, Smartphone, Cpu, ArrowDown, Info, Check } from 'lucide-react';

interface SystemDiagramProps {
  interactive?: boolean;
}

export const SystemDiagram: React.FC<SystemDiagramProps> = ({ interactive = true }) => {
  const [activeTier, setActiveTier] = useState<'apps' | 'os' | 'hardware'>('os');

  const tiers = [
    {
      id: 'apps' as const,
      name: 'Applications',
      role: 'Apps that users interact with.',
      details: 'User-facing software such as messaging tools, web browsers, media players, and utilities. They request services from the OS rather than touching hardware directly.',
      components: ['Web Browsers', 'Messaging Apps', 'System Settings App', 'Media Players'],
      icon: Smartphone,
    },
    {
      id: 'os' as const,
      name: 'Operating System',
      role: 'Manages resources and provides software services.',
      details: 'The central coordinator (such as Android). It manages processor scheduling, memory allocation, security sandboxes, and hardware driver interfaces, providing uniform APIs to applications.',
      components: ['Process Scheduler', 'Memory Allocator', 'Security Sandbox', 'Hardware Drivers'],
      icon: Layers,
    },
    {
      id: 'hardware' as const,
      name: 'Hardware',
      role: 'Processor, memory, display, camera, and other physical components.',
      details: 'Physical electronic circuitry, silicon chips, and sensors that execute electrical signals. Only the operating system kernel and low-level drivers communicate with hardware registers directly.',
      components: ['Application Processor (CPU/GPU)', 'RAM & Storage', 'Display & Touch Digitizer', 'Camera Sensors'],
      icon: Cpu,
    },
  ];

  return (
    <div className="w-full bg-[#121212] border border-[#2A2A2A] rounded-xl p-6 sm:p-8 space-y-6">
      
      {/* Explicit Simplified Conceptual Model Banner */}
      <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 flex items-start gap-3">
        <Info className="w-4 h-4 text-[#C0C0C0] shrink-0 mt-0.5" />
        <div className="text-xs space-y-0.5">
          <span className="font-semibold text-[#F5F5F5] block">
            Simplified Conceptual Explanation
          </span>
          <p className="text-[#A0A0A0] leading-relaxed">
            This three-tier model is designed to help beginners build a foundational mental model, not represent the complete Android internal architecture.
          </p>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-[#2A2A2A] gap-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#C0C0C0] mb-1">
            Foundational Mental Model
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-[#F5F5F5]">
            Applications, Operating System & Hardware
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#C0C0C0] bg-[#080808] px-3 py-1.5 rounded-md border border-[#2A2A2A] shrink-0 self-start sm:self-auto">
          <span>Select any tier to inspect</span>
        </div>
      </div>

      {/* Main Diagram Area */}
      <div className="flex flex-col items-center max-w-2xl mx-auto w-full pt-2">
        
        {/* Tier 1: Applications */}
        <button
          type="button"
          onClick={() => interactive && setActiveTier('apps')}
          className={`w-full text-left transition-all duration-200 rounded-lg p-5 border text-[#F5F5F5] ${
            activeTier === 'apps'
              ? 'bg-[#181818] border-[#C0C0C0] shadow-sm ring-1 ring-[#C0C0C0]/20'
              : 'bg-[#0E0E0E] border-[#2A2A2A] hover:border-[#3E3E3E]'
          }`}
          aria-pressed={activeTier === 'apps'}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${activeTier === 'apps' ? 'bg-[#F5F5F5] text-[#080808]' : 'bg-[#1C1C1C] text-[#C0C0C0]'}`}>
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#C0C0C0]">Level 1</span>
                  <span className="text-sm font-semibold tracking-wide text-[#F5F5F5]">Applications</span>
                </div>
                <p className="text-sm text-[#C0C0C0] mt-0.5">
                  Apps that users interact with.
                </p>
              </div>
            </div>
            {activeTier === 'apps' && (
              <span className="text-xs font-mono text-[#F5F5F5] bg-[#2A2A2A] px-2 py-0.5 rounded">Active</span>
            )}
          </div>
        </button>

        {/* Transition Connector 1 */}
        <div className="flex flex-col items-center py-3 my-0.5 text-center text-xs font-mono text-[#C0C0C0] tracking-tight">
          <div className="h-3 w-px bg-[#2A2A2A]" />
          <div className="flex items-center gap-2 my-1 px-3 py-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-[11px]">
            <ArrowDown className="w-3 h-3 text-[#C0C0C0]" />
            <span>Communication and services</span>
            <ArrowDown className="w-3 h-3 text-[#C0C0C0]" />
          </div>
          <div className="h-3 w-px bg-[#2A2A2A]" />
        </div>

        {/* Tier 2: Operating System */}
        <button
          type="button"
          onClick={() => interactive && setActiveTier('os')}
          className={`w-full text-left transition-all duration-200 rounded-lg p-5 border text-[#F5F5F5] ${
            activeTier === 'os'
              ? 'bg-[#181818] border-[#C0C0C0] shadow-sm ring-1 ring-[#C0C0C0]/20'
              : 'bg-[#0E0E0E] border-[#2A2A2A] hover:border-[#3E3E3E]'
          }`}
          aria-pressed={activeTier === 'os'}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${activeTier === 'os' ? 'bg-[#F5F5F5] text-[#080808]' : 'bg-[#1C1C1C] text-[#C0C0C0]'}`}>
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#C0C0C0]">Level 2</span>
                  <span className="text-sm font-semibold tracking-wide text-[#F5F5F5]">Operating System</span>
                </div>
                <p className="text-sm text-[#C0C0C0] mt-0.5">
                  Manages resources and provides software services.
                </p>
              </div>
            </div>
            {activeTier === 'os' && (
              <span className="text-xs font-mono text-[#F5F5F5] bg-[#2A2A2A] px-2 py-0.5 rounded">Active</span>
            )}
          </div>
        </button>

        {/* Transition Connector 2 */}
        <div className="flex flex-col items-center py-3 my-0.5 text-center text-xs font-mono text-[#C0C0C0] tracking-tight">
          <div className="h-3 w-px bg-[#2A2A2A]" />
          <div className="flex items-center gap-2 my-1 px-3 py-1 bg-[#0A0A0A] border border-[#2A2A2A] rounded text-[11px]">
            <ArrowDown className="w-3 h-3 text-[#C0C0C0]" />
            <span>Hardware access and coordination</span>
            <ArrowDown className="w-3 h-3 text-[#C0C0C0]" />
          </div>
          <div className="h-3 w-px bg-[#2A2A2A]" />
        </div>

        {/* Tier 3: Hardware */}
        <button
          type="button"
          onClick={() => interactive && setActiveTier('hardware')}
          className={`w-full text-left transition-all duration-200 rounded-lg p-5 border text-[#F5F5F5] ${
            activeTier === 'hardware'
              ? 'bg-[#181818] border-[#C0C0C0] shadow-sm ring-1 ring-[#C0C0C0]/20'
              : 'bg-[#0E0E0E] border-[#2A2A2A] hover:border-[#3E3E3E]'
          }`}
          aria-pressed={activeTier === 'hardware'}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md ${activeTier === 'hardware' ? 'bg-[#F5F5F5] text-[#080808]' : 'bg-[#1C1C1C] text-[#C0C0C0]'}`}>
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-[#C0C0C0]">Level 3</span>
                  <span className="text-sm font-semibold tracking-wide text-[#F5F5F5]">Hardware</span>
                </div>
                <p className="text-sm text-[#C0C0C0] mt-0.5">
                  Processor, memory, display, camera, and other physical components.
                </p>
              </div>
            </div>
            {activeTier === 'hardware' && (
              <span className="text-xs font-mono text-[#F5F5F5] bg-[#2A2A2A] px-2 py-0.5 rounded">Active</span>
            )}
          </div>
        </button>

      </div>

      {/* Selected Tier Detail Inspection Box */}
      {interactive && (
        <div className="pt-4 border-t border-[#2A2A2A] max-w-2xl mx-auto">
          {tiers
            .filter((t) => t.id === activeTier)
            .map((t) => (
              <div key={t.id} className="bg-[#0A0A0A] p-4 sm:p-5 rounded-lg border border-[#2A2A2A]">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-[#F5F5F5] flex items-center gap-2">
                    <span>{t.name} Overview</span>
                  </div>
                  <span className="text-xs font-mono text-[#C0C0C0]">Tier Inspection</span>
                </div>
                <p className="text-sm text-[#C0C0C0] leading-relaxed mb-4">
                  {t.details}
                </p>
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[#C0C0C0] mb-2">
                    Key Elements in This Tier:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {t.components.map((c) => (
                      <div key={c} className="flex items-center gap-2 text-xs text-[#F5F5F5] bg-[#141414] px-3 py-2 rounded border border-[#242424]">
                        <Check className="w-3.5 h-3.5 text-[#C0C0C0] shrink-0" />
                        <span>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Bottom Note */}
      <div className="pt-4 border-t border-[#2A2A2A] flex items-start gap-2 text-xs text-[#A0A0A0] max-w-2xl mx-auto">
        <Info className="w-4 h-4 text-[#C0C0C0] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#F5F5F5]">Note:</strong> This is a simplified conceptual illustration, not the complete Android architecture.
        </p>
      </div>
    </div>
  );
};
