"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-border bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-[#b22222]/95 via-[#8B0000]/90 to-[#FF4500]/85 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <Building2 className="text-white" size={22} />
          </div>
          <span className="font-serif font-bold text-2xl text-primary">
            BuilderIQ
          </span>
        </Link>

        {/* <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/search"
            className="text-foreground hover:text-[#b22222] font-medium transition text-sm"
          >
            Search Incentives
          </Link>
          <Link
            href="/pricing"
            className="text-foreground hover:text-[#b22222] font-medium transition text-sm"
          >
            Pricing
          </Link>
          <Link
            href="/about"
            className="text-foreground hover:text-[#b22222] font-medium transition text-sm"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-foreground hover:text-[#b22222] font-medium transition text-sm"
          >
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link href="/app/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r bg-[#b22222] hover:from-red-700 hover:to-red-700 text-white shadow-lg shadow-emerald-500/30"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div> */}
      </div>
    </header>
  );
}
