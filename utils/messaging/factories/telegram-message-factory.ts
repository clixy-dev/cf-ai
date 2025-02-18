import { MessageContent, MessageContentFactory, OrderNotificationParams } from '../core/types';

export class TelegramMessageFactory implements MessageContentFactory {
  createOrderNotification(params: OrderNotificationParams): MessageContent {
    const formattedDate = params.deliveryDate?.toLocaleDateString() || 'To be confirmed';
    
    // Create a nicely formatted HTML message for Telegram
    const message = [
      `<b>🛍️ New Order #${params.orderNumber}</b>`,
      '',
      `<b>👤 Customer:</b> ${params.customerName}`,
      '',
      '<b>📦 Items:</b>',
      ...params.items.map(item => `• ${item}`),
      '',
      `<b>💰 Total:</b> $${params.total.toFixed(2)}`,
      `<b>📅 Delivery:</b> ${formattedDate}`,
      params.notes ? `\n<b>📝 Notes:</b>\n${params.notes}` : ''
    ].filter(Boolean).join('\n');

    return {
      type: 'text', // Using text type since we're sending formatted HTML
      body: message,
      metadata: {
        templateName: 'order_notification',
        parameters: [] // Not used for Telegram as we format directly in the body
      }
    };
  }

  createDeliveryUpdate(): MessageContent {
    throw new Error('Not implemented');
  }
} 