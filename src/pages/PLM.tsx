
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Layers, 
  FileText, 
  GitBranch, 
  Users,
  Calendar,
  Settings,
  Download,
  Upload,
  Eye,
  Edit,
  Lock,
  Unlock
} from 'lucide-react';

interface PLMProduct {
  id: string;
  name: string;
  version: string;
  status: 'development' | 'review' | 'approved' | 'production' | 'obsolete';
  category: string;
  owner: string;
  createdDate: string;
  lastModified: string;
  description: string;
  documents: number;
  revisions: number;
  isLocked: boolean;
}

interface PLMDocument {
  id: string;
  name: string;
  type: 'drawing' | 'specification' | 'manual' | 'certificate' | 'other';
  version: string;
  status: 'draft' | 'review' | 'approved' | 'obsolete';
  productId: string;
  size: string;
  author: string;
  uploadDate: string;
  checkoutBy?: string;
}

interface PLMChangeRequest {
  id: string;
  title: string;
  type: 'design' | 'specification' | 'process' | 'documentation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'submitted' | 'review' | 'approved' | 'rejected' | 'implemented';
  requester: string;
  assignee: string;
  createdDate: string;
  dueDate: string;
  description: string;
  affectedProducts: string[];
}

const PLM = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [products] = useState<PLMProduct[]>([
    {
      id: '1',
      name: 'Smart Widget Pro',
      version: '2.1',
      status: 'production',
      category: 'Electronics',
      owner: 'John Designer',
      createdDate: '2024-01-15',
      lastModified: '2024-06-10',
      description: 'Advanced smart widget with IoT capabilities',
      documents: 15,
      revisions: 8,
      isLocked: false
    },
    {
      id: '2',
      name: 'Eco Motor V3',
      version: '3.0',
      status: 'review',
      category: 'Mechanical',
      owner: 'Sarah Engineer',
      createdDate: '2024-03-01',
      lastModified: '2024-06-11',
      description: 'Energy-efficient motor design',
      documents: 22,
      revisions: 12,
      isLocked: true
    }
  ]);

  const [documents] = useState<PLMDocument[]>([
    {
      id: '1',
      name: 'Assembly Drawing A001',
      type: 'drawing',
      version: '2.1',
      status: 'approved',
      productId: '1',
      size: '2.4 MB',
      author: 'CAD Designer',
      uploadDate: '2024-06-05',
      checkoutBy: undefined
    },
    {
      id: '2',
      name: 'Technical Specification',
      type: 'specification',
      version: '3.0',
      status: 'review',
      productId: '2',
      size: '1.2 MB',
      author: 'Technical Writer',
      uploadDate: '2024-06-08',
      checkoutBy: 'Sarah Engineer'
    }
  ]);

  const [changeRequests] = useState<PLMChangeRequest[]>([
    {
      id: '1',
      title: 'Update connector specification',
      type: 'specification',
      priority: 'high',
      status: 'review',
      requester: 'Quality Manager',
      assignee: 'John Designer',
      createdDate: '2024-06-08',
      dueDate: '2024-06-15',
      description: 'Update connector specification to meet new safety standards',
      affectedProducts: ['Smart Widget Pro']
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const productFilters = [
    { label: 'In Development', value: 'development', count: products.filter(p => p.status === 'development').length },
    { label: 'In Review', value: 'review', count: products.filter(p => p.status === 'review').length },
    { label: 'Production', value: 'production', count: products.filter(p => p.status === 'production').length }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || product.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const totalProducts = products.length;
  const inDevelopment = products.filter(p => p.status === 'development').length;
  const inProduction = products.filter(p => p.status === 'production').length;
  const pendingChanges = changeRequests.filter(c => c.status === 'submitted' || c.status === 'review').length;

  const renderProductsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Product</div>
        <div className="col-span-2">Version</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Owner</div>
        <div className="col-span-2">Documents</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredProducts.map(product => (
        <div key={product.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <Layers className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{product.name}</p>
                  {product.isLocked && <Lock className="h-4 w-4 text-red-500" />}
                </div>
                <p className="text-sm text-gray-500">{product.category}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <span className="font-medium">v{product.version}</span>
            <p className="text-sm text-gray-500">{product.revisions} revisions</p>
          </div>
          <div className="col-span-2">
            <Badge 
              variant={
                product.status === 'production' ? 'default' :
                product.status === 'approved' ? 'secondary' :
                product.status === 'review' ? 'outline' :
                'destructive'
              }
            >
              {product.status}
            </Badge>
          </div>
          <div className="col-span-2">
            <p className="font-medium">{product.owner}</p>
            <p className="text-sm text-gray-500">Modified: {product.lastModified}</p>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{product.documents}</span>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderDocumentsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-4">Document</div>
        <div className="col-span-2">Type</div>
        <div className="col-span-2">Version</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Actions</div>
      </div>
      
      {documents.map(document => (
        <div key={document.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium">{document.name}</p>
                <p className="text-sm text-gray-500">{document.size} • {document.author}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <Badge variant="outline">{document.type}</Badge>
          </div>
          <div className="col-span-2">
            <span className="font-medium">v{document.version}</span>
          </div>
          <div className="col-span-2">
            <div className="space-y-1">
              <Badge 
                variant={
                  document.status === 'approved' ? 'default' :
                  document.status === 'review' ? 'secondary' :
                  'outline'
                }
              >
                {document.status}
              </Badge>
              {document.checkoutBy && (
                <p className="text-xs text-orange-600">Checked out by {document.checkoutBy}</p>
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                {document.checkoutBy ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="PLM">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'products' ? 'Products' : activeTab === 'documents' ? 'Documents' : 'Change Requests'}
          subtitle={activeTab === 'products' ? 'Product lifecycle management' : activeTab === 'documents' ? 'Document management and version control' : 'Engineering change management'}
          searchPlaceholder={`Search ${activeTab}...`}
          onSearch={setSearchTerm}
          onCreateNew={() => console.log(`Create new ${activeTab.slice(0, -1)}`)}
          filters={activeTab === 'products' ? productFilters : []}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={activeTab === 'products' ? filteredProducts.length : activeTab === 'documents' ? documents.length : changeRequests.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="changes">Changes</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="products" className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Layers className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{totalProducts}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">In Development</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{inDevelopment}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">In Production</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{inProduction}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Pending Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{pendingChanges}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderProductsList()}
            </div>
          </TabsContent>

          <TabsContent value="documents" className="flex-1 p-6">
            {renderDocumentsList()}
          </TabsContent>

          <TabsContent value="changes" className="flex-1 p-6">
            <div className="text-center text-gray-500">
              Change request management coming soon...
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default PLM;
