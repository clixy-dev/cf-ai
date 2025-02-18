import { NextResponse } from 'next/server';

const N8N_WEBHOOK_URL = 'https://henryarches.app.n8n.cloud/webhook/9076dac9-bb92-4136-8736-8c363dd7de90';

export const maxDuration = 30; // Increase to 30 seconds from default 10
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { message, sessionId } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { 
          error: 'Missing required fields',
          userMessage: 'Could not process your message. Please try again.'
        },
        { status: 400 }
      );
    }

    console.log('Sending message to n8n:', { message, sessionId });

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
      const errorMessage = response.status === 500 
        ? 'The AI service is currently experiencing issues.'
        : response.status === 429 
          ? 'Too many requests. Please wait a moment before trying again.'
          : 'Failed to get a response from the AI service.';

      return NextResponse.json(
        { 
          error: `N8N webhook responded with status: ${response.status}`,
          userMessage: errorMessage
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('N8N response:', data);

    // Handle array response format
    if (Array.isArray(data) && data.length > 0 && data[0].output) {
      return NextResponse.json({
        responseText: data[0].output
      });
    }

    // Handle legacy format check
    if (!Array.isArray(data) && data.responseText) {
      return NextResponse.json(data);
    }

    return NextResponse.json(
      { 
        error: 'Invalid response format from N8N',
        userMessage: 'Received an invalid response from the AI service.'
      },
      { status: 500 }
    );
  } catch (error) {
    console.error('API Error:', error);
    
    const isNetworkError = error instanceof TypeError && error.message.includes('fetch');
    const userMessage = isNetworkError
      ? 'Unable to connect to the AI service. Please check your internet connection.'
      : 'Something went wrong while processing your message. Please try again later.';

    return NextResponse.json(
      { 
        error: 'AI processing timeout',
        userMessage: "Our AI is taking longer than usual to respond. Please try again shortly."
      },
      { status: 500 }
    );
  }
} 