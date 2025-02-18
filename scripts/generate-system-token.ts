import fetch from 'node-fetch';

async function generateSystemUserToken() {
  try {
    const response = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      params: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.FACEBOOK_APP_ID!,
        client_secret: process.env.FACEBOOK_APP_SECRET!,
        scope: 'whatsapp_business_messaging'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate system user token');
    }

    const data = await response.json();
    console.log('System User Token:', data);
    return data.access_token;
  } catch (error) {
    console.error('Error generating system user token:', error);
    throw error;
  }
}

generateSystemUserToken().catch(console.error); 