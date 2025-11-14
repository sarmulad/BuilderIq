export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          phone: string | null
          role: "user" | "builder" | "admin"
          subscription_tier: "free" | "pro" | "enterprise"
          subscription_started_at: string | null
          subscription_expires_at: string | null
          is_active: boolean
          is_email_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          role?: "user" | "builder" | "admin"
          subscription_tier?: "free" | "pro" | "enterprise"
          subscription_started_at?: string | null
          subscription_expires_at?: string | null
          is_active?: boolean
          is_email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          phone?: string | null
          role?: "user" | "builder" | "admin"
          subscription_tier?: "free" | "pro" | "enterprise"
          subscription_started_at?: string | null
          subscription_expires_at?: string | null
          is_active?: boolean
          is_email_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      builders: {
        Row: {
          id: string
          name: string
          slug: string
          logo_url: string | null
          website_url: string | null
          description: string | null
          is_active: boolean
          data_source: string
          last_scraped_at: string | null
          created_at: string
          updated_at: string
        }
      }
      communities: {
        Row: {
          id: string
          name: string
          builder_id: string
          city: string | null
          state: string | null
          zip_code: string | null
          county: string | null
          latitude: number | null
          longitude: number | null
          status: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
      }
      incentives: {
        Row: {
          id: string
          community_id: string
          builder_id: string
          type: string
          value: number | null
          value_type: string | null
          description: string | null
          lender_requirements: string | null
          conditions: string | null
          expiration_date: string | null
          is_active: boolean
          created_at: string
          updated_at: string
          scraped_at: string | null
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          incentive_id: string
          created_at: string
        }
      }
      saved_searches: {
        Row: {
          id: string
          user_id: string
          name: string
          filters: Json
          is_alert_enabled: boolean
          created_at: string
          updated_at: string
        }
      }
    }
  }
}
