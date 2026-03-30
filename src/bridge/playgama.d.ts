/**
 * playgama.d.ts
 * Type declarations for the Playgama Bridge SDK global.
 * The SDK is loaded via a CDN <script> tag in index.html.
 * It exposes a global `bridge` object (NOT window.PlaygamaBridge).
 *
 * Only the methods used by this game are declared here.
 * Full API: https://wiki.playgama.com/playgama/sdk/
 */

declare const bridge:
  | {
      initialize(): Promise<void>

      platform: {
        id: string
        language: string
        tld: string | null
        payload: string | null
        isAudioEnabled: boolean
        sdk: unknown
      }

      device: {
        type: 'mobile' | 'tablet' | 'desktop' | 'tv'
      }

      player: {
        isAuthorizationSupported: boolean
        isAuthorized: boolean
        id: string | null
        name: string | null
        photos: string[]
        extra: Record<string, unknown> | null
        authorize(options?: Record<string, unknown>): Promise<void>
      }

      storage: {
        defaultType: 'local_storage' | 'platform_internal'
        isSupported(type: 'local_storage' | 'platform_internal'): boolean
        isAvailable(type: 'local_storage' | 'platform_internal'): boolean
        get(key: string | string[], storageType?: string): Promise<unknown>
        set(key: string | string[], value: unknown, storageType?: string): Promise<void>
        delete(key: string | string[], storageType?: string): Promise<void>
      }

      leaderboards: {
        type: 'in_game' | 'native'
        setScore(leaderboardId: string, score: number): Promise<void>
        getEntries(leaderboardId: string): Promise<
          Array<{ id: string; name: string; photo: string; score: number; rank: number }>
        >
      }

      advertisement: {
        isBannerSupported: boolean
        showBanner(options?: Record<string, unknown>): void
        hideBanner(): void
        isInterstitialReady: boolean
        showInterstitial(): Promise<void>
        isRewardedReady: boolean
        showRewarded(): Promise<{ success: boolean }>
      }

      social: {
        isShareSupported: boolean
        share(options: Record<string, unknown>): Promise<void>
        isInviteFriendsSupported: boolean
        inviteFriends(options?: Record<string, unknown>): Promise<void>
        isJoinCommunitySupported: boolean
        joinCommunity(options: Record<string, unknown>): Promise<void>
        isCreatePostSupported: boolean
        createPost(options: Record<string, unknown>): Promise<void>
        addToFavorites(): Promise<void>
        addToHomeScreen(): Promise<void>
        rate(): Promise<void>
        isExternalLinksAllowed: boolean
      }

      payments: {
        isSupported: boolean
        getCatalog(): Promise<
          Array<{ id: string; price: string; priceCurrencyCode: string; priceValue: number }>
        >
        getPurchases(): Promise<Array<{ id: string }>>
        purchase(productId: string): Promise<{ id: string }>
        consumePurchase(productId: string): Promise<{ id: string }>
      }
    }
  | undefined
