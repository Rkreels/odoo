
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { QualityCheck, QualityCheckType, Priority } from '@/types/quality';
import { generateId } from '@/lib/localStorageUtils';

interface CreateQualityCheckFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckCreate: (check: QualityCheck) => void;
  controlPoints: Array<{id: string; name: string; type: QualityCheckType}>;
}

const CreateQualityCheckForm = ({ isOpen, onClose, onCheckCreate, controlPoints }: CreateQualityCheckFormProps) => {
  const [formData, setFormData] = useState({
    controlPointId: '',
    productName: '',
    batchNumber: '',
    priority: 'Medium' as Priority,
    assignedTo: '',
    scheduledDate: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedControlPoint = controlPoints.find(cp => cp.id === formData.controlPointId);
    if (!selectedControlPoint) return;

    const newCheck: QualityCheck = {
      id: `QC${generateId()}`,
      controlPointId: formData.controlPointId,
      controlPointName: selectedControlPoint.name,
      productName: formData.productName,
      batchNumber: formData.batchNumber || undefined,
      status: 'Pending',
      priority: formData.priority,
      assignedTo: formData.assignedTo,
      createdAt: new Date().toISOString().split('T')[0],
      scheduledDate: formData.scheduledDate,
      notes: formData.notes || undefined,
    };

    onCheckCreate(newCheck);
    setFormData({
      controlPointId: '',
      productName: '',
      batchNumber: '',
      priority: 'Medium',
      assignedTo: '',
      scheduledDate: '',
      notes: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Quality Check</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="controlPoint">Control Point</Label>
            <Select value={formData.controlPointId} onValueChange={(value) => setFormData({...formData, controlPointId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select control point" />
              </SelectTrigger>
              <SelectContent>
                {controlPoints.map((cp) => (
                  <SelectItem key={cp.id} value={cp.id}>{cp.name} ({cp.type})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => setFormData({...formData, productName: e.target.value})}
              required
            />
          </div>

          <div>
            <Label htmlFor="batchNumber">Batch Number (Optional)</Label>
            <Input
              id="batchNumber"
              value={formData.batchNumber}
              onChange={(e) => setFormData({...formData, batchNumber: e.target.value})}
            />
          </div>

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
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
              required
            />
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

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Create Check</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateQualityCheckForm;
