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
    // const recipient = process.env.NODE_ENV === 'production' ? to : VERIFIED_EMAIL;
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
        reply_to: to, // Add original recipient as reply-to
        subject: `${subject} (Original recipient: ${to})`, // Add original recipient to subject
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