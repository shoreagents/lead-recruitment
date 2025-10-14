'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Brain, 
  TrendingUp,
  Star,
  Target,
  Zap,
  Sparkles
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProcessedResume, validateResumeProcessing, extractResumeInsights } from '@/lib/utils';

interface ResumeProcessingStatusProps {
  resume: ProcessedResume;
  processingTime?: number;
  showDetails?: boolean;
}

export default function ResumeProcessingStatus({ 
  resume, 
  processingTime, 
  showDetails = true 
}: ResumeProcessingStatusProps) {
  const [quality, setQuality] = useState<any>(null);
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    // Validate resume quality
    const qualityResult = validateResumeProcessing(resume);
    setQuality(qualityResult);

    // Extract insights
    const insightsResult = extractResumeInsights(resume);
    setInsights(insightsResult);
  }, [resume]);

  if (!quality || !insights) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Processing Resume...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 animate-spin" />
            <span>Analyzing resume quality...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Star className="h-4 w-4 text-green-600" />;
    if (score >= 80) return <TrendingUp className="h-4 w-4 text-blue-600" />;
    if (score >= 70) return <Target className="h-4 w-4 text-yellow-600" />;
    if (score >= 60) return <AlertTriangle className="h-4 w-4 text-orange-600" />;
    return <AlertTriangle className="h-4 w-4 text-red-600" />;
  };

  return (
    <div className="space-y-4">
      {/* Quality Score Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getScoreIcon(quality.score)}
            Resume Quality Assessment
          </CardTitle>
          <CardDescription>
            Analysis of resume completeness and structure
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Score Display */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Quality Score:</span>
              <span className={`text-lg font-bold ${getScoreColor(quality.score)}`}>
                {quality.score}/100
              </span>
            </div>
            <Badge variant={quality.isValid ? "default" : "destructive"}>
              {quality.isValid ? "Valid" : "Needs Improvement"}
            </Badge>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={quality.score} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Poor</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Processing Time */}
          {processingTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Processed in {(processingTime / 1000).toFixed(1)}s</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strengths Card */}
      {quality.strengths.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quality.strengths.map((strength: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">{strength}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Issues Card */}
      {quality.issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Issues Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quality.issues.map((issue: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">{issue}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Suggestions Card */}
      {quality.suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-600" />
              Improvement Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {quality.suggestions.map((suggestion: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">{suggestion}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insights Card */}
      {showDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Resume Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Key Skills */}
            {insights.keySkills.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Key Skills ({insights.keySkills.length})</h4>
                <div className="flex flex-wrap gap-1">
                  {insights.keySkills.slice(0, 8).map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {insights.keySkills.length > 8 && (
                    <Badge variant="outline" className="text-xs">
                      +{insights.keySkills.length - 8} more
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Experience & Education */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-1">Experience</h4>
                <p className="text-sm text-muted-foreground">
                  ~{insights.experienceYears} years estimated
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Education</h4>
                <p className="text-sm text-muted-foreground">
                  {insights.educationLevel}
                </p>
              </div>
            </div>

            {/* Industry Focus */}
            {insights.industryFocus.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Industry Focus</h4>
                <div className="flex flex-wrap gap-1">
                  {insights.industryFocus.map((industry: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {industry}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            {insights.contactInfo.email || insights.contactInfo.phone || insights.contactInfo.linkedin ? (
              <div>
                <h4 className="font-medium mb-2">Contact Information</h4>
                <div className="space-y-1 text-sm">
                  {insights.contactInfo.email && (
                    <p className="text-muted-foreground">📧 {insights.contactInfo.email}</p>
                  )}
                  {insights.contactInfo.phone && (
                    <p className="text-muted-foreground">📞 {insights.contactInfo.phone}</p>
                  )}
                  {insights.contactInfo.linkedin && (
                    <p className="text-muted-foreground">💼 LinkedIn available</p>
                  )}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 