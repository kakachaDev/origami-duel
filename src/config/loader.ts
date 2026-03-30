/**
 * loader.ts
 * Imports all JSON config data with full TypeScript types.
 * Also holds the handler registry: maps handlerRef strings to functions.
 *
 * Vite resolveJsonModule makes static JSON imports type-safe.
 */

import fruitsRaw      from '@config/fruits.json'
import charactersRaw  from '@config/characters.json'
import abilitiesRaw   from '@config/abilities.json'
import botRaw         from '@config/bot.json'
import gameRaw        from '@config/game.json'

import type { FruitDef, OverlayDef, SpecialTileDef } from '@/types/fruit'
import type { CharacterDef } from '@/types/character'
import type { AbilityDef } from '@/types/ability'
import type { BotConfig, BotDifficulty } from '@/types/bot'

// ─── Typed accessors ─────────────────────────────────────────────────────────

export const fruitsConfig = fruitsRaw as {
  fruits: FruitDef[]
  overlays: OverlayDef[]
  specialTiles: SpecialTileDef[]
}

export const charactersConfig = charactersRaw as {
  characters: CharacterDef[]
}

export const abilitiesConfig = abilitiesRaw as {
  abilities: AbilityDef[]
}

export const botConfig = botRaw as {
  difficulties: Record<BotDifficulty, BotConfig>
  fieldDescriptions: Record<string, string>
}

export const gameConfig = gameRaw

// ─── Handler registry ─────────────────────────────────────────────────────────
// Each handlerRef string in JSON maps to a function here.

import type { GameState } from '@/types/game'
import type { Position } from '@/types/board'

export interface HandlerContext {
  triggerPos?: Position
  targetPos?: Position
  playerId?: 'player' | 'opponent'
  [key: string]: unknown
}

export type HandlerFn = (state: GameState, ctx: HandlerContext) => void

import { bombHandler }        from '@/handlers/overlays/bombHandler'
import { goldenAppleHandler } from '@/handlers/overlays/goldenAppleHandler'
import { iceHandler }         from '@/handlers/overlays/iceHandler'
import { passive_01 }         from '@/handlers/passives/passive_01'
import { passive_02 }         from '@/handlers/passives/passive_02'
import { passiveStub }        from '@/handlers/passives/passive_stub'
import { ability_01 }         from '@/handlers/abilities/ability_01'
import { ability_02 }         from '@/handlers/abilities/ability_02'
import { abilityStub }        from '@/handlers/abilities/ability_stub'

export const handlerRegistry: Record<string, HandlerFn> = {
  bombHandler,
  goldenAppleHandler,
  iceHandler,
  passive_01,
  passive_02,
  passive_stub: passiveStub,
  ability_01,
  ability_02,
  ability_stub: abilityStub,
}

/** Call a handler by its ref string. Warns if not found. */
export function callHandler(ref: string, state: GameState, ctx: HandlerContext): void {
  const fn = handlerRegistry[ref]
  if (!fn) {
    console.warn(`[HandlerRegistry] Unknown handlerRef: "${ref}"`)
    return
  }
  fn(state, ctx)
}
