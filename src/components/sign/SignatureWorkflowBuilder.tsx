
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { SignatureWorkflow, WorkflowStep, SignatureRecipient } from '@/types/sign';
import { 
  Workflow, Plus, Trash2, ArrowRight, Settings, 
  Users, Clock, CheckCircle, AlertCircle, Play
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface SignatureWorkflowBuilderProps {
  workflow: SignatureWorkflow;
  recipients: SignatureRecipient[];
  onUpdate: (workflow: SignatureWorkflow) => void;
}

const SignatureWorkflowBuilder = ({ workflow, recipients, onUpdate }: SignatureWorkflowBuilderProps) => {
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: Date.now().toString(),
      name: `Step ${workflow.steps.length + 1}`,
      order: workflow.steps.length + 1,
      recipientIds: [],
      requiresAll: true,
      timeout: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    };

    onUpdate({
      ...workflow,
      steps: [...workflow.steps, newStep]
    });
  };

  const updateStep = (stepId: string, updates: Partial<WorkflowStep>) => {
    onUpdate({
      ...workflow,
      steps: workflow.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    });
  };

  const removeStep = (stepId: string) => {
    onUpdate({
      ...workflow,
      steps: workflow.steps.filter(step => step.id !== stepId)
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(workflow.steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order property
    const updatedSteps = items.map((step, index) => ({
      ...step,
      order: index + 1
    }));

    onUpdate({
      ...workflow,
      steps: updatedSteps
    });
  };

  const getStepStatus = (step: WorkflowStep) => {
    if (step.recipientIds.length === 0) return 'incomplete';
    return 'ready';
  };

  const getStepIcon = (step: WorkflowStep) => {
    const status = getStepStatus(step);
    switch (status) {
      case 'incomplete':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Workflow className="h-5 w-5 text-blue-600" />
          Signature Workflow
        </CardTitle>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={workflow.isSequential}
              onChange={(e) => onUpdate({
                ...workflow,
                isSequential: e.target.checked
              })}
            />
            <label className="text-sm">Sequential signing required</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={workflow.settings.allowParallelSigning}
              onChange={(e) => onUpdate({
                ...workflow,
                settings: {
                  ...workflow.settings,
                  allowParallelSigning: e.target.checked
                }
              })}
            />
            <label className="text-sm">Allow parallel signing</label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Workflow Steps</h3>
            <Button onClick={addStep} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Step
            </Button>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="workflow-steps">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                  {workflow.steps.map((step, index) => (
                    <Draggable key={step.id} draggableId={step.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`border rounded-lg p-4 ${
                            activeStep === step.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {getStepIcon(step)}
                                <span className="font-medium">Step {step.order}</span>
                              </div>
                              <Input
                                value={step.name}
                                onChange={(e) => updateStep(step.id, { name: e.target.value })}
                                className="w-48"
                                placeholder="Step name"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                              >
                                <Settings className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeStep(step.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="text-sm font-medium">Recipients</label>
                              <Select 
                                value={step.recipientIds[0] || ''}
                                onValueChange={(value) => updateStep(step.id, { 
                                  recipientIds: value ? [value] : [] 
                                })}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select recipients" />
                                </SelectTrigger>
                                <SelectContent>
                                  {recipients.map(recipient => (
                                    <SelectItem key={recipient.id} value={recipient.id}>
                                      {recipient.name} ({recipient.role})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Timeout (days)</label>
                              <Input
                                type="number"
                                value={Math.floor((step.timeout || 0) / (24 * 60 * 60 * 1000))}
                                onChange={(e) => updateStep(step.id, { 
                                  timeout: parseInt(e.target.value) * 24 * 60 * 60 * 1000 
                                })}
                                min="1"
                                max="365"
                              />
                            </div>
                          </div>

                          {activeStep === step.id && (
                            <div className="border-t pt-3 mt-3 space-y-3">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  checked={step.requiresAll}
                                  onChange={(e) => updateStep(step.id, { requiresAll: e.target.checked })}
                                />
                                <label className="text-sm">Require all recipients to complete</label>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium">Selected Recipients</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {step.recipientIds.map(recipientId => {
                                    const recipient = recipients.find(r => r.id === recipientId);
                                    return recipient ? (
                                      <Badge key={recipientId} variant="outline">
                                        <Users className="h-3 w-3 mr-1" />
                                        {recipient.name}
                                      </Badge>
                                    ) : null;
                                  })}
                                </div>
                              </div>
                            </div>
                          )}

                          {index < workflow.steps.length - 1 && (
                            <div className="flex justify-center mt-4">
                              <ArrowRight className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {workflow.steps.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Play className="h-4 w-4 text-green-600" />
                <span className="font-medium">Workflow Summary</span>
              </div>
              <div className="text-sm text-gray-600">
                <p>Total steps: {workflow.steps.length}</p>
                <p>Signing mode: {workflow.isSequential ? 'Sequential' : 'Parallel'}</p>
                <p>Estimated completion time: {Math.max(...workflow.steps.map(s => Math.floor((s.timeout || 0) / (24 * 60 * 60 * 1000))))} days</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureWorkflowBuilder;
