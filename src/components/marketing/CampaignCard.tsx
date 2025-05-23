
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MarketingCampaign } from '@/types/marketing';
import { Calendar, DollarSign, Eye, MousePointer, TrendingUp } from 'lucide-react';

interface CampaignCardProps {
  campaign: MarketingCampaign;
  onUpdate: (campaign: MarketingCampaign) => void;
}

const CampaignCard = ({ campaign, onUpdate }: CampaignCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const budgetProgress = (campaign.spent / campaign.budget) * 100;
  const ctr = campaign.impressions > 0 ? (campaign.clicks / campaign.impressions * 100).toFixed(2) : '0';

  const handleStatusToggle = () => {
    const newStatus = campaign.status === 'running' ? 'paused' : 'running';
    onUpdate({ ...campaign, status: newStatus });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{campaign.name}</CardTitle>
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600 capitalize">{campaign.type} Campaign</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Eye className="h-4 w-4 mr-2" />
            {campaign.impressions.toLocaleString()} impressions
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MousePointer className="h-4 w-4 mr-2" />
            {campaign.clicks} clicks (CTR: {ctr}%)
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <TrendingUp className="h-4 w-4 mr-2" />
            {campaign.conversions} conversions
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Budget</span>
            <span className="text-sm text-gray-600">${campaign.spent}/${campaign.budget}</span>
          </div>
          <Progress value={budgetProgress} className="h-2" />
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleStatusToggle}
          className="w-full"
        >
          {campaign.status === 'running' ? 'Pause Campaign' : 'Start Campaign'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
