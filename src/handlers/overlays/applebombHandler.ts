import type { GameState } from '@/types/game'
import type { HandlerContext } from '@/config/loader'
import type { GemId, OverlayId } from '@/types/gem'

/**
 * applebombHandler
 * Triggered when an Applebomb cell is activated via adjacent swap.
 *
 * Behaviour:
 * 1. The player swapped a regular gem adjacent to the applebomb.
 * 2. Identify the gem type of the swapped gem.
 * 3. If that gem has an overlay, propagate it to all matching gems first.
 * 4. Destroy all gems of that type on the board.
 * 5. Applebombs cannot be destroyed by bomb or normal match — only by this activation.
 */
export function applebombHandler(state: GameState, ctx: HandlerContext): void {
  const targetGemId = ctx.targetGemId as GemId | undefined
  if (!targetGemId) return

  const board = state.board
  const targetOverlayId = ctx.targetOverlayId as OverlayId | undefined

  const toDestroy: Array<{ row: number; col: number }> = []

  for (let r = 0; r < board.length; r++) {
    const row = board[r]
    if (!row) continue
    for (let c = 0; c < row.length; c++) {
      const cell = row[c]
      if (!cell) continue
      if (cell.content.kind === 'gem' && cell.content.gem.id === targetGemId) {
        if (targetOverlayId && !cell.content.gem.overlay) {
          cell.content.gem.overlay = { id: targetOverlayId }
        }
        toDestroy.push({ row: r, col: c })
      }
    }
  }

  ;(ctx as Record<string, unknown>)['applebombCells'] = toDestroy
}
