/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { getPlatformCore } from '../../core/platform-core';
import { StoredBinaryAsset } from '../../core/types';
import { DownloadProgress } from '../../core/tools/asset-manager';
import { TactileButton } from '../TactileButton';
import {
  DownloadIcon,
  PackageIcon,
  RefreshIcon,
  TrashIcon,
  DatabaseIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  LayersIcon,
} from '../Icons';

const PRESET_PACKAGES = [
  {
    name: 'linux-kernel-6.1-symbols.bin',
    url: 'https://cdn.platformsteady.internal/dist/vmlinux-6.1-android14-arm64.bin',
    sizeLabel: '512 KB',
    description: 'Stripped ELF debug symbols & kernel symbol table kallsyms map.',
    tag: 'KERNEL_IMAGE',
  },
  {
    name: 'selinux-policy-android14.bin',
    url: 'https://cdn.platformsteady.internal/security/plat_sepolicy.cil.bin',
    sizeLabel: '256 KB',
    description: 'Compiled binary SELinux Type Enforcement database & rule matrix.',
    tag: 'SECURITY_MATRIX',
  },
  {
    name: 'vfs-inode-hierarchy-snapshot.bin',
    url: 'https://cdn.platformsteady.internal/storage/vfs-inodes-ext4-superblock.bin',
    sizeLabel: '384 KB',
    description: 'Ext4 inode table allocation map and POSIX UID capability tree.',
    tag: 'STORAGE_VFS',
  },
  {
    name: 'telemetry-schema-bundle.json',
    url: 'https://cdn.platformsteady.internal/schemas/telemetry-v3-proto.json',
    sizeLabel: '64 KB',
    description: 'Protobuf JSON specification bundle for real-time gateway telemetry.',
    tag: 'PROTO_SCHEMA',
  },
];

