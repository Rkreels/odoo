
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { Briefcase, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VoiceTrainer from '@/components/voice/VoiceTrainer';
import ProjectCard from '@/components/services/ProjectCard';
import CreateProjectForm from '@/components/services/CreateProjectForm';
import { ServiceProject } from '@/types/services';
import { toast } from "@/components/ui/use-toast";

const Services = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const [projects, setProjects] = useState<ServiceProject[]>([
    {
      id: '1',
      name: 'Website Redesign',
      client: 'Tech Corp',
      status: 'in-progress',
      startDate: '2025-01-15',
      endDate: '2025-03-15',
      budget: 25000,
      description: 'Complete website redesign with modern UI/UX',
      teamMembers: ['John Doe', 'Jane Smith'],
      progress: 65,
    },
    {
      id: '2',
      name: 'Mobile App Development',
      client: 'StartupXYZ',
      status: 'planning',
      startDate: '2025-02-01',
      endDate: '2025-06-01',
      budget: 50000,
      description: 'Native mobile app for iOS and Android',
      teamMembers: ['Alice Johnson', 'Bob Wilson'],
      progress: 10,
    },
    {
      id: '3',
      name: 'System Integration',
      client: 'Enterprise Ltd',
      status: 'completed',
      startDate: '2024-11-01',
      endDate: '2024-12-31',
      budget: 35000,
      description: 'Integration of existing systems with new CRM',
      teamMembers: ['Charlie Brown', 'Diana Prince'],
      progress: 100,
    },
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handleCreateProject = (newProject: ServiceProject) => {
    setProjects([newProject, ...projects]);
    toast({
      title: "Project created",
      description: "New service project has been successfully created.",
    });
  };

  const handleUpdateProject = (updatedProject: ServiceProject) => {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
    toast({
      title: "Project updated",
      description: "Project has been successfully updated.",
    });
  };

  const activeProjects = projects.filter(p => p.status !== 'completed');
  const completedProjects = projects.filter(p => p.status === 'completed');

  return (
    <TopbarDashboardLayout currentApp="Services">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Briefcase className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Project Services</h1>
                <p className="text-odoo-gray">
                  Manage service projects, track progress, and deliver excellence to your clients.
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
              <Button 
                className="bg-odoo-primary text-white hover:bg-odoo-primary/90"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>

          <div className="flex items-center mb-6 space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="Search projects..."
                className="w-full pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">Active Projects</p>
              <p className="text-2xl font-semibold text-blue-700">{activeProjects.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600">Completed</p>
              <p className="text-2xl font-semibold text-green-700">{completedProjects.length}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-yellow-600">Total Revenue</p>
              <p className="text-2xl font-semibold text-yellow-700">
                ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
              </p>
            </div>
          </div>

          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Projects</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {activeProjects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onUpdate={handleUpdateProject}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {completedProjects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    onUpdate={handleUpdateProject}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreateProjectForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onProjectCreate={handleCreateProject}
      />

      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen="services"
        />
      )}
    </TopbarDashboardLayout>
  );
};

export default Services;
