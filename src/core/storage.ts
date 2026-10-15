/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DocumentRecord, StoredBinaryAsset } from './types';
import { EventBroker } from './event-broker';
import { TelemetryBus } from './telemetry';

const DB_NAME = 'platform_steady_v3';
const DB_VERSION = 1;
const STORE_DOCS = 'documents';
const STORE_ASSETS = 'binary_assets';
const STORE_CONFIG = 'system_config';

export class StorageEngine {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private memoryDocs: Map<string, DocumentRecord> = new Map();
  private memoryAssets: Map<string, StoredBinaryAsset> = new Map();
  private memoryConfig: Map<string, unknown> = new Map();
  private isBrowserIdbAvailable: boolean = typeof indexedDB !== 'undefined';
  private eventBroker: EventBroker;
  private telemetry: TelemetryBus;

  constructor(eventBroker: EventBroker, telemetry: TelemetryBus) {
    this.eventBroker = eventBroker;
    this.telemetry = telemetry;
    if (this.isBrowserIdbAvailable) {
      this.initDB().catch((err) => {
        console.warn('[StorageEngine] IndexedDB init failed, falling back to memory:', err);
        this.isBrowserIdbAvailable = false;
      });
    }
  }

  private async initDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_DOCS)) {
          const docStore = db.createObjectStore(STORE_DOCS, { keyPath: 'id' });
          docStore.createIndex('collection', 'collection', { unique: false });
        }
        if (!db.objectStoreNames.contains(STORE_ASSETS)) {
          db.createObjectStore(STORE_ASSETS, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORE_CONFIG)) {
          db.createObjectStore(STORE_CONFIG, { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  // --- Document Storage API ---

  public async setDocument<T = Record<string, unknown>>(
    collection: string,
    id: string,
    data: T
  ): Promise<DocumentRecord<T>> {
    const t0 = performance.now();
    const doc: DocumentRecord<T> = {
      id: `${collection}:${id}`,
      collection,
      data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    };

    if (this.isBrowserIdbAvailable) {
      try {
        const db = await this.initDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction([STORE_DOCS], 'readwrite');
          const store = tx.objectStore(STORE_DOCS);
          const req = store.put(doc);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      } catch {
        this.memoryDocs.set(doc.id, doc as unknown as DocumentRecord);
      }
    } else {
      this.memoryDocs.set(doc.id, doc as unknown as DocumentRecord);
    }

    const latency = Math.round(performance.now() - t0);
    const byteSize = new TextEncoder().encode(JSON.stringify(data)).length;

    this.telemetry.record({
      source: 'local-idb',
      method: 'IDB_WRITE',
      target: `idb://${collection}/${id}`,
      status: 0,
      statusText: 'LOCAL_IDB_OK',
      latencyMs: latency,
      payloadSizeBytes: byteSize,
      details: { collection, id, version: 1 },
    });

    this.eventBroker.publish(`storage.doc.${collection}`, 'insert', doc);
    return doc;
  }

  public async getDocument<T = Record<string, unknown>>(
    collection: string,
    id: string
  ): Promise<DocumentRecord<T> | null> {
    const t0 = performance.now();
    const fullId = `${collection}:${id}`;

    let result: DocumentRecord<T> | null = null;
    if (this.isBrowserIdbAvailable) {
      try {
        const db = await this.initDB();
        result = await new Promise<DocumentRecord<T> | null>((resolve, reject) => {
          const tx = db.transaction([STORE_DOCS], 'readonly');
          const store = tx.objectStore(STORE_DOCS);
          const req = store.get(fullId);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => reject(req.error);
        });
      } catch {
        result = (this.memoryDocs.get(fullId) as unknown as DocumentRecord<T>) || null;
      }
    } else {
      result = (this.memoryDocs.get(fullId) as unknown as DocumentRecord<T>) || null;
    }

    const latency = Math.round(performance.now() - t0);
    this.telemetry.record({
      source: 'local-idb',
      method: 'IDB_READ',
      target: `idb://${collection}/${id}`,
      status: result ? 0 : 404,
      statusText: result ? 'FOUND' : 'NOT_FOUND',
      latencyMs: latency,
      payloadSizeBytes: result ? JSON.stringify(result.data).length : 0,
    });

    return result;
  }

  public async queryCollection<T = Record<string, unknown>>(
    collection: string
  ): Promise<DocumentRecord<T>[]> {
    const t0 = performance.now();
    const results: DocumentRecord<T>[] = [];

    if (this.isBrowserIdbAvailable) {
      try {
        const db = await this.initDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction([STORE_DOCS], 'readonly');
          const store = tx.objectStore(STORE_DOCS);
          const index = store.index('collection');
          const req = index.getAll(collection);
          req.onsuccess = () => {
            if (req.result) results.push(...req.result);
            resolve();
          };
          req.onerror = () => reject(req.error);
        });
      } catch {
        for (const doc of this.memoryDocs.values()) {
          if (doc.collection === collection) results.push(doc as unknown as DocumentRecord<T>);
        }
      }
    } else {
      for (const doc of this.memoryDocs.values()) {
        if (doc.collection === collection) results.push(doc as unknown as DocumentRecord<T>);
      }
    }

    const latency = Math.round(performance.now() - t0);
    this.telemetry.record({
      source: 'local-idb',
      method: 'IDB_QUERY',
      target: `idb://${collection}`,
      status: 0,
      statusText: `MATCHES_${results.length}`,
      latencyMs: latency,
      payloadSizeBytes: JSON.stringify(results).length,
    });

    return results;
  }

  // --- Binary Blob Asset Storage API (Zero-Server Asset Manager) ---

  public async saveBinaryAsset(asset: StoredBinaryAsset): Promise<void> {
    const t0 = performance.now();

    // Prepare preview bytes for hex inspector
    if (!asset.previewBytes && asset.blob) {
      try {
        const arrayBuffer = await asset.blob.slice(0, 128).arrayBuffer();
        asset.previewBytes = Array.from(new Uint8Array(arrayBuffer));
      } catch (err) {
        console.warn('Could not extract preview bytes:', err);
      }
    }

    if (this.isBrowserIdbAvailable) {
      try {
        const db = await this.initDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction([STORE_ASSETS], 'readwrite');
          const store = tx.objectStore(STORE_ASSETS);
          const req = store.put(asset);
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      } catch {
        this.memoryAssets.set(asset.id, asset);
      }
    } else {
      this.memoryAssets.set(asset.id, asset);
    }

    const latency = Math.round(performance.now() - t0);
    this.telemetry.record({
      source: 'asset-manager',
      method: 'IDB_PUT_BLOB',
      target: `idb://assets/${asset.name}`,
      status: 0,
      statusText: 'PERSISTED_BLOB',
      latencyMs: latency,
      payloadSizeBytes: asset.sizeBytes,
      details: {
        id: asset.id,
        mimeType: asset.mimeType,
        chunkCount: asset.chunkCount,
        durationMs: asset.downloadDurationMs,
      },
    });

    this.eventBroker.publish('storage.asset.saved', 'insert', asset);
  }

  public async getBinaryAsset(id: string): Promise<StoredBinaryAsset | null> {
    const t0 = performance.now();
    let result: StoredBinaryAsset | null = null;

    if (this.isBrowserIdbAvailable) {
      try {
        const db = await this.initDB();
        result = await new Promise<StoredBinaryAsset | null>((resolve, reject) => {
          const tx = db.transaction([STORE_ASSETS], 'readonly');
          const store = tx.objectStore(STORE_ASSETS);
          const req = store.get(id);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => reject(req.error);
        });
      } catch {
        result = this.memoryAssets.get(id) || null;
      }
    } else {
      result = this.memoryAssets.get(id) || null;
    }

    const latency = Math.round(performance.now() - t0);
    this.telemetry.record({
      source: 'asset-manager',
      method: 'IDB_GET_BLOB',
      target: `idb://assets/${id}`,
      status: result ? 0 : 404,
      statusText: result ? 'LOADED' : 'NOT_FOUND',
      latencyMs: latency,
      payloadSizeBytes: result?.sizeBytes || 0,
    });

    return result;
  }

  public async listBinaryAssets(): Promise<StoredBinaryAsset[]> {
    const results: StoredBinaryAsset[] = [];
    if (this.isBrowserIdbAvailable) {
      try {
        const db = await this.initDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction([STORE_ASSETS], 'readonly');
          const store = tx.objectStore(STORE_ASSETS);
          const req = store.getAll();
          req.onsuccess = () => {
            if (req.result) results.push(...req.result);
            resolve();
          };
          req.onerror = () => reject(req.error);
        });
      } catch {
        results.push(...this.memoryAssets.values());
      }
    } else {
      results.push(...this.memoryAssets.values());
    }

    return results.sort((a, b) => b.createdAt - a.createdAt);
  }

  public async deleteBinaryAsset(id: string): Promise<boolean> {
    const t0 = performance.now();
    let deleted = false;

    if (this.isBrowserIdbAvailable) {
      try {
        const db = await this.initDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction([STORE_ASSETS], 'readwrite');
          const store = tx.objectStore(STORE_ASSETS);
          const req = store.delete(id);
          req.onsuccess = () => {
            deleted = true;
            resolve();
          };
          req.onerror = () => reject(req.error);
        });
      } catch {
        deleted = this.memoryAssets.delete(id);
      }
    } else {
      deleted = this.memoryAssets.delete(id);
    }

    const latency = Math.round(performance.now() - t0);
    this.telemetry.record({
      source: 'asset-manager',
      method: 'IDB_DELETE_BLOB',
      target: `idb://assets/${id}`,
      status: deleted ? 0 : 404,
      statusText: deleted ? 'DELETED' : 'NOT_FOUND',
      latencyMs: latency,
      payloadSizeBytes: 0,
    });

    this.eventBroker.publish('storage.asset.deleted', 'delete', { id });
    return deleted;
  }

  // --- System Configuration Store ---

  public async setConfig<T>(key: string, value: T): Promise<void> {
    if (this.isBrowserIdbAvailable) {
      try {
        const db = await this.initDB();
        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction([STORE_CONFIG], 'readwrite');
          const store = tx.objectStore(STORE_CONFIG);
          const req = store.put({ key, value, updatedAt: Date.now() });
          req.onsuccess = () => resolve();
          req.onerror = () => reject(req.error);
        });
      } catch {
        this.memoryConfig.set(key, value);
      }
    } else {
      this.memoryConfig.set(key, value);
    }
  }

  public async getConfig<T>(key: string, defaultValue?: T): Promise<T | undefined> {
    if (this.isBrowserIdbAvailable) {
      try {
        const db = await this.initDB();
        const record = await new Promise<{ key: string; value: T } | null>((resolve, reject) => {
          const tx = db.transaction([STORE_CONFIG], 'readonly');
          const store = tx.objectStore(STORE_CONFIG);
          const req = store.get(key);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => reject(req.error);
        });
        return record ? record.value : defaultValue;
      } catch {
        return (this.memoryConfig.get(key) as T) ?? defaultValue;
      }
    }
    return (this.memoryConfig.get(key) as T) ?? defaultValue;
  }
}
