require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Advanced Prisma-style client with more features
class AdvancedPrismaSupabaseClient {
  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Missing Supabase environment variables!')
    }
    
    this.client = createClient(this.supabaseUrl, this.supabaseKey)
  }

  // Advanced User model with more Prisma-like methods
  get user() {
    return {
      findMany: async (options = {}) => {
        let query = this.client.from('users').select('*', { count: 'exact' })
        
        // Handle where conditions
        if (options.where) {
          Object.entries(options.where).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              if (value.gte) query = query.gte(key, value.gte)
              if (value.lte) query = query.lte(key, value.lte)
              if (value.gt) query = query.gt(key, value.gt)
              if (value.lt) query = query.lt(key, value.lt)
              if (value.contains) query = query.contains(key, value.contains)
              if (value.startsWith) query = query.like(key, `${value.startsWith}%`)
              if (value.endsWith) query = query.like(key, `%${value.endsWith}`)
              if (value.in) query = query.in(key, value.in)
              if (value.notIn) query = query.not('in', key, value.notIn)
            } else {
              query = query.eq(key, value)
            }
          })
        }
        
        // Handle ordering
        if (options.orderBy) {
          const orderBy = Array.isArray(options.orderBy) ? options.orderBy : [options.orderBy]
          orderBy.forEach(order => {
            const column = Object.keys(order)[0]
            const direction = order[column] || 'asc'
            query = query.order(column, { ascending: direction === 'asc' })
          })
        }
        
        // Handle pagination
        if (options.take) {
          query = query.limit(options.take)
        }
        if (options.skip) {
          query = query.range(options.skip, options.skip + (options.take || 100) - 1)
        }
        
        const { data, error, count } = await query
        
        if (error) throw new Error(error.message)
        return data
      },
      
      findUnique: async (where) => {
        const { data, error } = await this.client
          .from('users')
          .select('*')
          .eq(Object.keys(where)[0], Object.values(where)[0])
          .single()
        
        if (error) throw new Error(error.message)
        return data
      },
      
      findFirst: async (options = {}) => {
        const results = await this.user.findMany({ ...options, take: 1 })
        return results[0] || null
      },
      
      create: async (data) => {
        const { data: result, error } = await this.client
          .from('users')
          .insert(data)
          .select()
          .single()
        
        if (error) throw new Error(error.message)
        return result
      },
      
      createMany: async (data) => {
        const { data: result, error } = await this.client
          .from('users')
          .insert(data)
          .select()
        
        if (error) throw new Error(error.message)
        return result
      },
      
      update: async ({ where, data }) => {
        const { data: result, error } = await this.client
          .from('users')
          .update(data)
          .eq(Object.keys(where)[0], Object.values(where)[0])
          .select()
          .single()
        
        if (error) throw new Error(error.message)
        return result
      },
      
      updateMany: async ({ where, data }) => {
        let query = this.client.from('users').update(data)
        
        if (where) {
          Object.entries(where).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }
        
        const { data: result, error } = await query.select()
        
        if (error) throw new Error(error.message)
        return result
      },
      
      delete: async (where) => {
        const { data, error } = await this.client
          .from('users')
          .delete()
          .eq(Object.keys(where)[0], Object.values(where)[0])
          .select()
          .single()
        
        if (error) throw new Error(error.message)
        return data
      },
      
      deleteMany: async (where) => {
        let query = this.client.from('users').delete()
        
        if (where) {
          Object.entries(where).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }
        
        const { data, error } = await query.select()
        
        if (error) throw new Error(error.message)
        return data
      },
      
      count: async (where) => {
        let query = this.client.from('users').select('*', { count: 'exact', head: true })
        
        if (where) {
          Object.entries(where).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }
        
        const { count, error } = await query
        
        if (error) throw new Error(error.message)
        return count
      }
    }
  }

  // Advanced PricingQuote model
  get pricingQuote() {
    return {
      findMany: async (options = {}) => {
        let query = this.client.from('pricing_quotes').select('*', { count: 'exact' })
        
        if (options.where) {
          Object.entries(options.where).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
              if (value.gte) query = query.gte(key, value.gte)
              if (value.lte) query = query.lte(key, value.lte)
              if (value.gt) query = query.gt(key, value.gt)
              if (value.lt) query = query.lt(key, value.lt)
              if (value.contains) query = query.contains(key, value.contains)
              if (value.startsWith) query = query.like(key, `${value.startsWith}%`)
              if (value.endsWith) query = query.like(key, `%${value.endsWith}`)
              if (value.in) query = query.in(key, value.in)
              if (value.notIn) query = query.not('in', key, value.notIn)
            } else {
              query = query.eq(key, value)
            }
          })
        }
        
        if (options.orderBy) {
          const orderBy = Array.isArray(options.orderBy) ? options.orderBy : [options.orderBy]
          orderBy.forEach(order => {
            const column = Object.keys(order)[0]
            const direction = order[column] || 'asc'
            query = query.order(column, { ascending: direction === 'asc' })
          })
        }
        
        if (options.take) {
          query = query.limit(options.take)
        }
        if (options.skip) {
          query = query.range(options.skip, options.skip + (options.take || 100) - 1)
        }
        
        const { data, error, count } = await query
        
        if (error) throw new Error(error.message)
        return data
      },
      
      findUnique: async (where) => {
        const { data, error } = await this.client
          .from('pricing_quotes')
          .select('*')
          .eq(Object.keys(where)[0], Object.values(where)[0])
          .single()
        
        if (error) throw new Error(error.message)
        return data
      },
      
      findFirst: async (options = {}) => {
        const results = await this.pricingQuote.findMany({ ...options, take: 1 })
        return results[0] || null
      },
      
      create: async (data) => {
        const { data: result, error } = await this.client
          .from('pricing_quotes')
          .insert(data)
          .select()
          .single()
        
        if (error) throw new Error(error.message)
        return result
      },
      
      count: async (where) => {
        let query = this.client.from('pricing_quotes').select('*', { count: 'exact', head: true })
        
        if (where) {
          Object.entries(where).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }
        
        const { count, error } = await query
        
        if (error) throw new Error(error.message)
        return count
      }
    }
  }

  async $disconnect() {
    console.log('✅ Advanced Prisma-Supabase client disconnected')
  }
}

