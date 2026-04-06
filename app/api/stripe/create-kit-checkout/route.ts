import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getAppUrl } from '@/lib/app-url';
import { KIT_PRICING } from '@/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json().catch(() => ({ email: undefined }));

    if (email && !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: KIT_PRICING.name,
              description:
                'Press release + 5 journalist pitch emails + 16-journalist panel review',
            },
            unit_amount: KIT_PRICING.priceInCents,
          },
          quantity: 1,
        },
      ],
      success_url: `${getAppUrl()}/kit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getAppUrl()}/kit`,
      metadata: {
        product: 'launch_kit',
      },
    };

    if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Kit checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
