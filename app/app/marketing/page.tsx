"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { MarketingGenerator } from "@/components/marketing/marketing-generator"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Loader } from "lucide-react"

export default function MarketingPage() {
  const { user, loading } = useAuth()
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader className="animate-spin text-navy-600" size={40} />
      </div>
    )
  }

  if (!user) return null

  return (
    <>
      <Header />
      <MarketingGenerator />
      <Footer />
    </>
  )
}
