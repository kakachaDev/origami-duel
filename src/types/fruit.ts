export type FruitId = 'kiwi' | 'peach' | 'banana' | 'strawberry' | 'blueberry'

export interface FruitDef {
  id: FruitId
  displayName: string
  spriteKey: string
  outlinedSpriteKey: string
  basePoints: number
  color: string
}

// Overlays sit on top of a fruit tile (bombs)
export type OverlayId = 'bomb_h' | 'bomb_v'

export interface OverlayDef {
  id: OverlayId
  displayName: string
  spriteKey: string
  handlerRef: string
}

export interface Overlay {
  id: OverlayId
}

export interface Fruit {
  id: FruitId
  /** null = plain fruit with no overlay */
  overlay: Overlay | null
}

// Standalone special tiles — not fruit variants
export type SpecialTileId = 'golden_apple' | 'ice'

export interface SpecialTileDef {
  id: SpecialTileId
  displayName: string
  spriteKey: string
  handlerRef: string
}
