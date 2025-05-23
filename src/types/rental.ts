
export type RentalStatus = 'available' | 'rented' | 'maintenance' | 'reserved';

export interface RentalProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  dailyRate: string;
  weeklyRate: string;
  monthlyRate: string;
  status: RentalStatus;
  features: string[];
  location: string;
  description: string;
}

export interface RentalBooking {
  id: string;
  productId: string;
  productName: string;
  customer: string;
  startDate: string;
  endDate: string;
  totalPrice: string;
  status: 'confirmed' | 'in-progress' | 'completed' | 'canceled';
}
