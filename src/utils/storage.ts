/**
 * storage.ts
 * Unified save/load layer using Playgama Bridge's storage API.
 * Falls back to localStorage if the bridge is unavailable (local dev).
 *
 * All game code must go through this module — never access
 * localStorage or bridge.storage directly elsewhere.
 */

import { STORAGE_VERSION, STORAGE_KEY_ROOT } from '@/config/constants'

export interface LeaderboardEntry {
  name: string
  score: number
  date: string
}

export interface StoredSettings {
  musicVolume: number
  sfxVolume: number
  language: string
}

export interface LastSession {
  characterId: string | null
  abilityIds: string[]
}

export interface SaveData {
  version: number
  leaderboard: LeaderboardEntry[]
  settings: StoredSettings
  lastSession: LastSession
}

const DEFAULT_SAVE: SaveData = {
  version: STORAGE_VERSION,
  leaderboard: [],
  settings: {
    musicVolume: 0.8,
    sfxVolume: 0.8,
    language: 'en',
  },
  lastSession: {
    characterId: null,
    abilityIds: [],
  },
}

// ─── Bridge-aware get/set ─────────────────────────────────────────────────────

declare const bridge: { storage: { get: (k: string) => Promise<unknown>; set: (k: string, v: unknown) => Promise<void> } } | undefined

async function rawGet(key: string): Promise<string | null> {
  if (typeof bridge !== 'undefined') {
    try {
      const val = await bridge.storage.get(key)
      return val != null ? String(val) : null
    } catch {
      /* fall through to localStorage */
    }
  }
  return localStorage.getItem(key)
}

async function rawSet(key: string, value: string): Promise<void> {
  if (typeof bridge !== 'undefined') {
    try {
      await bridge.storage.set(key, value)
      return
    } catch {
      /* fall through to localStorage */
    }
  }
  localStorage.setItem(key, value)
}

// ─── Public API ───────────────────────────────────────────────────────────────

let _cache: SaveData | null = null

export async function loadSave(): Promise<SaveData> {
  if (_cache) return _cache

  try {
    const raw = await rawGet(STORAGE_KEY_ROOT)
    if (raw) {
      const parsed = JSON.parse(raw) as SaveData
      if (parsed.version === STORAGE_VERSION) {
        _cache = parsed
        return _cache
      }
    }
  } catch {
    /* corrupt data — reset */
  }

  _cache = structuredClone(DEFAULT_SAVE)
  return _cache
}

export async function persistSave(data: SaveData): Promise<void> {
  _cache = data
  await rawSet(STORAGE_KEY_ROOT, JSON.stringify(data))
}

export async function addLeaderboardEntry(entry: LeaderboardEntry): Promise<void> {
  const save = await loadSave()
  save.leaderboard.push(entry)
  save.leaderboard.sort((a, b) => b.score - a.score)
  if (save.leaderboard.length > 100) save.leaderboard.length = 100
  await persistSave(save)
}

export async function getTopScores(limit = 10): Promise<LeaderboardEntry[]> {
  const save = await loadSave()
  return save.leaderboard.slice(0, limit)
}

export async function saveLastSession(session: LastSession): Promise<void> {
  const save = await loadSave()
  save.lastSession = session
  await persistSave(save)
}

export async function getSettings(): Promise<StoredSettings> {
  const save = await loadSave()
  return save.settings
}

export async function saveSettings(settings: Partial<StoredSettings>): Promise<void> {
  const save = await loadSave()
  Object.assign(save.settings, settings)
  await persistSave(save)
}
