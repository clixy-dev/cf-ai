import { BaseMessageProvider } from '../core/base-provider';
import { MessageContent, MessageOptions, MessageResponse } from '../core/types';
import { createClient } from '@supabase/supabase-js';

export interface TelegramConfig {
  botToken: string;
  defaultChatId?: string;
  baseUrl?: string;
}

export class TelegramProvider extends BaseMessageProvider {
  private baseUrl: string;
  private supabase: ReturnType<typeof createClient>;

  constructor(config: TelegramConfig) {
    super(config);
    this.baseUrl = config.baseUrl || 'https://api.telegram.org/bot';
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  async sendMessage(
    to: string,
    content: MessageContent,
    options?: MessageOptions
  ): Promise<MessageResponse> {
    try {
      // Convert phone number to chat ID if needed
      const chatId = this.resolveChatId(to);
      if (!chatId) {
        return {
          success: false,
          error: 'No valid chat ID found. User must start a conversation with the bot first.',
          statusCode: 400
        };
      }

      const payload = this.createPayload(chatId, content, options);
      console.log('Telegram Message Payload:', JSON.stringify(payload, null, 2));
      const response = await this.makeRequest('/sendMessage', payload);

      // If message was sent successfully, store it in the database
      if (response.success && response.messageId) {
        await this.storeMessage(chatId, content, response.messageId);
      }

      return response;
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async storeMessage(chatId: string, content: MessageContent, messageId: string) {
    try {
      const messageData = {
        platform: 'telegram',
        direction: 'outbound',
        status: 'sent',
        platform_message_id: messageId,
        platform_chat_id: chatId,
        platform_user_id: 'bot',
        content: content.type === 'text' ? content.body : JSON.stringify(content),
        metadata: {
          type: content.type,
          ...content.metadata,
          sent_at: new Date().toISOString()
        }
      };

      const { error } = await this.supabase
        .from('messages')
        .insert(messageData);

      if (error) {
        console.error('Error storing outbound message:', error);
      }
    } catch (error) {
      console.error('Error in storeMessage:', error);
    }
  }

  private resolveChatId(to: string): string | null {
    // Clean up the input
    const cleanedInput = to.replace(/[^\d]/g, '');

    // If it matches the default chat ID, use it
    const config = this.config as TelegramConfig;
    if (cleanedInput === config.defaultChatId) {
      return cleanedInput;
    }

    // For phone numbers or other inputs, fall back to default chat ID
    return config.defaultChatId || null;
  }

  private createPayload(chatId: string, content: MessageContent, options?: MessageOptions) {
    switch (content.type) {
      case 'text':
        return {
          chat_id: chatId,
          text: content.body,
          parse_mode: 'HTML'
        };

      case 'template':
        // For Telegram, we'll convert template messages to formatted text
        const text = content.metadata?.parameters?.join('\n') || content.body;
        return {
          chat_id: chatId,
          text,
          parse_mode: 'HTML'
        };

      default:
        throw new Error(`Unsupported message type for Telegram: ${content.type}`);
    }
  }

  private async makeRequest(endpoint: string, payload: any): Promise<MessageResponse> {
    try {
      const config = this.config as TelegramConfig;
      const response = await fetch(`${this.baseUrl}${config.botToken}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.description || 'Telegram API error');
      }

      return {
        success: true,
        messageId: data.result?.message_id?.toString(),
        statusCode: response.status
      };
    } catch (error) {
      throw error;
    }
  }
} 