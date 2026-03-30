import type { GameState } from '@/types/game'
import type { HandlerContext } from '@/config/loader'
import type { Position } from '@/types/board'

/**
 * bombHandler
 * Triggered when a fruit with a bomb_h or bomb_v modifier is destroyed.
 *
 * bomb_h: clears the entire row of the triggering cell.
 * bomb_v: clears the entire column of the triggering cell.
 *
 * If two bombs detonate together (match-2 with both having bomb modifiers),
 * ModifierResolver will call this twice and produce a cross (+) clear.
 */
export function bombHandler(state: GameState, ctx: HandlerContext): void {
  const pos = ctx.triggerPos as Position | undefined
  if (!pos) return

  const board = state.board
  const rows = board.length
  const cols = board[0]?.length ?? 0

  // Determine bomb direction from the cell content
  const cell = board[pos.row]?.[pos.col]
  if (!cell || cell.content.kind !== 'fruit') return

  const modId = cell.content.fruit.modifier?.id
  if (!modId) return

  if (modId === 'bomb_h') {
    // Clear entire row
    for (let c = 0; c < cols; c++) {
      const target = board[pos.row]?.[c]
      if (!target) continue
      if (target.content.kind === 'fruit' || target.content.kind === 'ice') {
        // Mark for destruction — actual scoring/removal is handled by ModifierResolver
        ;(ctx as Record<string, unknown>)['bombCells'] ??= []
        ;((ctx as Record<string, unknown>)['bombCells'] as Position[]).push({ col: c, row: pos.row })
      }
    }
  } else if (modId === 'bomb_v') {
    // Clear entire column
    for (let r = 0; r < rows; r++) {
      const target = board[r]?.[pos.col]
      if (!target) continue
      if (target.content.kind === 'fruit' || target.content.kind === 'ice') {
        ;(ctx as Record<string, unknown>)['bombCells'] ??= []
        ;((ctx as Record<string, unknown>)['bombCells'] as Position[]).push({ col: pos.col, row: r })
      }
    }
  }
}
