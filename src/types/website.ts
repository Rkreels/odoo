
export type PageStatus = 'draft' | 'published' | 'archived';
export type PageTemplate = 'homepage' | 'standard' | 'contact' | 'product' | 'blog';

export interface WebsitePage {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  template: PageTemplate;
  createdAt: string;
  lastModified: string;
  views: number;
  isHomepage: boolean;
  content?: string;
  metaDescription?: string;
}

export interface WebsiteSettings {
  siteName: string;
  domain: string;
  favicon: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
}
