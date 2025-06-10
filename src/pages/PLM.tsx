
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import ProductLifecycleView from '@/components/plm/ProductLifecycleView';
import { ClipboardList, Plus, Search, Filter, Package, FileText, Settings, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, EngineeringChangeOrder, ProductStatus } from '@/types/plm';
import { toast } from '@/components/ui/use-toast';

const PLM = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Smart Widget Pro',
      description: 'Advanced smart widget with IoT capabilities',
      partNumber: 'SWP-001',
      version: '2.1',
      status: 'production',
      category: 'Electronics',
      family: 'Smart Devices',
      lifecycle: {
        currentPhase: 'production',
        phases: [
          {
            id: '1',
            name: 'Concept',
            status: 'production',
            startDate: '2024-01-15',
            endDate: '2024-02-15',
            plannedDuration: 30,
            actualDuration: 31,
            deliverables: [
              { id: '1', name: 'Market Analysis', type: 'specification', status: 'completed', dueDate: '2024-02-01', assignee: 'John Doe', version: '1.0', completedDate: '2024-01-30' }
            ],
            criteria: [],
            responsible: 'Sarah Johnson',
            budget: 50000,
            actualCost: 52000
          }
        ],
        milestones: [
          {
            id: '1',
            name: 'Design Freeze',
            description: 'Final design approval and documentation',
            targetDate: '2024-03-15',
            actualDate: '2024-03-18',
            status: 'completed',
            critical: true,
            dependencies: [],
            deliverables: []
          }
        ],
        gates: [
          {
            id: '1',
            name: 'Design Review Gate',
            phase: 'design',
            criteria: [
              { id: '1', requirement: 'Design specifications complete', status: 'met' }
            ],
            status: 'passed',
            reviewedBy: 'Mike Wilson',
            reviewedAt: '2024-03-10'
          }
        ],
        metrics: {
          timeToMarket: 365,
          developmentCost: 250000,
          qualityScore: 95,
          riskLevel: 'low',
          completionPercentage: 85
        }
      },
      specifications: [],
      documents: [],
      bom: {
        id: '1',
        version: '1.0',
        status: 'approved',
        items: [],
        totalCost: 45.50,
        createdAt: '2024-01-20',
        createdBy: 'Tech Team'
      },
      changeOrders: [],
      compliance: [],
      costs: {
        development: 200000,
        material: 45000,
        manufacturing: 80000,
        tooling: 25000,
        testing: 15000,
        certification: 10000,
        total: 375000,
        breakdown: []
      },
      timeline: {
        milestones: [],
        ganttData: [],
        criticalPath: []
      },
      team: {
        projectManager: 'Sarah Johnson',
        leadEngineer: 'Mike Wilson',
        designTeam: [],
        testingTeam: [],
        qualityTeam: [],
        stakeholders: []
      },
      metadata: {
        tags: ['IoT', 'Smart Device'],
        category: 'Electronics',
        businessUnit: 'Consumer Products',
        productLine: 'Smart Home',
        marketSegment: 'Consumer',
        targetMarkets: ['US', 'EU'],
        competitors: ['TechCorp', 'SmartInnovations'],
        patents: [],
        intellectualProperty: []
      },
      createdAt: '2024-01-15',
      createdBy: 'Sarah Johnson',
      lastModified: '2024-06-10',
      modifiedBy: 'Mike Wilson'
    }
  ]);
  
  const [changeOrders, setChangeOrders] = useState<EngineeringChangeOrder[]>([
    {
      id: 'ECO-001',
      title: 'Battery Life Improvement',
      description: 'Upgrade battery technology to extend operational life',
      type: 'design',
      status: 'under_review',
      priority: 'high',
      initiator: 'Product Team',
      assignee: 'Mike Wilson',
      reason: 'Customer feedback indicates need for longer battery life',
      impact: {
        technical: 'Requires new battery module design',
        cost: 15000,
        schedule: 30,
        quality: 'Improved product reliability',
        regulatory: 'No additional certifications required',
        customer: 'Positive impact on user satisfaction',
        risk: 'medium'
      },
      approval: {
        required: true,
        approvers: [
          { id: '1', name: 'Sarah Johnson', role: 'Project Manager', order: 1, status: 'approved', approvedAt: '2024-06-08' },
          { id: '2', name: 'David Chen', role: 'Engineering Director', order: 2, status: 'pending' }
        ],
        currentStep: 2,
        status: 'pending'
      },
      implementation: {
        status: 'not_started',
        tasks: [],
        verification: {
          required: true,
          method: 'Design verification testing',
          status: 'pending'
        }
      },
      affectedProducts: ['1'],
      affectedDocuments: [],
      cost: 15000,
      timeline: {
        submitted: '2024-06-05',
      },
      createdAt: '2024-06-05',
      lastModified: '2024-06-10'
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('isAuthenticated')) navigate('/login');
  }, [navigate]);

  const handlePhaseUpdate = (phaseId: string, updates: any) => {
    if (!selectedProduct) return;
    
    const updatedProduct = {
      ...selectedProduct,
      lifecycle: {
        ...selectedProduct.lifecycle,
        phases: selectedProduct.lifecycle.phases.map(phase =>
          phase.id === phaseId ? { ...phase, ...updates } : phase
        )
      }
    };
    
    setSelectedProduct(updatedProduct);
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
    
    toast({
      title: "Phase Updated",
      description: "Product lifecycle phase has been updated successfully.",
    });
  };

  const handleMilestoneUpdate = (milestoneId: string, status: string) => {
    if (!selectedProduct) return;
    
    const updatedProduct = {
      ...selectedProduct,
      lifecycle: {
        ...selectedProduct.lifecycle,
        milestones: selectedProduct.lifecycle.milestones.map(milestone =>
          milestone.id === milestoneId 
            ? { ...milestone, status: status as any, actualDate: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined }
            : milestone
        )
      }
    };
    
    setSelectedProduct(updatedProduct);
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
    
    toast({
      title: "Milestone Updated",
      description: `Milestone status updated to ${status}.`,
    });
  };

  const handleGateReview = (gateId: string, status: 'passed' | 'failed', comments: string) => {
    if (!selectedProduct) return;
    
    const updatedProduct = {
      ...selectedProduct,
      lifecycle: {
        ...selectedProduct.lifecycle,
        gates: selectedProduct.lifecycle.gates.map(gate =>
          gate.id === gateId 
            ? { 
                ...gate, 
                status, 
                reviewedBy: 'Current User',
                reviewedAt: new Date().toISOString().split('T')[0],
                comments 
              }
            : gate
        )
      }
    };
    
    setSelectedProduct(updatedProduct);
    setProducts(prev => prev.map(p => p.id === selectedProduct.id ? updatedProduct : p));
    
    toast({
      title: `Gate ${status}`,
      description: `Quality gate has been marked as ${status}.`,
      variant: status === 'failed' ? 'destructive' : 'default',
    });
  };

  const getStatusColor = (status: ProductStatus) => {
    switch (status) {
      case 'production': return 'bg-green-100 text-green-800';
      case 'testing': return 'bg-blue-100 text-blue-800';
      case 'design': return 'bg-purple-100 text-purple-800';
      case 'concept': return 'bg-yellow-100 text-yellow-800';
      case 'discontinued': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const productStats = {
    total: products.length,
    inDevelopment: products.filter(p => ['concept', 'design', 'prototype', 'testing'].includes(p.status)).length,
    inProduction: products.filter(p => p.status === 'production').length,
    mature: products.filter(p => p.status === 'mature').length,
  };

  const ecoStats = {
    total: changeOrders.length,
    pending: changeOrders.filter(eco => eco.status === 'under_review').length,
    approved: changeOrders.filter(eco => eco.status === 'approved').length,
    implemented: changeOrders.filter(eco => eco.status === 'implemented').length,
  };

  return (
    <TopbarDashboardLayout currentApp="PLM">
      <div className="p-6">
        {selectedProduct ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                ← Back to Products
              </Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Export Report
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
              </div>
            </div>
            
            <ProductLifecycleView
              product={selectedProduct}
              onPhaseUpdate={handlePhaseUpdate}
              onMilestoneUpdate={handleMilestoneUpdate}
              onGateReview={handleGateReview}
            />
          </div>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex items-center mb-4">
                <ClipboardList className="h-8 w-8 text-odoo-primary mr-3" />
                <h1 className="text-2xl font-bold text-odoo-dark">Product Lifecycle Management</h1>
              </div>
              <p className="text-odoo-gray">Manage your product lifecycle from concept through design, manufacturing, and service.</p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-800">Total Products</h3>
                  <p className="text-2xl font-bold text-blue-900">{productStats.total}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-yellow-800">In Development</h3>
                  <p className="text-2xl font-bold text-yellow-900">{productStats.inDevelopment}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-green-800">In Production</h3>
                  <p className="text-2xl font-bold text-green-900">{productStats.inProduction}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800">Mature Products</h3>
                  <p className="text-2xl font-bold text-gray-900">{productStats.mature}</p>
                </div>
              </div>

              <div className="mt-6 border-t pt-6">
                <h2 className="text-xl font-semibold text-odoo-dark mb-3">Quick Actions</h2>
                <div className="space-x-2">
                  <Button className="bg-odoo-primary text-white hover:bg-odoo-primary/90">
                    <Plus className="h-4 w-4 mr-2" />
                    New Product
                  </Button>
                  <Button variant="outline">Create Engineering Change Order</Button>
                  <Button variant="outline">Manage BoMs</Button>
                  <Button variant="outline">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="products" className="space-y-6">
              <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="eco">Engineering Change Orders</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="products">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Product Portfolio</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input placeholder="Search products..." className="pl-10 w-64" />
                        </div>
                        <Button variant="outline" size="sm">
                          <Filter className="h-4 w-4 mr-1" />
                          Filter
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {products.map((product) => (
                        <Card key={product.id} className="hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => setSelectedProduct(product)}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Package className="h-5 w-5 text-blue-600" />
                                <h3 className="font-medium">{product.name}</h3>
                              </div>
                              <Badge className={getStatusColor(product.status)}>
                                {product.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Part Number:</span>
                                <span className="font-medium">{product.partNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Version:</span>
                                <span className="font-medium">v{product.version}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Category:</span>
                                <span className="font-medium">{product.category}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Progress:</span>
                                <span className="font-medium">{product.lifecycle.metrics.completionPercentage}%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="eco">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Engineering Change Orders</CardTitle>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="bg-gray-50 p-2 rounded text-center">
                          <div className="font-semibold">{ecoStats.total}</div>
                          <div className="text-gray-600">Total</div>
                        </div>
                        <div className="bg-yellow-50 p-2 rounded text-center">
                          <div className="font-semibold">{ecoStats.pending}</div>
                          <div className="text-gray-600">Pending</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded text-center">
                          <div className="font-semibold">{ecoStats.approved}</div>
                          <div className="text-gray-600">Approved</div>
                        </div>
                        <div className="bg-blue-50 p-2 rounded text-center">
                          <div className="font-semibold">{ecoStats.implemented}</div>
                          <div className="text-gray-600">Implemented</div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {changeOrders.map((eco) => (
                        <Card key={eco.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <h3 className="font-medium">{eco.title}</h3>
                                <p className="text-sm text-gray-600">{eco.id}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(eco.status as any)}>
                                  {eco.status.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className={
                                  eco.priority === 'critical' ? 'border-red-500 text-red-700' :
                                  eco.priority === 'high' ? 'border-orange-500 text-orange-700' :
                                  'border-gray-500 text-gray-700'
                                }>
                                  {eco.priority}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{eco.description}</p>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Initiator:</span>
                                <p className="font-medium">{eco.initiator}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Cost Impact:</span>
                                <p className="font-medium">${eco.cost.toLocaleString()}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Created:</span>
                                <p className="font-medium">{eco.createdAt}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Development Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        Analytics dashboard with charts and metrics coming soon...
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Cost Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        Cost breakdown and trends visualization...
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </TopbarDashboardLayout>
  );
};

export default PLM;
