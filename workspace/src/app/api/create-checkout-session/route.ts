// src/app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: Request) {
  try {
    const { priceId, userEmail } = await request.json();

    if (!priceId || !userEmail) {
      return NextResponse.json({ error: 'Price ID and User Email are required' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      // Throw a specific error if the app URL is not configured
      throw new Error('NEXT_PUBLIC_APP_URL is not set in the environment variables. This is required for Stripe redirects.');
    }

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      customer_email: userEmail,
      success_url: `${appUrl}/upgrade-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/upgrade`,
    });

    if (session.id) {
      return NextResponse.json({ sessionId: session.id });
    } else {
      return NextResponse.json({ error: 'Failed to create Stripe session' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
