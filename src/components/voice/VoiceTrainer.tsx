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
      
      case 'blog':
        steps = [
          {
            id: 'blog-welcome',
            title: 'Blog Module',
            description: 'Welcome to the Blog module! Here you can create and manage blog posts, organize them into categories, and engage with your audience.',
            completed: false,
          },
          {
            id: 'blog-create-post',
            title: 'Create Posts',
            description: 'Use the "Create New Post" button to start writing new articles. You can use a rich text editor, add images, and set publication dates.',
            completed: false,
          },
          {
            id: 'blog-manage',
            title: 'Manage Content',
            description: 'View your existing posts, edit them, or manage categories to keep your blog organized.',
            completed: false,
          },
        ];
        break;
      
      case 'forum':
        steps = [
          {
            id: 'forum-welcome',
            title: 'Forum Module',
            description: 'Welcome to the Community Forum! This is the place to foster discussions, create topics, and build an active community.',
            completed: false,
          },
          {
            id: 'forum-create-topic',
            title: 'Start Discussions',
            description: 'Click "Create New Topic" to initiate new discussions. Users can reply, and you can moderate conversations.',
            completed: false,
          },
          {
            id: 'forum-categories',
            title: 'Organize Content',
            description: 'Manage forum categories to structure discussions and help users find relevant topics easily.',
            completed: false,
          },
        ];
        break;
      
      case 'accounting':
        steps = [
          { id: 'acc-welcome', title: 'Accounting Module', description: 'Welcome to Accounting. Manage invoices, expenses, and financial reports.', completed: false },
          { id: 'acc-charts', title: 'Charts & Reports', description: 'View financial summaries and generate reports.', completed: false },
          { id: 'acc-transactions', title: 'Transactions', description: 'Record and track all financial transactions.', completed: false },
        ];
        break;
      
      case 'humanresources':
        steps = [
          { id: 'hr-welcome', title: 'Human Resources', description: 'Manage employees, recruitment, and payroll in the HR module.', completed: false },
          { id: 'hr-employees', title: 'Employee Directory', description: 'Access and manage employee information.', completed: false },
          { id: 'hr-payroll', title: 'Payroll Processing', description: 'Process payroll and manage compensations.', completed: false },
        ];
        break;
      
      case 'website':
        steps = [
          { id: 'web-welcome', title: 'Website Builder', description: 'Welcome to the Website builder. Create and customize your online presence.', completed: false },
          { id: 'web-pages', title: 'Manage Pages', description: 'Add new pages or edit existing ones using a drag-and-drop interface.', completed: false },
          { id: 'web-themes', title: 'Themes & SEO', description: 'Customize themes and manage SEO settings for better visibility.', completed: false },
        ];
        break;
      
      case 'ecommerce':
        steps = [
          { id: 'ecom-welcome', title: 'eCommerce Management', description: 'Manage your online store, products, orders, and customers.', completed: false },
          { id: 'ecom-products', title: 'Product Catalog', description: 'Add, edit, and organize your products.', completed: false },
          { id: 'ecom-orders', title: 'Order Processing', description: 'Track and fulfill customer orders efficiently.', completed: false },
        ];
        break;
      
      case 'discuss':
        steps = [
          { id: 'disc-welcome', title: 'Discuss App', description: 'Communicate with your team, manage channels, and stay updated.', completed: false },
          { id: 'disc-channels', title: 'Channels', description: 'Join or create channels for specific topics or teams.', completed: false },
          { id: 'disc-messages', title: 'Direct Messages', description: 'Send direct messages to your colleagues.', completed: false },
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
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesisRef.current = utterance;
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && (voice.name.includes('Google') || voice.name.includes('Microsoft') || voice.name.includes('Samantha'))
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
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
    if (speaking) stopSpeaking();
    if (currentStep < trainingSteps.length - 1) {
      const updatedSteps = [...trainingSteps];
      updatedSteps[currentStep].completed = true;
      setTrainingSteps(updatedSteps);
      setCurrentStep(prevStep => prevStep + 1);
    } else {
      const updatedSteps = trainingSteps.map(step => ({ ...step, completed: true }));
      setTrainingSteps(updatedSteps);
      onClose();
    }
  };

  const prevStep = () => {
    if (speaking) stopSpeaking();
    if (currentStep > 0) {
      setCurrentStep(prevStep => prevStep - 1);
    }
  };

  const resetTutorial = () => {
    if (speaking) stopSpeaking();
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
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [currentStep, isOpen, trainingSteps]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
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
