import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Check, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

type PricingPlan = {
  name: string;
  price: number;
  description: string;
  features: string[];
  notIncluded?: string[];
  highlight?: boolean;
  buttonText: string;
};

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: 0,
      description: "Get started with the basics of spaced repetition learning.",
      features: [
        "1 quiz per subject per week",
        "2 daily doubt queries",
        "MCQs only",
        "Basic reports",
      ],
      notIncluded: ["No scheduling"],
      buttonText: "Sign up for free"
    },
    {
      name: "Standard",
      price: 999,
      description: "A perfect balance of features for most students.",
      features: [
        "1 quiz per subject per day",
        "Unlimited doubt queries",
        "All subjects",
        "Detailed reports",
        "Scheduling",
        "24/7 support",
        "Early feature access"
      ],
      highlight: true,
      buttonText: "Get started"
    },
    {
      name: "Premium",
      price: 1999,
      description: "Advanced features for serious students aiming for top ranks.",
      features: [
        "3 quizzes per subject per day",
        "15-minute daily doubt solving",
        "All question types",
        "Advanced Bloom's Taxonomy",
        "Comprehensive analytics",
        "API support",
        "Everything in Standard plan"
      ],
      buttonText: "Get Premium"
    }
  ];

  const handleSubscribe = async (tier: string) => {
    if (!isAuthenticated) {
      return;
    }

    try {
      await apiRequest("POST", "/api/subscription", { tier: tier.toLowerCase() });
      
      toast({
        title: "Subscription updated!",
        description: `You are now on the ${tier} plan.`,
        variant: "default",
      });
      
      // Invalidate user data to refresh subscription status
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    } catch (error) {
      toast({
        title: "Error updating subscription",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-base font-semibold text-primary uppercase tracking-wide">Pricing</h1>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Plans for every student
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500 dark:text-gray-400">
            Choose the plan that fits your learning needs and budget.
          </p>
        </div>

        {/* Toggle between monthly and annual pricing */}
        <div className="relative mt-6 flex justify-center">
          <div className="relative self-center bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5 flex sm:mt-8">
            <button
              type="button"
              onClick={() => setIsAnnual(false)}
              className={`relative ${
                !isAnnual ? "bg-white dark:bg-gray-900" : ""
              } border-gray-200 rounded-md py-2 w-1/2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 sm:w-auto sm:px-8`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setIsAnnual(true)}
              className={`relative ${
                isAnnual ? "bg-white dark:bg-gray-900" : ""
              } border-gray-200 rounded-md py-2 w-1/2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-primary focus:z-10 sm:w-auto sm:px-8`}
            >
              Annual
            </button>
          </div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 bg-primary text-white text-xs px-2 py-1 rounded-full">
            Save 15%
          </div>
        </div>

        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`border ${
                plan.highlight
                  ? "border-primary dark:border-primary"
                  : "border-gray-200 dark:border-gray-700"
              } rounded-lg shadow-sm divide-y divide-gray-200 dark:divide-gray-700`}
            >
              <div className="p-6 relative">
                {plan.highlight && (
                  <div className="absolute top-0 right-0 -mt-3 mr-6 inline-flex rounded-full bg-primary-100 dark:bg-primary-900 px-3 py-1 text-xs font-semibold text-primary-600 dark:text-primary-300">
                    Popular
                  </div>
                )}
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{plan.name}</h3>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                <p className="mt-8">
                  <span className="text-4xl font-extrabold text-gray-900 dark:text-white">₹{plan.price}</span>
                  <span className="text-base font-medium text-gray-500 dark:text-gray-400">/year</span>
                </p>
                
                {isAuthenticated ? (
                  <Button
                    onClick={() => handleSubscribe(plan.name)}
                    className={`mt-8 block w-full ${
                      plan.highlight
                        ? "bg-primary hover:bg-primary-600"
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                    }`}
                    disabled={user?.subscriptionTier?.toLowerCase() === plan.name.toLowerCase()}
                  >
                    {user?.subscriptionTier?.toLowerCase() === plan.name.toLowerCase()
                      ? "Current plan"
                      : plan.buttonText}
                  </Button>
                ) : (
                  <Link href="/signup">
                    <Button
                      className={`mt-8 block w-full ${
                        plan.highlight
                          ? "bg-primary hover:bg-primary-600"
                          : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                )}
              </div>
              <div className="pt-6 pb-8 px-6">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white tracking-wide">What's included</h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <Check className="flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                  {plan.notIncluded?.map((feature) => (
                    <li key={feature} className="flex space-x-3">
                      <X className="flex-shrink-0 h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center">
            Frequently asked questions
          </h2>
          <div className="mt-12 max-w-3xl mx-auto divide-y divide-gray-200 dark:divide-gray-700">
            {[
              {
                q: "Can I change my plan later?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                q: "How does the spaced repetition system work?",
                a: "Our system automatically schedules review quizzes at scientifically proven intervals (days 1, 5, 15, 30, 60, 120, and 180) to maximize your retention of the material."
              },
              {
                q: "Are the AI-generated quizzes accurate?",
                a: "Yes, our AI-generated quizzes are based on the CBSE, ICSE, and ISC curricula and are designed to test your understanding at different levels of Bloom's Taxonomy."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, UPI, and net banking."
              },
              {
                q: "Can I get a refund if I'm not satisfied?",
                a: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our premium services."
              }
            ].map((faq, index) => (
              <div key={index} className="pt-6 pb-8">
                <dt className="text-lg">
                  <p className="font-medium text-gray-900 dark:text-white">{faq.q}</p>
                </dt>
                <dd className="mt-2 text-base text-gray-500 dark:text-gray-400">{faq.a}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
