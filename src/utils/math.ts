/**
 * math.ts
 * Grid coordinate helpers and common math utilities.
 */

import type { Position } from '@/types/board'
import { BOARD_ORIGIN_X, BOARD_ORIGIN_Y, CELL_SIZE } from '@/config/constants'

/** Convert grid position to world pixel coordinates (center of cell) */
export function cellToWorld(pos: Position): { x: number; y: number } {
  return {
    x: BOARD_ORIGIN_X + pos.col * CELL_SIZE + CELL_SIZE / 2,
    y: BOARD_ORIGIN_Y + pos.row * CELL_SIZE + CELL_SIZE / 2,
  }
}

/** Convert world pixel coordinates to grid position (or null if outside board) */
export function worldToCell(x: number, y: number, cols: number, rows: number): Position | null {
  const col = Math.floor((x - BOARD_ORIGIN_X) / CELL_SIZE)
  const row = Math.floor((y - BOARD_ORIGIN_Y) / CELL_SIZE)
  if (col < 0 || col >= cols || row < 0 || row >= rows) return null
  return { col, row }
}

/** Returns true if two positions are orthogonally adjacent (not diagonal) */
export function isAdjacent(a: Position, b: Position): boolean {
  return (Math.abs(a.col - b.col) + Math.abs(a.row - b.row)) === 1
}

/** Returns true if two positions are the same cell */
export function posEqual(a: Position, b: Position): boolean {
  return a.col === b.col && a.row === b.row
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Linear interpolation then clamped */
export function lerpClamped(a: number, b: number, t: number): number {
  return clamp(lerp(a, b, t), Math.min(a, b), Math.max(a, b))
}

/** Manhattan distance between two positions */
export function manhattan(a: Position, b: Position): number {
  return Math.abs(a.col - b.col) + Math.abs(a.row - b.row)
}

/** All orthogonal neighbours of a position (within bounds) */
export function neighbours(pos: Position, cols: number, rows: number): Position[] {
  const result: Position[] = []
  const dirs: Position[] = [{ col: 0, row: -1 }, { col: 0, row: 1 }, { col: -1, row: 0 }, { col: 1, row: 0 }]
  for (const d of dirs) {
    const n = { col: pos.col + d.col, row: pos.row + d.row }
    if (n.col >= 0 && n.col < cols && n.row >= 0 && n.row < rows) {
      result.push(n)
    }
  }
  return result
}
