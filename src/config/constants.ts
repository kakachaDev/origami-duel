/** Canvas dimensions — the virtual resolution the game is designed for */
export const CANVAS_WIDTH  = 1080
export const CANVAS_HEIGHT = 1920

/** Game board */
export const GRID_COLS = 7
export const GRID_ROWS = 7
export const CELL_SIZE = 64

/** Pixel dimensions of the rendered game field */
export const GAME_FIELD_WIDTH  = CELL_SIZE * GRID_COLS  // 448
export const GAME_FIELD_HEIGHT = CELL_SIZE * GRID_ROWS  // 448

/** Vertical layout zones (top → bottom) */
export const ZONE_TOP_HEIGHT = Math.round(CANVAS_HEIGHT * 0.28)  // placeholder stub
export const ZONE_HUD_HEIGHT = Math.round(CANVAS_HEIGHT * 0.12)  // HUD 3x3 grid
export const ZONE_BOARD_Y    = ZONE_TOP_HEIGHT + ZONE_HUD_HEIGHT

/** Board origin — centred horizontally */
export const BOARD_ORIGIN_X = Math.round((CANVAS_WIDTH - GAME_FIELD_WIDTH) / 2)
export const BOARD_ORIGIN_Y = ZONE_BOARD_Y + Math.round((CANVAS_HEIGHT - ZONE_BOARD_Y - GAME_FIELD_HEIGHT) / 2)

/** Match lengths */
export const MIN_MATCH_LENGTH     = 3
export const BOMB_TRIGGER_LENGTH  = 4
export const GOLDEN_TRIGGER_LENGTH = 5

/** Leaderboard ID — must match playgama-bridge-config.json */
export const LEADERBOARD_ID = 'main'

/** localStorage / bridge.storage key prefix */
export const STORAGE_VERSION = 1
export const STORAGE_KEY_ROOT = 'origami_duel'
