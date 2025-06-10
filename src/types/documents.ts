
export type DocumentStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';
export type DocumentType = 'contract' | 'invoice' | 'report' | 'presentation' | 'spreadsheet' | 'image' | 'video' | 'other';
export type AccessLevel = 'read' | 'write' | 'admin';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  size: number;
  owner: string;
  createdAt: string;
  modifiedAt: string;
  workspace: string;
  tags: string[];
  isShared: boolean;
  status: DocumentStatus;
  version: number;
  description?: string;
  category: string;
  parentFolderId?: string;
  url?: string;
  thumbnailUrl?: string;
  checksum: string;
  mimeType: string;
  isLocked: boolean;
  lockedBy?: string;
  lockedAt?: string;
  expiryDate?: string;
  accessLevel: AccessLevel;
  collaborators: DocumentCollaborator[];
  versions: DocumentVersion[];
  activities: DocumentActivity[];
  approval?: DocumentApproval;
}

export interface DocumentCollaborator {
  userId: string;
  name: string;
  email: string;
  accessLevel: AccessLevel;
  addedAt: string;
  addedBy: string;
}

export interface DocumentVersion {
  id: string;
  version: number;
  name: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  changes: string;
  url: string;
  isActive: boolean;
}

export interface DocumentActivity {
  id: string;
  type: 'created' | 'modified' | 'shared' | 'downloaded' | 'viewed' | 'approved' | 'rejected';
  user: string;
  timestamp: string;
  description: string;
  details?: any;
}

export interface DocumentApproval {
  id: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  requestedAt: string;
  approvers: ApprovalStep[];
  currentStep: number;
  completedAt?: string;
}

export interface ApprovalStep {
  id: string;
  approver: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  comments?: string;
  order: number;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  color: string;
  icon: string;
  isPrivate: boolean;
  members: WorkspaceMember[];
  settings: WorkspaceSettings;
  createdAt: string;
  createdBy: string;
}

export interface WorkspaceMember {
  userId: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  joinedAt: string;
}

export interface WorkspaceSettings {
  allowPublicSharing: boolean;
  requireApproval: boolean;
  defaultAccessLevel: AccessLevel;
  retentionPolicy?: {
    enabled: boolean;
    days: number;
  };
  versionLimit?: number;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  type: DocumentType;
  category: string;
  templateUrl: string;
  thumbnailUrl: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  usageCount: number;
}
