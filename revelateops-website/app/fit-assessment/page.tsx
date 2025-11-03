'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PackageQuiz from '@/components/PackageQuiz';
import PackageRecommendation from '@/components/PackageRecommendation';

interface PackageRecommendation {
  packageType: 'stage' | 'targeted' | 'custom';
  packageName: string;
  packageSlug: string;
  reason: string;
  recommendedServices: string[];
}

export default function FitAssessmentPage() {
  const router = useRouter();
  const [showQuiz, setShowQuiz] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [recommendation, setRecommendation] = useState<PackageRecommendation | null>(null);

  const handleQuizComplete = (rec: PackageRecommendation) => {
    setRecommendation(rec);
    setQuizCompleted(true);
    setShowQuiz(false);

    // Track completion in analytics
    if (typeof window !== 'undefined' && (window as any).plausible) {
      (window as any).plausible('Quiz Completed', {
        props: {
          page: 'fit-assessment',
          packageType: rec.packageType,
          packageName: rec.packageName
        }
      });
    }
  };

  const handleStartOver = () => {
    setQuizCompleted(false);
    setRecommendation(null);
    setShowQuiz(true);
  };

  const handleProceedFromRecommendation = () => {
    // Redirect to services page with recommendation pre-selected
    if (recommendation) {
      localStorage.setItem('quizRecommendation', JSON.stringify(recommendation));
      router.push('/services');
    }
  };

  const handleClose = () => {
    // If user closes without completing, redirect to homepage
    router.push('/');
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-navy">
      {/* Background gradients - matching brand */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B16] via-[#09102A] to-[#070915]" />
        <div className="absolute top-[-25%] right-[-20%] h-[34rem] w-[34rem] rounded-full bg-cyan/20 blur-[160px]" />
        <div className="absolute bottom-[-30%] left-[-18%] h-[40rem] w-[40rem] rounded-full bg-cyan/15 blur-[190px]" />
      </div>

      {/* Constellation dots */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {[
          { x: '15%', y: '15%' }, { x: '25%', y: '12%' }, { x: '35%', y: '10%' },
          { x: '45%', y: '14%' }, { x: '55%', y: '15%' }, { x: '65%', y: '12%' },
          { x: '75%', y: '18%' }, { x: '85%', y: '15%' }, { x: '95%', y: '16%' },
          { x: '12%', y: '35%' }, { x: '28%', y: '38%' }, { x: '42%', y: '40%' },
          { x: '58%', y: '42%' }, { x: '72%', y: '38%' }, { x: '88%', y: '35%' },
          { x: '10%', y: '60%' }, { x: '22%', y: '58%' }, { x: '38%', y: '65%' },
          { x: '52%', y: '62%' }, { x: '68%', y: '60%' }, { x: '82%', y: '58%' },
          { x: '18%', y: '82%' }, { x: '32%', y: '85%' }, { x: '48%', y: '88%' },
          { x: '64%', y: '85%' }, { x: '78%', y: '82%' }, { x: '92%', y: '80%' }
        ].map((pos, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-cyan opacity-30"
            style={{ left: pos.x, top: pos.y }}
          />
        ))}
      </div>

      {/* Quiz Modal */}
      {showQuiz && !quizCompleted && (
        <PackageQuiz
          onComplete={handleQuizComplete}
          onClose={handleClose}
        />
      )}

      {/* Recommendation Modal */}
      {recommendation && (
        <PackageRecommendation
          recommendation={recommendation}
          onStartOver={handleStartOver}
          onProceed={handleProceedFromRecommendation}
        />
      )}
    </main>
  );
}
