
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Globe, Plus, Eye, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VoiceTrainer from '@/components/voice/VoiceTrainer';
import PageCard from '@/components/website/PageCard';
import CreatePageForm from '@/components/website/CreatePageForm';
import { WebsitePage } from '@/types/website';
import { toast } from "@/components/ui/use-toast";

const Website = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const [pages, setPages] = useState<WebsitePage[]>([
    {
      id: '1',
      title: 'Home',
      slug: 'home',
      status: 'published',
      template: 'homepage',
      createdAt: '2025-01-01',
      lastModified: '2025-01-20',
      views: 1250,
      isHomepage: true,
    },
    {
      id: '2',
      title: 'About Us',
      slug: 'about',
      status: 'published',
      template: 'standard',
      createdAt: '2025-01-02',
      lastModified: '2025-01-18',
      views: 856,
      isHomepage: false,
    },
    {
      id: '3',
      title: 'Contact',
      slug: 'contact',
      status: 'draft',
      template: 'contact',
      createdAt: '2025-01-15',
      lastModified: '2025-01-22',
      views: 0,
      isHomepage: false,
    },
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleCreatePage = (newPage: WebsitePage) => {
    setPages([newPage, ...pages]);
    toast({
      title: "Page created",
      description: "New website page has been successfully created.",
    });
  };

  const handleUpdatePage = (updatedPage: WebsitePage) => {
    setPages(pages.map(p => p.id === updatedPage.id ? updatedPage : p));
    toast({
      title: "Page updated",
      description: "Page has been successfully updated.",
    });
  };

  const handleDeletePage = (pageId: string) => {
    setPages(pages.filter(p => p.id !== pageId));
    toast({
      title: "Page deleted",
      description: "Page has been successfully deleted.",
    });
  };

  const publishedPages = pages.filter(p => p.status === 'published');
  const draftPages = pages.filter(p => p.status === 'draft');

  return (
    <TopbarDashboardLayout currentApp="Website">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Globe className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Website Builder</h1>
                <p className="text-odoo-gray">
                  Create and manage your website pages with our drag & drop builder.
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
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview Site
              </Button>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Site Settings
              </Button>
              <Button 
                className="bg-odoo-primary text-white hover:bg-odoo-primary/90"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Page
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Total Pages</p>
              <p className="text-2xl font-semibold text-blue-700">{pages.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Published</p>
              <p className="text-2xl font-semibold text-green-700">{publishedPages.length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Drafts</p>
              <p className="text-2xl font-semibold text-yellow-700">{draftPages.length}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600">Total Views</p>
              <p className="text-2xl font-semibold text-purple-700">
                {pages.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
              </p>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Pages</TabsTrigger>
              <TabsTrigger value="published">Published</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {pages.map(page => (
                  <PageCard 
                    key={page.id} 
                    page={page} 
                    onUpdate={handleUpdatePage}
                    onDelete={handleDeletePage}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="published">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {publishedPages.map(page => (
                  <PageCard 
                    key={page.id} 
                    page={page} 
                    onUpdate={handleUpdatePage}
                    onDelete={handleDeletePage}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="drafts">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {draftPages.map(page => (
                  <PageCard 
                    key={page.id} 
                    page={page} 
                    onUpdate={handleUpdatePage}
                    onDelete={handleDeletePage}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreatePageForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onPageCreate={handleCreatePage}
      />

      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen="website"
        />
      )}
    </TopbarDashboardLayout>
  );
};

export default Website;
