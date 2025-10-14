'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Building,
  MessageSquare,
  DollarSign,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  Target,
  Sparkles
} from 'lucide-react';

// Form field types
export type FieldType = 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'textarea' 
  | 'select' 
  | 'number' 
  | 'date' 
  | 'checkbox' 
  | 'radio';

// Form field definition
export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  icon?: keyof typeof fieldIcons;
  description?: string;
}

// Field icons mapping
const fieldIcons = {
  user: User,
  mail: Mail,
  phone: Phone,
  building: Building,
  message: MessageSquare,
  dollar: DollarSign,
  calendar: Calendar,
  location: MapPin,
  briefcase: Briefcase,
  users: Users,
  target: Target,
  sparkles: Sparkles
};

// Predefined form templates based on actual project components
export const FORM_TEMPLATES: Record<string, FormField[]> = {
  // Based on AnonymousUserModal
  '45_seconds_anonymous': [
    {
      id: 'industry',
      type: 'text',
      label: 'Industry',
      placeholder: 'What industry are you in?',
      required: true,
      icon: 'briefcase'
    },
    {
      id: 'employeeCount',
      type: 'text',
      label: 'Company Size',
      placeholder: 'How many employees? (e.g., 25, 100, 500+)',
      required: true,
      icon: 'users'
    },
    {
      id: 'company',
      type: 'text',
      label: 'Company Name',
      placeholder: 'Enter your company name',
      required: true,
      icon: 'building'
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Tell us about your needs',
      placeholder: 'What can we help you with?',
      required: true,
      icon: 'message'
    }
  ],
  
  // Based on PricingCalculatorModal
  'pricing_calculator': [
    {
      id: 'industry',
      type: 'text',
      label: 'Industry',
      placeholder: 'What industry are you in?',
      required: true,
      icon: 'briefcase'
    },
    {
      id: 'teamSize',
      type: 'number',
      label: 'Team Size',
      placeholder: 'How many team members do you need?',
      required: true,
      validation: { min: 1, max: 100 },
      icon: 'users'
    },
    {
      id: 'roles',
      type: 'textarea',
      label: 'Roles Needed',
      placeholder: 'Describe the roles you need (e.g., Frontend Developer, Project Manager)',
      required: true,
      icon: 'briefcase'
    },
    {
      id: 'experienceLevel',
      type: 'select',
      label: 'Experience Level',
      required: true,
      options: ['Entry Level', 'Mid Level', 'Senior Level', 'Mixed Levels'],
      icon: 'target'
    },
    {
      id: 'workspace',
      type: 'select',
      label: 'Work Arrangement',
      required: true,
      options: ['Remote', 'Hybrid', 'Office', 'Flexible'],
      icon: 'building'
    },
    {
      id: 'budget',
      type: 'number',
      label: 'Monthly Budget (PHP)',
      placeholder: 'What is your monthly budget?',
      icon: 'dollar'
    },
    {
      id: 'timeline',
      type: 'select',
      label: 'When do you need to start?',
      options: ['ASAP', '1-2 weeks', '1 month', '2-3 months', '6+ months'],
      icon: 'calendar'
    }
  ],
  
  // Based on InterviewRequestModal
  'interview_request': [
    {
      id: 'candidateName',
      type: 'text',
      label: 'Candidate Name',
      placeholder: 'Enter the candidate name',
      required: true,
      icon: 'user'
    },
    {
      id: 'candidatePosition',
      type: 'text',
      label: 'Position',
      placeholder: 'What position are they applying for?',
      required: true,
      icon: 'briefcase'
    },
    {
      id: 'interviewerName',
      type: 'text',
      label: 'Your Name',
      placeholder: 'Enter your name',
      required: true,
      icon: 'user'
    },
    {
      id: 'interviewerEmail',
      type: 'email',
      label: 'Your Email',
      placeholder: 'Enter your email',
      required: true,
      icon: 'mail'
    },
    {
      id: 'interviewerPhone',
      type: 'phone',
      label: 'Your Phone',
      placeholder: 'Enter your phone number',
      icon: 'phone'
    },
    {
      id: 'preferredDate',
      type: 'date',
      label: 'Preferred Interview Date',
      required: true,
      icon: 'calendar'
    },
    {
      id: 'timeSlot',
      type: 'select',
      label: 'Time Slot',
      options: ['9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM'],
      required: true,
      icon: 'calendar'
    },
    {
      id: 'interviewType',
      type: 'select',
      label: 'Interview Type',
      options: ['Video Call', 'Phone Call', 'In-Person', 'Hybrid'],
      required: true,
      icon: 'target'
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      placeholder: 'Any specific requirements or notes for the interview...',
      icon: 'message'
    }
  ],
  
  // Based on LoginModal
  'login_modal': [
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      icon: 'mail'
    },
    {
      id: 'password',
      type: 'text',
      label: 'Password',
      placeholder: 'Enter your password',
      required: true,
      icon: 'lock'
    },
    {
      id: 'rememberMe',
      type: 'checkbox',
      label: 'Remember me',
      options: ['Remember me for 30 days'],
      icon: 'target'
    }
  ],
  
  // Based on QuoteSummaryModal
  'quote_summary': [
    {
      id: 'quoteId',
      type: 'text',
      label: 'Quote ID',
      placeholder: 'Enter quote ID to view details',
      required: true,
      icon: 'target'
    },
    {
      id: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email to verify access',
      required: true,
      icon: 'mail'
    }
  ],
  
  // Based on EmployeeDetailsModal
  'employee_details': [
    {
      id: 'employeeId',
      type: 'text',
      label: 'Employee ID',
      placeholder: 'Enter employee ID',
      required: true,
      icon: 'user'
    },
    {
      id: 'viewerName',
      type: 'text',
      label: 'Your Name',
      placeholder: 'Enter your name',
      required: true,
      icon: 'user'
    },
    {
      id: 'viewerEmail',
      type: 'email',
      label: 'Your Email',
      placeholder: 'Enter your email',
      required: true,
      icon: 'mail'
    },
    {
      id: 'purpose',
      type: 'select',
      label: 'Purpose of Access',
      required: true,
      options: ['Hiring Review', 'Interview Preparation', 'Background Check', 'Reference Check', 'Other'],
      icon: 'target'
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Additional Notes',
      placeholder: 'Any specific information you need...',
      icon: 'message'
    }
  ],
  
  // Based on ApplicationsModal
  'applications_modal': [
    {
      id: 'applicantName',
      type: 'text',
      label: 'Applicant Name',
      placeholder: 'Enter applicant name',
      required: true,
      icon: 'user'
    },
    {
      id: 'applicantEmail',
      type: 'email',
      label: 'Applicant Email',
      placeholder: 'Enter applicant email',
      required: true,
      icon: 'mail'
    },
    {
      id: 'position',
      type: 'text',
      label: 'Position Applied For',
      placeholder: 'What position did they apply for?',
      required: true,
      icon: 'briefcase'
    },
    {
      id: 'status',
      type: 'select',
      label: 'Application Status',
      required: true,
      options: ['Submitted', 'Under Review', 'Interview Scheduled', 'Qualified', 'Rejected', 'Hired'],
      icon: 'target'
    },
    {
      id: 'notes',
      type: 'textarea',
      label: 'Application Notes',
      placeholder: 'Any notes about this application...',
      icon: 'message'
    }
  ],
  
  // Based on ResumeModal
  'resume_modal': [
    {
      id: 'candidateName',
      type: 'text',
      label: 'Candidate Name',
      placeholder: 'Enter candidate name',
      required: true,
      icon: 'user'
    },
    {
      id: 'resumeType',
      type: 'select',
      label: 'Resume Type',
      required: true,
      options: ['Technical Resume', 'Executive Resume', 'Creative Resume', 'Standard Resume'],
      icon: 'target'
    },
    {
      id: 'industry',
      type: 'text',
      label: 'Target Industry',
      placeholder: 'What industry is this for?',
      required: true,
      icon: 'briefcase'
    },
    {
      id: 'position',
      type: 'text',
      label: 'Target Position',
      placeholder: 'What position are they applying for?',
      required: true,
      icon: 'briefcase'
    },
    {
      id: 'experience',
      type: 'select',
      label: 'Experience Level',
      required: true,
      options: ['Entry Level (0-2 years)', 'Mid Level (3-5 years)', 'Senior Level (6+ years)', 'Executive Level'],
      icon: 'target'
    },
    {
      id: 'skills',
      type: 'textarea',
      label: 'Key Skills',
      placeholder: 'List the most important skills for this role...',
      icon: 'message'
    }
  ]
};

