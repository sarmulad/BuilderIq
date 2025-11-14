import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Building2, Target, Users, Award, TrendingUp, Shield, Zap } from "lucide-react"
import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="absolute inset-0 bg-[url('/hero-new-construction-home.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6">
            About BuilderIQ
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
            Empowering real estate professionals with the most comprehensive builder intelligence platform in the
            industry.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                BuilderIQ was founded by real estate professionals who experienced firsthand the challenges of tracking
                builder incentives across multiple markets. Tired of manually checking dozens of builder websites,
                calling sales offices, and missing out on time-sensitive opportunities, we set out to build a better
                solution.
              </p>
              <p>
                Today, BuilderIQ serves thousands of agents and brokers across the country, providing real-time access
                to builder incentives, quick-move-in inventory, and AI-powered marketing tools that help close more
                deals faster.
              </p>
              <div className="flex gap-8 pt-6">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    5,000+
                  </div>
                  <div className="text-sm text-gray-500">Active Agents</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    50+
                  </div>
                  <div className="text-sm text-gray-500">Builders Tracked</div>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    99.9%
                  </div>
                  <div className="text-sm text-gray-500">Uptime</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/modern-real-estate-dashboard-interface-data-analyt.jpg"
              alt="BuilderIQ Platform"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Our Mission & Values
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-emerald-500">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-white" size={28} />
              </div>
              <h3 className="font-bold text-2xl mb-4 text-gray-900">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To become the definitive source of builder intelligence, empowering every real estate professional with
                the data and tools they need to serve their clients better and close more deals.
              </p>
            </div>
            <div className="bg-white p-10 rounded-2xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-teal-500">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="text-white" size={28} />
              </div>
              <h3 className="font-bold text-2xl mb-4 text-gray-900">Our Values</h3>
              <p className="text-gray-600 leading-relaxed">
                Accuracy, transparency, and innovation drive everything we do. We believe in building tools that are
                powerful yet intuitive, comprehensive yet easy to use, and always reliable.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl font-bold text-center mb-12 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Why Choose BuilderIQ
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="text-emerald-600" size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Built by Agents</h3>
              <p className="text-gray-600 leading-relaxed">
                Our team understands your workflow because we've lived it. Every feature is designed with real-world
                agent needs in mind.
              </p>
            </div>
            <div className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Shield className="text-teal-600" size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Trusted Data</h3>
              <p className="text-gray-600 leading-relaxed">
                Advanced scraping and AI normalization ensure you get accurate, up-to-date information from every major
                builder, every day.
              </p>
            </div>
            <div className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="text-cyan-600" size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">AI-Powered Tools</h3>
              <p className="text-gray-600 leading-relaxed">
                Generate marketing content, automate alerts, and leverage cutting-edge AI to work smarter and close
                deals faster.
              </p>
            </div>
            <div className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="text-emerald-600" size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Real-Time Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                Never miss an opportunity with instant notifications when new incentives drop or inventory becomes
                available in your market.
              </p>
            </div>
            <div className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-teal-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-teal-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Award className="text-teal-600" size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Industry Leading</h3>
              <p className="text-gray-600 leading-relaxed">
                Trusted by top brokerages and agents nationwide, BuilderIQ is the most comprehensive builder
                intelligence platform available.
              </p>
            </div>
            <div className="group p-8 rounded-2xl border-2 border-gray-100 hover:border-cyan-200 hover:shadow-lg transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Target className="text-cyan-600" size={28} />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Continuous Innovation</h3>
              <p className="text-gray-600 leading-relaxed">
                We're constantly improving with new features, expanded coverage, and enhanced tools based on real agent
                feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-8 text-emerald-50">
            Join thousands of agents who are closing more deals with BuilderIQ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/auth/signup"
              className="px-8 py-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-lg"
            >
              Start Free Trial
            </a>
            <a
              href="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
