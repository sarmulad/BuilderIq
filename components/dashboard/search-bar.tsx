"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function SearchBar({
  query,
  onSearch,
  onApply,
}: {
  query: string
  onSearch: (q: string) => void
  onApply: () => void
}) {
  const [value, setValue] = useState(query)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(value)
    onApply()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search incentives by title, description..."
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
        Search
      </Button>
    </form>
  )
}
