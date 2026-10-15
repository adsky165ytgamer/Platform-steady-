/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TelemetryPacket } from './types';

export type TelemetryListener = (packet: TelemetryPacket) => void;

export class TelemetryBus {
  private packets: TelemetryPacket[] = [];
  private listeners: Set<TelemetryListener> = new Set();
  private maxCapacity: number = 300;
  private isPaused: boolean = false;

  constructor(capacity: number = 300) {
    this.maxCapacity = capacity;
  }

  public record(
    packet: Omit<TelemetryPacket, 'id' | 'timestamp'> & { timestamp?: number }
  ): TelemetryPacket {
    const fullPacket: TelemetryPacket = {
      id: `pkt_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: packet.timestamp ?? Date.now(),
      ...packet,
    };

    if (!this.isPaused) {
      this.packets.unshift(fullPacket);
      if (this.packets.length > this.maxCapacity) {
        this.packets.pop();
      }

      for (const listener of this.listeners) {
        try {
          listener(fullPacket);
        } catch (err) {
          console.error('[TelemetryBus] Listener error:', err);
        }
      }
    }

    return fullPacket;
  }

  public subscribe(listener: TelemetryListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getRecent(limit?: number): TelemetryPacket[] {
    return limit ? this.packets.slice(0, limit) : [...this.packets];
  }

  public clear(): void {
    this.packets = [];
  }

  public pause(): void {
    this.isPaused = true;
  }

  public resume(): void {
    this.isPaused = false;
  }

  public isStreamPaused(): boolean {
    return this.isPaused;
  }

  public getStats(): {
    totalPackets: number;
    avgLatencyMs: number;
    totalBytes: number;
    errorCount: number;
  } {
    if (this.packets.length === 0) {
      return { totalPackets: 0, avgLatencyMs: 0, totalBytes: 0, errorCount: 0 };
    }

    let sumLatency = 0;
    let sumBytes = 0;
    let errors = 0;

    for (const p of this.packets) {
      sumLatency += p.latencyMs;
      sumBytes += p.payloadSizeBytes;
      if (p.status >= 400 || p.error) {
        errors++;
      }
    }

    return {
      totalPackets: this.packets.length,
      avgLatencyMs: Math.round((sumLatency / this.packets.length) * 10) / 10,
      totalBytes: sumBytes,
      errorCount: errors,
    };
  }
}
