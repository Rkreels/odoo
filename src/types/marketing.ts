
export type CampaignStatus = 'draft' | 'scheduled' | 'running' | 'paused' | 'completed';
export type CampaignType = 'email' | 'social' | 'sms' | 'display' | 'search';

export interface MarketingCampaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  targetAudience: string;
}

export interface CampaignAnalytics {
  campaignId: string;
  ctr: number; // Click-through rate
  cpc: number; // Cost per click
  cpa: number; // Cost per acquisition
  roi: number; // Return on investment
}
