
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { FileText, Plus, Search, Filter, Eye, Users, Calendar, TrendingUp, Edit, Share, Trash, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import BlogPostCard from '@/components/blog/BlogPostCard';
import CreateBlogPostForm from '@/components/blog/CreateBlogPostForm';
import { BlogPost } from '@/types/blog';

const initialPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Getting Started with BOS',
    excerpt: 'Learn how to use BOS for your business management needs.',
    content: 'This comprehensive guide will walk you through the initial setup and configuration of BOS. You will learn about the main modules, user interface, and best practices for implementation.',
    category: 'Tutorial',
    status: 'published',
    author: 'Admin User',
    publishDate: '2024-01-15',
    views: 1567,
    tags: ['tutorial', 'getting-started', 'setup'],
    comments: 23,
    likes: 89,
    shares: 12
  },
  {
    id: '2',
    title: 'Best Practices for CRM Implementation',
    excerpt: 'Optimize your customer relationship management with these expert tips.',
    content: 'Discover proven strategies for implementing CRM systems effectively. This article covers data migration, user training, workflow automation, and performance monitoring.',
    category: 'Business',
    status: 'published',
    author: 'Sales Manager',
    publishDate: '2024-01-20',
    views: 2341,
    tags: ['crm', 'sales', 'tips', 'implementation'],
    comments: 45,
    likes: 156,
    shares: 28
  },
  {
    id: '3',
    title: 'Advanced Inventory Management Techniques',
    excerpt: 'Master inventory optimization with advanced forecasting and automation.',
    content: 'Learn about ABC analysis, demand forecasting, automatic reordering, and warehouse optimization strategies that can reduce costs and improve efficiency.',
    category: 'Operations',
    status: 'draft',
    author: 'Operations Director',
    publishDate: '2024-01-25',
    views: 234,
    tags: ['inventory', 'automation', 'forecasting'],
    comments: 7,
    likes: 34,
    shares: 5
  },
  {
    id: '4',
    title: 'Financial Reporting Best Practices',
    excerpt: 'Create accurate and insightful financial reports for better decision making.',
    content: 'This guide covers chart of accounts setup, automated reporting, KPI tracking, and compliance requirements for various industries.',
    category: 'Finance',
    status: 'published',
    author: 'CFO',
    publishDate: '2024-01-18',
    views: 1876,
    tags: ['finance', 'reporting', 'compliance'],
    comments: 32,
    likes: 127,
    shares: 19
  },
  {
    id: '5',
    title: 'HR Digital Transformation Guide',
    excerpt: 'Modernize your HR processes with digital tools and automation.',
    content: 'Explore how to digitize recruitment, onboarding, performance management, and employee development using modern HR technology.',
    category: 'HR',
    status: 'scheduled',
    author: 'HR Director',
    publishDate: '2024-02-01',
    views: 45,
    tags: ['hr', 'digital-transformation', 'automation'],
    comments: 3,
    likes: 12,
    shares: 2
  }
];

