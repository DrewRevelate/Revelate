'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analytics } from '@/lib/analytics';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'single' | 'multiple';
  options: {
    value: string;
    label: string;
    description?: string;
  }[];
}

interface QuizAnswers {
  [key: string]: string | string[];
}

interface PackageRecommendation {
  packageType: 'stage' | 'targeted' | 'custom';
  packageName: string;
  packageSlug: string;
  reason: string;
  recommendedServices: string[];
}

const questions: QuizQuestion[] = [
  {
    id: 'arr',
    question: 'What is your current Annual Recurring Revenue (ARR)?',
    type: 'single',
    options: [
      { value: 'pre-seed', label: 'Pre-revenue or <$1M', description: 'Early stage startup' },
      { value: 'seed', label: '$1M - $5M', description: 'Seed stage' },
      { value: 'series-a', label: '$5M - $20M', description: 'Series A' },
      { value: 'series-b', label: '$20M - $50M', description: 'Series B' },
      { value: 'series-c+', label: '$50M+', description: 'Series C and beyond' },
    ],
  },
  {
    id: 'problems',
    question: 'What are your biggest revenue operations challenges? (Select all that apply)',
    type: 'multiple',
    options: [
      { value: 'forecasting', label: 'Inaccurate forecasting', description: 'Pipeline visibility issues' },
      { value: 'data-quality', label: 'Poor data quality', description: 'Duplicate or incomplete records' },
      { value: 'manual-work', label: 'Too much manual work', description: 'Repetitive tasks eating time' },
      { value: 'integrations', label: 'System integration issues', description: 'Tools not talking to each other' },
      { value: 'reporting', label: 'Inadequate reporting', description: 'Lack of actionable insights' },
      { value: 'scaling', label: 'Scaling pains', description: 'Processes breaking as you grow' },
    ],
  },
  {
    id: 'focus',
    question: 'What is your primary focus right now?',
    type: 'single',
    options: [
      { value: 'foundation', label: 'Building the foundation', description: 'Setting up core systems and processes' },
      { value: 'optimization', label: 'Optimizing existing systems', description: 'Improving what you have' },
      { value: 'cleanup', label: 'Fixing technical debt', description: 'Cleaning up years of accumulated issues' },
      { value: 'transformation', label: 'Complete transformation', description: 'Starting fresh with new systems' },
      { value: 'ai-adoption', label: 'AI/automation adoption', description: 'Leveraging AI and advanced automation' },
    ],
  },
  {
    id: 'needs',
    question: 'Which specific capabilities do you need? (Select all that apply)',
    type: 'multiple',
    options: [
      { value: 'crm-setup', label: 'CRM setup/optimization', description: 'Salesforce, HubSpot, etc.' },
      { value: 'analytics', label: 'Revenue analytics', description: 'Dashboards and reporting' },
      { value: 'automation', label: 'Workflow automation', description: 'Reduce manual work' },
      { value: 'data-cleanup', label: 'Data cleanup', description: 'Deduplication and enrichment' },
      { value: 'integrations', label: 'System integrations', description: 'Connect your tech stack' },
      { value: 'ai-tools', label: 'AI-powered tools', description: 'Predictive and generative AI' },
      { value: 'strategy', label: 'RevOps strategy', description: 'Process design and planning' },
    ],
  },
  {
    id: 'timeline',
    question: 'What is your preferred timeline?',
    type: 'single',
    options: [
      { value: 'urgent', label: 'Immediate (1-4 weeks)', description: 'Need results fast' },
      { value: 'standard', label: 'Standard (1-3 months)', description: 'Normal project timeline' },
      { value: 'comprehensive', label: 'Comprehensive (3-6 months)', description: 'Major transformation' },
      { value: 'ongoing', label: 'Ongoing support', description: 'Continuous partnership' },
    ],
  },
];

interface PackageQuizProps {
  onComplete: (recommendation: PackageRecommendation) => void;
  onClose?: () => void;
}

