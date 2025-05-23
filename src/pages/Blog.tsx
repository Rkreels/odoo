
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { FileText, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BlogPostCard from '@/components/blog/BlogPostCard';
import CreateBlogPostForm from '@/components/blog/CreateBlogPostForm';
import { BlogPost } from '@/types/blog';

const initialPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with OdooEcho',
    excerpt: 'Learn how to use OdooEcho for your business management needs.',
    content: 'Full content here...',
    category: 'Tutorial',
    status: 'published',
    author: 'Admin User',
    publishDate: '2024-01-15',
    views: 156,
    tags: ['tutorial', 'getting-started'],
  },
  {
    id: '2',
    title: 'Best Practices for CRM',
    excerpt: 'Optimize your customer relationship management with these tips.',
    content: 'Full content here...',
    category: 'Business',
    status: 'draft',
    author: 'Sales Manager',
    publishDate: '2024-01-10',
    views: 89,
    tags: ['crm', 'sales', 'tips'],
  },
];

const Blog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const handlePostCreate = (newPost: BlogPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleEditPost = (post: BlogPost) => {
    console.log('Edit post:', post);
    // Future: Implement edit functionality
  };

  const handleDeletePost = (id: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <TopbarDashboardLayout currentApp="Blog">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Blog Management</h1>
                <p className="text-odoo-gray">Create and manage your blog posts</p>
              </div>
            </div>
            <Button 
              className="bg-odoo-primary text-white hover:bg-odoo-primary/90"
              onClick={() => setIsCreatePostModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Post
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      <CreateBlogPostForm
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPostCreate={handlePostCreate}
      />
    </TopbarDashboardLayout>
  );
};

export default Blog;