async function demonstrateAdvancedPrisma() {
  console.log('🔍 Advanced Prisma-style client with Supabase...\n')
  
  try {
    const prisma = new AdvancedPrismaSupabaseClient()
    
    console.log('📋 BASIC OPERATIONS:')
    console.log('=' .repeat(50))
    
    // Get all users
    const allUsers = await prisma.user.findMany()
    console.log(`✅ Found ${allUsers.length} users`)
    
    // Get all pricing quotes
    const allQuotes = await prisma.pricingQuote.findMany()
    console.log(`✅ Found ${allQuotes.length} pricing quotes`)
    
    console.log('\n🔍 ADVANCED QUERIES:')
    console.log('=' .repeat(50))
    
    // Find users by user_type
    const regularUsers = await prisma.user.findMany({
      where: { user_type: 'Regular' }
    })
    console.log(`✅ Regular users: ${regularUsers.length}`)
    
    // Find pricing quotes by industry
    const webDevQuotes = await prisma.pricingQuote.findMany({
      where: { industry: 'Web Development' }
    })
    console.log(`✅ Web Development quotes: ${webDevQuotes.length}`)
    
    // Find quotes with cost greater than 50000
    const expensiveQuotes = await prisma.pricingQuote.findMany({
      where: { 
        total_monthly_cost: { gte: 50000 } 
      }
    })
    console.log(`✅ Expensive quotes (>= 50k): ${expensiveQuotes.length}`)
    
    // Order users by creation date
    const orderedUsers = await prisma.user.findMany({
      orderBy: { created_at: 'desc' },
      take: 1
    })
    console.log(`✅ Latest user: ${orderedUsers[0]?.first_name || 'Anonymous'}`)
    
    // Count operations
    const userCount = await prisma.user.count()
    const quoteCount = await prisma.pricingQuote.count()
    console.log(`✅ Total users: ${userCount}`)
    console.log(`✅ Total quotes: ${quoteCount}`)
    
    console.log('\n🔍 COMPLEX QUERIES:')
    console.log('=' .repeat(50))
    
    // Find quotes for specific user
    const userQuotes = await prisma.pricingQuote.findMany({
      where: { user_id: 'device_syycm9' }
    })
    console.log(`✅ Quotes for device_syycm9: ${userQuotes.length}`)
    
    // Find quotes with candidate recommendations
    const quotesWithCandidates = await prisma.pricingQuote.findMany({
      where: { 
        candidate_recommendations: { not: null } 
      }
    })
    console.log(`✅ Quotes with candidates: ${quotesWithCandidates.length}`)
    
    console.log('\n📊 SUMMARY:')
    console.log('=' .repeat(50))
    console.log(`✅ Users: ${userCount} records`)
    console.log(`✅ Pricing Quotes: ${quoteCount} records`)
    console.log(`✅ Regular Users: ${regularUsers.length}`)
    console.log(`✅ Web Dev Quotes: ${webDevQuotes.length}`)
    console.log(`✅ Expensive Quotes: ${expensiveQuotes.length}`)
    console.log(`✅ User-specific Quotes: ${userQuotes.length}`)
    console.log(`✅ Quotes with Candidates: ${quotesWithCandidates.length}`)
    
    await prisma.$disconnect()
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
  }
}

demonstrateAdvancedPrisma()




