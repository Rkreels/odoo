
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OdooMainLayout from '@/components/layout/OdooMainLayout';
import OdooControlPanel from '@/components/layout/OdooControlPanel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MessageCircle, 
  Users, 
  Clock, 
  TrendingUp,
  User,
  Send,
  Phone,
  Video,
  Archive
} from 'lucide-react';

interface ChatSession {
  id: string;
  visitor: string;
  agent: string;
  status: 'active' | 'waiting' | 'closed' | 'transferred';
  startTime: string;
  duration: number;
  messages: number;
  rating: number | null;
  channel: 'website' | 'mobile' | 'social';
  department: string;
  lastMessage: string;
  priority: 'low' | 'medium' | 'high';
}

interface ChatMessage {
  id: string;
  sessionId: string;
  sender: 'visitor' | 'agent';
  message: string;
  timestamp: string;
  type: 'text' | 'file' | 'image';
}

const LiveChat = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('sessions');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [sessions] = useState<ChatSession[]>([
    {
      id: '1',
      visitor: 'John Doe',
      agent: 'Sarah Agent',
      status: 'active',
      startTime: '2024-06-11T14:30:00',
      duration: 15,
      messages: 12,
      rating: null,
      channel: 'website',
      department: 'Sales',
      lastMessage: 'Can you tell me more about your pricing?',
      priority: 'high'
    },
    {
      id: '2',
      visitor: 'Alice Smith',
      agent: 'Mike Support',
      status: 'waiting',
      startTime: '2024-06-11T14:45:00',
      duration: 3,
      messages: 2,
      rating: null,
      channel: 'mobile',
      department: 'Support',
      lastMessage: 'I need help with my order',
      priority: 'medium'
    },
    {
      id: '3',
      visitor: 'Bob Wilson',
      agent: 'Sarah Agent',
      status: 'closed',
      startTime: '2024-06-11T13:15:00',
      duration: 25,
      messages: 18,
      rating: 5,
      channel: 'website',
      department: 'Sales',
      lastMessage: 'Thank you for your help!',
      priority: 'low'
    }
  ]);

  const [messages] = useState<ChatMessage[]>([
    {
      id: '1',
      sessionId: '1',
      sender: 'visitor',
      message: 'Hi, I\'m interested in your products',
      timestamp: '2024-06-11T14:30:00',
      type: 'text'
    },
    {
      id: '2',
      sessionId: '1',
      sender: 'agent',
      message: 'Hello! I\'d be happy to help you. What specific products are you looking for?',
      timestamp: '2024-06-11T14:31:00',
      type: 'text'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const sessionFilters = [
    { label: 'Active', value: 'active', count: sessions.filter(s => s.status === 'active').length },
    { label: 'Waiting', value: 'waiting', count: sessions.filter(s => s.status === 'waiting').length },
    { label: 'Closed', value: 'closed', count: sessions.filter(s => s.status === 'closed').length }
  ];

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.visitor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || session.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const activeSessions = sessions.filter(s => s.status === 'active').length;
  const waitingSessions = sessions.filter(s => s.status === 'waiting').length;
  const avgResponseTime = 45; // seconds
  const satisfactionScore = 4.2;

  const renderSessionsList = () => (
    <div className="bg-white rounded-lg border">
      <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium text-sm">
        <div className="col-span-3">Visitor</div>
        <div className="col-span-2">Agent</div>
        <div className="col-span-2">Status</div>
        <div className="col-span-2">Duration</div>
        <div className="col-span-2">Channel</div>
        <div className="col-span-1">Actions</div>
      </div>
      
      {filteredSessions.map(session => (
        <div key={session.id} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
          <div className="col-span-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{session.visitor}</p>
                <p className="text-sm text-gray-500">{session.department}</p>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <span className="text-sm">{session.agent}</span>
          </div>
          <div className="col-span-2">
            <div className="flex items-center space-x-2">
              <Badge 
                variant={
                  session.status === 'active' ? 'default' : 
                  session.status === 'waiting' ? 'destructive' : 
                  'secondary'
                }
              >
                {session.status}
              </Badge>
              {session.priority === 'high' && (
                <div className="w-2 h-2 bg-red-500 rounded-full" />
              )}
            </div>
          </div>
          <div className="col-span-2">
            <div>
              <p className="font-medium">{session.duration} min</p>
              <p className="text-sm text-gray-500">{session.messages} messages</p>
            </div>
          </div>
          <div className="col-span-2">
            <Badge variant="outline">
              {session.channel}
            </Badge>
          </div>
          <div className="col-span-1">
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm">
                <MessageCircle className="h-4 w-4" />
              </Button>
              {session.status === 'active' && (
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <OdooMainLayout currentApp="Live Chat">
      <div className="flex flex-col h-full">
        <OdooControlPanel
          title="Live Chat"
          subtitle="Real-time customer support and engagement"
          searchPlaceholder="Search conversations..."
          onSearch={setSearchTerm}
          filters={sessionFilters}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          recordCount={filteredSessions.length}
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <div className="border-b bg-white px-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="sessions">Sessions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="sessions" className="flex-1 flex flex-col">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-white border-b">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Active Chats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold">{activeSessions}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Waiting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="text-2xl font-bold">{waitingSessions}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Avg. Response</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl font-bold">{avgResponseTime}s</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">⭐</span>
                    <span className="text-2xl font-bold">{satisfactionScore}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex-1 p-6">
              {renderSessionsList()}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chat Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Today</span>
                      <span className="font-medium">45 chats</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Week</span>
                      <span className="font-medium">298 chats</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="font-medium">1,247 chats</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Agent Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sarah Agent</span>
                      <span className="font-medium">4.8 ⭐</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mike Support</span>
                      <span className="font-medium">4.5 ⭐</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Lisa Help</span>
                      <span className="font-medium">4.7 ⭐</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="flex-1 p-6">
            <div className="max-w-2xl space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chat Widget Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Widget Title</label>
                    <input className="w-full mt-1 p-2 border rounded-md" defaultValue="Chat with us!" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Welcome Message</label>
                    <textarea className="w-full mt-1 p-2 border rounded-md" rows={3} defaultValue="Hi! How can we help you today?" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Primary Color</label>
                    <input type="color" className="w-20 mt-1 p-1 border rounded-md" defaultValue="#7C3AED" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Business Hours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Timezone</label>
                    <select className="w-full mt-1 p-2 border rounded-md">
                      <option>UTC-5 (Eastern Time)</option>
                      <option>UTC-8 (Pacific Time)</option>
                      <option>UTC+0 (Greenwich Mean Time)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Start Time</label>
                      <input type="time" className="w-full mt-1 p-2 border rounded-md" defaultValue="09:00" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">End Time</label>
                      <input type="time" className="w-full mt-1 p-2 border rounded-md" defaultValue="17:00" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </OdooMainLayout>
  );
};

export default LiveChat;
