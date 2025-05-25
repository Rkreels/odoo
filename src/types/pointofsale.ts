
export type SessionStatus = 'open' | 'closed' | 'suspended';
export type PaymentMethod = 'cash' | 'card' | 'mobile';

// Renamed from POSItem to POSProduct for clarity
export interface POSProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl?: string; // Optional image for product
}

export interface POSOrderItem {
  id: string; // Unique ID for the order item instance
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface POSSession {
  id:string;
  name: string;
  startTime: string;
  endTime?: string;
  status: SessionStatus;
  cashRegister: string;
  startingCash: number;
  totalSales: number; // This will reflect completed transactions
  transactions: number; // Count of completed transactions
  currentOrderItems: POSOrderItem[]; // Items in the current, ongoing order
}

export interface POSTransaction {
  id: string;
  sessionId: string;
  customer?: string;
  items: POSOrderItem[]; // Updated to use POSOrderItem
  total: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
  receipt: string;
}
