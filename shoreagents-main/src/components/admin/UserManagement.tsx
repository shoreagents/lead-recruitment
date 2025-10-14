"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { UserType } from '@/types/user'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { Users, Mail, Building, Calendar, Database, TableIcon } from 'lucide-react'

interface User {
  user_id: string
  auth_user_id: string | null
  user_type: UserType
  first_name: string | null
  last_name: string | null
  email: string | null
  company: string | null
  created_at: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      if (!supabase) return

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        toast.error('Failed to fetch users')
        return
      }

      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const updateUserType = async (userId: string, newUserType: UserType) => {
    setUpdating(userId)
    try {
      const response = await fetch('/api/admin/promote-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newUserType,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user type')
      }

      toast.success(`User type updated to ${newUserType}`)
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Error updating user type:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update user type')
    } finally {
      setUpdating(null)
    }
  }

  const getUserTypeBadge = (userType: UserType) => {
    const variants = {
      [UserType.ANONYMOUS]: 'secondary',
      [UserType.REGULAR]: 'default',
      [UserType.ADMIN]: 'destructive',
    } as const

    return (
      <Badge variant={variants[userType]}>
        {userType}
      </Badge>
    )
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TableIcon className="w-5 h-5 text-lime-600" />
          User Management
        </CardTitle>
        <CardDescription>
          Real-time user data from your database - manage user types and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-lime-600 border-t-transparent rounded-full animate-spin mr-2" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No users found</p>
            <p className="text-sm">User data will appear here when available</p>
          </div>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader className="bg-lime-50 border-b">
                <TableRow>
                  <TableHead className="w-[250px] font-semibold text-gray-900">Email</TableHead>
                  <TableHead className="w-[200px] font-semibold text-gray-900">Name</TableHead>
                  <TableHead className="w-[180px] font-semibold text-gray-900">Company</TableHead>
                  <TableHead className="w-[120px] font-semibold text-gray-900">User Type</TableHead>
                  <TableHead className="w-[150px] font-semibold text-gray-900">Created</TableHead>
                  <TableHead className="w-[140px] font-semibold text-gray-900">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id} className="hover:bg-lime-50/50 transition-colors">
                    {/* Email Column */}
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-lime-600" />
                        <span className="text-sm font-semibold text-gray-900">
                          {user.email || 'No email provided'}
                        </span>
                        {!user.email && (
                          <Badge variant="outline" className="text-gray-500 border-gray-300 text-xs">
                            Anonymous
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {user.user_id}
                      </div>
                    </TableCell>
                    
                    {/* Name Column */}
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {user.first_name && user.last_name 
                            ? `${user.first_name} ${user.last_name}`
                            : 'Anonymous User'
                          }
                        </span>
                      </div>
                    </TableCell>
                    
                    {/* Company Column */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">
                          {user.company || 'Not specified'}
                        </span>
                      </div>
                    </TableCell>
                    
                    {/* User Type Column */}
                    <TableCell>
                      {getUserTypeBadge(user.user_type)}
                    </TableCell>
                    
                    {/* Created Column */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {new Date(user.created_at).toLocaleDateString()} {new Date(user.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    
                    {/* Actions Column */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={user.user_type}
                          onValueChange={(value) => updateUserType(user.user_id, value as UserType)}
                          disabled={updating === user.user_id}
                        >
                          <SelectTrigger className="w-28 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={UserType.ANONYMOUS}>Anonymous</SelectItem>
                            <SelectItem value={UserType.REGULAR}>Regular</SelectItem>
                            <SelectItem value={UserType.ADMIN}>Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        {updating === user.user_id && (
                          <div className="w-4 h-4 border-2 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}


