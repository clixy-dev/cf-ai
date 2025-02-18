import { MessageContent, MessageContentFactory, OrderNotificationParams, DeliveryUpdateParams } from '../core/types';

export class LineMessageFactory implements MessageContentFactory {
  createOrderNotification(params: OrderNotificationParams): MessageContent {
    const body = [
      `Order #${params.orderNumber}`,
      `Customer: ${params.customerName}`,
      `Items: ${params.items.join(', ')}`,
      `Total: $${params.total.toFixed(2)}`,
      params.notes ? `Notes: ${params.notes}` : '',
      `Delivery: ${params.deliveryDate?.toLocaleDateString() || 'To be confirmed'}`
    ].filter(Boolean).join('\n');

    return {
      type: 'template',
      body,
      metadata: {
        templateName: 'order_notification',
        parameters: [
          'View Order Details',
          'Contact Customer',
          'Modify Order'
        ]
      }
    };
  }

  createDeliveryUpdate(params: DeliveryUpdateParams): MessageContent {
    throw new Error('Not implemented');
  }
} 