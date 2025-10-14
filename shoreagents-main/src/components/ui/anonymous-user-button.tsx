'use client';

import { useState, useEffect, useMemo } from 'react';
import { AnonymousUserModal } from './anonymous-user-modal';
import { useAuth } from '@/lib/auth-context';
import { generateUserId } from '@/lib/userEngagementService';
import { useUserFormStatus } from '@/hooks/use-api';

export function AnonymousUserButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Only generate userId once, not on every render
  const userId = useMemo(() => generateUserId(), []);
  const { data: userFormStatus, isLoading, error } = useUserFormStatus(userId);

  console.log('🎯 AnonymousUserButton component rendered:', {
    isAuthenticated,
    userId,
    isLoading,
    userFormStatus,
    error
  });

  // Auto-open modal after 45 seconds
  useEffect(() => {
    console.log('🔍 AnonymousUserButton useEffect triggered:', {
      isAuthenticated,
      isLoading,
      userFormStatus,
      error
    });

    // Only start timer for anonymous users
    if (isAuthenticated) {
      console.log('🔐 User is authenticated, skipping anonymous user modal');
      return;
    }

    // Database check is the primary source of truth - no localStorage needed

    let timer: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;

    const startCountdown = () => {
      console.log('🚀 Anonymous user modal timer started - 45 seconds countdown');
      
      // Countdown timer for logging
      let countdown = 45;
      countdownInterval = setInterval(() => {
        countdown--;
        console.log(`⏰ Modal will open in ${countdown} seconds...`);
        
        if (countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);

      timer = setTimeout(() => {
        console.log('🎉 Opening anonymous user modal after 45 seconds!');
        setIsModalOpen(true);
      }, 45000); // 45 seconds
    };

    // Check if user form status is loaded and handle accordingly
    if (!isLoading && userFormStatus) {
      console.log('📊 Database check result:', userFormStatus);

      if (userFormStatus.hasFilledForm) {
        console.log('🚫 User has already filled out the form (database check):', {
          company: userFormStatus.company,
          industry: userFormStatus.industry,
          hasFilledForm: userFormStatus.hasFilledForm
        });
        console.log('✅ Modal will NOT be shown - user already filled out the form');
        return;
      }

      console.log('✅ User has not filled out the form, starting countdown in 2 seconds...');
      // Add a small delay to make sure the database check is complete
      setTimeout(() => {
        startCountdown();
      }, 2000);
    } else if (error) {
      console.error('❌ Error checking user form status:', error);
      console.log('⚠️ Database check failed, starting countdown anyway');
      startCountdown();
    } else if (isLoading) {
      console.log('⏳ Still loading user form status...');
    }

    // Cleanup function
    return () => {
      if (timer) clearTimeout(timer);
      if (countdownInterval) clearInterval(countdownInterval);
      console.log('🧹 Anonymous user modal timer cleaned up');
    };
  }, [isAuthenticated, isLoading, userFormStatus, error]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Only show for anonymous users
  if (isAuthenticated) {
    console.log('🔐 User is authenticated, AnonymousUserButton returning null');
    return null;
  }

  console.log('👤 AnonymousUserButton rendering for anonymous user');

  return (
    <>
      {/* Modal - no floating button */}
      <AnonymousUserModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  );
}

