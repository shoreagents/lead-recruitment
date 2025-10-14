"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'

export default function OurTeamPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/about">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-lime-600">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to About
              </Button>
            </Link>
          </div>
          <div className="flex items-start space-x-6">
            <div className="flex-shrink-0 p-4 bg-lime-100 rounded-xl">
              <Users className="w-8 h-8 text-lime-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
              <p className="text-xl text-gray-600 max-w-3xl">
                This is a page for the team.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="bg-white rounded-xl shadow-lg p-12 max-w-2xl mx-auto">
            <Users className="w-16 h-16 text-lime-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Page</h2>
            <p className="text-gray-600 mb-6">
              This is a placeholder page for the team section. Content will be added here later.
            </p>
            <div className="w-24 h-24 bg-lime-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Users className="w-12 h-12 text-lime-600" />
            </div>
            <p className="text-sm text-gray-500">
              Team information and member details will be displayed on this page.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