export const AssetManagerTool: React.FC = () => {
  const engine = getPlatformCore();
  const [assets, setAssets] = useState<StoredBinaryAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [customUrl, setCustomUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [activeDownload, setActiveDownload] = useState<DownloadProgress | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<StoredBinaryAsset | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadAssets = useCallback(async () => {
    setIsLoading(true);
    try {
      const list = await engine.storage.listBinaryAssets();
      setAssets(list);
    } catch (err) {
      console.error('Failed to load assets from IndexedDB:', err);
    } finally {
      setIsLoading(false);
    }
  }, [engine]);

  useEffect(() => {
    loadAssets();

    // Subscribe to storage asset updates
    const unsub = engine.eventBroker.subscribe('storage.asset.*', () => {
      loadAssets();
    });

    return () => {
      unsub();
    };
  }, [engine, loadAssets]);

  const handleStartDownload = async (url: string, name?: string, tag?: string) => {
    setErrorMsg(null);
    setActiveDownload({
      assetId: 'init',
      name: name || url.split('/').pop() || 'binary_bundle.bin',
      bytesReceived: 0,
      totalExpectedBytes: 0,
      chunksCount: 0,
      speedBytesPerSec: 0,
      isComplete: false,
    });

    try {
      await engine.assetManager.downloadAsset(
        url,
        name,
        tag ? [tag] : ['custom_remote'],
        (progress) => {
          setActiveDownload({ ...progress });
        }
      );
      await loadAssets();
      setTimeout(() => setActiveDownload(null), 1200);
    } catch (err) {
      setErrorMsg((err as Error).message);
      setActiveDownload(null);
    }
  };

  const handleExport = async (asset: StoredBinaryAsset) => {
    try {
      await engine.assetManager.exportAssetClientSide(asset);
    } catch (err) {
      alert(`Export failed: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (assetId: string) => {
    await engine.storage.deleteBinaryAsset(assetId);
    if (selectedAsset?.id === assetId) {
      setSelectedAsset(null);
    }
    await loadAssets();
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatSpeed = (bytesPerSec: number) => {
    return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
  };

  const totalStorageBytes = assets.reduce((acc, a) => acc + a.sizeBytes, 0);

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="border border-[#2A2A2A] bg-[#121212] p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1">
              <span>ZERO_SERVER_ASSET_DISTRIBUTION</span>
              <span aria-hidden="true">/</span>
              <span>INDEXEDDB_BLOB_STORAGE</span>
            </div>
            <h2 className="text-xl font-bold font-mono text-[#F5F5F5] uppercase tracking-tight">
              Zero-Server Asset Manager
            </h2>
            <p className="text-sm text-[#A0A0A0] mt-1 max-w-2xl font-sans">
              Stream remote static packages directly from CDN/HTTP endpoints into client-side
              IndexedDB binary storage via chunked <code className="text-[#F5F5F5] font-mono">fetch()</code> streams.
              Zero backend egress costs, zero proxy dependencies, persistent offline binary caching.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono border-t md:border-t-0 md:border-l border-[#2A2A2A] pt-3 md:pt-0 md:pl-5">
            <div>
              <div className="text-[#707070] uppercase">Persisted Blobs</div>
              <div className="text-base font-bold text-[#F5F5F5]">{assets.length} packages</div>
            </div>
            <div>
              <div className="text-[#707070] uppercase">IndexedDB Footprint</div>
              <div className="text-base font-bold text-[#F5F5F5]">{formatBytes(totalStorageBytes)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Download Progress Drawer */}
      {activeDownload && (
        <div className="border border-[#2A2A2A] bg-[#161616] p-4 font-mono text-xs">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-[#F5F5F5]">
              <DownloadIcon className="w-4 h-4 text-[#C0C0C0] animate-pulse" />
              <span className="font-bold uppercase">STREAMING_CHUNK_PIPELINE:</span>
              <span className="text-[#C0C0C0] truncate max-w-md">{activeDownload.name}</span>
            </div>
            <div className="text-[#A0A0A0] flex items-center gap-3">
              <span>{activeDownload.chunksCount} chunks</span>
              <span>·</span>
              <span>{formatSpeed(activeDownload.speedBytesPerSec)}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#0A0A0A] border border-[#2A2A2A] h-2 relative overflow-hidden mb-2">
            <div
              className="bg-[#F5F5F5] h-full transition-all duration-150"
              style={{
                width: `${
                  activeDownload.totalExpectedBytes > 0
                    ? Math.min(
                        100,
                        (activeDownload.bytesReceived / activeDownload.totalExpectedBytes) * 100
                      )
                    : 100
                }%`,
              }}
            />
          </div>

          <div className="flex justify-between text-[#808080] text-[11px]">
            <span>{formatBytes(activeDownload.bytesReceived)} transferred</span>
            <span>
              {activeDownload.isComplete
                ? 'PERSISTED_TO_INDEXEDDB_SUCCESS'
                : activeDownload.totalExpectedBytes > 0
                ? `${Math.round(
                    (activeDownload.bytesReceived / activeDownload.totalExpectedBytes) * 100
                  )}% complete`
                : 'Streaming dynamic chunks...'}
            </span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="border border-red-900/50 bg-red-950/20 p-3 font-mono text-xs text-red-400 flex items-center gap-2">
          <AlertTriangleIcon className="w-4 h-4 shrink-0" />
          <span>DOWNLOAD_PIPELINE_ERROR: {errorMsg}</span>
        </div>
      )}

      {/* Preset Engineering Packages Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#A0A0A0]">
            VERIFIED_REMOTE_PACKAGES (ONE_CLICK_STREAM)
          </span>
          <span className="text-xs font-mono text-[#707070]">Zero Server Proxy</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_PACKAGES.map((pkg) => {
            const isInstalled = assets.some((a) => a.name === pkg.name);
            return (
              <div
                key={pkg.name}
                className="border border-[#2A2A2A] bg-[#121212] p-4 flex flex-col justify-between hover:border-[#3A3A3A] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#707070] mb-2">
                    <span className="text-[#A0A0A0]">{pkg.tag}</span>
                    <span>{pkg.sizeLabel}</span>
                  </div>
                  <h4 className="font-mono text-sm font-bold text-[#F5F5F5] break-all mb-1">
                    {pkg.name}
                  </h4>
                  <p className="text-xs text-[#909090] font-sans leading-relaxed mb-4">
                    {pkg.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1E1E1E]">
                  {isInstalled ? (
                    <div className="flex items-center justify-between text-xs font-mono text-[#A0A0A0]">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <CheckCircleIcon className="w-3.5 h-3.5" />
                        IN_INDEXEDDB
                      </span>
                      <button
                        onClick={() => {
                          const existing = assets.find((a) => a.name === pkg.name);
                          if (existing) setSelectedAsset(existing);
                        }}
                        className="text-[#C0C0C0] hover:text-[#F5F5F5] underline underline-offset-2"
                      >
                        INSPECT
                      </button>
                    </div>
                  ) : (
                    <TactileButton
                      onClick={() => handleStartDownload(pkg.url, pkg.name, pkg.tag)}
                      variant="secondary"
                      size="sm"
                      className="w-full justify-center"
                    >
                      <DownloadIcon className="w-3.5 h-3.5 mr-1.5" />
                      STREAM_INTO_IDB
                    </TactileButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Static Asset URL Downloader */}
      <div className="border border-[#2A2A2A] bg-[#121212] p-4">
        <div className="text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-3">
          DISPATCH_CUSTOM_STATIC_URL_STREAM
        </div>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Remote Static URL (e.g., https://example.com/assets/world_map.bin)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2 text-xs font-mono text-[#F5F5F5] placeholder-[#505050] focus:border-[#4A4A4A] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Custom Package Name (Optional)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="w-full md:w-64 bg-[#0A0A0A] border border-[#2A2A2A] px-3 py-2 text-xs font-mono text-[#F5F5F5] placeholder-[#505050] focus:border-[#4A4A4A] focus:outline-none"
          />
          <TactileButton
            onClick={() => {
              if (customUrl.trim()) {
                handleStartDownload(customUrl.trim(), customName.trim() || undefined);
              }
            }}
            disabled={!customUrl.trim()}
            variant="primary"
            size="sm"
          >
            <DownloadIcon className="w-3.5 h-3.5 mr-1.5" />
            FETCH_STREAM
          </TactileButton>
        </div>
      </div>

      {/* Stored Binary Blobs Inventory Table */}
      <div className="border border-[#2A2A2A] bg-[#121212]">
        <div className="p-4 border-b border-[#2A2A2A] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DatabaseIcon className="w-4 h-4 text-[#C0C0C0]" />
            <span className="font-mono text-xs uppercase tracking-wider text-[#F5F5F5] font-bold">
              INDEXEDDB_BINARY_BLOB_INVENTORY
            </span>
            <span className="text-xs font-mono text-[#707070]">({assets.length} stored)</span>
          </div>

          <TactileButton onClick={loadAssets} variant="ghost" size="sm">
            <RefreshIcon className={`w-3.5 h-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            SYNC_TABLE
          </TactileButton>
        </div>

        {assets.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-[#707070]">
            <PackageIcon className="w-8 h-8 mx-auto mb-2 text-[#404040]" />
            NO_BINARY_BLOBS_PERSISTED_YET.
            <div className="text-[11px] text-[#555555] mt-1">
              Select one of the verified packages above or input a static URL to stream directly into
              browser storage.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0D0D0D] text-[#707070] border-b border-[#2A2A2A] uppercase text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">PACKAGE_NAME</th>
                  <th className="py-2.5 px-3">MIME_TYPE</th>
                  <th className="py-2.5 px-3">SIZE</th>
                  <th className="py-2.5 px-3">CHUNKS</th>
                  <th className="py-2.5 px-3">LATENCY</th>
                  <th className="py-2.5 px-3">SHA256_HASH</th>
                  <th className="py-2.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1A1A]">
                {assets.map((asset) => (
                  <tr
                    key={asset.id}
                    className={`hover:bg-[#161616] transition-colors ${
                      selectedAsset?.id === asset.id ? 'bg-[#181818]' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-[#F5F5F5]">
                      <div className="flex items-center gap-2">
                        <PackageIcon className="w-3.5 h-3.5 text-[#909090] shrink-0" />
                        <span className="truncate max-w-xs">{asset.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#A0A0A0]">{asset.mimeType}</td>
                    <td className="py-3 px-3 text-[#F5F5F5] font-semibold">
                      {formatBytes(asset.sizeBytes)}
                    </td>
                    <td className="py-3 px-3 text-[#A0A0A0]">{asset.chunkCount}</td>
                    <td className="py-3 px-3 text-[#707070]">{asset.downloadDurationMs} ms</td>
                    <td className="py-3 px-3 text-[#707070] font-mono text-[10px]">
                      {asset.sha256Hash ? asset.sha256Hash.slice(0, 12) + '...' : 'none'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedAsset(asset)}
                        className="px-2 py-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] text-[#C0C0C0] hover:text-[#F5F5F5] transition-colors"
                        title="Inspect Binary Dump"
                      >
                        HEX_INSPECT
                      </button>
                      <button
                        onClick={() => handleExport(asset)}
                        className="px-2 py-1 bg-[#1A1A1A] hover:bg-[#252525] border border-[#2A2A2A] text-[#F5F5F5] transition-colors"
                        title="Direct Client-Side Blob Export"
                      >
                        <DownloadIcon className="w-3 h-3 inline mr-1" />
                        EXPORT
                      </button>
                      <button
                        onClick={() => handleDelete(asset.id)}
                        className="px-2 py-1 bg-[#1A1A1A] hover:bg-red-950/40 border border-[#2A2A2A] hover:border-red-900/50 text-[#707070] hover:text-red-400 transition-colors"
                        title="Purge from IndexedDB"
                      >
                        <TrashIcon className="w-3 h-3 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Binary Hex & Metadata Inspection Drawer */}
      {selectedAsset && (
        <div className="border border-[#2A2A2A] bg-[#121212] p-5 font-mono">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3 mb-4">
            <div className="flex items-center gap-2">
              <LayersIcon className="w-4 h-4 text-[#F5F5F5]" />
              <span className="text-sm font-bold text-[#F5F5F5] uppercase">
                BINARY_PAYLOAD_HEX_DUMP_VIEWER
              </span>
              <span className="text-xs text-[#707070]">·</span>
              <span className="text-xs text-[#A0A0A0]">{selectedAsset.name}</span>
            </div>

            <div className="flex items-center gap-2">
              <TactileButton
                onClick={() => handleExport(selectedAsset)}
                variant="primary"
                size="sm"
              >
                <DownloadIcon className="w-3.5 h-3.5 mr-1.5" />
                EXPORT_BLOB
              </TactileButton>
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-2.5 py-1 text-xs border border-[#2A2A2A] bg-[#1A1A1A] text-[#A0A0A0] hover:text-[#F5F5F5]"
              >
                CLOSE
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4 text-[#A0A0A0]">
            <div>
              <span className="text-[#606060]">IDB_ASSET_ID:</span>{' '}
              <span className="text-[#F5F5F5]">{selectedAsset.id}</span>
            </div>
            <div>
              <span className="text-[#606060]">SHA256_INTEGRITY:</span>{' '}
              <span className="text-[#F5F5F5] break-all">{selectedAsset.sha256Hash || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#606060]">SOURCE_URL:</span>{' '}
              <span className="text-[#F5F5F5] break-all">{selectedAsset.sourceUrl}</span>
            </div>
            <div>
              <span className="text-[#606060]">STREAMED_CHUNKS:</span>{' '}
              <span className="text-[#F5F5F5]">{selectedAsset.chunkCount} chunks</span> (in{' '}
              {selectedAsset.downloadDurationMs} ms)
            </div>
          </div>

          <div className="text-[11px] uppercase text-[#707070] mb-1">
            FIRST_128_BYTES_HEXADECIMAL_DUMP
          </div>
          <div className="bg-[#080808] border border-[#222222] p-3 text-[11px] leading-relaxed overflow-x-auto text-[#C0C0C0]">
            {selectedAsset.previewBytes && selectedAsset.previewBytes.length > 0 ? (
              <div className="space-y-1">
                {Array.from({ length: Math.ceil(selectedAsset.previewBytes.length / 16) }).map(
                  (_, rowIdx) => {
                    const rowBytes = selectedAsset.previewBytes!.slice(rowIdx * 16, (rowIdx + 1) * 16);
                    const hexStr = rowBytes
                      .map((b) => b.toString(16).padStart(2, '0').toUpperCase())
                      .join(' ');
                    const asciiStr = rowBytes
                      .map((b) => (b >= 32 && b <= 126 ? String.fromCharCode(b) : '·'))
                      .join('');
                    const offset = (rowIdx * 16).toString(16).padStart(4, '0').toUpperCase();

                    return (
                      <div key={rowIdx} className="flex gap-4">
                        <span className="text-[#555555]">{offset}</span>
                        <span className="text-[#E0E0E0] tracking-wider w-80">{hexStr.padEnd(48, ' ')}</span>
                        <span className="text-[#888888] font-sans">{asciiStr}</span>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <span className="text-[#666666]">Preview bytes not generated for this asset.</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
