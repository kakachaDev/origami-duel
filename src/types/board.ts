import type { Fruit, ModifierId } from './fruit'

export interface Position {
  /** 0-indexed, left to right */
  col: number
  /** 0-indexed, top to bottom */
  row: number
}

export type CellContent =
  | { kind: 'fruit'; fruit: Fruit }
  | { kind: 'golden_apple' }
  | { kind: 'ice' }
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
  /** Modifier created as a result of this match (4-in-row → bomb, 5-in-row/L/+ → golden_apple), or null */
  modifierCreated: ModifierId | null
}
