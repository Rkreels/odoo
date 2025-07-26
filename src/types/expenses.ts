
export type ExpenseStatus = 'pending' | 'approved' | 'rejected';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  employee: string;
  status: ExpenseStatus;
  receiptUrl?: string;
  receipt?: string;
  notes?: string;
  approvedBy?: string;
  approvedDate?: string;
  mileage?: number;
  project?: string;
  department?: string;
}
