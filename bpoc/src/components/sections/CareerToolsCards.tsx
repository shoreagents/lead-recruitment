'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GamepadIcon, 
  BrainIcon, 
  Calculator, 
  ArrowRight, 
  Trophy,
  Target,
  TrendingUp,
  Timer,
  Users,
  Star
} from 'lucide-react';

export default function CareerToolsCards() {
  const router = useRouter();

  const careerTools = [
    {
      id: 'games',
      title: 'Career Games',
      description: 'Level up your skills through interactive challenges and earn achievements.',
      icon: GamepadIcon,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/20',
      hoverBorder: 'hover:border-green-400/30',
      buttonGradient: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      shadowColor: 'shadow-green-500/25',
      features: [
        { icon: Trophy, text: 'Skill Challenges' },
        { icon: Target, text: 'Achievement System' },
        { icon: Users, text: 'Leaderboards' }
      ],
      comingSoon: false,
      href: '/career-tools/games'
    },
    {
      id: 'assessments',
      title: 'Skills Assessment',
      description: 'Comprehensive evaluation of your BPO readiness and professional capabilities.',
      icon: BrainIcon,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      hoverBorder: 'hover:border-cyan-400/30',
      buttonGradient: 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700',
      shadowColor: 'shadow-cyan-500/25',
      features: [
        { icon: Timer, text: 'Typing Speed Test' },
        { icon: BrainIcon, text: 'Personality Test' },
        { icon: Target, text: 'Logic Assessment' }
      ],
	      comingSoon: true,
      href: '/career-tools/assessments'
    },
    {
      id: 'salary-calculator',
      title: 'Salary Calculator',
      description: 'Get accurate salary estimates based on your skills, experience, and location.',
      icon: Calculator,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      hoverBorder: 'hover:border-yellow-400/30',
      buttonGradient: 'from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
      shadowColor: 'shadow-yellow-500/25',
      features: [
        { icon: TrendingUp, text: 'Market Analysis' },
        { icon: Star, text: 'Skill Premium' },
        { icon: Target, text: 'Location Based' }
      ],
	      comingSoon: true,
      href: '/career-tools/salary-calculator'
    }
  ];

  const handleToolClick = (tool: typeof careerTools[0]) => {
    if (!tool.comingSoon && tool.href) {
      router.push(tool.href);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {careerTools.map((tool, index) => (
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
                  {tool.comingSoon ? 'Coming Soon' : `Try ${tool.title}`}
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