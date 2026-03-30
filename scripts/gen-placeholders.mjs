/**
 * gen-placeholders.mjs
 * Generates placeholder PNG sprites for development.
 * Run: node scripts/gen-placeholders.mjs
 * Requires: canvas package (devDependency)
 */

import { createCanvas } from 'canvas'
import { writeFile, mkdir } from 'fs/promises'
import { dirname } from 'path'

// ─── Sprite manifest ─────────────────────────────────────────────────────────

const FRUITS = [
  { id: 'kiwi',        color: '#5D9C3B', label: 'KW' },
  { id: 'peach',       color: '#FFAB76', label: 'PC' },
  { id: 'banana',      color: '#FFE135', label: 'BN' },
  { id: 'strawberry',  color: '#E8334A', label: 'SB' },
  { id: 'blueberry',   color: '#5856D6', label: 'BB' },
]

const MODIFIERS = [
  { id: 'bomb_h',       color: '#FF6B00', label: '→←', shape: 'arrow_h' },
  { id: 'bomb_v',       color: '#FF6B00', label: '↑↓', shape: 'arrow_v' },
  { id: 'golden_apple', color: '#FFD700', label: '★',  shape: 'star' },
  { id: 'ice',          color: '#B3E5FC', label: '❄',  shape: 'diamond' },
]

const CHARACTERS = Array.from({ length: 8 }, (_, i) => ({
  id: `bird_0${i + 1}`,
  color: ['#4CAF50','#5856D6','#FF6B00','#FFE135','#E8334A','#00BCD4','#9C27B0','#FF9800'][i] ?? '#888',
  label: `B${i + 1}`,
}))

const ABILITIES = Array.from({ length: 8 }, (_, i) => ({
  id: `ability_icon_0${i + 1}`,
  color: ['#9C27B0','#FF9800','#00BCD4','#E8334A','#5D9C3B','#FF6B00','#5856D6','#FFD700'][i] ?? '#888',
  label: `A${i + 1}`,
}))

// ─── Drawing helpers ─────────────────────────────────────────────────────────

function drawCircle(ctx, x, y, r, color, outlineColor) {
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  if (outlineColor) {
    ctx.strokeStyle = outlineColor
    ctx.lineWidth = 4
    ctx.stroke()
  }
}

