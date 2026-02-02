// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Use your verified domain in production, or onboarding@resend.dev for testing
const FROM_EMAIL = process.env.FROM_EMAIL || 'PRBuild <onboarding@resend.dev>';

// ============================================
// Journalist Emails
// ============================================

export async function sendJournalistVerificationEmail(
  email: string,
  verificationToken: string
) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/journalist/verify?token=${verificationToken}`;

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify your PRBuild subscription',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #6366f1; margin-bottom: 30px; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
            .footer { margin-top: 40px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">📰 PRBuild</div>
            <h2>Verify your email</h2>
            <p>Thanks for subscribing to PRBuild press releases! Click the button below to verify your email and start receiving curated press releases in your inbox.</p>
            <p style="margin: 30px 0;">
              <a href="${verifyUrl}" class="button">Verify Email</a>
            </p>
            <p>Or copy and paste this link:</p>
            <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
            <div class="footer">
              <p>If you didn't subscribe, you can safely ignore this email.</p>
              <p>© ${new Date().getFullYear()} PRBuild</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send verification email:', error);
    throw error;
  }

  return data;
}

// ============================================
// Newsletter Emails
// ============================================

interface NewsletterRelease {
  id: string;
  headline: string;
  subhead?: string;
  company_name: string;
  summary: string;
  category: string;
}

export async function sendNewsletterEmail(
  email: string,
  subject: string,
  releases: NewsletterRelease[],
  unsubscribeToken: string
) {
  const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/journalist/unsubscribe?token=${unsubscribeToken}`;

  const releaseHtml = releases.map(release => `
    <div style="border-bottom: 1px solid #eee; padding: 20px 0;">
      <div style="font-size: 12px; color: #6366f1; text-transform: uppercase; margin-bottom: 8px;">${release.category} • ${release.company_name}</div>
      <h3 style="margin: 0 0 8px; font-size: 18px;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/showcase/${release.id}" style="color: #333; text-decoration: none;">${release.headline}</a>
      </h3>
      ${release.subhead ? `<p style="color: #666; margin: 0 0 8px; font-style: italic;">${release.subhead}</p>` : ''}
      <p style="color: #555; margin: 0; font-size: 14px;">${release.summary}</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/showcase/${release.id}" style="color: #6366f1; font-size: 14px; text-decoration: none;">Read full release →</a>
    </div>
  `).join('');

  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #6366f1; margin-bottom: 10px; }
            .header { border-bottom: 2px solid #6366f1; padding-bottom: 20px; margin-bottom: 20px; }
            .footer { margin-top: 40px; font-size: 12px; color: #999; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">📰 PRBuild</div>
              <p style="color: #666; margin: 0;">Your curated press release digest</p>
            </div>
            
            <h2 style="margin-bottom: 20px;">${subject}</h2>
            
            ${releases.length > 0 ? releaseHtml : '<p>No new releases this period. Check back soon!</p>'}
            
            <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
              <p style="margin: 0 0 10px;">Want to submit your own press release?</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/signup" style="color: #6366f1; font-weight: 600;">Get started with PRBuild →</a>
            </div>
            
            <div class="footer">
              <p>You're receiving this because you subscribed to PRBuild press releases.</p>
              <p><a href="${unsubscribeUrl}" style="color: #999;">Unsubscribe</a></p>
              <p>© ${new Date().getFullYear()} PRBuild</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send newsletter email:', error);
    throw error;
  }

  return data;
}

// ============================================
// Client Notification Emails
// ============================================

export async function sendClientNotification(
  email: string,
  subject: string,
  message: string,
  ctaText?: string,
  ctaUrl?: string
) {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `PRBuild: ${subject}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #6366f1; margin-bottom: 30px; }
            .button { display: inline-block; background: #6366f1; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; }
            .footer { margin-top: 40px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">📰 PRBuild</div>
            <h2>${subject}</h2>
            <p>${message}</p>
            ${ctaText && ctaUrl ? `
              <p style="margin: 30px 0;">
                <a href="${ctaUrl}" class="button">${ctaText}</a>
              </p>
            ` : ''}
            <div class="footer">
              <p>You're receiving this because you have an account with PRBuild.</p>
              <p>© ${new Date().getFullYear()} PRBuild</p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    console.error('Failed to send client notification:', error);
    throw error;
  }

  return data;
}

// Pre-built notification templates
export const notifications = {
  draftReady: (email: string, releaseId: string, companyName: string) =>
    sendClientNotification(
      email,
      'Your Press Release Draft is Ready',
      `Great news! The draft for your ${companyName} press release is ready for review. Our team has crafted it based on your input, and it's been through our journalist panel critique.`,
      'Review Your Draft',
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/my-releases/${releaseId}`
    ),

  feedbackReceived: (email: string, releaseId: string) =>
    sendClientNotification(
      email,
      'Feedback Received - We\'re On It',
      'Thanks for your feedback! Our team is reviewing your comments and will update the draft shortly.',
      'View Release',
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/my-releases/${releaseId}`
    ),

  releasePublished: (email: string, releaseId: string, showcaseId: string) =>
    sendClientNotification(
      email,
      'Your Press Release is Live! 🎉',
      'Congratulations! Your press release has been published to our showcase and distributed to journalists in your industry.',
      'View Published Release',
      `${process.env.NEXT_PUBLIC_APP_URL}/showcase/${showcaseId}`
    ),

  approvalNeeded: (email: string, releaseId: string) =>
    sendClientNotification(
      email,
      'Action Required: Please Review Your Draft',
      'Your press release draft is waiting for your approval. Please review it and let us know if you\'d like any changes.',
      'Review Now',
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/my-releases/${releaseId}`
    ),
};
