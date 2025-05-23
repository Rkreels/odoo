
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WebsitePage } from '@/types/website';
import { Eye, Edit, Trash2, ExternalLink } from 'lucide-react';

interface PageCardProps {
  page: WebsitePage;
  onUpdate: (page: WebsitePage) => void;
  onDelete: (pageId: string) => void;
}

const PageCard = ({ page, onUpdate, onDelete }: PageCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusToggle = () => {
    const newStatus = page.status === 'published' ? 'draft' : 'published';
    onUpdate({ ...page, status: newStatus });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg flex items-center">
            {page.title}
            {page.isHomepage && (
              <Badge variant="outline" className="ml-2 text-xs">
                Home
              </Badge>
            )}
          </CardTitle>
          <Badge className={getStatusColor(page.status)}>
            {page.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">/{page.slug}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Template:</span>
            <span className="font-medium">{page.template}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Views:</span>
            <span className="font-medium">{page.views.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Last Modified:</span>
            <span className="font-medium">{new Date(page.lastModified).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4" />
          </Button>
          {!page.isHomepage && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(page.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleStatusToggle}
          className="w-full mt-2"
        >
          {page.status === 'published' ? 'Unpublish' : 'Publish'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PageCard;
