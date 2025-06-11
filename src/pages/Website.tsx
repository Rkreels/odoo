
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Globe, 
  Plus, 
  Edit,
  Eye,
  Settings,
  BarChart3,
  Users,
  MousePointer,
  TrendingUp,
  Search
} from 'lucide-react';

interface WebsitePage {
  id: string;
  title: string;
  url: string;
  status: 'published' | 'draft' | 'archived';
  views: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgTimeOnPage: string;
  lastModified: string;
  author: string;
  template: string;
  seoScore: number;
}

interface WebsiteAnalytics {
  totalPages: number;
  totalViews: number;
  uniqueVisitors: number;
  avgBounceRate: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number }>;
}

const Website = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pages');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [pages] = useState<WebsitePage[]>([
    {
      id: '1',
      title: 'Home Page',
      url: '/',
      status: 'published',
      views: 2500,
      uniqueVisitors: 1800,
      bounceRate: 35,
      avgTimeOnPage: '2:15',
      lastModified: '2024-06-10',
      author: 'Web Admin',
      template: 'homepage.html',
      seoScore: 92
    },
    {
      id: '2',
      title: 'About Us',
      url: '/about',
      status: 'published',
      views: 890,
      uniqueVisitors: 750,
      bounceRate: 28,
      avgTimeOnPage: '3:45',
      lastModified: '2024-06-08',
      author: 'Content Manager',
      template: 'page.html',
      seoScore: 88
    },
    {
      id: '3',
      title: 'Products',
      url: '/products',
      status: 'draft',
      views: 0,
      uniqueVisitors: 0,
      bounceRate: 0,
      avgTimeOnPage: '0:00',
      lastModified: '2024-06-11',
      author: 'Product Manager',
      template: 'catalog.html',
      seoScore: 65
    }
  ]);

  const [analytics] = useState<WebsiteAnalytics>({
    totalPages: 15,
    totalViews: 25430,
    uniqueVisitors: 18200,
    avgBounceRate: 32,
    conversionRate: 4.2,
    topPages: [
      { page: '/', views: 2500 },
      { page: '/products', views: 1200 },
      { page: '/about', views: 890 },
      { page: '/contact', views: 650 }
    ]
  });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const pageFilters = [
    { label: 'Published', value: 'published', count: pages.filter(p => p.status === 'published').length },
    { label: 'Draft', value: 'draft', count: pages.filter(p => p.status === 'draft').length },
    { label: 'High Traffic', value: 'high-traffic', count: pages.filter(p => p.views > 1000).length }
  ];

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'high-traffic' ? page.views > 1000 : page.status === selectedFilter);
    return matchesSearch && matchesFilter;
  });

  const renderPagesList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Page</div>
        <div className="col-span-2">URL</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-2">Views</div>
        <div className="col-span-2">SEO Score</div>
        <div className="col-span-2">Actions</div>
      </div>
      
      {filteredPages.map(page => (
        <div key={page.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <div>
              <p className="font-medium">{page.title}</p>
              <p className="text-sm text-gray-500">Modified: {page.lastModified}</p>
            </div>
          </div>
          <div className="col-span-2">
            <span className="text-sm text-blue-600">{page.url}</span>
          </div>
          <div className="col-span-1">
            <Badge 
              variant={page.status === 'published' ? 'default' : page.status === 'draft' ? 'secondary' : 'outline'}
            >
              {page.status}
            </Badge>
          </div>
          <div className="col-span-2">
            <div>
              <p className="font-medium">{page.views.toLocaleString()}</p>
              <p className="text-sm text-gray-500">{page.uniqueVisitors} unique</p>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${page.seoScore >= 90 ? 'bg-green-500' : page.seoScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              <span className="font-medium">{page.seoScore}/100</span>
            </div>
          </div>
          <div className="col-span-2">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Website">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title="Website Builder"
          subtitle="Create and manage your website content"
          searchPlaceholder="Search pages..."
          onSearch={setSearchTerm}
          onCreateNew={() => console.log('Create new page')}
          filters={pageFilters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={filteredPages.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pages" className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{analytics.totalPages}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Unique Visitors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{analytics.uniqueVisitors.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{analytics.conversionRate}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderPagesList()}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analytics.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{page.page}</span>
                        <span className="font-medium">{page.views.toLocaleString()} views</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Website Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Bounce Rate</span>
                      <span className="font-medium">{analytics.avgBounceRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Pages per Session</span>
                      <span className="font-medium">2.8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Average Session Duration</span>
                      <span className="font-medium">3:42</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-6">
            <div className="max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Website Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Website Name</label>
                    <input className="w-full mt-1 p-2 border rounded-md" defaultValue="My Business Website" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Domain</label>
                    <input className="w-full mt-1 p-2 border rounded-md" defaultValue="mybusiness.com" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Default Language</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <Button className="bg-odoo-primary hover:bg-odoo-primary/90">
                    Save Configuration
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default Website;
