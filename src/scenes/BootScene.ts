import Phaser from 'phaser'

/**
 * BootScene
 * First scene to run. Loads all assets (sprites, audio) then transitions to MainMenu.
 * Config JSONs are imported statically via Vite (no runtime loading needed).
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' })
  }

  preload(): void {
    // Show a simple loading bar
    const { width, height } = this.scale
    const barBg = this.add.rectangle(width / 2, height / 2, 400, 20, 0x222244)
    const bar   = this.add.rectangle(width / 2 - 200, height / 2, 0, 16, 0x4caf50).setOrigin(0, 0.5)
    const label = this.add.text(width / 2, height / 2 - 30, 'Loading…', {
      font: '28px sans-serif', color: '#ffffff',
    }).setOrigin(0.5)

    this.load.on('progress', (value: number) => {
      bar.width = 400 * value
    })

    // Suppress unused var warnings
    void barBg; void label

    // ── Gems (base) ───────────────────────────────────────────────────────
    this.load.image('gem_red',    'assets/gems/Red_base.png')
    this.load.image('gem_green',  'assets/gems/Green_base.png')
    this.load.image('gem_pink',   'assets/gems/Pink_base.png')
    this.load.image('gem_blue',   'assets/gems/Blue_base.png')
    this.load.image('gem_banana', 'assets/gems/Banana_base.png')

    // ── Gems (pre-combined with bomb, for alternate rendering) ────────────
    this.load.image('gem_red_bomb',    'assets/gems/Red_bomb.png')
    this.load.image('gem_green_bomb',  'assets/gems/Green_bomb.png')
    this.load.image('gem_pink_bomb',   'assets/gems/Pink_bomb.png')
    this.load.image('gem_blue_bomb',   'assets/gems/Blue_bomb.png')
    this.load.image('gem_banana_bomb', 'assets/gems/Banana_bomb.png')

    // ── Bomb overlays (drawn on top of base gem) ──────────────────────────
    this.load.image('overlay_bomb_h', 'assets/gems/Bomb_LeftRight.png')
    this.load.image('overlay_bomb_v', 'assets/gems/Bomb_UpDown.png')

    // ── Special gem ───────────────────────────────────────────────────────
    // Applebomb: destroys all gems matching the color it is swapped with
    this.load.image('gem_applebomb', 'assets/gems/Applebomb_base.png')

    // ── Abilities ─────────────────────────────────────────────────────────
    for (let i = 1; i <= 8; i++) {
      const key = `ability_icon_0${i}`
      this.load.image(key, `assets/abilities/${key}.png`)
    }

    // ── Background ────────────────────────────────────────────────────────
    this.load.image('bg_field', 'assets/background/field.png')
  }

  create(): void {
    this.scene.start('MainMenu')
  }
}
