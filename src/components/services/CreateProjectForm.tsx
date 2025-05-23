
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ServiceProject } from '@/types/services';

interface CreateProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreate: (project: ServiceProject) => void;
}

const CreateProjectForm = ({ isOpen, onClose, onProjectCreate }: CreateProjectFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    teamMembers: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newProject: ServiceProject = {
      id: Date.now().toString(),
      name: formData.name,
      client: formData.client,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: parseFloat(formData.budget),
      teamMembers: formData.teamMembers.split(',').map(member => member.trim()).filter(Boolean),
      status: 'planning',
      progress: 0,
    };

    onProjectCreate(newProject);
    onClose();
    setFormData({
      name: '',
      client: '',
      description: '',
      startDate: '',
      endDate: '',
      budget: '',
      teamMembers: '',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="client">Client</Label>
            <Input
              id="client"
              value={formData.client}
              onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="teamMembers">Team Members (comma separated)</Label>
            <Input
              id="teamMembers"
              value={formData.teamMembers}
              onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
              placeholder="John Doe, Jane Smith"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-odoo-primary hover:bg-odoo-primary/90">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectForm;
