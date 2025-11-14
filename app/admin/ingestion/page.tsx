"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function DataIngestionPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleIngest() {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/admin/ingest", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ingestion failed")
      }

      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Data Ingestion Control</h1>

        <Card className="p-6 mb-6">
          <p className="text-foreground/80 mb-6">
            Trigger scraper to fetch and normalize builder incentive data from all sources.
          </p>

          <Button onClick={handleIngest} disabled={loading} size="lg" className="w-full">
            {loading ? "Ingesting..." : "Start Data Ingestion"}
          </Button>
        </Card>

        {error && (
          <Card className="p-4 bg-red-50 border-red-200 mb-6">
            <p className="text-red-800 font-mono text-sm">{error}</p>
          </Card>
        )}

        {result && (
          <Card className="p-6 bg-green-50 border-green-200">
            <h2 className="font-bold text-green-900 mb-4">{result.message}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-green-700">Created</p>
                <p className="text-2xl font-bold text-green-900">{result.stats.created}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Updated</p>
                <p className="text-2xl font-bold text-green-900">{result.stats.updated}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Total</p>
                <p className="text-2xl font-bold text-green-900">{result.stats.total}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