const Blog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('posts');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('kanban');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  useEffect(() => {
    // Auth check handled by context
  }, []);

  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handlePostCreate = (newPost: BlogPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
    setIsCreatePostModalOpen(false);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setIsEditModalOpen(true);
  };

  const handleUpdatePost = (updatedPost: BlogPost) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
    setIsEditModalOpen(false);
    setEditingPost(null);
  };

  const handleDeletePost = (id: string) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
  };

  const handlePublishPost = (id: string) => {
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === id ? { ...post, status: 'published' as const, publishDate: new Date().toISOString().split('T')[0] } : post
    ));
  };

  const handleDuplicatePost = (post: BlogPost) => {
    const duplicated: BlogPost = {
      ...post,
      id: Date.now().toString(),
      title: post.title + ' (Copy)',
      status: 'draft',
      publishDate: new Date().toISOString().split('T')[0],
      views: 0,
      comments: 0,
      likes: 0,
      shares: 0
    };
    setPosts(prevPosts => [duplicated, ...prevPosts]);
  };

  const categories = Array.from(new Set(posts.map(post => post.category)));
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || post.status === filterStatus;
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const blogFilters = [
    { label: 'All Posts', value: 'all', count: posts.length },
    { label: 'Published', value: 'published', count: posts.filter(p => p.status === 'published').length },
    { label: 'Draft', value: 'draft', count: posts.filter(p => p.status === 'draft').length },
    { label: 'Scheduled', value: 'scheduled', count: posts.filter(p => p.status === 'scheduled').length }
  ];

  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalComments = posts.reduce((sum, post) => sum + (post.comments || 0), 0);
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);
  const avgEngagement = posts.length > 0 ? Math.round((totalLikes + totalComments) / posts.length) : 0;

  const renderPostsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Title</div>
        <div className="col-span-2">Author</div>
        <div className="col-span-1">Category</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Views</div>
        <div className="col-span-1">Engagement</div>
        <div className="col-span-1">Date</div>
        <div className="col-span-2">Actions</div>
      </div>
      
      {filteredPosts.map(post => (
        <div key={post.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <p className="font-medium text-sm">{post.title}</p>
            <p className="text-xs text-gray-600 mt-1">{post.excerpt}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{post.author}</p>
          </div>
          <div className="col-span-1">
            <Badge variant="outline">{post.category}</Badge>
          </div>
          <div className="col-span-1">
            <Badge variant={post.status === 'published' ? 'default' : post.status === 'draft' ? 'secondary' : 'outline'}>
              {post.status}
            </Badge>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span className="text-sm">{post.views}</span>
            </div>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{(post.likes || 0) + (post.comments || 0)}</p>
          </div>
          <div className="col-span-1">
            <p className="text-sm">{post.publishDate}</p>
          </div>
          <div className="col-span-2">
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" onClick={() => handleEditPost(post)}>
                <Edit className="h-3 w-3" />
              </Button>
              {post.status === 'draft' && (
                <Button variant="outline" size="sm" onClick={() => handlePublishPost(post.id)}>
                  Publish
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white z-50">
                  <DropdownMenuItem onClick={() => handleDuplicatePost(post)}>
                    <Share className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeletePost(post.id)} className="text-red-600">
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Blog">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'posts' ? 'Blog Posts' : activeTab === 'analytics' ? 'Analytics' : 'Categories'}
          subtitle={
            activeTab === 'posts' ? 'Create and manage your blog content' :
            activeTab === 'analytics' ? 'Track your blog performance' :
            'Organize your content categories'
          }
          searchPlaceholder="Search posts..."
          onSearch={setSearchTerm}
          onCreateNew={() => setIsCreatePostModalOpen(true)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={blogFilters}
          selectedFilter={filterStatus}
          onFilterChange={setFilterStatus}
          recordCount={filteredPosts.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="posts" className="flex-1 flex flex-col">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{totalViews.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{posts.length}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{totalComments}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{avgEngagement}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Filter */}
            <div className="p-6 bg-white border-b">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Category:</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 p-6">
              {viewType === 'list' ? renderPostsList() : (
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
              )}
              
              {filteredPosts.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No posts found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Popular Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map(post => (
                      <div key={post.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{post.title}</p>
                          <p className="text-xs text-gray-600">{post.author}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{post.views}</p>
                          <p className="text-xs text-gray-600">views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map(category => {
                      const categoryPosts = posts.filter(p => p.category === category);
                      const categoryViews = categoryPosts.reduce((sum, p) => sum + (p.views || 0), 0);
                      return (
                        <div key={category} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-sm">{category}</p>
                            <p className="text-xs text-gray-600">{categoryPosts.length} posts</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{categoryViews}</p>
                            <p className="text-xs text-gray-600">total views</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Engagement Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Comments per Post</span>
                      <span className="font-medium">{(totalComments / posts.length).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Likes per Post</span>
                      <span className="font-medium">{(totalLikes / posts.length).toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Engagement Rate</span>
                      <span className="font-medium">{((totalLikes + totalComments) / totalViews * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Shares</span>
                      <span className="font-medium">{posts.reduce((sum, p) => sum + (p.shares || 0), 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {posts.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()).slice(0, 6).map(post => (
                      <div key={post.id} className="border-l-2 border-blue-200 pl-4">
                        <p className="font-medium text-sm">{post.title}</p>
                        <p className="text-xs text-gray-600">{post.publishDate} • {post.views} views</p>
                        <div className="flex space-x-4 text-xs text-gray-500 mt-1">
                          <span>{post.likes} likes</span>
                          <span>{post.comments} comments</span>
                          <span>{post.shares} shares</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Calendar</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">Upcoming Posts</div>
                    {posts.filter(p => p.status === 'scheduled').map(post => (
                      <div key={post.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{post.title}</p>
                          <p className="text-xs text-gray-600">by {post.author}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{post.publishDate}</p>
                          <Badge variant="outline" className="text-xs">Scheduled</Badge>
                        </div>
                      </div>
                    ))}
                    {posts.filter(p => p.status === 'draft').slice(0, 3).map(post => (
                      <div key={post.id} className="flex justify-between items-center p-2 bg-yellow-50 rounded">
                        <div>
                          <p className="font-medium text-sm">{post.title}</p>
                          <p className="text-xs text-gray-600">by {post.author}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">Draft</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => {
                const categoryPosts = posts.filter(p => p.category === category);
                const publishedPosts = categoryPosts.filter(p => p.status === 'published');
                const totalViews = categoryPosts.reduce((sum, p) => sum + (p.views || 0), 0);
                const avgViews = categoryPosts.length > 0 ? totalViews / categoryPosts.length : 0;
                
                return (
                  <Card key={category}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{category}</CardTitle>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>Edit Category</DropdownMenuItem>
                            <DropdownMenuItem>Manage Tags</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Total Posts:</span>
                            <p className="font-medium">{categoryPosts.length}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Published:</span>
                            <p className="font-medium">{publishedPosts.length}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Views:</span>
                            <p className="font-medium">{totalViews.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Avg Views:</span>
                            <p className="font-medium">{avgViews.toFixed(0)}</p>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t">
                          <p className="text-sm text-gray-600 mb-2">Recent Posts:</p>
                          <div className="space-y-1">
                            {categoryPosts.slice(0, 3).map(post => (
                              <div key={post.id} className="text-xs">
                                <span className="font-medium">{post.title.substring(0, 40)}...</span>
                                <span className="text-gray-500 ml-2">{post.views} views</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            View All
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            Create Post
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-full p-6">
                  <Plus className="h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-4">Create New Category</p>
                  <Button variant="outline" size="sm">
                    Add Category
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateBlogPostForm
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        onPostCreate={handlePostCreate}
      />
    </OdooMainLayout>
  );
};

export default Blog;
