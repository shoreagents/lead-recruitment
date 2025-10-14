'use client';

import { useState, useEffect } from 'react';
import { ResumeGenerated } from '@/types/api';
import { Button } from './button';
import { X, FileText } from 'lucide-react';

interface ResumeModalProps {
  resume: ResumeGenerated | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ResumeModal({ resume, isOpen, onClose }: ResumeModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !resume) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm modal-backdrop ${
          isVisible ? 'modal-backdrop-enter' : 'modal-backdrop-exit'
        }`}
        onClick={onClose}
      />
      
      {/* Modal */}
      <div 
        className={`relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden modal-content ${
          isVisible ? 'modal-content-enter' : 'modal-content-exit'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Resume Details</h2>
              <p className="text-sm text-gray-600">Generated on {new Date(resume.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Resume Information */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Resume Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Resume ID:</span>
                  <span className="font-mono text-gray-900">{resume.id}</span>
                </div>
                                 <div className="flex justify-between">
                   <span className="text-gray-600">Template:</span>
                   <span className="font-mono text-gray-900">{resume.template_used}</span>
                 </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-gray-900">{new Date(resume.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

                         {/* Resume Content Preview */}
             {resume.generation_metadata.originalResumeData && (
               <div className="bg-gray-50 rounded-lg p-4">
                 <h3 className="font-medium text-gray-900 mb-2">Resume Content Preview</h3>
                 <div className="bg-white rounded border p-3 text-sm text-gray-700 max-h-60 overflow-y-auto">
                   {(() => {
                     const data = resume.generation_metadata.originalResumeData;
                     return (
                       <div className="space-y-3">
                         {data.name && (
                           <div>
                             <strong>Name:</strong> {data.name}
                           </div>
                         )}
                         {data.location && (
                           <div>
                             <strong>Location:</strong> {data.location}
                           </div>
                         )}
                         {data.summary && (
                           <div>
                             <strong>Summary:</strong>
                             <p className="mt-1 text-gray-600">{data.summary}</p>
                           </div>
                         )}
                         {data.skills && (
                           <div>
                             <strong>Skills:</strong>
                             <div className="mt-1 flex flex-wrap gap-1">
                               {Array.isArray(data.skills) ? (
                                 data.skills.map((skill: string, index: number) => (
                                   <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                     {skill}
                                   </span>
                                 ))
                               ) : (
                                 Object.entries(data.skills).map(([key, value]) => 
                                   value ? (
                                     <span key={key} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                       {key}: {value}
                                     </span>
                                   ) : null
                                 )
                               )}
                             </div>
                           </div>
                         )}
                         {data.files && data.files.length > 0 && (
                           <div>
                             <strong>Original Files:</strong>
                             <div className="mt-1">
                                                               {data.files.map((file: Record<string, unknown>, index: number) => (
                                  <div key={index} className="text-gray-600">
                                    📎 {String(file.fileName || 'Unknown file')} ({String(file.fileType || 'Unknown type')})
                                  </div>
                                ))}
                             </div>
                           </div>
                         )}
                       </div>
                     );
                   })()}
                 </div>
               </div>
             )}


          </div>
        </div>
      </div>
    </div>
  );
}
