import { createClient } from './supabase/client'

export interface PricingQuoteData {
  user_id: string
  session_id?: string
  member_count: number
  industry: string
  total_monthly_cost: number
  currency_code?: string
  candidate_recommendations?: Array<{
    id: string
    name: string
    position: string
    avatar?: string
    score: number
    isFavorite?: boolean
  }>
  roles: Array<{
    role_title: string
    role_description?: string
    experience_level: string
    workspace_type: string
    base_salary_php: number
    multiplier: number
    monthly_cost: number
    workspace_cost: number
    total_cost: number
  }>
}

export interface SavedPricingQuote {
  id: string
  user_id: string
  session_id?: string
  member_count: number
  industry: string
  total_monthly_cost: number
  currency_code: string
  candidate_recommendations?: Array<{
    id: string
    name: string
    position: string
    avatar?: string
    score: number
    isFavorite?: boolean
  }>
  created_at: string
  updated_at: string
  roles: Array<{
    id: string
    quote_id: string
    role_title: string
    role_description?: string
    experience_level: string
    workspace_type: string
    base_salary_php: number
    multiplier: number
    monthly_cost: number
    workspace_cost: number
    total_cost: number
    created_at: string
  }>
}

export class PricingQuoteServiceClient {
  /**
   * Save a pricing quote to the database
   */
  static async saveQuote(quoteData: PricingQuoteData): Promise<{ success: boolean; data?: SavedPricingQuote; error?: string }> {
    try {
      const supabase = createClient()

      console.log('🔍 PricingQuoteServiceClient.saveQuote called with:', {
        user_id: quoteData.user_id,
        member_count: quoteData.member_count,
        industry: quoteData.industry,
        roles_count: quoteData.roles.length
      })

      // Start a transaction by saving the main quote first
      const { data: quote, error: quoteError } = await supabase
        .from('pricing_quotes')
        .insert({
          user_id: quoteData.user_id,
          session_id: quoteData.session_id,
          member_count: quoteData.member_count,
          industry: quoteData.industry,
          total_monthly_cost: quoteData.total_monthly_cost,
          currency_code: quoteData.currency_code || 'PHP',
          candidate_recommendations: quoteData.candidate_recommendations || []
        })
        .select()
        .single()

      if (quoteError) {
        console.error('❌ Error saving quote:', quoteError)
        return { success: false, error: quoteError.message }
      }

      console.log('✅ Quote saved successfully:', quote.id)

      // Now save the roles
      const rolesToInsert = quoteData.roles.map(role => ({
        quote_id: quote.id,
        role_title: role.role_title,
        role_description: role.role_description,
        experience_level: role.experience_level,
        workspace_type: role.workspace_type,
        base_salary_php: role.base_salary_php,
        multiplier: role.multiplier,
        monthly_cost: role.monthly_cost,
        workspace_cost: role.workspace_cost,
        total_cost: role.total_cost,
      }))

      const { data: roles, error: rolesError } = await supabase
        .from('pricing_quote_roles')
        .insert(rolesToInsert)
        .select()

      if (rolesError) {
        console.error('❌ Error saving roles:', rolesError)
        // Clean up the quote if roles failed
        await supabase.from('pricing_quotes').delete().eq('id', quote.id)
        return { success: false, error: rolesError.message }
      }

      console.log('✅ Roles saved successfully:', roles.length)

      // Return the complete quote with roles
      const completeQuote: SavedPricingQuote = {
        ...quote,
        roles: roles || []
      }

      return { success: true, data: completeQuote }

    } catch (error) {
      console.error('❌ Unexpected error in saveQuote:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get quotes for a specific user
   */
  static async getUserQuotes(userId: string): Promise<{ success: boolean; data?: SavedPricingQuote[]; error?: string }> {
    try {
      const supabase = createClient()

      const { data: quotes, error: quotesError } = await supabase
        .from('pricing_quotes')
        .select(`
          *,
          roles:pricing_quote_roles(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (quotesError) {
        console.error('❌ Error fetching quotes:', quotesError)
        return { success: false, error: quotesError.message }
      }

      return { success: true, data: quotes as SavedPricingQuote[] }

    } catch (error) {
      console.error('❌ Unexpected error in getUserQuotes:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Get a specific quote by ID
   */
  static async getQuoteById(quoteId: string): Promise<{ success: boolean; data?: SavedPricingQuote; error?: string }> {
    try {
      const supabase = createClient()

      const { data: quote, error: quoteError } = await supabase
        .from('pricing_quotes')
        .select(`
          *,
          roles:pricing_quote_roles(*)
        `)
        .eq('id', quoteId)
        .single()

      if (quoteError) {
        console.error('❌ Error fetching quote:', quoteError)
        return { success: false, error: quoteError.message }
      }

      return { success: true, data: quote as SavedPricingQuote }

    } catch (error) {
      console.error('❌ Unexpected error in getQuoteById:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  /**
   * Delete a quote and its associated roles
   */
  static async deleteQuote(quoteId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = createClient()

      // Delete the quote (roles will be deleted automatically due to CASCADE)
      const { error } = await supabase
        .from('pricing_quotes')
        .delete()
        .eq('id', quoteId)

      if (error) {
        console.error('❌ Error deleting quote:', error)
        return { success: false, error: error.message }
      }

      return { success: true }

    } catch (error) {
      console.error('❌ Unexpected error in deleteQuote:', error)
      return { success: false, error: 'An unexpected error occurred' }
    }
  }
}
