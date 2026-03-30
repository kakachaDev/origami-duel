import Phaser from 'phaser'

export class ModeSelectScene extends Phaser.Scene {
  constructor() {
    super({ key: 'ModeSelect' })
  }

  create(): void {
    const { width, height } = this.scale

    this.add.text(width / 2, height * 0.12, 'Select Mode', {
      font: 'bold 64px sans-serif', color: '#ffffff',
    }).setOrigin(0.5)

    // Currently the only mode
    const duelBtn = this.add.text(width / 2, height * 0.42, 'Duel vs Bot', {
      font: 'bold 56px sans-serif',
      color: '#ffffff',
      backgroundColor: '#2a2a5e',
      padding: { x: 48, y: 20 },
    })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })

    duelBtn.on('pointerover',  () => duelBtn.setStyle({ color: '#ffd700' }))
    duelBtn.on('pointerout',   () => duelBtn.setStyle({ color: '#ffffff' }))
    duelBtn.on('pointerdown',  () => this.scene.start('CharacterSelect'))

    // Future modes placeholder
    this.add.text(width / 2, height * 0.58, 'More modes coming soon…', {
      font: '32px sans-serif', color: '#555577',
    }).setOrigin(0.5)

    this.add.text(100, height - 80, '← Back', {
      font: 'bold 40px sans-serif', color: '#ffffff',
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('MainMenu'))
  }
}
