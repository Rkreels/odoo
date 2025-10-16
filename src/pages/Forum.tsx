import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { MessagesSquare, Plus, Filter, Search, Eye, MessageCircle, TrendingUp, Users, Star, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ForumTopic, ForumCategory } from '@/types/forum';
import TopicCard from '@/components/forum/TopicCard';
import CreateTopicForm from '@/components/forum/CreateTopicForm';
import VoiceTrainer from '@/components/voice/VoiceTrainer';
import { toast } from "@/components/ui/use-toast";

const Forum = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const [activeTab, setActiveTab] = useState('topics');
  const [viewType, setViewType] = useState<'list' | 'kanban'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [topics, setTopics] = useState<ForumTopic[]>([
    {
      id: '1',
      title: 'Advanced Database Optimization Techniques',
      description: 'Deep dive into PostgreSQL optimization for large-scale Odoo deployments. Covering indexing strategies, query optimization, and performance monitoring.',
      author: 'TechGuru',
      createdAt: '2025-01-15',
      replies: 24,
      views: 1567,
      category: 'Technical',
      status: 'active',
      lastReply: {
        author: 'DatabasePro',
        date: '2025-01-20',
      },
      tags: ['database', 'performance', 'postgresql'],
      votes: 45,
      solved: false,
      pinned: true
    },
    {
      id: '2',
      title: 'Complete Odoo Implementation Guide for SMEs',
      description: 'Step-by-step guide for implementing Odoo in small to medium enterprises. Covers module selection, data migration, and change management.',
      author: 'ProjectManager',
      createdAt: '2025-01-10',
      replies: 18,
      views: 2341,
      category: 'Implementation',
      status: 'active',
      lastReply: {
        author: 'ConsultantExpert',
        date: '2025-01-19',
      },
      tags: ['implementation', 'sme', 'guide'],
      votes: 67,
      solved: true,
      pinned: false
    },
    {
      id: '3',
      title: 'New Reporting Dashboard Features',
      description: 'Discussion about upcoming improvements to the reporting module, including interactive dashboards and real-time analytics.',
      author: 'ReportFan',
      createdAt: '2025-01-05',
      replies: 31,
      views: 980,
      category: 'Feature Requests',
      status: 'locked',
      lastReply: {
        author: 'ModeratorJane',
        date: '2025-01-18',
      },
      tags: ['reporting', 'dashboard', 'analytics'],
      votes: 89,
      solved: false,
      pinned: false
    },
    {
      id: '4',
      title: 'Multi-Company Setup Best Practices',
      description: 'How to properly configure Odoo for multi-company environments with shared data and separate accounting.',
      author: 'SystemArchitect',
      createdAt: '2025-01-08',
      replies: 15,
      views: 756,
      category: 'Configuration',
      status: 'active',
      lastReply: {
        author: 'ConfigExpert',
        date: '2025-01-17',
      },
      tags: ['multi-company', 'configuration', 'accounting'],
      votes: 34,
      solved: true,
      pinned: false
    },
    {
      id: '5',
      title: 'API Integration Troubleshooting',
      description: 'Common issues when integrating third-party systems with Odoo API and their solutions.',
      author: 'DevIntegrator',
      createdAt: '2025-01-12',
      replies: 9,
      views: 432,
      category: 'Development',
      status: 'active',
      lastReply: {
        author: 'APIDeveloper',
        date: '2025-01-16',
      },
      tags: ['api', 'integration', 'troubleshooting'],
      votes: 23,
      solved: false,
      pinned: false
    },
    {
      id: '6',
      title: 'Custom Module Development Workshop',
      description: 'Announcement for upcoming workshop on creating custom Odoo modules. Registration details and curriculum included.',
      author: 'TrainingCoordinator',
      createdAt: '2025-01-14',
      replies: 42,
      views: 1890,
      category: 'Events',
      status: 'active',
      lastReply: {
        author: 'EagerLearner',
        date: '2025-01-21',
      },
      tags: ['workshop', 'development', 'training'],
      votes: 156,
      solved: false,
      pinned: true
    }
  ]);
  
  const [categories, setCategories] = useState<ForumCategory[]>([
    { id: '1', name: 'Technical', description: 'Technical discussions and questions', topicCount: 89 },
    { id: '2', name: 'Implementation', description: 'Implementation tips and advice', topicCount: 34 },
    { id: '3', name: 'Feature Requests', description: 'Suggest new features', topicCount: 27 },
    { id: '4', name: 'Configuration', description: 'System configuration and setup', topicCount: 45 },
    { id: '5', name: 'Development', description: 'Module development and customization', topicCount: 67 },
    { id: '6', name: 'Events', description: 'Community events and announcements', topicCount: 23 },
    { id: '7', name: 'Troubleshooting', description: 'Problem solving and debugging', topicCount: 78 },
    { id: '8', name: 'General', description: 'General discussions', topicCount: 156 }
  ]);

  useEffect(() => {
    // Auth check handled by context
  }, []);
  
  const handleCreateTopic = (newTopic: ForumTopic) => {
    setTopics([newTopic, ...topics]);
    setShowCreateForm(false);
  };
  
  const handleViewTopic = (topic: ForumTopic) => {
    setSelectedTopic(topic);
  };

  const handleDeleteTopic = (id: string) => {
    setTopics(topics.filter(t => t.id !== id));
  };

  const handleEditTopic = (topic: ForumTopic) => {
    setSelectedTopic(topic);
    setShowCreateForm(true);
  };

  const handleTogglePin = (id: string) => {
    setTopics(topics.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
  };

  const handleToggleSolved = (id: string) => {
    setTopics(topics.map(t => t.id === id ? { ...t, solved: !t.solved } : t));
  };

  const handleLockTopic = (id: string) => {
    setTopics(topics.map(t => t.id === id ? { ...t, status: t.status === 'locked' ? 'active' : 'locked' } : t));
  };

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || topic.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || topic.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const topicFilters = [
    { label: 'All Topics', value: 'all', count: topics.length },
    { label: 'Active', value: 'active', count: topics.filter(t => t.status === 'active').length },
    { label: 'Solved', value: 'solved', count: topics.filter(t => t.solved).length },
    { label: 'Locked', value: 'locked', count: topics.filter(t => t.status === 'locked').length },
    { label: 'Pinned', value: 'pinned', count: topics.filter(t => t.pinned).length }
  ];

  const totalTopics = topics.length;
  const totalReplies = topics.reduce((sum, topic) => sum + topic.replies, 0);
  const totalViews = topics.reduce((sum, topic) => sum + topic.views, 0);
  const solvedTopics = topics.filter(t => t.solved).length;

  const renderTopicsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-4">Topic</div>
        <div className="col-span-2">Author</div>
        <div className="col-span-1">Category</div>
        <div className="col-span-1">Replies</div>
        <div className="col-span-1">Views</div>
        <div className="col-span-1">Votes</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredTopics.map(topic => (
        <div key={topic.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-4">
            <div className="flex items-start space-x-2">
              {topic.pinned && <Star className="h-4 w-4 text-yellow-500 mt-0.5" />}
              {topic.solved && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />}
              <div>
                <p className="font-medium text-sm">{topic.title}</p>
                <p className="text-xs text-gray-600 mt-1">{topic.description.substring(0, 100)}...</p>
                {topic.tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {topic.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <p className="text-sm">{topic.author}</p>
            <p className="text-xs text-gray-600">{topic.createdAt}</p>
          </div>
          <div className="col-span-1">
            <Badge variant="outline">{topic.category}</Badge>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-3 w-3" />
              <span className="text-sm">{topic.replies}</span>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span className="text-sm">{topic.views}</span>
            </div>
          </div>
          <div className="col-span-1">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span className="text-sm">{topic.votes || 0}</span>
            </div>
          </div>
          <div className="col-span-1">
            <Badge variant={
              topic.status === 'active' ? 'default' : 
              topic.status === 'locked' ? 'destructive' : 'secondary'
            }>
              {topic.status}
            </Badge>
          </div>
          <div className="col-span-1">
            <Button variant="outline" size="sm" onClick={() => handleViewTopic(topic)}>
              View
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Forum">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title={activeTab === 'topics' ? 'Discussion Topics' : activeTab === 'categories' ? 'Categories' : 'Moderation'}
          subtitle={
            activeTab === 'topics' ? 'Community discussions and knowledge sharing' :
            activeTab === 'categories' ? 'Organize topics by category' :
            'Forum moderation and management'
          }
          searchPlaceholder="Search topics..."
          onSearch={setSearchTerm}
          onCreateNew={() => setShowCreateForm(true)}
          viewType={viewType}
          onViewChange={(view) => setViewType(view as any)}
          filters={topicFilters}
          selectedFilter={filterStatus}
          onFilterChange={setFilterStatus}
          recordCount={filteredTopics.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-lg grid-cols-3">
              <TabsTrigger value="topics">Topics</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="topics" className="flex-1 flex flex-col">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <MessagesSquare className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{totalTopics}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Replies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{totalReplies}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl font-bold">{totalViews.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Solved Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{solvedTopics}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="p-6 bg-white border-b">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium">Category:</label>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex-1 p-6">
              {viewType === 'list' ? renderTopicsList() : (
                <div className="space-y-4">
                  {filteredTopics.map(topic => (
                    <TopicCard 
                      key={topic.id} 
                      topic={topic} 
                      onView={handleViewTopic} 
                    />
                  ))}
                </div>
              )}
              
              {filteredTopics.length === 0 && (
                <div className="text-center py-8">
                  <MessagesSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No topics found matching your criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map(category => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Topics:</span>
                        <span className="font-medium">{category.topicCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Recent Activity:</span>
                        <span className="font-medium">2 hours ago</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm">Edit</Button>
                      <Button variant="outline" size="sm">View Topics</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="moderation" className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Moderation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Flagged Topics</span>
                      <Badge variant="destructive">3</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Spam Reports</span>
                      <Badge variant="destructive">1</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">User Reports</span>
                      <Badge variant="destructive">2</Badge>
                    </div>
                    <Button className="w-full mt-4">Review All</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Forum Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Active Users:</span>
                      <span className="font-medium">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Daily Posts:</span>
                      <span className="font-medium">34</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Resolution Rate:</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Response Time:</span>
                      <span className="font-medium">2.4 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Topic Detail Modal */}
      {selectedTopic && (
        <Dialog open={!!selectedTopic} onOpenChange={() => setSelectedTopic(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                {selectedTopic.pinned && <Star className="h-5 w-5 text-yellow-500" />}
                {selectedTopic.solved && <CheckCircle className="h-5 w-5 text-green-500" />}
                <span>{selectedTopic.title}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Badge variant="outline">{selectedTopic.category}</Badge>
                  <span className="text-sm text-gray-600">by {selectedTopic.author}</span>
                  <span className="text-sm text-gray-600">{selectedTopic.createdAt}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{selectedTopic.views}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm">{selectedTopic.replies}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-sm">{selectedTopic.votes || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="prose max-w-none">
                <p>{selectedTopic.description}</p>
              </div>
              
              {selectedTopic.tags && (
                <div className="flex flex-wrap gap-2">
                  {selectedTopic.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              )}
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Replies ({selectedTopic.replies})</h4>
                <div className="space-y-4">
                  {selectedTopic.lastReply && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{selectedTopic.lastReply.author}</span>
                        <span className="text-sm text-gray-600">{selectedTopic.lastReply.date}</span>
                      </div>
                      <p className="text-sm">This is a sample reply to the topic...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      <CreateTopicForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        categories={categories}
        onTopicCreate={handleCreateTopic}
      />
      
      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen="forum"
        />
      )}
    </OdooMainLayout>
  );
};

export default Forum;
