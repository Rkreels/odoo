
export type ProductStatus = 'concept' | 'design' | 'prototype' | 'testing' | 'production' | 'mature' | 'discontinued';
export type ChangeOrderStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'implemented';
export type ChangeOrderType = 'design' | 'material' | 'process' | 'documentation' | 'urgent';
export type DocumentType = 'specification' | 'drawing' | 'test_report' | 'certification' | 'manual';

export interface Product {
  id: string;
  name: string;
  description: string;
  partNumber: string;
  version: string;
  status: ProductStatus;
  category: string;
  family: string;
  lifecycle: ProductLifecycle;
  specifications: ProductSpecification[];
  documents: ProductDocument[];
  bom: BillOfMaterials;
  changeOrders: EngineeringChangeOrder[];
  compliance: ComplianceInfo[];
  costs: ProductCosts;
  timeline: ProductTimeline;
  team: ProductTeam;
  metadata: ProductMetadata;
  createdAt: string;
  createdBy: string;
  lastModified: string;
  modifiedBy: string;
}

export interface ProductLifecycle {
  currentPhase: ProductStatus;
  phases: LifecyclePhase[];
  milestones: Milestone[];
  gates: QualityGate[];
  metrics: LifecycleMetrics;
}

export interface LifecyclePhase {
  id: string;
  name: string;
  status: ProductStatus;
  startDate: string;
  endDate?: string;
  plannedDuration: number;
  actualDuration?: number;
  deliverables: Deliverable[];
  criteria: PhaseCriteria[];
  responsible: string;
  budget: number;
  actualCost?: number;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  targetDate: string;
  actualDate?: string;
  status: 'planned' | 'in_progress' | 'completed' | 'delayed';
  critical: boolean;
  dependencies: string[];
  deliverables: string[];
}

export interface QualityGate {
  id: string;
  name: string;
  phase: ProductStatus;
  criteria: GateCriteria[];
  status: 'pending' | 'passed' | 'failed';
  reviewedBy?: string;
  reviewedAt?: string;
  comments?: string;
}

