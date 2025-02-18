# Deploying Supabase Edge Functions

This guide covers the deployment process for Supabase Edge Functions, using the send-email function as an example.

## Prerequisites

1. Install Supabase CLI:
```bash
# Using npm
npm install -g supabase

# Using yarn
yarn global add supabase

# Using homebrew (macOS)
brew install supabase/tap/supabase
```

2. Login to Supabase:
```bash
supabase login
```
```bash
sbp_88f37890da3d70f64ade558686163eedc0dd3aa6
```

## Project Setup

1. Initialize Supabase in your project (if not already done):
```bash
supabase init
```

2. Link your project:
```bash
supabase link --project-ref utgwwuiypgsxkwiienml
```

## Creating the Send Email Function

1. Create a new function:
```bash
supabase functions new send-email
```

2. Structure your function directory:
```
supabase/
└── functions/
    └── send-email/
        ├── index.ts
        └── README.md
```

## Environment Variables

1. Set required environment variables in Supabase:
```bash
supabase secrets set RESEND_API_KEY="re_fuzFoUQf_JEgX3JuNZxg3aiK9E29NSRYa"
```

## Implementation

The send-email function implementation using Resend:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const VERIFIED_EMAIL = 'phamvuhoang@gmail.com'; // Your verified email

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, subject, body } = await req.json();

    // Log request data
    console.log('Received request:', { to, subject });

    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY environment variable');
    }

    // In development/testing, always send to verified email
    const recipient = VERIFIED_EMAIL;
    
    console.log('Sending email via Resend...');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Co-Founder AI <onboarding@resend.dev>',
        to: recipient,
        reply_to: to,
        subject: `${subject} (Original recipient: ${to})`,
        html: `
          <div style="background: #f9f9f9; padding: 12px; margin-bottom: 20px; border-radius: 4px;">
            <strong>Original Recipient:</strong> ${to}<br>
            <strong>Note:</strong> This email is being sent to a verified address during development.
          </div>
          ${body}
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend API error:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    console.log('Email sent successfully:', data);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Email sent successfully',
      data,
      note: to !== recipient ? 'Email sent to verified address in development mode' : undefined
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Failed to send email:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });

    return new Response(JSON.stringify({ 
      error: error.message,
      details: error.stack,
      type: error.name
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
```

## Deployment

1. Deploy the function:
```bash
supabase functions deploy send-email
```

2. Verify deployment:
```bash
supabase functions list
```

## Security and Access Control

1. Configure function access:
```bash
# Require authentication (recommended)
supabase functions update send-email --verify-jwt

# Set CORS policy
supabase functions update send-email --cors-origins "*"
```

## Testing

Test the function with curl:
```bash
curl -i --request POST 'http://localhost:54321/functions/v1/send-email' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "to": "test@example.com",
    "subject": "Test Email",
    "body": "<h1>Test Email</h1><p>This is a test email.</p>"
  }'
```

## Production Setup

To use in production with your own domain:

1. Verify your domain at https://resend.com/domains
2. Add DNS records as specified by Resend
3. Update the "from" address in the function to use your verified domain
4. Remove the development mode email redirection

## Monitoring

1. View function logs:
```bash
supabase functions logs send-email
```

2. Monitor in Supabase Dashboard:
- Navigate to your project
- Go to Edge Functions
- Select 'send-email' function
- View metrics and logs

## Troubleshooting

Common issues:
1. Domain verification: All emails will be sent to verified email until domain is verified
2. Rate limits: Check Resend's rate limits for your plan
3. Email delivery: Monitor bounce rates and spam reports in Resend dashboard

## Telegram Bot Function

This section covers deploying the Telegram bot Edge Function.

### Prerequisites

1. Create a Telegram bot and get your bot token:
   - Message [@BotFather](https://t.me/BotFather) on Telegram
   - Use `/newbot` command to create a new bot
   - Save the bot token provided by BotFather

### Deployment Steps

1. Create the function directory:
```bash
mkdir -p supabase/functions/telegram-bot
```

2. Create `index.ts` with the bot implementation:
```typescript
import { Bot, webhookCallback } from 'https://deno.land/x/grammy@v1.8.3/mod.ts'

console.log(`Function "telegram-bot" up and running!`)

const bot = new Bot(Deno.env.get('TELEGRAM_BOT_TOKEN') || '')

bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))
bot.command('ping', (ctx) => ctx.reply(`Pong! ${new Date()} ${Date.now()}`))

const handleUpdate = webhookCallback(bot, 'std/http')

Deno.serve(async (req) => {
  try {
    const url = new URL(req.url)
    if (url.searchParams.get('secret') !== Deno.env.get('FUNCTION_SECRET')) {
      return new Response('not allowed', { status: 405 })
    }
    return await handleUpdate(req)
  } catch (err) {
    console.error(err)
  }
})
```

3. Deploy the function without JWT verification:
```bash
supabase functions deploy --no-verify-jwt telegram-bot --project-ref utgwwuiypgsxkwiienml
```

4. Generate a random secret for webhook security:
```bash
openssl rand -hex 32
# Example output: 28ddfb5c2fb16beb43761e45b3e96e69ac7352bda2a12bc39a04de02aec82589
```

5. Set required environment variables:
```bash
supabase secrets set \
  --project-ref utgwwuiypgsxkwiienml \
  TELEGRAM_BOT_TOKEN="your_bot_token" \
  FUNCTION_SECRET="your_generated_secret"
```

6. Set up the webhook URL with Telegram:
```
https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=https://utgwwuiypgsxkwiienml.functions.supabase.co/functions/v1/telegram-bot?secret=<FUNCTION_SECRET>
```

Replace:
- `<TELEGRAM_BOT_TOKEN>` with your bot token
- `<FUNCTION_SECRET>` with your generated secret

### Testing

1. Send `/start` to your bot - Should receive "Welcome! Up and running."
2. Send `/ping` to your bot - Should receive "Pong!" with current timestamp

### Monitoring

1. View function logs:
```bash
supabase functions logs telegram-bot --project-ref utgwwuiypgsxkwiienml
```

2. Check webhook status:
```bash
curl https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/getWebhookInfo | jq
```

### Troubleshooting

Common issues:
1. Webhook setup: Ensure the webhook URL is correct and accessible
2. Secret mismatch: Verify FUNCTION_SECRET matches in both Supabase and webhook URL
3. Bot token: Make sure TELEGRAM_BOT_TOKEN is set correctly in Supabase secrets
4. Function errors: Check logs for any runtime errors or timeouts

### Security Notes

1. Always use FUNCTION_SECRET to protect your webhook endpoint
2. Never commit bot tokens or secrets to version control
3. Use environment variables for sensitive data
4. Monitor function logs for unauthorized access attempts