'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/layout/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Eye, EyeOff, Lock, CheckCircle, XCircle, LogIn } from 'lucide-react'
import { updatePassword, supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [tokenDetected, setTokenDetected] = useState<boolean | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const url = new URL(window.location.href)
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const qs = new URLSearchParams(url.search)

    // Gather possible params from Supabase recovery link variants
    const jwtAccess = hash.get('access_token') || qs.get('access_token')
    const refresh = hash.get('refresh_token') || qs.get('refresh_token')
    const tokenHash = qs.get('token_hash') || qs.get('token') || (jwtAccess && jwtAccess.split('.').length < 3 ? jwtAccess : null)

    // If tokenHash exists (non-JWT), verify to create a session
    const init = async () => {
      try {
        if (tokenHash) {
          setTokenDetected(true)
          const { data, error } = await supabase.auth.verifyOtp({ type: 'recovery', token_hash: tokenHash })
          if (error) {
            console.error('verifyOtp recovery error:', error)
            setStatus('error')
            setMessage('Recovery link invalid or expired. Request a new reset email.')
          } else if (data?.session) {
            // Session established, no need for token fallback
            setAccessToken(null)
          }
          return
        }

        // Otherwise if we have JWT-style access token, attempt to set session (if refresh token also present)
        if (jwtAccess) setAccessToken(jwtAccess)
        setTokenDetected(!!jwtAccess)
        await supabase.auth.getSession()
        if (jwtAccess && refresh) {
          try { await supabase.auth.setSession({ access_token: jwtAccess, refresh_token: refresh }) } catch {}
        }
      } catch (e) {
        console.warn('Reset init error:', e)
      }
    }

    init()
  }, [])

  const validate = (): string | null => {
    if (!newPassword || !confirmPassword) return 'Please enter and confirm your new password.'
    if (newPassword.length < 8) return 'Password must be at least 8 characters.'
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) return 'Password must contain uppercase, lowercase, and a number.'
    if (newPassword !== confirmPassword) return 'Passwords do not match.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('idle')
    setMessage('')

    const errorText = validate()
    if (errorText) { setStatus('error'); setMessage(errorText); return }

    try {
      setIsLoading(true)
      const { error } = await updatePassword(newPassword, accessToken || undefined)
      if (error) { setStatus('error'); setMessage(error.message || 'Failed to update password. Try the link again.') }
      else { setStatus('success'); setMessage('Your password has been updated. You can now sign in with your new password.'); setNewPassword(''); setConfirmPassword('') }
    } catch { setStatus('error'); setMessage('Failed to update password. Please try again.') }
    finally { setIsLoading(false) }
  }

  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <Header />

      <div className="pt-16 relative z-10">
        <div className="container mx-auto px-4 py-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <Card className="glass-card border-white/20">
              <CardHeader className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold gradient-text flex items-center justify-center gap-2"><Lock className="w-6 h-6" /> Reset Password</CardTitle>
                <CardDescription className="text-gray-300">Enter your new password below to secure your account.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {status === 'success' && (<div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm"><CheckCircle className="w-5 h-5" /> {message}</div>)}
                {status === 'error' && (<div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm"><XCircle className="w-5 h-5" /> {message}</div>)}

                {tokenDetected === false && (<div className="text-xs text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded p-2">This page expects a valid password recovery link from your email. If you opened this directly, go back to the login and use “Forgot password?”</div>)}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white block">New Password</label>
                    <div className="relative">
                      <Input type={showPassword ? 'text' : 'password'} placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-3 pr-10 h-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white block">Confirm New Password</label>
                    <Input type={showPassword ? 'text' : 'password'} placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-11 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-cyan-500 focus:ring-cyan-500/20" />
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white h-12">{isLoading ? 'Updating...' : 'Update Password'}</Button>
                </form>

                <Separator className="bg-white/20" />
                <div className="text-center"><a href="/" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 underline text-sm"><LogIn className="w-4 h-4" /> Back to Sign In</a></div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
