// Example Express server for Stripe webhooks
// Save this as server.js and run with: node server.js

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.raw({ type: 'application/json' }));

// Webhook endpoint
app.post('/api/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      console.log('🎉 PAYMENT SUCCESSFUL!');
      console.log('================================');
      console.log('💰 Payment Details:');
      console.log('   - Session ID:', session.id);
      console.log('   - User ID:', session.client_reference_id);
      console.log('   - Amount:', `$${(session.amount_total / 100).toFixed(2)}`);
      console.log('   - Status:', session.payment_status);
      console.log('   - Customer Email:', session.customer_details?.email);
      console.log('   - Payment Method:', session.payment_method_types[0]);
      console.log('================================');
      
      // Update user payment status in your database
      // await updateUserPaymentStatus(session.client_reference_id, true);
      
      // Send notification to client (if using WebSockets)
      // io.to(session.client_reference_id).emit('payment_completed', session);
      
      break;
      
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('💳 Payment Intent Succeeded:', paymentIntent.id);
      console.log('   - Amount:', `$${(paymentIntent.amount / 100).toFixed(2)}`);
      console.log('   - User ID:', paymentIntent.metadata?.userId);
      break;
      
    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      console.log('📄 Invoice Payment Succeeded:', invoice.id);
      break;
      
    default:
      console.log(`📝 Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Create payment intent endpoint
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    console.log('🔧 Creating payment intent for user:', userId);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { userId },
    });
    
    console.log('✅ Payment intent created:', paymentIntent.id);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('❌ Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create checkout session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { userId } = req.body;
    
    console.log('🔧 Creating checkout session for user:', userId);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Infiniprep Lifetime Access',
            description: 'Lifetime access to all Infiniprep features',
          },
          unit_amount: 2299, // $22.99
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      client_reference_id: userId,
    });
    
    console.log('✅ Checkout session created:', session.id);
    console.log('   - URL:', session.url);
    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('🏥 Health check requested');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('🚀 Server started successfully!');
  console.log('================================');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🔗 Webhook endpoint: http://localhost:${PORT}/api/webhooks/stripe`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log('================================');
  console.log('📝 To test webhooks, use Stripe CLI:');
  console.log('   stripe listen --forward-to localhost:3001/api/webhooks/stripe');
  console.log('   stripe trigger checkout.session.completed');
  console.log('================================');
});

// Environment variables needed:
// STRIPE_SECRET_KEY=sk_live_your_secret_key
// STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
// CLIENT_URL=http://localhost:8080 