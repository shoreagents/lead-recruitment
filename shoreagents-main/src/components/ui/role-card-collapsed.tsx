'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit3, Trash2 } from 'lucide-react';
import { Button } from './button';

interface RoleCardCollapsedProps {
  roleTitle: string;
  roleDescription: string;
  roleIndex: number;
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

export function RoleCardCollapsed({
  roleTitle,
  roleDescription,
  roleIndex,
  onEdit,
  onDelete,
  className = ""
}: RoleCardCollapsedProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`border border-gray-200 rounded-lg bg-white shadow-sm ${className}`}>
      {/* Collapsed Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleExpanded}
              className="flex items-center space-x-2 text-left hover:bg-gray-50 p-2 rounded-md transition-colors"
            >
              <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">{roleIndex}</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">{roleTitle || `Role ${roleIndex}`}</h4>
                <p className="text-sm text-gray-500">
                  {isExpanded ? 'Click to collapse' : 'Click to expand details'}
                </p>
              </div>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="text-gray-600 hover:text-gray-700"
            >
              <Edit3 className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
            <button
              onClick={toggleExpanded}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100">
          <div className="pt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Role Description:</h5>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {roleDescription || 'No description provided'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
