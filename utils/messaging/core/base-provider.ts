import { MessageProvider, MessageContent, MessageOptions, MessageResponse } from './types';

export abstract class BaseMessageProvider implements MessageProvider {
  constructor(protected config: Record<string, any>) {}

  abstract sendMessage(
    to: string,
    content: MessageContent,
    options?: MessageOptions
  ): Promise<MessageResponse>;

  protected validatePhoneNumber(phone: string): string {
    const cleaned = phone.replace(/[^\d+]/g, '').replace(/^\+/, '');
    if (!/^\d{1,15}$/.test(cleaned)) {
      throw new Error('Invalid phone number format');
    }
    return cleaned;
  }

  protected handleError(error: any): MessageResponse {
    console.error(`${this.constructor.name} Error:`, error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      statusCode: error.statusCode || 500
    };
  }
} 