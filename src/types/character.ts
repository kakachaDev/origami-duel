import type { GemId } from './gem'

export interface CharacterDef {
  id: string
  displayName: string
  spriteKey: string
  gemId: GemId
  passiveStackRequired: number
  passiveDescription: string
  passiveHandlerRef: string
  passiveIconSpriteKey: string
}

export interface PassiveState {
  characterId: string
  currentStack: number
  /** equals character.passiveStackRequired */
  maxStack: number
  isReady: boolean
}
