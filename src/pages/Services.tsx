
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Briefcase, Plus, Filter, Search, Users, Calendar, DollarSign, TrendingUp, Clock, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import VoiceTrainer from '@/components/voice/VoiceTrainer';
import ProjectCard from '@/components/services/ProjectCard';
import CreateProjectForm from '@/components/services/CreateProjectForm';
import { ServiceProject } from '@/types/services';
import { toast } from "@/components/ui/use-toast";

const Services = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const [activeTab, setActiveTab] = useState('projects');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProject, setSelectedProject] = useState<ServiceProject | null>(null);
  const [projects, setProjects] = useState<ServiceProject[]>([
    {
      id: '1',
      name: 'E-commerce Platform Redesign',
      client: 'Tech Corp',
      status: 'in-progress',
      startDate: '2025-01-15',
      endDate: '2025-03-15',
      budget: 45000,
      spent: 18000,
      description: 'Complete redesign of e-commerce platform with modern UI/UX, mobile optimization, and performance improvements',
      teamMembers: ['John Doe', 'Jane Smith', 'Mike Wilson'],
      progress: 65,
      projectManager: 'John Doe',
      priority: 'high',
      hoursLogged: 320,
      estimatedHours: 480,
      milestones: [
        { name: 'Design Phase', completed: true, dueDate: '2025-01-30' },
        { name: 'Development Phase', completed: false, dueDate: '2025-02-28' },
        { name: 'Testing & Launch', completed: false, dueDate: '2025-03-15' }
      ]
    },
    {
      id: '2',
      name: 'Mobile App Development',
      client: 'StartupXYZ',
      status: 'planning',
      startDate: '2025-02-01',
      endDate: '2025-06-01',
      budget: 75000,
      spent: 5000,
      description: 'Native mobile app for iOS and Android with real-time features, user authentication, and payment integration',
      teamMembers: ['Alice Johnson', 'Bob Wilson', 'Sarah Davis'],
      progress: 15,
      projectManager: 'Alice Johnson',
      priority: 'medium',
      hoursLogged: 45,
      estimatedHours: 600,
      milestones: [
        { name: 'Requirements Gathering', completed: true, dueDate: '2025-01-25' },
        { name: 'UI/UX Design', completed: false, dueDate: '2025-02-15' },
        { name: 'Development', completed: false, dueDate: '2025-05-15' },
        { name: 'Testing & Launch', completed: false, dueDate: '2025-06-01' }
      ]
    },
    {
      id: '3',
      name: 'ERP System Integration',
      client: 'Enterprise Ltd',
      status: 'completed',
      startDate: '2024-11-01',
      endDate: '2024-12-31',
      budget: 85000,
      spent: 82000,
      description: 'Integration of existing systems with new ERP solution, data migration, and staff training',
      teamMembers: ['Charlie Brown', 'Diana Prince', 'Robert Lee'],
      progress: 100,
      projectManager: 'Charlie Brown',
      priority: 'high',
      hoursLogged: 580,
      estimatedHours: 560,
      milestones: [
        { name: 'System Analysis', completed: true, dueDate: '2024-11-15' },
        { name: 'Data Migration', completed: true, dueDate: '2024-12-01' },
        { name: 'Integration & Testing', completed: true, dueDate: '2024-12-20' },
        { name: 'Training & Go-Live', completed: true, dueDate: '2024-12-31' }
      ]
    },
    {
      id: '4',
      name: 'Cloud Infrastructure Setup',
      client: 'FinTech Solutions',
      status: 'on-hold',
      startDate: '2025-01-20',
      endDate: '2025-04-20',
      budget: 60000,
      spent: 8000,
      description: 'Complete cloud infrastructure setup with AWS, including security, monitoring, and backup solutions',
      teamMembers: ['Tom Anderson', 'Lisa Chen'],
      progress: 20,
      projectManager: 'Tom Anderson',
      priority: 'low',
      hoursLogged: 65,
      estimatedHours: 400,
      milestones: [
        { name: 'Infrastructure Planning', completed: true, dueDate: '2025-01-30' },
        { name: 'AWS Setup', completed: false, dueDate: '2025-02-28' },
        { name: 'Security Implementation', completed: false, dueDate: '2025-03-30' },
        { name: 'Testing & Documentation', completed: false, dueDate: '2025-04-20' }
      ]
    },
    {
      id: '5',
      name: 'Digital Marketing Platform',
      client: 'Marketing Agency Plus',
      status: 'in-progress',
      startDate: '2024-12-15',
      endDate: '2025-02-28',
      budget: 55000,
      spent: 35000,
      description: 'Custom digital marketing platform with analytics, campaign management, and client reporting features',
      teamMembers: ['Emma Wilson', 'David Taylor', 'Jessica Brown'],
      progress: 80,
      projectManager: 'Emma Wilson',
      priority: 'high',
      hoursLogged: 420,
      estimatedHours: 450,
      milestones: [
        { name: 'Core Development', completed: true, dueDate: '2025-01-15' },
        { name: 'Analytics Integration', completed: true, dueDate: '2025-02-01' },
        { name: 'Testing & Optimization', completed: false, dueDate: '2025-02-20' },
        { name: 'Launch & Support', completed: false, dueDate: '2025-02-28' }
      ]
    }
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

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const projectFilters = [
    { label: 'All Projects', value: 'all', count: projects.length },
    { label: 'In Progress', value: 'in-progress', count: projects.filter(p => p.status === 'in-progress').length },
    { label: 'Planning', value: 'planning', count: projects.filter(p => p.status === 'planning').length },
    { label: 'Completed', value: 'completed', count: projects.filter(p => p.status === 'completed').length },
    { label: 'On Hold', value: 'on-hold', count: projects.filter(p => p.status === 'on-hold').length }
  ];

  const activeProjects = projects.filter(p => p.status !== 'completed');
  const completedProjects = projects.filter(p => p.status === 'completed');
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
  const totalHours = projects.reduce((sum, p) => sum + (p.hoursLogged || 0), 0);
  const avgProgress = projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0;

  const renderProjectsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Project</div>
        <div className="col-span-2">Client</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Progress</div>
        <div className="col-span-1">Budget</div>
        <div className="col-span-1">Spent</div>
        <div className="col-span-1">Team</div>
        <div className="col-span-1">Due Date</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredProjects.map(project => (
        <div key={project.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <p className="font-medium text-sm">{project.name}</p>
            <p className="text-xs text-gray-600 mt-1">{project.projectManager}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{project.client}</p>
          </div>
          <div className="col-span-1">
            <Badge variant={
              project.status === 'completed' ? 'default' : 
              project.status === 'in-progress' ? 'secondary' :
              project.status === 'on-hold' ? 'destructive' : 'outline'
            }>
              {project.status}
            </Badge>
          </div>
          <div className="col-span-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          </div>
          <div className="col-span-1">
            <p className="font-medium text-sm">${project.budget.toLocaleString()}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">${(project.spent || 0).toLocaleString()}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{project.teamMembers.length} members</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{project.endDate}</p>
          </div>
          <div className="col-span-1">
            <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Services">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'projects' ? 'Service Projects' : activeTab === 'analytics' ? 'Project Analytics' : 'Team Management'}
          subtitle={
            activeTab === 'projects' ? 'Manage and track service project delivery' :
            activeTab === 'analytics' ? 'Project performance and analytics' :
            'Team allocation and resource management'
          }
          searchPlaceholder="Search projects..."
          onSearch={setSearchTerm}
          onCreateNew={() => setShowCreateForm(true)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={projectFilters}
          selectedFilter={filterStatus}
          onFilterChange={setFilterStatus}
          recordCount={filteredProjects.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="projects" className="flex-1 flex flex-col">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Budget</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">${totalBudget.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">${totalSpent.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{totalHours}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{avgProgress}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {viewType === 'list' ? renderProjectsList() : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onUpdate={handleUpdateProject}
                    />
                  ))}
                </div>
              )}
              
              {filteredProjects.length === 0 && (
                <div className="text-center py-8">
                  <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No projects found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['in-progress', 'planning', 'completed', 'on-hold'].map(status => {
                      const statusProjects = projects.filter(p => p.status === status);
                      const percentage = projects.length > 0 ? Math.round((statusProjects.length / projects.length) * 100) : 0;
                      return (
                        <div key={status} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm capitalize">{status.replace('-', ' ')}</p>
                            <p className="text-xs text-gray-600">{statusProjects.length} projects</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{percentage}%</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget vs Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map(project => {
                      const spentPercentage = Math.round(((project.spent || 0) / project.budget) * 100);
                      return (
                        <div key={project.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{project.name}</span>
                            <span>${(project.spent || 0).toLocaleString()} / ${project.budget.toLocaleString()}</span>
                          </div>
                          <Progress value={spentPercentage} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Set(projects.flatMap(p => p.teamMembers))).map(member => {
                const memberProjects = projects.filter(p => p.teamMembers.includes(member));
                const activeProjects = memberProjects.filter(p => p.status === 'in-progress').length;
                const totalHours = memberProjects.reduce((sum, p) => sum + (p.hoursLogged || 0), 0);
                return (
                  <Card key={member}>
                    <CardHeader>
                      <CardTitle className="text-lg">{member}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Projects:</span>
                          <span className="font-medium">{memberProjects.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Active Projects:</span>
                          <span className="font-medium">{activeProjects}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Hours:</span>
                          <span className="font-medium">{totalHours}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateProjectForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onProjectCreate={handleCreateProject}
      />

      {/* Project Detail Modal */}
      {selectedProject && (
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedProject.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Client</label>
                  <p className="text-sm text-gray-600">{selectedProject.client}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="text-sm text-gray-600">{selectedProject.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Project Manager</label>
                  <p className="text-sm text-gray-600">{selectedProject.projectManager}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Team Members</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedProject.teamMembers.map(member => (
                      <Badge key={member} variant="outline">{member}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Budget</label>
                    <p className="text-sm text-gray-600">${selectedProject.budget.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Spent</label>
                    <p className="text-sm text-gray-600">${(selectedProject.spent || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Progress</label>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{selectedProject.progress}%</span>
                      </div>
                      <Progress value={selectedProject.progress} className="h-2" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Hours</label>
                    <p className="text-sm text-gray-600">{selectedProject.hoursLogged} / {selectedProject.estimatedHours}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Milestones</label>
                  <div className="space-y-2 mt-2">
                    {selectedProject.milestones?.map((milestone, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {milestone.completed ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <Clock className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm">{milestone.name}</span>
                        </div>
                        <span className="text-xs text-gray-600">{milestone.dueDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen="services"
        />
      )}
    </OdooMainLayout>
  );
};

export default Services;
