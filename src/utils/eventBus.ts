/**
 * eventBus.ts
 * Typed singleton event emitter for game-wide communication.
 * Systems and scenes communicate via events rather than direct references.
 *
 * Usage:
 *   eventBus.emit(GameEvent.ScoreUpdated, { playerId: 'player', delta: 30 })
 *   eventBus.on(GameEvent.ScoreUpdated, handler)
 *   eventBus.off(GameEvent.ScoreUpdated, handler)
 */

type EventHandler = (...args: unknown[]) => void

class EventBus {
  private readonly listeners = new Map<string, Set<EventHandler>>()

  on(event: string, handler: EventHandler): void {
    let set = this.listeners.get(event)
    if (!set) {
      set = new Set()
      this.listeners.set(event, set)
    }
    set.add(handler)
  }

  off(event: string, handler: EventHandler): void {
    this.listeners.get(event)?.delete(handler)
  }

  once(event: string, handler: EventHandler): void {
    const wrapper: EventHandler = (...args) => {
      handler(...args)
      this.off(event, wrapper)
    }
    this.on(event, wrapper)
  }

  emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach(handler => {
      try {
        handler(...args)
      } catch (err) {
        console.error(`[EventBus] Error in handler for "${event}":`, err)
      }
    })
  }

  removeAllListeners(event?: string): void {
    if (event) {
      this.listeners.delete(event)
    } else {
      this.listeners.clear()
    }
  }
}

/** Singleton instance — import this everywhere */
export const eventBus = new EventBus()
