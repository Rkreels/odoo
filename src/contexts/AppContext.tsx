import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Opportunity } from '@/types/crm';
import { SalesOrder } from '@/types/sales';
import { Expense } from '@/types/expenses';
import { Subscription, SubscriptionPlan } from '@/types/subscriptions';
import { RentalProduct, RentalBooking } from '@/types/rental';

// Initial data
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
    description: 'Complete website redesign with modern UI/UX',
  },
];

const INITIAL_SALES_ORDERS: SalesOrder[] = [
  {
    id: 'SO001',
    customer: 'Acme Corporation',
    date: '2025-05-01',
    salesperson: 'Jane Doe',
    salesTeam: 'Direct Sales Team',
    items: [
      { id: 'item-1', productName: 'Product A', quantity: 2, unitPrice: 1500, discount: 50, subtotal: 2950 },
    ],
    taxRate: 8,
    status: 'Quotation',
    version: 1,
    deliveryStatus: 'Pending Delivery',
    paymentStatus: 'Unpaid',
    currency: 'USD',
    linkedInvoiceIds: [],
    subtotalBeforeTax: 2950,
    taxAmount: 236,
    total: 3186,
  },
];

const INITIAL_EXPENSES: Expense[] = [
  {
    id: '1',
    description: 'Office Supplies',
    amount: 250,
    date: '2025-05-20',
    category: 'Office',
    employee: 'John Smith',
    status: 'pending',
  },
];

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: '1',
    customer: 'Acme Corp',
    plan: 'Professional',
    status: 'active',
    startDate: '2025-01-01',
    nextBilling: '2025-06-01',
    amount: '$99',
    interval: 'monthly',
    autoRenew: true,
  },
];

const INITIAL_SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: '1',
    name: 'Professional',
    description: 'For growing businesses',
    price: { monthly: '$99', quarterly: '$270', annual: '$990' },
    features: ['Unlimited users', 'Advanced analytics', '24/7 support'],
    isPopular: true,
  },
];

const INITIAL_RENTAL_PRODUCTS: RentalProduct[] = [
  {
    id: '1',
    name: 'Camera Equipment Package',
    category: 'Photography',
    image: '/placeholder.svg',
    dailyRate: '$50',
    weeklyRate: '$300',
    monthlyRate: '$1000',
    status: 'available',
    features: ['4K Camera', 'Lenses', 'Tripod'],
    location: 'Warehouse A',
    description: 'Professional camera equipment',
  },
];

