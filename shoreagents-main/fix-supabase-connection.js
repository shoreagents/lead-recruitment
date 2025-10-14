require('dotenv').config({ path: '.env.local' })

console.log('🔧 Supabase Connection Fix Guide\n')

console.log('📋 CURRENT CONNECTION STRINGS:')
console.log('=' .repeat(50))
console.log('DATABASE_URL (Pooled):', process.env.DATABASE_URL)
console.log('DIRECT_URL (Direct):', process.env.DIRECT_URL)

console.log('\n🔧 RECOMMENDED FIXES:')
console.log('=' .repeat(50))

console.log('\n1️⃣ UPDATE YOUR .env.local FILE:')
console.log('Replace your DATABASE_URL with one of these options:\n')

console.log('Option A - Pooled Connection (Recommended):')
console.log('DATABASE_URL="postgresql://postgres:dDXvSVk50nvvsDfc@db.iqhttgfoxwufxiwdappq.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require"')

console.log('\nOption B - Direct Connection:')
console.log('DATABASE_URL="postgresql://postgres:dDXvSVk50nvvsDfc@db.iqhttgfoxwufxiwdappq.supabase.co:5432/postgres?sslmode=require"')

console.log('\nOption C - With Schema Specification:')
console.log('DATABASE_URL="postgresql://postgres:dDXvSVk50nvvsDfc@db.iqhttgfoxwufxiwdappq.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1&sslmode=require&schema=public"')

console.log('\n2️⃣ UPDATE YOUR PRISMA SCHEMA:')
console.log('Add this to your prisma/schema.prisma file:')
console.log(`
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["public"]
}
`)

console.log('\n3️⃣ SUPABASE DASHBOARD SETTINGS:')
console.log('Go to your Supabase project dashboard:')
console.log('1. Settings → Database')
console.log('2. Check "Allow direct connections"')
console.log('3. Settings → Network')
console.log('4. Add your IP address to allowed IPs')
console.log('5. Or set to "Allow all IPs" for testing')

console.log('\n4️⃣ TEST CONNECTION:')
console.log('Run these commands to test:')
console.log('npx prisma generate')
console.log('npx prisma db pull')
console.log('npx prisma studio')

console.log('\n5️⃣ ALTERNATIVE - USE SUPABASE CLIENT:')
console.log('If Prisma still doesn\'t work, use our working solution:')
console.log('node web-database-viewer.js')
console.log('Then open http://localhost:3001')

console.log('\n✅ This should fix your Supabase connection issues!')




