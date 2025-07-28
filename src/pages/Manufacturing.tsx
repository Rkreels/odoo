
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Factory, 
  Package, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Settings,
  Eye,
  Edit,
  Calendar,
  User
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ManufacturingOrder {
  id: string;
  reference: string;
  product: string;
  quantity: number;
  quantityProduced: number;
  state: 'draft' | 'confirmed' | 'progress' | 'done' | 'cancel';
  priority: '0' | '1' | '2' | '3';
  scheduledDate: string;
  deadline: string;
  responsible: string;
  workcenters: string[];
  billOfMaterials: string;
  source: string;
  routing: string;
  company: string;
}

interface WorkCenter {
  id: string;
  name: string;
  code: string;
  capacity: number;
  efficiency: number;
  timeEfficiency: number;
  oeeTarget: number;
  currentLoad: number;
  status: 'available' | 'busy' | 'blocked' | 'maintenance';
  activeOrders: number;
  location: string;
}

interface BillOfMaterials {
  id: string;
  reference: string;
  product: string;
  quantity: number;
  type: 'normal' | 'phantom' | 'kit';
  components: Component[];
  routing: string;
  version: string;
  active: boolean;
}

interface Component {
  id: string;
  product: string;
  quantity: number;
  unit: string;
  operation: string;
}

