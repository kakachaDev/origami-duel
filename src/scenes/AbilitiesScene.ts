import Phaser from 'phaser'
import { abilitiesConfig } from '@/config/loader'

export class AbilitiesScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Abilities' })
  }

  create(): void {
    const { width, height } = this.scale

    this.add.text(width / 2, 60, 'Abilities', {
      font: 'bold 60px sans-serif', color: '#ffffff',
    }).setOrigin(0.5)

    const abilities = abilitiesConfig.abilities
    abilities.forEach((ab, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const x = width * 0.25 + col * width * 0.5
      const y = 200 + row * 240

      this.add.rectangle(x, y, 400, 210, 0x1a1a3e).setOrigin(0.5)
      this.add.image(x - 140, y, ab.spriteKey).setDisplaySize(64, 64).setOrigin(0.5)
      this.add.text(x, y - 65, ab.displayName, {
        font: 'bold 30px sans-serif', color: '#ffd700',
      }).setOrigin(0.5)
      this.add.text(x, y, ab.description, {
        font: '20px sans-serif', color: '#cccccc',
        wordWrap: { width: 360 },
      }).setOrigin(0.5)
    })

    this.add.text(100, height - 80, '← Back', {
      font: 'bold 40px sans-serif', color: '#ffffff',
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('MainMenu'))
  }
}
