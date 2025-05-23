
export interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'private';
  members: string[];
  unreadCount: number;
}

export interface Message {
  id: string;
  channelId: string;
  sender: string;
  content: string;
  timestamp: string;
}
