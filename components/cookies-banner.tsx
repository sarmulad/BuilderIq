"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CookiesBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem("cookies-accepted");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookies-accepted", "true");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookies-accepted", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-lg z-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">We use cookies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use cookies and similar technologies to enhance your
              experience, analyze site traffic, and personalize content. By
              clicking "Accept All", you consent to our use of cookies. You can
              manage your preferences or learn more in our{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Button
              variant="outline"
              onClick={declineCookies}
              className="whitespace-nowrap bg-transparent"
            >
              Decline
            </Button>
            <Button onClick={acceptCookies} className="whitespace-nowrap">
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
