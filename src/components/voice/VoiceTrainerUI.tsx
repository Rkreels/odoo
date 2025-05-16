
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TrainingStep } from '@/types/voiceTrainer';

interface VoiceTrainerUIProps {
  expanded: boolean;
  speaking: boolean;
  currentStepData?: TrainingStep;
  currentStepIndex: number;
  trainingSteps: TrainingStep[];
  onToggleExpand: () => void;
  onClose: () => void;
  onResetTutorial: () => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onRepeatWithVoice: () => void;
  onStopVoice: () => void;
}

const VoiceTrainerUI: React.FC<VoiceTrainerUIProps> = ({
  expanded,
  speaking,
  currentStepData,
  currentStepIndex,
  trainingSteps,
  onToggleExpand,
  onClose,
  onResetTutorial,
  onPrevStep,
  onNextStep,
  onRepeatWithVoice,
  onStopVoice,
}) => {
  if (!currentStepData) return null;

  return (
    <Card className={`fixed bottom-4 right-4 bg-white shadow-lg rounded-lg transition-all duration-300 z-50 ${expanded ? 'w-96' : 'w-60'}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${speaking ? 'text-odoo-primary animate-pulse' : 'text-odoo-gray'}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
          <h3 className="font-medium">{expanded ? 'Voice Guide' : ''}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onToggleExpand} className="text-odoo-gray hover:text-odoo-dark">
            {expanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          <button onClick={onClose} className="text-odoo-gray hover:text-odoo-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {expanded && (
        <>
          <div className="p-4 h-48 overflow-y-auto">
            <h4 className="font-semibold text-lg mb-2">{currentStepData.title}</h4>
            <p className="text-odoo-gray text-sm mb-4">{currentStepData.description}</p>
            <div className="flex items-center text-xs text-odoo-gray mt-4">
              <div className="flex-1">
                Step {currentStepIndex + 1} of {trainingSteps.length}
              </div>
              <div className="flex space-x-1">
                {trainingSteps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`h-1.5 w-6 rounded-full ${
                      index === currentStepIndex 
                        ? 'bg-odoo-primary' 
                        : step.completed 
                          ? 'bg-green-400' 
                          : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-50 border-t flex justify-between">
            <div>
              <Button variant="outline" size="sm" onClick={onResetTutorial} className="text-xs">
                Restart
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onPrevStep} disabled={currentStepIndex === 0} className="text-xs">
                Previous
              </Button>
              <Button variant="default" size="sm" onClick={onNextStep} className="bg-odoo-primary hover:bg-odoo-primary/90 text-xs">
                {currentStepIndex === trainingSteps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
          <div className="p-3 bg-gray-50 border-t flex justify-center">
            <Button
              variant={speaking ? "destructive" : "outline"}
              size="sm"
              onClick={speaking ? onStopVoice : onRepeatWithVoice}
              className="text-xs w-full"
            >
              {speaking ? 'Stop Voice' : 'Repeat with Voice'}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default VoiceTrainerUI;

