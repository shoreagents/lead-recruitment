import { createClient } from './supabase/client';
import { PricingQuoteServiceClient, SavedPricingQuote } from './pricingQuoteServiceClient';

export interface UserQuoteSummary {
  id: string;
  member_count: number;
  industry: string;
  total_monthly_cost: number;
  currency_code: string;
  created_at: string;
  roles_count: number;
  roles_preview: Array<{
    role_title: string;
    experience_level: string;
    workspace_type: string;
  }>;
  candidate_recommendations?: Array<{
    id: string;
    name: string;
    position: string;
    avatar?: string;
    score: number;
    isFavorite?: boolean;
  }>;
}

export class UserQuoteService {
  /**
   * Get all quotes for a user, ordered by most recent first
   */
  static async getAllQuotes(userId: string): Promise<{ success: boolean; data?: UserQuoteSummary[]; error?: string }> {
    try {
      const supabase = createClient();

      console.log('🔍 Fetching all quotes for user:', userId);

      // Get all quotes with roles, ordered by most recent first
      const { data: quotes, error: quotesError } = await supabase
        .from('pricing_quotes')
        .select(`
          id,
          member_count,
          industry,
          total_monthly_cost,
          currency_code,
          created_at,
          candidate_recommendations,
          roles:pricing_quote_roles(
            role_title,
            experience_level,
            workspace_type
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (quotesError) {
        console.error('❌ Error fetching user quotes:', quotesError);
        return { success: false, error: quotesError.message };
      }

      if (!quotes || quotes.length === 0) {
        console.log('📭 No quotes found for user:', userId);
        return { success: true, data: [] };
      }

      // Transform the data
      const quoteSummaries: UserQuoteSummary[] = quotes.map(quote => {
        const roles = quote.roles || [];
        return {
          id: quote.id,
          member_count: quote.member_count,
          industry: quote.industry,
          total_monthly_cost: quote.total_monthly_cost,
          currency_code: quote.currency_code,
          created_at: quote.created_at,
          roles_count: roles.length,
          roles_preview: roles.map((role: Record<string, unknown>) => ({
            role_title: String(role.role_title),
            experience_level: String(role.experience_level),
            workspace_type: String(role.workspace_type)
          })),
          candidate_recommendations: quote.candidate_recommendations || []
        };
      });

      console.log('✅ All quotes fetched:', quoteSummaries.length);
      return { success: true, data: quoteSummaries };

    } catch (error) {
      console.error('❌ Unexpected error in getAllQuotes:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Get the most recent quote for a user
   */
  static async getMostRecentQuote(userId: string): Promise<{ success: boolean; data?: UserQuoteSummary; error?: string }> {
    try {
      const supabase = createClient();

      console.log('🔍 Fetching most recent quote for user:', userId);

      // Get the most recent quote with roles
      const { data: quotes, error: quotesError } = await supabase
        .from('pricing_quotes')
        .select(`
          id,
          member_count,
          industry,
          total_monthly_cost,
          currency_code,
          created_at,
          roles:pricing_quote_roles(
            role_title,
            experience_level,
            workspace_type
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (quotesError) {
        console.error('❌ Error fetching user quotes:', quotesError);
        return { success: false, error: quotesError.message };
      }

      if (!quotes || quotes.length === 0) {
        console.log('📭 No quotes found for user:', userId);
        return { success: true, data: undefined };
      }

      const quote = quotes[0];
      const roles = quote.roles || [];

      const quoteSummary: UserQuoteSummary = {
        id: quote.id,
        member_count: quote.member_count,
        industry: quote.industry,
        total_monthly_cost: quote.total_monthly_cost,
        currency_code: quote.currency_code,
        created_at: quote.created_at,
        roles_count: roles.length,
        roles_preview: roles.map((role: Record<string, unknown>) => ({
          role_title: String(role.role_title),
          experience_level: String(role.experience_level),
          workspace_type: String(role.workspace_type)
        }))
      };

      console.log('✅ Most recent quote found:', quoteSummary);
      return { success: true, data: quoteSummary };

    } catch (error) {
      console.error('❌ Unexpected error in getMostRecentQuote:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Get all quotes for a user (for future use)
   */
  static async getAllUserQuotes(userId: string): Promise<{ success: boolean; data?: SavedPricingQuote[]; error?: string }> {
    return PricingQuoteServiceClient.getUserQuotes(userId);
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number, currencyCode: string = 'PHP'): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  }

  /**
   * Get quote age in human readable format
   */
  static getQuoteAge(createdAt: string): string {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  }
}
