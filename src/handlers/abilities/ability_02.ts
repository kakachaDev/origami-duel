import type { GameState } from '@/types/game'
import type { HandlerContext } from '@/config/loader'
import type { Position } from '@/types/board'
import { createRNG } from '@/utils/rng'

/**
 * ability_02 — Golden Rain
 * Replaces N random fruits with Golden Apples.
 * Does not affect Ice or existing Golden Apples.
 * N is determined by the ability's level config (ctx.count).
 */
export function ability_02(state: GameState, ctx: HandlerContext): void {
  const count = (ctx.count as number | undefined) ?? 2
  const board = state.board
  const rng = createRNG(Date.now())

  const eligible: Position[] = []
  for (let r = 0; r < board.length; r++) {
    const row = board[r]
    if (!row) continue
    for (let c = 0; c < row.length; c++) {
      const cell = row[c]
      if (!cell) continue
      if (cell.content.kind === 'fruit') {
        eligible.push({ col: c, row: r })
      }
    }
  }

  rng.shuffle(eligible)
  const targets = eligible.slice(0, count)
  const converted: Position[] = []

  for (const pos of targets) {
    const cell = board[pos.row]?.[pos.col]
    if (!cell) continue
    cell.content = { kind: 'golden_apple' }
    converted.push(pos)
  }

  ;(ctx as Record<string, unknown>)['convertedCells'] = converted
}
