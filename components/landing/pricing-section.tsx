"use client"

import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, Star } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for exploring the platform",
      features: [
        "Search up to 3 builders",
        "Weekly market digest",
        "100 saved searches",
        "Basic filtering",
        "Email support",
      ],
      cta: "Get Started Free",
      href: "/auth/signup",
    },
    {
      name: "Professional",
      price: "$49",
      description: "For active agents and brokers",
      period: "/month",
      features: [
        "Unlimited builder search",
        "AI marketing generator",
        "Daily & weekly alerts",
        "Unlimited saved searches",
        "CSV export & reporting",
        "Priority support",
        "Mobile app access",
      ],
      cta: "Start 14-Day Free Trial",
      href: "/auth/signup?plan=pro",
      highlight: true,
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$199",
      description: "For teams and brokerages",
      period: "/month",
      features: [
        "Everything in Professional",
        "5 team member seats",
        "Advanced analytics dashboard",
        "White-label options",
        "API access",
        "Custom integrations",
        "Dedicated account manager",
      ],
      cta: "Schedule Demo",
      href: "/contact",
    },
  ]

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Transparent, Value-Driven Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Choose the plan that fits your business. All plans include our core intelligence features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <Card
              key={i}
              className={`p-8 border-2 flex flex-col relative ${
                plan.highlight
                  ? "border-emerald-600 shadow-2xl md:scale-105 bg-gradient-to-br from-emerald-50 to-teal-50"
                  : "border-border hover:border-emerald-300 hover:shadow-xl transition-all"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                    <Star size={14} className="fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-5xl font-serif font-bold text-foreground">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground text-lg">{plan.period}</span>}
              </div>

              <ul className="space-y-4 flex-1 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={14} className="text-emerald-600" />
                    </div>
                    <span className="text-foreground leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href} className="w-full">
                <Button
                  className="w-full h-12 font-semibold text-base"
                  variant={plan.highlight ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Need more than 5 seats or custom features?</p>
          <Link href="/contact">
            <Button variant="outline" size="lg" className="font-semibold bg-transparent">
              Contact Sales for Custom Pricing
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
