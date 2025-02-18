import { createClient } from '@/utils/supabase/client';
import { EmailTemplate } from '@/types/email';

interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
}

export async function sendEmail({ to, subject, body }: SendEmailParams) {
  const supabase = createClient();

  console.log(`Attempting to send email to: ${to}`);
  
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, body }
    });

    if (error) {
      console.error('Email service error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    if (!data?.success) {
      console.error('Email service response:', data);
      throw new Error('Failed to send email: Unknown error');
    }

    console.log('Email sent successfully');
    return data;
  } catch (error) {
    console.error('Email service exception:', error);
    throw error;
  }
}

export async function getEmailTemplate(templateName: string, language: string = 'en'): Promise<EmailTemplate> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('EmailTemplates')
    .select('*')
    .eq('name', templateName)
    .single();

  if (error || !data) {
    throw new Error('Failed to fetch email template');
  }

  return data;
}

// export async function sendOrderConfirmationEmail(order: Order, tenant: Tenant) {
//   try {
//     const template = await getEmailTemplate('order_confirmation');
    
//     // Replace placeholders in template
//     const body = template.body
//       .replace('{{orderNumber}}', order.id)
//       .replace('{{clientName}}', order.client?.name || 'Valued Customer')
//       .replace('{{deliveryDate}}', new Date(order.delivery_date).toLocaleDateString())
//       .replace('{{totalAmount}}', order.total_amount.toFixed(2));

//     // Send to client
//     const clientEmail = order.client?.email || 'Co-Founder AI.io@gmail.com';
//     console.log(`Order confirmation email sent to client: ${clientEmail} - ${template.subject} - ${body}`);

//     await sendEmail({
//       to: clientEmail,
//       subject: template.subject,
//       body
//     });

//     console.log(`Order confirmation email sent to supplier: ${tenant.email}`);
//     // Send to supplier/tenant
//     await sendEmail({
//       to: tenant.email,
//       subject: `New Order Received - ${order.id}`,
//       body: template.body
//         .replace('{{orderNumber}}', order.id)
//         .replace('{{clientName}}', order.client?.name || 'Unknown Client')
//         .replace('{{deliveryDate}}', new Date(order.delivery_date).toLocaleDateString())
//         .replace('{{totalAmount}}', order.total_amount.toFixed(2))
//     });

//   } catch (error) {
//     console.error('Failed to send order confirmation email:', error);
//     throw error;
//   }
// } 