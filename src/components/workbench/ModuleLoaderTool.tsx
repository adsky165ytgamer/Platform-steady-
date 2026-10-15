/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { getPlatformCore } from '../../core/platform-core';
import { BaseMicroTool, PluginManifest } from '../../core/types';
import { TactileButton } from '../TactileButton';
import {
  CodeIcon,
  RefreshIcon,
  TrashIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  LayersIcon,
} from '../Icons';

const PRESET_PLUGINS: {
  id: string;
  name: string;
  version: string;
  category: 'runtime' | 'security' | 'storage' | 'network' | 'plugin';
  url: string;
  description: string;
  author: string;
}[] = [
  {
    id: 'plugin-ipc-fuzzer',
    name: 'Binder IPC Transaction Fuzzer',
    version: '1.2.0',
    category: 'security',
    url: 'https://registry.platformsteady.internal/plugins/ipc-fuzzer.js',
    description:
      'Injects mutated parcel payloads into simulated Android binder transactions to stress boundary condition guards.',
    author: 'Kernel Security Working Group',
  },
  {
    id: 'plugin-heap-visualizer',
    name: 'Zygote Heap Fragmentation Probe',
    version: '2.0.1',
    category: 'runtime',
    url: 'https://registry.platformsteady.internal/plugins/heap-visualizer.js',
    description:
      'Inspects Android ART / Dalvik virtual memory arena slabs and page-dirtying ratios during process forking.',
    author: 'ART Runtime Team',
  },
  {
    id: 'plugin-keystore-probe',
    name: 'Hardware Keystore Attestation Probe',
    version: '1.0.4',
    category: 'security',
    url: 'https://registry.platformsteady.internal/plugins/keystore-probe.js',
    description:
      'Validates TEE (Trusted Execution Environment) key minting and root-of-trust hardware certificate hierarchies.',
    author: 'Android Platform Security',
  },
];

