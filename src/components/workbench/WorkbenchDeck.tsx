/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WorkbenchTab } from '../../types';
import { getPlatformCore } from '../../core/platform-core';
import { EngineMode } from '../../core/types';
import { ProcessManagerLab } from './ProcessManagerLab';
import { SecuritySandboxMatrix } from './SecuritySandboxMatrix';
import { BinderIpcSimulator } from './BinderIpcSimulator';
import { InteractiveTerminal } from './InteractiveTerminal';
import { StorageSandboxExplorer } from './StorageSandboxExplorer';
import { AssetManagerTool } from './AssetManagerTool';
import { NetworkInspectorTool } from './NetworkInspectorTool';
import { ModuleLoaderTool } from './ModuleLoaderTool';
import {
  ActivityIcon,
  CpuIcon,
  LayersIcon,
  ShieldIcon,
  TerminalIcon,
  FolderIcon,
  ArrowRightIcon,
  BookOpenIcon,
  DownloadIcon,
  RadioIcon,
  CodeIcon,
} from '../Icons';

interface WorkbenchDeckProps {
  initialTab?: WorkbenchTab;
  onSwitchToAcademy: () => void;
}

export const WorkbenchDeck: React.FC<WorkbenchDeckProps> = ({
  initialTab = 'overview',
  onSwitchToAcademy,
}) => {
  const engine = getPlatformCore();
  const [activeTab, setActiveTab] = useState<WorkbenchTab>(initialTab);
  const [engineMode, setEngineMode] = useState<EngineMode>(engine.getMode());
  const [stats, setStats] = useState(engine.telemetry.getStats());

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const unsubTelemetry = engine.telemetry.subscribe(() => {
      setStats(engine.telemetry.getStats());
    });

    const unsubMode = engine.eventBroker.subscribe<{ mode: EngineMode }>(
      'system.mode_changed',
      (evt) => {
        setEngineMode(evt.payload.mode);
      }
    );

    return () => {
      unsubTelemetry();
      unsubMode();
    };
  }, [engine]);

  const handleToggleEngineMode = async () => {
    const nextMode: EngineMode =
      engineMode === 'local-stack' ? 'remote-gateway' : 'local-stack';
    await engine.setMode(nextMode);
    setEngineMode(nextMode);
  };

  const tabs: { id: WorkbenchTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Control Deck', icon: <ActivityIcon className="w-4 h-4" /> },
    { id: 'assets', label: 'Zero-Server Assets', icon: <DownloadIcon className="w-4 h-4" />, badge: 'Blob IDB' },
    { id: 'network', label: 'Network Inspector', icon: <RadioIcon className="w-4 h-4" />, badge: 'Live Logs' },
    { id: 'plugins', label: 'Dynamic Plugins', icon: <CodeIcon className="w-4 h-4" />, badge: 'Runtime' },
    { id: 'process', label: 'Process & LMK Lab', icon: <CpuIcon className="w-4 h-4" />, badge: 'LMK' },
    { id: 'sandbox', label: 'Security & Sandbox', icon: <ShieldIcon className="w-4 h-4" />, badge: 'DAC/MAC' },
    { id: 'ipc', label: 'Binder IPC Engine', icon: <LayersIcon className="w-4 h-4" />, badge: 'Zero-Copy' },
    { id: 'terminal', label: 'Terminal (/bin/sh)', icon: <TerminalIcon className="w-4 h-4" />, badge: 'Shell' },
    { id: 'storage', label: 'Storage & Inodes', icon: <FolderIcon className="w-4 h-4" />, badge: '0700' },
  ];

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header / Mode Deck */}
      <div className="border border-[#2A2A2A] bg-[#0E0E0E] rounded-xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-[#F5F5F5] rotate-45 inline-block" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#F5F5F5] font-sans">
                Platform Steady // OS Engineering Workbench
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1F1F1F] text-[#C0C0C0] border border-[#333333] uppercase">
                Dual-Engine v3.0
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#888888] mt-1.5 max-w-3xl">
              Universal Engineering Interface operating in dual-engine configuration: In-Browser Local
              Stack (IndexedDB & OPFS zero-server binary distribution) vs External Remote Gateway.
            </p>
          </div>

          {/* Engine Mode Toggle & Academy Switcher */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleToggleEngineMode}
              className={`flex items-center gap-2 px-3.5 py-2 border font-mono text-xs font-semibold rounded-lg transition-colors ${
                engineMode === 'local-stack'
                  ? 'bg-[#181818] border-[#383838] text-[#F5F5F5]'
                  : 'bg-[#222222] border-[#444444] text-amber-300'
              }`}
              title="Click to toggle between In-Browser Local Stack and Remote Gateway"
            >
              <RadioIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
              <span className="text-[#888888]">ENGINE:</span>
              <span className="uppercase">
                {engineMode === 'local-stack' ? 'IN-BROWSER LOCAL STACK' : 'REMOTE GATEWAY'}
              </span>
            </button>

            <button
              onClick={onSwitchToAcademy}
              className="flex items-center gap-2 px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] hover:border-[#555555] text-[#F5F5F5] text-xs font-mono font-semibold rounded-lg transition-colors"
            >
              <BookOpenIcon className="w-3.5 h-3.5 text-[#C0C0C0]" />
              <span>Architecture Academy</span>
            </button>
          </div>
        </div>

        {/* Global System Telemetry Status Bar */}
        <div className="mt-5 pt-4 border-t border-[#1C1C1C] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
          <div className="bg-[#080808] p-2.5 rounded border border-[#222222]">
            <span className="text-[10px] text-[#666666] block uppercase">Active Engine</span>
            <span className="text-[#F5F5F5] font-semibold text-[11px] uppercase">
              {engineMode === 'local-stack' ? 'Local Stack (IDB)' : 'Remote Gateway'}
            </span>
          </div>
          <div className="bg-[#080808] p-2.5 rounded border border-[#222222]">
            <span className="text-[10px] text-[#666666] block uppercase">Live Telemetry</span>
            <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {stats.totalPackets} pkts · {stats.avgLatencyMs}ms
            </span>
          </div>
          <div className="bg-[#080808] p-2.5 rounded border border-[#222222]">
            <span className="text-[10px] text-[#666666] block uppercase">Asset Pipeline</span>
            <span className="text-[#C0C0C0] font-semibold text-[11px]">Chunked Fetch (Blob)</span>
          </div>
          <div className="bg-[#080808] p-2.5 rounded border border-[#222222]">
            <span className="text-[10px] text-[#666666] block uppercase">Kernel & Arch</span>
            <span className="text-[#F5F5F5] font-semibold text-[11px]">6.1.75-android14</span>
          </div>
          <div className="bg-[#080808] p-2.5 rounded border border-[#222222]">
            <span className="text-[10px] text-[#666666] block uppercase">Driver Bus</span>
            <span className="text-[#C0C0C0] font-semibold text-[11px]">/dev/binder (mmap)</span>
          </div>
          <div className="bg-[#080808] p-2.5 rounded border border-[#222222]">
            <span className="text-[10px] text-[#666666] block uppercase">App Sandboxing</span>
            <span className="text-cyan-400 font-semibold text-[11px]">POSIX UID + DAC</span>
          </div>
        </div>
      </div>

      {/* Subsystem Navigation Tab Rack */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#2A2A2A] font-mono text-xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#F5F5F5] text-[#080808] font-bold shadow'
                  : 'bg-[#121212] text-[#A0A0A0] hover:text-[#F5F5F5] hover:bg-[#1A1A1A] border border-[#222222]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] px-1 py-0.2 rounded uppercase ${
                    isActive ? 'bg-[#080808] text-[#F5F5F5]' : 'bg-[#222222] text-[#888888]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Subsystem Content Area */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Launch Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Zero-Server Asset Distribution Card */}
              <div
                onClick={() => setActiveTab('assets')}
                className="bg-[#101010] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#444444] rounded-xl p-5 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] group-hover:scale-105 transition-transform">
                    <DownloadIcon className="w-5 h-5 text-[#C0C0C0]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#888888] bg-[#0A0A0A] px-2 py-0.5 rounded border border-[#222222]">
                    Zero-Server IDB
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-[#F5F5F5] flex items-center justify-between">
                    <span>Zero-Server Asset Manager</span>
                    <ArrowRightIcon className="w-4 h-4 text-[#666666] group-hover:text-[#F5F5F5] group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-[#888888] mt-1.5 leading-relaxed">
                    Download remote static packages (kernel bins, firmware maps, JSON bundles) via
                    chunked fetch streams directly into IndexedDB Blobs. Client-side export with zero
                    cloud egress fees.
                  </p>
                </div>
              </div>

              {/* Live Network & Telemetry Inspector Card */}
              <div
                onClick={() => setActiveTab('network')}
                className="bg-[#101010] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#444444] rounded-xl p-5 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] group-hover:scale-105 transition-transform">
                    <RadioIcon className="w-5 h-5 text-[#C0C0C0]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#888888] bg-[#0A0A0A] px-2 py-0.5 rounded border border-[#222222]">
                    Live Telemetry
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-[#F5F5F5] flex items-center justify-between">
                    <span>Network & Payload Inspector</span>
                    <ArrowRightIcon className="w-4 h-4 text-[#666666] group-hover:text-[#F5F5F5] group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-[#888888] mt-1.5 leading-relaxed">
                    Inspect local IndexedDB operations and outbound Remote Gateway HTTP requests in
                    real-time with millisecond latency, payload byte sizes, and cURL reproduction.
                  </p>
                </div>
              </div>

              {/* Dynamic Plugin Loader Card */}
              <div
                onClick={() => setActiveTab('plugins')}
                className="bg-[#101010] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#444444] rounded-xl p-5 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] group-hover:scale-105 transition-transform">
                    <CodeIcon className="w-5 h-5 text-[#C0C0C0]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#888888] bg-[#0A0A0A] px-2 py-0.5 rounded border border-[#222222]">
                    BaseMicroTool SDK
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-[#F5F5F5] flex items-center justify-between">
                    <span>Dynamic Module Loader</span>
                    <ArrowRightIcon className="w-4 h-4 text-[#666666] group-hover:text-[#F5F5F5] group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-[#888888] mt-1.5 leading-relaxed">
                    Dynamically inject and execute micro-tool JavaScript modules at runtime. Validates
                    lifecycle hooks and hot-registers tools into navigation without page refreshes.
                  </p>
                </div>
              </div>

              {/* Process Manager Card */}
              <div
                onClick={() => setActiveTab('process')}
                className="bg-[#101010] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#444444] rounded-xl p-5 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] group-hover:scale-105 transition-transform">
                    <CpuIcon className="w-5 h-5 text-[#C0C0C0]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#888888] bg-[#0A0A0A] px-2 py-0.5 rounded border border-[#222222]">
                    cgroups & lmkd
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-[#F5F5F5] flex items-center justify-between">
                    <span>Process & Memory Manager</span>
                    <ArrowRightIcon className="w-4 h-4 text-[#666666] group-hover:text-[#F5F5F5] group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-[#888888] mt-1.5 leading-relaxed">
                    Watch the Linux Low Memory Killer monitor pressure, assign OOM scores (-1000 to +1000), and dynamically kill cached apps without freezing foreground tasks.
                  </p>
                </div>
              </div>

              {/* Sandbox Matrix Card */}
              <div
                onClick={() => setActiveTab('sandbox')}
                className="bg-[#101010] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#444444] rounded-xl p-5 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] group-hover:scale-105 transition-transform">
                    <ShieldIcon className="w-5 h-5 text-[#C0C0C0]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#888888] bg-[#0A0A0A] px-2 py-0.5 rounded border border-[#222222]">
                    UID + SELinux
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-[#F5F5F5] flex items-center justify-between">
                    <span>Security & Sandbox Wall</span>
                    <ArrowRightIcon className="w-4 h-4 text-[#666666] group-hover:text-[#F5F5F5] group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-[#888888] mt-1.5 leading-relaxed">
                    Simulate cross-app database theft and raw device node sniffing. Test how the Linux kernel halts unauthorized access with DAC 0700 file modes.
                  </p>
                </div>
              </div>

              {/* Binder IPC Card */}
              <div
                onClick={() => setActiveTab('ipc')}
                className="bg-[#101010] hover:bg-[#161616] border border-[#2A2A2A] hover:border-[#444444] rounded-xl p-5 cursor-pointer transition-all space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2 bg-[#1A1A1A] rounded-lg text-[#F5F5F5] group-hover:scale-105 transition-transform">
                    <LayersIcon className="w-5 h-5 text-[#C0C0C0]" />
                  </div>
                  <span className="text-[10px] font-mono text-[#888888] bg-[#0A0A0A] px-2 py-0.5 rounded border border-[#222222]">
                    /dev/binder
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-[#F5F5F5] flex items-center justify-between">
                    <span>Binder IPC Transaction Engine</span>
                    <ArrowRightIcon className="w-4 h-4 text-[#666666] group-hover:text-[#F5F5F5] group-hover:translate-x-1 transition-all" />
                  </h3>
                  <p className="text-xs text-[#888888] mt-1.5 leading-relaxed">
                    Step through the 5 stages of an Android IPC call: Userland Parcel marshaling, ioctl syscall, kernel zero-copy translation, and worker thread execution.
                  </p>
                </div>
              </div>
            </div>

            {/* Live Process & Telemetry Preview */}
            <ProcessManagerLab />
          </div>
        )}

        {activeTab === 'assets' && <AssetManagerTool />}
        {activeTab === 'network' && <NetworkInspectorTool />}
        {activeTab === 'plugins' && <ModuleLoaderTool />}
        {activeTab === 'process' && <ProcessManagerLab />}
        {activeTab === 'sandbox' && <SecuritySandboxMatrix />}
        {activeTab === 'ipc' && <BinderIpcSimulator />}
        {activeTab === 'terminal' && <InteractiveTerminal />}
        {activeTab === 'storage' && <StorageSandboxExplorer />}
      </div>
    </div>
  );
};
