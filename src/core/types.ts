/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Platform Steady v3.0 Core Engine Types

export type EngineMode = 'local-stack' | 'remote-gateway';

export interface EngineConfig {
  mode: EngineMode;
  remoteEndpoint?: string;
  databaseName: string;
  enableTelemetry: boolean;
  maxTelemetryEntries: number;
}

export type StorageCategory = 'document' | 'binary_asset' | 'cache' | 'telemetry';

export interface StoredBinaryAsset {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  chunkCount: number;
  downloadDurationMs: number;
  createdAt: number;
  sourceUrl: string;
  sha256Hash?: string;
  blob?: Blob;
  previewBytes?: number[];
  tags: string[];
}

export interface TelemetryPacket {
  id: string;
  timestamp: number;
  source: 'local-idb' | 'remote-gateway' | 'asset-manager' | 'module-loader' | 'system';
  method: string; // 'GET' | 'POST' | 'IDB_READ' | 'IDB_WRITE' | 'IDB_DELETE' | 'BLOB_CHUNK' | 'LOAD_PLUGIN'
  target: string;
  status: number; // 200, 206, 304, 400, 404, 500, or 0 (local IDB success)
  statusText: string;
  latencyMs: number;
  payloadSizeBytes: number;
  headers?: Record<string, string>;
  details?: Record<string, unknown>;
  error?: string;
}

export interface MutationEvent<T = unknown> {
  id: string;
  path: string;
  action: 'insert' | 'update' | 'delete' | 'clear' | 'download_progress' | 'plugin_lifecycle';
  timestamp: number;
  payload: T;
}

export type EventSubscriber<T = unknown> = (event: MutationEvent<T>) => void;

// BaseMicroTool SDK Interface
export interface MicroToolProps {
  engine: unknown; // PlatformCoreEngine instance
  onClose?: () => void;
  standalone?: boolean;
}

export interface BaseMicroTool {
  id: string;
  name: string;
  version: string;
  category: 'storage' | 'network' | 'runtime' | 'security' | 'plugin';
  description: string;
  status: 'registered' | 'loading' | 'active' | 'error' | 'unmounted';
  author?: string;
  iconName?: string;
  init: (engine: unknown) => Promise<void>;
  render?: (props: MicroToolProps) => React.ReactNode;
  dispose?: () => Promise<void>;
  exports?: Record<string, unknown>;
}

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  entryScriptUrl: string;
  category: 'storage' | 'network' | 'runtime' | 'security' | 'plugin';
  permissions?: string[];
  loadedAt?: number;
  author?: string;
}

export interface DocumentRecord<T = Record<string, unknown>> {
  id: string;
  collection: string;
  data: T;
  createdAt: number;
  updatedAt: number;
  version: number;
}
