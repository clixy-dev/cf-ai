import { NextResponse } from 'next/server';
import { ConfigManager } from '@/utils/messaging/server/config-manager';
import { MessageProviderFactory } from '@/utils/messaging/factories/provider-factory';
import type { MessageRequest } from '@/utils/messaging/core/types';
import type { ProviderType } from '@/utils/messaging/factories/provider-factory';

export async function POST(request: Request) {
  try {
    const { provider, to, templateName, content, options = {} } = 
      await request.json() as MessageRequest;

    if (!to || (!content && !templateName)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const configManager = ConfigManager.getInstance();
    
    if (!configManager.validateConfig()) {
      return NextResponse.json(
        { error: 'Messaging service configuration is incomplete' },
        { status: 500 }
      );
    }

    const providerConfig = configManager.getProviderConfig(provider as ProviderType);
    const messagingProvider = MessageProviderFactory.createProvider(
      provider as ProviderType,
      providerConfig
    );

    console.log('POST sendMessage', {
      to,
      content,
      templateName,
      options
    });

    const result = await messagingProvider.sendMessage(
      to,
      {
        type: templateName ? 'template' : 'text',
        body: Array.isArray(content) ? content.join('\n') : content || '',
        metadata: templateName ? {
          templateName,
          parameters: Array.isArray(content) ? content : [content || '']
        } : undefined
      },
      {
        previewUrl: options.previewUrl,
        templateData: options.language && templateName ? {
          name: templateName,
          language: { code: options.language },
          components: [{
            type: 'body',
            parameters: Array.isArray(content) ? 
              content.filter(Boolean).map(text => ({ type: 'text', text })) : 
              []
          }]
        } : undefined
      }
    );

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      provider,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Messaging API Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'An unexpected error occurred',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}