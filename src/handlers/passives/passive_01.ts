import type { GameState } from '@/types/game'
import type { HandlerContext } from '@/config/loader'
import { GRID_COLS, GRID_ROWS } from '@/config/constants'

/**
 * passive_01 — Kiwi Keeper
 * Triggered after collecting 5 kiwi fruits.
 *
 * Effect: Destroys all fruits in the 3×3 area at the center of the board.
 * Does NOT destroy Golden Apples.
 */
export function passive_01(state: GameState, ctx: HandlerContext): void {
  const board = state.board
  const centerCol = Math.floor(GRID_COLS / 2)
  const centerRow = Math.floor(GRID_ROWS / 2)

  const destroyed: Array<{ row: number; col: number }> = []

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      const r = centerRow + dr
      const c = centerCol + dc
      const cell = board[r]?.[c]
      if (!cell) continue
      // Do not destroy golden apples
      if (cell.content.kind === 'golden_apple') continue
      if (cell.content.kind === 'fruit') {
        destroyed.push({ row: r, col: c })
        cell.content = { kind: 'empty' }
      }
    }
  }

  ;(ctx as Record<string, unknown>)['destroyedCells'] = destroyed
}
