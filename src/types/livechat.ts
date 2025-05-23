
export interface ChatSession {
  id: string;
  visitor: {
    name: string;
    email?: string;
    location?: string;
  };
  status: 'active' | 'waiting' | 'closed';
  startedAt: string;
  duration: string;
  messages: number;
  assignedTo?: string;
  rating?: number;
}

export interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'visitor' | 'agent';
  content: string;
  timestamp: string;
  read: boolean;
}
