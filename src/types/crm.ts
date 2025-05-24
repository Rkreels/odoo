
export type LeadStatus = 'New' | 'Qualified' | 'Proposition' | 'Won' | 'Lost';
export type LeadPriority = 'Low' | 'Medium' | 'High';
export type ActivityType = 'Call' | 'Email' | 'Meeting' | 'To Do' | 'SMS';
export type OpportunityStage = 'New' | 'Qualified' | 'Proposition' | 'Won' | 'Lost';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: LeadStatus;
  assignedTo: string;
  lastActivity: string;
  expectedRevenue: string;
  address?: Address;
  leadSource?: string;
  priority?: LeadPriority;
  description?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  dueDate: string;
  assignedTo: string;
  leadId?: string;
  opportunityId?: string;
  completed: boolean;
  priority: LeadPriority;
  createdAt: string;
}

export interface Opportunity {
  id: string;
  name: string;
  customer: string;
  expectedRevenue: number;
  probability: number;
  stage: OpportunityStage;
  expectedClosing: string;
  assignedTo: string;
  createdAt: string;
  lastActivity: string;
  tags?: string[];
  description?: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  jobTitle?: string;
  address?: Address;
  tags?: string[];
  isCompany: boolean;
  createdAt: string;
  lastActivity: string;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  isDefault: boolean;
}

export interface PipelineStage {
  id: string;
  name: string;
  probability: number;
  folded: boolean;
  requirements?: string[];
}
