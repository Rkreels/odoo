
export type ProductionStatus = 'planned' | 'in-progress' | 'done' | 'cancelled';
export type WorkOrderStatus = 'pending' | 'ready' | 'in-progress' | 'done' | 'cancelled';

export interface ManufacturingOrder {
  id: string;
  product: string;
  quantity: number;
  plannedDate: string;
  deadline: string;
  status: ProductionStatus;
  workOrders: WorkOrder[];
  materials: MaterialRequirement[];
  location: string;
  responsible: string;
}

export interface WorkOrder {
  id: string;
  name: string;
  workCenter: string;
  status: WorkOrderStatus;
  duration: string;
  assignedWorker?: string;
  startDate?: string;
  endDate?: string;
}

export interface MaterialRequirement {
  id: string;
  product: string;
  required: number;
  available: number;
  reserved: number;
  unit: string;
}
