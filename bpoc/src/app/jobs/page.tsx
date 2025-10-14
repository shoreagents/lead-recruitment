'use client';

import { motion, AnimatePresence } from 'framer-motion';

import { Suspense } from 'react';

import Header from '@/components/layout/Header';
import JobsCards from '@/components/sections/JobsCards';
import { Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';


function JobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    const applicationStatus = searchParams.get('application');
    if (applicationStatus === 'success') {
      setShowSuccessBanner(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('application');
      const newQuery = params.toString();
      router.replace(newQuery ? `/jobs?${newQuery}` : '/jobs', { scroll: false });
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!showSuccessBanner) return;
    const timeout = setTimeout(() => setShowSuccessBanner(false), 7000);
    return () => clearTimeout(timeout);
  }, [showSuccessBanner]);



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
        <div className="container mx-auto px-4 py-8">
          <AnimatePresence>
            {showSuccessBanner && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
              >
                <div className="group rounded-2xl border border-emerald-400/40 bg-emerald-500/15 px-6 py-5 text-emerald-100 shadow-[0_20px_60px_rgba(16,185,129,0.25)] backdrop-blur">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-200">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-semibold text-white">Application submitted successfully!</p>
                        <p className="text-sm text-emerald-100/80">
                          Great move—your application is on its way. While you wait, explore more roles or sharpen your skills with our built-in tools.
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:w-auto sm:flex-row">
                      <Link
                        href="/career-tools/games/bpoc-cultural"
                        className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                      >
                        Play Games
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                      <Link
                        href="/jobs/job-matching"
                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-cyan-600 hover:to-blue-700"
                      >
                        Find More Jobs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            
            <div className="flex items-center justify-center mb-6">
              <Briefcase className="h-12 w-12 text-cyan-400 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                Jobs
              </h1>
            </div>
            
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Find your perfect BPO career match with our AI-powered job matching system 
              and comprehensive interview preparation tools.
            </p>
          </motion.div>

          {/* Jobs Cards */}
          <JobsCards />
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen cyber-grid overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-cyan-400 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading jobs...</p>
        </div>
      </div>
    }>
      <JobsContent />
    </Suspense>
  );
} 