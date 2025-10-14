'use client';

import { useState } from 'react';
import { EmployeeCardData, ResumeGenerated } from '@/types/api';
import Image from 'next/image';
import { Button } from './button';
import { 
  User, 
  MapPin, 
  Mail, 
  Calendar, 
  FileText, 
  Brain, 
  ChevronDown, 
  ChevronUp,
  Briefcase,
  Building,
  DollarSign,
  Smile,
  Clock,
  Heart
} from 'lucide-react';
import { ApplicationsModal } from './applications-modal';
import { useFavorites } from '@/lib/favorites-context';

interface EmployeeCardProps {
  data: EmployeeCardData;
  onViewDetails?: (data: EmployeeCardData) => void;
  onViewResume?: (resume: ResumeGenerated) => void;
}

export function EmployeeCard({ data, onViewDetails, onViewResume }: EmployeeCardProps) {
  const [showApplications, setShowApplications] = useState(false);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();

  const hasApplications = data.applications && data.applications.length > 0;
  const hasAppliedJobs = data.appliedJobs && data.appliedJobs.length > 0;
  const hasWorkStatus = data.workStatus;

  const getMoodIcon = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'happy':
        return <Smile className="w-4 h-4 text-green-500" />;
      case 'sad':
        return <Smile className="w-4 h-4 text-red-500" style={{ transform: 'rotate(180deg)' }} />;
      case 'neutral':
        return <Smile className="w-4 h-4 text-yellow-500" />;
      default:
        return <Smile className="w-4 h-4 text-gray-500" />;
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

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 h-[450px] flex flex-col group card-hover-effect">
        {/* Header with Avatar and Basic Info */}
        <div className="p-6 pb-4">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 avatar-hover-effect">
              {data.user.avatar ? (
                <Image
                  src={data.user.avatar}
                  alt={data.user.name}
                  className="w-16 h-16 rounded-full object-cover"
                  width={64}
                  height={64}
                />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate group-hover:text-lime-700 transition-colors duration-200">
                  {data.user.name}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(data.user.id);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                  title={isFavorite(data.user.id) ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart 
                    className={`w-4 h-4 ${
                      isFavorite(data.user.id) 
                        ? 'text-red-500 fill-current' 
                        : 'text-gray-400 hover:text-red-500'
                    }`} 
                  />
                </button>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {hasWorkStatus && data.workStatus ? data.workStatus.currentPosition : (data.user.position || 'Position not specified')}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500 truncate">
                  {data.user.location || 'Location not specified'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Work Status Information */}
        {hasWorkStatus && (
          <div className="px-6 pb-4">
            <div className="bg-blue-50 rounded-lg p-3 space-y-2 hover:bg-blue-100 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    {data.workStatus?.currentEmployer}
                  </span>
                </div>
                {getMoodIcon(data.workStatus?.currentMood || 'neutral')}
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-3 h-3 text-green-600" />
                  <span className="text-green-700">
                    {formatSalary(String(data.workStatus?.expectedSalary || 0))}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-orange-600" />
                  <span className="text-orange-700">
                    {data.workStatus?.noticePeriodDays || 0} days notice
                  </span>
                </div>
              </div>
              <div className="text-xs text-blue-700">
                Goal: {formatSalary(String(data.workStatus?.expectedSalary || 0))} • {data.workStatus?.workSetup || 'Unknown'}
              </div>
            </div>
          </div>
        )}

        {/* Contact Info */}
        <div className="px-6 pb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Mail className="w-4 h-4" />
            <span className="truncate">{data.user.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
            <Calendar className="w-4 h-4" />
            <span>Joined {new Date(data.user.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Indicators */}
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-2">
            {data.aiAnalysis && (
              <div className="flex items-center space-x-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs hover:bg-blue-100 transition-colors duration-200 badge-hover-effect">
                <Brain className="w-3 h-3" />
                <span>AI Analyzed</span>
              </div>
            )}
            {data.resume && (
              <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs hover:bg-green-100 transition-colors duration-200 badge-hover-effect">
                <FileText className="w-3 h-3" />
                <span>Resume Available</span>
              </div>
            )}
            {hasApplications && (
              <div className="flex items-center space-x-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs hover:bg-purple-100 transition-colors duration-200 badge-hover-effect">
                <Briefcase className="w-3 h-3" />
                <span>{data.applications.length} Applications</span>
              </div>
            )}
            {hasWorkStatus && (
              <div className="flex items-center space-x-1 bg-orange-50 text-orange-700 px-2 py-1 rounded-full text-xs hover:bg-orange-100 transition-colors duration-200 badge-hover-effect">
                <Briefcase className="w-3 h-3" />
                <span className="capitalize">{data.workStatus?.workStatus || 'Unknown'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Applications Section - Collapsible */}
        {hasApplications && (
          <div className="px-6 pb-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-900">Recent Applications</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowApplications(!showApplications)}
                className="p-1 h-auto"
              >
                {showApplications ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            {showApplications && (
              <div className="space-y-2 flex-1 overflow-hidden">
                {data.applications.slice(0, 2).map((application) => {
                  const appliedJob = data.appliedJobs.find(job => job.id.toString() === application.job_id);
                  return (
                    <div key={application.id} className="bg-gray-50 rounded-lg p-3 text-sm hover:bg-gray-100 transition-colors duration-200">
                      <div className="font-medium text-gray-900 truncate">
                        {appliedJob?.job_title || 'Unknown Position'}
                      </div>
                      <div className="text-gray-600 text-xs">
                        Status: <span className="capitalize">{application.status}</span>
                      </div>
                    </div>
                  );
                })}
                {data.applications.length > 2 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{data.applications.length - 2} more applications
                  </div>
                )}
              </div>
            )}
            
            {!showApplications && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsApplicationsModalOpen(true)}
                className="w-full mt-auto"
              >
                Show Recent Applications
              </Button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 pt-4 border-t border-gray-100 mt-auto">
          <div className="flex space-x-2">
            {data.resume && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onViewResume?.(data.resume!)}
                className="flex items-center space-x-1 flex-1"
              >
                <FileText className="w-4 h-4" />
                <span>View Resume</span>
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={() => onViewDetails?.(data)}
              className="flex items-center space-x-1 flex-1"
            >
              <User className="w-4 h-4" />
              <span>View Details</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Applications Modal */}
      <ApplicationsModal
        applications={data.applications}
        appliedJobs={data.appliedJobs}
        isOpen={isApplicationsModalOpen}
        onClose={() => setIsApplicationsModalOpen(false)}
        employeeName={data.user.name}
      />
    </>
  );
}
