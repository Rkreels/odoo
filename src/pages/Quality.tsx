
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText,
  BarChart3,
  Clock,
  User,
  Package,
  TrendingUp,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface QualityCheck {
  id: string;
  checkNumber: string;
  product: string;
  batch: string;
  inspector: string;
  checkDate: string;
  status: 'passed' | 'failed' | 'pending' | 'conditional';
  checkType: 'incoming' | 'in_process' | 'final' | 'random';
  defectsFound: number;
  sampleSize: number;
  notes?: string;
  location: string;
  testResults: Array<{
    parameter: string;
    specification: string;
    actual: string;
    status: 'pass' | 'fail' | 'warning';
  }>;
}

interface QualityAlert {
  id: string;
  title: string;
  type: 'nonconformance' | 'customer_complaint' | 'supplier_issue' | 'process_deviation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  reportedBy: string;
  assignedTo: string;
  createdDate: string;
  dueDate: string;
  description: string;
  affectedProducts: string[];
  rootCause?: string;
  correctedActions: string[];
}

const Quality = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('checks');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [checks] = useState<QualityCheck[]>([
    {
      id: '1',
      checkNumber: 'QC-001',
      product: 'Smart Widget Pro',
      batch: 'SW-2024-001',
      inspector: 'Quality Inspector A',
      checkDate: '2024-06-11',
      status: 'passed',
      checkType: 'final',
      defectsFound: 0,
      sampleSize: 50,
      location: 'Final Inspection',
      testResults: [
        { parameter: 'Dimensions', specification: '100±2mm', actual: '101mm', status: 'pass' },
        { parameter: 'Weight', specification: '500±10g', actual: '498g', status: 'pass' },
        { parameter: 'Voltage', specification: '12±0.5V', actual: '12.2V', status: 'pass' }
      ]
    },
    {
      id: '2',
      checkNumber: 'QC-002',
      product: 'Eco Motor V3',
      batch: 'EM-2024-015',
      inspector: 'Quality Inspector B',
      checkDate: '2024-06-10',
      status: 'failed',
      checkType: 'in_process',
      defectsFound: 3,
      sampleSize: 25,
      location: 'Assembly Line 2',
      notes: 'Motor shaft alignment issues detected',
      testResults: [
        { parameter: 'Torque', specification: '50±5Nm', actual: '42Nm', status: 'fail' },
        { parameter: 'RPM', specification: '1800±50', actual: '1780', status: 'pass' },
        { parameter: 'Noise Level', specification: '<60dB', actual: '65dB', status: 'fail' }
      ]
    }
  ]);

  const [alerts] = useState<QualityAlert[]>([
    {
      id: '1',
      title: 'Motor shaft alignment nonconformance',
      type: 'nonconformance',
      severity: 'high',
      status: 'investigating',
      reportedBy: 'Quality Inspector B',
      assignedTo: 'Production Manager',
      createdDate: '2024-06-10',
      dueDate: '2024-06-17',
      description: 'Multiple units showing shaft alignment issues in Batch EM-2024-015',
      affectedProducts: ['Eco Motor V3'],
      correctedActions: ['Stop production', 'Review assembly process', 'Retrain operators']
    },
    {
      id: '2',
      title: 'Customer complaint - Widget functionality',
      type: 'customer_complaint',
      severity: 'medium',
      status: 'open',
      reportedBy: 'Customer Service',
      assignedTo: 'Quality Manager',
      createdDate: '2024-06-09',
      dueDate: '2024-06-16',
      description: 'Customer reports intermittent functionality issues with Smart Widget Pro',
      affectedProducts: ['Smart Widget Pro'],
      correctedActions: ['Investigate field returns', 'Review test procedures']
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const checkFilters = [
    { label: 'Passed', value: 'passed', count: checks.filter(c => c.status === 'passed').length },
    { label: 'Failed', value: 'failed', count: checks.filter(c => c.status === 'failed').length },
    { label: 'Pending', value: 'pending', count: checks.filter(c => c.status === 'pending').length },
    { label: 'Final Inspection', value: 'final', count: checks.filter(c => c.checkType === 'final').length }
  ];

  const alertFilters = [
    { label: 'Open', value: 'open', count: alerts.filter(a => a.status === 'open').length },
    { label: 'Investigating', value: 'investigating', count: alerts.filter(a => a.status === 'investigating').length },
    { label: 'High Severity', value: 'high', count: alerts.filter(a => a.severity === 'high').length },
    { label: 'Critical', value: 'critical', count: alerts.filter(a => a.severity === 'critical').length }
  ];

  const filteredChecks = checks.filter(check => {
    const matchesSearch = check.checkNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.batch.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         check.status === selectedFilter || 
                         check.checkType === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredAlerts = alerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         alert.status === selectedFilter || 
                         alert.severity === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const passRate = (checks.filter(c => c.status === 'passed').length / checks.length) * 100;
  const openAlerts = alerts.filter(a => a.status === 'open' || a.status === 'investigating').length;
  const totalDefects = checks.reduce((sum, check) => sum + check.defectsFound, 0);
  const avgProcessingTime = 2.5; // days

  const renderChecksList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-2">Check #</div>
        <div className="col-span-3">Product & Batch</div>
        <div className="col-span-2">Inspector</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredChecks.map(check => (
        <div key={check.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-2">
            <div>
              <p className="font-medium">{check.checkNumber}</p>
              <p className="text-sm text-gray-500">{check.checkDate}</p>
            </div>
          </div>
          <div className="col-span-3">
            <div>
              <p className="font-medium">{check.product}</p>
              <p className="text-sm text-gray-500">Batch: {check.batch}</p>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{check.inspector}</span>
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <Badge variant="outline">{check.checkType}</Badge>
              <p className="text-xs text-gray-500 mt-1">{check.sampleSize} samples</p>
            </div>
          </div>
          <div className="col-span-2">
            <div className="space-y-1">
              <Badge 
                variant={
                  check.status === 'passed' ? 'default' :
                  check.status === 'failed' ? 'destructive' :
                  check.status === 'conditional' ? 'secondary' : 'outline'
                }
              >
                {check.status === 'passed' && <CheckCircle className="h-3 w-3 mr-1" />}
                {check.status === 'failed' && <XCircle className="h-3 w-3 mr-1" />}
                {check.status === 'conditional' && <AlertTriangle className="h-3 w-3 mr-1" />}
                {check.status}
              </Badge>
              {check.defectsFound > 0 && (
                <p className="text-xs text-red-600">{check.defectsFound} defects</p>
              )}
            </div>
          </div>
          <div className="col-span-1">
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAlertsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-4">Alert</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Severity</div>
        <div className="col-span-2">Assigned To</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredAlerts.map(alert => (
        <div key={alert.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                alert.severity === 'critical' ? 'bg-red-100' :
                alert.severity === 'high' ? 'bg-orange-100' :
                alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                <AlertTriangle className={`h-4 w-4 ${
                  alert.severity === 'critical' ? 'text-red-600' :
                  alert.severity === 'high' ? 'text-orange-600' :
                  alert.severity === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <p className="font-medium">{alert.title}</p>
                <p className="text-sm text-gray-500">Due: {alert.dueDate}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <Badge variant="outline">{alert.type.replace('_', ' ')}</Badge>
          </div>
          <div className="col-span-2">
            <Badge 
              variant={
                alert.severity === 'critical' ? 'destructive' :
                alert.severity === 'high' ? 'secondary' :
                'outline'
              }
            >
              {alert.severity}
            </Badge>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{alert.assignedTo}</span>
            </div>
          </div>
          <div className="col-span-1">
            <Badge 
              variant={
                alert.status === 'resolved' ? 'default' :
                alert.status === 'investigating' ? 'secondary' : 'outline'
              }
            >
              {alert.status}
            </Badge>
          </div>
          <div className="col-span-1">
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Quality">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'checks' ? 'Quality Checks' : activeTab === 'alerts' ? 'Quality Alerts' : 'Control Plans'}
          subtitle={activeTab === 'checks' ? 'Quality control and inspection results' : activeTab === 'alerts' ? 'Nonconformances and quality issues' : 'Quality control plans and procedures'}
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          filters={activeTab === 'checks' ? checkFilters : alertFilters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'checks' ? filteredChecks.length : filteredAlerts.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="checks">Quality Checks</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="plans">Control Plans</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="checks" className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pass Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{passRate.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Open Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{openAlerts}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Defects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="text-2xl font-bold">{totalDefects}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Processing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{avgProcessingTime}d</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderChecksList()}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="flex-1 p-6">
            {renderAlertsList()}
          </TabsContent>

          <TabsContent value="plans" className="flex-1 p-6">
            <div className="space-y-6">
              {/* Control Plans Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Quality Control Plans</h3>
                <Button onClick={() => {
                  toast({
                    title: "Create Control Plan",
                    description: "Opening quality control plan creation form.",
                  });
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Control Plan
                </Button>
              </div>

              {/* Control Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    name: 'Incoming Material Inspection',
                    description: 'Quality checks for all incoming raw materials',
                    checkpoints: 12,
                    products: ['All Products'],
                    status: 'active'
                  },
                  {
                    name: 'Assembly Line QC',
                    description: 'In-process quality control for assembly operations',
                    checkpoints: 8,
                    products: ['Smart Widget Pro', 'Eco Motor V3'],
                    status: 'active'
                  },
                  {
                    name: 'Final Product Testing',
                    description: 'Comprehensive testing before shipment',
                    checkpoints: 15,
                    products: ['Smart Widget Pro'],
                    status: 'draft'
                  }
                ].map((plan, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{plan.name}</CardTitle>
                        <Badge variant={plan.status === 'active' ? 'default' : 'secondary'}>
                          {plan.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Checkpoints:</span>
                          <span className="font-medium">{plan.checkpoints}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Products:</span>
                          <div className="mt-1">
                            {plan.products.map(product => (
                              <Badge key={product} variant="outline" className="text-xs mr-1">
                                {product}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" className="flex-1">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Create Control Plan Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Create Quality Control Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="plan-name">Plan Name</Label>
                      <Input placeholder="Enter control plan name" />
                    </div>
                    <div>
                      <Label htmlFor="plan-type">Plan Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select plan type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="incoming">Incoming Inspection</SelectItem>
                          <SelectItem value="in-process">In-Process Control</SelectItem>
                          <SelectItem value="final">Final Inspection</SelectItem>
                          <SelectItem value="audit">Quality Audit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="products">Applicable Products</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select products" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Products</SelectItem>
                          <SelectItem value="smart-widget">Smart Widget Pro</SelectItem>
                          <SelectItem value="eco-motor">Eco Motor V3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="frequency">Inspection Frequency</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="every-batch">Every Batch</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="random">Random Sampling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="description">Description</Label>
                    <Textarea placeholder="Detailed description of the quality control plan..." />
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="checkpoints">Quality Checkpoints</Label>
                    <div className="border rounded p-4 mt-2">
                      <div className="space-y-2">
                        {[
                          'Visual inspection for defects',
                          'Dimensional measurements',
                          'Functional testing',
                          'Safety compliance check'
                        ].map((checkpoint, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input type="checkbox" defaultChecked className="rounded" />
                            <span className="text-sm">{checkpoint}</span>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="mt-3">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Checkpoint
                      </Button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button onClick={() => {
                      toast({
                        title: "Control Plan Created",
                        description: "Quality control plan has been created successfully.",
                      });
                    }}>
                      <Shield className="h-4 w-4 mr-2" />
                      Create Control Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Standards and Procedures */}
              <Card>
                <CardHeader>
                  <CardTitle>Quality Standards & Procedures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { name: 'ISO 9001:2015', type: 'Quality Management', status: 'Compliant' },
                      { name: 'ISO 14001:2015', type: 'Environmental', status: 'Compliant' },
                      { name: 'OHSAS 18001', type: 'Safety', status: 'In Progress' },
                      { name: 'Six Sigma', type: 'Process Improvement', status: 'Implemented' }
                    ].map((standard, index) => (
                      <div key={index} className="border rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">{standard.name}</h4>
                          <Badge variant={standard.status === 'Compliant' ? 'default' : 'secondary'}>
                            {standard.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{standard.type}</p>
                        <Button variant="outline" size="sm" className="mt-2">
                          View Details
                        </Button>
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

export default Quality;
