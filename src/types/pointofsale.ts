
export type SessionStatus = 'open' | 'closed' | 'suspended';
export type PaymentMethod = 'cash' | 'card' | 'mobile';

export interface POSSession {
  id: string;
  name: string;
  startTime: string;
  endTime?: string;
  status: SessionStatus;
  cashRegister: string;
  startingCash: number;
  totalSales: number;
  transactions: number;
}

export interface POSTransaction {
  id: string;
  sessionId: string;
  customer?: string;
  items: POSItem[];
  total: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
  receipt: string;
}

export interface POSItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}
