"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCurrency } from '@/lib/currencyContext'
import { getFixedWorkspaceCost, convertSalaryToCurrency } from '@/lib/fixedPricingService'
import { getFallbackSalary } from '@/lib/salaryLookupService'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface MayaPricingSummaryCardProps {
  formData: any
  onConfirm: () => void
  onEdit: (field: string) => void
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
  generateMessageId: () => string
  showCandidateMessage?: boolean
}

export const MayaPricingSummaryCard = ({
  formData,
  onConfirm,
  onEdit,
  setMessages,
  generateMessageId,
  showCandidateMessage = true
}: MayaPricingSummaryCardProps) => {
  const [quoteData, setQuoteData] = useState<any>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [hasShownCandidateMessage, setHasShownCandidateMessage] = useState(false)
  
  // Use currency context for IP-based currency detection
  const { selectedCurrency, formatPrice } = useCurrency()

  // Automatically trigger candidate recommendation after summary is shown
  useEffect(() => {
    if (quoteData && !hasShownCandidateMessage && showCandidateMessage) {
      // Add Maya's message asking about candidate recommendations
      const mayaMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: 'Would you like to see recommended candidates based on your requirements? I can show you talented professionals that match your specific needs.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, mayaMessage])
      
      // Mark that we've shown the candidate message
      setHasShownCandidateMessage(true)
      
      // Automatically go to candidate confirmation step after a delay
      setTimeout(() => {
        onEdit('candidateConfirmation')
      }, 2000) // Increased delay to let the quote summary be visible first
    }
  }, [quoteData, hasShownCandidateMessage, showCandidateMessage, generateMessageId, setMessages, onEdit])

  // Calculate pricing based on form data
  useEffect(() => {
    const calculatePricing = async () => {
      setIsCalculating(true)
      
      try {
        // Basic pricing calculation based on team size and roles
        const teamSize = parseInt(formData.teamSize || '1')
        const experience = formData.experience || 'mid'
        const workplaceSetup = formData.workplaceSetup || 'yes'
        const workplaceType = formData.workplaceType || 'work-from-home'
        
        // Use role-specific salary calculation (same as main pricing calculator)
        const getMultiplier = (level: 'entry' | 'mid' | 'senior') => {
          switch (level) {
            case 'entry': return 1.7;
            case 'mid': return 1.5;
            case 'senior': return 1.4;
            default: return 1.7;
          }
        }
        
        // Calculate role-specific costs for each member
        let totalStaffCost = 0
        let totalWorkspaceCost = 0
        const breakdown = []
        
        for (let i = 1; i <= teamSize; i++) {
          // Get the actual role for this member
          const memberRole = formData[`member${i}Role`] || formData.roles || 'Team Member'
          
          // Get individual experience level for this member, or use global experience
          const memberExperience = formData[`member${i}Experience`] || experience
          
          // Get role-specific salary from Philippine database
          const expectedSalaryPHP = getFallbackSalary(memberRole, memberExperience as 'entry' | 'mid' | 'senior')
          const levelMultiplier = getMultiplier(memberExperience as 'entry' | 'mid' | 'senior')
          
          // Convert salary to target currency
          const convertedSalary = convertSalaryToCurrency(expectedSalaryPHP, selectedCurrency.code)
          const salaryCostPerPerson = convertedSalary * levelMultiplier
          
          // Get workspace cost for this member
          const memberWorkplace = formData[`member${i}Workplace`] || workplaceType
          const memberWorkspaceType = memberWorkplace === 'work-from-home' ? 'wfh' : 
                                     memberWorkplace === 'hybrid' ? 'hybrid' : 'office'
          
          const memberWorkspaceCost = getFixedWorkspaceCost(memberWorkspaceType as 'wfh' | 'hybrid' | 'office', selectedCurrency.code)
          const memberTotalCost = salaryCostPerPerson + memberWorkspaceCost
          
          // Add to totals
          totalStaffCost += salaryCostPerPerson
          totalWorkspaceCost += memberWorkspaceCost
          
          breakdown.push({
            role: memberRole,
            level: memberExperience,
            workspace: memberWorkplace,
            salaryCost: salaryCostPerPerson,
            workspaceCost: memberWorkspaceCost,
            totalCost: memberTotalCost
          })
        }
        
        const totalMonthlyCost = totalStaffCost + totalWorkspaceCost
        
        // Workplace breakdown
        const workplaceCounts = breakdown.reduce((acc, item) => {
          acc[item.workspace] = (acc[item.workspace] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        const workplaceBreakdown = Object.entries(workplaceCounts)
          .map(([workspace, count]) => `${count}x ${workspace.toUpperCase()}`)
          .join(', ')
        
        setQuoteData({
          totalMembers: teamSize,
          industry: formData.industry || 'Not specified',
          workplaceBreakdown,
          totalMonthlyCost,
          totalStaffCost,
          totalWorkspaceCost,
          breakdown,
          experience,
          roles: formData.roles || 'Team Member'
        })
        
      } catch (error) {
        console.error('Error calculating pricing:', error)
      } finally {
        setIsCalculating(false)
      }
    }
    
    calculatePricing()
  }, [formData])


  // Use the currency context's formatPrice function instead of hardcoded USD


  if (isCalculating) {
    return (
      <div className="flex justify-start mb-4">
        <div className="max-w-[80%]">
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lime-600"></div>
              <span className="text-sm text-gray-600">Calculating your personalized quote...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[80%]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm"
        >
          <div className="space-y-4">
            {/* Header without Maya icon */}
            <div>
              <h3 className="font-semibold text-gray-900">Your Personalized Quote</h3>
              <p className="text-sm text-gray-600">Here's your estimated monthly cost breakdown</p>
            </div>

            {quoteData && (
              <div className="space-y-4">
                {/* Quote Summary */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Members:</span>
                    <span className="font-semibold">{quoteData.totalMembers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Workplace Setup:</span>
                    <span className="font-semibold text-sm">{quoteData.workplaceBreakdown}</span>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-3">Cost Breakdown</h4>
                  <div className="space-y-2">
                    {quoteData.breakdown.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.role} ({item.level}) - {item.workspace}</span>
                        <span>{formatPrice(item.totalCost)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Monthly Cost */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Monthly Cost:</span>
                    <span className="text-lime-600">{formatPrice(quoteData.totalMonthlyCost)}</span>
                  </div>
                </div>

              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
