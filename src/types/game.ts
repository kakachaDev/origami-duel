import type { Board } from './board'
import type { Player } from './player'

export type TurnPhase =
  | 'player_action'
  | 'player_ability'
  | 'opponent_action'
  | 'opponent_ability'
  /** Chain reactions, fall animations, modifier triggers in progress */
  | 'resolving'
  | 'round_end'
  | 'game_over'

export interface Round {
  /** 1-based */
  number: number
  phase: TurnPhase
}

export interface GameState {
  board: Board
  player: Player
  opponent: Player
  currentRound: Round
  /** From config: 4 */
  totalRounds: number
  /** -100..100. Positive = player leading, negative = opponent leading */
  ropeBarValue: number
  isPlayerTurn: boolean
  /** Total actions taken across all rounds */
  turnNumber: number
}

/** Typed event names for EventBus. Use as: eventBus.emit(GameEvent.BoardUpdated) */
export const enum GameEvent {
  BoardUpdated     = 'board:updated',
  FruitsDestroyed  = 'fruits:destroyed',
  PassiveFilled    = 'passive:filled',
  PassiveTriggered = 'passive:triggered',
  AbilityUsed      = 'ability:used',
  TurnChanged      = 'turn:changed',
  RoundEnded       = 'round:ended',
  GameOver         = 'game:over',
  ScoreUpdated     = 'score:updated',
  HintReady        = 'hint:ready',
  HintCancelled    = 'hint:cancelled',
}

/** Data passed when starting GameScene */
export interface GameSceneInitData {
  characterId: string
  abilityIds: [string, string]
  abilityLevel: 'L3' | 'L4' | 'L5'
}
