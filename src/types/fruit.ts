export type FruitId = 'kiwi' | 'peach' | 'banana' | 'strawberry' | 'blueberry'

export type ModifierId = 'bomb_h' | 'bomb_v' | 'golden_apple' | 'ice'

export interface FruitDef {
  id: FruitId
  displayName: string
  spriteKey: string
  outlinedSpriteKey: string
  basePoints: number
  color: string
}

export interface ModifierDef {
  id: ModifierId
  displayName: string
  spriteKey: string
  /** true = replaces the fruit cell (golden_apple, ice). false = overlaid on fruit (bomb_h, bomb_v) */
  replacesFruit: boolean
  handlerRef: string
}

export interface Modifier {
  id: ModifierId
  /** Used by ice: starts at 1, destroyed when reaches 0 */
  hp?: number
}

export interface Fruit {
  id: FruitId
  /** null = plain fruit with no modifier overlay */
  modifier: Modifier | null
}
