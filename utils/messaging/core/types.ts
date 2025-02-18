import type { ProviderType } from '@/utils/messaging/factories/provider-factory';
import { WhatsAppConfig } from '../providers/whatsapp-provider';
import { LineConfig } from '../providers/line-provider';
import { KakaoConfig } from '../providers/kakao-provider';
import { TelegramConfig } from '../providers/telegram-provider';

// Core message types
export interface MessageContent {
  body: string;
  type: MessageType;
  metadata?: MessageMetadata;
}

export type MessageType = 'text' | 'template' | 'media' | 'interactive' | 'location';
export type MessageDirection = 'inbound' | 'outbound';
export type MessageStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: string;
  platform: ProviderType;
  direction: MessageDirection;
  status: MessageStatus;
  platformMessageId?: string;
  platformChatId: string;
  platformUserId?: string;
  content: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageOptions {
  language?: string;
  previewUrl?: boolean;
  templateData?: {
    name: string;
    language: { code: string };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text?: string;
        currency?: {
          fallback_value: string;
          code: string;
          amount_1000: number;
        };
        date_time?: {
          fallback_value: string;
        };
      }>;
    }>;
  };
}

export interface MessageResponse {
  success: boolean;
  messageId?: string;
  error?: string;
  statusCode: number;
}

// Provider interface using Strategy pattern
export interface MessageProvider {
  sendMessage(
    to: string,
    content: MessageContent,
    options?: MessageOptions
  ): Promise<MessageResponse>;

  // New method for handling incoming messages
  handleIncomingMessage?(
    data: any
  ): Promise<Message | null>;
}

// Abstract Factory for creating message content
export interface MessageContentFactory {
  createOrderNotification(params: OrderNotificationParams): MessageContent;
  createDeliveryUpdate(params: DeliveryUpdateParams): MessageContent;
  // Add other message type factories as needed
}

export interface OrderNotificationParams {
  orderNumber: string;
  customerName: string;
  items: string[];
  total: number;
  deliveryDate?: Date;
  notes?: string;
}

export interface DeliveryUpdateParams {
  
}

export interface MessageMetadata {
  templateName: string;
  parameters: string[];
  [key: string]: any;
}

// Add Product and Packaging interfaces
export interface Product {
  id: string;
  name: string;
  code: string;
  price?: number;
  packaging: Packaging;
}

export interface Packaging {
  id: string;
  quantity: number;
  price: number;
  unit: {
    code: string;
  };
}

// Add OrderFormProduct interface
export interface OrderFormProduct {
  product_id: string;
  packaging_id: string;
  price?: number;
  product: {
    name: string;
  };
  packaging: {
    quantity: number;
    unit: {
      code: string;
    };
    price: number;
  };
}

// Add OrderForm interface
export interface OrderForm {
  id: string;
  client_id: string;
  client_name: string;
  supplier_phone?: string;
  products: OrderFormProduct[];
}

// Add MessageRequest type and update MessagingConfig
export interface MessageRequest {
  provider: ProviderType;
  to: string;
  templateName?: string;
  content?: string | string[];
  options?: {
    previewUrl?: boolean;
    language?: string;
  };
}

// Update MessagingConfig to include all provider types
export interface MessagingConfig {
  whatsapp: WhatsAppConfig;
  line: LineConfig;
  kakao: KakaoConfig;
  telegram: TelegramConfig;
}
