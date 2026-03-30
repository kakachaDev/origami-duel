/**
 * rng.ts
 * Seeded pseudo-random number generator (Mulberry32).
 * Use this instead of Math.random() so board generation can be reproducible.
 */

export class RNG {
  private state: number

  constructor(seed: number) {
    this.state = seed >>> 0
  }

  /** Returns a float in [0, 1) */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0
    let z = this.state
    z = Math.imul(z ^ (z >>> 15), z | 1)
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61)
    return ((z ^ (z >>> 14)) >>> 0) / 0x100000000
  }

  /** Returns an integer in [0, max) */
  nextInt(max: number): number {
    return Math.floor(this.next() * max)
  }

  /** Returns an integer in [min, max] inclusive */
  nextRange(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1))
  }

  /** Returns true with given probability (0..1) */
  chance(probability: number): boolean {
    return this.next() < probability
  }

  /** Shuffles an array in place using Fisher-Yates */
  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = this.nextInt(i + 1)
      const tmp = arr[i]!
      arr[i] = arr[j]!
      arr[j] = tmp
    }
    return arr
  }

  /** Picks a random element from an array */
  pick<T>(arr: T[]): T {
    if (arr.length === 0) throw new Error('Cannot pick from empty array')
    return arr[this.nextInt(arr.length)]!
  }
}

/** Convenience: create a seeded RNG from the current timestamp */
export function createRNG(seed?: number): RNG {
  return new RNG(seed ?? Date.now())
}
