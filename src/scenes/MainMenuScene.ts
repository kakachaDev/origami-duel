import Phaser from 'phaser'

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' })
  }

  create(): void {
    const { width, height } = this.scale

    this.add.text(width / 2, height * 0.15, 'ORIGAMI DUEL', {
      font: 'bold 72px sans-serif',
      color: '#ffffff',
    }).setOrigin(0.5)

    this.add.text(width / 2, height * 0.22, 'Match-3 Duel', {
      font: '32px sans-serif',
      color: '#aaaacc',
    }).setOrigin(0.5)

    const buttons = [
      { label: 'Play',        scene: 'ModeSelect' },
      { label: 'Characters',  scene: 'Characters' },
      { label: 'Abilities',   scene: 'Abilities' },
      { label: 'Leaderboard', scene: 'Leaderboard' },
    ]

    buttons.forEach((btn, i) => {
      const y = height * 0.38 + i * 120
      const text = this.add.text(width / 2, y, btn.label, {
        font: 'bold 48px sans-serif',
        color: '#ffffff',
        backgroundColor: '#2a2a5e',
        padding: { x: 40, y: 16 },
      })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })

      text.on('pointerover',  () => text.setStyle({ color: '#ffd700' }))
      text.on('pointerout',   () => text.setStyle({ color: '#ffffff' }))
      text.on('pointerdown',  () => this.scene.start(btn.scene))
    })
  }
}
