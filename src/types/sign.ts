
export type SignatureStatus = 'draft' | 'sent' | 'signed' | 'declined' | 'completed';

export interface SignatureRequest {
  id: string;
  title: string;
  documentName: string;
  recipients: {
    name: string;
    email: string;
    signed: boolean;
    signedAt?: string;
  }[];
  createdBy: string;
  createdAt: string;
  status: SignatureStatus;
  expiresAt?: string;
}
