
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import SpreadsheetCard from '@/components/spreadsheets/SpreadsheetCard';
import { Table, Plus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spreadsheet } from '@/types/spreadsheets';

const Spreadsheets = () => {
  const navigate = useNavigate();
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

  const sharedSheets = spreadsheets.filter(s => s.status === 'shared').length;
  const privateSheets = spreadsheets.filter(s => s.status === 'private').length;
  const publicSheets = spreadsheets.filter(s => s.status === 'public').length;

  return (
    <TopbarDashboardLayout currentApp="Spreadsheets">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center mb-4">
            <Table className="h-8 w-8 text-odoo-primary mr-3" />
            <h1 className="text-2xl font-bold text-odoo-dark">Spreadsheets</h1>
          </div>
          <p className="text-odoo-gray">Create collaborative spreadsheets integrated with your business data for analysis and reporting.</p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Shared</h3>
              <p className="text-2xl font-bold text-blue-900">{sharedSheets}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-800">Private</h3>
              <p className="text-2xl font-bold text-gray-900">{privateSheets}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Public</h3>
              <p className="text-2xl font-bold text-green-900">{publicSheets}</p>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
            <div className="space-x-2">
              <Button 
                className="bg-odoo-primary text-white hover:bg-odoo-primary/90"
                onClick={handleCreateSpreadsheet}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Spreadsheet
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Templates
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-odoo-dark mb-4">My Spreadsheets</h2>
          {spreadsheets.length === 0 ? (
            <div className="border rounded-lg p-8 text-center">
              <Table className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-odoo-gray">No spreadsheets available. Create your first spreadsheet to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {spreadsheets.map((sheet) => (
                <SpreadsheetCard
                  key={sheet.id}
                  spreadsheet={sheet}
                  onUpdate={handleUpdateSpreadsheet}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </TopbarDashboardLayout>
  );
};

export default Spreadsheets;
