
import { useState, useEffect } from 'react';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { useTrainingManager } from '@/hooks/useTrainingManager';
import VoiceTrainerUI from './VoiceTrainerUI';

interface VoiceTrainerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: string;
}

const VoiceTrainer = ({ isOpen, onClose, currentScreen }: VoiceTrainerProps) => {
  const [expanded, setExpanded] = useState(true);
  const { speaking, speakText, stopSpeaking } = useSpeechSynthesis();
  
  const {
    trainingSteps,
    currentStepIndex,
    currentStepData,
    nextStep,
    prevStep,
    resetTutorial,
  } = useTrainingManager(currentScreen, isOpen, onClose, speakText, stopSpeaking);

  // Stop speaking when the component is closed or unmounted
  useEffect(() => {
    if (!isOpen) {
      stopSpeaking();
    }
    return () => stopSpeaking(); // Cleanup on unmount
  }, [isOpen, stopSpeaking]);


  if (!isOpen || !currentStepData) return null;

  return (
    <VoiceTrainerUI
      expanded={expanded}
      speaking={speaking}
      currentStepData={currentStepData}
      currentStepIndex={currentStepIndex}
      trainingSteps={trainingSteps}
      onToggleExpand={() => setExpanded(!expanded)}
      onClose={onClose}
      onResetTutorial={resetTutorial}
      onPrevStep={prevStep}
      onNextStep={nextStep}
      onRepeatWithVoice={() => speakText(currentStepData.description)}
      onStopVoice={stopSpeaking}
    />
  );
};

export default VoiceTrainer;

