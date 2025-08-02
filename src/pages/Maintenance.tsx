
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wrench, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Settings,
  User,
  Package,
  TrendingUp,
  MapPin,
  Plus
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface MaintenanceRequest {
  id: string;
  title: string;
  equipment: string;
  type: 'preventive' | 'corrective' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  assignee: string;
  requester: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedHours: number;
  actualHours?: number;
  location: string;
  description: string;
  cost: number;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'operational' | 'maintenance' | 'broken' | 'retired';
  location: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  lastMaintenance: string;
  nextMaintenance: string;
  mtbf: number; // Mean Time Between Failures (hours)
  totalDowntime: number; // hours
  maintenanceCost: number;
}

const Maintenance = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [requests] = useState<MaintenanceRequest[]>([
    {
      id: '1',
      title: 'Monthly inspection - Conveyor Belt A1',
      equipment: 'Conveyor Belt A1',
      type: 'preventive',
      priority: 'medium',
      status: 'assigned',
      assignee: 'Mike Technician',
      requester: 'Production Manager',
      createdDate: '2024-06-10',
      dueDate: '2024-06-15',
      estimatedHours: 4,
      location: 'Production Floor A',
      description: 'Regular monthly inspection and lubrication',
      cost: 250
    },
    {
      id: '2',
      title: 'Emergency repair - Pump Motor B2',
      equipment: 'Pump Motor B2',
      type: 'emergency',
      priority: 'critical',
      status: 'in_progress',
      assignee: 'Sarah Specialist',
      requester: 'Facility Manager',
      createdDate: '2024-06-11',
      dueDate: '2024-06-11',
      estimatedHours: 6,
      actualHours: 4,
      location: 'Pump Room B',
      description: 'Motor overheating and making unusual noises',
      cost: 850
    }
  ]);

  const [equipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Conveyor Belt A1',
      type: 'Material Handling',
      status: 'operational',
      location: 'Production Floor A',
      manufacturer: 'ConveyorTech',
      model: 'CT-2000',
      serialNumber: 'CT2000-2023-001',
      purchaseDate: '2023-01-15',
      warrantyExpiry: '2025-01-15',
      lastMaintenance: '2024-05-15',
      nextMaintenance: '2024-06-15',
      mtbf: 720,
      totalDowntime: 24,
      maintenanceCost: 1250
    },
    {
      id: '2',
      name: 'Pump Motor B2',
      type: 'Pump System',
      status: 'maintenance',
      location: 'Pump Room B',
      manufacturer: 'PumpMax',
      model: 'PM-500',
      serialNumber: 'PM500-2022-015',
      purchaseDate: '2022-08-20',
      warrantyExpiry: '2024-08-20',
      lastMaintenance: '2024-04-10',
      nextMaintenance: '2024-07-10',
      mtbf: 580,
      totalDowntime: 48,
      maintenanceCost: 2100
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const requestFilters = [
    { label: 'Pending', value: 'pending', count: requests.filter(r => r.status === 'pending').length },
    { label: 'In Progress', value: 'in_progress', count: requests.filter(r => r.status === 'in_progress').length },
    { label: 'Emergency', value: 'emergency', count: requests.filter(r => r.type === 'emergency').length },
    { label: 'Critical', value: 'critical', count: requests.filter(r => r.priority === 'critical').length }
  ];

  const equipmentFilters = [
    { label: 'Operational', value: 'operational', count: equipment.filter(e => e.status === 'operational').length },
    { label: 'Under Maintenance', value: 'maintenance', count: equipment.filter(e => e.status === 'maintenance').length },
    { label: 'Broken', value: 'broken', count: equipment.filter(e => e.status === 'broken').length }
  ];

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         request.status === selectedFilter || 
                         request.type === selectedFilter ||
                         request.priority === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || item.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalRequests = requests.length;
  const emergencyRequests = requests.filter(r => r.type === 'emergency').length;
  const equipmentDown = equipment.filter(e => e.status === 'broken' || e.status === 'maintenance').length;
  const avgResponseTime = 2.5; // hours

  const renderRequestsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Request</div>
        <div className="col-span-2">Type & Priority</div>
        <div className="col-span-2">Assignee</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Due Date</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredRequests.map(request => (
        <div key={request.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                request.type === 'emergency' ? 'bg-red-100' :
                request.type === 'corrective' ? 'bg-orange-100' : 'bg-blue-100'
              }`}>
                {request.type === 'emergency' ? (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                ) : (
                  <Wrench className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div>
                <p className="font-medium">{request.title}</p>
                <p className="text-sm text-gray-500">{request.equipment}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="space-y-1">
              <Badge variant="outline">{request.type}</Badge>
              <Badge 
                variant={
                  request.priority === 'critical' ? 'destructive' :
                  request.priority === 'high' ? 'secondary' : 'outline'
                }
                className="text-xs"
              >
                {request.priority}
              </Badge>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{request.assignee}</span>
            </div>
          </div>
          <div className="col-span-2">
            <Badge 
              variant={
                request.status === 'completed' ? 'default' :
                request.status === 'in_progress' ? 'secondary' :
                request.status === 'pending' ? 'outline' : 'destructive'
              }
            >
              {request.status === 'completed' && <CheckCircle className="h-3 w-3 mr-1" />}
              {request.status === 'in_progress' && <Clock className="h-3 w-3 mr-1" />}
              {request.status}
            </Badge>
          </div>
          <div className="col-span-2">
            <div>
              <p className="text-sm">{request.dueDate}</p>
              <p className="text-xs text-gray-500">{request.estimatedHours}h estimated</p>
            </div>
          </div>
          <div className="col-span-1">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderEquipmentList = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredEquipment.map(item => (
        <Card key={item.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{item.name}</CardTitle>
              <Badge 
                variant={
                  item.status === 'operational' ? 'default' :
                  item.status === 'maintenance' ? 'secondary' :
                  item.status === 'broken' ? 'destructive' : 'outline'
                }
              >
                {item.status === 'operational' && <CheckCircle className="h-3 w-3 mr-1" />}
                {item.status === 'broken' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {item.status}
              </Badge>
            </div>
            <div className="text-sm text-gray-600">{item.type}</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Manufacturer</span>
                  <p className="font-medium">{item.manufacturer}</p>
                </div>
                <div>
                  <span className="text-gray-500">Model</span>
                  <p className="font-medium">{item.model}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{item.location}</span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Next Maintenance</span>
                  <span className="font-medium">{item.nextMaintenance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">MTBF</span>
                  <span className="font-medium">{item.mtbf}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Maintenance Cost</span>
                  <span className="font-medium">${item.maintenanceCost}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t">
                <Button size="sm" variant="outline" className="w-full">
                  View Details
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Maintenance">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'requests' ? 'Maintenance Requests' : activeTab === 'equipment' ? 'Equipment' : 'Schedule'}
          subtitle={activeTab === 'requests' ? 'Manage maintenance work orders' : activeTab === 'equipment' ? 'Equipment database and tracking' : 'Maintenance planning and scheduling'}
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          filters={activeTab === 'requests' ? requestFilters : equipmentFilters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'requests' ? filteredRequests.length : filteredEquipment.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="equipment">Equipment</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="requests" className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Wrench className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{totalRequests}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Emergency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-2xl font-bold">{emergencyRequests}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Equipment Down</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{equipmentDown}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{avgResponseTime}h</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderRequestsList()}
            </div>
          </TabsContent>

          <TabsContent value="equipment" className="flex-1 p-6">
            {renderEquipmentList()}
          </TabsContent>

          <TabsContent value="schedule" className="flex-1 p-6">
            <div className="space-y-6">
              {/* Calendar View Toggle */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Maintenance Schedule</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Month View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Week View
                  </Button>
                  <Button onClick={() => {
                    toast({
                      title: "Schedule Maintenance",
                      description: "Opening maintenance scheduling form.",
                    });
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Maintenance
                  </Button>
                </div>
              </div>

              {/* Upcoming Maintenance */}
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {equipment.map(item => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            item.status === 'operational' ? 'bg-green-500' :
                            item.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                          }`} />
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{item.nextMaintenance}</p>
                          <p className="text-xs text-gray-500">Next maintenance</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Schedule Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Schedule New Maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="equipment">Equipment</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select equipment" />
                        </SelectTrigger>
                        <SelectContent>
                          {equipment.map(item => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="type">Maintenance Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="preventive">Preventive</SelectItem>
                          <SelectItem value="corrective">Corrective</SelectItem>
                          <SelectItem value="predictive">Predictive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="scheduled-date">Scheduled Date</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label htmlFor="assigned-to">Assigned To</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select technician" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mike">Mike Technician</SelectItem>
                          <SelectItem value="sarah">Sarah Specialist</SelectItem>
                          <SelectItem value="john">John Engineer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="description">Description</Label>
                    <Textarea placeholder="Maintenance work description..." />
                  </div>
                  <div className="mt-4">
                    <Button onClick={() => {
                      toast({
                        title: "Maintenance Scheduled",
                        description: "Maintenance has been scheduled successfully.",
                      });
                    }}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Maintenance
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Maintenance Calendar Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>This Week's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="text-center">
                        <p className="font-medium text-sm mb-2">{day}</p>
                        <div className="space-y-1">
                          {index < 3 && (
                            <div className="bg-blue-100 text-blue-800 text-xs p-1 rounded">
                              Preventive
                            </div>
                          )}
                          {index === 4 && (
                            <div className="bg-red-100 text-red-800 text-xs p-1 rounded">
                              Emergency
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Maintenance;
