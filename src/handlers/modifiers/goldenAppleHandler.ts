import type { GameState } from '@/types/game'
import type { HandlerContext } from '@/config/loader'
import type { FruitId } from '@/types/fruit'

/**
 * goldenAppleHandler
 * Triggered when a Golden Apple cell is activated via adjacent swap (match-2).
 *
 * Behaviour:
 * 1. The player swapped a regular fruit adjacent to the golden apple.
 * 2. Identify the fruit type of the swapped fruit.
 * 3. If that fruit has a modifier, propagate the modifier to all matching fruits first.
 * 4. Destroy all fruits of that type on the board.
 * 5. Golden apples cannot be destroyed by bomb or normal match — only by this activation.
 */
export function goldenAppleHandler(state: GameState, ctx: HandlerContext): void {
  const targetFruitId = ctx.targetFruitId as FruitId | undefined
  if (!targetFruitId) return

  const board = state.board
  const targetModifierId = ctx.targetModifierId as string | undefined

  const toDestroy: Array<{ row: number; col: number }> = []

  for (let r = 0; r < board.length; r++) {
    const row = board[r]
    if (!row) continue
    for (let c = 0; c < row.length; c++) {
      const cell = row[c]
      if (!cell) continue
      if (cell.content.kind === 'fruit' && cell.content.fruit.id === targetFruitId) {
        // Propagate modifier if the triggering fruit had one
        if (targetModifierId && !cell.content.fruit.modifier) {
          cell.content.fruit.modifier = { id: targetModifierId as never }
        }
        toDestroy.push({ row: r, col: c })
      }
    }
  }

  // Store result in ctx for ModifierResolver to process
  ;(ctx as Record<string, unknown>)['goldenAppleCells'] = toDestroy
}
