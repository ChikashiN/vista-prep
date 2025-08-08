# Stripe Webhook Setup Guide

## 🎯 **Problem: Stripe Doesn't Signal Payment Completion**

### **Current Issue:**
- ✅ Payment completes in Stripe
- ❌ Website doesn't know payment happened
- ❌ User stays on payment page
- ❌ No automatic redirect

## 🔧 **Solution: Webhook + Client-Side Confirmation**

### **Option 1: Stripe Webhooks (Recommended)**

#### **Step 1: Set Up Webhook Endpoint**
Create a server endpoint (Node.js/Express example):

```javascript
// server/webhooks/stripe.js
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      
      // Update user payment status in your database
      await updateUserPaymentStatus(session.client_reference_id, true);
      
      // Send real-time notification to client (if using WebSockets)
      // io.to(session.client_reference_id).emit('payment_completed');
      
      break;
      
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
```

#### **Step 2: Configure Stripe Webhook**
1. **Go to Stripe Dashboard** → Webhooks
2. **Add endpoint**: `https://yourdomain.com/api/webhooks/stripe`
3. **Select events**:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
4. **Copy webhook secret** to your environment variables

#### **Step 3: Update Payment Links**
When creating payment links, include user ID:

```javascript
// In your server code
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [{
    price_data: {
      currency: 'usd',
      product_data: {
        name: 'Infiniprep Lifetime Access',
      },
      unit_amount: 2299, // $22.99
    },
    quantity: 1,
  }],
  mode: 'payment',
  success_url: 'https://yourdomain.com/payment-success?session_id={CHECKOUT_SESSION_ID}',
  cancel_url: 'https://yourdomain.com/payment-cancel',
  client_reference_id: userId, // Include user ID
});
```

### **Option 2: Client-Side Confirmation**

#### **Step 1: Update Payment Page**
```javascript
// In payment.tsx
const handlePayment = async () => {
  if (!selectedPlan || !currentUser) return;
  
  setLoading(true);
  
  try {
    // Create payment intent on your server
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        userId: currentUser.id,
        amount: 2299 
      })
    });
    
    const { clientSecret } = await response.json();
    
    // Confirm payment with Stripe
    const { error } = await stripe.confirmCardPayment(clientSecret);
    
    if (error) {
      toast.error('Payment failed: ' + error.message);
    } else {
      // Payment successful
      updateUserPaymentStatus(currentUser.id, true);
      toast.success('Payment successful! Welcome to Infiniprep!');
      navigate('/dashboard');
    }
  } catch (error) {
    toast.error('Payment failed. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

#### **Step 2: Server Endpoint for Payment Intent**
```javascript
// server/api/create-payment-intent.js
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: { userId },
    });
    
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🚀 **Recommended Implementation**

### **For Production: Use Webhooks**
1. **Set up webhook endpoint** on your server
2. **Configure Stripe webhook** in dashboard
3. **Update payment links** with user ID
4. **Handle webhook events** to update user status
5. **Use WebSockets** for real-time client updates

### **For Development: Use Client-Side**
1. **Create payment intent** on server
2. **Confirm payment** on client
3. **Update user status** immediately
4. **Redirect to dashboard**

## 📋 **Environment Variables Needed**

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Server Configuration
WEBHOOK_ENDPOINT=https://yourdomain.com/api/webhooks/stripe
```

## ✅ **Testing Webhooks**

### **Using Stripe CLI:**
```bash
# Install Stripe CLI
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test webhook
stripe trigger checkout.session.completed
```

### **Using ngrok (for local testing):**
```bash
# Expose local server
ngrok http 3000

# Use ngrok URL in Stripe webhook endpoint
```

## 🎉 **Benefits of Webhook Approach**

- ✅ **Real-time updates** - Instant payment confirmation
- ✅ **Reliable** - Works even if user closes browser
- ✅ **Secure** - Server-side verification
- ✅ **Scalable** - Handles multiple payment methods
- ✅ **Audit trail** - Complete payment history 