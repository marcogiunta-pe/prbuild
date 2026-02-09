// app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { getAppUrl } from '@/lib/app-url';
import { BillingInterval } from '@/types';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Price IDs organized by plan and interval
const PRICE_IDS: Record<string, Record<BillingInterval, string>> = {
  starter: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_STARTER_YEARLY || '',
  },
  growth: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_GROWTH_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_GROWTH_YEARLY || '',
  },
  pro: {
    monthly: process.env.NEXT_PUBLIC_STRIPE_PRO_MONTHLY || '',
    yearly: process.env.NEXT_PUBLIC_STRIPE_PRO_YEARLY || '',
  },
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Require authentication - never trust userId from request body
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { plan, interval = 'monthly' } = await request.json();

    if (!plan || !PRICE_IDS[plan]) {
      return NextResponse.json(
        { error: 'Invalid plan selected' },
        { status: 400 }
      );
    }

    const priceId = PRICE_IDS[plan][interval as BillingInterval];
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid billing interval' },
        { status: 400 }
      );
    }

    // Get user profile (use authenticated user's ID)
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, stripe_customer_id')
      .eq('id', user.id)
      .single();

    const email = profile?.email ?? user.email;
    if (!email) {
      return NextResponse.json(
        { error: 'Profile must have an email to create checkout' },
        { status: 400 }
      );
    }

    let customerId = profile?.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;

      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }

    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${getAppUrl()}/dashboard/new-request?session_id={CHECKOUT_SESSION_ID}&plan=${plan}&interval=${interval}`,
      cancel_url: `${getAppUrl()}/pricing`,
      metadata: {
        userId: user.id,
        plan,
        interval,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          plan,
          interval,
        },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
