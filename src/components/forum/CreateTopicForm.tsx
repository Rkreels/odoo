
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
  DialogDescription,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ForumTopic, ForumCategory } from '@/types/forum';

const topicSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  categoryId: z.string({ required_error: "Please select a category." }),
});

type TopicFormData = z.infer<typeof topicSchema>;

interface CreateTopicFormProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ForumCategory[];
  onTopicCreate: (newTopic: ForumTopic) => void;
}

const CreateTopicForm: React.FC<CreateTopicFormProps> = ({ 
  isOpen, 
  onClose, 
  categories, 
  onTopicCreate 
}) => {
  const form = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
    },
  });

  const onSubmit = (data: TopicFormData) => {
    const category = categories.find(cat => cat.id === data.categoryId);
    
    const newTopic: ForumTopic = {
      id: Date.now().toString(),
      title: data.title,
      description: data.description,
      author: 'Current User',
      createdAt: new Date().toLocaleDateString(),
      replies: 0,
      views: 0,
      category: category ? category.name : 'General',
      status: 'active',
    };
    
    onTopicCreate(newTopic);
    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Topic</DialogTitle>
          <DialogDescription>
            Start a new discussion thread in the community forum.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter topic title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter topic description" {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category*</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="bg-odoo-primary hover:bg-odoo-primary/90">
                Create Topic
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTopicForm;
