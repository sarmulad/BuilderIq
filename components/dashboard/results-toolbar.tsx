"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Grid3x3, List, MapIcon, Download, Save, TrendingUp, Building2, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ResultsToolbarProps {
  viewMode: "grid" | "list" | "map"
  onViewModeChange: (mode: "grid" | "list" | "map") => void
  totalResults: number
  onExport: (format: string) => void
  onSaveSearch: () => void
  stats?: {
    avgValue: number
    totalBuilders: number
    expiringThisWeek: number
  }
}

export function ResultsToolbar({
  viewMode,
  onViewModeChange,
  totalResults,
  onExport,
  onSaveSearch,
  stats,
}: ResultsToolbarProps) {
  return (
    <Card className="p-4 bg-white border-accent/20 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Results Count & Stats */}
        <div className="flex items-center gap-6">
          <div>
            <p className="text-2xl font-bold text-foreground">{totalResults}</p>
            <p className="text-sm text-muted-foreground">Results Found</p>
          </div>

          {stats && (
            <>
              <div className="h-10 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <DollarSign size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">${stats.avgValue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Avg Value</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Building2 size={16} className="text-accent" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{stats.totalBuilders}</p>
                  <p className="text-xs text-muted-foreground">Builders</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  <TrendingUp size={16} className="text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{stats.expiringThisWeek}</p>
                  <p className="text-xs text-muted-foreground">Expiring Soon</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("list")}
              className={viewMode === "list" ? "bg-accent text-accent-foreground" : ""}
            >
              <List size={16} />
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("grid")}
              className={viewMode === "grid" ? "bg-accent text-accent-foreground" : ""}
            >
              <Grid3x3 size={16} />
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("map")}
              className={viewMode === "map" ? "bg-accent text-accent-foreground" : ""}
            >
              <MapIcon size={16} />
            </Button>
          </div>

          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-accent/30 bg-transparent">
                <Download size={16} className="mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onExport("csv")}>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("excel")}>Export as Excel</DropdownMenuItem>
              <DropdownMenuItem onClick={() => onExport("pdf")}>Export as PDF</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Save Search */}
          <Button variant="outline" size="sm" onClick={onSaveSearch} className="border-accent/30 bg-transparent">
            <Save size={16} className="mr-2" />
            Save Search
          </Button>
        </div>
      </div>
    </Card>
  )
}
