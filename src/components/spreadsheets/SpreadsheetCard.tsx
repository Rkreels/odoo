
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Spreadsheet } from '@/types/spreadsheets';
import { Calendar, Grid, Share2, Users } from 'lucide-react';

interface SpreadsheetCardProps {
  spreadsheet: Spreadsheet;
  onUpdate: (spreadsheet: Spreadsheet) => void;
}

const SpreadsheetCard = ({ spreadsheet, onUpdate }: SpreadsheetCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'shared': return 'bg-blue-100 text-blue-800';
      case 'private': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = () => {
    const statuses: Array<Spreadsheet['status']> = ['private', 'shared', 'public'];
    const currentIndex = statuses.indexOf(spreadsheet.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    onUpdate({ ...spreadsheet, status: nextStatus });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{spreadsheet.name}</CardTitle>
          <Badge className={getStatusColor(spreadsheet.status)}>
            {spreadsheet.status}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{spreadsheet.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Modified: {new Date(spreadsheet.lastModified).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Grid className="h-4 w-4 mr-2" />
            {spreadsheet.rowCount} rows × {spreadsheet.columnCount} columns
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            {spreadsheet.collaborators.length} collaborators
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            Open
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleStatusChange}
            className="flex-1"
          >
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpreadsheetCard;
