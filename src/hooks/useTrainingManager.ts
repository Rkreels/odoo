
import { useState, useEffect, useCallback } from 'react';
import { getTrainingStepsForScreen } from '@/data/voiceTrainingSteps';
import { TrainingStep } from '@/types/voiceTrainer';

export const useTrainingManager = (currentScreen: string, isOpen: boolean, onClose: () => void, speakTextCallback: (text: string) => void, stopSpeakingCallback: () => void) => {
  const [trainingSteps, setTrainingSteps] = useState<TrainingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const steps = getTrainingStepsForScreen(currentScreen);
    setTrainingSteps(steps);
    setCurrentStepIndex(0); // Reset to first step when screen changes
  }, [currentScreen]);

  const currentStepData = trainingSteps[currentStepIndex];

  const nextStep = useCallback(() => {
    stopSpeakingCallback();
    if (currentStepIndex < trainingSteps.length - 1) {
      setTrainingSteps(prevSteps => 
        prevSteps.map((step, index) => 
          index === currentStepIndex ? { ...step, completed: true } : step
        )
      );
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setTrainingSteps(prevSteps => prevSteps.map(step => ({ ...step, completed: true })));
      onClose();
    }
  }, [currentStepIndex, trainingSteps.length, onClose, stopSpeakingCallback]);

  const prevStep = useCallback(() => {
    stopSpeakingCallback();
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex, stopSpeakingCallback]);

  const resetTutorial = useCallback(() => {
    stopSpeakingCallback();
    setTrainingSteps(prevSteps => prevSteps.map(step => ({ ...step, completed: false })));
    setCurrentStepIndex(0);
  }, [stopSpeakingCallback]);

  useEffect(() => {
    if (isOpen && currentStepData) {
      speakTextCallback(currentStepData.description);
    }
    // Ensure speech is stopped if component is closed or currentStepData changes while open
    return () => {
      if (isOpen) { // Only stop if it was open, to prevent stopping unrelated speech
         // This might be too aggressive if speakTextCallback manages its own cancellation.
         // Let's rely on useSpeechSynthesis cleanup for unmount.
      }
    };
  }, [currentStepIndex, isOpen, currentStepData, speakTextCallback]);
  
  // Cleanup on unmount or when isOpen becomes false
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);


  return {
    trainingSteps,
    currentStepIndex,
    currentStepData,
    nextStep,
    prevStep,
    resetTutorial,
  };
};

