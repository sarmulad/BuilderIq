import { createClient } from "./supabase/client"

class SupabaseAPIClient {
  private supabase = createClient()

  // Auth methods
  async signup(email: string, password: string, fullName: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error
    return data
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await this.supabase.auth.getUser()
    if (error) throw error
    return user
  }

  // Incentives
  async getIncentives(
    filters: {
      skip?: number
      limit?: number
      search?: string
      builderId?: string
      builders?: string[]
      city?: string
      cities?: string[]
      incentiveType?: string
      incentiveTypes?: string[]
      minValue?: number
      maxValue?: number
      expiringSoon?: boolean
      hasLender?: boolean
      minPrice?: number
      maxPrice?: number
      minSqft?: number
      maxSqft?: number
      bedrooms?: number
      bathrooms?: number
      sortBy?: string
      sortOrder?: string
    } = {},
  ) {
    let query = this.supabase
      .from("incentives")
      .select(`
        *,
        community:communities(*),
        builder:builders(*)
      `)
      .eq("is_active", true)

    // Apply filters
    if (filters.search) {
      query = query.or(`description.ilike.%${filters.search}%,type.ilike.%${filters.search}%`)
    }

    if (filters.builderId) {
      query = query.eq("builder_id", filters.builderId)
    }

    if (filters.builders && filters.builders.length > 0) {
      query = query.in("builder_id", filters.builders)
    }

    if (filters.city) {
      query = query.eq("community.city", filters.city)
    }

    if (filters.incentiveType) {
      query = query.eq("type", filters.incentiveType)
    }

    if (filters.incentiveTypes && filters.incentiveTypes.length > 0) {
      query = query.in("type", filters.incentiveTypes)
    }

    if (filters.minValue !== undefined) {
      query = query.gte("value", filters.minValue)
    }

    if (filters.maxValue !== undefined) {
      query = query.lte("value", filters.maxValue)
    }

    if (filters.expiringSoon) {
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
      query = query.lte("expiration_date", thirtyDaysFromNow.toISOString())
    }

    if (filters.hasLender !== undefined) {
      query = filters.hasLender ? query.not("lender_requirements", "is", null) : query.is("lender_requirements", null)
    }

    // Sorting
    const sortBy = filters.sortBy || "created_at"
    const sortOrder = filters.sortOrder === "asc"
    query = query.order(sortBy, { ascending: sortOrder })

    // Pagination
    const skip = filters.skip || 0
    const limit = filters.limit || 24
    query = query.range(skip, skip + limit - 1)

    const { data, error, count } = await query

    if (error) throw error
    return { items: data, total: count || 0 }
  }

  async getIncentive(id: string) {
    const { data, error } = await this.supabase
      .from("incentives")
      .select(`
        *,
        community:communities(*),
        builder:builders(*)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  }

  // Favorites
  async addFavorite(incentiveId: string) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await this.supabase
      .from("favorites")
      .insert({ user_id: user.id, incentive_id: incentiveId })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async removeFavorite(incentiveId: string) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error("Not authenticated")

    const { error } = await this.supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("incentive_id", incentiveId)

    if (error) throw error
  }

  async getFavorites() {
    const user = await this.getCurrentUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await this.supabase
      .from("favorites")
      .select(`
        *,
        incentive:incentives(
          *,
          community:communities(*),
          builder:builders(*)
        )
      `)
      .eq("user_id", user.id)

    if (error) throw error
    return data
  }

  // Builders
  async getBuilders() {
    const { data, error } = await this.supabase.from("builders").select("*").eq("is_active", true).order("name")

    if (error) throw error
    return data
  }

  // Submissions
  async createSubmission(submission: {
    builderId: string
    communityId?: string
    type: string
    value?: number
    description: string
  }) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await this.supabase
      .from("submissions")
      .insert({
        user_id: user.id,
        builder_id: submission.builderId,
        community_id: submission.communityId,
        type: submission.type,
        value: submission.value,
        description: submission.description,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Saved searches
  async createSavedSearch(name: string, filters: any, isAlertEnabled = false) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await this.supabase
      .from("saved_searches")
      .insert({
        user_id: user.id,
        name,
        filters,
        is_alert_enabled: isAlertEnabled,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getSavedSearches() {
    const user = await this.getCurrentUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await this.supabase
      .from("saved_searches")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async deleteSavedSearch(id: string) {
    const user = await this.getCurrentUser()
    if (!user) throw new Error("Not authenticated")

    const { error } = await this.supabase.from("saved_searches").delete().eq("id", id).eq("user_id", user.id)

    if (error) throw error
  }

  // Marketing content generation (will use Edge Function)
  async generateMarketingContent(incentiveId: string) {
    const { data, error } = await this.supabase.functions.invoke("generate-marketing", {
      body: { incentiveId },
    })

    if (error) throw error
    return data
  }
}

export const supabaseAPI = new SupabaseAPIClient()
