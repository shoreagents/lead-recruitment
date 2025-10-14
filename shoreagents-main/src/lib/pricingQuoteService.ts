import { createClient } from './supabase/server'

export interface PricingQuoteData {
  user_id: string
  session_id?: string
  member_count: number
  industry: string
  total_monthly_cost: number
  currency_code: string
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
  quote_timestamp: string
  member_count: number
  industry: string
  total_monthly_cost: number
  currency_code: string
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
    updated_at: string
  }>
}

export class PricingQuoteService {
  /**
   * Save a pricing quote to the database
   */
  static async saveQuote(quoteData: PricingQuoteData): Promise<{ success: boolean; data?: SavedPricingQuote; error?: string }> {
    try {
      const supabase = await createClient()

      console.log('🔍 PricingQuoteService.saveQuote called with:', {
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
          currency_code: quoteData.currency_code
        })
        .select()
        .single()

      if (quoteError) {
        console.error('❌ Error saving pricing quote:', quoteError)
        console.error('❌ Quote data that failed:', {
          user_id: quoteData.user_id,
          member_count: quoteData.member_count,
          industry: quoteData.industry
        })
        return { success: false, error: quoteError.message }
      }

      // Save the roles
      const rolesWithQuoteId = quoteData.roles.map(role => ({
        quote_id: quote.id,
        role_title: role.role_title,
        role_description: role.role_description,
        experience_level: role.experience_level,
        workspace_type: role.workspace_type,
        base_salary_php: role.base_salary_php,
        multiplier: role.multiplier,
        monthly_cost: role.monthly_cost,
        workspace_cost: role.workspace_cost,
        total_cost: role.total_cost
      }))

      const { data: roles, error: rolesError } = await supabase
        .from('pricing_quote_roles')
        .insert(rolesWithQuoteId)
        .select()

      if (rolesError) {
        console.error('❌ Error saving pricing quote roles:', rolesError)
        console.error('❌ Roles data that failed:', rolesWithQuoteId)
        // If roles fail, we should clean up the quote
        await supabase.from('pricing_quotes').delete().eq('id', quote.id)
        return { success: false, error: rolesError.message }
      }

      // Return the complete saved quote
      const savedQuote: SavedPricingQuote = {
        ...quote,
        roles: roles || []
      }

      console.log('✅ Pricing quote saved successfully:', savedQuote)
      return { success: true, data: savedQuote }

    } catch (error) {
      console.error('Unexpected error saving pricing quote:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Get quotes for a specific user
   */
  static async getUserQuotes(userId: string): Promise<{ success: boolean; data?: SavedPricingQuote[]; error?: string }> {
    try {
      const supabase = await createClient()

      const { data: quotes, error: quotesError } = await supabase
        .from('pricing_quotes')
        .select(`
          *,
          pricing_quote_roles (*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (quotesError) {
        console.error('Error fetching user quotes:', quotesError)
        return { success: false, error: quotesError.message }
      }

      return { success: true, data: quotes as SavedPricingQuote[] }

    } catch (error) {
      console.error('Unexpected error fetching user quotes:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Get a specific quote by ID
   */
  static async getQuoteById(quoteId: string): Promise<{ success: boolean; data?: SavedPricingQuote; error?: string }> {
    try {
      const supabase = await createClient()

      const { data: quote, error: quoteError } = await supabase
        .from('pricing_quotes')
        .select(`
          *,
          pricing_quote_roles (*)
        `)
        .eq('id', quoteId)
        .single()

      if (quoteError) {
        console.error('Error fetching quote:', quoteError)
        return { success: false, error: quoteError.message }
      }

      return { success: true, data: quote as SavedPricingQuote }

    } catch (error) {
      console.error('Unexpected error fetching quote:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Delete a quote and its associated roles
   */
  static async deleteQuote(quoteId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createClient()

      // Delete the quote (roles will be deleted automatically due to CASCADE)
      const { error } = await supabase
        .from('pricing_quotes')
        .delete()
        .eq('id', quoteId)

      if (error) {
        console.error('Error deleting quote:', error)
        return { success: false, error: error.message }
      }

      console.log('✅ Quote deleted successfully')
      return { success: true }

    } catch (error) {
      console.error('Unexpected error deleting quote:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }
}
