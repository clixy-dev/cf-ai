import { APIProvider } from '../core/api-provider';
import { ProviderType } from '../factories/provider-factory';
import { WhatsAppMessageFactory } from '../factories/whatsapp-message-factory';
import { MessageContentFactory, OrderNotificationParams } from '../core/types';
import { LineMessageFactory } from '../factories/line-message-factory';
import { TelegramMessageFactory } from '../factories/telegram-message-factory';

export class MessageService {
  private static instance: MessageService;
  private messageFactories: Record<ProviderType, MessageContentFactory>;
  private provider: APIProvider;

  private constructor() {
    this.messageFactories = {
      whatsapp: new WhatsAppMessageFactory(),
      line: new LineMessageFactory(),
      kakao: new WhatsAppMessageFactory(),
      telegram: new TelegramMessageFactory()
    };
    this.provider = new APIProvider();
  }

  static getInstance(): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService();
    }
    return MessageService.instance;
  }

  async sendOrderNotification(
    phoneNumber: string,
    params: OrderNotificationParams,
    providerType: ProviderType = 'whatsapp'
  ) {
    try {
      const factory = this.messageFactories[providerType];
      const content = factory.createOrderNotification(params);
      
      return await this.provider.sendMessage(phoneNumber, content, {
        templateData: providerType === 'telegram' ? undefined : {
          name: content.metadata?.templateName || '',
          language: { code: 'en_US' }
        }
      });
    } catch (error) {
      console.error(`Failed to send ${providerType} order notification:`, error);
      throw error;
    }
  }
} 