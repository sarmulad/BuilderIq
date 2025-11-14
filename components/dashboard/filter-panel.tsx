"use client"

import { Card } from "@/components/ui/card"
import { INCENTIVE_TYPES } from "@/lib/constants"

export function FilterPanel({
  filters,
  onFilterChange,
}: {
  filters: any
  onFilterChange: (filters: any) => void
}) {
  return (
    <Card className="p-6 border border-slate-200 space-y-6">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">Incentive Type</label>
        <select
          value={filters.type}
          onChange={(e) => onFilterChange({ type: e.target.value })}
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        >
          <option value="">All Types</option>
          {INCENTIVE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.replace("_", " ")}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">City</label>
        <input
          type="text"
          value={filters.city}
          onChange={(e) => onFilterChange({ city: e.target.value })}
          placeholder="Enter city name"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">Builder</label>
        <input
          type="text"
          value={filters.builder}
          onChange={(e) => onFilterChange({ builder: e.target.value })}
          placeholder="Enter builder name"
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
        />
      </div>
    </Card>
  )
}
