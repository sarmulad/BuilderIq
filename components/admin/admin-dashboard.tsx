"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubmissionQueue } from "./submission-queue"
import { Analytics } from "./analytics"
import { UserManagement } from "./user-management"

export function AdminDashboard({ token }: { token: string | null }) {
  const [activeTab, setActiveTab] = useState("submissions")

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage submissions, approve content, and monitor platform activity</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-slate-200">
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="submissions" className="mt-6">
            <SubmissionQueue token={token} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Analytics token={token} />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement token={token} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
