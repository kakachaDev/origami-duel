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

    // ── Fruits ────────────────────────────────────────────────────────────
    this.load.image('fruit_kiwi',              'sprites/fruits/kiwi.png')
    this.load.image('fruit_kiwi_outlined',     'sprites/fruits/kiwi_outlined.png')
    this.load.image('fruit_peach',             'sprites/fruits/peach.png')
    this.load.image('fruit_peach_outlined',    'sprites/fruits/peach_outlined.png')
    this.load.image('fruit_banana',            'sprites/fruits/banana.png')
    this.load.image('fruit_banana_outlined',   'sprites/fruits/banana_outlined.png')
    this.load.image('fruit_strawberry',        'sprites/fruits/strawberry.png')
    this.load.image('fruit_strawberry_outlined','sprites/fruits/strawberry_outlined.png')
    this.load.image('fruit_blueberry',         'sprites/fruits/blueberry.png')
    this.load.image('fruit_blueberry_outlined','sprites/fruits/blueberry_outlined.png')

    // ── Modifiers ─────────────────────────────────────────────────────────
    this.load.image('modifier_bomb_h',       'sprites/modifiers/bomb_h.png')
    this.load.image('modifier_bomb_v',       'sprites/modifiers/bomb_v.png')
    this.load.image('modifier_golden_apple', 'sprites/modifiers/golden_apple.png')
    this.load.image('modifier_ice',          'sprites/modifiers/ice.png')

    // ── Characters ────────────────────────────────────────────────────────
    for (let i = 1; i <= 8; i++) {
      const key = `char_bird_0${i}`
      this.load.image(key, `sprites/characters/bird_0${i}.png`)
    }

    // ── Abilities ─────────────────────────────────────────────────────────
    for (let i = 1; i <= 8; i++) {
      this.load.image(`ability_icon_0${i}`, `sprites/abilities/ability_icon_0${i}.png`)
    }

    // ── UI ────────────────────────────────────────────────────────────────
    this.load.image('ui_rope_bar_bg',     'sprites/ui/rope_bar_bg.png')
    this.load.image('ui_rope_bar_marker', 'sprites/ui/rope_bar_marker.png')
    this.load.image('ui_finger_cursor',   'sprites/ui/finger_cursor.png')
    this.load.image('ui_hud_bg',          'sprites/ui/hud_bg.png')
    this.load.image('ui_btn_primary',     'sprites/ui/btn_primary.png')
    this.load.image('ui_btn_active',      'sprites/ui/btn_active.png')
  }

  create(): void {
    this.scene.start('MainMenu')
  }
}
