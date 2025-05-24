
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Opportunity, OpportunityStage } from '@/types/crm';

const opportunityFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  customer: z.string().min(1, 'Customer is required'),
  expectedRevenue: z.number().min(0, 'Revenue must be positive'),
  probability: z.number().min(0).max(100, 'Probability must be between 0-100'),
  stage: z.enum(['New', 'Qualified', 'Proposition', 'Won', 'Lost'] as [OpportunityStage, ...OpportunityStage[]]),
  expectedClosing: z.string().min(1, 'Expected closing date is required'),
  assignedTo: z.string().min(1, 'Assigned person is required'),
  description: z.string().optional(),
  tags: z.string().optional(),
});

type OpportunityFormData = z.infer<typeof opportunityFormSchema>;

interface CreateOpportunityFormProps {
  isOpen: boolean;
  onClose: () => void;
  onOpportunityCreate: (opportunity: Opportunity) => void;
}

const CreateOpportunityForm: React.FC<CreateOpportunityFormProps> = ({ 
  isOpen, 
  onClose, 
  onOpportunityCreate 
}) => {
  const form = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: {
      name: '',
      customer: '',
      expectedRevenue: 0,
      probability: 50,
      stage: 'New',
      expectedClosing: '',
      assignedTo: '',
      description: '',
      tags: '',
    },
  });

  const onSubmit = (data: OpportunityFormData) => {
    const newOpportunity: Opportunity = {
      id: Date.now().toString(),
      name: data.name,
      customer: data.customer,
      expectedRevenue: data.expectedRevenue,
      probability: data.probability,
      stage: data.stage,
      expectedClosing: data.expectedClosing,
      assignedTo: data.assignedTo,
      createdAt: new Date().toISOString(),
      lastActivity: 'Just created',
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      description: data.description,
    };

    onOpportunityCreate(newOpportunity);
    form.reset();
    onClose();
  };

  const stages: OpportunityStage[] = ['New', 'Qualified', 'Proposition', 'Won', 'Lost'];
  const assignees = ['Jane Doe', 'Mike Wilson', 'Sarah Johnson', 'Robert Davis'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Opportunity</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opportunity Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Website Project" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Acme Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expectedRevenue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Revenue</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="25000" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="probability"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Probability (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="50" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {stages.map(stage => (
                          <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedClosing"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Closing</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assigned To</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {assignees.map(assignee => (
                        <SelectItem key={assignee} value={assignee}>{assignee}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Opportunity description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Website, Design, Priority" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-odoo-primary hover:bg-odoo-primary/90 text-white">
                Create Opportunity
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOpportunityForm;
