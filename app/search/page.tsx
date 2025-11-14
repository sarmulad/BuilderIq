"use client"

import { AdvancedDashboard } from "@/components/dashboard/advanced-dashboard"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"

export default function SearchPage() {
  const { token } = useAuth()

  return (
    <>
      <Header />
      <AdvancedDashboard token={token} />
      <Footer />
    </>
  )
}
