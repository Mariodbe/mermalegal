import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;

      if (!userId) {
        console.error('No supabase_user_id in checkout session metadata');
        break;
      }

      // Determine plan from price
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
      const priceId = subscription.items.data[0]?.price?.id;

      let plan: 'pro' | 'enterprise' = 'pro';
      if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
        plan = 'enterprise';
      }

      await supabaseAdmin
        .from('profiles')
        .update({
          plan,
          stripe_customer_id: session.customer as string,
        })
        .eq('id', userId);

      console.log(`User ${userId} upgraded to ${plan}`);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Downgrade to free
      await supabaseAdmin
        .from('profiles')
        .update({ plan: 'free' })
        .eq('stripe_customer_id', customerId);

      console.log(`Customer ${customerId} downgraded to free`);
      break;
    }

    default:
      // Unhandled event type
      break;
  }

  return NextResponse.json({ received: true });
}
