import { BaseMessageProvider } from '../core/base-provider';
import { MessageContent, MessageOptions, MessageResponse } from '../core/types';
import { TokenManager } from '../core/token-manager';

export interface WhatsAppConfig {
  systemUserToken: string;
  phoneNumberId: string;
  appId: string;
  appSecret: string;
  baseUrl?: string;
}

export class WhatsAppProvider extends BaseMessageProvider {
  private tokenManager: TokenManager;
  private baseUrl: string;

  constructor(config: WhatsAppConfig) {
    super(config);
    this.tokenManager = TokenManager.getInstance();
    this.baseUrl = config.baseUrl || 'https://graph.facebook.com/v21.0';
  }

  async sendMessage(
    to: string,
    content: MessageContent,
    options?: MessageOptions
  ): Promise<MessageResponse> {
    try {
      const validatedPhone = this.validatePhoneNumber(to);
      const payload = this.createPayload(validatedPhone, content, options);
      console.log('whatsapp provider sendMessage payload', JSON.stringify(payload, null, 2));
      return await this.makeRequest('/messages', payload);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private createPayload(to: string, content: MessageContent, options?: MessageOptions) {
    const base = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to
    };

    switch (content.type) {
      case 'text':
        return {
          ...base,
          type: 'text',
          text: {
            preview_url: options?.previewUrl,
            body: content.body
          }
        };

      case 'template':
        return {
          ...base,
          type: 'template',
          template: {
            name: options?.templateData?.name,
            language: options?.templateData?.language,
            components: options?.templateData?.components
          }
        };

      // Add other message types as needed
      default:
        throw new Error(`Unsupported message type: ${content.type}`);
    }
  }

  private async makeRequest(endpoint: string, payload: any): Promise<MessageResponse> {
    try {
      const token = await this.tokenManager.getToken('whatsapp', this.config);
      const response = await fetch(`${this.baseUrl}/${this.config.phoneNumberId}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle token expiry
        if (response.status === 401) {
          this.tokenManager.clearToken('whatsapp');
          throw new Error('Token expired');
        }
        throw new Error(data.error?.message || 'WhatsApp API error');
      }

      return {
        success: true,
        messageId: data.messages?.[0]?.id,
        statusCode: response.status
      };
    } catch (error) {
      if (error instanceof Error && error.message === 'Token expired') {
        // Retry once with new token
        const token = await this.tokenManager.getToken('whatsapp', this.config);
        return this.makeRequest(endpoint, payload);
      }
      throw error;
    }
  }
} 