
export type QualityCheckStatus = 'Pending' | 'In Progress' | 'Passed' | 'Failed' | 'Cancelled';
export type QualityCheckType = 'Incoming Inspection' | 'In-Process' | 'Final Inspection' | 'Supplier Audit' | 'Customer Complaint';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface QualityControlPoint {
  id: string;
  name: string;
  description: string;
  type: QualityCheckType;
  products: string[];
  isActive: boolean;
  checklistItems: string[];
  createdAt: string;
  createdBy: string;
}

export interface QualityCheck {
  id: string;
  controlPointId: string;
  controlPointName: string;
  productName: string;
  batchNumber?: string;
  status: QualityCheckStatus;
  priority: Priority;
  assignedTo: string;
  createdAt: string;
  scheduledDate: string;
  completedDate?: string;
  results?: QualityCheckResult[];
  notes?: string;
  attachments?: string[];
}

export interface QualityCheckResult {
  id: string;
  checklistItem: string;
  result: 'Pass' | 'Fail' | 'N/A';
  measurementValue?: number;
  expectedValue?: number;
  tolerance?: number;
  notes?: string;
}

export interface QualityMetrics {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  pendingChecks: number;
  passRate: number;
  averageCheckTime: number;
}
