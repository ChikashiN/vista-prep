# Payment Success Output Guide

## 🎯 **Where You'll See Payment Success Output**

### **1. Server Console (Terminal)**
When you run the server, you'll see this output in your terminal:

```bash
🚀 Server started successfully!
================================
📍 Server running on port 3001
🔗 Webhook endpoint: http://localhost:3001/api/webhooks/stripe
🏥 Health check: http://localhost:3001/api/health
================================
📝 To test webhooks, use Stripe CLI:
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   stripe trigger checkout.session.completed
================================
```

**When payment is successful, you'll see:**
```bash
🎉 PAYMENT SUCCESSFUL!
================================
💰 Payment Details:
   - Session ID: cs_test_abc123...
   - User ID: 1234567890
   - Amount: $22.99
   - Status: paid
   - Customer Email: user@example.com
   - Payment Method: card
================================
```

### **2. Stripe Dashboard**
- **Go to**: Stripe Dashboard → Payments
- **See**: All successful payments with details
- **Filter**: By date, amount, customer, etc.

### **3. Browser Console (Client-Side)**
If using client-side confirmation, you'll see:
```javascript
✅ Payment successful! Welcome to Infiniprep!
```

### **4. Browser Network Tab**
- **Open**: Developer Tools → Network
- **Look for**: API calls to your server
- **See**: Request/response data

## 🧪 **How to Test and See Output**

### **Step 1: Start the Server**
```bash
# Install dependencies
npm install express stripe cors

# Set environment variables
export STRIPE_SECRET_KEY=sk_test_your_key
export STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
export CLIENT_URL=http://localhost:8080

# Start server
node server-setup-example.js
```

### **Step 2: Test with Stripe CLI**
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your server
stripe listen --forward-to localhost:3001/api/webhooks/stripe

# In another terminal, trigger a test payment
stripe trigger checkout.session.completed
```

### **Step 3: Test Real Payment**
1. **Create a test payment link** in Stripe Dashboard
2. **Complete payment** with test card: `4242 4242 4242 4242`
3. **Check server console** for output

## 📍 **Output Locations Summary**

| Location | What You'll See | When |
|----------|----------------|------|
| **Server Terminal** | 🎉 PAYMENT SUCCESSFUL! | When webhook received |
| **Stripe Dashboard** | Payment details | Real-time |
| **Browser Console** | Success toast | Client-side confirmation |
| **Network Tab** | API requests | All server calls |

## 🔧 **Troubleshooting**

### **If you don't see output:**

1. **Check server is running:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Check webhook endpoint:**
   ```bash
   curl -X POST http://localhost:3001/api/webhooks/stripe
   ```

3. **Check Stripe CLI:**
   ```bash
   stripe listen --forward-to localhost:3001/api/webhooks/stripe
   ```

4. **Test webhook manually:**
   ```bash
   stripe trigger checkout.session.completed
   ```

## 🎉 **Expected Output Examples**

### **Successful Payment:**
```bash
🎉 PAYMENT SUCCESSFUL!
================================
💰 Payment Details:
   - Session ID: cs_test_a1B2c3D4e5F6g7H8i9J0k1L2m3N4o5P6
   - User ID: 1703123456789
   - Amount: $22.99
   - Status: paid
   - Customer Email: test@example.com
   - Payment Method: card
================================
```

### **Payment Intent Success:**
```bash
💳 Payment Intent Succeeded: pi_3OqRst2eZvKYlo2C1gQ12345
   - Amount: $22.99
   - User ID: 1703123456789
```

### **Error Output:**
```bash
❌ Webhook signature verification failed: Invalid signature
❌ Error creating payment intent: Invalid API key
``` 