import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { MessagesSquare, Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ForumTopic, ForumCategory } from '@/types/forum';
import TopicCard from '@/components/forum/TopicCard';
import CreateTopicForm from '@/components/forum/CreateTopicForm';
import VoiceTrainer from '@/components/voice/VoiceTrainer';
import { toast } from "@/components/ui/use-toast";

const Forum = () => {
  const navigate = useNavigate();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const [topics, setTopics] = useState<ForumTopic[]>([
    {
      id: '1',
      title: 'How to optimize database performance?',
      description: 'Looking for tips on improving query performance in large datasets.',
      author: 'TechGuru',
      createdAt: '2025-05-15',
      replies: 12,
      views: 89,
      category: 'Technical',
      status: 'active',
      lastReply: {
        author: 'DatabasePro',
        date: '2025-05-20',
      },
    },
    {
      id: '2',
      title: 'Best practices for Odoo implementation',
      description: 'Share your experience and best practices when implementing Odoo for mid-size companies.',
      author: 'ProjectManager',
      createdAt: '2025-05-10',
      replies: 8,
      views: 56,
      category: 'Implementation',
      status: 'active',
    },
    {
      id: '3',
      title: 'Feature request: Better reporting tools',
      description: 'Suggesting improvements to the reporting module to make it more user-friendly.',
      author: 'ReportFan',
      createdAt: '2025-05-05',
      replies: 15,
      views: 120,
      category: 'Feature Requests',
      status: 'locked',
      lastReply: {
        author: 'ModeratorJane',
        date: '2025-05-18',
      },
    },
  ]);
  
  const [categories, setCategories] = useState<ForumCategory[]>([
    { id: '1', name: 'Technical', description: 'Technical discussions and questions', topicCount: 45 },
    { id: '2', name: 'Implementation', description: 'Implementation tips and advice', topicCount: 23 },
    { id: '3', name: 'Feature Requests', description: 'Suggest new features', topicCount: 37 },
    { id: '4', name: 'General', description: 'General discussions', topicCount: 56 },
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleCreateTopic = (newTopic: ForumTopic) => {
    setTopics([newTopic, ...topics]);
    toast({
      title: "Topic created",
      description: "Your discussion topic has been successfully created.",
    });
  };
  
  const handleViewTopic = (topic: ForumTopic) => {
    toast({
      title: "Viewing topic",
      description: `You are viewing: ${topic.title}`,
    });
  };

  return (
    <TopbarDashboardLayout currentApp="Forum">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <MessagesSquare className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Community Forum</h1>
                <p className="text-odoo-gray">
                  Build and engage with your community. Manage discussions, categories, and user interactions.
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline"
                onClick={() => setShowVoiceTrainer(!showVoiceTrainer)}
                className="border-odoo-primary text-odoo-primary hover:bg-odoo-primary hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                Voice Guide
              </Button>
              <Button 
                className="bg-odoo-primary text-white hover:bg-odoo-primary/90"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Topic
              </Button>
            </div>
          </div>
          
          {/* Quick filters and search */}
          <div className="flex items-center mb-6 space-x-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="Search topics..."
                className="w-full pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
          
          {/* Categories summary */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => (
              <div key={category.id} className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-odoo-dark">{category.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{category.description}</p>
                <span className="text-xs font-medium text-odoo-primary">{category.topicCount} topics</span>
              </div>
            ))}
          </div>

          {/* Topics list */}
          <h2 className="text-xl font-semibold text-odoo-dark mb-4">Recent Topics</h2>
          <div className="space-y-4">
            {topics.map(topic => (
              <TopicCard 
                key={topic.id} 
                topic={topic} 
                onView={handleViewTopic} 
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Create Topic Form */}
      <CreateTopicForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        categories={categories}
        onTopicCreate={handleCreateTopic}
      />
      
      {/* Voice Trainer */}
      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen="forum"
        />
      )}
    </TopbarDashboardLayout>
  );
};

export default Forum;