const INITIAL_RENTAL_BOOKINGS: RentalBooking[] = [];

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  
  // CRM
  opportunities: Opportunity[];
  setOpportunities: (value: Opportunity[] | ((prev: Opportunity[]) => Opportunity[])) => void;
  
  // Sales
  salesOrders: SalesOrder[];
  setSalesOrders: (value: SalesOrder[] | ((prev: SalesOrder[]) => SalesOrder[])) => void;
  
  // Expenses
  expenses: Expense[];
  setExpenses: (value: Expense[] | ((prev: Expense[]) => Expense[])) => void;
  
  // Subscriptions
  subscriptions: Subscription[];
  setSubscriptions: (value: Subscription[] | ((prev: Subscription[]) => Subscription[])) => void;
  subscriptionPlans: SubscriptionPlan[];
  setSubscriptionPlans: (value: SubscriptionPlan[] | ((prev: SubscriptionPlan[]) => SubscriptionPlan[])) => void;
  
  // Rental
  rentalProducts: RentalProduct[];
  setRentalProducts: (value: RentalProduct[] | ((prev: RentalProduct[]) => RentalProduct[])) => void;
  rentalBookings: RentalBooking[];
  setRentalBookings: (value: RentalBooking[] | ((prev: RentalBooking[]) => RentalBooking[])) => void;
  
  // Generic data (for other modules)
  products: any[];
  setProducts: (value: any[] | ((prev: any[]) => any[])) => void;
  invoices: any[];
  setInvoices: (value: any[] | ((prev: any[]) => any[])) => void;
  customers: any[];
  setCustomers: (value: any[] | ((prev: any[]) => any[])) => void;
  blogPosts: any[];
  setBlogPosts: (value: any[] | ((prev: any[]) => any[])) => void;
  projects: any[];
  setProjects: (value: any[] | ((prev: any[]) => any[])) => void;
  campaigns: any[];
  setCampaigns: (value: any[] | ((prev: any[]) => any[])) => void;
  documents: any[];
  setDocuments: (value: any[] | ((prev: any[]) => any[])) => void;
  forumTopics: any[];
  setForumTopics: (value: any[] | ((prev: any[]) => any[])) => void;
  courses: any[];
  setCourses: (value: any[] | ((prev: any[]) => any[])) => void;
  chatSessions: any[];
  setChatSessions: (value: any[] | ((prev: any[]) => any[])) => void;
  maintenanceRequests: any[];
  setMaintenanceRequests: (value: any[] | ((prev: any[]) => any[])) => void;
  qualityChecks: any[];
  setQualityChecks: (value: any[] | ((prev: any[]) => any[])) => void;
  purchaseOrders: any[];
  setPurchaseOrders: (value: any[] | ((prev: any[]) => any[])) => void;
  inventoryItems: any[];
  setInventoryItems: (value: any[] | ((prev: any[]) => any[])) => void;
  manufacturingOrders: any[];
  setManufacturingOrders: (value: any[] | ((prev: any[]) => any[])) => void;
  accountingEntries: any[];
  setAccountingEntries: (value: any[] | ((prev: any[]) => any[])) => void;
  employees: any[];
  setEmployees: (value: any[] | ((prev: any[]) => any[])) => void;
  contacts: any[];
  setContacts: (value: any[] | ((prev: any[]) => any[])) => void;
  calendarEvents: any[];
  setCalendarEvents: (value: any[] | ((prev: any[]) => any[])) => void;
  signatures: any[];
  setSignatures: (value: any[] | ((prev: any[]) => any[])) => void;
  spreadsheets: any[];
  setSpreadsheets: (value: any[] | ((prev: any[]) => any[])) => void;
  websitePages: any[];
  setWebsitePages: (value: any[] | ((prev: any[]) => any[])) => void;
  plmProducts: any[];
  setPlmProducts: (value: any[] | ((prev: any[]) => any[])) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(INITIAL_OPPORTUNITIES);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(INITIAL_SALES_ORDERS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(INITIAL_SUBSCRIPTION_PLANS);
  const [rentalProducts, setRentalProducts] = useState<RentalProduct[]>(INITIAL_RENTAL_PRODUCTS);
  const [rentalBookings, setRentalBookings] = useState<RentalBooking[]>(INITIAL_RENTAL_BOOKINGS);
  
  const [products, setProducts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [forumTopics, setForumTopics] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [chatSessions, setChatSessions] = useState<any[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [qualityChecks, setQualityChecks] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [manufacturingOrders, setManufacturingOrders] = useState<any[]>([]);
  const [accountingEntries, setAccountingEntries] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [signatures, setSignatures] = useState<any[]>([]);
  const [spreadsheets, setSpreadsheets] = useState<any[]>([]);
  const [websitePages, setWebsitePages] = useState<any[]>([]);
  const [plmProducts, setPlmProducts] = useState<any[]>([]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        opportunities,
        setOpportunities,
        salesOrders,
        setSalesOrders,
        expenses,
        setExpenses,
        subscriptions,
        setSubscriptions,
        subscriptionPlans,
        setSubscriptionPlans,
        rentalProducts,
        setRentalProducts,
        rentalBookings,
        setRentalBookings,
        products,
        setProducts,
        invoices,
        setInvoices,
        customers,
        setCustomers,
        blogPosts,
        setBlogPosts,
        projects,
        setProjects,
        campaigns,
        setCampaigns,
        documents,
        setDocuments,
        forumTopics,
        setForumTopics,
        courses,
        setCourses,
        chatSessions,
        setChatSessions,
        maintenanceRequests,
        setMaintenanceRequests,
        qualityChecks,
        setQualityChecks,
        purchaseOrders,
        setPurchaseOrders,
        inventoryItems,
        setInventoryItems,
        manufacturingOrders,
        setManufacturingOrders,
        accountingEntries,
        setAccountingEntries,
        employees,
        setEmployees,
        contacts,
        setContacts,
        calendarEvents,
        setCalendarEvents,
        signatures,
        setSignatures,
        spreadsheets,
        setSpreadsheets,
        websitePages,
        setWebsitePages,
        plmProducts,
        setPlmProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
