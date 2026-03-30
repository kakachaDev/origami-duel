import type { GameState } from '@/types/game'
import type { HandlerContext } from '@/config/loader'
import type { Position } from '@/types/board'

/**
 * ability_01 — Precise Strike
 * Destroys a single chosen fruit on the board.
 * Cannot target Golden Apples or Ice.
 */
export function ability_01(state: GameState, ctx: HandlerContext): void {
  const pos = ctx.targetPos as Position | undefined
  if (!pos) return

  const cell = state.board[pos.row]?.[pos.col]
  if (!cell) return

  // Cannot target golden_apple or ice
  if (cell.content.kind === 'golden_apple' || cell.content.kind === 'ice') return

  if (cell.content.kind === 'fruit') {
    ;(ctx as Record<string, unknown>)['destroyedCells'] = [pos]
    cell.content = { kind: 'empty' }
  }
}