export default function PackageQuiz({ onComplete, onClose }: PackageQuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResults, setShowResults] = useState(false);

  // Track quiz started on mount
  useEffect(() => {
    analytics.quiz.started();
  }, []);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleAnswer = (questionId: string, value: string) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    if (question.type === 'single') {
      setAnswers({ ...answers, [questionId]: value });
    } else {
      const current = (answers[questionId] as string[]) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      setAnswers({ ...answers, [questionId]: updated });
    }
  };

  const isAnswered = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === 'single') {
      return !!answer;
    } else {
      return Array.isArray(answer) && answer.length > 0;
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Generate recommendation
      const recommendation = generateRecommendation(answers);
      setShowResults(true);

      // Track quiz completion with recommended package
      analytics.quiz.completed(recommendation.packageName);

      onComplete(recommendation);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateRecommendation = (answers: QuizAnswers): PackageRecommendation => {
    const arr = answers.arr as string;
    const problems = answers.problems as string[];
    const focus = answers.focus as string;
    const needs = answers.needs as string[];
    const timeline = answers.timeline as string;

    // Determine package type and name based on answers
    let packageType: 'stage' | 'targeted' | 'custom' = 'stage';
    let packageName = '';
    let packageSlug = '';
    let reason = '';
    const recommendedServices: string[] = [];

    // Map ARR to stage packages
    if (arr === 'pre-seed' || arr === 'seed') {
      packageName = 'Seed Stage RevOps Foundation';
      packageSlug = 'seed-stage';
      packageType = 'stage';
      reason = 'Your early-stage company needs a solid foundation. This package focuses on setting up core systems and processes to support your growth.';
      recommendedServices.push('crm-setup', 'analytics', 'automation');
    } else if (arr === 'series-a') {
      packageName = 'Series A Scale-Up System';
      packageSlug = 'series-a';
      packageType = 'stage';
      reason = 'As you scale past $5M ARR, you need robust systems that can handle growth. This package optimizes your operations for predictable scaling.';
      recommendedServices.push('crm-setup', 'analytics', 'automation', 'integrations');
    } else if (arr === 'series-b' || arr === 'series-c+') {
      packageName = 'Series B+ Enterprise RevOps';
      packageSlug = 'series-b';
      packageType = 'stage';
      reason = 'Your mature company needs enterprise-grade operations. This package provides comprehensive optimization and advanced capabilities.';
      recommendedServices.push('analytics', 'automation', 'integrations', 'ai-tools', 'strategy');
    }

    // Override with targeted packages based on focus
    if (focus === 'cleanup' && problems.includes('data-quality')) {
      packageName = 'RevOps Cleanup & Optimization';
      packageSlug = 'cleanup';
      packageType = 'targeted';
      reason = 'Your technical debt needs immediate attention. This focused package cleans up your data and systems to restore efficiency.';
      // Clear and set new services for targeted package
      recommendedServices.length = 0;
      recommendedServices.push('data-cleanup', 'crm-setup', 'analytics');
    } else if (focus === 'ai-adoption' || needs.includes('ai-tools')) {
      packageName = 'AI & Automation Accelerator';
      packageSlug = 'ai-accelerator';
      packageType = 'targeted';
      reason = 'You are ready to leverage AI for competitive advantage. This package implements cutting-edge AI tools and automation.';
      // Clear and set new services for targeted package
      recommendedServices.length = 0;
      recommendedServices.push('ai-tools', 'automation', 'analytics', 'integrations');
    }

    // Add services based on specific needs
    needs.forEach((need) => {
      if (!recommendedServices.includes(need)) {
        recommendedServices.push(need);
      }
    });

    // If very comprehensive needs or custom focus, recommend custom package
    if (focus === 'transformation' || needs.length >= 5) {
      packageType = 'custom';
      packageName = 'Custom RevOps Transformation';
      packageSlug = 'custom';
      reason = 'Your requirements are comprehensive and unique. We recommend a custom package tailored to your specific needs and timeline.';
    }

    return {
      packageType,
      packageName,
      packageSlug,
      reason,
      recommendedServices,
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-b from-navy-ink to-navy border border-gray-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Package Qualification Quiz</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-cyan h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Question {currentStep + 1} of {questions.length}
          </p>
        </div>

        {/* Question Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-semibold text-white mb-6">
                  {currentQuestion.question}
                </h3>

                <div className="space-y-3">
                  {currentQuestion.options.map((option) => {
                    const isSelected =
                      currentQuestion.type === 'single'
                        ? answers[currentQuestion.id] === option.value
                        : (answers[currentQuestion.id] as string[])?.includes(option.value);

                    return (
                      <button
                        key={option.value}
                        onClick={() => handleAnswer(currentQuestion.id, option.value)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-cyan bg-cyan/10'
                            : 'border-gray-700 hover:border-gray-600 bg-navy/50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex-shrink-0 w-5 h-5 rounded mt-0.5 border-2 flex items-center justify-center ${
                              isSelected
                                ? 'border-cyan bg-cyan'
                                : 'border-gray-600'
                            }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-navy-ink"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="text-white font-medium mb-1">{option.label}</div>
                            {option.description && (
                              <div className="text-sm text-gray-400">{option.description}</div>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Quiz Complete!</h3>
                <p className="text-gray-400">
                  We've analyzed your answers and prepared a recommendation.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {!showResults && (
          <div className="p-6 border-t border-gray-700 flex justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isAnswered()}
              className="px-6 py-3 bg-cyan text-navy-ink font-semibold rounded-lg hover:bg-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === questions.length - 1 ? 'See Recommendation' : 'Next'}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
