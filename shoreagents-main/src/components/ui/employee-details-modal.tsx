'use client';

import { useState, useEffect } from 'react';
import { EmployeeCardData, ResumeGenerated } from '@/types/api';
import Image from 'next/image';
import { Button } from './button';
import { 
  X, 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Building, 
  DollarSign, 
  Clock, 
  Smile,
  Briefcase,
  FileText,
  Brain,
  ExternalLink,
  Download
} from 'lucide-react';
import { useToast } from '@/lib/toast-context';

interface EmployeeDetailsModalProps {
  employee: EmployeeCardData | null;
  isOpen: boolean;
  onClose: () => void;
  onViewResume?: (resume: ResumeGenerated) => void;
}

export function EmployeeDetailsModal({ employee, isOpen, onClose, onViewResume }: EmployeeDetailsModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { showToast } = useToast();

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

  if (!isOpen || !employee) return null;

  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'happy':
        return <Smile className="w-5 h-5 text-green-500" />;
      case 'sad':
        return <Smile className="w-5 h-5 text-red-500" style={{ transform: 'rotate(180deg)' }} />;
      case 'neutral':
        return <Smile className="w-5 h-5 text-yellow-500" />;
      default:
        return <Smile className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatSalary = (salary: string) => {
    const num = parseFloat(salary);
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(0)}K`;
    }
    return `$${num.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
        className={`relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden modal-content ${
          isVisible ? 'modal-content-enter' : 'modal-content-exit'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center">
              {employee.user.avatar ? (
                <Image 
                  src={employee.user.avatar} 
                  alt={employee.user.name}
                  className="w-16 h-16 rounded-full object-cover"
                  width={64}
                  height={64}
                />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{employee.user.name}</h2>
              <p className="text-lg text-gray-600">
                {employee.workStatus?.currentPosition || employee.user.position || 'Position not specified'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Column - Basic Info & Work Status */}
            <div className="space-y-6">
              
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{employee.user.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{employee.user.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">Joined {formatDate(employee.user.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Work Status */}
              {employee.workStatus && (
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building className="w-5 h-5 mr-2 text-blue-600" />
                    Current Work Status
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Employer:</span>
                      <span className="font-medium text-gray-900">{employee.workStatus.currentEmployer}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Position:</span>
                      <span className="font-medium text-gray-900">{employee.workStatus.currentPosition}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Current Salary:</span>
                      <span className="font-medium text-green-700">{formatSalary(employee.workStatus.expectedSalary)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Salary Goal:</span>
                      <span className="font-medium text-blue-700">{formatSalary(employee.workStatus.expectedSalary)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Notice Period:</span>
                      <span className="font-medium text-orange-700">{employee.workStatus.noticePeriodDays} days</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Employment Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{employee.workStatus.workSetup}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Current Mood:</span>
                      <div className="flex items-center space-x-2">
                        {getMoodIcon(employee.workStatus.currentMood)}
                        <span className="font-medium text-gray-900 capitalize">{employee.workStatus.currentMood}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Work Status:</span>
                      <span className="font-medium text-gray-900 capitalize">{employee.workStatus.workStatus}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Skills & Qualifications */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-green-600" />
                  Skills & Qualifications
                </h3>
                <div className="space-y-3">
                  {employee.aiAnalysis && (
                    <div className="flex items-center space-x-2">
                      <Brain className="w-4 h-4 text-green-500" />
                      <span className="text-green-700 font-medium">AI Analysis Available</span>
                    </div>
                  )}
                  {employee.resume && (
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      <span className="text-blue-700 font-medium">Resume Available</span>
                    </div>
                  )}
                  {employee.applications.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-purple-500" />
                      <span className="text-purple-700 font-medium">{employee.applications.length} Applications</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Applications & Actions */}
            <div className="space-y-6">
              
              {/* Recent Applications */}
              {employee.applications.length > 0 && (
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                    Recent Applications ({employee.applications.length})
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {employee.applications.map((application) => {
                      const appliedJob = employee.appliedJobs.find(job => job.id.toString() === application.job_id);
                      return (
                        <div key={application.id} className="bg-white rounded-lg p-4 border border-purple-100">
                          <div className="font-medium text-gray-900">
                            {appliedJob?.job_title || 'Unknown Position'}
                          </div>
                          <div className="text-sm text-gray-600">
                            {appliedJob?.department} • {appliedJob?.work_arrangement}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">
                              Applied: {formatDate(application.created_at)}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              application.status === 'qualified' ? 'bg-green-100 text-green-800' :
                              application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {application.status}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  {employee.resume && (
                    <Button
                      onClick={() => onViewResume?.(employee.resume!)}
                      className="w-full flex items-center justify-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Resume</span>
                    </Button>
                  )}
                  
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={() => {
                      showToast('Contact information copied to clipboard!', 'success');
                      navigator.clipboard.writeText(employee.user.email);
                    }}
                  >
                    <Mail className="w-4 h-4" />
                    <span>Copy Email</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2"
                    onClick={() => {
                      const message = `Hi ${employee.user.name}, I'm interested in discussing potential opportunities with you.`;
                      const mailtoLink = `mailto:${employee.user.email}?subject=Opportunity Discussion&body=${encodeURIComponent(message)}`;
                      window.open(mailtoLink);
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Send Email</span>
                  </Button>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div>User ID: <span className="font-mono text-gray-900">{employee.user.id}</span></div>
                  {employee.workStatus && (
                    <>
                      <div>Work Status ID: <span className="font-mono text-gray-900">{employee.workStatus.userId}</span></div>
                      <div>Last Updated: <span className="text-gray-900">{formatDate(employee.workStatus.updatedAt)}</span></div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
