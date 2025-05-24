
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

interface EditOpportunityFormProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  onOpportunityUpdate: (opportunity: Opportunity) => void;
}

const EditOpportunityForm: React.FC<EditOpportunityFormProps> = ({ 
  isOpen, 
  onClose, 
  opportunity,
  onOpportunityUpdate 
}) => {
  const form = useForm<OpportunityFormData>({
    resolver: zodResolver(opportunityFormSchema),
    defaultValues: {
      name: opportunity.name,
      customer: opportunity.customer,
      expectedRevenue: opportunity.expectedRevenue,
      probability: opportunity.probability,
      stage: opportunity.stage,
      expectedClosing: opportunity.expectedClosing,
      assignedTo: opportunity.assignedTo,
      description: opportunity.description || '',
      tags: opportunity.tags?.join(', ') || '',
    },
  });

  const onSubmit = (data: OpportunityFormData) => {
    const updatedOpportunity: Opportunity = {
      ...opportunity,
      name: data.name,
      customer: data.customer,
      expectedRevenue: data.expectedRevenue,
      probability: data.probability,
      stage: data.stage,
      expectedClosing: data.expectedClosing,
      assignedTo: data.assignedTo,
      lastActivity: 'Just updated',
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
      description: data.description,
    };

    onOpportunityUpdate(updatedOpportunity);
    onClose();
  };

  const stages: OpportunityStage[] = ['New', 'Qualified', 'Proposition', 'Won', 'Lost'];
  const assignees = ['Jane Doe', 'Mike Wilson', 'Sarah Johnson', 'Robert Davis'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Opportunity</DialogTitle>
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
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
                    <Textarea {...field} />
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
                    <Input {...field} />
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
                Update Opportunity
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditOpportunityForm;
