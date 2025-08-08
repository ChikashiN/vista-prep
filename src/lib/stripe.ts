import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_live_51PG98Z2L1EUJndt6l2ADrmylHvdcM3GOU8i5G35A9tEg5UJXHGcyQqVDlkUPy0W6NDX2aZ9dFs9NIqjkH5PRgLS300SOzlHk9s';

export const stripePromise = loadStripe(stripePublishableKey);

// ⚠️ IMPORTANT: Replace these with your actual Stripe payment link URLs
// Go to Stripe Dashboard → Payment Links → Create Payment Link for each plan
export const PAYMENT_LINK = {
    LIFETIME: 'https://buy.stripe.com/dRm00ce1Ngii2td89YenS01'
};

// Plan configurations
export const PLANS = {
  BASIC: {
    name: 'Lifetime Plan',
    price: '$22.99',
    features: [
      'Access to all practice questions',
      'Unlimited practice tests',
      'Unlimited practice questions',
      'Unlimited practice tests',
    ],
    paymentLink: PAYMENT_LINK.LIFETIME
  },
}; 