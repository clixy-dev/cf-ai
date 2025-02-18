import { MessageProvider } from '../core/types';
import { WhatsAppProvider, WhatsAppConfig } from '../providers/whatsapp-provider';
import { LineProvider, LineConfig } from '../providers/line-provider';
import { TelegramProvider, TelegramConfig } from '../providers/telegram-provider';

export type ProviderType = 'whatsapp' | 'line' | 'kakao' | 'telegram';

export class MessageProviderFactory {
  static createProvider(type: ProviderType, config: Record<string, any>): MessageProvider {
    switch (type) {
      case 'whatsapp':
        const whatsappConfig = config as WhatsAppConfig;
        return new WhatsAppProvider(whatsappConfig);
        
      case 'line':
        const lineConfig = config as LineConfig;
        return new LineProvider(lineConfig);

      case 'telegram':
        const telegramConfig = config as TelegramConfig;
        return new TelegramProvider(telegramConfig);

      default:
        throw new Error(`Unsupported provider type: ${type}`);
    }
  }
} 