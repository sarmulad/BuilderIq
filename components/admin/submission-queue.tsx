"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader, AlertCircle } from "lucide-react"

export function SubmissionQueue({ token }: { token: string | null }) {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("PENDING")

  const fetchSubmissions = async () => {
    try {
      const res = await fetch(`/api/admin/submissions?status=${filter}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (!res.ok) throw new Error("Failed to fetch")

      const data = await res.json()
      setSubmissions(data.submissions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch submissions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [filter])

  const approveSubmission = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!res.ok) throw new Error("Failed to approve")

      setSubmissions(submissions.filter((s: any) => s.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const rejectSubmission = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}/reject`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      if (!res.ok) throw new Error("Failed to reject")

      setSubmissions(submissions.filter((s: any) => s.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader className="animate-spin" size={32} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["PENDING", "APPROVED", "REJECTED"].map((status) => (
          <Button key={status} variant={filter === status ? "default" : "outline"} onClick={() => setFilter(status)}>
            {status}
          </Button>
        ))}
      </div>

      {error && (
        <Card className="p-4 bg-red-50 border border-red-200 flex items-start gap-3">
          <AlertCircle className="text-red-600" />
          <div className="text-red-700">{error}</div>
        </Card>
      )}

      {submissions.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">No submissions found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {submissions.map((submission: any) => (
            <Card key={submission.id} className="p-6 border border-slate-200">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-foreground mb-2">{submission.payload.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{submission.payload.descriptionRaw}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-semibold text-foreground">{submission.payload.incentiveType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Value</p>
                    <p className="font-semibold text-foreground">{submission.payload.valueText}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => approveSubmission(submission.id)}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => rejectSubmission(submission.id)}
                  variant="outline"
                  className="text-red-600 border-red-300"
                >
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
