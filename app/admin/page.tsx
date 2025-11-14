"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  const { user, loading, token } = useAuth()
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN") && isClient) {
      router.push("/")
    }
  }, [user, loading, isClient, router])

  if (!isClient || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" size={32} />
      </div>
    )
  }

  if (!user || user.role !== "ADMIN") {
    return null
  }

  return <AdminDashboard token={token} />
}
