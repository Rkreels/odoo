
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ServiceProject } from '@/types/services';
import { Calendar, Users, DollarSign } from 'lucide-react';

interface ProjectCardProps {
  project: ServiceProject;
  onUpdate: (project: ServiceProject) => void;
}

const ProjectCard = ({ project, onUpdate }: ProjectCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = () => {
    const statuses: Array<ServiceProject['status']> = ['planning', 'in-progress', 'on-hold', 'completed'];
    const currentIndex = statuses.indexOf(project.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    onUpdate({
      ...project,
      status: nextStatus,
      progress: nextStatus === 'completed' ? 100 : project.progress
    });
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{project.name}</CardTitle>
          <Badge className={getStatusColor(project.status)}>
            {project.status.replace('-', ' ')}
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{project.client}</p>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 mb-4">{project.description}</p>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            ${project.budget.toLocaleString()}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            {project.teamMembers.length} team members
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-gray-600">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleStatusChange}
          className="w-full"
        >
          Update Status
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
