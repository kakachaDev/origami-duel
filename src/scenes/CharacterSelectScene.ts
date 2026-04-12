import Phaser from 'phaser'
import { charactersConfig } from '@/config/loader'

export class CharacterSelectScene extends Phaser.Scene {
  private selectedId: string | null = null

  constructor() {
    super({ key: 'CharacterSelect' })
  }

  create(): void {
    const { width, height } = this.scale
    const chars = charactersConfig.characters

    this.add.text(width / 2, 60, 'Choose Your Bird', {
      font: 'bold 56px sans-serif', color: '#ffffff',
    }).setOrigin(0.5)

    const cards: Phaser.GameObjects.Rectangle[] = []

    chars.forEach((char, i) => {
      const col = i % 4
      const row = Math.floor(i / 4)
      const x = width * 0.12 + col * (width * 0.25)
      const y = 220 + row * 340

      const card = this.add.rectangle(x, y, width * 0.22, 300, 0x1a1a3e)
        .setInteractive({ useHandCursor: true })
      cards.push(card)

      this.add.image(x, y - 80, char.spriteKey).setDisplaySize(100, 100).setOrigin(0.5)
      this.add.text(x, y + 20, char.displayName, {
        font: 'bold 28px sans-serif', color: '#ffffff',
        wordWrap: { width: width * 0.2 },
      }).setOrigin(0.5)
      this.add.text(x, y + 80, `${char.gemId} ×${char.passiveStackRequired}`, {
        font: '24px sans-serif', color: '#aaaacc',
      }).setOrigin(0.5)

      card.on('pointerdown', () => {
        this.selectedId = char.id
        cards.forEach((c, ci) => c.setFillStyle(ci === i ? 0x2a4a8e : 0x1a1a3e))
        confirmBtn.setVisible(true)
      })
    })

    const confirmBtn = this.add.text(width / 2, height - 100, 'Confirm →', {
      font: 'bold 48px sans-serif',
      color: '#ffd700',
      backgroundColor: '#2a2a5e',
      padding: { x: 40, y: 16 },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setVisible(false)

    confirmBtn.on('pointerdown', () => {
      if (this.selectedId) {
        this.scene.start('AbilitySelect', { characterId: this.selectedId })
      }
    })

    this.add.text(100, height - 80, '← Back', {
      font: 'bold 36px sans-serif', color: '#aaaacc',
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('ModeSelect'))
  }

  shutdown(): void {
    this.selectedId = null
  }
}
