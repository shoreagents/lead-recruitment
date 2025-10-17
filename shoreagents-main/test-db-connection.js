const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');
    
    // Test if we can query users table
    const userCount = await prisma.user.count();
    console.log(`✅ Users table accessible. Count: ${userCount}`);
    
    // Test if we can query pricing_quotes table
    const quoteCount = await prisma.pricingQuote.count();
    console.log(`✅ Pricing quotes table accessible. Count: ${quoteCount}`);
    
    // Test if we can query pricing_quote_roles table
    const roleCount = await prisma.pricingQuoteRole.count();
    console.log(`✅ Pricing quote roles table accessible. Count: ${roleCount}`);
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
