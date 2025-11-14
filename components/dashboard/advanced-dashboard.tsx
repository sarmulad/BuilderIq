"use client"

import { useState, useEffect } from "react"
import { AdvancedSearch } from "./advanced-search"
import { ResultsToolbar } from "./results-toolbar"
import { IncentiveCard } from "./incentive-card"
import { Card } from "@/components/ui/card"
import { Loader, AlertCircle } from "lucide-react"

interface Incentive {
  id: string
  title: string
  descriptionAI: string
  incentiveType: string
  valueText: string
  valueAmount: number | null
  endDate: string | null
  builder: { name: string }
  community: { name: string; city: string } | null
}

export function AdvancedDashboard({ token }: { token: string | null }) {
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("list")
  const [savedSearches, setSavedSearches] = useState<Array<{ id: string; name: string; filters: any }>>([])
  const [currentFilters, setCurrentFilters] = useState({})

  // Mock stats - in production, calculate from API response
  const stats = {
    avgValue: 15000,
    totalBuilders: 8,
    expiringThisWeek: 12,
  }

  const fetchIncentives = async (filters: any) => {
    setLoading(true)
    setError("")
    setCurrentFilters(filters)

    try {
      const params = new URLSearchParams()
      if (filters.q) params.append("q", filters.q)
      if (filters.builders?.length) params.append("builder", filters.builders.join(","))
      if (filters.cities?.length) params.append("city", filters.cities.join(","))
      if (filters.types?.length) params.append("type", filters.types.join(","))
      if (filters.sortBy) params.append("sortBy", filters.sortBy)

      const res = await fetch(`/api/incentives?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })

      if (!res.ok) throw new Error("Failed to fetch")

      const data = await res.json()
      setIncentives(data.incentives)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch incentives")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSearch = (name: string) => {
    const newSearch = {
      id: Date.now().toString(),
      name,
      filters: currentFilters,
    }
    setSavedSearches([...savedSearches, newSearch])
  }

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`)
    // Implementation for export functionality
  }

  useEffect(() => {
    fetchIncentives({})
  }, [])

  return (
    <div className="bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-accent/20 py-8 px-4 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-2 font-serif">Builder Intelligence Search</h1>
          <p className="text-muted-foreground">Advanced search and filtering for real estate professionals</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Advanced Search */}
        <AdvancedSearch
          onSearch={fetchIncentives}
          onSaveSearch={handleSaveSearch}
          savedSearches={savedSearches}
          currentFilters={currentFilters}
        />

        {/* Results Toolbar */}
        <ResultsToolbar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalResults={incentives.length}
          onExport={handleExport}
          onSaveSearch={() => {
            const name = prompt("Enter a name for this search:")
            if (name) handleSaveSearch(name)
          }}
          stats={stats}
        />

        {/* Results */}
        {error && (
          <Card className="p-4 bg-red-50 border border-red-200 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" />
            <div className="text-red-700">{error}</div>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="animate-spin text-accent" size={32} />
          </div>
        ) : incentives.length === 0 ? (
          <Card className="p-12 text-center bg-white border-accent/20 shadow-premium">
            <div className="max-w-md mx-auto">
              <p className="text-xl font-semibold text-foreground mb-2">No results found</p>
              <p className="text-muted-foreground">
                Try adjusting your filters or search terms to find what you're looking for
              </p>
            </div>
          </Card>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-4" : "space-y-4"}>
            {incentives.map((incentive) => (
              <IncentiveCard key={incentive.id} incentive={incentive} token={token} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
