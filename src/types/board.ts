import type { Gem, OverlayId, SpecialTileId } from './gem'

export interface Position {
  /** 0-indexed, left to right */
  col: number
  /** 0-indexed, top to bottom */
  row: number
}

export type CellContent =
  | { kind: 'gem'; gem: Gem }
  | { kind: 'applebomb' }
  | { kind: 'empty' }

export interface Cell {
  pos: Position
  content: CellContent
}

/** board[row][col] */
export type Board = Cell[][]

export interface Move {
  from: Position
  /** Must be adjacent (orthogonal) to `from` */
  to: Position
}

export interface MatchGroup {
  cells: Position[]
  /** Overlay spawned by this match (4-in-row → bomb), or null */
  overlayCreated: OverlayId | null
  /** Special tile spawned by this match (5-in-row/L/+ → applebomb), or null */
  specialCreated: SpecialTileId | null
}