function drawRoundRect(ctx, x, y, w, h, r, color, label) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
  ctx.fillStyle = color
  ctx.fill()
  if (label) {
    ctx.fillStyle = '#fff'
    ctx.font = `bold ${Math.floor(h * 0.35)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, x + w / 2, y + h / 2)
  }
}

function drawStar(ctx, cx, cy, r, color) {
  const points = 5
  const inner = r * 0.4
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const rad = (i * Math.PI) / points - Math.PI / 2
    const len = i % 2 === 0 ? r : inner
    const x = cx + Math.cos(rad) * len
    const y = cy + Math.sin(rad) * len
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = '#B8860B'
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawDiamond(ctx, cx, cy, r, color) {
  ctx.beginPath()
  ctx.moveTo(cx, cy - r)
  ctx.lineTo(cx + r * 0.7, cy)
  ctx.lineTo(cx, cy + r)
  ctx.lineTo(cx - r * 0.7, cy)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
  ctx.strokeStyle = '#90CAF9'
  ctx.lineWidth = 2
  ctx.stroke()
}

function drawArrow(ctx, cx, cy, size, horizontal) {
  ctx.fillStyle = '#FF6B00'
  const headSize = size * 0.22
  if (horizontal) {
    // left head
    ctx.beginPath()
    ctx.moveTo(cx - size * 0.45, cy)
    ctx.lineTo(cx - size * 0.45 + headSize, cy - headSize)
    ctx.lineTo(cx - size * 0.45 + headSize, cy + headSize)
    ctx.closePath()
    ctx.fill()
    // right head
    ctx.beginPath()
    ctx.moveTo(cx + size * 0.45, cy)
    ctx.lineTo(cx + size * 0.45 - headSize, cy - headSize)
    ctx.lineTo(cx + size * 0.45 - headSize, cy + headSize)
    ctx.closePath()
    ctx.fill()
  } else {
    ctx.beginPath()
    ctx.moveTo(cx, cy - size * 0.45)
    ctx.lineTo(cx - headSize, cy - size * 0.45 + headSize)
    ctx.lineTo(cx + headSize, cy - size * 0.45 + headSize)
    ctx.closePath()
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx, cy + size * 0.45)
    ctx.lineTo(cx - headSize, cy + size * 0.45 - headSize)
    ctx.lineTo(cx + headSize, cy + size * 0.45 - headSize)
    ctx.closePath()
    ctx.fill()
  }
}

// ─── Save helper ─────────────────────────────────────────────────────────────

async function save(filePath, canvas) {
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, canvas.toBuffer('image/png'))
  console.log(`  ✓ ${filePath}`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('Generating placeholder sprites...\n')

  // Fruits — 64x64 circles
  for (const fruit of FRUITS) {
    const S = 64

    // Normal
    const c1 = createCanvas(S, S)
    const ctx1 = c1.getContext('2d')
    drawCircle(ctx1, S / 2, S / 2, S / 2 - 4, fruit.color, null)
    ctx1.fillStyle = '#fff'
    ctx1.font = 'bold 18px sans-serif'
    ctx1.textAlign = 'center'
    ctx1.textBaseline = 'middle'
    ctx1.fillText(fruit.label, S / 2, S / 2)
    await save(`public/sprites/fruits/${fruit.id}.png`, c1)

    // Outlined (modifier indicator)
    const c2 = createCanvas(S, S)
    const ctx2 = c2.getContext('2d')
    drawCircle(ctx2, S / 2, S / 2, S / 2 - 5, fruit.color, '#ffffff')
    ctx2.fillStyle = '#fff'
    ctx2.font = 'bold 18px sans-serif'
    ctx2.textAlign = 'center'
    ctx2.textBaseline = 'middle'
    ctx2.fillText(fruit.label, S / 2, S / 2)
    await save(`public/sprites/fruits/${fruit.id}_outlined.png`, c2)
  }

  // Modifiers — 64x64
  for (const mod of MODIFIERS) {
    const S = 64
    const c = createCanvas(S, S)
    const ctx = c.getContext('2d')

    if (mod.shape === 'star') {
      drawStar(ctx, S / 2, S / 2, S / 2 - 4, mod.color)
    } else if (mod.shape === 'diamond') {
      drawDiamond(ctx, S / 2, S / 2, S / 2 - 4, mod.color)
    } else if (mod.shape === 'arrow_h') {
      drawArrow(ctx, S / 2, S / 2, S - 8, true)
    } else if (mod.shape === 'arrow_v') {
      drawArrow(ctx, S / 2, S / 2, S - 8, false)
    }

    await save(`public/sprites/modifiers/${mod.id}.png`, c)
  }

  // Characters — 128x128 rounded rects
  for (const char of CHARACTERS) {
    const S = 128
    const c = createCanvas(S, S)
    const ctx = c.getContext('2d')
    drawRoundRect(ctx, 8, 8, S - 16, S - 16, 16, char.color, char.label)
    await save(`public/sprites/characters/${char.id}.png`, c)
  }

  // Abilities — 64x64 rounded rects
  for (const ab of ABILITIES) {
    const S = 64
    const c = createCanvas(S, S)
    const ctx = c.getContext('2d')
    drawRoundRect(ctx, 4, 4, S - 8, S - 8, 10, ab.color, ab.label)
    await save(`public/sprites/abilities/${ab.id}.png`, c)
  }

  // UI sprites
  {
    // rope_bar_bg — 300x32
    const c = createCanvas(300, 32)
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#2a2a3e'
    ctx.beginPath()
    ctx.roundRect(0, 0, 300, 32, 6)
    ctx.fill()
    ctx.strokeStyle = '#555'
    ctx.lineWidth = 2
    ctx.stroke()
    // center mark
    ctx.strokeStyle = '#aaa'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(150, 4)
    ctx.lineTo(150, 28)
    ctx.stroke()
    await save('public/sprites/ui/rope_bar_bg.png', c)
  }
  {
    // rope_bar_marker — 24x24
    const c = createCanvas(24, 24)
    const ctx = c.getContext('2d')
    drawCircle(ctx, 12, 12, 10, '#ffffff', null)
    ctx.fillStyle = '#1a1a2e'
    drawCircle(ctx, 12, 12, 5, '#1a1a2e', null)
    await save('public/sprites/ui/rope_bar_marker.png', c)
  }
  {
    // finger_cursor — 48x48
    const c = createCanvas(48, 48)
    const ctx = c.getContext('2d')
    // simplified finger shape
    ctx.fillStyle = '#FFF9C4'
    ctx.strokeStyle = '#888'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(16, 8, 16, 32, 8)
    ctx.fill()
    ctx.stroke()
    // fingernail
    ctx.fillStyle = '#ffccbc'
    ctx.beginPath()
    ctx.ellipse(24, 12, 6, 4, 0, 0, Math.PI * 2)
    ctx.fill()
    await save('public/sprites/ui/finger_cursor.png', c)
  }
  {
    // hud_bg — 1080x192 (10% of 1920)
    const c = createCanvas(1080, 192)
    const ctx = c.getContext('2d')
    ctx.fillStyle = '#12122a'
    ctx.fillRect(0, 0, 1080, 192)
    ctx.strokeStyle = '#2a2a4e'
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, 1080, 192)
    await save('public/sprites/ui/hud_bg.png', c)
  }
  {
    // btn_primary — 256x72
    const c = createCanvas(256, 72)
    const ctx = c.getContext('2d')
    drawRoundRect(ctx, 4, 4, 248, 64, 12, '#4CAF50', null)
    await save('public/sprites/ui/btn_primary.png', c)
  }
  {
    // btn_active (selected state) — 256x72
    const c = createCanvas(256, 72)
    const ctx = c.getContext('2d')
    drawRoundRect(ctx, 4, 4, 248, 64, 12, '#FFD700', null)
    ctx.strokeStyle = '#FF8C00'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.roundRect(4, 4, 248, 64, 12)
    ctx.stroke()
    await save('public/sprites/ui/btn_active.png', c)
  }

  console.log('\nDone! All placeholder sprites generated.')
}

main().catch(err => {
  console.error('Error generating sprites:', err)
  process.exit(1)
})
