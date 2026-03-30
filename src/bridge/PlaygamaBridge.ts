/**
 * PlaygamaBridge.ts
 * Isolated wrapper for the Playgama Bridge SDK.
 *
 * Rules:
 * - ALL access to the global `bridge` object must go through this module.
 * - Every method is safe to call when bridge is undefined (local dev / unsupported platform).
 * - Other game code must NEVER import or reference `bridge` directly.
 *
 * SDK docs: https://wiki.playgama.com/playgama/sdk/
 */

import './playgama.d.ts'

let _ready = false

export const PlaygamaBridge = {
  get isAvailable(): boolean {
    return typeof bridge !== 'undefined'
  },

  get isReady(): boolean {
    return _ready
  },

  /** Call once before creating the Phaser game instance */
  async init(): Promise<void> {
    if (!PlaygamaBridge.isAvailable) return
    try {
      await bridge!.initialize()
      _ready = true
    } catch (err) {
      console.warn('[PlaygamaBridge] Initialization failed:', err)
    }
  },

  // ─── Platform ──────────────────────────────────────────────────────────────

  getPlatformId(): string {
    return bridge?.platform.id ?? 'unknown'
  },

  getLanguage(): string {
    return bridge?.platform.language ?? navigator.language.slice(0, 2)
  },

  getDeviceType(): string {
    return bridge?.device.type ?? 'desktop'
  },

  // ─── Player ────────────────────────────────────────────────────────────────

  getPlayerName(): string | null {
    return bridge?.player.name ?? null
  },

  getPlayerPhoto(): string | null {
    return bridge?.player.photos[0] ?? null
  },

  isAuthorized(): boolean {
    return bridge?.player.isAuthorized ?? false
  },

  async authorize(): Promise<boolean> {
    if (!PlaygamaBridge.isAvailable || !bridge!.player.isAuthorizationSupported) return false
    try {
      await bridge!.player.authorize()
      return true
    } catch {
      return false
    }
  },

  // ─── Storage ───────────────────────────────────────────────────────────────

  async saveData(key: string, value: unknown): Promise<void> {
    if (!PlaygamaBridge.isAvailable) {
      localStorage.setItem(key, JSON.stringify(value))
      return
    }
    try {
      await bridge!.storage.set(key, JSON.stringify(value))
    } catch {
      localStorage.setItem(key, JSON.stringify(value))
    }
  },

  async loadData(key: string): Promise<unknown | null> {
    if (!PlaygamaBridge.isAvailable) {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    }
    try {
      const raw = await bridge!.storage.get(key)
      return raw != null ? JSON.parse(String(raw)) : null
    } catch {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : null
    }
  },

  // ─── Leaderboard ───────────────────────────────────────────────────────────

  async submitScore(leaderboardId: string, score: number): Promise<void> {
    if (!PlaygamaBridge.isAvailable) return
    try {
      await bridge!.leaderboards.setScore(leaderboardId, score)
    } catch (err) {
      console.warn('[PlaygamaBridge] submitScore failed:', err)
    }
  },

  async getLeaderboard(leaderboardId: string): Promise<Array<{ id: string; name: string; photo: string; score: number; rank: number }>> {
    if (!PlaygamaBridge.isAvailable) return []
    try {
      return await bridge!.leaderboards.getEntries(leaderboardId)
    } catch {
      return []
    }
  },

  // ─── Ads ───────────────────────────────────────────────────────────────────

  async showInterstitial(): Promise<void> {
    if (!PlaygamaBridge.isAvailable) return
    try {
      await bridge!.advertisement.showInterstitial()
    } catch (err) {
      console.warn('[PlaygamaBridge] showInterstitial failed:', err)
    }
  },

  async showRewarded(): Promise<boolean> {
    if (!PlaygamaBridge.isAvailable) return false
    try {
      const result = await bridge!.advertisement.showRewarded()
      return result.success
    } catch {
      return false
    }
  },

  // ─── Social ────────────────────────────────────────────────────────────────

  async share(options: Record<string, unknown>): Promise<void> {
    if (!PlaygamaBridge.isAvailable || !bridge!.social.isShareSupported) return
    try {
      await bridge!.social.share(options)
    } catch (err) {
      console.warn('[PlaygamaBridge] share failed:', err)
    }
  },

  async inviteFriends(): Promise<void> {
    if (!PlaygamaBridge.isAvailable || !bridge!.social.isInviteFriendsSupported) return
    try {
      await bridge!.social.inviteFriends()
    } catch (err) {
      console.warn('[PlaygamaBridge] inviteFriends failed:', err)
    }
  },

  async joinCommunity(options: Record<string, unknown>): Promise<void> {
    if (!PlaygamaBridge.isAvailable || !bridge!.social.isJoinCommunitySupported) return
    try {
      await bridge!.social.joinCommunity(options)
    } catch (err) {
      console.warn('[PlaygamaBridge] joinCommunity failed:', err)
    }
  },

  async rate(): Promise<void> {
    if (!PlaygamaBridge.isAvailable) return
    try {
      await bridge!.social.rate()
    } catch { /* ignore */ }
  },

  // ─── Payments ──────────────────────────────────────────────────────────────

  async getCatalog() {
    if (!PlaygamaBridge.isAvailable || !bridge!.payments.isSupported) return []
    try {
      return await bridge!.payments.getCatalog()
    } catch {
      return []
    }
  },

  async purchase(productId: string): Promise<string | null> {
    if (!PlaygamaBridge.isAvailable || !bridge!.payments.isSupported) return null
    try {
      const result = await bridge!.payments.purchase(productId)
      return result.id
    } catch {
      return null
    }
  },

  async consumePurchase(productId: string): Promise<boolean> {
    if (!PlaygamaBridge.isAvailable || !bridge!.payments.isSupported) return false
    try {
      await bridge!.payments.consumePurchase(productId)
      return true
    } catch {
      return false
    }
  },
}
