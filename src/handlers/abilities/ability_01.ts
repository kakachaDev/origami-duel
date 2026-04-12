import type { GameState } from '@/types/game'
import type { HandlerContext } from '@/config/loader'
import type { Position } from '@/types/board'
import type { GemId } from '@/types/gem'

/**
 * ability_01 — Precise Strike
 * Player taps a gem on the board; all gems of that type are destroyed.
 * Cannot target Applebombs.
 */
export function ability_01(state: GameState, ctx: HandlerContext): void {
  const pos = ctx.targetPos as Position | undefined
  if (!pos) return

  const cell = state.board[pos.row]?.[pos.col]
  if (!cell) return

  if (cell.content.kind !== 'gem') return

  const targetId = cell.content.gem.id as GemId
  const board = state.board
  const toDestroy: Position[] = []

  for (let r = 0; r < board.length; r++) {
    const row = board[r]
    if (!row) continue
    for (let c = 0; c < row.length; c++) {
      const target = row[c]
      if (!target) continue
      if (target.content.kind === 'gem' && target.content.gem.id === targetId) {
        toDestroy.push({ col: c, row: r })
        target.content = { kind: 'empty' }
      }
    }
  }

  ;(ctx as Record<string, unknown>)['destroyedCells'] = toDestroy
}
