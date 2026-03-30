# Origami Duel

A turn-based Match-3 duel game built with Phaser 3, TypeScript, and Vite.
Two players share one board and compete for the highest score over 4 rounds.

**Platform targets:** Yandex Games, VK Play (via Playgama Bridge SDK)

---

## Tech Stack

| Tool | Version |
|------|---------|
| Phaser | ^3.90.0 |
| TypeScript | ^6.0 |
| Vite | ^6.0 |
| pnpm | ^9+ |
| Playgama Bridge | v1 stable (CDN) |

---

## Prerequisites

- **Node.js** 22+
- **pnpm** 9+ (`npm install -g pnpm`)

---

## Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Generate placeholder sprites (run once; replace later with real art)
pnpm run gen-sprites

# 3. Start dev server (opens http://localhost:3000)
pnpm run dev
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Vite dev server with HMR |
| `pnpm build` | Type-check + production build → `dist/` |
| `pnpm preview` | Preview production build locally |
| `pnpm gen-sprites` | Regenerate placeholder PNGs in `public/sprites/` |
| `pnpm typecheck` | TypeScript check without emitting |

---

## Project Structure

```
src/          Game source code (TypeScript)
config/       JSON game data (fruits, characters, abilities, bot, game rules)
public/       Static assets (sprites served as-is, no bundling)
scripts/      Build-time scripts (placeholder sprite generator)
docs/         Documentation
.claude/      AI assistant configuration (CLAUDE.md)
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full technical overview
and [docs/GDD.md](docs/GDD.md) for the game design document.

---

## Playgama Bridge

The game integrates with Playgama Bridge for cross-platform support.

1. Download `playgama-bridge-config.json` from https://github.com/playgama/bridge/releases
2. Replace the placeholder `playgama-bridge-config.json` at the project root
3. Fill in your game ID, leaderboard IDs, and (optionally) payment products

The bridge is loaded via CDN in `index.html`. All bridge calls are isolated in
`src/bridge/PlaygamaBridge.ts` — the rest of the code never accesses `bridge` directly.

---

## Replacing Placeholder Sprites

All sprites live in `public/sprites/`. The generated placeholders are simple
colored shapes. Replace each file with your real artwork — filenames and
sprite keys must stay the same (see `config/fruits.json`, `config/characters.json`, etc.
for the `spriteKey` values).
