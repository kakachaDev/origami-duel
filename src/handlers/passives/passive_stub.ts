import type { GameState } from '@/types/game'
import type { HandlerContext } from '@/config/loader'

/** Stub passive — logs a warning. Replace with real logic when designed. */
export function passiveStub(_state: GameState, _ctx: HandlerContext): void {
  console.warn('[passiveStub] This passive ability has not been implemented yet.')
}
