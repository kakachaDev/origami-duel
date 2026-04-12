import Phaser from 'phaser'
import { charactersConfig } from '@/config/loader'

export class CharactersScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Characters' })
  }

  create(): void {
    const { width, height } = this.scale

    this.add.text(width / 2, 60, 'Characters', {
      font: 'bold 60px sans-serif', color: '#ffffff',
    }).setOrigin(0.5)

    const chars = charactersConfig.characters
    chars.forEach((char, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const x = width * 0.25 + col * width * 0.5
      const y = 200 + row * 250

      // Character card
      this.add.rectangle(x, y, 400, 220, 0x1a1a3e).setOrigin(0.5)
      this.add.image(x - 140, y, char.spriteKey).setDisplaySize(80, 80).setOrigin(0.5)
      this.add.text(x, y - 70, char.displayName, {
        font: 'bold 32px sans-serif', color: '#ffd700',
      }).setOrigin(0.5)
      this.add.text(x, y - 20, `Gem: ${char.gemId}  |  Stack: ${char.passiveStackRequired}`, {
        font: '24px sans-serif', color: '#aaaacc',
      }).setOrigin(0.5)
      this.add.text(x, y + 30, char.passiveDescription, {
        font: '20px sans-serif', color: '#cccccc',
        wordWrap: { width: 360 },
      }).setOrigin(0.5)
    })

    // Back button
    this.add.text(100, height - 80, '← Back', {
      font: 'bold 40px sans-serif', color: '#ffffff',
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('MainMenu'))
  }
}
