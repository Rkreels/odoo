
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash, GripVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  probability: number;
}

interface ConfigurePipelineDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConfigurePipelineDialog: React.FC<ConfigurePipelineDialogProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const [stages, setStages] = useState<PipelineStage[]>([
    { id: 'new', name: 'New', color: 'bg-blue-500', probability: 10 },
    { id: 'qualified', name: 'Qualified', color: 'bg-purple-500', probability: 25 },
    { id: 'proposition', name: 'Proposition', color: 'bg-yellow-500', probability: 60 },
    { id: 'won', name: 'Won', color: 'bg-green-500', probability: 100 },
    { id: 'lost', name: 'Lost', color: 'bg-red-500', probability: 0 },
  ]);

  const [newStageName, setNewStageName] = useState('');

  const addStage = () => {
    if (newStageName.trim()) {
      const newStage: PipelineStage = {
        id: Date.now().toString(),
        name: newStageName.trim(),
        color: 'bg-gray-500',
        probability: 50,
      };
      setStages([...stages, newStage]);
      setNewStageName('');
    }
  };

  const removeStage = (stageId: string) => {
    setStages(stages.filter(stage => stage.id !== stageId));
  };

  const updateStage = (stageId: string, field: keyof PipelineStage, value: string | number) => {
    setStages(stages.map(stage => 
      stage.id === stageId ? { ...stage, [field]: value } : stage
    ));
  };

  const colorOptions = [
    'bg-blue-500', 'bg-purple-500', 'bg-yellow-500', 
    'bg-green-500', 'bg-red-500', 'bg-indigo-500', 
    'bg-pink-500', 'bg-orange-500'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configure Pipeline</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pipeline Stages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stages.map((stage, index) => (
                <div key={stage.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full ${stage.color}`}></div>
                    <span className="font-medium">{index + 1}.</span>
                  </div>
                  
                  <div className="flex-1">
                    <Input 
                      value={stage.name}
                      onChange={(e) => updateStage(stage.id, 'name', e.target.value)}
                      placeholder="Stage name"
                    />
                  </div>
                  
                  <div className="w-24">
                    <Input 
                      type="number"
                      min="0"
                      max="100"
                      value={stage.probability}
                      onChange={(e) => updateStage(stage.id, 'probability', Number(e.target.value))}
                      placeholder="Probability"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {colorOptions.map(color => (
                      <button
                        key={color}
                        className={`w-6 h-6 rounded-full ${color} ${stage.color === color ? 'ring-2 ring-gray-400' : ''}`}
                        onClick={() => updateStage(stage.id, 'color', color)}
                      />
                    ))}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeStage(stage.id)}
                    disabled={stages.length <= 2}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center space-x-2 p-3 border-2 border-dashed rounded-lg">
                <Input 
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  placeholder="New stage name"
                  onKeyPress={(e) => e.key === 'Enter' && addStage()}
                />
                <Button onClick={addStage} disabled={!newStageName.trim()}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Stage
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pipeline Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Pipeline Name</label>
                <Input defaultValue="Sales Pipeline" />
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked />
                <label className="text-sm">Set as default pipeline</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input type="checkbox" />
                <label className="text-sm">Auto-assign leads to first stage</label>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button className="bg-odoo-primary hover:bg-odoo-primary/90 text-white">
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigurePipelineDialog;
