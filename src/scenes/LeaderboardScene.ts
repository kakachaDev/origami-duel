import Phaser from 'phaser'
import { getTopScores } from '@/utils/storage'
import { PlaygamaBridge } from '@/bridge/PlaygamaBridge'
import { LEADERBOARD_ID } from '@/config/constants'

export class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Leaderboard' })
  }

  async create(): Promise<void> {
    const { width, height } = this.scale

    this.add.text(width / 2, 60, 'Leaderboard', {
      font: 'bold 60px sans-serif', color: '#ffffff',
    }).setOrigin(0.5)

    // Try platform leaderboard first, fall back to local
    let entries: Array<{ name: string; score: number; rank?: number }> = []

    try {
      const platformEntries = await PlaygamaBridge.getLeaderboard(LEADERBOARD_ID)
      if (platformEntries.length > 0) {
        entries = platformEntries
      } else {
        const local = await getTopScores(10)
        entries = local.map((e, i) => ({ ...e, rank: i + 1 }))
      }
    } catch {
      const local = await getTopScores(10)
      entries = local.map((e, i) => ({ ...e, rank: i + 1 }))
    }

    entries.forEach((entry, i) => {
      const y = 160 + i * 80
      const rank = (entry as { rank?: number }).rank ?? i + 1
      this.add.text(width / 2, y, `${rank}. ${entry.name}   ${entry.score}`, {
        font: '36px sans-serif',
        color: i === 0 ? '#ffd700' : '#ffffff',
      }).setOrigin(0.5)
    })

    if (entries.length === 0) {
      this.add.text(width / 2, height / 2, 'No scores yet!', {
        font: '40px sans-serif', color: '#aaaacc',
      }).setOrigin(0.5)
    }

    this.add.text(100, height - 80, '← Back', {
      font: 'bold 40px sans-serif', color: '#ffffff',
    })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('MainMenu'))
  }
}
