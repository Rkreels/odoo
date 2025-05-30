
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { MaintenanceRequest, MaintenanceType, Priority } from '@/types/maintenance';
import { generateId } from '@/lib/localStorageUtils';

interface CreateMaintenanceRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestCreate: (request: MaintenanceRequest) => void;
  equipment: Array<{id: string; name: string; type: string}>;
}

const CreateMaintenanceRequestForm = ({ isOpen, onClose, onRequestCreate, equipment }: CreateMaintenanceRequestFormProps) => {
  const [formData, setFormData] = useState({
    equipmentId: '',
    type: 'Preventive' as MaintenanceType,
    priority: 'Medium' as Priority,
    title: '',
    description: '',
    requestedBy: '',
    assignedTo: '',
    scheduledDate: '',
    estimatedDuration: '',
    estimatedCost: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);
    if (!selectedEquipment) return;

    const newRequest: MaintenanceRequest = {
      id: `MR${generateId()}`,
      equipmentId: formData.equipmentId,
      equipmentName: selectedEquipment.name,
      type: formData.type,
      status: 'Scheduled',
      priority: formData.priority,
      title: formData.title,
      description: formData.description,
      requestedBy: formData.requestedBy,
      assignedTo: formData.assignedTo || undefined,
      scheduledDate: formData.scheduledDate,
      estimatedDuration: parseFloat(formData.estimatedDuration),
      estimatedCost: parseFloat(formData.estimatedCost),
      createdAt: new Date().toISOString().split('T')[0],
    };

    onRequestCreate(newRequest);
    setFormData({
      equipmentId: '',
      type: 'Preventive',
      priority: 'Medium',
      title: '',
      description: '',
      requestedBy: '',
      assignedTo: '',
      scheduledDate: '',
      estimatedDuration: '',
      estimatedCost: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Maintenance Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="equipment">Equipment</Label>
              <Select value={formData.equipmentId} onValueChange={(value) => setFormData({...formData, equipmentId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select equipment" />
                </SelectTrigger>
                <SelectContent>
                  {equipment.map((eq) => (
                    <SelectItem key={eq.id} value={eq.id}>{eq.name} ({eq.type})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Maintenance Type</Label>
              <Select value={formData.type} onValueChange={(value: MaintenanceType) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Preventive">Preventive</SelectItem>
                  <SelectItem value="Corrective">Corrective</SelectItem>
                  <SelectItem value="Predictive">Predictive</SelectItem>
                  <SelectItem value="Emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Brief description of maintenance work"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Detailed description of the maintenance work required"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: Priority) => setFormData({...formData, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="requestedBy">Requested By</Label>
              <Input
                id="requestedBy"
                value={formData.requestedBy}
                onChange={(e) => setFormData({...formData, requestedBy: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="estimatedDuration">Estimated Duration (hours)</Label>
              <Input
                id="estimatedDuration"
                type="number"
                step="0.5"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({...formData, estimatedDuration: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
              <Input
                id="estimatedCost"
                type="number"
                step="0.01"
                value={formData.estimatedCost}
                onChange={(e) => setFormData({...formData, estimatedCost: e.target.value})}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMaintenanceRequestForm;
