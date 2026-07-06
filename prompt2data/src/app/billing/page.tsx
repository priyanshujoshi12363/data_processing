// src/app/(app)/billing/page.tsx
"use client";

import { useState } from "react";
import { 
  Check, 
  Sparkles, 
  Zap, 
  Crown, 
  ArrowRight,
  CreditCard,
  Shield,
  Clock,
  HelpCircle,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import Sidebar from "@/component/layout/Sidebar";
import Navbar from "@/component/layout/Navbar";
export default function BillingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const plans = [
    {
      name: "Free",
      description: "Perfect for exploration and small projects",
      monthlyPrice: 0,
      yearlyPrice: 0,
      credits: "1,000",
      features: [
        { name: "1,000 credits per month", included: true },
        { name: "Basic API access", included: true },
        { name: "Community support", included: true },
        { name: "Up to 5 saved datasets", included: true },
        { name: "JSON & CSV exports", included: true },
        { name: "Custom model training", included: false },
        { name: "Priority support", included: false },
        { name: "Advanced analytics", included: false },
      ],
      cta: "Start Building",
      ctaStyle: "outline",
      popular: false,
      icon: Sparkles,
    },
    {
      name: "Pro",
      description: "For professionals scaling their data needs",
      monthlyPrice: 29,
      yearlyPrice: 24,
      credits: "25,000",
      features: [
        { name: "25,000 credits per month", included: true },
        { name: "Priority API access", included: true },
        { name: "Priority email support", included: true },
        { name: "1 custom model fine-tune", included: true },
        { name: "Unlimited saved datasets", included: true },
        { name: "Advanced data validation", included: true },
        { name: "Team collaboration (up to 5)", included: true },
        { name: "API usage analytics", included: true },
      ],
      cta: "Accelerate Growth",
      ctaStyle: "solid",
      popular: true,
      icon: Zap,
    },
    {
      name: "Enterprise",
      description: "For organizations with complex requirements",
      monthlyPrice: 99,
      yearlyPrice: 83,
      credits: "Unlimited",
      features: [
        { name: "Unlimited credits", included: true },
        { name: "Full SDK & API access", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "White-label distribution", included: true },
        { name: "Unlimited model fine-tunes", included: true },
        { name: "SLA guarantee (99.9%)", included: true },
        { name: "SSO & advanced security", included: true },
        { name: "Custom integrations", included: true },
      ],
      cta: "Contact Sales",
      ctaStyle: "outline",
      popular: false,
      icon: Crown,
    },
  ];

  const calculatePrice = (plan: typeof plans[0]) => {
    if (plan.name === "Free") return 0;
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  return (
    <div className="flex h-screen text-white bg-[#0B0F19] overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Section */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6 lg:p-8 max-w-7xl mx-auto">
              
              {/* Header Section */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                  <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Simple, Transparent Pricing
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                  Architecture for Scale.
                </h1>
                
                <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
                  Choose a foundation that grows with your logic. 
                  Start free, scale seamlessly, and only pay for what you need.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-3 mt-8">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`text-sm font-medium transition-colors ${
                      billingCycle === "monthly" ? "text-white" : "text-[#6B7280]"
                    }`}
                  >
                    Monthly
                  </button>
                  
                  <button
                    onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
                    className="relative w-14 h-7 bg-[#1F2937] rounded-full transition-colors duration-200"
                  >
                    <div
                      className={`absolute top-1 w-5 h-5 bg-blue-500 rounded-full transition-all duration-200 ${
                        billingCycle === "yearly" ? "left-8" : "left-1"
                      }`}
                    />
                  </button>
                  
                  <button
                    onClick={() => setBillingCycle("yearly")}
                    className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                      billingCycle === "yearly" ? "text-white" : "text-[#6B7280]"
                    }`}
                  >
                    Yearly
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded-full border border-green-500/20">
                      Save 17%
                    </span>
                  </button>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
                {plans.map((plan) => {
                  const Icon = plan.icon;
                  const price = calculatePrice(plan);
                  const isSelected = selectedPlan === plan.name;

                  return (
                    <div
                      key={plan.name}
                      className={`relative bg-[#111827] border rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:scale-[1.02] ${
                        plan.popular 
                          ? "border-blue-500/50 shadow-xl shadow-blue-500/10" 
                          : "border-[#1F2937] shadow-lg shadow-black/10"
                      }`}
                    >
                      {/* Popular Badge */}
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="px-4 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold rounded-full shadow-lg shadow-blue-500/20">
                            RECOMMENDED
                          </span>
                        </div>
                      )}

                      {/* Plan Header */}
                      <div className="text-center mb-6">
                        <div className="inline-flex p-3 bg-[#0B0F19] rounded-xl border border-[#1F2937] mb-4">
                          <Icon className="w-6 h-6 text-blue-400" />
                        </div>
                        
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {plan.name}
                        </h3>
                        
                        <p className="text-sm text-[#6B7280] mb-4">
                          {plan.description}
                        </p>
                        
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold text-white">
                            ${price}
                          </span>
                          <span className="text-sm text-[#6B7280]">
                            /month
                          </span>
                        </div>
                        
                        {billingCycle === "yearly" && price > 0 && (
                          <p className="text-xs text-green-400 mt-1">
                            Billed ${price * 12}/year
                          </p>
                        )}
                        
                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-[#0B0F19] rounded-full border border-[#1F2937]">
                          <Zap className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-sm font-medium text-white">
                            {plan.credits}
                          </span>
                          <span className="text-xs text-[#6B7280]">credits</span>
                        </div>
                      </div>

                      {/* Features List */}
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-3">
                            <div className={`mt-0.5 flex-shrink-0 ${feature.included ? 'text-green-400' : 'text-[#374151]'}`}>
                              <Check className="w-4 h-4" />
                            </div>
                            <span className={`text-sm ${feature.included ? 'text-[#E5E7EB]' : 'text-[#4B5563] line-through'}`}>
                              {feature.name}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <button
                        onClick={() => setSelectedPlan(plan.name)}
                        className={`w-full py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 group ${
                          plan.ctaStyle === "solid"
                            ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
                            : plan.popular
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
                            : "bg-[#0B0F19] text-[#E5E7EB] border border-[#1F2937] hover:bg-[#1F2937]"
                        }`}
                      >
                        <span>{plan.cta}</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Payment Methods Section */}
              <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 lg:p-8 mb-8 shadow-lg shadow-black/10">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-400" />
                  Payment Methods
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Current Plan */}
                  <div className="p-6 bg-[#0B0F19] border border-[#1F2937] rounded-xl">
                    <h3 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4">
                      Current Plan
                    </h3>
                    
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-lg font-semibold text-white">Free Plan</span>
                          <span className="px-2 py-0.5 bg-[#1F2937] text-xs text-[#9CA3AF] rounded-full">
                            Active
                          </span>
                        </div>
                        <p className="text-sm text-[#6B7280]">
                          Next billing date: No billing
                        </p>
                      </div>
                    </div>
                    
                    <Link href="#pricing">
                      <button className="w-full lg:w-auto px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30">
                        Upgrade Plan
                      </button>
                    </Link>
                  </div>

                  {/* Saved Cards */}
                  <div className="p-6 bg-[#0B0F19] border border-[#1F2937] rounded-xl">
                    <h3 className="text-sm font-semibold text-[#9CA3AF] uppercase tracking-wider mb-4">
                      Payment Methods
                    </h3>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between p-3 bg-[#111827] border border-[#1F2937] rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
                          <div>
                            <p className="text-sm text-white">•••• •••• •••• 4242</p>
                            <p className="text-xs text-[#6B7280]">Expires 12/25</p>
                          </div>
                        </div>
                        <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                          Default
                        </span>
                      </div>
                    </div>
                    
                    <button className="w-full lg:w-auto px-6 py-2.5 border border-[#1F2937] hover:bg-[#1F2937] text-white text-sm font-medium rounded-xl transition-all duration-200">
                      + Add Payment Method
                    </button>
                  </div>
                </div>
              </div>

              {/* Billing History */}
              <div className="bg-[#111827] border border-[#1F2937] rounded-2xl p-6 lg:p-8 mb-8 shadow-lg shadow-black/10">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  Billing History
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1F2937]">
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Date</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Description</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Amount</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <BillingRow 
                        date="Jan 15, 2024"
                        description="Pro Plan - Monthly"
                        amount="$29.00"
                        status="Paid"
                      />
                      <BillingRow 
                        date="Dec 15, 2023"
                        description="Pro Plan - Monthly"
                        amount="$29.00"
                        status="Paid"
                      />
                      <BillingRow 
                        date="Nov 15, 2023"
                        description="Pro Plan - Monthly"
                        amount="$29.00"
                        status="Paid"
                      />
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 pt-4 border-t border-[#1F2937] text-center">
                  <Link href="/invoices">
                    <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 mx-auto">
                      <span>View all transactions</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-4 bg-[#111827] border border-[#1F2937] rounded-xl">
                  <Shield className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Enterprise Security</p>
                    <p className="text-xs text-[#6B7280]">SOC 2 Type II Certified</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-[#111827] border border-[#1F2937] rounded-xl">
                  <CreditCard className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Flexible Payments</p>
                    <p className="text-xs text-[#6B7280]">All major cards accepted</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-[#111827] border border-[#1F2937] rounded-xl">
                  <HelpCircle className="w-8 h-8 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">24/7 Support</p>
                    <p className="text-xs text-[#6B7280]">Dedicated assistance</p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-16 text-center">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                  <FAQItem 
                    question="What are credits?"
                    answer="Credits are used to generate datasets. 1 credit = 1 row of synthetic data generated."
                  />
                  <FAQItem 
                    question="Can I change plans anytime?"
                    answer="Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
                  />
                  <FAQItem 
                    question="Do unused credits roll over?"
                    answer="Credits reset monthly. Unused credits do not roll over to the next billing cycle."
                  />
                  <FAQItem 
                    question="Need a custom plan?"
                    answer="Contact our sales team for custom enterprise solutions tailored to your needs."
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function BillingRow({ date, description, amount, status }: { 
  date: string; 
  description: string; 
  amount: string; 
  status: string;
}) {
  return (
    <tr className="border-b border-[#1F2937] last:border-0 hover:bg-[#1F2937]/30 transition-colors">
      <td className="py-3 px-4 text-sm text-[#9CA3AF]">{date}</td>
      <td className="py-3 px-4 text-sm text-white">{description}</td>
      <td className="py-3 px-4 text-sm text-white font-medium">{amount}</td>
      <td className="py-3 px-4">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
          {status}
        </span>
      </td>
      <td className="py-3 px-4">
        <Link href={`/invoices/${date.toLowerCase().replace(/\s+/g, '-')}`}>
          <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
            Invoice
          </button>
        </Link>
      </td>
    </tr>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="p-4 bg-[#111827] border border-[#1F2937] rounded-xl text-left">
      <h4 className="text-sm font-medium text-white mb-1">{question}</h4>
      <p className="text-xs text-[#9CA3AF] leading-relaxed">{answer}</p>
    </div>
  );
}