import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/node/process.ts"

serve(async (req) => {
  try {
    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    )

    // Get all users with active email subscriptions
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from("email_subscriptions")
      .select("*, user:users(*)")
      .neq("subscription_type", "never")

    if (subError) throw subError

    const sendgridKey = Deno.env.get("SENDGRID_API_KEY")
    const now = new Date()
    const results = []

    for (const subscription of subscriptions) {
      // Check if we should send based on subscription type
      const lastSent = subscription.last_sent_at ? new Date(subscription.last_sent_at) : null
      let shouldSend = false

      if (
        subscription.subscription_type === "daily" &&
        (!lastSent || now.getTime() - lastSent.getTime() >= 24 * 60 * 60 * 1000)
      ) {
        shouldSend = true
      } else if (
        subscription.subscription_type === "weekly" &&
        (!lastSent || now.getTime() - lastSent.getTime() >= 7 * 24 * 60 * 60 * 1000)
      ) {
        shouldSend = true
      }

      if (!shouldSend) continue

      // Build filter query
      let query = supabaseAdmin
        .from("incentives")
        .select(`
          *,
          community:communities(*),
          builder:builders(*)
        `)
        .eq("is_active", true)

      // Apply user filters
      if (subscription.builders_filter && subscription.builders_filter.length > 0) {
        query = query.in("builder_id", subscription.builders_filter)
      }

      // Get new incentives since last email
      if (lastSent) {
        query = query.gte("created_at", lastSent.toISOString())
      } else {
        // If never sent, get incentives from last 7 days
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        query = query.gte("created_at", sevenDaysAgo.toISOString())
      }

      query = query.order("created_at", { ascending: false }).limit(10)

      const { data: incentives, error: incentivesError } = await query

      if (incentivesError) throw incentivesError

      if (incentives && incentives.length > 0) {
        // Build email HTML
        const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .incentive { background: #f9fafb; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px; }
    .incentive h3 { margin: 0 0 10px 0; color: #10b981; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .cta { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BuilderIQ Incentive Digest</h1>
      <p>${incentives.length} New Builder Incentives</p>
    </div>
    
    <div style="padding: 30px; background: white;">
      <p>Hi ${subscription.user.full_name || "there"},</p>
      <p>We found ${incentives.length} new builder incentive${incentives.length !== 1 ? "s" : ""} matching your preferences:</p>
      
      ${incentives
        .map(
          (inc) => `
        <div class="incentive">
          <h3>${inc.builder.name} - ${inc.type}</h3>
          <p><strong>Community:</strong> ${inc.community.name}, ${inc.community.city}</p>
          <p><strong>Value:</strong> $${inc.value?.toLocaleString() || "Various"}</p>
          <p>${inc.description}</p>
          ${inc.expiration_date ? `<p style="color: #ef4444;"><strong>Expires:</strong> ${new Date(inc.expiration_date).toLocaleDateString()}</p>` : ""}
        </div>
      `,
        )
        .join("")}
      
      <div style="text-align: center;">
        <a href="${Deno.env.get("FRONTEND_URL") || "https://builderiq.com"}/search" class="cta">View All Incentives</a>
      </div>
    </div>
    
    <div class="footer">
      <p>You're receiving this email because you subscribed to BuilderIQ incentive alerts.</p>
      <p><a href="${Deno.env.get("FRONTEND_URL") || "https://builderiq.com"}/settings">Manage your email preferences</a></p>
    </div>
  </div>
</body>
</html>
        `

        // Send email via SendGrid
        const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sendgridKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            personalizations: [
              {
                to: [{ email: subscription.user.email }],
              },
            ],
            from: { email: "alerts@builderiq.com", name: "BuilderIQ" },
            subject: `${incentives.length} New Builder Incentive${incentives.length !== 1 ? "s" : ""} - BuilderIQ`,
            content: [{ type: "text/html", value: emailHtml }],
          }),
        })

        if (emailResponse.ok) {
          // Update last_sent_at
          await supabaseAdmin
            .from("email_subscriptions")
            .update({ last_sent_at: now.toISOString() })
            .eq("id", subscription.id)

          results.push({ userId: subscription.user_id, status: "sent", count: incentives.length })
        } else {
          results.push({ userId: subscription.user_id, status: "failed", error: await emailResponse.text() })
        }
      }
    }

    return new Response(JSON.stringify({ success: true, results }), { headers: { "Content-Type": "application/json" } })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
