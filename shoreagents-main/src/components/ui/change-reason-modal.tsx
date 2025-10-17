'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface ChangeReasonModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  leadName: string
  fromColumn: string
  toColumn: string
}

export function ChangeReasonModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  leadName, 
  fromColumn, 
  toColumn 
}: ChangeReasonModalProps) {
  const [reason, setReason] = useState('')
  const [showReasonField, setShowReasonField] = useState(false)

  console.log('🎯 ChangeReasonModal render:', { isOpen, leadName, fromColumn, toColumn })

  const handleYes = () => {
    console.log('✅ User clicked Yes')
    if (showReasonField) {
      onConfirm(reason)
    } else {
      onConfirm('')
    }
    setReason('')
    setShowReasonField(false)
    // Don't call onClose here - let the parent component handle closing
  }

  const handleNo = () => {
    console.log('❌ User clicked No')
    setReason('')
    setShowReasonField(false)
    onClose()
  }

  const getColumnName = (columnId: string) => {
    const columnMap: { [key: string]: string } = {
      'new_lead': 'New Lead',
      'stage_1': 'Stage 1',
      'stage_2': 'Stage 2',
      'pending': 'Pending',
      'meeting_booked': 'Meeting Booked',
      'signed_up': 'Signed Up',
      'closed_won': 'Closed Won'
    }
    return columnMap[columnId] || columnId
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg font-semibold">Confirm Lead Status Change</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">
              <strong>Lead:</strong> {leadName}
            </div>
            <div className="text-sm text-gray-600">
              <strong>Moving from:</strong> {getColumnName(fromColumn)} → <strong>to:</strong> {getColumnName(toColumn)}
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-700 mb-4">Are you sure you want to move this lead?</p>
            
            {!showReasonField && (
              <div className="space-y-2">
                <Button 
                  onClick={handleYes}
                  className="bg-lime-600 hover:bg-lime-700 text-white mr-2"
                >
                  Yes, Move Lead
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleNo}
                  className="border-gray-300"
                >
                  No, Cancel
                </Button>
                <div className="mt-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowReasonField(true)}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Add reason (optional)
                  </Button>
                </div>
              </div>
            )}

            {showReasonField && (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="reason" className="text-sm font-medium">
                    Reason for change (optional)
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter reason for moving this lead..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex justify-center gap-3">
                  <Button 
                    onClick={handleYes}
                    className="bg-lime-600 hover:bg-lime-700 text-white"
                  >
                    Yes, Move Lead
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleNo}
                    className="border-gray-300"
                  >
                    No, Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
