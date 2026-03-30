import type { CharacterDef, PassiveState } from './character'
import type { AbilityInstance } from './ability'

export type PlayerKind = 'human' | 'bot'

export interface Player {
  id: 'player' | 'opponent'
  kind: PlayerKind
  displayName: string
  character: CharacterDef
  passiveState: PassiveState
  /** Always exactly 2 active abilities per player */
  abilities: [AbilityInstance, AbilityInstance]
  score: number
  actionsRemaining: number
}
