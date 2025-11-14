"use client";

import type React from "react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/landing/header";
import {
  Bell,
  Brain,
  Users,
  CheckCircle,
  Mail,
  Clock,
  Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase/client";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: insertError } = await supabase.from("waitlist").insert([
        {
          email,
          user_type: "other",
          referral_source: "landing_page",
        },
      ]);

      if (insertError) {
        // Handle duplicate email gracefully
        if (insertError.code === "23505") {
          setError("You're already on the list!");
        } else {
          throw insertError;
        }
      } else {
        setSubmitted(true);
        setEmail("");
        setTimeout(() => setSubmitted(false), 5000);
      }
    } catch (err) {
      console.error("[v0] Email submission error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="relative min-h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-new-construction-home.jpg"
            alt="Indiana new construction homes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#b22222]/95 via-[#8B0000]/90 to-[#FF4500]/85" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="text-yellow-300" size={18} />
              <span className="text-white text-sm font-medium">
                Launching Soon in Indiana
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
              The AI Engine for Indiana Builder Deals & Incentives
            </h1>

            <p className="text-xl md:text-2xl text-white/95 mb-6 leading-relaxed max-w-3xl mx-auto">
              Every week, Indiana builders roll out{" "}
              <span className="font-bold text-yellow-300">
                3.99% rate buydowns
              </span>
              ,{" "}
              <span className="font-bold text-yellow-300">
                $10K–$45K design credits
              </span>
              , free upgrades, and paid closing costs.
            </p>

            <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Most agents and buyers never hear about them until it's too late.{" "}
              <span className="font-bold">BuilderIQ.IN changes that</span> —
              tracking every builder incentive in the state, updated weekly.
            </p>

            <Button
              size="lg"
              onClick={() =>
                document
                  .getElementById("early-access")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-white text-[#b22222] hover:bg-white/90 text-xl px-10 py-7 h-auto shadow-2xl hover:shadow-white/20 transition-all"
            >
              <Bell className="mr-2" size={24} />
              Join the Early Access List
            </Button>

            <p className="text-sm text-white/70 mt-4">
              Get exclusive updates and first access before launch
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-6">
                <Brain className="text-[#b22222]" size={20} />
                <span className="text-[#b22222] font-semibold text-sm">
                  What Is BuilderIQ.IN?
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6 leading-tight">
                The First AI-Powered Dashboard Built for Indiana's Builder
                Market
              </h2>

              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                BuilderIQ.IN tracks every active builder incentive — rate
                buydowns, design credits, closing cost bonuses, inventory
                discounts, and limited-time offers — then delivers them in one
                simple weekly dashboard.
              </p>

              <p className="text-lg text-muted-foreground leading-relaxed">
                Whether you're a{" "}
                <span className="font-bold text-foreground">Realtor</span>,{" "}
                <span className="font-bold text-foreground">builder</span>, or{" "}
                <span className="font-bold text-foreground">buyer</span>,
                BuilderIQ.IN gives you the information edge you've been missing.
              </p>
            </div>

            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 border-2 border-slate-200">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-sm font-semibold text-[#b22222] mb-4">
                  Builder Incentive Tracker
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <div className="font-semibold text-sm">DR Horton</div>
                      <div className="text-xs text-muted-foreground">
                        3.99% FHA Rate
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-red-600 font-medium">
                        Ends Dec 31
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <div className="font-semibold text-sm">M/I Homes</div>
                      <div className="text-xs text-muted-foreground">
                        $10K Design Credit
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#b22222] font-medium">
                        Active Now
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <div className="font-semibold text-sm">Lennar</div>
                      <div className="text-xs text-muted-foreground">
                        4.25% Rate on Move-Ins
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-amber-600 font-medium">
                        Limited Time
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Built for Indiana. Built for Builders.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-8 hover:shadow-xl transition-shadow bg-white border-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#b22222] to-[#8B0000] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-500/30">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Realtors</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Know every builder deal before your competition. Impress
                clients. Close faster.
              </p>
              <p className="font-semibold text-[#b22222]">
                Look like the insider you are.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow bg-white border-2 border-red-200 relative">
              <div className="absolute -top-3 right-4 bg-[#b22222] text-white px-3 py-1 rounded-full text-xs font-semibold">
                Most Popular
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF4500] to-[#FF6B6B] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Builders</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Get your incentives in front of thousands of active buyers and
                agents.
              </p>
              <p className="font-semibold text-[#FF4500]">
                More visibility. More closings. Less wasted ad spend.
              </p>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow bg-white border-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#DC143C] to-[#FF6B6B] rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-red-400/30">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Buyers</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Don't overpay for new construction. Compare builder incentives
                side-by-side.
              </p>
              <p className="font-semibold text-[#DC143C]">
                Find the best deal in your area.
              </p>
            </Card>
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() =>
                document
                  .getElementById("early-access")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-gradient-to-r from-[#b22222] to-[#FF4500] hover:from-[#8B0000] hover:to-[#DC143C] text-white text-lg px-8 py-6 h-auto shadow-xl"
            >
              Join the Early Access List
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="text-[#b22222]" size={20} />
            <span className="text-[#b22222] font-semibold text-sm">
              Why BuilderIQ.IN Exists
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-8 leading-tight">
            The Problem We're Solving
          </h2>

          <div className="text-lg text-muted-foreground space-y-6 leading-relaxed mb-8">
            <p>
              The average buyer never sees{" "}
              <span className="font-bold text-foreground">
                half the builder incentives
              </span>{" "}
              available in their area — because they're scattered across dozens
              of sites, flyers, and email blasts.
            </p>

            <p>
              Agents waste{" "}
              <span className="font-bold text-foreground">
                hours chasing them down
              </span>
              .
            </p>

            <p className="text-xl font-semibold text-foreground">
              BuilderIQ.IN uses AI to collect, verify, and organize every
              current builder incentive in one place.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-[#b22222] mb-2">
                Simple
              </div>
              <div className="text-sm text-muted-foreground">One dashboard</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FF4500] mb-2">
                Smart
              </div>
              <div className="text-sm text-muted-foreground">AI-powered</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#DC143C] mb-2">
                Local
              </div>
              <div className="text-sm text-muted-foreground">
                Indiana focused
              </div>
            </div>
          </div>

          <p className="text-xl font-serif font-bold text-foreground mt-12">
            It's time Indiana had its own builder intelligence platform.
          </p>
        </div>
      </section>

      <section
        id="early-access"
        className="py-20 bg-gradient-to-br from-[#b22222] via-[#8B0000] to-[#FF4500]"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Clock className="text-yellow-300" size={18} />
            <span className="text-white text-sm font-medium">
              Launching Soon
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
            Launching Soon in Indiana
          </h2>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">
              Early Access Members Get:
            </h3>
            <div className="grid md:grid-cols-3 gap-6 text-white">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-yellow-300 flex-shrink-0 mt-1"
                  size={20}
                />
                <div className="text-left">
                  <div className="font-semibold mb-1">First Look</div>
                  <div className="text-sm text-white/80">
                    Live builder incentives statewide
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-yellow-300 flex-shrink-0 mt-1"
                  size={20}
                />
                <div className="text-left">
                  <div className="font-semibold mb-1">Free Weekly Report</div>
                  <div className="text-sm text-white/80">
                    Before public release
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-yellow-300 flex-shrink-0 mt-1"
                  size={20}
                />
                <div className="text-left">
                  <div className="font-semibold mb-1">Founding Member</div>
                  <div className="text-sm text-white/80">
                    Lifetime special pricing
                  </div>
                </div>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="bg-white rounded-xl p-8 max-w-md mx-auto">
              <CheckCircle
                className="text-emerald-600 mx-auto mb-4"
                size={48}
              />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                You're In!
              </h3>
              <p className="text-muted-foreground">
                We'll send you updates as we get closer to launch.
              </p>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleEmailSubmit}
                className="max-w-lg mx-auto mb-6"
              >
                <div className="flex flex-col sm:flex-row gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email to join the Early Access List"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white text-foreground flex-1 h-14 text-lg"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-yellow-400 text-[#8B0000] hover:bg-yellow-300 h-14 px-8 font-bold text-lg shadow-xl disabled:opacity-50"
                  >
                    <Bell className="mr-2" size={20} />
                    {isLoading ? "Joining..." : "Reserve My Spot"}
                  </Button>
                </div>
                {error && (
                  <p className="text-yellow-300 text-sm mt-2 bg-white/10 backdrop-blur-sm rounded-lg py-2 px-4">
                    {error}
                  </p>
                )}
              </form>

              <p className="text-white/80 text-sm">
                Launching in{" "}
                <span className="font-bold text-yellow-300">30 Days</span> —
                limited Founding Member spots available
              </p>
            </>
          )}
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-flex items-center gap-2 bg-red-100 rounded-full px-4 py-2 mb-6">
                <Users className="text-[#b22222]" size={20} />
                <span className="text-[#b22222] font-semibold text-sm">
                  Meet The Founder
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-6">
                Created by Indiana Realtor Jack Crenshaw
              </h2>

              <p className="text-muted-foreground mb-4 text-sm">
                Trueblood Real Estate | JustJack.Realtor
              </p>

              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  BuilderIQ.IN was built by an active Indiana Realtor who got
                  tired of watching clients miss out on builder incentives
                  because nobody tracked them.
                </p>

                <p className="font-semibold text-foreground">
                  Built in Indiana. For Indiana. By someone who lives and
                  breathes new construction daily.
                </p>
              </div>

              <div className="mt-8 p-6 bg-white rounded-xl border-2 border-red-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#b22222] to-[#FF4500] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">JC</span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">
                      Jack Crenshaw
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Indiana's Builder Data Guy
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Covering Indianapolis • Fishers • Bloomington • Brown County
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#b22222] to-[#FF4500] rounded-2xl transform rotate-3"></div>
                <img
                  src="/jack.jpg"
                  alt="Jack Crenshaw - Founder"
                  className="relative rounded-2xl shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-foreground mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
              <h3 className="text-xl font-bold text-foreground mb-3">
                What exactly will BuilderIQ.IN show?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Every builder incentive in Indiana — rate buydowns, design
                credits, price reductions, closing cost bonuses — updated
                weekly.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Is BuilderIQ.IN free?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Early access is free. When we launch, agents and builders can
                upgrade to Pro accounts for full access.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Can builders submit their own incentives?
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Yes. Builders and agents will be able to upload offers directly
                to the dashboard once we go live.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#b22222] to-[#FF4500] rounded-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Users className="text-white" size={24} />
                </div>
                <div>
                  <span className="font-serif font-bold text-3xl">
                    BuilderIQ.IN
                  </span>
                  <div className="text-xs text-white/70 tracking-wider">
                    Built in Indiana. Built for Builders.
                  </div>
                </div>
              </Link>
              <p className="text-white/80 leading-relaxed mb-6 max-w-lg">
                A Just Jack Real Estate Project | Trueblood Real Estate
              </p>
              <p className="text-white/70 text-sm mb-4">
                Indianapolis • Fishers • Bloomington • Brown County
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Connect</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#FF6B6B]" />
                  <a
                    href="mailto:info@BuilderIQ.IN"
                    className="text-white/80 hover:text-[#FF6B6B] transition text-sm"
                  >
                    info@BuilderIQ.IN
                  </a>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <Link
                  href="#"
                  className="text-white/60 hover:text-[#FF6B6B] transition"
                >
                  Instagram
                </Link>
                <Link
                  href="#"
                  className="text-white/60 hover:text-[#FF6B6B] transition"
                >
                  Facebook
                </Link>
                <Link
                  href="#"
                  className="text-white/60 hover:text-[#FF6B6B] transition"
                >
                  LinkedIn
                </Link>
                <Link
                  href="#"
                  className="text-white/60 hover:text-[#FF6B6B] transition"
                >
                  YouTube
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-sm text-white/60">
              © 2025 BuilderIQ.IN — Built in Indiana. Built for Builders.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
