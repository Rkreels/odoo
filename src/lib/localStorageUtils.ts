import { Opportunity, OpportunityStage } from '@/types/crm';
import { POSSession, POSProduct, POSOrderItem, SessionStatus } from '@/types/pointofsale';
import { SalesOrder, SalesOrderStatus } from '@/types/sales';

export const LOCAL_STORAGE_KEYS = {
  OPPORTUNITIES: 'crmOpportunities',
  CHANNELS: 'discussChannels',
  MESSAGES: 'discussMessages',
  POS_SESSIONS: 'posSessions',
  SALES_ORDERS: 'salesOrders',
  POS_PRODUCTS: 'posProducts',
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

const INITIAL_POS_PRODUCTS: POSProduct[] = [
  { id: 'prod-1', name: 'Coffee Mug', price: 12.99, category: 'Drinkware', imageUrl: '/placeholder.svg' },
  { id: 'prod-2', name: 'T-Shirt (L)', price: 25.00, category: 'Apparel', imageUrl: '/placeholder.svg' },
  { id: 'prod-3', name: 'Notebook', price: 8.50, category: 'Stationery', imageUrl: '/placeholder.svg' },
  { id: 'prod-4', name: 'Water Bottle', price: 15.75, category: 'Drinkware', imageUrl: '/placeholder.svg' },
  { id: 'prod-5', name: 'Keychain', price: 5.00, category: 'Accessories', imageUrl: '/placeholder.svg' },
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
    transactions: 23,
    currentOrderItems: [], // Added
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
    transactions: 18,
    currentOrderItems: [], // Added
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
    items: [
      { id: 'item-1', productName: 'Product A', quantity: 2, unitPrice: 1500, subtotal: 3000 },
      { id: 'item-2', productName: 'Service B', quantity: 1, unitPrice: 2000, subtotal: 2000 },
    ],
  },
  {
    id: 'SO002',
    customer: 'XYZ Industries',
    date: '2025-05-02',
    salesperson: 'Mike Wilson',
    total: 12000.00,
    status: 'Order Confirmed',
    items: [
      { id: 'item-3', productName: 'Enterprise Suite', quantity: 1, unitPrice: 12000, subtotal: 12000 },
    ],
  },
  {
    id: 'SO003',
    customer: 'Globex Corporation',
    date: '2025-04-28',
    salesperson: 'Jane Doe',
    total: 8750.00,
    status: 'Delivery',
    items: [], // Example of an order that might not have item details yet
  },
  {
    id: 'SO004',
    customer: 'Tech Innovators',
    date: '2025-04-25',
    salesperson: 'Mike Wilson',
    total: 15000.00,
    status: 'Invoiced',
    items: [
      { id: 'item-4', productName: 'Consulting Hours', quantity: 100, unitPrice: 150, subtotal: 15000 },
    ]
  },
  {
    id: 'SO005',
    customer: 'Summit Enterprises',
    date: '2025-04-20',
    salesperson: 'Jane Doe',
    total: 3200.00,
    status: 'Done',
    items: [],
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

export const getStoredPOSProducts = (): POSProduct[] => {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.POS_PRODUCTS);
  if (storedData) {
    return JSON.parse(storedData);
  }
  localStorage.setItem(LOCAL_STORAGE_KEYS.POS_PRODUCTS, JSON.stringify(INITIAL_POS_PRODUCTS));
  return INITIAL_POS_PRODUCTS;
};

export const storePOSProducts = (products: POSProduct[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.POS_PRODUCTS, JSON.stringify(products));
};

export const getStoredPOSSessions = (): POSSession[] => {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.POS_SESSIONS);
  if (storedData) {
    const sessions: POSSession[] = JSON.parse(storedData);
    // Ensure all sessions have currentOrderItems initialized
    return sessions.map(session => ({
      ...session,
      currentOrderItems: session.currentOrderItems || []
    }));
  }
  // Ensure initial data also has currentOrderItems
  const initialSessionsWithItems = INITIAL_POS_SESSIONS.map(session => ({
    ...session,
    currentOrderItems: session.currentOrderItems || []
  }));
  localStorage.setItem(LOCAL_STORAGE_KEYS.POS_SESSIONS, JSON.stringify(initialSessionsWithItems));
  return initialSessionsWithItems;
};

export const storePOSSessions = (sessions: POSSession[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.POS_SESSIONS, JSON.stringify(sessions));
};

export const getStoredSalesOrders = (): SalesOrder[] => {
  const storedData = localStorage.getItem(LOCAL_STORAGE_KEYS.SALES_ORDERS);
  if (storedData) {
    // Ensure existing orders have at least an empty items array if not present
    const orders: SalesOrder[] = JSON.parse(storedData);
    return orders.map(order => ({ ...order, items: order.items || [] }));
  }
  // For initial data, ensure items array is present
  const initialOrdersWithItems = INITIAL_SALES_ORDERS.map(order => ({
    ...order,
    items: order.items || []
  }));
  localStorage.setItem(LOCAL_STORAGE_KEYS.SALES_ORDERS, JSON.stringify(initialOrdersWithItems));
  return initialOrdersWithItems;
};

export const storeSalesOrders = (orders: SalesOrder[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.SALES_ORDERS, JSON.stringify(orders));
};

export const generateId = (): string => Date.now().toString();
