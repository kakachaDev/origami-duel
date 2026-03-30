# Architecture — Origami Duel

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Game Engine | Phaser 3 | ^3.90.0 |
| Language | TypeScript | ^6.0 |
| Bundler | Vite | ^6.0 |
| Package Manager | pnpm | 9+ |
| Platform SDK | Playgama Bridge | v1 stable |
| Persistence | bridge.storage / localStorage | — |

---

## Layer Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  Scenes  (src/scenes/)                                        │
│  orchestrate layout, listen to EventBus, delegate to systems  │
└────────────────────────┬─────────────────────────────────────┘
                         │ emit/listen
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  EventBus  (src/utils/eventBus.ts)                            │
│  typed singleton — GameEvent const enum                       │
└────────────────────────┬─────────────────────────────────────┘
                         │
            ┌────────────┴────────────┐
            ▼                         ▼
┌───────────────────┐     ┌───────────────────────────────────┐
│  Systems          │     │  Entities / Views                  │
│  PassiveSystem    │     │  BoardView, HudView, RopeBar        │
│  AbilitySystem    │     │  FruitSprite                        │
│  HintSystem       │     │  (Phaser display objects)           │
└────────┬──────────┘     └───────────────────────────────────┘
         │ calls
         ▼
┌──────────────────────────────────────────────────────────────┐
│  game-logic  (src/game-logic/)    ← NO Phaser imports        │
│  BoardManager, MatchFinder, ModifierResolver,                 │
│  ScoreCalculator, TurnManager, BotAI                          │
└────────────────────────┬─────────────────────────────────────┘
                         │ reads config, calls handlers
                         ▼
┌──────────────────────────────────────────────────────────────┐
│  config/*.json  +  src/handlers/                              │
│  JSON: fruits, characters, abilities, bot, game rules         │
│  Handlers: bombHandler, goldenAppleHandler, passive_01, …     │
└──────────────────────────────────────────────────────────────┘
```

---

## State Management

`GameState` (defined in `src/types/game.ts`) is the single source of truth.

- Owned by `GameScene` and passed by reference to all systems on construction.
- Systems mutate `GameState` and emit events on `eventBus`.
- Scenes/entities listen to events and re-render.
- `GameState` is never serialised mid-game; only scores and session data are persisted.

---

## Board Data Flow

```
Player tap / BotAI.chooseMoves()
    │
    ▼
BoardManager.validateSwap(move)   → invalid? reject
    │
    ▼
BoardManager.swap(board, move)    → new Board
    │
    ▼
MatchFinder.findMatches(board)    → MatchGroup[]
    │
    ▼
ModifierResolver.resolve(board, matches, state, callHandler)
    │ may destroy extra cells, trigger handlers, spawn modifiers
    ▼
ScoreCalculator.calculate(destroyed, state)  → delta score
    │
    ▼
state update (scores, ropeBar, passive stacks, actions)
    │
    ▼
eventBus.emit(GameEvent.BoardUpdated)
    │
    ▼
BoardView.refresh()  →  Tweens for fall + destruction animations
HudView.update()
```

---

## Scene Lifecycle

```
BootScene.preload()     ← loads all sprites via this.load.image()
BootScene.create()      → this.scene.start('MainMenu')

MainMenu → ModeSelect → CharacterSelect → AbilitySelect
AbilitySelect.create()  → this.scene.start('Game', GameSceneInitData)

GameScene.init(data)    ← receives { characterId, abilityIds, abilityLevel }
GameScene.create()      ← wires all systems and views
GameScene.shutdown()    ← cleanup
```

Scenes pass typed data via `scene.start(key, data)`.
`GameSceneInitData` is defined in `src/types/game.ts`.

---

## Handler Registry

Every modifier/passive/ability effect is a function registered in `src/config/loader.ts`:

```typescript
export const handlerRegistry: Record<string, HandlerFn> = {
  bombHandler,
  goldenAppleHandler,
  passive_01,
  ability_01,
  // …
}
```

JSON configs reference handlers by string:
```json
{ "passiveHandlerRef": "passive_01" }
```

Systems call `callHandler(ref, state, ctx)` which looks up and invokes the function.
This makes it trivial to add new effects without modifying existing systems.

---

## Bot AI Architecture

```
TurnManager detects opponent's turn
    │
    ▼
BotAI.chooseMoves(board, opponentPlayer, botConfig)
    │  pure function — reads BotConfig sliders from config/bot.json
    │  scores all valid moves, adds randomness noise, returns Move[]
    ▼
TurnManager.executeBotMove(move)
    │  1. Animate finger sprite sliding to 'from' cell
    │  2. Animate finger sliding to 'to' cell
    │  3. Execute swap (same path as human move)
    │  4. Wait for destruction/fall animations
    │  5. Next action or end turn
```

BotConfig sliders (all 0–1, see `config/bot.json`):
- `randomness` — noise injected into move scoring
- `passiveSeeking` — weight for passive fruit collection
- `abilityUsage` — probability of using an ability
- `scoreMaximizing` — preference for high fruit-count moves
- `modifierAwareness` — intentional modifier combo triggering

---

## Playgama Bridge Isolation

```
ALL game code
    │ calls only
    ▼
PlaygamaBridge.ts  (src/bridge/)
    │ wraps
    ▼
global `bridge` object  (loaded from CDN in index.html)
```

If `bridge` is `undefined` (local dev, unsupported platform):
all `PlaygamaBridge.*` methods return sensible defaults or no-op silently.

---

## Persistence Schema

Managed by `src/utils/storage.ts`. Stored under key `origami_duel`.

```typescript
interface SaveData {
  version: 1,
  leaderboard: [{ name, score, date }],
  settings: { musicVolume, sfxVolume, language },
  lastSession: { characterId, abilityIds }
}
```

On version mismatch → reset to defaults.
Storage backend: `bridge.storage` (platform-native) with `localStorage` fallback.

---

## Asset Pipeline

1. `scripts/gen-placeholders.mjs` generates PNG placeholders into `public/sprites/`
2. `BootScene.preload()` loads each file via `this.load.image(spriteKey, path)`
3. Sprite keys in Phaser registry match `spriteKey` fields in JSON configs exactly
4. Real art replaces placeholder files — no code changes required
