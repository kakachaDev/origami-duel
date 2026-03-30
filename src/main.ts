import Phaser from 'phaser'
import { PlaygamaBridge } from '@/bridge/PlaygamaBridge'

import { BootScene }            from '@/scenes/BootScene'
import { MainMenuScene }        from '@/scenes/MainMenuScene'
import { CharactersScene }      from '@/scenes/CharactersScene'
import { AbilitiesScene }       from '@/scenes/AbilitiesScene'
import { LeaderboardScene }     from '@/scenes/LeaderboardScene'
import { ModeSelectScene }      from '@/scenes/ModeSelectScene'
import { CharacterSelectScene } from '@/scenes/CharacterSelectScene'
import { AbilitySelectScene }   from '@/scenes/AbilitySelectScene'
import { GameScene }            from '@/scenes/GameScene'

import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/config/constants'

async function bootstrap(): Promise<void> {
  // Initialize Playgama Bridge before the game starts.
  // Safe to call even when the bridge script is not loaded (local dev).
  await PlaygamaBridge.init()

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT,
    backgroundColor: '#0d0d1a',
    parent: 'game',
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [
      BootScene,
      MainMenuScene,
      CharactersScene,
      AbilitiesScene,
      LeaderboardScene,
      ModeSelectScene,
      CharacterSelectScene,
      AbilitySelectScene,
      GameScene,
    ],
  }

  new Phaser.Game(config)
}

bootstrap().catch(err => {
  console.error('Failed to bootstrap Origami Duel:', err)
})
