"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Loader } from "lucide-react"

export function UserManagement({ token }: { token: string | null }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch users from API
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin" size={32} />
      </div>
    )
  }

  return (
    <Card className="p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-foreground mb-4">User Management</h3>
      <p className="text-muted-foreground">User management features coming soon</p>
    </Card>
  )
}
