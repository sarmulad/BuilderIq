import Link from "next/link";
import { Building2, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Building2 className="text-white" size={24} />
              </div>
              <div>
                <span className="font-serif font-bold text-2xl">BuilderIQ</span>
                <div className="text-xs text-primary-foreground/70 tracking-wider">
                  INTELLIGENCE PLATFORM
                </div>
              </div>
            </Link>
            <p className="text-primary-foreground/80 leading-relaxed mb-6">
              The premier builder intelligence platform for real estate
              professionals. Know every builder's deal before your buyers do.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-emerald-400" />
                <span className="text-primary-foreground/80">
                  hello@builderiq.com
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-emerald-400" />
                <span className="text-primary-foreground/80">
                  (317) 555-0100
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-emerald-400" />
                <span className="text-primary-foreground/80">
                  Indianapolis, IN
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/search"
                  className="text-primary-foreground/80 hover:text-emerald-400 transition"
                >
                  Search Incentives
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-primary-foreground/80 hover:text-emerald-400 transition"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/80 hover:text-emerald-400 transition"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/80 hover:text-emerald-400 transition"
                >
                  API Docs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-primary-foreground/80 hover:text-emerald-400 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/80 hover:text-emerald-400 transition"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/80 hover:text-emerald-400 transition"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-primary-foreground/80 hover:text-emerald-400 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/terms"
                  className="text-primary-foreground/80 hover:text-emerald-400 transition"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-primary-foreground/80 hover:text-emerald-400 transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/80 hover:text-emerald-400 transition"
                >
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-primary-foreground/80 hover:text-emerald-400 transition"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/60">
            &copy; 2025 BuilderIQ Intelligence Platform. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-primary-foreground/60 hover:text-emerald-400 transition text-sm"
            >
              LinkedIn
            </Link>
            <Link
              href="#"
              className="text-primary-foreground/60 hover:text-emerald-400 transition text-sm"
            >
              Twitter
            </Link>
            <Link
              href="#"
              className="text-primary-foreground/60 hover:text-emerald-400 transition text-sm"
            >
              Facebook
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
