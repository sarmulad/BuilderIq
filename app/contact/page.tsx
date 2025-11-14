import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-emerald-100 leading-relaxed">
              Have questions? We're here to help you unlock builder intelligence.
            </p>
          </div>
        </section>

        {/* Contact Form and Info */}
        <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="p-8 bg-white">
                <h2 className="text-3xl font-bold mb-6 text-slate-900">Send us a message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone (Optional)</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      placeholder="(317) 555-0100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                    <select className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600">
                      <option>General Inquiry</option>
                      <option>Sales Question</option>
                      <option>Technical Support</option>
                      <option>Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                    <textarea
                      rows={5}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      placeholder="How can we help you?"
                    />
                  </div>

                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-3 text-lg shadow-lg shadow-emerald-500/30">
                    Send Message
                  </Button>
                </form>
              </Card>

              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6 text-slate-900">Contact Information</h2>
                  <p className="text-slate-600 leading-relaxed mb-8">
                    Reach out to us and we'll respond as soon as possible. We're here to support your success.
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                        <Mail className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Email Us</h3>
                        <p className="text-slate-600">hello@builderiq.com</p>
                        <p className="text-sm text-slate-500 mt-1">We reply within 24 hours</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-teal-500/30">
                        <Phone className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Call Us</h3>
                        <p className="text-slate-600">(317) 555-0100</p>
                        <p className="text-sm text-slate-500 mt-1">Mon-Fri, 9am-6pm EST</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
                        <MapPin className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Visit Us</h3>
                        <p className="text-slate-600">123 Monument Circle</p>
                        <p className="text-slate-600">Indianapolis, IN 46204</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                        <Clock className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-slate-900 mb-1">Business Hours</h3>
                        <p className="text-slate-600">Monday - Friday: 9am - 6pm</p>
                        <p className="text-slate-600">Saturday - Sunday: Closed</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
