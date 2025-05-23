
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
import { BlogPost, BlogStatus } from '@/types/blog';

const blogPostSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  excerpt: z.string().min(10, { message: "Excerpt must be at least 10 characters." }),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
  category: z.string().min(1, { message: "Category is required." }),
  status: z.enum(['draft', 'published'] as [BlogStatus, ...BlogStatus[]]).default('draft'),
  tags: z.string().optional(),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

interface CreateBlogPostFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreate: (newPost: BlogPost) => void;
}

const CreateBlogPostForm: React.FC<CreateBlogPostFormProps> = ({ isOpen, onClose, onPostCreate }) => {
  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      status: 'draft',
      tags: '',
    },
  });

  const onSubmit = (data: BlogPostFormData) => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      status: data.status,
      author: 'Current User',
      publishDate: new Date().toLocaleDateString(),
      views: 0,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : [],
    };
    onPostCreate(newPost);
    form.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Blog Post</DialogTitle>
          <DialogDescription>
            Create a new blog post. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter blog post title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="excerpt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Excerpt*</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Brief description of the post" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Write your blog post content here..." 
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Technology, Business" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="tag1, tag2, tag3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-6">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-odoo-primary hover:bg-odoo-primary/90 text-white">
                Create Post
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogPostForm;
