
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Wrench, Plus, Search, Filter, Calendar, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Equipment, MaintenanceRequest, MaintenanceStatus, MaintenanceMetrics } from '@/types/maintenance';
import CreateMaintenanceRequestForm from '@/components/maintenance/CreateMaintenanceRequestForm';
import { toast } from '@/components/ui/use-toast';

const Maintenance = () => {
  const navigate = useNavigate();
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [equipment] = useState<Equipment[]>([
    {
      id: 'eq1',
      name: 'CNC Machine #001',
      type: 'Manufacturing Equipment',
      model: 'Haas VF-2',
      serialNumber: 'HAS001234',
      location: 'Production Floor A',
      status: 'Operational',
      purchaseDate: '2023-01-15',
      warrantyExpiry: '2026-01-15',
      lastMaintenance: '2025-04-15',
      nextMaintenance: '2025-07-15',
      totalMaintenanceCost: 15000,
      operatingHours: 2450
    },
    {
      id: 'eq2',
      name: 'Conveyor Belt System',
      type: 'Material Handling',
      model: 'FlexLink X85',
      serialNumber: 'FL002345',
      location: 'Production Floor B',
      status: 'Under Maintenance',
      purchaseDate: '2022-08-20',
      lastMaintenance: '2025-05-20',
      nextMaintenance: '2025-08-20',
      totalMaintenanceCost: 8500,
      operatingHours: 5200
    },
    {
      id: 'eq3',
      name: 'Air Compressor Unit',
      type: 'Utility Equipment',
      model: 'Atlas Copco GA30',
      serialNumber: 'AC003456',
      location: 'Utility Room',
      status: 'Operational',
      purchaseDate: '2021-11-10',
      lastMaintenance: '2025-03-10',
      nextMaintenance: '2025-09-10',
      totalMaintenanceCost: 5200,
      operatingHours: 8760
    }
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
    
    // Initialize with sample maintenance requests
    const sampleRequests: MaintenanceRequest[] = [
      {
        id: 'MR001',
        equipmentId: 'eq1',
        equipmentName: 'CNC Machine #001',
        type: 'Preventive',
        status: 'Scheduled',
        priority: 'Medium',
        title: 'Quarterly Preventive Maintenance',
        description: 'Routine maintenance including lubrication, calibration, and parts inspection',
        requestedBy: 'Production Manager',
        assignedTo: 'John Smith',
        scheduledDate: '2025-06-15',
        estimatedDuration: 4,
        estimatedCost: 800,
        createdAt: '2025-05-30'
      },
      {
        id: 'MR002',
        equipmentId: 'eq2',
        equipmentName: 'Conveyor Belt System',
        type: 'Corrective',
        status: 'In Progress',
        priority: 'High',
        title: 'Belt Replacement',
        description: 'Replace worn conveyor belt and adjust tension',
        requestedBy: 'Floor Supervisor',
        assignedTo: 'Mike Wilson',
        scheduledDate: '2025-05-30',
        estimatedDuration: 6,
        estimatedCost: 1200,
        actualDuration: 4,
        actualCost: 950,
        createdAt: '2025-05-29'
      },
      {
        id: 'MR003',
        equipmentId: 'eq3',
        equipmentName: 'Air Compressor Unit',
        type: 'Emergency',
        status: 'Completed',
        priority: 'Critical',
        title: 'Emergency Pressure Valve Repair',
        description: 'Safety valve malfunction requiring immediate attention',
        requestedBy: 'Safety Inspector',
        assignedTo: 'Emergency Team',
        scheduledDate: '2025-05-25',
        completedDate: '2025-05-25',
        estimatedDuration: 2,
        estimatedCost: 500,
        actualDuration: 1.5,
        actualCost: 350,
        createdAt: '2025-05-25'
      }
    ];
    setMaintenanceRequests(sampleRequests);
  }, [navigate]);

  const handleCreateRequest = (newRequest: MaintenanceRequest) => {
    setMaintenanceRequests(prev => [newRequest, ...prev]);
    setShowCreateForm(false);
    toast({
      title: "Maintenance Request Created",
      description: `Request ${newRequest.id} has been created successfully.`,
    });
  };

  const handleStatusUpdate = (requestId: string, newStatus: MaintenanceStatus) => {
    setMaintenanceRequests(prev => prev.map(request => 
      request.id === requestId 
        ? { 
            ...request, 
            status: newStatus,
            completedDate: newStatus === 'Completed' ? new Date().toISOString().split('T')[0] : undefined
          }
        : request
    ));
    toast({
      title: "Status Updated",
      description: `Request ${requestId} status updated to ${newStatus}.`,
    });
  };

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const metrics: MaintenanceMetrics = {
    totalRequests: maintenanceRequests.length,
    completedRequests: maintenanceRequests.filter(r => r.status === 'Completed').length,
    pendingRequests: maintenanceRequests.filter(r => r.status !== 'Completed' && r.status !== 'Cancelled').length,
    overdueRequests: maintenanceRequests.filter(r => 
      r.status !== 'Completed' && new Date(r.scheduledDate) < new Date()
    ).length,
    averageCompletionTime: 3.2, // Mock calculation
    totalMaintenanceCost: maintenanceRequests.reduce((sum, r) => sum + (r.actualCost || r.estimatedCost), 0),
    equipmentUptime: 94.5 // Mock data
  };

  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-gray-100 text-gray-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEquipmentStatusColor = (status: string) => {
    switch (status) {
      case 'Operational': return 'bg-green-100 text-green-800';
      case 'Under Maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'Out of Service': return 'bg-red-100 text-red-800';
      case 'Retired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <TopbarDashboardLayout currentApp="Maintenance">
      <div className="p-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Wrench className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{metrics.totalRequests}</p>
                <p className="text-sm text-gray-600">Total Requests</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{metrics.pendingRequests}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">{metrics.overdueRequests}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-2xl font-bold">${metrics.totalMaintenanceCost.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Cost</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h1 className="text-2xl font-bold text-odoo-dark flex items-center">
                <Wrench className="h-6 w-6 mr-2" />
                Maintenance Management
              </h1>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Create Request
              </Button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search requests..."
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
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4">
            <Tabs defaultValue="requests" className="w-full">
              <TabsList>
                <TabsTrigger value="requests">Maintenance Requests</TabsTrigger>
                <TabsTrigger value="equipment">Equipment</TabsTrigger>
              </TabsList>
              
              <TabsContent value="requests" className="mt-4">
                {filteredRequests.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredRequests.map((request) => (
                      <Card key={request.id} className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{request.id}</CardTitle>
                            <div className="flex gap-2">
                              <Badge className={getPriorityColor(request.priority)} variant="outline">
                                {request.priority}
                              </Badge>
                              <Badge className={getStatusColor(request.status)} variant="outline">
                                {request.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-lg font-medium">{request.title}</p>
                          <p className="text-sm text-gray-600">{request.equipmentName}</p>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <p className="text-sm">{request.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Requested by:</span>
                                <p>{request.requestedBy}</p>
                              </div>
                              <div>
                                <span className="font-medium">Assigned to:</span>
                                <p>{request.assignedTo || 'Unassigned'}</p>
                              </div>
                              <div>
                                <span className="font-medium">Scheduled:</span>
                                <p>{request.scheduledDate}</p>
                              </div>
                              <div>
                                <span className="font-medium">Duration:</span>
                                <p>{request.actualDuration || request.estimatedDuration}h</p>
                              </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                              <span className="text-sm font-medium">
                                Cost: ${request.actualCost || request.estimatedCost}
                              </span>
                              <div className="flex gap-2">
                                {request.status === 'Scheduled' && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleStatusUpdate(request.id, 'In Progress')}
                                  >
                                    Start Work
                                  </Button>
                                )}
                                {request.status === 'In Progress' && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleStatusUpdate(request.id, 'Completed')}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Complete
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? "No requests match your filters." 
                      : "No maintenance requests found. Create your first request to get started."
                    }
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="equipment" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {equipment.map((eq) => (
                    <Card key={eq.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{eq.name}</CardTitle>
                          <Badge className={getEquipmentStatusColor(eq.status)} variant="outline">
                            {eq.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{eq.type}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-medium">Model:</span>
                            <span>{eq.model}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Location:</span>
                            <span>{eq.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Operating Hours:</span>
                            <span>{eq.operatingHours.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Next Maintenance:</span>
                            <span>{eq.nextMaintenance || 'Not scheduled'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Total Cost:</span>
                            <span>${eq.totalMaintenanceCost.toLocaleString()}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <CreateMaintenanceRequestForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onRequestCreate={handleCreateRequest}
        equipment={equipment.map(eq => ({id: eq.id, name: eq.name, type: eq.type}))}
      />
    </TopbarDashboardLayout>
  );
};

export default Maintenance;
