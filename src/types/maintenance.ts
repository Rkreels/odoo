
export type MaintenanceType = 'Preventive' | 'Corrective' | 'Predictive' | 'Emergency';
export type MaintenanceStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Overdue';
export type EquipmentStatus = 'Operational' | 'Under Maintenance' | 'Out of Service' | 'Retired';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Equipment {
  id: string;
  name: string;
  type: string;
  model: string;
  serialNumber: string;
  location: string;
  status: EquipmentStatus;
  purchaseDate: string;
  warrantyExpiry?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
  totalMaintenanceCost: number;
  operatingHours: number;
}

export interface MaintenanceRequest {
  id: string;
  equipmentId: string;
  equipmentName: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  priority: Priority;
  title: string;
  description: string;
  requestedBy: string;
  assignedTo?: string;
  scheduledDate: string;
  completedDate?: string;
  estimatedDuration: number; // in hours
  actualDuration?: number;
  estimatedCost: number;
  actualCost?: number;
  partsUsed?: MaintenancePart[];
  notes?: string;
  attachments?: string[];
  createdAt: string;
}

export interface MaintenancePart {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface MaintenanceMetrics {
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  overdueRequests: number;
  averageCompletionTime: number;
  totalMaintenanceCost: number;
  equipmentUptime: number;
}
