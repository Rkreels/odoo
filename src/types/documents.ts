
export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  owner: string;
  createdAt: string;
  modifiedAt: string;
  workspace: string;
  tags: string[];
  isShared: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  documentCount: number;
}
