require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')
const express = require('express')
const path = require('path')

const app = express()
const PORT = 3001

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Middleware
app.use(express.json())
app.use(express.static('public'))

// Serve HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Database Viewer - ShoreAgents</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
            .container { max-width: 1200px; margin: 0 auto; }
            .header { background: #2563eb; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
            .table-section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .table-title { font-size: 24px; font-weight: bold; margin-bottom: 15px; color: #1f2937; }
            .table-content { background: #f9fafb; padding: 15px; border-radius: 6px; overflow-x: auto; }
            .json-content { white-space: pre-wrap; font-family: 'Courier New', monospace; font-size: 12px; }
            .stats { display: flex; gap: 20px; margin-bottom: 20px; }
            .stat-card { background: white; padding: 15px; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .stat-number { font-size: 24px; font-weight: bold; color: #2563eb; }
            .stat-label { color: #6b7280; font-size: 14px; }
            .loading { text-align: center; padding: 40px; color: #6b7280; }
            .error { background: #fef2f2; color: #dc2626; padding: 15px; border-radius: 6px; margin: 10px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🗄️ Database Viewer - ShoreAgents</h1>
                <p>Real-time database content using Supabase client</p>
            </div>
            
            <div class="stats" id="stats">
                <div class="stat-card">
                    <div class="stat-number" id="users-count">-</div>
                    <div class="stat-label">Users</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="quotes-count">-</div>
                    <div class="stat-label">Pricing Quotes</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" id="total-count">-</div>
                    <div class="stat-label">Total Records</div>
                </div>
            </div>
            
            <div class="table-section">
                <div class="table-title">👥 Users Table</div>
                <div class="table-content">
                    <div id="users-content" class="loading">Loading users...</div>
                </div>
            </div>
            
            <div class="table-section">
                <div class="table-title">💰 Pricing Quotes Table</div>
                <div class="table-content">
                    <div id="quotes-content" class="loading">Loading pricing quotes...</div>
                </div>
            </div>
        </div>
        
        <script>
            async function loadData() {
                try {
                    // Load users
                    const usersResponse = await fetch('/api/users');
                    const users = await usersResponse.json();
                    document.getElementById('users-content').innerHTML = '<div class="json-content">' + JSON.stringify(users, null, 2) + '</div>';
                    document.getElementById('users-count').textContent = users.length;
                    
                    // Load pricing quotes
                    const quotesResponse = await fetch('/api/pricing-quotes');
                    const quotes = await quotesResponse.json();
                    document.getElementById('quotes-content').innerHTML = '<div class="json-content">' + JSON.stringify(quotes, null, 2) + '</div>';
                    document.getElementById('quotes-count').textContent = quotes.length;
                    
                    // Update total
                    document.getElementById('total-count').textContent = users.length + quotes.length;
                    
                } catch (error) {
                    document.getElementById('users-content').innerHTML = '<div class="error">Error loading users: ' + error.message + '</div>';
                    document.getElementById('quotes-content').innerHTML = '<div class="error">Error loading pricing quotes: ' + error.message + '</div>';
                }
            }
            
            // Load data on page load
            loadData();
            
            // Refresh every 30 seconds
            setInterval(loadData, 30000);
        </script>
    </body>
    </html>
  `)
})

// API endpoints
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/pricing-quotes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('pricing_quotes')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/stats', async (req, res) => {
  try {
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
    
    const { count: quotesCount } = await supabase
      .from('pricing_quotes')
      .select('*', { count: 'exact', head: true })
    
    res.json({
      users: usersCount,
      quotes: quotesCount,
      total: usersCount + quotesCount
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`🌐 Database Viewer running at http://localhost:${PORT}`)
  console.log('✅ This is a working alternative to Prisma Studio!')
  console.log('✅ Uses Supabase client (which works) instead of Prisma (which has connection issues)')
})




