export type AbilityLevel = 'L3' | 'L4' | 'L5'

export interface AbilityLevelConfig {
  uses: number
  /** Some abilities affect N targets (e.g., Golden Rain places N golden apples) */
  count?: number
}

export interface AbilityDef {
  id: string
  displayName: string
  spriteKey: string
  description: string
  handlerRef: string
  /** false = using this ability does NOT consume a player action */
  costsAction: boolean
  /** true = activating sets AbilityInstance.isActive and waits for a board tap before firing */
  requiresTarget: boolean
  levels: Record<AbilityLevel, AbilityLevelConfig>
}

export interface AbilityInstance {
  defId: string
  level: AbilityLevel
  remainingUses: number
  /** true when this ability is selected and awaiting a board target tap */
  isActive: boolean
}
