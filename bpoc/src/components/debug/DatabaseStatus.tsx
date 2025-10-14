'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Loader2,
  RefreshCw
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ConnectionTest {
  name: string
  status: 'loading' | 'success' | 'error' | 'pending'
  message: string
  details?: unknown
}

export default function DatabaseStatus() {
  const [isOpen, setIsOpen] = useState(false)
  const [tests, setTests] = useState<ConnectionTest[]>([
    { name: 'Environment Variables', status: 'pending', message: 'Not checked' },
    { name: 'Supabase Client', status: 'pending', message: 'Not checked' },
    { name: 'Database Connection', status: 'pending', message: 'Not checked' },
    { name: 'Auth Service', status: 'pending', message: 'Not checked' },
  ])

  const runTests = async () => {
    // Reset all tests
    setTests(prev => prev.map(test => ({ ...test, status: 'loading' as const, message: 'Testing...' })))

    // Test 1: Environment Variables
    const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!envUrl || !envKey) {
      setTests(prev => prev.map(test => 
        test.name === 'Environment Variables' 
          ? { 
              ...test, 
              status: 'error' as const, 
              message: 'Missing environment variables',
              details: {
                url: envUrl ? '✅ Set' : '❌ Missing NEXT_PUBLIC_SUPABASE_URL',
                key: envKey ? '✅ Set' : '❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY'
              }
            }
          : test
      ))
      return
    }

    // Validate URL format
    let validUrl = false
    try {
      const url = new URL(envUrl)
      validUrl = url.hostname.includes('supabase.co')
    } catch (e) {
      validUrl = false
    }

    setTests(prev => prev.map(test => 
      test.name === 'Environment Variables' 
        ? { 
            ...test, 
            status: validUrl ? 'success' as const : 'error' as const,
            message: validUrl ? 'Environment variables loaded correctly' : 'Invalid Supabase URL format',
            details: {
              url: envUrl,
              urlValid: validUrl,
              keyLength: envKey.length,
              keyStartsWithEyJ: envKey.startsWith('eyJ')
            }
          }
        : test
    ))

    if (!validUrl) return

    // Test 2: Supabase Client
    try {
      const client = supabase
      setTests(prev => prev.map(test => 
        test.name === 'Supabase Client' 
          ? { 
              ...test, 
              status: 'success' as const,
              message: 'Supabase client initialized successfully'
            }
          : test
      ))
    } catch (error) {
      setTests(prev => prev.map(test => 
        test.name === 'Supabase Client' 
          ? { 
              ...test, 
              status: 'error' as const,
              message: `Client initialization failed: ${error}`,
              details: error
            }
          : test
      ))
      return
    }

    // Test 3: Database Connection
    try {
      const { data, error } = await supabase.from('_supabase_migrations').select('*').limit(1)
      
      if (error && (error.code === 'PGRST116' || error.code === '42P01')) {
        // Table doesn't exist, but connection works - this is expected for new projects
        setTests(prev => prev.map(test => 
          test.name === 'Database Connection' 
            ? { 
                ...test, 
                status: 'success' as const,
                message: 'Database connection successful (table not found is expected for new projects)'
              }
            : test
        ))
      } else if (error && error.code === 'PGRST301') {
        // JWT expired or invalid
        setTests(prev => prev.map(test => 
          test.name === 'Database Connection' 
            ? { 
                ...test, 
                status: 'error' as const,
                message: `Authentication error: ${error.message}`,
                details: error
              }
            : test
        ))
      } else if (error) {
        setTests(prev => prev.map(test => 
          test.name === 'Database Connection' 
            ? { 
                ...test, 
                status: 'error' as const,
                message: `Database error: ${error.message}`,
                details: error
              }
            : test
        ))
      } else {
        setTests(prev => prev.map(test => 
          test.name === 'Database Connection' 
            ? { 
                ...test, 
                status: 'success' as const,
                message: 'Database connection successful'
              }
            : test
        ))
      }
    } catch (error) {
      setTests(prev => prev.map(test => 
        test.name === 'Database Connection' 
          ? { 
              ...test, 
              status: 'error' as const,
              message: `Connection failed: ${error}`,
              details: error
            }
          : test
      ))
    }

    // Test 4: Auth Service
    try {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        setTests(prev => prev.map(test => 
          test.name === 'Auth Service' 
            ? { 
                ...test, 
                status: 'error' as const,
                message: `Auth error: ${error.message}`,
                details: error
              }
            : test
        ))
      } else {
        setTests(prev => prev.map(test => 
          test.name === 'Auth Service' 
            ? { 
                ...test, 
                status: 'success' as const,
                message: 'Auth service working correctly'
              }
            : test
        ))
      }
    } catch (error) {
      setTests(prev => prev.map(test => 
        test.name === 'Auth Service' 
          ? { 
              ...test, 
              status: 'error' as const,
              message: `Auth service failed: ${error}`,
              details: error
            }
          : test
      ))
    }
  }

  useEffect(() => {
    if (isOpen) {
      runTests()
    }
  }, [isOpen])

  const getStatusIcon = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'loading': return <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />
      case 'pending': return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = () => {
    const hasError = tests.some(test => test.status === 'error')
    const allSuccess = tests.every(test => test.status === 'success')
    const isLoading = tests.some(test => test.status === 'loading')

    if (isLoading) return <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">Checking...</Badge>
    if (hasError) return <Badge variant="destructive" className="bg-red-500/20 text-red-400">Connection Issues</Badge>
    if (allSuccess) return <Badge variant="secondary" className="bg-green-500/20 text-green-400">Connected</Badge>
    return <Badge variant="secondary" className="bg-gray-500/20 text-gray-400">Not Tested</Badge>
  }

  const getFloatingButtonStyle = () => {
    const hasError = tests.some(test => test.status === 'error')
    const allSuccess = tests.every(test => test.status === 'success')
    const isLoading = tests.some(test => test.status === 'loading')

    if (isLoading) return 'bg-blue-500/20 border-blue-500/30 text-blue-400 hover:bg-blue-500/30'
    if (hasError) return 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30'
    if (allSuccess) return 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30'
    return 'bg-gray-500/20 border-gray-500/30 text-gray-400 hover:bg-gray-500/30'
  }



  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-all duration-200 ${getFloatingButtonStyle()}`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Database Connection Status"
        >
          <Database className="w-6 h-6" />
        </motion.button>
      </motion.div>

      {/* Status Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-card border-white/20 max-w-2xl w-full mx-4 sm:mx-auto max-h-[90vh] overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header */}
            <DialogHeader className="text-center space-y-3">
              <DialogTitle className="text-2xl font-bold gradient-text flex items-center justify-center gap-3">
                <Database className="w-6 h-6" />
                Database Connection Status
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Real-time status of your Supabase database connection
              </DialogDescription>
            </DialogHeader>

            {/* Status Badge */}
            <div className="flex justify-center">
              {getStatusBadge()}
            </div>

            {/* Test Results */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Connection Tests</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={runTests}
                  className="border-white/20 text-white hover:bg-white/10"
                  disabled={tests.some(test => test.status === 'loading')}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${tests.some(test => test.status === 'loading') ? 'animate-spin' : ''}`} />
                  Run Tests
                </Button>
              </div>

              <div className="space-y-3">
                {tests.map((test, index) => (
                  <motion.div
                    key={test.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <div className="font-medium text-white">{test.name}</div>
                        <div className="text-sm text-gray-400">{test.message}</div>
                      </div>
                    </div>

                    {test.details !== undefined && test.details !== null && (
                      <details className="text-xs text-gray-500">
                        <summary className="cursor-pointer hover:text-gray-400 transition-colors">Details</summary>
                        <pre className="mt-2 p-2 bg-black/20 rounded text-xs overflow-auto max-w-xs">
                          {String(JSON.stringify(test.details || {}, null, 2))}
                        </pre>
                      </details>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>



            {/* Help Section */}
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <h4 className="font-medium text-yellow-400 mb-2">Troubleshooting Tips</h4>
              <ul className="text-sm text-yellow-200 space-y-1">
                <li>• Make sure your .env.local file is in the project root</li>
                <li>• Restart your dev server after changing environment variables</li>
                <li>• URL should be: https://[project-id].supabase.co</li>
                <li>• Use the &quot;anon public&quot; key, NOT &quot;service_role secret&quot;</li>
                <li>• &quot;Table not found&quot; errors are normal for new projects</li>
                <li>• Check Supabase dashboard for correct credentials</li>
              </ul>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </>
  )
} 