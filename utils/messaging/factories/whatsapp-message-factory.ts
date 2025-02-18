import { MessageContent, MessageContentFactory, OrderNotificationParams, DeliveryUpdateParams } from '../core/types';

export class WhatsAppMessageFactory implements MessageContentFactory {
  createOrderNotification(params: OrderNotificationParams): MessageContent {
    return {
      type: 'template',
      body: '',
      metadata: {
        templateName: 'order_success',
        parameters: [
          params.customerName || 'Value Customer',
          params.orderNumber || '',
          params.items.length.toString() || '',
          params.items.join(' | ') || '',
          params.total.toFixed(2) || '',
          params.deliveryDate?.toLocaleDateString() || 'To be confirmed'
        ]
      }
    };
  }

  createDeliveryUpdate(params: DeliveryUpdateParams): MessageContent {
    // Implement delivery update message creation
    throw new Error('Not implemented');
  }
} 