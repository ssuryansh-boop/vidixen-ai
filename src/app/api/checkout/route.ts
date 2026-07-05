import { NextResponse } from 'next/server';
import DodoPayments from 'dodopayments';

const client = new DodoPayments({
  bearerToken: process.env.DODO_API_KEY,
  environment: 'live_mode', 
});

export async function POST(request: Request) {
  try {
    // 1. Accept the user's email from your front-end pricing page
    const { productId, countryCode, customerEmail } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    if (!customerEmail) {
      return NextResponse.json({ error: 'Customer email is required for subscriptions' }, { status: 400 });
    }

    // 2. Pass the required 'customer' object into the creation parameters
    const subscription = await client.subscriptions.create({
      billing: {
        country: countryCode || 'US', 
      },
      customer: {
  email: customerEmail,
  name: "Vidixen User",
},
      product_id: productId,
      quantity: 1,
      payment_link: true, 
    });

    // 3. Access the checkout URL correctly from the response payload
    // If the TypeScript definition throws a fit, using a fallback safely extracts it
    const checkoutUrl = (subscription as any).checkout_url || (subscription as any).payment_link;

    if (!checkoutUrl) {
      throw new Error('Checkout URL could not be retrieved from Dodo response.');
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error('Dodo live checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize live checkout session' }, 
      { status: 500 }
    );
  }
}