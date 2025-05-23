
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TopbarDashboardLayout from '@/components/layout/TopbarDashboardLayout';
import { MessageSquareText } from 'lucide-react';
import ChannelList from '@/components/discuss/ChannelList';
import ChatArea from '@/components/discuss/ChatArea';
import { Channel, Message } from '@/types/discuss';

const initialChannels: Channel[] = [
  {
    id: '1',
    name: 'general',
    description: 'General discussion',
    type: 'public',
    members: ['user1', 'user2', 'user3'],
    unreadCount: 3,
  },
  {
    id: '2',
    name: 'marketing',
    description: 'Marketing team discussions',
    type: 'public',
    members: ['user1', 'user2'],
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'sales-team',
    description: 'Sales team private channel',
    type: 'private',
    members: ['user1', 'user3'],
    unreadCount: 1,
  },
];

const initialMessages: Message[] = [
  {
    id: '1',
    channelId: '1',
    sender: 'John Doe',
    content: 'Welcome everyone to the general channel!',
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    channelId: '1',
    sender: 'Sarah Smith',
    content: 'Thanks John! Looking forward to collaborating.',
    timestamp: '10:32 AM',
  },
  {
    id: '3',
    channelId: '1',
    sender: 'Mike Wilson',
    content: 'Great to be here. Should we schedule a team meeting?',
    timestamp: '10:35 AM',
  },
];

const Discuss = () => {
  const navigate = useNavigate();
  const [channels, setChannels] = useState<Channel[]>(initialChannels);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [activeChannelId, setActiveChannelId] = useState('1');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate]);

  const activeChannel = channels.find(channel => channel.id === activeChannelId);
  const channelMessages = messages.filter(message => message.channelId === activeChannelId);

  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      channelId: activeChannelId,
      sender: 'Current User',
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleCreateChannel = () => {
    console.log('Create new channel');
    // Future: Implement channel creation
  };

  return (
    <TopbarDashboardLayout currentApp="Discuss">
      <div className="h-full flex">
        <ChannelList
          channels={channels}
          activeChannelId={activeChannelId}
          onChannelSelect={setActiveChannelId}
          onCreateChannel={handleCreateChannel}
        />
        {activeChannel ? (
          <ChatArea
            channel={activeChannel}
            messages={channelMessages}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquareText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Select a channel to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </TopbarDashboardLayout>
  );
};

export default Discuss;
