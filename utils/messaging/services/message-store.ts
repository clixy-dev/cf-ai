import { createClient } from '@supabase/supabase-js';
import type { Message, MessageDirection, ProviderType } from '../core/types';
import { RealtimeChannel } from '@supabase/supabase-js';

export class MessageStore {
  private static instance: MessageStore;
  private supabase: ReturnType<typeof createClient>;
  private subscriptions: Map<string, RealtimeChannel>;

  private constructor(supabase: ReturnType<typeof createClient>) {
    this.supabase = supabase;
    this.subscriptions = new Map();
  }

  static getInstance(supabase: ReturnType<typeof createClient>): MessageStore {
    if (!MessageStore.instance) {
      MessageStore.instance = new MessageStore(supabase);
    }
    return MessageStore.instance;
  }

  async getMessages(
    platform: ProviderType,
    chatId: string,
    options: {
      limit?: number;
      offset?: number;
      direction?: MessageDirection;
    } = {}
  ): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('platform', platform)
      .eq('platform_chat_id', chatId)
      .order('created_at', { ascending: false })
      .limit(options.limit || 50)
      .offset(options.offset || 0);

    if (error) throw error;
    return this.mapMessages(data);
  }

  async subscribeToMessages(
    platform: ProviderType,
    chatId: string,
    callback: (message: Message) => void
  ): Promise<() => void> {
    const channelKey = `${platform}:${chatId}`;
    
    if (this.subscriptions.has(channelKey)) {
      return () => this.unsubscribeFromMessages(platform, chatId);
    }

    const channel = this.supabase
      .channel(`messages:${channelKey}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `platform=eq.${platform}&platform_chat_id=eq.${chatId}`
        },
        (payload) => {
          const message = this.mapMessage(payload.new);
          callback(message);
        }
      )
      .subscribe();

    this.subscriptions.set(channelKey, channel);
    
    return () => this.unsubscribeFromMessages(platform, chatId);
  }

  private async unsubscribeFromMessages(platform: ProviderType, chatId: string) {
    const channelKey = `${platform}:${chatId}`;
    const channel = this.subscriptions.get(channelKey);
    
    if (channel) {
      await channel.unsubscribe();
      this.subscriptions.delete(channelKey);
    }
  }

  private mapMessage(row: any): Message {
    return {
      id: row.id,
      platform: row.platform,
      direction: row.direction,
      status: row.status,
      platformMessageId: row.platform_message_id,
      platformChatId: row.platform_chat_id,
      platformUserId: row.platform_user_id,
      content: row.content,
      metadata: row.metadata,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };
  }

  private mapMessages(rows: any[]): Message[] {
    return rows.map(this.mapMessage);
  }
} 