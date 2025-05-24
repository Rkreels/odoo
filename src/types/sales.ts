
export type SalesOrderStatus = 
  | 'Quotation' 
  | 'Order Confirmed' 
  | 'Delivery' 
  | 'Invoiced' 
  | 'Done' 
  | 'Cancelled'; // Added Cancelled for completeness

export interface SalesOrder {
  id: string;
  customer: string;
  date: string; // Consider using Date type or ISO string
  salesperson: string;
  total: number; // Changed from string to number
  status: SalesOrderStatus;
  // Optional: Add more fields like order lines, shipping address etc. later
  // items?: SalesOrderItem[]; 
}

// Interface for SalesOrderItems if you add detailed order lines later
// export interface SalesOrderItem {
//   id: string;
//   productId: string;
//   productName: string;
//   quantity: number;
//   unitPrice: number;
//   subtotal: number;
// }

