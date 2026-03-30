# Game Design Document — Origami Duel

## 1. Overview

**Genre:** Match-3 Puzzle Duel
**Platform:** Mobile web (portrait-first), playable landscape
**Distribution:** Yandex Games, VK Play (via Playgama Bridge)
**Target resolution:** 1080 × 1920

---

## 2. Screen Layout

The screen is divided into three vertical zones:

```
┌─────────────────────────────────┐
│  TOP STUB (28% height)          │  ← Reserved for future content (invisible placeholder)
├─────────────────────────────────┤
│  HUD (12% height)               │  ← 3×3 info grid
├─────────────────────────────────┤
│  GAME BOARD (500×500px approx.) │  ← 7×7 match-3 grid, centred
│  (~50% of screen height)        │
└─────────────────────────────────┘
```

### HUD Grid (3×3)

```
| Player Score       | Rope Bar (tug-of-war) | Opponent Score       |
| Passive stack      | Actions: P - O        | Passive stack        |
| [Ability 1][Abil2] | Round: X/4            | [Ability 1][Abil 2]  |
```

**Rope Bar:** Ranges from -100 to +100.
`value = clamp(playerScore - opponentScore, -100, 100)`
Positive = player leading (marker moves right). Negative = opponent leading.

---

## 3. Fruits

| ID | Display Name | Color | Base Points |
|----|-------------|-------|------------|
| `kiwi` | Kiwi | #5D9C3B | 10 |
| `peach` | Peach | #FFAB76 | 10 |
| `banana` | Banana | #FFE135 | 10 |
| `strawberry` | Strawberry | #E8334A | 10 |
| `blueberry` | Blueberry | #5856D6 | 10 |

Each fruit cell is rendered as:
1. A fruit sprite (or outlined variant when a bomb modifier is present)
2. An optional modifier overlay on top

---

## 4. Modifiers

### 4.1 Horizontal Bomb (`bomb_h`)
- **Created by:** Matching exactly 4 fruits in a horizontal row
- **Visual:** Arrow overlay (←→) on the fruit
- **Effect on destruction:** Clears the entire row of the triggering cell
- **Combo:** Two bombs destroyed together (match-2 of both bomb fruits) produce a cross (+) clear

### 4.2 Vertical Bomb (`bomb_v`)
- **Created by:** Matching exactly 4 fruits in a vertical column
- **Visual:** Arrow overlay (↑↓) on the fruit
- **Effect on destruction:** Clears the entire column of the triggering cell
- **Combo:** Same cross behaviour when two bombs detonate together

### 4.3 Golden Apple (`golden_apple`)
- **Created by:** Matching 5+ fruits in a row, or in an L-shape, or in a +-shape
- **Visual:** Replaces the fruit cell entirely (golden star sprite)
- **Activation:** Cannot be destroyed by normal match or bomb. Must be activated by swapping an adjacent regular fruit with it (match-2).
- **Effect:** All fruits of the same type as the swapped fruit are destroyed
- **Modifier propagation:** If the activating fruit had a modifier, that modifier is applied to all matching fruits before they are destroyed

### 4.4 Ice (`ice`)
- **Created by:** Procedural board generation or level start (5% spawn chance per cell)
- **Visual:** Replaces the fruit cell (ice crystal sprite)
- **Gravity:** Ice does NOT fall. Fruits falling downward skip over ice cells and land below them.
- **Destruction:** Hit once by destroying an orthogonally adjacent fruit → transforms into a random regular fruit

---

## 5. Characters (Birds)

Players choose one of 8 bird characters before the game. Each bird:
- Has a designated fruit type (their "passive fruit")
- Triggers a passive ability after collecting N of their fruit

| # | ID | Name | Fruit | Stack | Passive Effect |
|---|----|------|-------|-------|----------------|
| 1 | bird_01 | Kiwi Keeper | kiwi | 5 | Destroys 3×3 area at board center. Does not destroy Golden Apples. |
| 2 | bird_02 | Berry Storm | blueberry | 7 | Spawns H or V Bomb on 2 random modifier-free fruits. |
| 3 | bird_03 | Peach Blossom | peach | 5 | TBD |
| 4 | bird_04 | Banana Peel | banana | 6 | TBD |
| 5 | bird_05 | Strawberry Wings | strawberry | 4 | TBD |
| 6 | bird_06 | Green Dart | kiwi | 6 | TBD |
| 7 | bird_07 | Night Owl | blueberry | 5 | TBD |
| 8 | bird_08 | Fuzzy Wren | peach | 7 | TBD |

**Passive stack fills** when the player destroys their passive fruit type.
**Passive triggers** when the stack is full; the stack resets to 0 after triggering.
Both players have independent stacks.

---

## 6. Active Abilities

Players choose 2 of 8 abilities before the game. Each ability has upgrade levels (L3/L4/L5) that increase uses or effect count.

