'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Target, 
  ArrowRight, 
  BookOpen,
  MessageSquare,
  Trophy,
  Search,
  Heart,
  MapPin,
  Zap,
  Star,
  CheckCircle
} from 'lucide-react';

export default function JobsCards() {
  const router = useRouter();

  const jobTools = [
    {
      id: 'interview-prep',
      title: 'Interview Prep',
      description: 'Master your BPO interviews with personalized practice sessions and expert tips.',
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      hoverBorder: 'hover:border-blue-400/40',
      buttonGradient: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      shadowColor: 'shadow-blue-500/25',
      features: [
        { icon: MessageSquare, text: 'Mock Interviews' },
        { icon: BookOpen, text: 'Question Bank' },
        { icon: Trophy, text: 'Performance Tracking' }
      ],
      comingSoon: true,
      href: '/jobs/interview-prep'
    },
    {
      id: 'job-matching',
      title: 'Job Matching',
      description: 'Find your perfect BPO role with AI-powered matching based on skills and preferences.',
      icon: Target,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      hoverBorder: 'hover:border-purple-400/40',
      buttonGradient: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      shadowColor: 'shadow-purple-500/25',
      features: [
        { icon: Search, text: 'Smart Job Search' },
        { icon: Heart, text: 'Skill Matching' },
        { icon: MapPin, text: 'Location Based' }
      ],
      comingSoon: false,
      href: '/jobs/job-matching'
    }
  ];

  const handleToolClick = (tool: typeof jobTools[0]) => {
    if (!tool.comingSoon && tool.href) {
      router.push(tool.href);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {jobTools.map((tool, index) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <Card className={`glass-card ${tool.borderColor} ${tool.hoverBorder} h-full transition-all duration-300 ${tool.shadowColor}`}>
            <CardHeader className="text-center">
              <motion.div
                className={`w-16 h-16 ${tool.bgColor} rounded-lg flex items-center justify-center mx-auto mb-4 transition-all duration-300`}
              >
                <tool.icon className={`w-8 h-8 ${tool.color}`} />
              </motion.div>
              
              <div className="flex items-center justify-center gap-2 mb-2">
                <CardTitle className="text-2xl text-white transition-all duration-300">
                  {tool.title}
                </CardTitle>
                {tool.comingSoon && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                    Soon
                  </Badge>
                )}
              </div>
              
              <CardDescription className="text-gray-300 leading-relaxed">
                {tool.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Features */}
              <div className="space-y-3">
                {tool.features.map((feature, featureIndex) => (
                  <motion.div
                    key={featureIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (featureIndex * 0.05) }}
                    className="flex items-center space-x-3 text-gray-300 transition-colors duration-300"
                  >
                    <div className={`w-6 h-6 ${tool.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <feature.icon className={`w-3 h-3 ${tool.color}`} />
                    </div>
                    <span className="text-sm">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Action Button */}
              <Button 
                className={`w-full bg-gradient-to-r ${tool.buttonGradient} text-white border-0 shadow-lg ${tool.shadowColor} transition-all duration-300 ${tool.comingSoon ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={tool.comingSoon}
                onClick={() => handleToolClick(tool)}
              >
                <span className="flex items-center justify-center">
                  {tool.comingSoon ? 'Coming Soon' : `Start ${tool.title}`}
                  {!tool.comingSoon && <ArrowRight className="w-4 h-4 ml-2 transition-transform" />}
                </span>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
} 