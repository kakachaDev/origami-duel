import type { GameState } from '@/types/game'
import type { HandlerContext } from '@/config/loader'
import type { Position } from '@/types/board'
import { fruitsConfig } from '@/config/loader'
import { createRNG } from '@/utils/rng'

/**
 * iceHandler
 * Triggered when a fruit adjacent to an ice cell is destroyed.
 *
 * Behaviour:
 * - Ice is NOT affected by gravity.
 * - Each destroyed adjacent fruit deals 1 damage to each neighbouring ice.
 * - At 0 HP, the ice cell transforms into a random regular fruit.
 */
export function iceHandler(state: GameState, ctx: HandlerContext): void {
  const icePos = ctx.triggerPos as Position | undefined
  if (!icePos) return

  const cell = state.board[icePos.row]?.[icePos.col]
  if (!cell || cell.content.kind !== 'ice') return

  // Replace ice with a random fruit
  const rng = createRNG(Date.now())
  const fruitDefs = fruitsConfig.fruits
  const randomFruit = rng.pick(fruitDefs)
  if (!randomFruit) return

  cell.content = {
    kind: 'fruit',
    fruit: { id: randomFruit.id, overlay: null },
  }
}
