
export type SalesOrderStatus = 
  | 'Quotation' 
  | 'Order Confirmed' 
  | 'Delivery' 
  | 'Invoiced' 
  | 'Done' 
  | 'Cancelled';

export interface SalesOrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  attributes?: string; // New: For simple product attributes like "Color: Red, Size: L"
  discount?: number; // New: Fixed discount amount for this item
  subtotal: number; // This will be (quantity * unitPrice) - discount
}

export interface SalesOrder {
  id: string;
  customer: string;
  date: string;
  salesperson: string;
  salesTeam?: string; // New: To assign order to a sales team
  total: number; // This will be the sum of all item subtotals
  status: SalesOrderStatus;
  items?: SalesOrderItem[];
}
