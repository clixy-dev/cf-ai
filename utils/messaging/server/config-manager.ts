import { MessagingConfig } from '../core/types';

export class ConfigManager {
  private static instance: ConfigManager;
  private config: MessagingConfig;

  private constructor() {
    // Only used on server
    this.config = {
      whatsapp: {
        systemUserToken: process.env.WHATSAPP_SYSTEM_USER_TOKEN || '',
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
        appId: process.env.FACEBOOK_APP_ID || '',
        appSecret: process.env.FACEBOOK_APP_SECRET || ''
      },
      line: {
        channelAccessToken: '',
        channelSecret: ''
      },
      kakao: {},
      telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || '',
        defaultChatId: process.env.TELEGRAM_DEFAULT_CHAT_ID
      }
    };
  }

  static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  getConfig(): MessagingConfig {
    return this.config;
  }

  getProviderConfig<T extends keyof MessagingConfig>(provider: T): MessagingConfig[T] {
    return this.config[provider];
  }

  validateConfig(): boolean {
    const { whatsapp, telegram } = this.config;
    return !!(
      (whatsapp.systemUserToken && whatsapp.phoneNumberId) ||
      telegram.botToken
    );
  }
} 