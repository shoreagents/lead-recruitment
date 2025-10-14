'use client';

import { useState, useEffect } from 'react';
import { Application, Job } from '@/types/api';
import { Button } from './button';
import { X, Briefcase, Calendar, MapPin, DollarSign, Clock } from 'lucide-react';

interface ApplicationsModalProps {
  applications: Application[];
  appliedJobs: Job[];
  isOpen: boolean;
  onClose: () => void;
  employeeName: string;
}

export function ApplicationsModal({ 
  applications, 
  appliedJobs, 
  isOpen, 
  onClose, 
  employeeName 
}: ApplicationsModalProps) {
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

  if (!isOpen) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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
        className={`relative bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden modal-content ${
          isVisible ? 'modal-content-enter' : 'modal-content-exit'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Applications
              </h2>
              <p className="text-sm text-gray-600">
                {employeeName} • {applications.length} applications
              </p>
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
          <div className="space-y-4">
            {applications.map((application) => {
              const appliedJob = appliedJobs.find(job => job.id.toString() === application.job_id);
              
              return (
                <div key={application.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {appliedJob?.job_title || 'Unknown Position'}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {appliedJob?.department && (
                          <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{appliedJob.department}</span>
                          </div>
                        )}
                        {appliedJob?.work_arrangement && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{appliedJob.work_arrangement}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {appliedJob?.salary_min && appliedJob?.salary_max && (
                      <div className="flex items-center space-x-2 text-sm">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {appliedJob.currency} {appliedJob.salary_min.toLocaleString()} - {appliedJob.salary_max.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Applied: {formatDate(application.created_at)}
                      </span>
                    </div>
                    {appliedJob?.views && (
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {appliedJob.views} views • {appliedJob.applicants} applicants
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Application Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Application ID:</span>
                        <span className="ml-2 font-mono text-gray-900">{application.id}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Resume ID:</span>
                        <span className="ml-2 font-mono text-gray-900">{application.resume_id}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Position:</span>
                        <span className="ml-2 text-gray-900">{application.position}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Resume Slug:</span>
                        <span className="ml-2 font-mono text-gray-900">{application.resume_slug}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {applications.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Applications Yet</h3>
              <p className="text-gray-600">
                {employeeName} hasn't submitted any job applications yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
