import Phaser from 'phaser'
import { abilitiesConfig } from '@/config/loader'
import type { GameSceneInitData } from '@/types/game'

interface InitData {
  characterId: string
}

export class AbilitySelectScene extends Phaser.Scene {
  private selectedIds: Set<string> = new Set()
  private characterId = ''

  constructor() {
    super({ key: 'AbilitySelect' })
  }

  init(data: InitData): void {
    this.characterId = data.characterId
    this.selectedIds.clear()
  }

  create(): void {
    const { width, height } = this.scale
    const abilities = abilitiesConfig.abilities

    this.add.text(width / 2, 60, 'Choose 2 Abilities', {
      font: 'bold 56px sans-serif', color: '#ffffff',
    }).setOrigin(0.5)

    const cards: Phaser.GameObjects.Rectangle[] = []

    const confirmBtn = this.add.text(width / 2, height - 100, 'Start Game →', {
      font: 'bold 48px sans-serif',
      color: '#ffd700',
      backgroundColor: '#2a2a5e',
      padding: { x: 40, y: 16 },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setVisible(false)

    const updateConfirm = () => {
      confirmBtn.setVisible(this.selectedIds.size === 2)
    }

    abilities.forEach((ab, i) => {
      const col = i % 4
      const row = Math.floor(i / 4)
      const x = width * 0.12 + col * (width * 0.25)
      const y = 220 + row * 300

      const card = this.add.rectangle(x, y, width * 0.22, 270, 0x1a1a3e)
        .setInteractive({ useHandCursor: true })
      cards.push(card)

      this.add.image(x, y - 80, ab.spriteKey).setDisplaySize(64, 64).setOrigin(0.5)
      this.add.text(x, y + 10, ab.displayName, {
        font: 'bold 26px sans-serif', color: '#ffffff',
        wordWrap: { width: width * 0.2 },
      }).setOrigin(0.5)

      card.on('pointerdown', () => {
        if (this.selectedIds.has(ab.id)) {
          this.selectedIds.delete(ab.id)
          card.setFillStyle(0x1a1a3e)
        } else if (this.selectedIds.size < 2) {
          this.selectedIds.add(ab.id)
          card.setFillStyle(0x2a4a8e)
        }
        updateConfirm()
      })
    })

    confirmBtn.on('pointerdown', () => {
      if (this.selectedIds.size === 2) {
        const [id1, id2] = [...this.selectedIds] as [string, string]
        const initData: GameSceneInitData = {
          characterId: this.characterId,
          abilityIds: [id1, id2],
          abilityLevel: 'L3',
        }
        this.scene.start('Game', initData)
      }
    })

    this.add.text(100, height - 80, '← Back', {
      font: 'bold 36px sans-serif', color: '#aaaacc',
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('CharacterSelect', { characterId: this.characterId }))
  }

  shutdown(): void {
    this.selectedIds.clear()
    this.characterId = ''
  }
}
