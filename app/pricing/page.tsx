import { Header } from "@/components/landing/header"
import { PricingSection } from "@/components/landing/pricing-section"
import { Footer } from "@/components/landing/footer"

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="py-12"></div>
      <PricingSection />
      <Footer />
    </main>
  )
}
