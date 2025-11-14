"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader, Copy, Check, Facebook, Instagram, Linkedin, Twitter, Mail, Share2, Sparkles } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface MarketingContent {
  incentive_id: string
  instagram: string
  facebook: string
  linkedin: string
  twitter: string
  email: string
  property_details: {
    builder: string
    community: string
    location: string
    incentive_type: string
    incentive_value: number | null
    expiration: string | null
  }
}

export function MarketingGenerator() {
  const [incentiveId, setIncentiveId] = useState("")
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState<MarketingContent | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [error, setError] = useState("")

  const generateContent = async () => {
    if (!incentiveId.trim()) {
      setError("Please enter an incentive ID")
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = await apiClient.generateMarketingContent(incentiveId)
      setContent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate content")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const shareToSocial = (platform: string, text: string) => {
    const encodedText = encodeURIComponent(text)
    let url = ""

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`
        break
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodedText}`
        break
      case "linkedin":
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${encodedText}`
        break
      case "instagram":
        copyToClipboard(text, "instagram-share")
        alert("Content copied! Instagram doesn't support direct sharing. Please paste in the Instagram app.")
        return
    }

    window.open(url, "_blank", "width=600,height=400")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 border-b border-navy-700 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="text-gold-500" size={32} />
            <h1 className="text-4xl font-display font-bold text-white">Marketing Content Generator</h1>
          </div>
          <p className="text-navy-200 text-lg">
            AI-powered marketing content for every platform. Generate professional posts in seconds.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-2 border-navy-100 shadow-premium space-y-6 sticky top-4 bg-white">
              <div>
                <label className="block text-sm font-semibold text-navy-900 mb-3">Incentive ID</label>
                <Input
                  value={incentiveId}
                  onChange={(e) => setIncentiveId(e.target.value)}
                  placeholder="Enter ID from dashboard"
                  className="border-2 border-navy-200 focus:border-gold-500 transition-colors"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700 text-sm font-medium">
                  {error}
                </div>
              )}

              <Button
                onClick={generateContent}
                disabled={loading}
                className="w-full bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" size={20} />
                    Generate Content
                  </>
                )}
              </Button>

              {content && (
                <div className="pt-6 border-t border-navy-100">
                  <h4 className="text-xs font-semibold text-navy-600 uppercase tracking-wide mb-3">Property Details</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-navy-500">Builder:</span>
                      <p className="font-medium text-navy-900">{content.property_details.builder}</p>
                    </div>
                    <div>
                      <span className="text-navy-500">Community:</span>
                      <p className="font-medium text-navy-900">{content.property_details.community}</p>
                    </div>
                    <div>
                      <span className="text-navy-500">Location:</span>
                      <p className="font-medium text-navy-900">{content.property_details.location}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Content Display */}
          <div className="lg:col-span-3 space-y-6">
            {!content && (
              <Card className="p-16 text-center border-2 border-dashed border-navy-200 bg-white/50">
                <Sparkles className="mx-auto mb-4 text-navy-300" size={48} />
                <p className="text-navy-500 text-lg">
                  Enter an incentive ID and click generate to create AI-powered marketing content
                </p>
              </Card>
            )}

            {content && (
              <>
                {/* Instagram */}
                <Card className="p-8 border-2 border-navy-100 shadow-premium bg-white overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                        <Instagram className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-navy-900">Instagram Post</h3>
                        <p className="text-sm text-navy-500">Visual storytelling with hashtags</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(content.instagram, "instagram")}
                        className="border-2 border-navy-200 hover:border-navy-300"
                      >
                        {copied === "instagram" ? (
                          <Check size={16} className="mr-1" />
                        ) : (
                          <Copy size={16} className="mr-1" />
                        )}
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => shareToSocial("instagram", content.instagram)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                      >
                        <Share2 size={16} className="mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-navy-800 whitespace-pre-wrap leading-relaxed">{content.instagram}</p>
                  </div>
                </Card>

                {/* Facebook */}
                <Card className="p-8 border-2 border-navy-100 shadow-premium bg-white overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-500" />
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-600 rounded-xl">
                        <Facebook className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-navy-900">Facebook Post</h3>
                        <p className="text-sm text-navy-500">Community-focused engagement</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(content.facebook, "facebook")}
                        className="border-2 border-navy-200 hover:border-navy-300"
                      >
                        {copied === "facebook" ? (
                          <Check size={16} className="mr-1" />
                        ) : (
                          <Copy size={16} className="mr-1" />
                        )}
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => shareToSocial("facebook", content.facebook)}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Share2 size={16} className="mr-1" />
                        Post
                      </Button>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-navy-800 whitespace-pre-wrap leading-relaxed">{content.facebook}</p>
                  </div>
                </Card>

                {/* LinkedIn */}
                <Card className="p-8 border-2 border-navy-100 shadow-premium bg-white overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 to-blue-600" />
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-700 rounded-xl">
                        <Linkedin className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-navy-900">LinkedIn Post</h3>
                        <p className="text-sm text-navy-500">Professional networking content</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(content.linkedin, "linkedin")}
                        className="border-2 border-navy-200 hover:border-navy-300"
                      >
                        {copied === "linkedin" ? (
                          <Check size={16} className="mr-1" />
                        ) : (
                          <Copy size={16} className="mr-1" />
                        )}
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => shareToSocial("linkedin", content.linkedin)}
                        className="bg-blue-700 text-white hover:bg-blue-800"
                      >
                        <Share2 size={16} className="mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-navy-800 whitespace-pre-wrap leading-relaxed">{content.linkedin}</p>
                  </div>
                </Card>

                {/* Twitter/X */}
                <Card className="p-8 border-2 border-navy-100 shadow-premium bg-white overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-900 to-slate-700" />
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-slate-900 rounded-xl">
                        <Twitter className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-navy-900">Twitter/X Post</h3>
                        <p className="text-sm text-navy-500">Concise, attention-grabbing</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(content.twitter, "twitter")}
                        className="border-2 border-navy-200 hover:border-navy-300"
                      >
                        {copied === "twitter" ? (
                          <Check size={16} className="mr-1" />
                        ) : (
                          <Copy size={16} className="mr-1" />
                        )}
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => shareToSocial("twitter", content.twitter)}
                        className="bg-slate-900 text-white hover:bg-slate-800"
                      >
                        <Share2 size={16} className="mr-1" />
                        Tweet
                      </Button>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-navy-800 whitespace-pre-wrap leading-relaxed">{content.twitter}</p>
                  </div>
                </Card>

                {/* Email Template */}
                <Card className="p-8 border-2 border-navy-100 shadow-premium bg-white overflow-hidden relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 to-gold-500" />
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gradient-to-br from-gold-600 to-gold-500 rounded-xl">
                        <Mail className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-navy-900">Email Template</h3>
                        <p className="text-sm text-navy-500">Professional client outreach</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(content.email, "email")}
                      className="border-2 border-navy-200 hover:border-navy-300"
                    >
                      {copied === "email" ? <Check size={16} className="mr-1" /> : <Copy size={16} className="mr-1" />}
                      Copy
                    </Button>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-navy-800 whitespace-pre-wrap leading-relaxed">{content.email}</p>
                  </div>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
