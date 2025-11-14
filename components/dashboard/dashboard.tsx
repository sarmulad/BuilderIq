"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { SearchBar } from "./search-bar"
import { FilterPanel } from "./filter-panel"
import { IncentiveCard } from "./incentive-card"
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

export function Dashboard({ token }: { token: string | null }) {
  const [incentives, setIncentives] = useState<Incentive[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    q: "",
    builder: "",
    city: "",
    type: "",
    page: 1,
  })

  const fetchIncentives = async () => {
    setLoading(true)
    setError("")

    try {
      const params = new URLSearchParams()
      if (filters.q) params.append("q", filters.q)
      if (filters.builder) params.append("builder", filters.builder)
      if (filters.city) params.append("city", filters.city)
      if (filters.type) params.append("type", filters.type)
      params.append("page", filters.page.toString())

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

  useEffect(() => {
    fetchIncentives()
  }, [filters.page])

  const handleSearch = (q: string) => {
    setFilters({ ...filters, q, page: 1 })
  }

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters, page: 1 })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-4">Builder Incentives</h1>
          <p className="text-muted-foreground">Search and filter the latest incentives from all major builders</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <SearchBar query={filters.q} onSearch={handleSearch} onApply={fetchIncentives} />

            {error && (
              <Card className="p-4 bg-red-50 border border-red-200 mb-6 flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0" />
                <div className="text-red-700">{error}</div>
              </Card>
            )}

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader className="animate-spin text-primary" size={32} />
              </div>
            ) : incentives.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No incentives found. Try adjusting your filters.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {incentives.map((incentive) => (
                  <IncentiveCard key={incentive.id} incentive={incentive} token={token} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