const Manufacturing = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('list');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [manufacturingOrders] = useState<ManufacturingOrder[]>([
    {
      id: '1',
      reference: 'MO/001',
      product: 'Office Chair - Premium',
      quantity: 100,
      quantityProduced: 75,
      state: 'progress',
      priority: '2',
      scheduledDate: '2024-01-15',
      deadline: '2024-01-25',
      responsible: 'John Smith',
      workcenters: ['Assembly Line 1', 'Quality Control'],
      billOfMaterials: 'BOM/Chair/001',
      source: 'Sales Order SO123',
      routing: 'Chair Assembly Route',
      company: 'Main Company'
    },
    {
      id: '2',
      reference: 'MO/002',
      product: 'Desk Lamp - LED',
      quantity: 200,
      quantityProduced: 0,
      state: 'confirmed',
      priority: '1',
      scheduledDate: '2024-01-20',
      deadline: '2024-01-30',
      responsible: 'Sarah Johnson',
      workcenters: ['Electronics Line', 'Testing'],
      billOfMaterials: 'BOM/Lamp/001',
      source: 'Manual',
      routing: 'Electronics Assembly',
      company: 'Main Company'
    }
  ]);

  const [workCenters] = useState<WorkCenter[]>([
    {
      id: '1',
      name: 'Assembly Line 1',
      code: 'ASM001',
      capacity: 8,
      efficiency: 85,
      timeEfficiency: 92,
      oeeTarget: 80,
      currentLoad: 75,
      status: 'busy',
      activeOrders: 3,
      location: 'Building A - Floor 1'
    },
    {
      id: '2',
      name: 'Quality Control',
      code: 'QC001',
      capacity: 4,
      efficiency: 95,
      timeEfficiency: 88,
      oeeTarget: 85,
      currentLoad: 60,
      status: 'available',
      activeOrders: 2,
      location: 'Building A - Floor 2'
    }
  ]);

  const [billsOfMaterials] = useState<BillOfMaterials[]>([
    {
      id: '1',
      reference: 'BOM/Chair/001',
      product: 'Office Chair - Premium',
      quantity: 1,
      type: 'normal',
      components: [
        { id: '1', product: 'Chair Base', quantity: 1, unit: 'Unit', operation: 'Assembly' },
        { id: '2', product: 'Chair Seat', quantity: 1, unit: 'Unit', operation: 'Assembly' },
        { id: '3', product: 'Chair Back', quantity: 1, unit: 'Unit', operation: 'Assembly' },
        { id: '4', product: 'Screws Pack', quantity: 1, unit: 'Pack', operation: 'Assembly' }
      ],
      routing: 'Chair Assembly Route',
      version: '1.0',
      active: true
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const orderFilters = [
    { label: 'To Launch', value: 'confirmed', count: 5 },
    { label: 'In Progress', value: 'progress', count: 8 },
    { label: 'Done', value: 'done', count: 23 },
    { label: 'Late', value: 'late', count: 2 }
  ];

  const getStateColor = (state: string) => {
    const colors = {
      draft: 'bg-gray-500',
      confirmed: 'bg-blue-500',
      progress: 'bg-yellow-500',
      done: 'bg-green-500',
      cancel: 'bg-red-500'
    };
    return colors[state as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-500',
      busy: 'bg-yellow-500',
      blocked: 'bg-red-500',
      maintenance: 'bg-orange-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const filteredOrders = manufacturingOrders.filter(order => {
    const matchesSearch = order.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || order.state === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalOrders = manufacturingOrders.length;
  const inProgressOrders = manufacturingOrders.filter(o => o.state === 'progress').length;
  const avgEfficiency = workCenters.reduce((sum, wc) => sum + wc.efficiency, 0) / workCenters.length;

  const renderOrdersList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Reference</div>
        <div className="col-span-2">Product</div>
        <div className="col-span-1">Quantity</div>
        <div className="col-span-1">State</div>
        <div className="col-span-1">Priority</div>
        <div className="col-span-2">Scheduled Date</div>
        <div className="col-span-2">Responsible</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredOrders.map(order => (
        <div key={order.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <p className="font-medium text-sm">{order.reference}</p>
            <p className="text-xs text-gray-600">{order.source}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm font-medium">{order.product}</p>
            <p className="text-xs text-gray-600">{order.billOfMaterials}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{order.quantityProduced}/{order.quantity}</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(order.quantityProduced / order.quantity) * 100}%` }}
              />
            </div>
          </div>
          <div className="col-span-1">
            <Badge className={`text-white ${getStateColor(order.state)}`}>
              {order.state}
            </Badge>
          </div>
          <div className="col-span-1">
            <Badge variant={order.priority === '3' ? 'destructive' : order.priority === '2' ? 'default' : 'secondary'}>
              P{order.priority}
            </Badge>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span className="text-sm">{order.scheduledDate}</span>
            </div>
            <p className="text-xs text-gray-600">Due: {order.deadline}</p>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span className="text-sm">{order.responsible}</span>
            </div>
          </div>
          <div className="col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Done
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Eye className="h-4 w-4 mr-2" />
                  View
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}
    </div>
  );

  const renderWorkCentersList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Work Center</div>
        <div className="col-span-1">Capacity</div>
        <div className="col-span-1">Load</div>
        <div className="col-span-1">Efficiency</div>
        <div className="col-span-1">OEE Target</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Active Orders</div>
        <div className="col-span-2">Location</div>
      </div>
      
      {workCenters.map(workCenter => (
        <div key={workCenter.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <p className="font-medium text-sm">{workCenter.name}</p>
            <p className="text-xs text-gray-600">{workCenter.code}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{workCenter.capacity}h</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{workCenter.currentLoad}%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className={`h-2 rounded-full ${workCenter.currentLoad > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${workCenter.currentLoad}%` }}
              />
            </div>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{workCenter.efficiency}%</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{workCenter.oeeTarget}%</p>
          </div>
          <div className="col-span-2">
            <Badge className={`text-white ${getStatusColor(workCenter.status)}`}>
              {workCenter.status}
            </Badge>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{workCenter.activeOrders} orders</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{workCenter.location}</p>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Manufacturing">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'orders' ? 'Manufacturing Orders' : activeTab === 'workcenters' ? 'Work Centers' : 'Bills of Materials'}
          subtitle={activeTab === 'orders' ? 'Production planning and execution' : activeTab === 'workcenters' ? 'Work center efficiency and capacity' : 'Product structure and components'}
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={activeTab === 'orders' ? orderFilters : []}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'orders' ? filteredOrders.length : activeTab === 'workcenters' ? workCenters.length : billsOfMaterials.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-2xl grid-cols-5">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="workcenters">Work Centers</TabsTrigger>
              <TabsTrigger value="bom">Bills of Materials</TabsTrigger>
              <TabsTrigger value="planning">Planning</TabsTrigger>
              <TabsTrigger value="quality">Quality</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="orders" className="flex-1 flex flex-col">
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Factory className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{totalOrders}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <span className="text-2xl font-bold">{inProgressOrders}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{avgEfficiency.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-2xl font-bold">3</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderOrdersList()}
            </div>
          </TabsContent>

          <TabsContent value="workcenters" className="flex-1 p-6">
            {renderWorkCentersList()}
          </TabsContent>

          <TabsContent value="bom" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {billsOfMaterials.map(bom => (
                <Card key={bom.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{bom.product}</CardTitle>
                      <Badge variant={bom.active ? 'default' : 'secondary'}>
                        v{bom.version}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">{bom.reference}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{bom.type}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Quantity:</span>
                        <span className="font-medium">{bom.quantity}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Components:</span>
                        <span className="font-medium">{bom.components.length}</span>
                      </div>
                      <div className="pt-3 border-t">
                        <h4 className="font-medium mb-2 text-sm">Components</h4>
                        <div className="space-y-1">
                          {bom.components.slice(0, 3).map(component => (
                            <div key={component.id} className="flex justify-between text-xs">
                              <span>{component.product}</span>
                              <span>{component.quantity} {component.unit}</span>
                            </div>
                          ))}
                          {bom.components.length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{bom.components.length - 3} more...
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="planning" className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Production Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium text-sm">Office Chair Production</p>
                        <p className="text-xs text-gray-600">Due: 2024-01-25</p>
                      </div>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium text-sm">Desk Lamp Assembly</p>
                        <p className="text-xs text-gray-600">Due: 2024-01-30</p>
                      </div>
                      <Badge variant="outline">Planning</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium text-sm">Cabinet Manufacturing</p>
                        <p className="text-xs text-gray-600">Due: 2024-02-05</p>
                      </div>
                      <Badge variant="destructive">Delayed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resource Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Assembly Line 1</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Quality Control</span>
                        <span>60%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Electronics Line</span>
                        <span>92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Material Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">Steel Components</p>
                        <p className="text-xs text-gray-600">Required: 150 kg | Available: 120 kg</p>
                      </div>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">Wood Panels</p>
                        <p className="text-xs text-gray-600">Required: 50 pcs | Available: 60 pcs</p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">Electronic Parts</p>
                        <p className="text-xs text-gray-600">Required: 200 pcs | Available: 180 pcs</p>
                      </div>
                      <Clock className="h-4 w-4 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Next Preventive Maintenance</span>
                      <span className="font-medium text-sm">2024-01-28</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Equipment Health Score</span>
                      <span className="font-medium text-sm">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Critical Equipment</span>
                      <span className="font-medium text-sm">2 items</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="quality" className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quality Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Overall Quality Score</span>
                      <span className="font-medium text-lg">96.8%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">First Pass Yield</span>
                      <span className="font-medium">94.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Defect Rate</span>
                      <span className="font-medium">2.1%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Customer Returns</span>
                      <span className="font-medium">0.8%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Quality Checks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">Office Chair - Batch #001</p>
                        <p className="text-xs text-gray-600">Checked: 2024-01-20</p>
                      </div>
                      <Badge variant="default">Passed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">Desk Lamp - Batch #045</p>
                        <p className="text-xs text-gray-600">Checked: 2024-01-19</p>
                      </div>
                      <Badge variant="destructive">Failed</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <p className="font-medium text-sm">Cabinet - Batch #023</p>
                        <p className="text-xs text-gray-600">Checked: 2024-01-18</p>
                      </div>
                      <Badge variant="default">Passed</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quality Control Points</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Incoming Inspection</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">In-Process Check</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Final Inspection</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Customer Audit</span>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Corrective Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-2 border rounded">
                      <p className="font-medium text-sm">CA-2024-001</p>
                      <p className="text-xs text-gray-600">Dimensional deviation in desk lamp base</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="secondary" className="text-xs">In Progress</Badge>
                        <span className="text-xs">Due: 2024-01-25</span>
                      </div>
                    </div>
                    <div className="p-2 border rounded">
                      <p className="font-medium text-sm">CA-2024-002</p>
                      <p className="text-xs text-gray-600">Surface finish quality issue</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="destructive" className="text-xs">Overdue</Badge>
                        <span className="text-xs">Due: 2024-01-20</span>
                      </div>
                    </div>
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

export default Manufacturing;
