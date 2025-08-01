
export type BlogStatus = 'draft' | 'published' | 'scheduled';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  status: BlogStatus;
  author: string;
  publishDate: string;
  views: number;
  tags: string[];
  comments?: number;
  likes?: number;
  shares?: number;
}
