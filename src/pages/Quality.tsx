
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { ShieldCheck, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QualityCheck, QualityControlPoint, QualityCheckStatus, QualityMetrics } from '@/types/quality';
import CreateQualityCheckForm from '@/components/quality/CreateQualityCheckForm';
import QualityCheckCard from '@/components/quality/QualityCheckCard';
import { generateId } from '@/lib/localStorageUtils';
import { toast } from '@/components/ui/use-toast';

const Quality = () => {
  const navigate = useNavigate();
  const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([]);
  const [controlPoints] = useState<QualityControlPoint[]>([
    {
      id: 'cp1',
      name: 'Incoming Material Inspection',
      description: 'Check quality of incoming raw materials',
      type: 'Incoming Inspection',
      products: ['Raw Material A', 'Component B'],
      isActive: true,
      checklistItems: ['Visual inspection', 'Dimensional check', 'Material certificate review'],
      createdAt: '2025-01-01',
      createdBy: 'Quality Manager'
    },
    {
      id: 'cp2', 
      name: 'Final Product Quality Check',
      description: 'Final inspection before packaging',
      type: 'Final Inspection',
      products: ['Product X', 'Product Y'],
      isActive: true,
      checklistItems: ['Functionality test', 'Appearance check', 'Packaging verification'],
      createdAt: '2025-01-01',
      createdBy: 'Quality Manager'
    },
    {
      id: 'cp3',
      name: 'In-Process Monitoring',
      description: 'Quality checks during production',
      type: 'In-Process',
      products: ['Assembly A', 'Component C'],
      isActive: true,
      checklistItems: ['Process parameters', 'Work instructions compliance', 'Equipment calibration'],
      createdAt: '2025-01-01',
      createdBy: 'Quality Manager'
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
    
    // Initialize with sample data
    const sampleChecks: QualityCheck[] = [
      {
        id: 'QC001',
        controlPointId: 'cp1',
        controlPointName: 'Incoming Material Inspection',
        productName: 'Raw Material A',
        batchNumber: 'RM-2025-001',
        status: 'Pending',
        priority: 'High',
        assignedTo: 'John Smith',
        createdAt: '2025-05-30',
        scheduledDate: '2025-05-31',
        notes: 'Critical batch for urgent order'
      },
      {
        id: 'QC002',
        controlPointId: 'cp2',
        controlPointName: 'Final Product Quality Check',
        productName: 'Product X',
        status: 'In Progress',
        priority: 'Medium',
        assignedTo: 'Jane Doe',
        createdAt: '2025-05-29',
        scheduledDate: '2025-05-30'
      },
      {
        id: 'QC003',
        controlPointId: 'cp2',
        controlPointName: 'Final Product Quality Check',
        productName: 'Product Y',
        status: 'Passed',
        priority: 'Low',
        assignedTo: 'Mike Wilson',
        createdAt: '2025-05-28',
        scheduledDate: '2025-05-29',
        completedDate: '2025-05-29'
      }
    ];
    setQualityChecks(sampleChecks);
  }, [navigate]);

  const handleCreateCheck = (newCheck: QualityCheck) => {
    setQualityChecks(prev => [newCheck, ...prev]);
    setShowCreateForm(false);
    toast({
      title: "Quality Check Created",
      description: `Check ${newCheck.id} has been created successfully.`,
    });
  };

  const handleStatusUpdate = (checkId: string, newStatus: QualityCheckStatus) => {
    setQualityChecks(prev => prev.map(check => 
      check.id === checkId 
        ? { 
            ...check, 
            status: newStatus,
            completedDate: newStatus === 'Passed' || newStatus === 'Failed' ? new Date().toISOString().split('T')[0] : undefined
          }
        : check
    ));
    toast({
      title: "Status Updated",
      description: `Check ${checkId} status updated to ${newStatus}.`,
    });
  };

  const filteredChecks = qualityChecks.filter(check => {
    const matchesSearch = searchTerm === '' || 
      check.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || check.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const metrics: QualityMetrics = {
    totalChecks: qualityChecks.length,
    passedChecks: qualityChecks.filter(c => c.status === 'Passed').length,
    failedChecks: qualityChecks.filter(c => c.status === 'Failed').length,
    pendingChecks: qualityChecks.filter(c => c.status === 'Pending' || c.status === 'In Progress').length,
    passRate: qualityChecks.length > 0 ? (qualityChecks.filter(c => c.status === 'Passed').length / qualityChecks.filter(c => c.status === 'Passed' || c.status === 'Failed').length) * 100 : 0,
    averageCheckTime: 2.5 // Mock data
  };

  return (
    <TopbarDashboardLayout currentApp="Quality">
      <div className="p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <ShieldCheck className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{metrics.totalChecks}</p>
                <p className="text-sm text-gray-600">Total Checks</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">✓</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.passedChecks}</p>
                <p className="text-sm text-gray-600">Passed</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">✗</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.failedChecks}</p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">%</span>
              </div>
              <div>
                <p className="text-2xl font-bold">{metrics.passRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-600">Pass Rate</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-odoo-dark flex items-center">
                <ShieldCheck className="h-6 w-6 mr-2" />
                Quality Control
              </h1>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Create Quality Check
              </Button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search checks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="passed">Passed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4">
            <Tabs defaultValue="checks" className="w-full">
              <TabsList>
                <TabsTrigger value="checks">Quality Checks</TabsTrigger>
                <TabsTrigger value="control-points">Control Points</TabsTrigger>
              </TabsList>
              
              <TabsContent value="checks" className="mt-4">
                {filteredChecks.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredChecks.map((check) => (
                      <QualityCheckCard
                        key={check.id}
                        check={check}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? "No checks match your filters." 
                      : "No quality checks found. Create your first check to get started."
                    }
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="control-points" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {controlPoints.map((cp) => (
                    <div key={cp.id} className="bg-gray-50 p-4 rounded-lg border">
                      <h3 className="font-semibold text-lg mb-2">{cp.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{cp.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{cp.type}</span>
                        <span className={`text-xs px-2 py-1 rounded ${cp.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {cp.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="text-sm">
                        <p className="font-medium">Products:</p>
                        <p className="text-gray-600">{cp.products.join(', ')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <CreateQualityCheckForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onCheckCreate={handleCreateCheck}
        controlPoints={controlPoints.map(cp => ({id: cp.id, name: cp.name, type: cp.type}))}
      />
    </TopbarDashboardLayout>
  );
};

export default Quality;
