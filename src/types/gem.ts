export type GemId = 'red' | 'green' | 'pink' | 'blue' | 'banana'

export interface GemDef {
  id: GemId
  displayName: string
  /** Base gem sprite */
  spriteKey: string
  /** Pre-combined gem + bomb visual (alternate asset) */
  bombSpriteKey: string
  basePoints: number
  color: string
}

// Overlays sit on top of a gem tile (bombs)
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

export interface Gem {
  id: GemId
  /** null = plain gem with no overlay */
  overlay: Overlay | null
}

// Standalone special tiles — not gem variants
export type SpecialTileId = 'applebomb'

export interface SpecialTileDef {
  id: SpecialTileId
  displayName: string
  spriteKey: string
  handlerRef: string
}
