/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MutationEvent, EventSubscriber } from './types';

export class EventBroker {
  private subscribers: Map<string, Set<EventSubscriber>> = new Map();
  private wildcardSubscribers: Set<EventSubscriber> = new Set();
  private history: MutationEvent[] = [];
  private readonly maxHistory: number = 200;

  public subscribe<T = unknown>(topicPattern: string, callback: EventSubscriber<T>): () => void {
    const fn = callback as EventSubscriber;

    if (topicPattern === '*' || topicPattern === '**') {
      this.wildcardSubscribers.add(fn);
      return () => {
        this.wildcardSubscribers.delete(fn);
      };
    }

    if (!this.subscribers.has(topicPattern)) {
      this.subscribers.set(topicPattern, new Set());
    }
    this.subscribers.get(topicPattern)!.add(fn);

    return () => {
      const set = this.subscribers.get(topicPattern);
      if (set) {
        set.delete(fn);
        if (set.size === 0) {
          this.subscribers.delete(topicPattern);
        }
      }
    };
  }

  public publish<T = unknown>(
    path: string,
    action: MutationEvent['action'],
    payload: T
  ): MutationEvent<T> {
    const event: MutationEvent<T> = {
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      path,
      action,
      timestamp: Date.now(),
      payload,
    };

    // Store in history
    this.history.unshift(event as MutationEvent);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }

    // Notify wildcard listeners
    for (const sub of this.wildcardSubscribers) {
      try {
        sub(event as MutationEvent);
      } catch (err) {
        console.error(`[EventBroker] Wildcard listener failed:`, err);
      }
    }

    // Exact matches and prefix matches (e.g. 'storage.*')
    for (const [pattern, set] of this.subscribers.entries()) {
      let isMatch = false;
      if (pattern === path) {
        isMatch = true;
      } else if (pattern.endsWith('.*')) {
        const prefix = pattern.slice(0, -2);
        if (path === prefix || path.startsWith(prefix + '.')) {
          isMatch = true;
        }
      }

      if (isMatch) {
        for (const sub of set) {
          try {
            sub(event as MutationEvent);
          } catch (err) {
            console.error(`[EventBroker] Listener failed for topic ${pattern}:`, err);
          }
        }
      }
    }

    return event;
  }

  public getHistory(filterPrefix?: string): MutationEvent[] {
    if (!filterPrefix) return [...this.history];
    return this.history.filter((e) => e.path.startsWith(filterPrefix));
  }

  public clearHistory(): void {
    this.history = [];
  }
}
