# Stripe Payment Integration Setup

## 🎯 **Current Configuration**
- **Single Payment Option**: $22.99 lifetime access
- **Payment Link**: Already configured in `src/lib/stripe.ts`
- **Stripe Key**: Using live publishable key

## 📋 **Setup Steps**

### **Step 1: Stripe Dashboard Setup**
1. **Log into [Stripe Dashboard](https://dashboard.stripe.com)**
2. **Go to Payment Links** → **Create Payment Link**
3. **Configure the payment link**:
   - **Product Name**: Infiniprep Lifetime Access
   - **Price**: $22.99
   - **Billing**: One-time payment
   - **Currency**: USD
4. **Copy the payment link URL**

### **Step 2: Update Payment Link**
1. **Open** `src/lib/stripe.ts`
2. **Replace** the payment link URL:
   ```typescript
   export const PAYMENT_LINK = {
     LIFETIME: 'https://buy.stripe.com/dRm00ce1Ngii2td89YenS01'
   };
   ```

### **Step 3: Test the Integration**
1. **Start the development server**: `npm run dev`
2. **Navigate to** `/payment` page
3. **Click** "Get Lifetime Access"
4. **Verify** it redirects to your Stripe payment page

## 🔧 **Environment Variables**
Create a `.env` file with:
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51PG98Z2L1EUJndt6l2ADrmylHvdcM3GOU8i5G35A9tEg5UJXHGcyQqVDlkUPy0W6NDX2aZ9dFs9NIqjkH5PRgLS300SOzlHk9s
```

## ✅ **Features**
- ✅ Single lifetime payment option
- ✅ Stripe payment link integration
- ✅ Secure payment processing
- ✅ Mobile-responsive design
- ✅ Clear pricing display

## 🚀 **Next Steps**
- [ ] Set up webhook handling for payment confirmations
- [ ] Add user subscription status tracking
- [ ] Implement payment success/failure notifications
- [ ] Add payment analytics tracking 