import { Opportunity, OpportunityStage } from '@/types/crm';
import { POSSession } from '@/types/pointofsale';
import { SalesOrder, SalesOrderStatus } from '@/types/sales';

export const LOCAL_STORAGE_KEYS = {
  OPPORTUNITIES: 'crmOpportunities',
  CHANNELS: 'discussChannels',
  MESSAGES: 'discussMessages',
  POS_SESSIONS: 'posSessions',
  SALES_ORDERS: 'salesOrders',
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

const INITIAL_POS_SESSIONS: POSSession[] = [
  {
    id: '1',
    name: 'Main Counter Session',
    startTime: '2025-05-24T08:00:00Z',
    status: 'open',
    cashRegister: 'Register 001',
    startingCash: 200,
    totalSales: 1250.50,
    transactions: 23
  },
  {
    id: '2',
    name: 'Express Lane Session',
    startTime: '2025-05-23T09:30:00Z',
    endTime: '2025-05-23T17:30:00Z',
    status: 'closed',
    cashRegister: 'Register 002',
    startingCash: 150,
    totalSales: 850.25,
    transactions: 18
  }
];

const INITIAL_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'SO001',
    customer: 'Acme Corporation',
    date: '2025-05-01',
    salesperson: 'Jane Doe',
    total: 5000.00,
    status: 'Quotation',
  },
  {
    id: 'SO002',
    customer: 'XYZ Industries',
    date: '2025-05-02',
    salesperson: 'Mike Wilson',
    total: 12000.00,
    status: 'Order Confirmed',
  },
  {
    id: 'SO003',
    customer: 'Globex Corporation',
    date: '2025-04-28',
    salesperson: 'Jane Doe',
    total: 8750.00,
    status: 'Delivery',
  },
  {
    id: 'SO004',
    customer: 'Tech Innovators',
    date: '2025-04-25',
    salesperson: 'Mike Wilson',
    total: 15000.00,
    status: 'Invoiced',
  },
  {
    id: 'SO005',
    customer: 'Summit Enterprises',
    date: '2025-04-20',
    salesperson: 'Jane Doe',
    total: 3200.00,
    status: 'Done',
  },
];

export const getStoredOpportunities = (): Opportunity[] => {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.OPPORTUNITIES);
  if (storedData) {
    return JSON.parse(storedData);
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(INITIAL_OPPORTUNITIES));
  return INITIAL_OPPORTUNITIES;
};

export const storeOpportunities = (opportunities: Opportunity[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
};

export const getStoredPOSSessions = (): POSSession[] => {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.POS_SESSIONS);
  if (storedData) {
    return JSON.parse(storedData);
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.POS_SESSIONS, JSON.stringify(INITIAL_POS_SESSIONS));
  return INITIAL_POS_SESSIONS;
};

export const storePOSSessions = (sessions: POSSession[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.POS_SESSIONS, JSON.stringify(sessions));
};

export const getStoredSalesOrders = (): SalesOrder[] => {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.SALES_ORDERS);
  if (storedData) {
    return JSON.parse(storedData);
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.SALES_ORDERS, JSON.stringify(INITIAL_SALES_ORDERS));
  return INITIAL_SALES_ORDERS;
};

export const storeSalesOrders = (orders: SalesOrder[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.SALES_ORDERS, JSON.stringify(orders));
};

export const generateId = (): string => Date.now().toString();
