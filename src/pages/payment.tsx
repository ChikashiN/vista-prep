import { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Shield, Users, Target, BookOpen, Calculator, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  icon: React.ReactNode;
  color: string;
}

export default function Payment() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pricingTiers: PricingTier[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      period: 'month',
      description: 'Perfect for getting started with SAT prep',
      icon: <Target className="h-6 w-6" />,
      color: 'bg-blue-500',
      features: [
        'Access to 500+ practice questions',
        'Basic progress tracking',
        'Sectional practice mode',
        'Mobile-friendly interface',
        'Email support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 19.99,
      period: 'month',
      description: 'Most popular choice for serious students',
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-purple-500',
      popular: true,
      features: [
        'Everything in Basic',
        'Access to 2000+ questions',
        'Full practice tests with adaptive difficulty',
        'Detailed analytics and insights',
        'AI-powered tutoring assistance',
        'Priority email support',
        'Progress reports and recommendations'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 29.99,
      period: 'month',
      description: 'Complete SAT preparation experience',
      icon: <Crown className="h-6 w-6" />,
      color: 'bg-yellow-500',
      features: [
        'Everything in Pro',
        'Access to 5000+ questions',
        '1-on-1 tutoring sessions',
        'Custom study plans',
        'Advanced analytics dashboard',
        'Phone and email support',
        'Guaranteed score improvement or money back',
        'Exclusive premium content'
      ]
    }
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      // Here you would integrate with Stripe
      alert('Payment integration coming soon! This would connect to Stripe.');
      // navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header streak={5} totalScore={1250} currentXP={250} level={3} />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Unlock your full potential with our comprehensive SAT preparation platform. 
            Choose the plan that fits your goals and budget.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {pricingTiers.map((tier) => (
            <Card 
              key={tier.id}
              className={`relative transition-all duration-300 hover:shadow-lg ${
                selectedPlan === tier.id 
                  ? 'ring-2 ring-primary shadow-lg' 
                  : 'hover:scale-105'
              } ${tier.popular ? 'border-primary/50' : ''}`}
            >
              {tier.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 rounded-lg ${tier.color} flex items-center justify-center mx-auto mb-4`}>
                  {tier.icon}
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground">/{tier.period}</span>
                </div>
                <p className="text-sm text-muted-foreground">{tier.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${selectedPlan === tier.id ? 'bg-primary' : 'bg-secondary hover:bg-secondary/80'}`}
                  onClick={() => handlePlanSelect(tier.id)}
                >
                  {selectedPlan === tier.id ? 'Selected' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
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
                  {pricingTiers.find(t => t.id === selectedPlan)?.name} - 
                  ${pricingTiers.find(t => t.id === selectedPlan)?.price}/{pricingTiers.find(t => t.id === selectedPlan)?.period}
                </span>
              </div>
              
              <div className="space-y-4">
                <Button 
                  onClick={handlePayment}
                  disabled={loading}
                  className="w-full"
                  size="lg"
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedPlan(null)}
                  className="w-full"
                >
                  Change Plan
                </Button>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                <Shield className="h-4 w-4 inline mr-1" />
                Secure payment powered by Stripe
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
                <CardTitle className="text-lg">Can I cancel my subscription anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Yes! We offer a 7-day free trial for all plans. No credit card required to start.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What if I'm not satisfied?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