export interface GateCriteria {
  id: string;
  requirement: string;
  status: 'pending' | 'met' | 'not_met';
  evidence?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

export interface Deliverable {
  id: string;
  name: string;
  type: DocumentType;
  status: 'planned' | 'in_progress' | 'completed' | 'approved';
  dueDate: string;
  completedDate?: string;
  assignee: string;
  url?: string;
  version: string;
}

export interface PhaseCriteria {
  id: string;
  requirement: string;
  mandatory: boolean;
  status: 'pending' | 'met' | 'not_met';
  verificationMethod: string;
}

export interface LifecycleMetrics {
  timeToMarket: number;
  developmentCost: number;
  qualityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  completionPercentage: number;
}

export interface ProductSpecification {
  id: string;
  category: string;
  parameter: string;
  value: string;
  unit?: string;
  tolerance?: string;
  testMethod?: string;
  status: 'draft' | 'approved' | 'deprecated';
  version: string;
  lastModified: string;
  modifiedBy: string;
}

export interface ProductDocument {
  id: string;
  name: string;
  type: DocumentType;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'obsolete';
  url: string;
  size: number;
  createdAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  tags: string[];
  relatedProducts: string[];
}

export interface BillOfMaterials {
  id: string;
  version: string;
  status: 'draft' | 'approved' | 'released' | 'obsolete';
  items: BOMItem[];
  totalCost: number;
  createdAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface BOMItem {
  id: string;
  itemNumber: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  supplier?: string;
  partNumber?: string;
  leadTime?: number;
  category: string;
  critical: boolean;
  alternatives: AlternativeItem[];
  specifications: string[];
}

export interface AlternativeItem {
  id: string;
  itemNumber: string;
  description: string;
  supplier: string;
  unitCost: number;
  leadTime: number;
  qualification: 'approved' | 'pending' | 'rejected';
}

export interface EngineeringChangeOrder {
  id: string;
  title: string;
  description: string;
  type: ChangeOrderType;
  status: ChangeOrderStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  initiator: string;
  assignee?: string;
  reason: string;
  impact: ChangeImpact;
  approval: ChangeApproval;
  implementation: ChangeImplementation;
  affectedProducts: string[];
  affectedDocuments: string[];
  cost: number;
  timeline: ECOTimeline;
  createdAt: string;
  lastModified: string;
}

export interface ChangeImpact {
  technical: string;
  cost: number;
  schedule: number;
  quality: string;
  regulatory: string;
  customer: string;
  risk: 'low' | 'medium' | 'high';
}

export interface ChangeApproval {
  required: boolean;
  approvers: ChangeApprover[];
  currentStep: number;
  status: 'pending' | 'approved' | 'rejected';
  completedAt?: string;
}

export interface ChangeApprover {
  id: string;
  name: string;
  role: string;
  order: number;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  comments?: string;
}

export interface ChangeImplementation {
  status: 'not_started' | 'in_progress' | 'completed';
  startDate?: string;
  completedDate?: string;
  tasks: ImplementationTask[];
  verification: ImplementationVerification;
}

export interface ImplementationTask {
  id: string;
  description: string;
  assignee: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  completedDate?: string;
}

export interface ImplementationVerification {
  required: boolean;
  method: string;
  status: 'pending' | 'passed' | 'failed';
  verifiedBy?: string;
  verifiedAt?: string;
  results?: string;
}

export interface ECOTimeline {
  submitted: string;
  approved?: string;
  implementationStart?: string;
  implementationEnd?: string;
  verified?: string;
}

export interface ComplianceInfo {
  id: string;
  standard: string;
  region: string;
  status: 'compliant' | 'non_compliant' | 'pending' | 'not_applicable';
  certificationBody?: string;
  certificateNumber?: string;
  validFrom?: string;
  validTo?: string;
  documents: string[];
  lastAudit?: string;
  nextAudit?: string;
}

export interface ProductCosts {
  development: number;
  material: number;
  manufacturing: number;
  tooling: number;
  testing: number;
  certification: number;
  total: number;
  breakdown: CostBreakdown[];
}

export interface CostBreakdown {
  category: string;
  amount: number;
  percentage: number;
  details: string;
}

export interface ProductTimeline {
  milestones: TimelineMilestone[];
  ganttData: GanttItem[];
  criticalPath: string[];
}

export interface TimelineMilestone {
  id: string;
  name: string;
  date: string;
  type: 'start' | 'milestone' | 'deadline';
  status: 'planned' | 'completed' | 'delayed';
  dependencies: string[];
}

export interface GanttItem {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  dependencies: string[];
  assignee: string;
  critical: boolean;
}

export interface ProductTeam {
  projectManager: string;
  leadEngineer: string;
  designTeam: TeamMember[];
  testingTeam: TeamMember[];
  qualityTeam: TeamMember[];
  stakeholders: Stakeholder[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  department: string;
  allocation: number;
  skills: string[];
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
  influence: 'low' | 'medium' | 'high';
  interest: 'low' | 'medium' | 'high';
  communication: string;
}

export interface ProductMetadata {
  tags: string[];
  category: string;
  businessUnit: string;
  productLine: string;
  marketSegment: string;
  targetMarkets: string[];
  competitors: string[];
  patents: Patent[];
  intellectualProperty: IPItem[];
}

export interface Patent {
  id: string;
  title: string;
  number: string;
  status: 'filed' | 'pending' | 'granted' | 'expired';
  filingDate: string;
  grantDate?: string;
  expiryDate?: string;
  inventors: string[];
  assignee: string;
}

export interface IPItem {
  id: string;
  type: 'trademark' | 'copyright' | 'trade_secret' | 'design';
  title: string;
  description: string;
  status: 'active' | 'expired' | 'pending';
  registrationNumber?: string;
  registrationDate?: string;
  expiryDate?: string;
}
