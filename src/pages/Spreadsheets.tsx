
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import SpreadsheetCard from '@/components/spreadsheets/SpreadsheetCard';
import { Table, Plus, FileText, Users, Download, Share, Lock, Eye, Edit, MoreVertical, Filter, Grid3X3, BarChart3, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Spreadsheet } from '@/types/spreadsheets';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Spreadsheets = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('spreadsheets');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [spreadsheets, setSpreadsheets] = useState<Spreadsheet[]>([
    {
      id: '1',
      name: 'Sales Analysis Q1',
      description: 'Quarterly sales performance analysis',
      status: 'shared',
      owner: 'John Doe',
      collaborators: [
        {
          userId: '1',
          name: 'Jane Doe',
          email: 'jane.doe@company.com',
          role: 'editor',
          joinedAt: '2024-01-15',
          isOnline: true
        },
        {
          userId: '2',
          name: 'Mike Smith',
          email: 'mike.smith@company.com',
          role: 'viewer',
          joinedAt: '2024-01-16',
          isOnline: false
        }
      ],
      lastModified: '2024-01-20T10:30:00Z',
      rowCount: 150,
      columnCount: 12,
      template: 'Sales Report',
      version: 1,
      isLocked: false,
      sheets: [
        {
          id: 'sheet1',
          name: 'Sheet1',
          index: 0,
          isHidden: false,
          isProtected: false,
          rowCount: 150,
          columnCount: 12,
          cells: {},
          filters: [],
          sorting: [],
          formatting: {
            conditionalFormats: [],
            frozenRows: 0,
            frozenColumns: 0,
            gridlines: true,
            headers: true
          }
        }
      ],
      charts: [],
      namedRanges: [],
      formulas: [],
      settings: {
        autoSave: true,
        showFormulas: false,
        calculationMode: 'automatic',
        iterativeCalculation: false,
        maxIterations: 100,
        defaultNumberFormat: 'General',
        timezone: 'UTC'
      },
      permissions: {
        canEdit: true,
        canComment: true,
        canShare: true,
        canDownload: true,
        canPrint: true,
        canCopy: true
      },
      history: []
    },
    {
      id: '2',
      name: 'Budget Planning 2024',
      description: 'Annual budget planning and forecasts',
      status: 'private',
      owner: 'Jane Doe',
      collaborators: [],
      lastModified: '2024-01-22T14:15:00Z',
      rowCount: 200,
      columnCount: 15,
      template: 'Budget Template',
      version: 1,
      isLocked: false,
      sheets: [
        {
          id: 'sheet1',
          name: 'Budget',
          index: 0,
          isHidden: false,
          isProtected: false,
          rowCount: 200,
          columnCount: 15,
          cells: {},
          filters: [],
          sorting: [],
          formatting: {
            conditionalFormats: [],
            frozenRows: 1,
            frozenColumns: 1,
            gridlines: true,
            headers: true
          }
        }
      ],
      charts: [],
      namedRanges: [],
      formulas: [],
      settings: {
        autoSave: true,
        showFormulas: false,
        calculationMode: 'automatic',
        iterativeCalculation: false,
        maxIterations: 100,
        defaultNumberFormat: 'Currency',
        timezone: 'UTC'
      },
      permissions: {
        canEdit: true,
        canComment: true,
        canShare: false,
        canDownload: true,
        canPrint: true,
        canCopy: true
      },
      history: []
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleUpdateSpreadsheet = (updatedSpreadsheet: Spreadsheet) => {
    setSpreadsheets(prev => prev.map(sheet => 
      sheet.id === updatedSpreadsheet.id ? updatedSpreadsheet : sheet
    ));
  };

  const handleCreateSpreadsheet = () => {
    const newSpreadsheet: Spreadsheet = {
      id: Date.now().toString(),
      name: 'New Spreadsheet',
      description: 'Description for new spreadsheet',
      status: 'private',
      owner: 'Current User',
      collaborators: [],
      lastModified: new Date().toISOString(),
      rowCount: 50,
      columnCount: 10,
      version: 1,
      isLocked: false,
      sheets: [
        {
          id: 'sheet1',
          name: 'Sheet1',
          index: 0,
          isHidden: false,
          isProtected: false,
          rowCount: 50,
          columnCount: 10,
          cells: {},
          filters: [],
          sorting: [],
          formatting: {
            conditionalFormats: [],
            frozenRows: 0,
            frozenColumns: 0,
            gridlines: true,
            headers: true
          }
        }
      ],
      charts: [],
      namedRanges: [],
      formulas: [],
      settings: {
        autoSave: true,
        showFormulas: false,
        calculationMode: 'automatic',
        iterativeCalculation: false,
        maxIterations: 100,
        defaultNumberFormat: 'General',
        timezone: 'UTC'
      },
      permissions: {
        canEdit: true,
        canComment: true,
        canShare: true,
        canDownload: true,
        canPrint: true,
        canCopy: true
      },
      history: []
    };
    setSpreadsheets(prev => [newSpreadsheet, ...prev]);
  };

  const spreadsheetFilters = [
    { label: 'All Sheets', value: 'all', count: spreadsheets.length },
    { label: 'Shared', value: 'shared', count: spreadsheets.filter(s => s.status === 'shared').length },
    { label: 'Private', value: 'private', count: spreadsheets.filter(s => s.status === 'private').length },
    { label: 'Public', value: 'public', count: spreadsheets.filter(s => s.status === 'public').length }
  ];

  const filteredSpreadsheets = spreadsheets.filter(sheet => {
    const matchesSearch = sheet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sheet.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || sheet.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const sharedSheets = spreadsheets.filter(s => s.status === 'shared').length;
  const privateSheets = spreadsheets.filter(s => s.status === 'private').length;
  const totalCells = spreadsheets.reduce((sum, s) => sum + (s.rowCount * s.columnCount), 0);
  const totalCollaborators = spreadsheets.reduce((sum, s) => sum + s.collaborators.length, 0);

  const renderSpreadsheetsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Name</div>
        <div className="col-span-2">Owner</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2">Last Modified</div>
        <div className="col-span-1">Size</div>
        <div className="col-span-2">Collaborators</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredSpreadsheets.map(sheet => (
        <div key={sheet.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <div className="flex items-center space-x-2">
              <Grid3X3 className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-sm">{sheet.name}</p>
                <p className="text-xs text-gray-600">{sheet.description}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{sheet.owner}</p>
          </div>
          <div className="col-span-1">
            <Badge 
              variant={sheet.status === 'shared' ? 'default' : sheet.status === 'private' ? 'secondary' : 'outline'}
              className="text-xs"
            >
              {sheet.status}
            </Badge>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{new Date(sheet.lastModified).toLocaleDateString()}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{sheet.rowCount}x{sheet.columnCount}</p>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3 text-gray-400" />
              <span className="text-sm">{sheet.collaborators.length}</span>
              {sheet.isLocked && <Lock className="h-3 w-3 text-yellow-500" />}
            </div>
          </div>
          <div className="col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCreateDialog = () => (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Spreadsheet</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter spreadsheet name" />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter description" />
          </div>
          <div>
            <Label htmlFor="template">Template</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blank">Blank Spreadsheet</SelectItem>
                <SelectItem value="budget">Budget Template</SelectItem>
                <SelectItem value="sales">Sales Report</SelectItem>
                <SelectItem value="inventory">Inventory Tracker</SelectItem>
                <SelectItem value="project">Project Planner</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="privacy">Privacy</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select privacy level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="shared">Shared with team</SelectItem>
                <SelectItem value="public">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              handleCreateSpreadsheet();
              setShowCreateDialog(false);
            }}>
              Create Spreadsheet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <OdooMainLayout currentApp="Spreadsheets">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title="Spreadsheets"
          subtitle="Collaborative spreadsheets with real-time editing and business data integration"
          searchPlaceholder="Search spreadsheets..."
          onSearch={setSearchTerm}
          onCreateNew={() => setShowCreateDialog(true)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={spreadsheetFilters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={filteredSpreadsheets.length}
          actions={[
            {
              label: 'Import',
              icon: <Download className="h-4 w-4" />,
              onClick: () => console.log('Import spreadsheet')
            }
          ]}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="spreadsheets">Spreadsheets</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="spreadsheets" className="flex-1 flex flex-col">
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Spreadsheets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Grid3X3 className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{spreadsheets.length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Shared Sheets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Share className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{sharedSheets}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Cells</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Calculator className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{totalCells.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Collaborators</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{totalCollaborators}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6 overflow-auto">
              {renderSpreadsheetsList()}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="flex-1 p-6 overflow-auto">
            <div className="text-center text-gray-500">
              Spreadsheet templates coming soon...
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 p-6 overflow-auto">
            <div className="text-center text-gray-500">
              Usage analytics coming soon...
            </div>
          </TabsContent>
        </Tabs>

        {renderCreateDialog()}
      </div>
    </OdooMainLayout>
  );
};

export default Spreadsheets;
