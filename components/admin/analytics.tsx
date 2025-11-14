import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export function Analytics({ token }: { token: string | null }) {
  // Mock data - replace with real API calls
  const data = [
    { name: "Mon", views: 400, favorites: 240, shares: 100 },
    { name: "Tue", views: 300, favorites: 139, shares: 90 },
    { name: "Wed", views: 200, favorites: 221, shares: 80 },
    { name: "Thu", views: 278, favorites: 229, shares: 110 },
    { name: "Fri", views: 189, favorites: 200, shares: 95 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="p-6 border border-slate-200">
          <p className="text-sm text-muted-foreground mb-2">Total Views</p>
          <p className="text-3xl font-bold text-foreground">12,543</p>
          <p className="text-xs text-green-600 mt-2">+12% from last week</p>
        </Card>
        <Card className="p-6 border border-slate-200">
          <p className="text-sm text-muted-foreground mb-2">Active Users</p>
          <p className="text-3xl font-bold text-foreground">342</p>
          <p className="text-xs text-green-600 mt-2">+8% from last week</p>
        </Card>
        <Card className="p-6 border border-slate-200">
          <p className="text-sm text-muted-foreground mb-2">New Incentives</p>
          <p className="text-3xl font-bold text-foreground">127</p>
          <p className="text-xs text-green-600 mt-2">+24% from last week</p>
        </Card>
      </div>

      <Card className="p-6 border border-slate-200">
        <h3 className="text-lg font-bold text-foreground mb-4">Weekly Activity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="views" fill="#3b82f6" />
            <Bar dataKey="favorites" fill="#ef4444" />
            <Bar dataKey="shares" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
