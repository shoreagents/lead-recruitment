require('dotenv').config({ path: '.env.local' })
const { PrismaClient } = require('@prisma/client')

async function testPrismaDirect() {
  console.log('🔍 Testing Prisma client directly...\n')
  
  console.log(`✅ DATABASE_URL: ${process.env.DATABASE_URL ? 'SET' : 'NOT SET'}`)
  
  const prisma = new PrismaClient()
  
  try {
    console.log('\n📋 Testing Prisma client connection...')
    
    // Test users table
    console.log('👥 Testing users table...')
    const users = await prisma.user.findMany({
      take: 2
    })
    console.log(`✅ Users found: ${users.length}`)
    console.log(JSON.stringify(users, null, 2))
    
    // Test pricing quotes table
    console.log('\n💰 Testing pricing quotes table...')
    const quotes = await prisma.pricingQuote.findMany({
      take: 2
    })
    console.log(`✅ Pricing quotes found: ${quotes.length}`)
    console.log(JSON.stringify(quotes, null, 2))
    
    console.log('\n✅ Prisma client test completed!')
    
  } catch (error) {
    console.error('❌ Prisma client error:', error.message)
    console.error('Full error:', error)
  } finally {
    await prisma.$disconnect()
    console.log('✅ Prisma client disconnected')
  }
}

testPrismaDirect()




