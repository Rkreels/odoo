
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Factory, Plus, Filter, Play, Pause, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ManufacturingOrder, WorkOrder } from '@/types/manufacturing';
import VoiceTrainer from '@/components/voice/VoiceTrainer';
import { toast } from "@/components/ui/use-toast";

const Manufacturing = () => {
  const navigate = useNavigate();
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const [orders, setOrders] = useState<ManufacturingOrder[]>([
    {
      id: 'MO001',
      product: 'Office Chair Premium',
      quantity: 50,
      plannedDate: '2025-05-25',
      deadline: '2025-06-01',
      status: 'in-progress',
      location: 'Factory A',
      responsible: 'John Smith',
      workOrders: [
        { id: 'WO001', name: 'Frame Assembly', workCenter: 'Assembly Line 1', status: 'done', duration: '2 hours' },
        { id: 'WO002', name: 'Cushion Installation', workCenter: 'Assembly Line 2', status: 'in-progress', duration: '1 hour', assignedWorker: 'Alice Brown' },
        { id: 'WO003', name: 'Quality Check', workCenter: 'QC Station', status: 'pending', duration: '30 min' }
      ],
      materials: [
        { id: 'MAT001', product: 'Steel Frame', required: 50, available: 45, reserved: 45, unit: 'pcs' },
        { id: 'MAT002', product: 'Foam Cushion', required: 50, available: 60, reserved: 50, unit: 'pcs' },
        { id: 'MAT003', product: 'Fabric Cover', required: 50, available: 30, reserved: 30, unit: 'pcs' }
      ]
    },
    {
      id: 'MO002',
      product: 'Conference Table',
      quantity: 10,
      plannedDate: '2025-05-28',
      deadline: '2025-06-05',
      status: 'planned',
      location: 'Factory B',
      responsible: 'Mike Wilson',
      workOrders: [
        { id: 'WO004', name: 'Wood Cutting', workCenter: 'CNC Machine', status: 'pending', duration: '3 hours' },
        { id: 'WO005', name: 'Surface Treatment', workCenter: 'Finishing', status: 'pending', duration: '2 hours' },
        { id: 'WO006', name: 'Assembly', workCenter: 'Assembly Line 3', status: 'pending', duration: '1.5 hours' }
      ],
      materials: [
        { id: 'MAT004', product: 'Oak Wood Panel', required: 20, available: 25, reserved: 20, unit: 'pcs' },
        { id: 'MAT005', product: 'Table Legs', required: 40, available: 50, reserved: 40, unit: 'pcs' },
        { id: 'MAT006', product: 'Wood Finish', required: 2, available: 5, reserved: 2, unit: 'liters' }
      ]
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleStartOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'in-progress' } : order
      )
    );
    toast({
      title: "Production started",
      description: `Manufacturing order ${orderId} has been started.`,
    });
  };

  const handleCompleteOrder = (orderId: string) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: 'done' } : order
      )
    );
    toast({
      title: "Production completed",
      description: `Manufacturing order ${orderId} has been completed.`,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'planned': return 'outline';
      case 'in-progress': return 'default';
      case 'done': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <TopbarDashboardLayout currentApp="Manufacturing">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Factory className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Manufacturing</h1>
                <p className="text-odoo-gray">
                  Manage production orders, work centers, and manufacturing processes.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => setShowVoiceTrainer(!showVoiceTrainer)}
                className="border-odoo-primary text-odoo-primary hover:bg-odoo-primary hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                Voice Guide
              </Button>
              <Button className="bg-odoo-primary hover:bg-odoo-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                New Manufacturing Order
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold">{orders.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold">{orders.filter(o => o.status === 'in-progress').length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Planned</p>
              <p className="text-2xl font-semibold">{orders.filter(o => o.status === 'planned').length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-semibold">{orders.filter(o => o.status === 'done').length}</p>
            </div>
          </div>

          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger value="orders">Manufacturing Orders</TabsTrigger>
              <TabsTrigger value="workcenters">Work Centers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orders">
              <div className="flex items-center justify-between mb-6">
                <div className="w-64">
                  <Input placeholder="Search orders..." />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              <div className="space-y-4">
                {orders.map(order => (
                  <Card key={order.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{order.id} - {order.product}</CardTitle>
                          <p className="text-gray-500">Quantity: {order.quantity} | Deadline: {order.deadline}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getStatusBadgeVariant(order.status)}>
                            {order.status}
                          </Badge>
                          {order.status === 'planned' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleStartOrder(order.id)}
                              className="bg-odoo-primary hover:bg-odoo-primary/90"
                            >
                              <Play className="h-3 w-3 mr-1" />
                              Start
                            </Button>
                          )}
                          {order.status === 'in-progress' && (
                            <Button 
                              size="sm" 
                              onClick={() => handleCompleteOrder(order.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Work Orders</h4>
                          <div className="space-y-1">
                            {order.workOrders.map(wo => (
                              <div key={wo.id} className="flex justify-between text-sm">
                                <span>{wo.name}</span>
                                <Badge variant={getStatusBadgeVariant(wo.status)} className="text-xs">
                                  {wo.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Materials</h4>
                          <div className="space-y-1">
                            {order.materials.map(mat => (
                              <div key={mat.id} className="flex justify-between text-sm">
                                <span>{mat.product}</span>
                                <span className={mat.available < mat.required ? 'text-red-500' : 'text-green-600'}>
                                  {mat.available}/{mat.required} {mat.unit}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="workcenters">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['Assembly Line 1', 'Assembly Line 2', 'CNC Machine', 'QC Station', 'Finishing'].map(center => (
                  <Card key={center}>
                    <CardHeader>
                      <CardTitle className="text-base">{center}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-500">
                        <p>Status: <span className="text-green-600">Available</span></p>
                        <p>Efficiency: 85%</p>
                        <p>Current Job: Office Chair Premium</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Voice Trainer */}
      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen="manufacturing"
        />
      )}
    </TopbarDashboardLayout>
  );
};

export default Manufacturing;
