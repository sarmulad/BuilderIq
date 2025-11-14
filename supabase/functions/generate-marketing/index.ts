import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Deno } from "https://deno.land/std@0.168.0/node/global.ts" // Declaring Deno variable

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const { incentiveId } = await req.json()

    if (!incentiveId) {
      return new Response(JSON.stringify({ error: "incentiveId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Create Supabase client
    const supabaseClient = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: {
        headers: { Authorization: req.headers.get("Authorization")! },
      },
    })

    // Fetch incentive details
    const { data: incentive, error: incentiveError } = await supabaseClient
      .from("incentives")
      .select(`
        *,
        community:communities(*),
        builder:builders(*)
      `)
      .eq("id", incentiveId)
      .single()

    if (incentiveError || !incentive) {
      return new Response(JSON.stringify({ error: "Incentive not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Generate marketing content using OpenAI
    const openaiKey = Deno.env.get("OPENAI_API_KEY")

    const prompt = `Generate marketing content for a new home builder incentive:
    
Builder: ${incentive.builder.name}
Community: ${incentive.community.name}
Location: ${incentive.community.city}, ${incentive.community.state}
Incentive Type: ${incentive.type}
Value: $${incentive.value?.toLocaleString() || "Various"}
Description: ${incentive.description}
${incentive.expiration_date ? `Expires: ${incentive.expiration_date}` : ""}

Generate 4 platform-specific posts:`

    const platforms = [
      {
        name: "instagram",
        instructions: "Instagram post (visual, engaging, 5-7 relevant hashtags, max 2200 chars)",
      },
      {
        name: "facebook",
        instructions: "Facebook post (community-focused, conversational, 300-500 chars)",
      },
      {
        name: "linkedin",
        instructions: "LinkedIn post (professional tone, market insights, 200-300 chars)",
      },
      {
        name: "twitter",
        instructions: "Twitter/X post (concise, punchy, 2-3 hashtags, max 280 chars)",
      },
    ]

    const content: Record<string, string> = {}

    for (const platform of platforms) {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are an expert real estate marketing copywriter.",
            },
            {
              role: "user",
              content: `${prompt}\n\n${platform.instructions}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      const data = await response.json()
      content[platform.name] = data.choices[0].message.content
    }

    // Add email template
    content.email = `Subject: Exclusive Builder Incentive: Save on Your Dream Home!

Dear [Client Name],

I'm excited to share an incredible opportunity with you!

${incentive.builder.name} is offering ${incentive.type} valued at $${incentive.value?.toLocaleString()} in their ${incentive.community.name} community in ${incentive.community.city}.

${incentive.description}

${incentive.expiration_date ? `This offer expires on ${new Date(incentive.expiration_date).toLocaleDateString()}, so act fast!` : ""}

Let's schedule a tour and discuss how this incentive can help you save on your dream home.

Best regards,
[Your Name]
[Your Contact Info]`

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
