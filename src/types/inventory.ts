
export type StockMoveType = 'in' | 'out' | 'internal';
export type ProductType = 'storable' | 'consumable' | 'service';

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  type: ProductType;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  cost: number;
  salePrice: number;
  location: string;
}

export interface StockMove {
  id: string;
  product: string;
  type: StockMoveType;
  quantity: number;
  date: string;
  location: string;
  reference: string;
  responsible: string;
}

export interface StockValuation {
  totalValue: number;
  totalProducts: number;
  lowStockItems: number;
  outOfStockItems: number;
}
