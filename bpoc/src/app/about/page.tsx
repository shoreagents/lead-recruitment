'use client';

import { motion } from 'framer-motion';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


import { 
  Users,
  Target,
  Heart,
  Lightbulb,
  Globe,
  Shield,
  BookOpen
} from 'lucide-react';





const values = [
  {
    icon: Heart,
    title: 'Empowerment',
    description: 'We believe every Filipino professional deserves access to career advancement opportunities',
    color: 'text-red-400'
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'Transparent processes, honest feedback, and ethical AI practices guide everything we do',
    color: 'text-blue-400'
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Cutting-edge AI technology combined with human expertise to deliver exceptional results',
    color: 'text-yellow-400'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building a supportive ecosystem where professionals help each other succeed',
    color: 'text-green-400'
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen cyber-grid overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <Header />
      
      <div className="pt-16 relative z-10">
        <div className="container mx-auto px-4 py-12">
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            
            <div className="flex items-center justify-center mb-6">
              <Users className="h-12 w-12 text-cyan-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                About Us
              </h1>
            </div>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Learn about our mission to transform BPO careers in the Philippines 
              and discover the team behind BPOC.IO's innovative platform.
            </p>
          </motion.div>

          {/* Mission & Vision */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 gap-8 mb-16"
          >
            <Card className="glass-card border-white/10 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Target className="w-8 h-8 text-cyan-400" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center">
                <p className="text-gray-300 text-lg leading-relaxed">
                  To empower Filipino BPO professionals with cutting-edge AI technology, 
                  comprehensive skill assessments, and personalized career guidance, 
                  enabling them to unlock their full potential and achieve their dream careers.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/10 h-full flex flex-col">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <Globe className="w-8 h-8 text-purple-400" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center">
                <p className="text-gray-300 text-lg leading-relaxed">
                  To become the leading platform for BPO career development in Southeast Asia, 
                  bridging the gap between talent and opportunity while setting new standards 
                  for professional growth in the industry.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* The Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <Card className="glass-card border-white/10">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-white mb-4 flex items-center justify-center gap-3">
                  <BookOpen className="w-8 h-8 text-green-400" />
                  Our Story
                </CardTitle>
                <CardDescription className="text-gray-300 text-lg max-w-3xl mx-auto">
                  Born from real industry experience and driven by innovation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-1 gap-8 items-center">
                  <div className="space-y-4 max-w-3xl mx-auto">
                    <p className="text-gray-300 leading-relaxed">
                      BPOC.IO was founded by industry veterans who witnessed firsthand the challenges 
                      faced by talented Filipinos in the BPO sector. Despite having incredible potential, 
                      many professionals struggled with outdated recruitment processes, lack of skill 
                      visibility, and limited career development resources.
                    </p>
                    <p className="text-gray-300 leading-relaxed">
                      We combined decades of BPO experience with cutting-edge AI technology to create 
                      a platform that not only showcases talent effectively but also provides 
                      comprehensive career development tools.
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Core Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Our Values</h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                The principles that guide everything we do and shape our company culture
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="glass-card border-white/10 h-full hover:border-white/20 transition-all duration-300 flex flex-col">
                    <CardContent className="p-6 text-center flex-1 flex flex-col justify-between">
                      <div>
                        <div className={`w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4`}>
                          <value.icon className={`w-8 h-8 ${value.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
} 