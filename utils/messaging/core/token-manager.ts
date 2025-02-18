interface TokenCache {
  token: string;
  expiresAt: number;
}

export class TokenManager {
  private static instance: TokenManager;
  private tokenCache: Record<string, TokenCache> = {};
  private readonly TOKEN_BUFFER = 300000; // 5 minutes buffer before expiry

  private constructor() {}

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async getToken(provider: string, config: Record<string, any>): Promise<string> {
    const cachedToken = this.tokenCache[provider];
    const now = Date.now();

    if (cachedToken && cachedToken.expiresAt > now + this.TOKEN_BUFFER) {
      return cachedToken.token;
    }

    switch (provider) {
      case 'whatsapp':
        if (!config.systemUserToken) {
          throw new Error('No WhatsApp system user token available');
        }
        
        this.tokenCache['whatsapp'] = {
          token: config.systemUserToken,
          expiresAt: now + (60 * 24 * 60 * 60 * 1000)
        };
        
        return config.systemUserToken;

      case 'line':
        return config.channelAccessToken;
        
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  clearToken(provider: string): void {
    delete this.tokenCache[provider];
  }
} 