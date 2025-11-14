"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  SlidersHorizontal,
  Save,
  TrendingUp,
  DollarSign,
  Building2,
  MapPin,
  Clock,
  Filter,
  X,
  ChevronDown,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface AdvancedSearchProps {
  onSearch: (filters: any) => void
  onSaveSearch: (name: string) => void
  savedSearches: Array<{ id: string; name: string; filters: any }>
  currentFilters: any
}

export function AdvancedSearch({ onSearch, onSaveSearch, savedSearches, currentFilters }: AdvancedSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeFilters, setActiveFilters] = useState<any>({
    builders: [],
    cities: [],
    types: [],
    valueRange: { min: 0, max: 100000 },
    expiringIn: "",
    community: "",
    sortBy: "newest",
  })

  const handleAddFilter = (category: string, value: string) => {
    setActiveFilters({
      ...activeFilters,
      [category]: [...(activeFilters[category] || []), value],
    })
  }

  const handleRemoveFilter = (category: string, value: string) => {
    setActiveFilters({
      ...activeFilters,
      [category]: activeFilters[category].filter((v: string) => v !== value),
    })
  }

  const clearAllFilters = () => {
    setActiveFilters({
      builders: [],
      cities: [],
      types: [],
      valueRange: { min: 0, max: 100000 },
      expiringIn: "",
      community: "",
      sortBy: "newest",
    })
    setSearchQuery("")
  }

  const applyFilters = () => {
    onSearch({ q: searchQuery, ...activeFilters })
  }

  const activeFilterCount =
    activeFilters.builders.length +
    activeFilters.cities.length +
    activeFilters.types.length +
    (activeFilters.expiringIn ? 1 : 0) +
    (activeFilters.community ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <Card className="p-6 bg-white border-accent/20 shadow-premium">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-4 text-muted-foreground" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              placeholder="Search by builder, city, incentive type, community..."
              className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-foreground text-base bg-background"
            />
          </div>

          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="relative border-accent/30"
          >
            <SlidersHorizontal size={20} />
            Advanced
            {activeFilterCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-accent text-accent-foreground">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          <Button
            size="lg"
            onClick={applyFilters}
            className="px-8 bg-accent hover:bg-accent/90 text-accent-foreground shadow-premium"
          >
            <Search size={20} />
            Search
          </Button>
        </div>

        {/* Active Filter Pills */}
        {activeFilterCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm text-muted-foreground font-medium">Active Filters:</span>

            {activeFilters.builders.map((builder: string) => (
              <Badge key={builder} variant="secondary" className="px-3 py-1 gap-2">
                <Building2 size={14} />
                {builder}
                <button onClick={() => handleRemoveFilter("builders", builder)} className="hover:text-destructive">
                  <X size={14} />
                </button>
              </Badge>
            ))}

            {activeFilters.cities.map((city: string) => (
              <Badge key={city} variant="secondary" className="px-3 py-1 gap-2">
                <MapPin size={14} />
                {city}
                <button onClick={() => handleRemoveFilter("cities", city)} className="hover:text-destructive">
                  <X size={14} />
                </button>
              </Badge>
            ))}

            {activeFilters.types.map((type: string) => (
              <Badge key={type} variant="secondary" className="px-3 py-1 gap-2">
                <DollarSign size={14} />
                {type}
                <button onClick={() => handleRemoveFilter("types", type)} className="hover:text-destructive">
                  <X size={14} />
                </button>
              </Badge>
            ))}

            {activeFilters.expiringIn && (
              <Badge variant="secondary" className="px-3 py-1 gap-2">
                <Clock size={14} />
                Expiring in {activeFilters.expiringIn}
                <button
                  onClick={() => setActiveFilters({ ...activeFilters, expiringIn: "" })}
                  className="hover:text-destructive"
                >
                  <X size={14} />
                </button>
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          </div>
        )}
      </Card>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <Card className="p-6 bg-white border-accent/20 shadow-premium animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Builder Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Building2 size={16} className="text-accent" />
                Builders
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    Select Builders <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => handleAddFilter("builders", "D.R. Horton")}>
                    D.R. Horton
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddFilter("builders", "Lennar")}>Lennar</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddFilter("builders", "M/I Homes")}>
                    M/I Homes
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddFilter("builders", "Arbor Homes")}>
                    Arbor Homes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                Cities
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    Select Cities <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => handleAddFilter("cities", "Indianapolis")}>
                    Indianapolis
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddFilter("cities", "Carmel")}>Carmel</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddFilter("cities", "Fishers")}>Fishers</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddFilter("cities", "Westfield")}>Westfield</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddFilter("cities", "Noblesville")}>
                    Noblesville
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Incentive Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <DollarSign size={16} className="text-accent" />
                Incentive Type
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between bg-transparent">
                    Select Type <ChevronDown size={16} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem onClick={() => handleAddFilter("types", "Rate Buydown")}>
                    Rate Buydown
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddFilter("types", "Closing Costs")}>
                    Closing Costs
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddFilter("types", "Free Upgrades")}>
                    Free Upgrades
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAddFilter("types", "Price Reduction")}>
                    Price Reduction
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Value Range */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp size={16} className="text-accent" />
                Value Range
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={activeFilters.valueRange.min}
                  onChange={(e) =>
                    setActiveFilters({
                      ...activeFilters,
                      valueRange: { ...activeFilters.valueRange, min: Number(e.target.value) },
                    })
                  }
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={activeFilters.valueRange.max}
                  onChange={(e) =>
                    setActiveFilters({
                      ...activeFilters,
                      valueRange: { ...activeFilters.valueRange, max: Number(e.target.value) },
                    })
                  }
                  className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
                />
              </div>
            </div>

            {/* Expiring Soon */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Clock size={16} className="text-accent" />
                Expiring Soon
              </label>
              <select
                value={activeFilters.expiringIn}
                onChange={(e) => setActiveFilters({ ...activeFilters, expiringIn: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
              >
                <option value="">Any Time</option>
                <option value="7 days">Next 7 days</option>
                <option value="14 days">Next 14 days</option>
                <option value="30 days">Next 30 days</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Filter size={16} className="text-accent" />
                Sort By
              </label>
              <select
                value={activeFilters.sortBy}
                onChange={(e) => setActiveFilters({ ...activeFilters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-foreground"
              >
                <option value="newest">Newest First</option>
                <option value="expiring">Expiring Soon</option>
                <option value="highest_value">Highest Value</option>
                <option value="lowest_value">Lowest Value</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-border">
            <Button variant="outline" onClick={clearAllFilters} className="border-accent/30 bg-transparent">
              Reset Filters
            </Button>
            <Button
              onClick={applyFilters}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground shadow-premium"
            >
              Apply Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card className="p-4 bg-white border-accent/20 shadow-sm">
          <div className="flex items-center gap-4 overflow-x-auto">
            <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">Saved Searches:</span>
            {savedSearches.map((search) => (
              <Button
                key={search.id}
                variant="ghost"
                size="sm"
                onClick={() => onSearch(search.filters)}
                className="whitespace-nowrap"
              >
                <Save size={14} className="mr-2" />
                {search.name}
              </Button>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
