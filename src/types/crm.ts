
export type LeadStatus = 'New' | 'Qualified' | 'Proposition' | 'Won' | 'Lost';
export type LeadPriority = 'Low' | 'Medium' | 'High';

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
  lastActivity: string; // We'll keep this for now, might be auto-generated later
  expectedRevenue: string; // Will likely become a number
  // New detailed fields
  address?: Address;
  leadSource?: string; // e.g., 'Website', 'Referral', 'Cold Call', 'Advertisement'
  priority?: LeadPriority;
  // Potential future fields
  // description?: string;
  // tags?: string[];
  // createdAt?: string; // ISO date string
  // updatedAt?: string; // ISO date string
}

