
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
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="workcenters">Work Centers</TabsTrigger>
              <TabsTrigger value="bom">Bills of Materials</TabsTrigger>
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
            <div className="text-center text-gray-500">
              Bills of Materials management coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Manufacturing;
