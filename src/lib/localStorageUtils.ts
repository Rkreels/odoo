
import { Opportunity, OpportunityStage } from '@/types/crm';

export const LOCAL_STORAGE_KEYS = {
  OPPORTUNITIES: 'crmOpportunities',
  CHANNELS: 'discussChannels',
  MESSAGES: 'discussMessages',
};

const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    name: 'Website Redesign Project',
    customer: 'Acme Corporation',
    expectedRevenue: 25000,
    probability: 75,
    stage: 'Proposition',
    expectedClosing: '2025-06-15',
    assignedTo: 'Jane Doe',
    createdAt: '2025-05-10',
    lastActivity: '2 days ago',
    tags: ['Website', 'Design'],
    description: 'Complete website redesign with modern UI/UX and e-commerce integration.',
  },
  {
    id: '2',
    name: 'Enterprise Software License',
    customer: 'XYZ Industries',
    expectedRevenue: 50000,
    probability: 60,
    stage: 'Qualified',
    expectedClosing: '2025-07-01',
    assignedTo: 'Mike Wilson',
    createdAt: '2025-05-15',
    lastActivity: '1 day ago',
    tags: ['Software', 'Enterprise'],
    description: 'Annual enterprise-grade software license renewal with support package.',
  },
  {
    id: '3',
    name: 'Digital Marketing Campaign',
    customer: 'Tech Innovators',
    expectedRevenue: 15000,
    probability: 90,
    stage: 'Won',
    expectedClosing: '2025-05-30',
    assignedTo: 'Sarah Johnson',
    createdAt: '2025-05-05',
    lastActivity: '1 week ago',
    tags: ['Marketing', 'Digital'],
    description: 'Comprehensive digital marketing strategy and execution for Q3.',
  },
  {
    id: '4',
    name: 'Mobile App Development',
    customer: 'StartupXYZ',
    expectedRevenue: 35000,
    probability: 40,
    stage: 'New',
    expectedClosing: '2025-08-01',
    assignedTo: 'Jane Doe',
    createdAt: '2025-05-22',
    lastActivity: '3 hours ago',
    tags: ['Mobile', 'Development'],
    description: 'Cross-platform mobile application development for iOS and Android.',
  },
];

export const getStoredOpportunities = (): Opportunity[] => {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.OPPORTUNITIES);
  if (storedData) {
    return JSON.parse(storedData);
  }
  // If no data in local storage, initialize with default and save it
  localStorage.setItem(LOCAL_STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(INITIAL_OPPORTUNITIES));
  return INITIAL_OPPORTUNITIES;
};

export const storeOpportunities = (opportunities: Opportunity[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
};

// Helper to generate unique IDs
export const generateId = (): string => Date.now().toString();

