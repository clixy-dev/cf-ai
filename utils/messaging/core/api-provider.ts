import { MessageContent, MessageOptions, MessageProvider, MessageResponse } from './types';

export class APIProvider implements MessageProvider {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = '/api/messaging';
  }

  async sendMessage(
    to: string,
    content: MessageContent,
    options?: MessageOptions
  ): Promise<MessageResponse> {
    try {
      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'telegram',
          to,
          templateName: content.type === 'template' ? content.metadata?.templateName : undefined,
          content: content.type === 'template' ? content.metadata?.parameters : content.body,
          options: {
            previewUrl: options?.previewUrl,
            language: options?.templateData?.language?.code
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      return await response.json();
    } catch (error: any) {
      console.error('API Provider Error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred',
        statusCode: error.status || 500
      };
    }
  }
} 