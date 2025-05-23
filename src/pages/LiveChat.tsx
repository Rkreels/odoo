import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { MessageCircle, Plus, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChatSession } from '@/types/livechat';
import ChatSessionCard from '@/components/livechat/ChatSessionCard';
import LiveChatWindow from '@/components/livechat/LiveChatWindow';
import VoiceTrainer from '@/components/voice/VoiceTrainer';
import { toast } from "@/components/ui/use-toast";

const LiveChat = () => {
  const navigate = useNavigate();
  const [showVoiceTrainer, setShowVoiceTrainer] = useState(false);
  const [activeSessions, setActiveSessions] = useState<ChatSession[]>([
    {
      id: '1',
      visitor: {
        name: 'John Smith',
        email: 'john@example.com',
        location: 'New York, USA',
      },
      status: 'active',
      startedAt: '10:30 AM',
      duration: '15 min',
      messages: 8,
      assignedTo: 'Support Agent',
    },
    {
      id: '2',
      visitor: {
        name: 'Alice Brown',
        email: 'alice@example.com',
        location: 'London, UK',
      },
      status: 'waiting',
      startedAt: '10:45 AM',
      duration: '2 min',
      messages: 1,
    },
    {
      id: '3',
      visitor: {
        name: 'Robert Johnson',
        location: 'Toronto, Canada',
      },
      status: 'active',
      startedAt: '10:15 AM',
      duration: '30 min',
      messages: 15,
      assignedTo: 'Sales Rep',
    },
  ]);
  
  const [closedSessions, setClosedSessions] = useState<ChatSession[]>([
    {
      id: '4',
      visitor: {
        name: 'Emily Wilson',
        email: 'emily@example.com',
      },
      status: 'closed',
      startedAt: '09:30 AM',
      duration: '22 min',
      messages: 12,
      assignedTo: 'Support Agent',
      rating: 5,
    },
    {
      id: '5',
      visitor: {
        name: 'David Clark',
      },
      status: 'closed',
      startedAt: '09:15 AM',
      duration: '8 min',
      messages: 4,
      assignedTo: 'Sales Rep',
      rating: 3,
    },
  ]);
  
  const [currentChat, setCurrentChat] = useState<ChatSession | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleJoinChat = (session: ChatSession) => {
    if (session.status === 'waiting') {
      const updatedSession: ChatSession = { 
        ...session, 
        status: 'active', 
        assignedTo: 'Current User' 
      };
      
      setActiveSessions(sessions => 
        sessions.map(s => s.id === session.id ? updatedSession : s)
      );
      
      setCurrentChat(updatedSession);
      
      toast({
        title: "Chat accepted",
        description: `You are now chatting with ${session.visitor.name}.`,
      });
    } else {
      setCurrentChat(session);
    }
  };
  
  const handleCloseChat = (id: string) => {
    const session = activeSessions.find(s => s.id === id);
    if (session) {
      const closedSession: ChatSession = {
        ...session,
        status: 'closed',
      };
      
      setActiveSessions(sessions => sessions.filter(s => s.id !== id));
      setClosedSessions(prev => [closedSession, ...prev]);
      
      if (currentChat && currentChat.id === id) {
        setCurrentChat(null);
      }
      
      toast({
        title: "Chat closed",
        description: `Chat with ${session.visitor.name} has been closed.`,
      });
    }
  };
  
  const handleSendMessage = (sessionId: string, message: string) => {
    console.log(`Message sent to ${sessionId}: ${message}`);
    // In a real app, this would send the message to the backend
  };

  return (
    <TopbarDashboardLayout currentApp="Live Chat">
      <div className="p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <MessageCircle className="h-8 w-8 text-odoo-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-odoo-dark">Live Chat</h1>
                <p className="text-odoo-gray">
                  Connect with your website visitors in real-time and provide instant support.
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
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
              <Button className="bg-odoo-primary hover:bg-odoo-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Configure Chat Widget
              </Button>
            </div>
          </div>
          
          {/* Status overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Active Chats</p>
              <p className="text-2xl font-semibold">{activeSessions.filter(s => s.status === 'active').length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Waiting</p>
              <p className="text-2xl font-semibold text-red-500">{activeSessions.filter(s => s.status === 'waiting').length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Average Response Time</p>
              <p className="text-2xl font-semibold">2m 30s</p>
            </div>
          </div>
          
          <Tabs defaultValue="active">
            <TabsList>
              <TabsTrigger value="active">Active Chats</TabsTrigger>
              <TabsTrigger value="history">Chat History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              <div className="space-y-4 mt-4">
                {activeSessions.length > 0 ? (
                  activeSessions.map(session => (
                    <ChatSessionCard 
                      key={session.id} 
                      session={session} 
                      onJoin={handleJoinChat}
                      onClose={handleCloseChat}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No active chat sessions</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <div className="space-y-4 mt-4">
                {closedSessions.map(session => (
                  <ChatSessionCard 
                    key={session.id} 
                    session={session} 
                    onJoin={handleJoinChat}
                    onClose={handleCloseChat}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {currentChat && (
        <LiveChatWindow 
          session={currentChat}
          onClose={() => setCurrentChat(null)}
          onSendMessage={handleSendMessage}
        />
      )}
      
      {/* Voice Trainer */}
      {showVoiceTrainer && (
        <VoiceTrainer 
          isOpen={showVoiceTrainer} 
          onClose={() => setShowVoiceTrainer(false)} 
          currentScreen="livechat"
        />
      )}
    </TopbarDashboardLayout>
  );
};

export default LiveChat;
