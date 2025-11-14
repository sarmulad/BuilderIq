"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AdvancedDashboard } from "@/components/dashboard/advanced-dashboard"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Loader } from "lucide-react"

export default function DashboardPage() {
  const { user, loading, token } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!loading && !user && isClient) {
      router.push("/auth/login")
    }
  }, [user, loading, isClient, router])

  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <>
      <Header />
      <AdvancedDashboard token={token} />
      <Footer />
    </>
  )
}
