import { Card } from "@/components/ui/card"
import { Search, Sparkles, Megaphone, Bell, TrendingUp, FileText } from "lucide-react"

export function FeatureShowcase() {
  const features = [
    {
      icon: Search,
      title: "Advanced Search Intelligence",
      description:
        "Instantly filter through thousands of incentives by builder, location, value, and expiration. Save your searches and get notified of new matches.",
    },
    {
      icon: Sparkles,
      title: "AI-Powered Normalization",
      description:
        "Our AI automatically standardizes builder marketing language into clean, comparable data you can trust.",
    },
    {
      icon: Megaphone,
      title: "Marketing Content Generator",
      description: "Generate professional social posts, email campaigns, and buyer presentations in seconds using AI.",
    },
    {
      icon: Bell,
      title: "Smart Alert System",
      description: "Receive curated digests of new incentives, price drops, and expiring deals in your target markets.",
    },
    {
      icon: TrendingUp,
      title: "Market Trend Analysis",
      description: "Track builder behavior patterns, incentive trends, and competitive intelligence across regions.",
    },
    {
      icon: FileText,
      title: "Comprehensive Reporting",
      description:
        "Export detailed reports, compare builders side-by-side, and share insights with your team or clients.",
    },
  ]

  return (
    <section className="py-24 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 text-balance">
            Everything You Need to Win
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Powerful tools designed for real estate professionals who demand excellence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <Card
                key={i}
                className="p-8 border-2 border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 bg-card"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="text-primary" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
