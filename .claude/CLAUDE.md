# CLAUDE.md — Origami Duel

AI assistant instructions for this project. Read this before making changes.

---

## Project Identity

- **Game**: Match-3 duel, portrait-first mobile web (1080×1920)
- **Engine**: Phaser 3.90 (NOT Phaser 4)
- **Stack**: TypeScript 6, Vite 8, pnpm, Playgama Bridge v1 (CDN)
- **Platforms**: Yandex Games, VK Play

---

## Folder Conventions

| Folder | Rule |
|--------|------|
| `src/scenes/` | Phaser Scene classes ONLY. No game logic. Scenes orchestrate and listen to events. |
| `src/game-logic/` | **Pure logic, zero Phaser imports.** Stateless functions or classes that take state as parameters. |
| `src/systems/` | Stateful systems that read/write `GameState`. May import from `game-logic/`. |
| `src/entities/` | Phaser display objects (`GameObjects.Container` or similar). Visual representation only. |
| `src/handlers/` | One file per passive/ability/modifier. Referenced by `handlerRef` string in JSON config. |
| `src/types/` | Interfaces and `const enum`s only. Zero runtime code. |
| `src/bridge/` | ALL Playgama SDK calls are isolated here. Nothing else touches `bridge`. |
| `src/utils/storage.ts` | The ONLY place that reads/writes persistence. Never use `localStorage` directly elsewhere. |
| `config/*.json` | Data truth for balance, characters, abilities, fruits. Change numbers here, not in TS. |

---

## Hard Rules

1. **No Phaser in `game-logic/`** — these files must be unit-testable in Node without Phaser.
2. **No hardcoded game data in TS** — fruit names, character stats, ability parameters live in `config/*.json`.
3. **No procedural textures** — use sprites from `public/sprites/`. `graphics.fillRect` is for debug only.
4. **No direct `localStorage`** — always use `src/utils/storage.ts`.
5. **No direct `bridge` access** — always use `src/bridge/PlaygamaBridge.ts`.
6. **No Phaser physics** for fruit falling — use Tweens in `BoardView`. Gravity is pure logic in `BoardManager.applyGravity()`.
7. **EventBus** is the primary communication between systems and scenes. Define event names in `src/types/game.ts` as `GameEvent` const enum.

---

## Coordinate System

- Grid: `{ col: number, row: number }` — 0-indexed, top-left origin
- World pixels: derived from `cellToWorld(pos)` in `src/utils/math.ts`
- `board[row][col]` is the canonical access pattern

---

## Scene Flow

```
Boot → MainMenu
MainMenu → ModeSelect → CharacterSelect → AbilitySelect → Game
MainMenu → Characters (read-only, back to MainMenu)
MainMenu → Abilities  (read-only, back to MainMenu)
MainMenu → Leaderboard (read-only, back to MainMenu)
```

Data passed between scenes via `this.scene.start(key, dataObject)` — typed via `GameSceneInitData`.

---

## Handler Registry Pattern

`handlerRef` strings in JSON map to functions in `src/config/loader.ts`:

```typescript
// JSON config:
"passiveHandlerRef": "passive_01"

// loader.ts:
export const handlerRegistry = { passive_01, ... }

// System calling it:
callHandler(character.passiveHandlerRef, state, ctx)
```

When adding a new passive/ability/modifier:
1. Create the file in the appropriate `src/handlers/` subfolder
2. Export a function matching `HandlerFn = (state, ctx) => void`
3. Import and register it in `handlerRegistry` in `src/config/loader.ts`
4. Set `handlerRef` in the relevant JSON config

---

## Bot AI

- `BotAI.chooseMoves(board, player, botConfig)` returns `Move[]` — pure function, no side effects.
- Config sliders live in `config/bot.json` (all 0–1 ranges).
- The bot sees the same full shared board a human player would see — no cheating via hidden info.

---

## Phaser Version Notes

- Use **Phaser 3.90** APIs only. Do not use Phaser 4 RC APIs.
- `Phaser.GameObjects.Layer` is available (3.60+).
- `scene.update()` is NOT used for game-state logic — use event-driven flow via `eventBus`.
- `scene.scale` for responsive coordinates, not hardcoded pixel values.

---

## Sprite Naming Convention

```
public/sprites/{category}/{spriteKey}.png
```

The `spriteKey` field in JSON config must exactly match what is passed to `this.load.image(key, path)` in `BootScene`.

---

## Rope Bar

Value range: `-100` to `100`. Positive = player leading.
Formula: `ropeBarValue = clamp(playerScore - opponentScore, -100, 100)`
Updates on `GameEvent.ScoreUpdated`.

---

## What NOT to Do

- Do not add error handling for internal code paths that should never fail.
- Do not add docstrings/comments to code you didn't change.
- Do not create helper abstractions for one-time operations.
- Do not speculate about future features — implement only what's in `docs/GDD.md`.


# Compact Instructions
When compacting, always preserve:
- All modified file paths with the specific changes made
- Current test results (which pass, which fail, exact error messages)
- The current task and remaining TODO items