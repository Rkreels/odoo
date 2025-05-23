
export type ProductStatus = 'active' | 'inactive' | 'draft';
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface EcommerceProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  category: string;
  stock: number;
  image: string;
  status: ProductStatus;
  sku: string;
  weight?: number;
  dimensions?: string;
}

export interface EcommerceOrder {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: OrderStatus;
  items: number;
  date: string;
  shippingAddress?: string;
  trackingNumber?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}
