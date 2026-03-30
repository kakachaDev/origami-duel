export type BotDifficulty = 'easy' | 'medium' | 'hard'

export interface BotConfig {
  label: string
  /** 0 = always optimal, 1 = fully random */
  randomness: number
  /** 0 = ignores passive fruit, 1 = prioritises it above all else */
  passiveSeeking: number
  /** Probability of using an available ability on any given action */
  abilityUsage: number
  /** 0 = uses ability at first opportunity, 1 = waits for best moment */
  abilityTiming: number
  /** Score multiplier bonus for passive fruit matches */
  fruitPreferenceWeight: number
  /** 0 = first valid move, 1 = always highest fruit-count move */
  scoreMaximizing: number
  /** Probability of intentionally triggering bomb/golden-apple combos */
  modifierAwareness: number
}
