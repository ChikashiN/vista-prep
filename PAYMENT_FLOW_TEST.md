# Payment Flow Test Guide

## 🎯 **New User Flow (Paywall)**

### **Step 1: Sign Up**
1. **Go to** `http://localhost:8080`
2. **Click** "Sign up" 
3. **Fill in** all details:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "123-456-7890"
   - Password: "password123"
   - Confirm Password: "password123"
4. **Click** "Create Account"
5. **Expected**: Redirected to `/payment` with welcome message

### **Step 2: Payment**
1. **On payment page**, you should see:
   - "Welcome, Test User! 👋"
   - Lifetime plan for $22.99
   - Payment card with features
2. **Click** "Get Lifetime Access"
3. **Click** "Pay with Stripe"
4. **Expected**: Opens Stripe payment page in new tab
5. **Wait 2 seconds** (simulated payment)
6. **Expected**: Redirected to `/dashboard` with success toast

### **Step 3: Dashboard Welcome**
1. **On dashboard**, you should see:
   - Green welcome banner: "Welcome to Infiniprep! 🎉"
   - Success toast: "Payment successful! Welcome to Infiniprep!"
   - Normal dashboard with user's name
2. **Click** "Dismiss" on welcome banner
3. **Expected**: Banner disappears, normal dashboard remains

## 🔄 **Returning User Flow**

### **Step 1: Login (Paid User)**
1. **Go to** `http://localhost:8080`
2. **Click** "Sign in"
3. **Enter** credentials from previous test
4. **Click** "Sign In"
5. **Expected**: Direct redirect to `/dashboard` (no payment page)

### **Step 2: Login (Unpaid User)**
1. **Clear localStorage** (to simulate unpaid user)
2. **Create new account** without completing payment
3. **Log out** and log back in
4. **Expected**: Redirected to `/payment` page

## ✅ **Expected Behaviors**

### **Authentication Checks:**
- ✅ Unpaid users → `/payment`
- ✅ Paid users → `/dashboard`
- ✅ No user → `/auth`

### **Payment Flow:**
- ✅ Signup → Payment required
- ✅ Payment success → Dashboard with welcome
- ✅ Payment failure → Error message

### **Dashboard Features:**
- ✅ Welcome banner for new paid users
- ✅ No "Get Lifetime Access" card (already paid)
- ✅ Normal dashboard functionality

## 🐛 **Troubleshooting**

### **If payment doesn't work:**
1. Check browser console for errors
2. Verify Stripe key in `src/lib/stripe.ts`
3. Check payment link URL is correct

### **If welcome banner doesn't show:**
1. Clear localStorage: `localStorage.clear()`
2. Create new account and complete payment
3. Check `welcomeShown` flag in localStorage

### **If redirects don't work:**
1. Check user `hasPaid` status in localStorage
2. Verify authentication logic in Auth component
3. Check navigation logic in useEffect hooks 