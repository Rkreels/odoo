
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VoiceTrainerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScreen: string;
}

interface TrainingStep {
  id: string;
  title: string;
  description: string;
  element?: string;
  completed: boolean;
}

const VoiceTrainer = ({ isOpen, onClose, currentScreen }: VoiceTrainerProps) => {
  const [speaking, setSpeaking] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [trainingSteps, setTrainingSteps] = useState<TrainingStep[]>([]);
  const [expanded, setExpanded] = useState(true);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Get training steps based on current screen
  useEffect(() => {
    let steps: TrainingStep[] = [];
    
    switch (currentScreen) {
      case 'dashboard':
        steps = [
          {
            id: 'welcome',
            title: 'Welcome to OdooEcho',
            description: 'Welcome to OdooEcho! I\'m your voice assistant and I\'ll help you learn how to use this powerful business management platform. Let me guide you through the main components of the dashboard.',
            completed: false,
          },
          {
            id: 'navigation',
            title: 'Navigation',
            description: 'On the left side, you\'ll find the application menu. This is where you can access different modules like CRM, Sales, Inventory, and more. Click on any app icon to navigate to that application.',
            element: '.sidebar',
            completed: false,
          },
          {
            id: 'app-stats',
            title: 'Overview Cards',
            description: 'At the top of your dashboard, you\'ll see overview cards that provide key metrics and statistics. These give you a quick snapshot of your business performance.',
            element: '.app-stats',
            completed: false,
          },
          {
            id: 'header',
            title: 'Header Controls',
            description: 'In the top header, you can access quick actions, search functionality, notifications, and your user profile. This navigation bar is always accessible throughout the application.',
            element: 'header',
            completed: false,
          },
          {
            id: 'conclusion',
            title: 'Getting Started',
            description: 'That\'s a quick overview of your dashboard! To get started, try clicking on the CRM app on the left sidebar. You can restart this tutorial anytime by clicking the Voice Guide button in the header.',
            completed: false,
          },
        ];
        break;
      
      case 'crm':
        steps = [
          {
            id: 'crm-welcome',
            title: 'CRM Module',
            description: 'Welcome to the CRM module! This is where you\'ll manage your customer relationships, leads, opportunities, and sales pipeline.',
            completed: false,
          },
          {
            id: 'leads-list',
            title: 'Leads List',
            description: 'This table shows all your leads. You can see important information like contact details, status, and expected revenue at a glance.',
            element: '.leads-list',
            completed: false,
          },
          {
            id: 'crm-actions',
            title: 'Actions',
            description: 'At the top of the list, you\'ll find action buttons to create new leads, perform mass actions, and search for specific records.',
            element: '.crm-actions',
            completed: false,
          },
          {
            id: 'lead-filters',
            title: 'Filters',
            description: 'You can filter leads by status using the dropdown menu. This helps you focus on leads at specific stages like New, Qualified, or Won.',
            completed: false,
          },
          {
            id: 'crm-conclusion',
            title: 'Next Steps',
            description: 'To get started with CRM, try creating a new lead by clicking the Create button. You can also click on any existing lead to view more details and take actions.',
            completed: false,
          },
        ];
        break;
      
      default:
        steps = [
          {
            id: 'default',
            title: 'Welcome to OdooEcho',
            description: 'Welcome to OdooEcho! I\'m your voice assistant and I\'ll help you learn how to use this platform. Navigate to different sections to get specific guidance.',
            completed: false,
          },
        ];
    }
    
    setTrainingSteps(steps);
    setCurrentStep(0);
  }, [currentScreen]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      // Create a new SpeechSynthesisUtterance
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesisRef.current = utterance;
      
      // Get available voices
      const voices = window.speechSynthesis.getVoices();
      
      // Try to find a good English voice
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Samantha'))
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      utterance.rate = 1;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setSpeaking(true);
      };
      
      utterance.onend = () => {
        setSpeaking(false);
      };
      
      utterance.onerror = () => {
        setSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const nextStep = () => {
    if (speaking) {
      stopSpeaking();
    }
    
    if (currentStep < trainingSteps.length - 1) {
      // Mark current step as completed
      const updatedSteps = [...trainingSteps];
      updatedSteps[currentStep].completed = true;
      setTrainingSteps(updatedSteps);
      
      // Move to next step
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      // Complete all steps and close the trainer
      const updatedSteps = trainingSteps.map(step => ({ ...step, completed: true }));
      setTrainingSteps(updatedSteps);
      onClose();
    }
  };

  const prevStep = () => {
    if (speaking) {
      stopSpeaking();
    }
    
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const resetTutorial = () => {
    if (speaking) {
      stopSpeaking();
    }
    
    const resetSteps = trainingSteps.map(step => ({ ...step, completed: false }));
    setTrainingSteps(resetSteps);
    setCurrentStep(0);
  };

  // Auto-speak when step changes
  useEffect(() => {
    if (isOpen && trainingSteps[currentStep]) {
      speakText(trainingSteps[currentStep].description);
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentStep, isOpen, trainingSteps]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const currentStepData = trainingSteps[currentStep];

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
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-odoo-gray hover:text-odoo-dark"
          >
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
          <button 
            onClick={onClose}
            className="text-odoo-gray hover:text-odoo-dark"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {expanded && (
        <>
          <div className="p-4 h-48 overflow-y-auto">
            <h4 className="font-semibold text-lg mb-2">{currentStepData?.title}</h4>
            <p className="text-odoo-gray text-sm mb-4">{currentStepData?.description}</p>
            
            <div className="flex items-center text-xs text-odoo-gray mt-4">
              <div className="flex-1">
                Step {currentStep + 1} of {trainingSteps.length}
              </div>
              <div className="flex space-x-1">
                {trainingSteps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`h-1.5 w-6 rounded-full ${
                      index === currentStep 
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
              <Button 
                variant="outline" 
                size="sm"
                onClick={resetTutorial}
                className="text-xs"
              >
                Restart
              </Button>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="text-xs"
              >
                Previous
              </Button>
              <Button 
                variant="default"
                size="sm"
                onClick={nextStep}
                className="bg-odoo-primary hover:bg-odoo-primary/90 text-xs"
              >
                {currentStep === trainingSteps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </div>
          </div>
          
          <div className="p-3 bg-gray-50 border-t flex justify-center">
            <Button
              variant={speaking ? "destructive" : "outline"}
              size="sm"
              onClick={speaking ? stopSpeaking : () => speakText(currentStepData?.description)}
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

export default VoiceTrainer;
