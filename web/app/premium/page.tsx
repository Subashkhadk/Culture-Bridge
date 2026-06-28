'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import { motion } from 'framer-motion';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  symbol: string;
  interval: string;
  country: string;
  features: string[];
}

interface PricingData {
  plans: {
    monthly: Plan;
    yearly: Plan;
  };
  country: string;
  pricing: {
    currency: string;
    symbol: string;
    monthly: number;
    yearly: number;
  };
}

export default function PremiumPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        // Fetch plans with country-based pricing
        const plansResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/premium/plans`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (plansResponse.ok) {
          const data = await plansResponse.json();
          setPricingData(data);
        }

        // Fetch premium status
        const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/premium/status`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          setIsPremium(statusData.isPremium || false);
        }
      } catch (err) {
        console.error('Error fetching premium data:', err);
      } finally {
        setIsLoadingPlans(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, token]);

  const handleSubscribe = async (planId: string) => {
    setIsSubscribing(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/premium/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed');
      }

      setSuccess(data.message);
      setIsPremium(true);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your premium subscription?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/premium/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Cancellation failed');
      }

      setSuccess('Subscription cancelled successfully');
      setIsPremium(false);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  if (isLoading || isLoadingPlans) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-surface">
          <div className="text-center">
            <div className="text-4xl mb-4 animate-spin-slow">💰</div>
            <div className="text-xl text-on-surface-variant">Loading premium plans...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const premiumFeatures = [
    { icon: '📝', title: 'Unlimited Posts', desc: 'Create unlimited cultural stories' },
    { icon: '🚫', title: 'Ad-Free Experience', desc: 'No interruptions while browsing' },
    { icon: '⭐', title: 'Premium Badge', desc: 'Stand out with a premium badge' },
    { icon: '📊', title: 'Advanced Analytics', desc: 'Track your content performance' },
    { icon: '🎯', title: 'Sponsored Posts', desc: 'Promote your content' },
    { icon: '🎨', title: 'Exclusive Content', desc: 'Access premium-only content' },
    { icon: '🌐', title: 'Unlimited Translations', desc: 'Translate any post without limits' },
  ];

  const countryNames: Record<string, string> = {
    'Japan': '🇯🇵 Japan',
    'USA': '🇺🇸 USA',
    'UK': '🇬🇧 UK',
    'India': '🇮🇳 India',
    'Germany': '🇩🇪 Germany',
    'France': '🇫🇷 France',
    'Australia': '🇦🇺 Australia',
    'Brazil': '🇧🇷 Brazil',
    'Canada': '🇨🇦 Canada',
    'Singapore': '🇸🇬 Singapore',
    'default': '🌍 Global',
  };

  const getCountryDisplay = (country: string) => {
    return countryNames[country] || countryNames.default;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl font-bold text-on-surface mb-2">💎 Premium Membership</h1>
            <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto">
              Unlock exclusive features and support the Culture Bridge community
            </p>
            {pricingData && pricingData.country && (
              <div className="mt-3 inline-flex items-center gap-2 bg-surface-container px-4 py-2 rounded-full text-sm text-on-surface-variant">
                <span>📍</span>
                <span>Pricing for: {getCountryDisplay(pricingData.country)}</span>
              </div>
            )}
            {isPremium && (
              <motion.div 
                className="mt-3 inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
              >
                ⭐ You're a Premium Member!
              </motion.div>
            )}
          </motion.div>

          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-tertiary-fixed text-on-tertiary-fixed-variant p-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          {isPremium && (
            <div className="text-center mb-6">
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-error text-on-error rounded-lg hover:opacity-90 transition text-sm"
              >
                Cancel Subscription
              </button>
            </div>
          )}

          {/* Plans */}
          {pricingData && !isPremium && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Monthly Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-surface-container-low rounded-2xl shadow-md overflow-hidden border border-outline-variant"
              >
                <div className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-on-surface">{pricingData.plans.monthly.name}</h2>
                  <div className="mt-3">
                    <span className="text-3xl sm:text-4xl font-bold text-on-surface">
                      {pricingData.pricing.symbol}{pricingData.plans.monthly.price}
                    </span>
                    <span className="text-on-surface-variant text-sm">/{pricingData.plans.monthly.interval}</span>
                    <div className="text-xs text-on-surface-variant mt-1">
                      {pricingData.pricing.currency} • {pricingData.country}
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {pricingData.plans.monthly.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span className="text-tertiary">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSubscribe('monthly')}
                    disabled={isSubscribing}
                    className="w-full mt-6 px-4 py-2.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base font-medium"
                  >
                    {isSubscribing ? 'Processing...' : `Subscribe Monthly (${pricingData.pricing.symbol}${pricingData.plans.monthly.price})`}
                  </button>
                </div>
              </motion.div>

              {/* Yearly Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-surface-container-low rounded-2xl shadow-md overflow-hidden border-2 border-primary relative"
              >
                <div className="absolute top-0 right-0 bg-primary text-on-primary px-3 py-1 rounded-bl-lg text-xs font-medium">
                  Best Value
                </div>
                <div className="p-6 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold text-on-surface">{pricingData.plans.yearly.name}</h2>
                  <div className="mt-3">
                    <span className="text-3xl sm:text-4xl font-bold text-on-surface">
                      {pricingData.pricing.symbol}{pricingData.plans.yearly.price}
                    </span>
                    <span className="text-on-surface-variant text-sm">/{pricingData.plans.yearly.interval}</span>
                    <div className="text-xs text-tertiary font-medium mt-1">
                      Save {pricingData.pricing.symbol}{pricingData.plans.monthly.price * 12 - pricingData.plans.yearly.price}/year
                    </div>
                    <div className="text-xs text-on-surface-variant mt-1">
                      {pricingData.pricing.currency} • {pricingData.country}
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {pricingData.plans.yearly.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-on-surface-variant">
                        <span className="text-tertiary">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSubscribe('yearly')}
                    disabled={isSubscribing}
                    className="w-full mt-6 px-4 py-2.5 bg-primary text-on-primary rounded-lg hover:opacity-90 transition disabled:opacity-50 text-sm sm:text-base font-medium"
                  >
                    {isSubscribing ? 'Processing...' : `Subscribe Yearly (${pricingData.pricing.symbol}${pricingData.plans.yearly.price})`}
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Premium Features */}
          <motion.div 
            className="mt-12 sm:mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-on-surface text-center mb-6">
              What's Included in Premium?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {premiumFeatures.map((feature, index) => (
                <div key={index} className={`bg-surface-container-low p-4 rounded-xl border ${feature.icon === '🌐' ? 'border-primary border-2' : 'border-outline-variant'} hover:shadow-md transition`}>
                  <div className="text-2xl sm:text-3xl mb-2">{feature.icon}</div>
                  <h3 className="text-sm sm:text-base font-semibold text-on-surface">{feature.title}</h3>
                  <p className="text-xs sm:text-sm text-on-surface-variant mt-1">{feature.desc}</p>
                  {feature.icon === '🌐' && (
                    <span className="inline-block mt-2 text-[10px] bg-primary-fixed text-primary px-2 py-0.5 rounded-full font-medium">
                      Premium Feature
                    </span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Country Pricing Info */}
          <motion.div 
            className="mt-8 p-4 bg-surface-container-low rounded-xl border border-outline-variant text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-sm text-on-surface-variant">
              💡 Pricing is based on your country. 
              {pricingData && pricingData.country && (
                <span className="font-medium"> Current: {getCountryDisplay(pricingData.country)}</span>
              )}
            </p>
            <p className="text-xs text-on-surface-variant/70 mt-1">
              Prices are shown in {pricingData?.pricing.currency || 'USD'} with local currency adjustments.
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
