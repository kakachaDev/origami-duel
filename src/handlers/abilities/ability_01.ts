import type { GameState } from '@/types/game'
import type { HandlerContext } from '@/config/loader'
import type { Position } from '@/types/board'
import type { FruitId } from '@/types/fruit'

/**
 * ability_01 — Precise Strike
 * Player taps a fruit on the board; all fruits of that type are destroyed.
 * Cannot target Golden Apples or Ice.
 */
export function ability_01(state: GameState, ctx: HandlerContext): void {
  const pos = ctx.targetPos as Position | undefined
  if (!pos) return

  const cell = state.board[pos.row]?.[pos.col]
  if (!cell) return

  // Cannot target golden_apple or ice
  if (cell.content.kind === 'golden_apple' || cell.content.kind === 'ice') return
  if (cell.content.kind !== 'fruit') return

  const targetId = cell.content.fruit.id as FruitId
  const board = state.board
  const toDestroy: Position[] = []

  for (let r = 0; r < board.length; r++) {
    const row = board[r]
    if (!row) continue
    for (let c = 0; c < row.length; c++) {
      const target = row[c]
      if (!target) continue
      if (target.content.kind === 'fruit' && target.content.fruit.id === targetId) {
        toDestroy.push({ col: c, row: r })
        target.content = { kind: 'empty' }
      }
    }
  }

  ;(ctx as Record<string, unknown>)['destroyedCells'] = toDestroy
}
