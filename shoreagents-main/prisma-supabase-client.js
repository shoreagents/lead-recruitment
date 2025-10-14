require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

// Prisma-style client using Supabase
class PrismaSupabaseClient {
  constructor() {
    this.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    this.supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Missing Supabase environment variables!')
    }
    
    this.client = createClient(this.supabaseUrl, this.supabaseKey)
  }

  // User model operations
  get user() {
    return {
      findMany: async (options = {}) => {
        const { data, error, count } = await this.client
          .from('users')
          .select('*', { count: 'exact' })
          .limit(options.take || 100)
          .range(options.skip || 0, (options.skip || 0) + (options.take || 100) - 1)
        
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
      
      create: async (data) => {
        const { data: result, error } = await this.client
          .from('users')
          .insert(data)
          .select()
          .single()
        
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
      
      count: async () => {
        const { count, error } = await this.client
          .from('users')
          .select('*', { count: 'exact', head: true })
        
        if (error) throw new Error(error.message)
        return count
      }
    }
  }

  // PricingQuote model operations
  get pricingQuote() {
    return {
      findMany: async (options = {}) => {
        const { data, error, count } = await this.client
          .from('pricing_quotes')
          .select('*', { count: 'exact' })
          .limit(options.take || 100)
          .range(options.skip || 0, (options.skip || 0) + (options.take || 100) - 1)
        
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
      
      create: async (data) => {
        const { data: result, error } = await this.client
          .from('pricing_quotes')
          .insert(data)
          .select()
          .single()
        
        if (error) throw new Error(error.message)
        return result
      },
      
      update: async ({ where, data }) => {
        const { data: result, error } = await this.client
          .from('pricing_quotes')
          .update(data)
          .eq(Object.keys(where)[0], Object.values(where)[0])
          .select()
          .single()
        
        if (error) throw new Error(error.message)
        return result
      },
      
      delete: async (where) => {
        const { data, error } = await this.client
          .from('pricing_quotes')
          .delete()
          .eq(Object.keys(where)[0], Object.values(where)[0])
          .select()
          .single()
        
        if (error) throw new Error(error.message)
        return data
      },
      
      count: async () => {
        const { count, error } = await this.client
          .from('pricing_quotes')
          .select('*', { count: 'exact', head: true })
        
        if (error) throw new Error(error.message)
        return count
      }
    }
  }

  // Disconnect method (for compatibility)
  async $disconnect() {
    // Supabase client doesn't need explicit disconnection
    console.log('✅ Supabase client disconnected')
  }
}

async function showAllTablesWithPrisma() {
  console.log('🔍 Using Prisma-style client with Supabase...\n')
  
  try {
    // Initialize Prisma-style client
    const prisma = new PrismaSupabaseClient()
    
    console.log('📋 USERS TABLE (Prisma-style):')
    console.log('=' .repeat(50))
    
    // Get all users using Prisma-style syntax
    const users = await prisma.user.findMany()
    const userCount = await prisma.user.count()
    
    console.log(`Found ${userCount} users:`)
    console.log(JSON.stringify(users, null, 2))
    console.log('\n')
    
    console.log('📋 PRICING_QUOTES TABLE (Prisma-style):')
    console.log('=' .repeat(50))
    
    // Get all pricing quotes using Prisma-style syntax
    const pricingQuotes = await prisma.pricingQuote.findMany()
    const quotesCount = await prisma.pricingQuote.count()
    
    console.log(`Found ${quotesCount} pricing quotes:`)
    console.log(JSON.stringify(pricingQuotes, null, 2))
    console.log('\n')
    
    // Test Prisma-style operations
    console.log('🔍 TESTING PRISMA-STYLE OPERATIONS:')
    console.log('=' .repeat(50))
    
    // Find a specific user
    if (users.length > 0) {
      console.log('\n👤 Finding specific user by ID:')
      try {
        const specificUser = await prisma.user.findUnique({
          id: users[0].id
        })
        console.log('✅ Found user:', JSON.stringify(specificUser, null, 2))
      } catch (error) {
        console.log('❌ Error finding user:', error.message)
      }
    }
    
    // Find a specific pricing quote
    if (pricingQuotes.length > 0) {
      console.log('\n💰 Finding specific pricing quote by ID:')
      try {
        const specificQuote = await prisma.pricingQuote.findUnique({
          id: pricingQuotes[0].id
        })
        console.log('✅ Found pricing quote:', JSON.stringify(specificQuote, null, 2))
      } catch (error) {
        console.log('❌ Error finding pricing quote:', error.message)
      }
    }
    
    // Summary
    console.log('\n📊 SUMMARY:')
    console.log('=' .repeat(50))
    console.log(`✅ Users: ${userCount} records`)
    console.log(`✅ Pricing Quotes: ${quotesCount} records`)
    console.log(`✅ Total records: ${userCount + quotesCount}`)
    console.log('✅ Prisma-style operations working!')
    
    // Disconnect
    await prisma.$disconnect()
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    console.error('Full error:', error)
  }
}

showAllTablesWithPrisma()