interface MayaFormBuilderProps {
  formType: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: Record<string, any>) => void;
  title?: string;
  description?: string;
}

export function MayaFormBuilder({ 
  formType, 
  isOpen, 
  onClose, 
  onSubmit,
  title,
  description 
}: MayaFormBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get form fields for the current form type
  const formFields = FORM_TEMPLATES[formType] || [];
  const currentField = formFields[currentStep];
  const totalSteps = formFields.length;

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setFormData({});
      setErrors({});
    }
  }, [isOpen]);

  // Handle field value change
  const handleFieldChange = (value: any) => {
    setFormData(prev => ({
      ...prev,
      [currentField.id]: value
    }));
    
    // Clear error for this field
    if (errors[currentField.id]) {
      setErrors(prev => ({
        ...prev,
        [currentField.id]: ''
      }));
    }
  };

  // Validate current field
  const validateField = (value: any): string => {
    if (currentField.required && (!value || value.toString().trim() === '')) {
      return `${currentField.label} is required`;
    }

    if (currentField.validation) {
      const { min, max, pattern } = currentField.validation;
      
      if (min !== undefined && value < min) {
        return `Value must be at least ${min}`;
      }
      
      if (max !== undefined && value > max) {
        return `Value must be at most ${max}`;
      }
      
      if (pattern && !new RegExp(pattern).test(value)) {
        return currentField.validation.message || 'Invalid format';
      }
    }

    return '';
  };

  // Handle next step
  const handleNext = () => {
    const value = formData[currentField.id];
    const error = validateField(value);
    
    if (error) {
      setErrors(prev => ({
        ...prev,
        [currentField.id]: error
      }));
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit form
      handleSubmit();
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      // Close modal after successful submission
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !currentField) return null;

  const IconComponent = currentField.icon ? fieldIcons[currentField.icon] : User;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime-100 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-lime-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {title || `Maya's ${formType.charAt(0).toUpperCase() + formType.slice(1)} Form`}
              </h2>
              <p className="text-sm text-gray-600">
                Step {currentStep + 1} of {totalSteps}
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Progress</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-lime-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6">
          {/* Field Description */}
          {currentField.description && (
            <div className="mb-4 p-3 bg-lime-50 rounded-lg">
              <p className="text-sm text-lime-800">{currentField.description}</p>
            </div>
          )}

          {/* Current Field */}
          <div className="space-y-4">
            <div>
              <Label htmlFor={currentField.id} className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <IconComponent className="w-4 h-4" />
                {currentField.label}
                {currentField.required && <span className="text-red-500">*</span>}
              </Label>
              
              {/* Render different field types */}
              {currentField.type === 'text' && (
                <Input
                  id={currentField.id}
                  type="text"
                  value={formData[currentField.id] || ''}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  placeholder={currentField.placeholder}
                  className="mt-1"
                />
              )}
              
              {currentField.type === 'email' && (
                <Input
                  id={currentField.id}
                  type="email"
                  value={formData[currentField.id] || ''}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  placeholder={currentField.placeholder}
                  className="mt-1"
                />
              )}
              
              {currentField.type === 'phone' && (
                <Input
                  id={currentField.id}
                  type="tel"
                  value={formData[currentField.id] || ''}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  placeholder={currentField.placeholder}
                  className="mt-1"
                />
              )}
              
              {currentField.type === 'number' && (
                <Input
                  id={currentField.id}
                  type="number"
                  value={formData[currentField.id] || ''}
                  onChange={(e) => handleFieldChange(Number(e.target.value))}
                  placeholder={currentField.placeholder}
                  className="mt-1"
                  min={currentField.validation?.min}
                  max={currentField.validation?.max}
                />
              )}
              
              {currentField.type === 'date' && (
                <Input
                  id={currentField.id}
                  type="date"
                  value={formData[currentField.id] || ''}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  className="mt-1"
                />
              )}
              
              {currentField.type === 'textarea' && (
                <Textarea
                  id={currentField.id}
                  value={formData[currentField.id] || ''}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  placeholder={currentField.placeholder}
                  className="mt-1"
                  rows={4}
                />
              )}
              
              {currentField.type === 'select' && (
                <select
                  id={currentField.id}
                  value={formData[currentField.id] || ''}
                  onChange={(e) => handleFieldChange(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                >
                  <option value="">Select an option</option>
                  {currentField.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              
              {currentField.type === 'radio' && currentField.options && (
                <div className="mt-2 space-y-2">
                  {currentField.options.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={currentField.id}
                        value={option}
                        checked={formData[currentField.id] === option}
                        onChange={(e) => handleFieldChange(e.target.value)}
                        className="text-lime-600 focus:ring-lime-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {currentField.type === 'checkbox' && currentField.options && (
                <div className="mt-2 space-y-2">
                  {currentField.options.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={option}
                        checked={formData[currentField.id]?.includes(option) || false}
                        onChange={(e) => {
                          const currentValues = formData[currentField.id] || [];
                          const newValues = e.target.checked
                            ? [...currentValues, option]
                            : currentValues.filter((v: string) => v !== option);
                          handleFieldChange(newValues);
                        }}
                        className="text-lime-600 focus:ring-lime-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Error Message */}
              {errors[currentField.id] && (
                <p className="mt-1 text-sm text-red-600">{errors[currentField.id]}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="text-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-lime-600 hover:bg-lime-700 text-white flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full border-2 border-white border-t-transparent w-4 h-4" />
                  Submitting...
                </>
              ) : currentStep === totalSteps - 1 ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Submit
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
