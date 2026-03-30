import type { GameState } from '@/types/game'
import type { HandlerContext } from '@/config/loader'
import type { Position } from '@/types/board'
import { createRNG } from '@/utils/rng'

/**
 * passive_02 — Berry Storm
 * Triggered after collecting 7 blueberry fruits.
 *
 * Effect: Spawns a random Horizontal or Vertical Bomb modifier on 2 random
 * fruits that do not already have any modifier.
 */
export function passive_02(state: GameState, ctx: HandlerContext): void {
  const board = state.board
  const rng = createRNG(Date.now())

  // Collect eligible cells (fruit with no modifier)
  const eligible: Position[] = []
  for (let r = 0; r < board.length; r++) {
    const row = board[r]
    if (!row) continue
    for (let c = 0; c < row.length; c++) {
      const cell = row[c]
      if (!cell) continue
      if (cell.content.kind === 'fruit' && cell.content.fruit.overlay === null) {
        eligible.push({ col: c, row: r })
      }
    }
  }

  rng.shuffle(eligible)
  const targets = eligible.slice(0, 2)
  const spawned: Position[] = []

  for (const pos of targets) {
    const cell = board[pos.row]?.[pos.col]
    if (!cell || cell.content.kind !== 'fruit') continue
    const bombType = rng.chance(0.5) ? 'bomb_h' : 'bomb_v'
    cell.content.fruit.overlay = { id: bombType }
    spawned.push(pos)
  }

  ;(ctx as Record<string, unknown>)['spawnedBombCells'] = spawned
}
