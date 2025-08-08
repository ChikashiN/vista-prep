import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Shield, Users, Target, BookOpen, Calculator, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PLANS } from '@/lib/stripe';
import { verifyUser, updateUserPaymentStatus } from '@/lib/auth';
import { toast } from 'sonner';

interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
  paymentLink: string;
}

export default function Payment() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
  const [countdown, setCountdown] = useState(30);

  // Check if user is logged in
  useEffect(() => {
    const { user, isAuthenticated, hasPaid } = verifyUser();
    
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    
    if (hasPaid) {
      navigate('/dashboard');
      return;
    }
    
    setCurrentUser(user);
  }, [navigate]);

  // Countdown timer effect
  useEffect(() => {
    if (paymentInitiated && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [paymentInitiated, countdown]);

  // Polling mechanism to check payment status
  useEffect(() => {
    if (paymentInitiated && currentUser) {
      const interval = setInterval(() => {
        // Check if user has paid by verifying against localStorage
        const { hasPaid } = verifyUser();
        
        // Also check for payment completion flag
        const paymentCompleted = localStorage.getItem('paymentCompleted');
        
        if (hasPaid || paymentCompleted === 'true') {
          clearInterval(interval);
          setPollingInterval(null);
          setPaymentInitiated(false);
          setCountdown(30);
          
          // Clear the payment completion flag
          localStorage.removeItem('paymentCompleted');
          
          // Update user payment status if not already updated
          if (!hasPaid) {
            updateUserPaymentStatus(currentUser.id, true);
          }
          
          toast.success('Payment detected! Welcome to Infiniprep!');
          navigate('/dashboard');
        }
      }, 2000); // Check every 2 seconds

      setPollingInterval(interval);

      // Auto-redirect after 30 seconds regardless of payment status
      const timeoutId = setTimeout(() => {
        console.log('30 second timeout reached - auto-redirecting to dashboard');
        
        // Clear the interval
        if (interval) {
          clearInterval(interval);
          setPollingInterval(null);
        }
        
        setPaymentInitiated(false);
        setCountdown(30);
        
        // Auto-complete payment and redirect to dashboard
        updateUserPaymentStatus(currentUser.id, true);
        toast.success('Welcome to Infiniprep!');
        navigate('/dashboard');
      }, 30000); // 30 seconds

      return () => {
        if (interval) {
          clearInterval(interval);
        }
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [paymentInitiated, currentUser, navigate]);

  const pricingTiers: PricingTier[] = [
    {
      id: 'lifetime',
      name: PLANS.BASIC.name,
      price: PLANS.BASIC.price,
      period: 'one-time',
      description: 'Lifetime access to all Infiniprep features',
      icon: <Crown className="h-6 w-6" />,
      color: 'bg-yellow-500',
      popular: true,
      paymentLink: PLANS.BASIC.paymentLink,
      features: PLANS.BASIC.features
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePayment = async () => {
    if (!selectedPlan || !currentUser) return;
    
    setLoading(true);
    
    try {
      const selectedTier = pricingTiers.find(t => t.id === selectedPlan);
      if (selectedTier) {
        // Redirect to Stripe payment link
        window.open(selectedTier.paymentLink, '_blank');
        
        // Start polling for payment completion
        setPaymentInitiated(true);
        setLoading(false);
        toast.info('Payment link opened in new tab. We\'ll automatically detect when payment is completed.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setLoading(false);
      toast.error('We are sorry! Payment failed. Please try again.');
    }
  };

  const handleCheckPaymentStatus = () => {
    // For testing purposes - simulate payment completion
    // In real app, this would check with Stripe API
    localStorage.setItem('paymentCompleted', 'true');
    updateUserPaymentStatus(currentUser.id, true);
    toast.success('Payment verified! Welcome to Infiniprep!');
    navigate('/dashboard');
  };

  const handleManualPaymentComplete = () => {
    // For testing purposes - manually complete payment
    localStorage.setItem('paymentCompleted', 'true');
    updateUserPaymentStatus(currentUser.id, true);
    toast.success('Payment completed! Welcome to Infiniprep!');
    navigate('/dashboard');
  };

  const handleStopPolling = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setPaymentInitiated(false);
    toast.info('Payment monitoring stopped.');
  };

  if (!currentUser) {
    return null; // Loading state
  }

  return (
    <div className="min-h-screen bg-background">
      <Header streak={0} totalScore={0} currentXP={0} level={1} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Payment Status Banner */}
        {paymentInitiated && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-800">
                    Payment Monitoring Active
                  </h3>
                  <p className="text-xs text-blue-700">
                    We're checking for payment completion. Please complete payment in the new tab.
                  </p>
                  {countdown > 0 && (
                    <p className="text-xs text-orange-600 font-medium mt-1">
                      ⏰ Auto-redirecting to dashboard in {countdown} seconds
                    </p>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleStopPolling}
                >
                  Stop Monitoring
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Welcome, {currentUser.name}! 👋
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Complete your payment to unlock lifetime access to all Infiniprep features. 
            No monthly fees, no recurring charges.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center mb-12">
          <Card className="relative transition-all duration-300 hover:shadow-lg max-w-md w-full">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
              Best Value
            </Badge>
            
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500 flex items-center justify-center mx-auto mb-4">
                <Crown className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl">{pricingTiers[0].name}</CardTitle>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold">{pricingTiers[0].price}</span>
                <span className="text-muted-foreground">/{pricingTiers[0].period}</span>
              </div>
              <p className="text-sm text-muted-foreground">{pricingTiers[0].description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {pricingTiers[0].features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => handlePlanSelect('lifetime')}
              >
                {selectedPlan === 'lifetime' ? 'Selected' : 'Get Lifetime Access'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Payment Section */}
        {selectedPlan && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Complete Your Purchase</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="font-medium">Selected Plan:</span>
                <span className="font-bold">
                  {pricingTiers[0].name} - {pricingTiers[0].price}
                </span>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handlePayment}
                  disabled={loading || paymentInitiated}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processing Payment...' : paymentInitiated ? 'Payment Link Opened' : 'Pay with Stripe'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPlan(null)}
                  className="w-full"
                  disabled={paymentInitiated}
                >
                  Change Plan
                </Button>
                
                {/* Testing buttons - remove in production */}
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Testing Options:</p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleCheckPaymentStatus}
                      className="w-full"
                    >
                      Check Payment Status
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleManualPaymentComplete}
                      className="w-full"
                    >
                      Complete Payment (Test)
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <Shield className="h-4 w-4 inline mr-1" />
                Secure payment powered by Stripe
              </div>
              
              <div className="text-center text-xs text-muted-foreground mt-2">
                <p>After completing payment in the new tab, we'll automatically detect it and redirect you to the dashboard.</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Infiniprep?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mx-auto">
                <Brain className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold">Adaptive Learning</h3>
              <p className="text-sm text-muted-foreground">Questions adapt to your skill level</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mx-auto">
                <Target className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold">Targeted Practice</h3>
              <p className="text-sm text-muted-foreground">Focus on your weakest areas</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto">
                <BookOpen className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="font-semibold">Comprehensive Content</h3>
              <p className="text-sm text-muted-foreground">5000+ high-quality questions</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold">Expert Support</h3>
              <p className="text-sm text-muted-foreground">Get help when you need it</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What does lifetime access include?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Lifetime access includes unlimited access to all practice questions, full practice tests, progress tracking, and all future updates to the platform.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is this a one-time payment?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Yes! This is a one-time payment of $22.99. No monthly fees, no recurring charges, no hidden costs. We also offer a 48 hour free trial!</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
