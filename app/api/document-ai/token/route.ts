import { NextResponse } from 'next/server';
import { GoogleAuth } from 'google-auth-library';

// Initialize auth client
const auth = new GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    project_id: process.env.NEXT_PUBLIC_DOCUMENT_AI_PROJECT_ID,
  },
  scopes: ['https://www.googleapis.com/auth/cloud-platform', 'https://www.googleapis.com/auth/cloud-vision']
});

export async function GET() {
  try {
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    
    if (!token.token) {
      throw new Error('Failed to get access token');
    }

    // Log token details for debugging
    console.log('Token generated successfully');
    
    return NextResponse.json({ 
      token: token.token,
      expiresIn: token.res?.data?.expires_in 
    });
  } catch (error) {
    console.error('Error getting access token:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    );
  }
} 