| # | ID | Name | Effect | L3 Uses | L4 Uses | L5 Uses |
|---|----|------|--------|---------|---------|---------|
| 1 | ability_01 | Precise Strike | Destroy any chosen fruit (not GA or ice) | 3 | 4 | 5 |
| 2 | ability_02 | Golden Rain | Replace 2/3/3 random fruits with Golden Apples | 2 | 2 | 3 |
| 3 | ability_03 | Thunderclap | TBD | 1 | 2 | 3 |
| 4 | ability_04 | Frost Wave | TBD | 1 | 2 | 3 |
| 5 | ability_05 | Double Edge | TBD | 1 | 2 | 3 |
| 6 | ability_06 | Catalyst | TBD | 1 | 2 | 3 |
| 7 | ability_07 | Mirage | TBD | 1 | 2 | 3 |
| 8 | ability_08 | Avalanche | TBD | 1 | 2 | 3 |

**Active abilities do NOT consume a player action.**
Abilities have limited uses per game; remaining uses shown in HUD.

---

## 7. Game Mode: Duel

### Setup
1. Player selects a character
2. Player selects 2 abilities (level L3 by default)
3. Game starts — opponent is a bot

### Turns
- **4 rounds** total
- Each round: Player takes 2 actions → Opponent takes 2 actions
- **Bonus action:** If a player destroys more than 3 fruits in a single action, they gain 1 extra action
- **Opponent's turn:** The board is dimmed; a finger animation shows the bot's moves

### Scoring
- Each destroyed fruit = `basePoints` (10) × any applicable multiplier
- Bomb clear bonuses and combo multipliers applied per `config/game.json`
- Rope bar value = `clamp(playerScore - opponentScore, -100, 100)`
- **Win condition:** Player with more total score after round 4 wins

### Actions
- A player **action** = one swap of two adjacent fruits
- Passive abilities trigger automatically; do not cost actions
- Active abilities are used manually; do not cost actions

---

## 8. Animations

| Animation | Description |
|-----------|-------------|
| Fruit fall | After destruction, fruits above fall down. Column by column Tween cascade with small stagger delay per row. |
| Fruit destruction | Scale to 0 + brief particle burst |
| Passive fill | Per-fruit icon fills progressively as stack increases |
| Passive trigger | Radial wipe + flash when passive activates |
| Hint (idle) | After 2s of inactivity: target fruit and the fruit to swap it with gently scale and rotate in a looping animation |
| Bot finger | Finger sprite slides onto board → moves to target cell → swap executes |
| Board dim | Opponent's turn: board darkens with an overlay |

---

## 9. Bot AI

Configuration in `config/bot.json`. All sliders are 0–1 (or multipliers where noted).

| Field | Meaning |
|-------|---------|
| `randomness` | 0 = always optimal; 1 = fully random |
| `passiveSeeking` | How strongly the bot prioritises its passive fruit |
| `abilityUsage` | Probability of using an ability on any given action |
| `abilityTiming` | 0 = use immediately; 1 = wait for best moment |
| `fruitPreferenceWeight` | Score multiplier for passive fruit matches |
| `scoreMaximizing` | 0 = first valid move; 1 = highest-count move |
| `modifierAwareness` | Probability of intentionally triggering bomb/GA combos |

Preset difficulties: `easy`, `medium`, `hard`.

---

## 10. Scenes

| Key | Name | Purpose | Navigation |
|-----|------|---------|------------|
| Boot | Boot | Asset loading | → MainMenu |
| MainMenu | Main Menu | Hub | → ModeSelect / Characters / Abilities / Leaderboard |
| Characters | Characters | Read-only character viewer | ← MainMenu |
| Abilities | Abilities | Read-only ability viewer | ← MainMenu |
| Leaderboard | Leaderboard | Score table (local + platform) | ← MainMenu |
| ModeSelect | Mode Select | Currently: Duel only | → CharacterSelect |
| CharacterSelect | Character Select | Pick 1 of 8 birds | → AbilitySelect |
| AbilitySelect | Ability Select | Pick 2 of 8 abilities | → Game |
| Game | Game | The match | → MainMenu on exit |

---

## 11. Save Format

Key in storage: `origami_duel`

```json
{
  "version": 1,
  "leaderboard": [
    { "name": "Player", "score": 1200, "date": "2026-03-30" }
  ],
  "settings": {
    "musicVolume": 0.8,
    "sfxVolume": 0.8,
    "language": "en"
  },
  "lastSession": {
    "characterId": "bird_01",
    "abilityIds": ["ability_01", "ability_02"]
  }
}
```

Storage backend: Playgama `bridge.storage` (platform-native where available), falls back to `localStorage`.

---

## 12. Platform Notes

- **Yandex Games:** Uses `bridge.platform.id === 'yandex'`. Leaderboard via `bridge.leaderboards`.
- **VK Play:** Uses `bridge.platform.id === 'vk'`. Social features: share, invite friends, join community.
- **Local dev:** Bridge is undefined → all bridge calls silently no-op; localStorage used for persistence.
- **Ads:** Show interstitial between matches (not during gameplay).
