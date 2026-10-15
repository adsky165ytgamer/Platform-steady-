/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getPlatformCore } from '../../core/platform-core';
import { TelemetryPacket } from '../../core/types';
import { TactileButton } from '../TactileButton';
import {
  RadioIcon,
  RefreshIcon,
  PauseIcon,
  PlayIcon,
  TrashIcon,
  CopyIcon,
  TerminalIcon,
  DatabaseIcon,
  ActivityIcon,
} from '../Icons';

export const NetworkInspectorTool: React.FC = () => {
  const engine = getPlatformCore();
  const [packets, setPackets] = useState<TelemetryPacket[]>([]);
  const [filterSource, setFilterSource] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(engine.telemetry.isStreamPaused());
  const [selectedPacket, setSelectedPacket] = useState<TelemetryPacket | null>(null);
  const [testPayload, setTestPayload] = useState('{"message": "ping", "subsystem": "binder_ipc"}');
  const [testCollection, setTestCollection] = useState('kernel_logs');
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial fetch of recent telemetry
    setPackets(engine.telemetry.getRecent(150));

    // Subscribe to live telemetry packets
    const unsub = engine.telemetry.subscribe((packet) => {
      setPackets((prev) => [packet, ...prev.slice(0, 149)]);
    });

    return () => {
      unsub();
    };
  }, [engine]);

  const filteredPackets = useMemo(() => {
    return packets.filter((p) => {
      if (filterSource !== 'all' && p.source !== filterSource) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTarget = p.target.toLowerCase().includes(query);
        const matchesMethod = p.method.toLowerCase().includes(query);
        const matchesStatus = String(p.status).includes(query);
        if (!matchesTarget && !matchesMethod && !matchesStatus) return false;
      }
      return true;
    });
  }, [packets, filterSource, searchQuery]);

  const togglePause = () => {
    if (isPaused) {
      engine.telemetry.resume();
      setIsPaused(false);
    } else {
      engine.telemetry.pause();
      setIsPaused(true);
    }
  };

  const handleClear = () => {
    engine.telemetry.clear();
    setPackets([]);
    setSelectedPacket(null);
  };

  // Test Dispatch: Send simulated request to either Local IDB or Remote Gateway
  const handleTestDispatch = async (targetEngine: 'local-stack' | 'remote-gateway') => {
    setDispatchStatus(`DISPATCHING_TO_${targetEngine.toUpperCase()}...`);
    try {
      let parsedBody: Record<string, unknown> = {};
      try {
        parsedBody = JSON.parse(testPayload);
      } catch {
        parsedBody = { raw: testPayload };
      }

      await engine.request(testCollection, {
        method: 'POST',
        body: parsedBody,
        forceMode: targetEngine,
      });

      setDispatchStatus(`DISPATCH_OK (${targetEngine})`);
      setTimeout(() => setDispatchStatus(null), 2500);
    } catch (err) {
      setDispatchStatus(`FAILED: ${(err as Error).message}`);
    }
  };

  const stats = engine.telemetry.getStats();

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatStatus = (p: TelemetryPacket) => {
    if (p.source === 'local-idb') {
      return (
        <span className="text-emerald-400 font-mono text-[11px]">
          IDB_0 ({p.statusText})
        </span>
      );
    }
    if (p.status >= 200 && p.status < 300) {
      return (
        <span className="text-emerald-400 font-mono text-[11px]">
          {p.status} {p.statusText}
        </span>
      );
    }
    if (p.status >= 400 || p.error) {
      return (
        <span className="text-red-400 font-mono text-[11px]">
          {p.status || 500} {p.error ? 'ERR' : p.statusText}
        </span>
      );
    }
    return (
      <span className="text-[#A0A0A0] font-mono text-[11px]">
        {p.status} {p.statusText}
      </span>
    );
  };

  const copyAsCurl = (p: TelemetryPacket) => {
    const curl = `curl -X ${p.method.replace('IDB_', '')} "${p.target}" -H "Content-Type: application/json"`;
    navigator.clipboard.writeText(curl);
    alert('Copied cURL command to clipboard.');
  };

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="border border-[#2A2A2A] bg-[#121212] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1">
              <span>DUAL_ENGINE_TELEMETRY</span>
              <span aria-hidden="true">/</span>
              <span>LIVE_PAYLOAD_INSPECTOR</span>
            </div>
            <h2 className="text-xl font-bold font-mono text-[#F5F5F5] uppercase tracking-tight">
              Live Network & Payload Inspector
            </h2>
            <p className="text-sm text-[#A0A0A0] mt-1 max-w-2xl font-sans">
              Real-time hardware-grade telemetry pipeline observing local IndexedDB document queries,
              binary chunk streams, and outbound Remote Gateway REST dispatches.
            </p>
          </div>

          {/* Vitals metrics */}
          <div className="flex items-center gap-4 text-xs font-mono border-t md:border-t-0 md:border-l border-[#2A2A2A] pt-3 md:pt-0 md:pl-5">
            <div>
              <div className="text-[#707070] uppercase">Packets</div>
              <div className="text-base font-bold text-[#F5F5F5]">{stats.totalPackets} captured</div>
            </div>
            <div>
              <div className="text-[#707070] uppercase">Avg Latency</div>
              <div className="text-base font-bold text-[#F5F5F5]">{stats.avgLatencyMs} ms</div>
            </div>
            <div>
              <div className="text-[#707070] uppercase">Throughput</div>
              <div className="text-base font-bold text-[#F5F5F5]">{formatBytes(stats.totalBytes)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch Test Console */}
      <div className="border border-[#2A2A2A] bg-[#121212] p-4 font-mono text-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <RadioIcon className="w-4 h-4 text-[#C0C0C0]" />
            <span className="font-bold text-[#F5F5F5] uppercase">
              DUAL_ENGINE_TEST_DISPATCHER
            </span>
          </div>
          {dispatchStatus && (
            <span className="text-emerald-400 font-mono text-[11px] animate-pulse">
              [{dispatchStatus}]
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-[11px] text-[#707070] block mb-1 uppercase">TARGET_COLLECTION</label>
            <input
              type="text"
              value={testCollection}
              onChange={(e) => setTestCollection(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-2.5 py-1.5 text-xs text-[#F5F5F5] font-mono focus:border-[#4A4A4A] focus:outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-[11px] text-[#707070] block mb-1 uppercase">JSON_PAYLOAD</label>
            <input
              type="text"
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A2A2A] px-2.5 py-1.5 text-xs text-[#F5F5F5] font-mono focus:border-[#4A4A4A] focus:outline-none"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => handleTestDispatch('local-stack')}
              className="flex-1 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] text-[#F5F5F5] text-xs font-mono uppercase"
            >
              SEND_IDB
            </button>
            <button
              onClick={() => handleTestDispatch('remote-gateway')}
              className="flex-1 py-1.5 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] text-[#F5F5F5] text-xs font-mono uppercase"
            >
              SEND_GATEWAY
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-[#121212] border border-[#2A2A2A]">
          {[
            { id: 'all', label: 'ALL_TRAFFIC' },
            { id: 'local-idb', label: 'LOCAL_IDB' },
            { id: 'remote-gateway', label: 'REMOTE_GATEWAY' },
            { id: 'asset-manager', label: 'ASSET_STREAMS' },
            { id: 'module-loader', label: 'PLUGINS' },
            { id: 'system', label: 'SYSTEM' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterSource(tab.id)}
              className={`px-3 py-1 text-xs font-mono transition-colors ${
                filterSource === tab.id
                  ? 'bg-[#242424] text-[#F5F5F5] font-bold border border-[#3A3A3A]'
                  : 'text-[#808080] hover:text-[#C0C0C0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter by path, method, status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#121212] border border-[#2A2A2A] px-3 py-1.5 text-xs font-mono text-[#F5F5F5] placeholder-[#505050] focus:border-[#4A4A4A] focus:outline-none w-56"
          />

          <button
            onClick={togglePause}
            className={`px-2.5 py-1.5 border border-[#2A2A2A] font-mono text-xs flex items-center gap-1.5 transition-colors ${
              isPaused
                ? 'bg-amber-950/30 text-amber-300 border-amber-900/50'
                : 'bg-[#161616] text-[#C0C0C0] hover:text-[#F5F5F5]'
            }`}
          >
            {isPaused ? (
              <>
                <PlayIcon className="w-3.5 h-3.5" />
                RESUME
              </>
            ) : (
              <>
                <PauseIcon className="w-3.5 h-3.5" />
                PAUSE
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            className="px-2.5 py-1.5 bg-[#161616] hover:bg-[#202020] border border-[#2A2A2A] font-mono text-xs text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors"
            title="Flush telemetry buffer"
          >
            <TrashIcon className="w-3.5 h-3.5 inline mr-1" />
            CLEAR
          </button>
        </div>
      </div>

      {/* Terminal Log View */}
      <div className="border border-[#2A2A2A] bg-[#0A0A0A]">
        <div className="p-2.5 bg-[#121212] border-b border-[#2A2A2A] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-[#A0A0A0]" />
            <span className="font-bold text-[#F5F5F5]">TELEMETRY_STREAM_CONSOLE</span>
            <span className="text-[#606060]">({filteredPackets.length} entries matching)</span>
          </div>
          <div className="flex items-center gap-2 text-[#707070] text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-1" />
            LIVE_SOCKET
          </div>
        </div>

        <div
          ref={logContainerRef}
          className="max-h-96 overflow-y-auto divide-y divide-[#181818] font-mono text-xs"
        >
          {filteredPackets.length === 0 ? (
            <div className="p-8 text-center text-[#606060]">
              NO_TELEMETRY_PACKETS_RECORDED. Dispatch a test or trigger an asset download.
            </div>
          ) : (
            filteredPackets.map((p) => {
              const isSelected = selectedPacket?.id === p.id;
              const dateStr = new Date(p.timestamp).toLocaleTimeString();

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPacket(p)}
                  className={`px-3 py-2 flex items-center justify-between hover:bg-[#141414] cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#181818] border-l-2 border-[#F5F5F5]' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-[#606060] text-[11px] shrink-0">{dateStr}</span>

                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-bold border uppercase shrink-0 ${
                        p.source === 'local-idb'
                          ? 'bg-[#181818] border-[#303030] text-[#C0C0C0]'
                          : p.source === 'remote-gateway'
                          ? 'bg-[#181818] border-[#383838] text-[#F5F5F5]'
                          : 'bg-[#161616] border-[#2A2A2A] text-[#909090]'
                      }`}
                    >
                      {p.method}
                    </span>

                    <span className="text-[#E0E0E0] truncate max-w-md font-sans text-xs">
                      {p.target}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0 text-right">
                    <span className="text-[#707070] text-[11px]">{p.latencyMs} ms</span>
                    <span className="text-[#909090] text-[11px] w-16">
                      {p.payloadSizeBytes > 0 ? formatBytes(p.payloadSizeBytes) : '0 B'}
                    </span>
                    <span className="w-28 text-right">{formatStatus(p)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Packet Detail Inspector Drawer */}
      {selectedPacket && (
        <div className="border border-[#2A2A2A] bg-[#121212] p-5 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <ActivityIcon className="w-4 h-4 text-[#F5F5F5]" />
              <span className="font-bold text-[#F5F5F5] uppercase">
                TELEMETRY_PACKET_TRACE_INSPECTOR
              </span>
              <span className="text-[#606060]">[{selectedPacket.id}]</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyAsCurl(selectedPacket)}
                className="px-2.5 py-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] text-[#C0C0C0] hover:text-[#F5F5F5]"
              >
                <CopyIcon className="w-3 h-3 inline mr-1" />
                COPY_CURL
              </button>
              <button
                onClick={() => setSelectedPacket(null)}
                className="px-2.5 py-1 border border-[#2A2A2A] bg-[#1A1A1A] text-[#A0A0A0] hover:text-[#F5F5F5]"
              >
                CLOSE
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-[#A0A0A0]">
            <div>
              <span className="text-[#606060]">SOURCE_ENGINE:</span>{' '}
              <span className="text-[#F5F5F5] uppercase font-bold">{selectedPacket.source}</span>
            </div>
            <div>
              <span className="text-[#606060]">LATENCY_MS:</span>{' '}
              <span className="text-[#F5F5F5]">{selectedPacket.latencyMs} ms</span>
            </div>
            <div>
              <span className="text-[#606060]">PAYLOAD_SIZE:</span>{' '}
              <span className="text-[#F5F5F5]">{formatBytes(selectedPacket.payloadSizeBytes)}</span>
            </div>
            <div className="md:col-span-3">
              <span className="text-[#606060]">DISPATCH_TARGET:</span>{' '}
              <span className="text-[#F5F5F5] break-all">{selectedPacket.target}</span>
            </div>
          </div>

          {selectedPacket.details && (
            <div className="mb-4">
              <div className="text-[11px] uppercase text-[#707070] mb-1">
                TELEMETRY_PACKET_DETAILS
              </div>
              <pre className="bg-[#080808] border border-[#222222] p-3 text-[11px] text-[#A0A0A0] overflow-x-auto">
                {JSON.stringify(selectedPacket.details, null, 2)}
              </pre>
            </div>
          )}

          {selectedPacket.error && (
            <div className="border border-red-900/50 bg-red-950/20 p-3 text-red-400">
              <span className="font-bold">ERROR_STACK:</span> {selectedPacket.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
