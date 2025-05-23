
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WebsitePage, PageTemplate } from '@/types/website';

interface CreatePageFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPageCreate: (page: WebsitePage) => void;
}

const CreatePageForm = ({ isOpen, onClose, onPageCreate }: CreatePageFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    template: 'standard' as PageTemplate,
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPage: WebsitePage = {
      id: Date.now().toString(),
      title: formData.title,
      slug: formData.slug,
      template: formData.template,
      status: 'draft',
      createdAt: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      views: 0,
      isHomepage: false,
    };

    onPageCreate(newPage);
    onClose();
    setFormData({
      title: '',
      slug: '',
      template: 'standard',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Page</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="template">Template</Label>
            <Select 
              value={formData.template} 
              onValueChange={(value: PageTemplate) => setFormData({ ...formData, template: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard Page</SelectItem>
                <SelectItem value="homepage">Homepage</SelectItem>
                <SelectItem value="contact">Contact Page</SelectItem>
                <SelectItem value="product">Product Page</SelectItem>
                <SelectItem value="blog">Blog Page</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-odoo-primary hover:bg-odoo-primary/90">
              Create Page
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePageForm;
