"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Share2, MapPin, Building2, Calendar, DollarSign, ExternalLink, Sparkles } from "lucide-react"
import { formatCurrency, calculateDaysUntilExpiry, formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

export function IncentiveCard({
  incentive,
  token,
}: {
  incentive: any
  token: string | null
}) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const daysUntilExpiry = calculateDaysUntilExpiry(incentive.endDate)

  const toggleFavorite = async () => {
    if (!token) return

    try {
      if (isFavorited) {
        await fetch(`/api/favorites?incentiveId=${incentive.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ incentiveId: incentive.id }),
        })
      }
      setIsFavorited(!isFavorited)
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  const handleGenerateContent = async () => {
    if (!token) return
    setIsGenerating(true)
    // Implementation for content generation
    setTimeout(() => setIsGenerating(false), 2000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: incentive.title,
        text: incentive.descriptionAI,
        url: window.location.href,
      })
    }
  }

  return (
    <Card className="group relative overflow-hidden bg-white border-emerald-200/50 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600" />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-300 font-semibold">
                {incentive.incentiveType.replace("_", " ")}
              </Badge>
              {daysUntilExpiry && daysUntilExpiry <= 7 && (
                <Badge className="bg-red-50 text-red-700 border-red-200 animate-pulse">
                  <Calendar size={12} className="mr-1" />
                  Expires in {daysUntilExpiry}d
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-emerald-600 transition-colors">
              {incentive.title}
            </h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Building2 size={14} className="text-emerald-600" />
                {incentive.builder.name}
              </div>
              {incentive.community && (
                <>
                  <span className="text-border">•</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} className="text-emerald-600" />
                    {incentive.community.city}
                  </div>
                </>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFavorite}
            className={cn("transition-all", isFavorited && "text-red-500")}
          >
            <Heart size={20} className={cn("transition-all", isFavorited && "fill-red-500")} />
          </Button>
        </div>

        {/* Description */}
        <p className="text-foreground mb-6 leading-relaxed line-clamp-2">{incentive.descriptionAI}</p>

        {/* Value Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-3 border border-emerald-200">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={14} className="text-emerald-600" />
              <p className="text-xs text-muted-foreground font-medium">Value</p>
            </div>
            <p className="text-lg font-bold text-foreground">
              {incentive.valueAmount ? formatCurrency(incentive.valueAmount) : incentive.valueText}
            </p>
          </div>

          {incentive.community && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200">
              <div className="flex items-center gap-2 mb-1">
                <MapPin size={14} className="text-blue-600" />
                <p className="text-xs text-muted-foreground font-medium">Community</p>
              </div>
              <p className="text-sm font-bold text-foreground truncate">{incentive.community.name}</p>
            </div>
          )}

          {incentive.endDate && (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-3 border border-amber-200">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={14} className="text-amber-600" />
                <p className="text-xs text-muted-foreground font-medium">Expires</p>
              </div>
              <p className="text-sm font-bold text-foreground">{formatDate(incentive.endDate)}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="border-emerald-300 hover:bg-emerald-50 bg-transparent"
          >
            <Share2 size={16} />
            Share
          </Button>

          <Button variant="outline" size="sm" className="border-emerald-300 hover:bg-emerald-50 bg-transparent">
            <ExternalLink size={16} />
            Details
          </Button>

          <Button
            className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30"
            size="sm"
            onClick={handleGenerateContent}
            disabled={isGenerating}
          >
            <Sparkles size={16} className={cn("mr-2", isGenerating && "animate-spin")} />
            {isGenerating ? "Generating..." : "Generate Marketing"}
          </Button>
        </div>
      </div>
    </Card>
  )
}
