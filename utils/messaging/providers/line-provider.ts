import { BaseMessageProvider } from '../core/base-provider';
import { MessageContent, MessageOptions, MessageResponse } from '../core/types';

export interface LineConfig {
  channelAccessToken: string;
  channelSecret: string;
  baseUrl?: string;
}

export class LineProvider extends BaseMessageProvider {
  private baseUrl: string;

  constructor(config: LineConfig) {
    super(config);
    this.baseUrl = config.baseUrl || 'https://api.line.me/v2';
  }

  async sendMessage(
    to: string,
    content: MessageContent,
    options?: MessageOptions
  ): Promise<MessageResponse> {
    try {
      const payload = this.createPayload(to, content, options);
      console.log('LINE Message Payload:', JSON.stringify(payload, null, 2));
      
      // Simulate successful response for now
      return {
        success: true,
        messageId: `line_${Date.now()}`,
        statusCode: 200
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  private createPayload(to: string, content: MessageContent, options?: MessageOptions) {
    switch (content.type) {
      case 'text':
        return {
          to,
          messages: [{
            type: 'text',
            text: content.body
          }]
        };

      case 'template':
        return {
          to,
          messages: [{
            type: 'template',
            altText: content.body || 'Template Message',
            template: {
              type: 'buttons',
              title: options?.templateData?.name,
              text: content.body,
              actions: content.metadata?.parameters?.map(param => ({
                type: 'message',
                label: param,
                text: param
              })) || []
            }
          }]
        };

      default:
        throw new Error(`Unsupported message type for LINE: ${content.type}`);
    }
  }
} 