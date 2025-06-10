
export type SignatureStatus = 'draft' | 'sent' | 'signed' | 'declined' | 'completed' | 'expired' | 'cancelled';
export type SignatureType = 'electronic' | 'digital' | 'wet';
export type FieldType = 'signature' | 'initial' | 'text' | 'date' | 'checkbox' | 'dropdown' | 'radio';
export type RecipientRole = 'signer' | 'approver' | 'reviewer' | 'cc';

export interface SignatureRequest {
  id: string;
  title: string;
  documentName: string;
  documentUrl: string;
  recipients: SignatureRecipient[];
  createdBy: string;
  createdAt: string;
  status: SignatureStatus;
  expiresAt?: string;
  completedAt?: string;
  template?: string;
  workflow?: SignatureWorkflow;
  settings: SignatureSettings;
  fields: SignatureField[];
  audit: AuditEntry[];
  reminders: ReminderSettings;
  security: SecuritySettings;
  metadata: SignatureMetadata;
}

export interface SignatureRecipient {
  id: string;
  name: string;
  email: string;
  role: RecipientRole;
  order: number;
  signed: boolean;
  signedAt?: string;
  declinedAt?: string;
  viewedAt?: string;
  ipAddress?: string;
  device?: string;
  location?: string;
  authMethod?: string;
  signature?: SignatureData;
  declineReason?: string;
  isRequired: boolean;
  language: string;
  accessCode?: string;
}

export interface SignatureData {
  type: SignatureType;
  imageUrl?: string;
  coordinates: { x: number; y: number; width: number; height: number };
  timestamp: string;
  certificate?: DigitalCertificate;
}

export interface DigitalCertificate {
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  serialNumber: string;
  thumbprint: string;
}

export interface SignatureField {
  id: string;
  type: FieldType;
  recipientId: string;
  page: number;
  coordinates: { x: number; y: number; width: number; height: number };
  required: boolean;
  label?: string;
  placeholder?: string;
  value?: string;
  options?: string[];
  validation?: FieldValidation;
  style?: FieldStyle;
}

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  format?: 'email' | 'phone' | 'number' | 'date';
  errorMessage?: string;
}

export interface FieldStyle {
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface SignatureWorkflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  isSequential: boolean;
  settings: WorkflowSettings;
}

export interface WorkflowStep {
  id: string;
  name: string;
  order: number;
  recipientIds: string[];
  requiresAll: boolean;
  timeout?: number;
  conditions?: WorkflowCondition[];
}

export interface WorkflowCondition {
  field: string;
  operator: string;
  value: any;
  action: 'continue' | 'skip' | 'redirect';
}

export interface WorkflowSettings {
  allowParallelSigning: boolean;
  requireSequentialOrder: boolean;
  autoAdvance: boolean;
  notifyOnCompletion: boolean;
  archiveOnCompletion: boolean;
}

export interface SignatureSettings {
  allowDecline: boolean;
  requireAccessCode: boolean;
  enableReminders: boolean;
  allowDelegation: boolean;
  enableAuditTrail: boolean;
  retentionPeriod: number;
  language: string;
  timezone: string;
  brandingSettings?: BrandingSettings;
}

export interface BrandingSettings {
  logoUrl?: string;
  primaryColor?: string;
  companyName?: string;
  customMessage?: string;
  hideSignatureLogo?: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  firstReminder: number;
  recurringReminder: number;
  finalReminder: number;
  customMessage?: string;
}

export interface SecuritySettings {
  requireIdVerification: boolean;
  enableGeolocation: boolean;
  requireBiometric: boolean;
  encryptionLevel: 'standard' | 'advanced';
  watermarkPages: boolean;
  preventPrinting: boolean;
  preventDownload: boolean;
  sessionTimeout: number;
}

export interface SignatureMetadata {
  tags: string[];
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  department: string;
  costCenter?: string;
  projectId?: string;
  contractValue?: number;
  customFields: { [key: string]: any };
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: any;
  ipAddress: string;
  device: string;
  location?: string;
}

export interface SignatureTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  documentTemplate: string;
  fields: SignatureField[];
  recipients: Omit<SignatureRecipient, 'id' | 'signed' | 'signedAt'>[];
  workflow?: SignatureWorkflow;
  settings: SignatureSettings;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
  tags: string[];
}

export interface SignatureCertificate {
  id: string;
  name: string;
  type: 'ssl' | 'code_signing' | 'document_signing';
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  status: 'active' | 'expired' | 'revoked';
  thumbprint: string;
  usageCount: number;
}

export interface SignatureAnalytics {
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
  declinedRequests: number;
  averageCompletionTime: number;
  completionRate: number;
  topDeclineReasons: { reason: string; count: number }[];
  monthlyTrends: { month: string; sent: number; completed: number }[];
  deviceStats: { device: string; count: number }[];
  locationStats: { country: string; count: number }[];
}
