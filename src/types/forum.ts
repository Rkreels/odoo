
export type ForumStatus = 'active' | 'locked' | 'archived';

export interface ForumTopic {
  id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  replies: number;
  views: number;
  category: string;
  status: ForumStatus;
  lastReply?: {
    author: string;
    date: string;
  };
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  topicCount: number;
}
