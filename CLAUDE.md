# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
pnpm dev          # Start Vite dev server at http://localhost:3000
pnpm build        # tsc type-check + production build → dist/
pnpm typecheck    # TypeScript check without emitting
pnpm lint         # ESLint over src/
pnpm gen-sprites  # Regenerate placeholder PNGs in public/sprites/ (run once after clone)
pnpm preview      # Preview the production build locally
```

There are no automated tests yet. Type-checking is the primary correctness gate: `pnpm typecheck`.

---

## Project Identity

- **Game**: Match-3 duel, portrait-first mobile web (1080×1920)
- **Engine**: Phaser 3.90 (NOT Phaser 4)
- **Stack**: TypeScript 6, Vite 8, pnpm, Playgama Bridge v1 (CDN)
- **Platforms**: Yandex Games, VK Play

---

## Implementation Status

The project is **early-stage**. Scenes and types are defined; the game-logic layer is not yet implemented:

- `src/systems/`, `src/game-logic/`, `src/entities/` directories **do not exist yet** — they are the planned next layer.
- `src/scenes/GameScene.ts` is a stub (WIP placeholder).
- All handler files in `src/handlers/` exist but most are stubs.
- Config JSON files (`config/*.json`) are the data source of truth and are already populated.

---

## Folder Conventions

| Folder | Rule |
|--------|------|
| `src/scenes/` | Phaser Scene classes ONLY. No game logic. Scenes orchestrate and listen to events. |
| `src/game-logic/` | **Pure logic, zero Phaser imports.** Stateless functions/classes that take state as parameters. Must be unit-testable in Node. |
| `src/systems/` | Stateful systems that read/write `GameState`. May import from `game-logic/`. |
| `src/entities/` | Phaser display objects (`GameObjects.Container` or similar). Visual only. |
| `src/handlers/` | One file per passive/ability/modifier. Referenced by `handlerRef` string in JSON. |
| `src/types/` | Interfaces and `const enum`s only. Zero runtime code. |
| `src/bridge/` | ALL Playgama SDK calls isolated here. Nothing else touches `bridge`. |
| `src/utils/storage.ts` | The ONLY place that reads/writes persistence. |
| `config/*.json` | Data truth for balance, characters, abilities, fruits. Change numbers here, not in TS. |

---

## Architecture

```
Scenes  →  EventBus  →  Systems  →  game-logic  →  config/*.json + handlers/
                    ↘  Entities/Views
```

- **`GameState`** (defined in `src/types/game.ts`) is the single source of truth, owned by `GameScene` and passed by reference to all systems.
- **EventBus** (`src/utils/eventBus.ts`) is the only communication channel between systems and scenes. Event names are `GameEvent` const enum in `src/types/game.ts`.
- **Handler registry** in `src/config/loader.ts` maps `handlerRef` strings from JSON to `HandlerFn = (state, ctx) => void`. Add new handlers there.
- **`BotAI.chooseMoves()`** is a pure function — no side effects, no Phaser imports.
- **`PlaygamaBridge`** (`src/bridge/PlaygamaBridge.ts`) wraps the global `bridge` CDN object; degrades silently in local dev.
- Persistence via `src/utils/storage.ts` under key `origami_duel`; uses `bridge.storage` with `localStorage` fallback.

### Board Data Flow

```
Player tap / BotAI.chooseMoves()
  → BoardManager.validateSwap / swap
  → MatchFinder.findMatches
  → ModifierResolver.resolve  (may call handlers)
  → ScoreCalculator.calculate
  → state update + eventBus.emit(GameEvent.BoardUpdated)
  → BoardView.refresh()  (Tweens for fall/destruction)
```

- Gravity is pure logic in `BoardManager.applyGravity()` — **no Phaser physics**.
- Grid access pattern: `board[row][col]`, 0-indexed top-left origin.
- World pixels derived from `cellToWorld(pos)` in `src/utils/math.ts`.

### Scene Flow

```
Boot → MainMenu
MainMenu → ModeSelect → CharacterSelect → AbilitySelect → Game
MainMenu → Characters / Abilities / Leaderboard  (read-only, back to MainMenu)
```

Data passed between scenes via `this.scene.start(key, dataObject)` typed as `GameSceneInitData`.

---

## Hard Rules

1. **No Phaser in `game-logic/`** — must be unit-testable in Node without Phaser.
2. **No hardcoded game data in TS** — stats and parameters live in `config/*.json`.
3. **No procedural textures** — sprites from `public/assets/`. `graphics.fillRect` is debug only.
4. **No direct `localStorage`** — always use `src/utils/storage.ts`.
5. **No direct `bridge` access** — always use `src/bridge/PlaygamaBridge.ts`.
6. **No Phaser physics** for fruit falling — use Tweens in `BoardView`.
7. Sprite keys in Phaser registry must exactly match `spriteKey` fields in JSON configs.
8. Implement only what's in `docs/GDD.md` — no speculative features.

---

## Adding a New Handler (passive / ability / modifier)

1. Create file in `src/handlers/{passives|abilities|overlays}/`
2. Export `HandlerFn = (state: GameState, ctx: HandlerContext) => void`
3. Import and register it in `handlerRegistry` in `src/config/loader.ts`
4. Set `handlerRef` in the relevant `config/*.json`
