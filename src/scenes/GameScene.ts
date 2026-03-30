import Phaser from 'phaser'
import type { GameSceneInitData } from '@/types/game'

/**
 * GameScene
 * Main gameplay scene. Receives init data from AbilitySelectScene.
 *
 * This is a STUB — full implementation wires BoardManager, BoardView,
 * HudView, TurnManager, PassiveSystem, AbilitySystem, HintSystem, BotAI.
 */
export class GameScene extends Phaser.Scene {
  private initData: GameSceneInitData | null = null

  constructor() {
    super({ key: 'Game' })
  }

  init(data: GameSceneInitData): void {
    this.initData = data
  }

  create(): void {
    const { width, height } = this.scale
    const d = this.initData

    // ── Stub placeholder ─────────────────────────────────────────────────
    this.add.rectangle(0, 0, width, height, 0x0d0d1a).setOrigin(0)

    this.add.text(width / 2, height * 0.1, 'ORIGAMI DUEL', {
      font: 'bold 64px sans-serif', color: '#ffd700',
    }).setOrigin(0.5)

    if (d) {
      this.add.text(width / 2, height * 0.18, `Character: ${d.characterId}`, {
        font: '36px sans-serif', color: '#aaaacc',
      }).setOrigin(0.5)
      this.add.text(width / 2, height * 0.23, `Abilities: ${d.abilityIds.join(', ')}  [${d.abilityLevel}]`, {
        font: '32px sans-serif', color: '#aaaacc',
      }).setOrigin(0.5)
    }

    this.add.text(width / 2, height * 0.5, '[ Game Board — WIP ]', {
      font: '40px sans-serif', color: '#444466',
    }).setOrigin(0.5)

    this.add.text(width / 2, height * 0.92, 'Tap to return to menu', {
      font: '32px sans-serif', color: '#555577',
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('MainMenu'))
  }

  shutdown(): void {
    this.initData = null
  }
}
