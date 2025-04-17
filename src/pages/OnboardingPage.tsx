
import React from 'react';
import OnboardingWizard from '@/components/onboarding/OnboardingWizard';
import { useNavigate } from 'react-router-dom';

interface OnboardingPageProps {
  onComplete: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  
  const handleOnboardingComplete = () => {
    onComplete();
    navigate('/alerts', { replace: true }); // Changed from '/' to '/alerts'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto">
        <div className="flex justify-center py-8">
          <div className="w-full max-w-4xl">
            <OnboardingWizard onComplete={handleOnboardingComplete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