export const ModuleLoaderTool: React.FC = () => {
  const engine = getPlatformCore();
  const [tools, setTools] = useState<BaseMicroTool[]>([]);
  const [manifests, setManifests] = useState<PluginManifest[]>([]);
  const [scriptUrl, setScriptUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'custom' | 'manifests'>('catalog');

  const refreshList = useCallback(() => {
    setTools(engine.moduleLoader.getTools());
    setManifests(engine.moduleLoader.getManifests());
  }, [engine]);

  useEffect(() => {
    refreshList();

    const unsub = engine.eventBroker.subscribe('plugin.*', () => {
      refreshList();
    });

    return () => {
      unsub();
    };
  }, [engine, refreshList]);

  const handleLoadPlugin = async (url: string, presetMeta?: Partial<PluginManifest>) => {
    setIsLoading(true);
    setErrorMessage(null);
    setStatusMessage(`DYNAMIC_EVAL_SANDBOX: FETCHING ${url}...`);

    try {
      const tool = await engine.moduleLoader.loadFromUrl(url, presetMeta);
      setStatusMessage(`SUCCESS: REGISTERED "${tool.name}" (${tool.version}) INTO RUNTIME.`);
      refreshList();
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err) {
      setErrorMessage((err as Error).message);
      setStatusMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnmount = async (toolId: string) => {
    const ok = await engine.moduleLoader.unmountTool(toolId);
    if (ok) {
      setStatusMessage(`UNMOUNTED_PLUGIN: [${toolId}] DISPOSED.`);
      refreshList();
      setTimeout(() => setStatusMessage(null), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="border border-[#2A2A2A] bg-[#121212] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1">
              <span>DYNAMIC_PLUGIN_LOADER</span>
              <span aria-hidden="true">/</span>
              <span>BASE_MICROTOOL_SANDBOX</span>
            </div>
            <h2 className="text-xl font-bold font-mono text-[#F5F5F5] uppercase tracking-tight">
              Dynamic Module Loader & Sandbox
            </h2>
            <p className="text-sm text-[#A0A0A0] mt-1 max-w-2xl font-sans">
              Dynamic runtime script injection engine. Evaluates micro-tool JavaScript modules conforming
              to the <code className="text-[#F5F5F5] font-mono">BaseMicroTool</code> lifecycle,
              registering them into the platform runtime and navigation without a page reload.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono border-t md:border-t-0 md:border-l border-[#2A2A2A] pt-3 md:pt-0 md:pl-5">
            <div>
              <div className="text-[#707070] uppercase">Mounted Tools</div>
              <div className="text-base font-bold text-[#F5F5F5]">{tools.length} active</div>
            </div>
            <div>
              <div className="text-[#707070] uppercase">Manifests</div>
              <div className="text-base font-bold text-[#F5F5F5]">{manifests.length} registered</div>
            </div>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="border border-[#2A2A2A] bg-[#161616] p-3 font-mono text-xs text-[#F5F5F5] flex items-center gap-2 animate-fade-in">
          <CheckCircleIcon className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="border border-red-900/50 bg-red-950/20 p-3 font-mono text-xs text-red-400 flex items-center gap-2">
          <AlertTriangleIcon className="w-4 h-4 shrink-0" />
          <span>SANDBOX_INJECTION_FAILURE: {errorMessage}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#121212] border border-[#2A2A2A] w-fit">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3 py-1.5 text-xs font-mono transition-colors ${
            activeTab === 'catalog'
              ? 'bg-[#242424] text-[#F5F5F5] font-bold border border-[#3A3A3A]'
              : 'text-[#808080] hover:text-[#C0C0C0]'
          }`}
        >
          VERIFIED_EXTENSIONS_CATALOG
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`px-3 py-1.5 text-xs font-mono transition-colors ${
            activeTab === 'custom'
              ? 'bg-[#242424] text-[#F5F5F5] font-bold border border-[#3A3A3A]'
              : 'text-[#808080] hover:text-[#C0C0C0]'
          }`}
        >
          INJECT_CUSTOM_SCRIPT_URL
        </button>
        <button
          onClick={() => setActiveTab('manifests')}
          className={`px-3 py-1.5 text-xs font-mono transition-colors ${
            activeTab === 'manifests'
              ? 'bg-[#242424] text-[#F5F5F5] font-bold border border-[#3A3A3A]'
              : 'text-[#808080] hover:text-[#C0C0C0]'
          }`}
        >
          ACTIVE_MANIFEST_INSPECTOR ({manifests.length})
        </button>
      </div>

      {/* Tab 1: Catalog */}
      {activeTab === 'catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESET_PLUGINS.map((plugin) => {
            const isInstalled = tools.some((t) => t.id === plugin.id);

            return (
              <div
                key={plugin.id}
                className="border border-[#2A2A2A] bg-[#121212] p-4 flex flex-col justify-between hover:border-[#383838] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#707070] mb-2 uppercase">
                    <span className="text-[#A0A0A0]">{plugin.category}</span>
                    <span>v{plugin.version}</span>
                  </div>
                  <h4 className="font-mono text-sm font-bold text-[#F5F5F5] mb-1">{plugin.name}</h4>
                  <p className="text-xs text-[#909090] font-sans leading-relaxed mb-4">
                    {plugin.description}
                  </p>
                  <div className="text-[11px] font-mono text-[#606060] mb-3">
                    Author: <span className="text-[#888888]">{plugin.author}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#1E1E1E]">
                  {isInstalled ? (
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-emerald-400 flex items-center gap-1.5">
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                        ACTIVE_IN_CORE
                      </span>
                      <button
                        onClick={() => handleUnmount(plugin.id)}
                        className="text-[#707070] hover:text-red-400 underline underline-offset-2"
                      >
                        UNMOUNT
                      </button>
                    </div>
                  ) : (
                    <TactileButton
                      onClick={() =>
                        handleLoadPlugin(plugin.url, {
                          id: plugin.id,
                          name: plugin.name,
                          version: plugin.version,
                          description: plugin.description,
                          category: plugin.category,
                          author: plugin.author,
                        })
                      }
                      disabled={isLoading}
                      variant="secondary"
                      size="sm"
                      className="w-full justify-center"
                    >
                      <CodeIcon className="w-3.5 h-3.5 mr-1.5" />
                      LOAD_INTO_SANDBOX
                    </TactileButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Custom URL Injection */}
      {activeTab === 'custom' && (
        <div className="border border-[#2A2A2A] bg-[#121212] p-5 font-mono text-xs">
          <div className="text-xs uppercase tracking-wider text-[#A0A0A0] mb-2 font-bold">
            DYNAMIC_RUNTIME_URL_INJECTION
          </div>
          <p className="text-[#808080] font-sans text-xs mb-4">
            Specify any external HTTPS URL or blob URL delivering an ES module conforming to the
            Platform Steady <code className="text-[#F5F5F5]">BaseMicroTool</code> specification.
          </p>

          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="Module URL (e.g., https://raw.githubusercontent.com/.../my-tool.js)"
              value={scriptUrl}
              onChange={(e) => setScriptUrl(e.target.value)}
              className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2 text-xs text-[#F5F5F5] placeholder-[#505050] focus:border-[#4A4A4A] focus:outline-none"
            />
            <TactileButton
              onClick={() => {
                if (scriptUrl.trim()) handleLoadPlugin(scriptUrl.trim());
              }}
              disabled={!scriptUrl.trim() || isLoading}
              variant="primary"
              size="sm"
            >
              <CodeIcon className="w-3.5 h-3.5 mr-1.5" />
              EVAL_SANDBOX
            </TactileButton>
          </div>

          <div className="text-[11px] text-[#707070] bg-[#0A0A0A] border border-[#1E1E1E] p-3 leading-relaxed">
            <div className="font-bold text-[#A0A0A0] mb-1">CONTRACT_SPECIFICATION:</div>
            <pre className="text-[#888888] font-mono">
{`module.exports = {
  id: "my-custom-tool",
  name: "My Custom Micro-Tool",
  version: "1.0.0",
  category: "plugin",
  description: "Hardware telemetry logger",
  async init(engine) { /* lifecycle registration */ },
  async dispose() { /* teardown */ }
};`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Manifests & Running Tools */}
      {activeTab === 'manifests' && (
        <div className="border border-[#2A2A2A] bg-[#121212] font-mono text-xs">
          <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LayersIcon className="w-4 h-4 text-[#C0C0C0]" />
              <span className="font-bold text-[#F5F5F5] uppercase">
                ACTIVE_REGISTERED_MICRO_TOOLS
              </span>
              <span className="text-[#707070]">({tools.length} mounted)</span>
            </div>
            <TactileButton onClick={refreshList} variant="ghost" size="sm">
              <RefreshIcon className="w-3.5 h-3.5 mr-1" />
              REFRESH
            </TactileButton>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#0D0D0D] text-[#707070] border-b border-[#2A2A2A] uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">TOOL_IDENTIFIER</th>
                  <th className="py-2.5 px-3">NAME</th>
                  <th className="py-2.5 px-3">VERSION</th>
                  <th className="py-2.5 px-3">CATEGORY</th>
                  <th className="py-2.5 px-3">LIFECYCLE_STATUS</th>
                  <th className="py-2.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {tools.map((t) => (
                  <tr key={t.id} className="hover:bg-[#161616] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#F5F5F5]">{t.id}</td>
                    <td className="py-3 px-3 text-[#E0E0E0]">{t.name}</td>
                    <td className="py-3 px-3 text-[#A0A0A0]">v{t.version}</td>
                    <td className="py-3 px-3 text-[#808080] uppercase">{t.category}</td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-400 uppercase text-[11px] font-bold">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {t.id !== 'tool-asset-manager' ? (
                        <button
                          onClick={() => handleUnmount(t.id)}
                          className="px-2 py-1 bg-[#1A1A1A] hover:bg-red-950/40 border border-[#2A2A2A] hover:border-red-900/50 text-[#707070] hover:text-red-400 transition-colors"
                        >
                          <TrashIcon className="w-3 h-3 inline mr-1" />
                          UNMOUNT
                        </button>
                      ) : (
                        <span className="text-[#555555] text-[11px]">CORE_BUILTIN</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
