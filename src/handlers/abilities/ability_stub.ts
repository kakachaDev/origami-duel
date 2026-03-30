import type { GameState } from '@/types/game'
import type { HandlerContext } from '@/config/loader'

/** Stub ability — logs a warning. Replace with real logic when designed. */
export function abilityStub(_state: GameState, _ctx: HandlerContext): void {
  console.warn('[abilityStub] This active ability has not been implemented yet.')
}
